import { MathpixService } from './mathpixService';
import type { FlowiseAgent } from '../contexts/FlowiseAgentsContext';
import type { ImageItem, WorkflowStep } from '../contexts/MultiOCRWorkflowContext';

export interface OCROptions {
  appId: string;
  appKey: string;
  includeMath?: boolean;
  outputFormats?: string[];
}

export interface WorkflowCallbacks {
  onImageOCRStart?: (imageId: string) => void;
  onImageOCRComplete?: (imageId: string, result: any) => void;
  onImageOCRError?: (imageId: string, error: string) => void;
  onStepStart?: (stepId: string) => void;
  onStepComplete?: (stepId: string, result?: any) => void;
  onStepError?: (stepId: string, error: string) => void;
  onProgress?: (currentStep: number, totalSteps: number, message: string) => void;
}

export class MultiOCRWorkflowService {
  static async processWorkflow(
    images: ImageItem[],
    questionCompilerAgent: FlowiseAgent,
    responseAgents: FlowiseAgent[],
    ocrOptions: OCROptions,
    callbacks?: WorkflowCallbacks
  ): Promise<{
    compiledOCRText: string;
    questionCompilerResult: any;
    responseAgentsResults: { [agentId: string]: any };
    success: boolean;
    error?: string;
  }> {
    try {
      // Paso 1: Procesar OCR de todas las imágenes en paralelo
      callbacks?.onStepStart?.('ocr-processing');
      callbacks?.onProgress?.(1, 4, 'Procesando OCR de imágenes...');
      
      const ocrResults = await this.processImagesOCR(images, ocrOptions, callbacks);
      
      // Verificar si hay errores en OCR
      const hasOCRErrors = ocrResults.some(result => result.error);
      if (hasOCRErrors) {
        const errorMessage = 'Error en procesamiento OCR de algunas imágenes';
        callbacks?.onStepError?.('ocr-processing', errorMessage);
        throw new Error(errorMessage);
      }
      
      callbacks?.onStepComplete?.('ocr-processing', ocrResults);
      
      // Paso 2: Compilar resultados OCR
      callbacks?.onStepStart?.('ocr-compilation');
      callbacks?.onProgress?.(2, 4, 'Compilando resultados OCR...');
      
      const compiledOCRText = this.compileOCRResults(ocrResults);
      
      callbacks?.onStepComplete?.('ocr-compilation', { compiledText: compiledOCRText });
      
      // Paso 3: Procesar con agente compilador de preguntas
      callbacks?.onStepStart?.('question-compiler');
      callbacks?.onProgress?.(3, 4, 'Procesando con agente compilador...');
      
      const questionCompilerResult = await this.callFlowiseAgent(
        questionCompilerAgent,
        compiledOCRText
      );
      
      if (questionCompilerResult.error) {
        callbacks?.onStepError?.('question-compiler', questionCompilerResult.error);
        throw new Error(`Error en agente compilador: ${questionCompilerResult.error}`);
      }
      
      callbacks?.onStepComplete?.('question-compiler', questionCompilerResult);
      
      // Paso 4: Procesar con agentes de respuesta en paralelo
      callbacks?.onStepStart?.('response-agents');
      callbacks?.onProgress?.(4, 4, 'Procesando con agentes de respuesta...');
      
      const responseAgentsResults = await this.processResponseAgents(
        responseAgents,
        questionCompilerResult.data,
        callbacks
      );
      
      // Verificar si hay errores en agentes de respuesta
      const hasResponseErrors = Object.values(responseAgentsResults).some(
        result => result.error
      );
      
      if (hasResponseErrors) {
        const errorMessage = 'Error en algunos agentes de respuesta';
        callbacks?.onStepError?.('response-agents', errorMessage);
        // No lanzamos error aquí, permitimos resultados parciales
      }
      
      callbacks?.onStepComplete?.('response-agents', responseAgentsResults);
      
      return {
        compiledOCRText,
        questionCompilerResult,
        responseAgentsResults,
        success: true
      };
      
    } catch (error) {
      console.error('Error in MultiOCR Workflow:', error);
      return {
        compiledOCRText: '',
        questionCompilerResult: null,
        responseAgentsResults: {},
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  private static async processImagesOCR(
    images: ImageItem[],
    ocrOptions: OCROptions,
    callbacks?: WorkflowCallbacks
  ): Promise<Array<{ imageId: string; result: any; error?: string }>> {
    const promises = images.map(async (image) => {
      try {
        callbacks?.onImageOCRStart?.(image.id);
        
        const result = await MathpixService.processImage(image.file, ocrOptions);
        
        if (result.error) {
          callbacks?.onImageOCRError?.(image.id, result.error);
          return { imageId: image.id, result: null, error: result.error };
        } else {
          callbacks?.onImageOCRComplete?.(image.id, result);
          return { imageId: image.id, result };
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        callbacks?.onImageOCRError?.(image.id, errorMessage);
        return { imageId: image.id, result: null, error: errorMessage };
      }
    });

    return Promise.all(promises);
  }

  private static compileOCRResults(
    ocrResults: Array<{ imageId: string; result: any; error?: string }>
  ): string {
    let compiledText = '';
    
    ocrResults.forEach((ocrResult, index) => {
      if (ocrResult.result && !ocrResult.error) {
        const ocrNumber = index + 1;
        let textContent = '';
        
        // Extraer texto del resultado OCR
        if (ocrResult.result.data) {
          if (typeof ocrResult.result.data === 'string') {
            textContent = ocrResult.result.data;
          } else if (ocrResult.result.data.text) {
            textContent = ocrResult.result.data.text;
          } else if (ocrResult.result.data.latex) {
            textContent = ocrResult.result.data.latex;
          } else {
            textContent = JSON.stringify(ocrResult.result.data);
          }
        }
        
        compiledText += `OCR #${ocrNumber} ${textContent} FIN OCR #${ocrNumber}\n\n`;
      }
    });
    
    return compiledText.trim();
  }

  private static async callFlowiseAgent(
    agent: FlowiseAgent,
    question: string
  ): Promise<{ data: any; error?: string }> {
    try {
      const response = await fetch(agent.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ question: question.trim() })
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return { data: result };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  private static async processResponseAgents(
    responseAgents: FlowiseAgent[],
    questionCompilerResult: any,
    callbacks?: WorkflowCallbacks
  ): Promise<{ [agentId: string]: any }> {
    // Extraer el texto de la respuesta del agente compilador
    let questionText = '';
    if (typeof questionCompilerResult === 'string') {
      questionText = questionCompilerResult;
    } else if (questionCompilerResult?.text) {
      questionText = questionCompilerResult.text;
    } else {
      questionText = JSON.stringify(questionCompilerResult);
    }

    const promises = responseAgents.map(async (agent) => {
      try {
        const result = await this.callFlowiseAgent(agent, questionText);
        return { agentId: agent.id, result };
      } catch (error) {
        return {
          agentId: agent.id,
          result: {
            data: null,
            error: error instanceof Error ? error.message : 'Error desconocido'
          }
        };
      }
    });

    const results = await Promise.all(promises);
    
    // Convertir array a objeto con agentId como key
    const responseAgentsResults: { [agentId: string]: any } = {};
    results.forEach(({ agentId, result }) => {
      responseAgentsResults[agentId] = result;
    });

    return responseAgentsResults;
  }

  static formatOCRResult(ocrResult: any): string {
    if (!ocrResult || !ocrResult.data) return 'Sin resultado';
    
    if (typeof ocrResult.data === 'string') {
      return ocrResult.data;
    }
    
    if (ocrResult.data.text) {
      return ocrResult.data.text;
    }
    
    if (ocrResult.data.latex) {
      return ocrResult.data.latex;
    }
    
    return JSON.stringify(ocrResult.data, null, 2);
  }

  static formatAgentResult(agentResult: any): string {
    if (!agentResult) return 'Sin resultado';
    
    if (agentResult.error) {
      return `Error: ${agentResult.error}`;
    }
    
    // Buscar el campo "lectura" en diferentes niveles de la respuesta
    if (agentResult.data) {
      // Caso 1: data.lectura (directo)
      if (agentResult.data.lectura) {
        console.log('TTS: Encontrado campo lectura en data.lectura:', agentResult.data.lectura);
        return agentResult.data.lectura;
      }
      
      // Caso 2: data es un string
      if (typeof agentResult.data === 'string') {
        return agentResult.data;
      }
      
      // Caso 3: data es un objeto, buscar lectura recursivamente
      if (typeof agentResult.data === 'object') {
        const findReadingField = (obj: any): string | null => {
          // Buscar directamente el campo "lectura"
          if (obj.lectura && typeof obj.lectura === 'string') {
            return obj.lectura;
          }
          
          // Buscar en propiedades anidadas
          for (const key in obj) {
            if (typeof obj[key] === 'object' && obj[key] !== null) {
              const result = findReadingField(obj[key]);
              if (result) return result;
            }
          }
          return null;
        };
        
        const reading = findReadingField(agentResult.data);
        if (reading) {
          console.log('TTS: Encontrado campo lectura recursivamente:', reading);
          return reading;
        }
      }
    }

    // Si no se encuentra "lectura", buscar en el resultado completo
    if (agentResult.lectura && typeof agentResult.lectura === 'string') {
      console.log('TTS: Encontrado campo lectura en nivel raíz:', agentResult.lectura);
      return agentResult.lectura;
    }
    
    // Fallback: buscar campo text
    if (agentResult.data?.text) {
      return agentResult.data.text;
    }
    
    console.log('TTS: No se encontró campo lectura, devolviendo JSON completo:', agentResult.data);
    return JSON.stringify(agentResult.data, null, 2);
  }
}
