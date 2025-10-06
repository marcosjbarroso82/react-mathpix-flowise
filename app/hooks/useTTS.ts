import { useEffect, useCallback, useRef } from 'react';
import { ttsManager } from '../services/ttsManager';
import { MultiOCRWorkflowService } from '../services/multiOCRWorkflowService';
import { MathpixService } from '../services/mathpixService';

interface UseTTSProps {
  enabled: boolean;
  responseAgentsResults: { [agentId: string]: any };
  directAgentsResults?: { [agentId: string]: any };
  agents: Array<{ id: string; name: string }>;
  isRunning?: boolean; // Para detectar cuando inicia un nuevo workflow
  images?: Array<{ id: string; status: string; ocrResult?: any }>; // Para detectar OCR completado
}

interface UseTTSReturn {
  speakAgentResult: (agentId: string, agentResult: any) => void;
  speakConfidenceInfo: (ocrResults: any[]) => void;
  stopTTS: () => void;
  pauseTTS: () => void;
  resumeTTS: () => void;
  clearTTSQueue: () => void;
  getTTSStatus: () => {
    isEnabled: boolean;
    isPlaying: boolean;
    queueLength: number;
    currentItem: any;
  };
}

/**
 * Función helper para crear texto TTS que incluya información de confianza
 */
function createTTSTextWithConfidence(responseText: string, agentResult: any): string {
  // Buscar información de confianza en el resultado del agente
  let confidenceInfo = '';
  
  // Si el resultado contiene información de OCR con confianza
  if (agentResult?.data && typeof agentResult.data === 'string') {
    // Buscar patrones de confianza en el texto compilado
    const confidenceMatch = agentResult.data.match(/Confianza: (\d+%)/g);
    if (confidenceMatch && confidenceMatch.length > 0) {
      const confidences = confidenceMatch.map(match => match.replace('Confianza: ', ''));
      confidenceInfo = ` Confianza promedio del OCR: ${confidences.join(', ')}.`;
    }
  }
  
  return responseText + confidenceInfo;
}

/**
 * Hook para manejar Text-to-Speech en el Multi-OCR Workflow
 * Se encarga de leer automáticamente las respuestas de los agentes cuando terminan
 */
export function useTTS({ enabled, responseAgentsResults, directAgentsResults = {}, agents, isRunning = false, images = [] }: UseTTSProps): UseTTSReturn {
  const previousResultsRef = useRef<{ [agentId: string]: any }>({});
  const processedAgentsRef = useRef<Set<string>>(new Set());
  const processedImagesRef = useRef<Set<string>>(new Set());

  // Configurar el estado del TTS cuando cambia la configuración
  useEffect(() => {
    ttsManager.setEnabled(enabled);
  }, [enabled]);

  // Resetear estados cuando inicia un nuevo workflow
  useEffect(() => {
    if (isRunning) {
      // Limpiar estados de agentes procesados y resultados anteriores
      processedAgentsRef.current.clear();
      processedImagesRef.current.clear();
      previousResultsRef.current = {};
      ttsManager.reset();
      console.log('TTS: Estados reseteados para nuevo workflow');
    }
  }, [isRunning]);

  // Detectar automáticamente cuando hay imágenes con OCR completado y leer confianza
  useEffect(() => {
    if (!enabled) return;

    // Buscar imágenes que han completado OCR pero no han sido procesadas para TTS
    const completedImages = images.filter(img => 
      img.status === 'completed' && 
      img.ocrResult && 
      !processedImagesRef.current.has(img.id)
    );

    if (completedImages.length > 0) {
      console.log(`TTS: Detectadas ${completedImages.length} imágenes con OCR completado`);
      
      // Crear texto TTS para la información de confianza
      const ocrResults = completedImages.map(img => img.ocrResult);
      let confidenceText = '';
      const confidences: string[] = [];

      ocrResults.forEach((ocrResult, index) => {
        if (ocrResult?.data) {
          const confidence = MathpixService.extractConfidence(ocrResult.data);
          if (confidence !== null) {
            const confidenceFormatted = MathpixService.formatConfidence(confidence);
            confidences.push(`Imagen ${index + 1}: ${confidenceFormatted}`);
          }
        }
      });

      if (confidences.length > 0) {
        if (confidences.length === 1) {
          confidenceText = `Confianza OCR:: ${confidences[0]}.`;
        } else {
          confidenceText = `${confidences.length} imágenes. Confianza OCR: ${confidences.join(', ')}.`;
        }
        
        ttsManager.addToQueue({
          text: confidenceText,
          agentName: 'Sistema',
          onStart: () => console.log('TTS: Iniciando lectura automática de información de confianza'),
          onEnd: () => {
            console.log('TTS: Completada lectura automática de información de confianza');
            // Marcar las imágenes como procesadas
            completedImages.forEach(img => processedImagesRef.current.add(img.id));
          },
          onError: (error) => {
            console.error('TTS: Error leyendo información de confianza automáticamente:', error);
            // Marcar las imágenes como procesadas incluso si hay error
            completedImages.forEach(img => processedImagesRef.current.add(img.id));
          }
        });
      } else {
        // Si no hay confianza disponible, marcar como procesadas de todas formas
        completedImages.forEach(img => processedImagesRef.current.add(img.id));
      }
    }
  }, [images, enabled]);

  // Detectar cuando un agente termina de procesar y agregar a la cola TTS
  useEffect(() => {
    if (!enabled) return;

    // Unir resultados de agentes de respuesta y directos
    const combinedResults: { [agentId: string]: any } = {
      ...responseAgentsResults,
      ...directAgentsResults
    };

    Object.entries(combinedResults).forEach(([agentId, agentResult]) => {
      // Solo procesar si es un resultado nuevo y no hay error
      const previousResult = previousResultsRef.current[agentId];
      const isNewResult = !previousResult || 
        JSON.stringify(previousResult) !== JSON.stringify(agentResult);
      
      const hasError = agentResult?.error;
      const isNotProcessed = !processedAgentsRef.current.has(agentId);

      if (isNewResult && !hasError && isNotProcessed) {
        const agent = agents.find(a => a.id === agentId);
        const agentName = agent ? agent.name : `Agente ${agentId}`;
        
        // Extraer el texto de la respuesta
        const responseText = MultiOCRWorkflowService.formatAgentResult(agentResult);
        
        if (responseText && responseText !== 'Sin resultado') {
          console.log(`TTS: Agregando resultado de ${agentName} a la cola`);
          
          // Crear texto TTS que incluya información de confianza si está disponible
          const ttsText = createTTSTextWithConfidence(responseText, agentResult);
          
          ttsManager.addToQueue({
            text: ttsText,
            agentName,
            onStart: () => {
              console.log(`TTS: Iniciando lectura de ${agentName}`);
            },
            onEnd: () => {
              console.log(`TTS: Completada lectura de ${agentName}`);
              processedAgentsRef.current.add(agentId);
            },
            onError: (error) => {
              console.error(`TTS: Error leyendo ${agentName}:`, error);
              processedAgentsRef.current.add(agentId);
            }
          });
        }
      }
    });

    // Actualizar referencia de resultados anteriores con el combinado
    previousResultsRef.current = { ...combinedResults };
  }, [responseAgentsResults, directAgentsResults, agents, enabled]);

  // Limpiar estado cuando se deshabilita TTS
  useEffect(() => {
    if (!enabled) {
      processedAgentsRef.current.clear();
      processedImagesRef.current.clear();
      previousResultsRef.current = {};
      ttsManager.reset();
    }
  }, [enabled]);

  // Resetear estados cuando se limpian los resultados (nuevo workflow)
  useEffect(() => {
    // Si no hay resultados de agentes, resetear estados
    if (Object.keys(responseAgentsResults).length === 0 && Object.keys(directAgentsResults).length === 0) {
      processedAgentsRef.current.clear();
      processedImagesRef.current.clear();
      previousResultsRef.current = {};
    }
  }, [responseAgentsResults, directAgentsResults]);

  // Función para leer manualmente un resultado de agente
  const speakAgentResult = useCallback((agentId: string, agentResult: any) => {
    if (!enabled) return;

    const agent = agents.find(a => a.id === agentId);
    const agentName = agent ? agent.name : `Agente ${agentId}`;
    const responseText = MultiOCRWorkflowService.formatAgentResult(agentResult);
    
    if (responseText && responseText !== 'Sin resultado') {
      // Crear texto TTS que incluya información de confianza si está disponible
      const ttsText = createTTSTextWithConfidence(responseText, agentResult);
      
      ttsManager.addToQueue({
        text: ttsText,
        agentName,
        onStart: () => console.log(`TTS: Lectura manual iniciada - ${agentName}`),
        onEnd: () => console.log(`TTS: Lectura manual completada - ${agentName}`),
        onError: (error) => console.error(`TTS: Error en lectura manual - ${agentName}:`, error)
      });
    }
  }, [enabled, agents]);

  // Función para leer información de confianza de OCR
  const speakConfidenceInfo = useCallback((ocrResults: any[]) => {
    if (!enabled) return;

    let confidenceText = 'Información de confianza del OCR: ';
    const confidences: string[] = [];

    ocrResults.forEach((ocrResult, index) => {
      if (ocrResult?.data) {
        const confidence = MathpixService.extractConfidence(ocrResult.data);
        if (confidence !== null) {
          const confidenceFormatted = MathpixService.formatConfidence(confidence);
          confidences.push(`Imagen ${index + 1}: ${confidenceFormatted}`);
        }
      }
    });

    if (confidences.length > 0) {
      confidenceText += confidences.join(', ') + '.';
      
      ttsManager.addToQueue({
        text: confidenceText,
        agentName: 'Sistema',
        onStart: () => console.log('TTS: Iniciando lectura de información de confianza'),
        onEnd: () => console.log('TTS: Completada lectura de información de confianza'),
        onError: (error) => console.error('TTS: Error leyendo información de confianza:', error)
      });
    }
  }, [enabled]);

  // Función para detener TTS
  const stopTTS = useCallback(() => {
    ttsManager.stop();
    processedAgentsRef.current.clear();
    processedImagesRef.current.clear();
  }, []);

  // Función para pausar TTS
  const pauseTTS = useCallback(() => {
    ttsManager.pause();
  }, []);

  // Función para reanudar TTS
  const resumeTTS = useCallback(() => {
    ttsManager.resume();
  }, []);

  // Función para limpiar cola TTS
  const clearTTSQueue = useCallback(() => {
    ttsManager.clearQueue();
  }, []);

  // Función para obtener estado del TTS
  const getTTSStatus = useCallback(() => {
    return ttsManager.getStatus();
  }, []);

  return {
    speakAgentResult,
    speakConfidenceInfo,
    stopTTS,
    pauseTTS,
    resumeTTS,
    clearTTSQueue,
    getTTSStatus
  };
}
