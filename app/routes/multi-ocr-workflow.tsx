import React, { useState, useCallback } from 'react';
import type { Route } from "./+types/multi-ocr-workflow";
import { useMultiOCRWorkflow } from '../contexts/MultiOCRWorkflowContext';
import { useFlowiseAgents } from '../contexts/FlowiseAgentsContext';
import { useMathpixSettings } from '../contexts/MathpixSettingsContext';
import { MultiOCRWorkflowService } from '../services/multiOCRWorkflowService';
import MultiFileUpload from '../components/MultiFileUpload';
import AgentSelector from '../components/AgentSelector';
import WorkflowProgress from '../components/WorkflowProgress';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Multi-OCR Workflow - Procesamiento Avanzado" },
    { name: "description", content: "Workflow avanzado para procesar múltiples imágenes con OCR y agentes de IA" },
  ];
}

export default function MultiOCRWorkflow() {
  const {
    config,
    updateConfig,
    saveConfig,
    images,
    addImages,
    removeImage,
    clearImages,
    updateImageStatus,
    workflowSteps,
    updateWorkflowStep,
    initializeWorkflowSteps,
    resetWorkflow,
    compiledOCRText,
    setCompiledOCRText,
    questionCompilerResult,
    setQuestionCompilerResult,
    responseAgentsResults,
    setResponseAgentResult,
    clearResults
  } = useMultiOCRWorkflow();

  const { agents } = useFlowiseAgents();
  const { settings: mathpixSettings } = useMathpixSettings();

  const [isRunning, setIsRunning] = useState(false);
  const [hasConfigurationErrors, setHasConfigurationErrors] = useState(false);

  // Configuration handlers
  const handleQuestionCompilerAgentChange = (agentId: string) => {
    const newConfig = { ...config, questionCompilerAgentId: agentId };
    updateConfig(newConfig);
    saveConfig(newConfig);
  };

  const handleResponseAgentsChange = (agentIds: string[]) => {
    const newConfig = { ...config, responseAgentIds: agentIds };
    updateConfig(newConfig);
    saveConfig(newConfig);
  };

  // Validation
  const validateConfiguration = useCallback(() => {
    const errors: string[] = [];

    // Validate Mathpix settings
    if (!mathpixSettings.appId || !mathpixSettings.appKey) {
      errors.push('Configuración de Mathpix incompleta');
    }

    // Validate agents
    if (!config.questionCompilerAgentId) {
      errors.push('Agente compilador de preguntas no seleccionado');
    }

    if (config.responseAgentIds.length === 0) {
      errors.push('No hay agentes de respuesta seleccionados');
    }

    // Validate images
    if (images.length === 0) {
      errors.push('No hay imágenes para procesar');
    }

    setHasConfigurationErrors(errors.length > 0);
    return errors;
  }, [mathpixSettings, config, images]);

  // Workflow execution
  const runWorkflow = useCallback(async () => {
    const errors = validateConfiguration();
    if (errors.length > 0) {
      alert(`No se puede ejecutar el workflow:\n${errors.join('\n')}`);
      return;
    }

    setIsRunning(true);
    clearResults();
    initializeWorkflowSteps();

    try {
      // Get agents
      const questionCompilerAgent = agents.find(a => a.id === config.questionCompilerAgentId);
      const responseAgents = agents.filter(a => config.responseAgentIds.includes(a.id));

      if (!questionCompilerAgent) {
        throw new Error('Agente compilador no encontrado');
      }

      // Run workflow with callbacks
      const result = await MultiOCRWorkflowService.processWorkflow(
        images,
        questionCompilerAgent,
        responseAgents,
        {
          appId: mathpixSettings.appId,
          appKey: mathpixSettings.appKey,
          includeMath: mathpixSettings.includeMath,
          outputFormats: mathpixSettings.outputFormats
        },
        {
          onImageOCRStart: (imageId) => {
            updateImageStatus(imageId, 'processing');
          },
          onImageOCRComplete: (imageId, result) => {
            updateImageStatus(imageId, 'completed', result);
          },
          onImageOCRError: (imageId, error) => {
            updateImageStatus(imageId, 'error', { status: 0, data: null, error });
          },
          onStepStart: (stepId) => {
            updateWorkflowStep(stepId, { 
              status: 'processing', 
              startTime: new Date() 
            });
          },
          onStepComplete: (stepId, stepResult) => {
            updateWorkflowStep(stepId, { 
              status: 'completed', 
              endTime: new Date(),
              result: stepResult 
            });
          },
          onStepError: (stepId, error) => {
            updateWorkflowStep(stepId, { 
              status: 'error', 
              endTime: new Date(),
              error 
            });
          }
        }
      );

      // Update results
      if (result.success) {
        setCompiledOCRText(result.compiledOCRText);
        setQuestionCompilerResult(result.questionCompilerResult);
        
        Object.entries(result.responseAgentsResults).forEach(([agentId, agentResult]) => {
          setResponseAgentResult(agentId, agentResult);
        });
      } else {
        alert(`Error en el workflow: ${result.error}`);
      }

    } catch (error) {
      console.error('Error executing workflow:', error);
      alert(`Error inesperado: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setIsRunning(false);
    }
  }, [
    validateConfiguration,
    agents,
    config,
    images,
    mathpixSettings,
    clearResults,
    initializeWorkflowSteps,
    updateImageStatus,
    updateWorkflowStep,
    setCompiledOCRText,
    setQuestionCompilerResult,
    setResponseAgentResult
  ]);

  const handleReset = () => {
    if (window.confirm('¿Estás seguro de que quieres reiniciar el workflow? Se perderán todos los resultados.')) {
      resetWorkflow();
      setIsRunning(false);
    }
  };

  const canRunWorkflow = !isRunning && !hasConfigurationErrors && images.length > 0 && 
                        config.questionCompilerAgentId && config.responseAgentIds.length > 0;

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: 'var(--color-background)' }}>
      {/* Header */}
      <div className="shadow-sm border-b px-4 py-4" style={{ 
        backgroundColor: 'var(--color-surface)', 
        borderColor: 'var(--color-border)' 
      }}>
        <h1 className="text-xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>
          ⚡ Multi-OCR Workflow
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
          Procesamiento avanzado con múltiples imágenes OCR y agentes de IA
        </p>
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-6">
        {/* Configuration Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium mb-4" style={{ color: 'var(--color-text-primary)' }}>
            Configuración del Workflow
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Question Compiler Agent */}
            <AgentSelector
              label="Agente Compilador de Preguntas"
              selectedAgentId={config.questionCompilerAgentId}
              onAgentSelect={handleQuestionCompilerAgentChange}
              placeholder="Selecciona el agente compilador..."
              helpText="Este agente procesará el texto OCR compilado y generará una pregunta."
              required
              disabled={isRunning}
            />

            {/* Response Agents */}
            <AgentSelector
              label="Agentes de Respuesta"
              selectedAgentIds={config.responseAgentIds}
              onAgentsSelect={handleResponseAgentsChange}
              multiple
              helpText="Estos agentes procesarán la respuesta del agente compilador en paralelo."
              required
              disabled={isRunning}
            />
          </div>

          {/* Configuration Status */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {hasConfigurationErrors ? (
                <>
                  <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L3.354 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span className="text-sm text-yellow-700 dark:text-yellow-300">
                    Configuración incompleta
                  </span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm text-green-700 dark:text-green-300">
                    Configuración completa
                  </span>
                </>
              )}
            </div>
            
            <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              Máximo {config.maxImages} imágenes
            </div>
          </div>
        </div>

        {/* File Upload Section */}
        <MultiFileUpload
          onFilesSelect={addImages}
          maxFiles={config.maxImages}
          currentFileCount={images.length}
          isProcessing={isRunning}
          disabled={isRunning}
        />

        {/* Images Management */}
        {images.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium" style={{ color: 'var(--color-text-primary)' }}>
                Imágenes Seleccionadas ({images.length})
              </h3>
              <button
                onClick={clearImages}
                disabled={isRunning}
                className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-md transition-colors duration-200"
              >
                Limpiar Todo
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((image, index) => (
                <div key={image.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                      #{index + 1}
                    </span>
                    <button
                      onClick={() => removeImage(image.id)}
                      disabled={isRunning}
                      className="text-red-600 hover:text-red-700 disabled:text-gray-400"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 truncate mb-1">
                    {image.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {(image.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={runWorkflow}
            disabled={!canRunWorkflow}
            className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            {isRunning ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Ejecutando Workflow...
              </>
            ) : (
              'Ejecutar Workflow'
            )}
          </button>
          
          <button
            onClick={handleReset}
            disabled={isRunning}
            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white rounded-lg transition-colors duration-200"
          >
            Reiniciar
          </button>
        </div>

        {/* Progress and Results */}
        <WorkflowProgress
          images={images}
          workflowSteps={workflowSteps}
          compiledOCRText={compiledOCRText}
          questionCompilerResult={questionCompilerResult}
          responseAgentsResults={responseAgentsResults}
          isRunning={isRunning}
        />

        {/* Help Information */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200 mb-3">
            ¿Cómo funciona el Multi-OCR Workflow?
          </h3>
          <div className="space-y-3 text-sm text-blue-700 dark:text-blue-300">
            <div className="flex items-start space-x-2">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center text-xs font-bold text-blue-800 dark:text-blue-200">1</span>
              <div>
                <strong>Procesamiento OCR:</strong> Las imágenes se procesan en paralelo con Mathpix OCR para extraer texto y fórmulas.
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center text-xs font-bold text-blue-800 dark:text-blue-200">2</span>
              <div>
                <strong>Compilación:</strong> Los resultados OCR se compaginan en un texto estructurado con formato "OCR #1 {'{'}texto{'}'} FIN OCR #1".
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center text-xs font-bold text-blue-800 dark:text-blue-200">3</span>
              <div>
                <strong>Agente Compilador:</strong> El texto compilado se envía al agente compilador que genera una pregunta o consulta procesada.
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center text-xs font-bold text-blue-800 dark:text-blue-200">4</span>
              <div>
                <strong>Agentes de Respuesta:</strong> La respuesta del compilador se envía en paralelo a múltiples agentes especializados.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
