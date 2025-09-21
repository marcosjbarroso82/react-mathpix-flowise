import { useEffect, useCallback, useRef } from 'react';
import { ttsManager } from '../services/ttsManager';
import { MultiOCRWorkflowService } from '../services/multiOCRWorkflowService';

interface UseTTSProps {
  enabled: boolean;
  responseAgentsResults: { [agentId: string]: any };
  agents: Array<{ id: string; name: string }>;
  isRunning?: boolean; // Para detectar cuando inicia un nuevo workflow
}

interface UseTTSReturn {
  speakAgentResult: (agentId: string, agentResult: any) => void;
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
 * Hook para manejar Text-to-Speech en el Multi-OCR Workflow
 * Se encarga de leer automáticamente las respuestas de los agentes cuando terminan
 */
export function useTTS({ enabled, responseAgentsResults, agents, isRunning = false }: UseTTSProps): UseTTSReturn {
  const previousResultsRef = useRef<{ [agentId: string]: any }>({});
  const processedAgentsRef = useRef<Set<string>>(new Set());

  // Configurar el estado del TTS cuando cambia la configuración
  useEffect(() => {
    ttsManager.setEnabled(enabled);
  }, [enabled]);

  // Resetear estados cuando inicia un nuevo workflow
  useEffect(() => {
    if (isRunning) {
      // Limpiar estados de agentes procesados y resultados anteriores
      processedAgentsRef.current.clear();
      previousResultsRef.current = {};
      ttsManager.reset();
      console.log('TTS: Estados reseteados para nuevo workflow');
    }
  }, [isRunning]);

  // Detectar cuando un agente termina de procesar y agregar a la cola TTS
  useEffect(() => {
    if (!enabled) return;

    Object.entries(responseAgentsResults).forEach(([agentId, agentResult]) => {
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
          
          ttsManager.addToQueue({
            text: responseText,
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

    // Actualizar referencia de resultados anteriores
    previousResultsRef.current = { ...responseAgentsResults };
  }, [responseAgentsResults, agents, enabled]);

  // Limpiar estado cuando se deshabilita TTS
  useEffect(() => {
    if (!enabled) {
      processedAgentsRef.current.clear();
      previousResultsRef.current = {};
      ttsManager.reset();
    }
  }, [enabled]);

  // Resetear estados cuando se limpian los resultados (nuevo workflow)
  useEffect(() => {
    // Si no hay resultados de agentes, resetear estados
    if (Object.keys(responseAgentsResults).length === 0) {
      processedAgentsRef.current.clear();
      previousResultsRef.current = {};
    }
  }, [responseAgentsResults]);

  // Función para leer manualmente un resultado de agente
  const speakAgentResult = useCallback((agentId: string, agentResult: any) => {
    if (!enabled) return;

    const agent = agents.find(a => a.id === agentId);
    const agentName = agent ? agent.name : `Agente ${agentId}`;
    const responseText = MultiOCRWorkflowService.formatAgentResult(agentResult);
    
    if (responseText && responseText !== 'Sin resultado') {
      ttsManager.addToQueue({
        text: responseText,
        agentName,
        onStart: () => console.log(`TTS: Lectura manual iniciada - ${agentName}`),
        onEnd: () => console.log(`TTS: Lectura manual completada - ${agentName}`),
        onError: (error) => console.error(`TTS: Error en lectura manual - ${agentName}:`, error)
      });
    }
  }, [enabled, agents]);

  // Función para detener TTS
  const stopTTS = useCallback(() => {
    ttsManager.stop();
    processedAgentsRef.current.clear();
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
    stopTTS,
    pauseTTS,
    resumeTTS,
    clearTTSQueue,
    getTTSStatus
  };
}
