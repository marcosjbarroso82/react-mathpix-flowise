import React, { useState, useCallback } from 'react';
import type { Route } from "./+types/multi-ocr-workflow";
import { useMultiOCRWorkflow } from '../contexts/MultiOCRWorkflowContext';
import { useFlowiseAgents } from '../contexts/FlowiseAgentsContext';
import { useMathpixSettings } from '../contexts/MathpixSettingsContext';
import { usePrompts } from '../contexts/PromptsContext';
import { MultiOCRWorkflowService } from '../services/multiOCRWorkflowService';
import { useTTS } from '../hooks/useTTS';
import MultiFileUpload from '../components/MultiFileUpload';
import MultiCameraCapture from '../components/MultiCameraCapture';
import AgentSelector from '../components/AgentSelector';
import WorkflowProgress from '../components/WorkflowProgress';
import WorkflowShortcuts from '../components/WorkflowShortcuts';
import ResultsSummary from '../components/ResultsSummary';
import { PageHeader } from '../components/PageHeader';

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
    directAgentsResults,
    setDirectAgentResult,
    clearResults,
    isRunning,
    setIsRunning,
    cancelWorkflow,
    resetImages,
    resetAll
  } = useMultiOCRWorkflow();

  const { agents } = useFlowiseAgents();
  const { settings: mathpixSettings } = useMathpixSettings();
  const { prompts } = usePrompts();

  // TTS Hook
  const {
    speakAgentResult,
    speakConfidenceInfo,
    stopTTS,
    pauseTTS,
    resumeTTS,
    clearTTSQueue,
    getTTSStatus
  } = useTTS({
    enabled: config.enableTTS,
    responseAgentsResults,
    directAgentsResults,
    agents,
    isRunning,
    images
  });

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

  const handleTTSChange = (enabled: boolean) => {
    const newConfig = { ...config, enableTTS: enabled };
    updateConfig(newConfig);
    saveConfig(newConfig);
  };

  const handleDirectAgentsChange = (agentIds: string[]) => {
    const newConfig = { ...config, directAgentsIds: agentIds };
    updateConfig(newConfig);
    saveConfig(newConfig);
  };

  const handlePromptSelect = (promptId: string) => {
    const newConfig = { ...config, selectedPromptId: promptId };
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

    // Validate direct agents configuration (opcional)
    if (config.directAgentsIds.length > 0 && !config.selectedPromptId) {
      errors.push('Debe seleccionar un prompt para los agentes directos');
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
      const directAgents = agents.filter(a => config.directAgentsIds.includes(a.id));
      const selectedPrompt = prompts.find(p => p.id === config.selectedPromptId);

      if (!questionCompilerAgent) {
        throw new Error('Agente compilador no encontrado');
      }

      // Preparar callbacks compartidos
      const sharedCallbacks = {
        onImageOCRStart: (imageId: string) => {
          updateImageStatus(imageId, 'processing');
        },
        onImageOCRComplete: (imageId: string, result: any) => {
          updateImageStatus(imageId, 'completed', result);
        },
        onImageOCRError: (imageId: string, error: string) => {
          updateImageStatus(imageId, 'error', { status: 0, data: null, error });
        },
        onStepStart: (stepId: string) => {
          updateWorkflowStep(stepId, { 
            status: 'processing', 
            startTime: new Date() 
          });
        },
        onStepComplete: (stepId: string, stepResult: any) => {
          updateWorkflowStep(stepId, { 
            status: 'completed', 
            endTime: new Date(),
            result: stepResult 
          });
        },
        onStepError: (stepId: string, error: string) => {
          updateWorkflowStep(stepId, { 
            status: 'error', 
            endTime: new Date(),
            error 
          });
        },
        // Callbacks para actualización progresiva
        onCompiledOCRTextUpdate: (text: string) => {
          console.log('🔄 Actualizando texto OCR compilado progresivamente');
          setCompiledOCRText(text);
        },
        onQuestionCompilerComplete: (result: any) => {
          console.log('✅ Agente compilador completado progresivamente');
          setQuestionCompilerResult(result);
        },
        onResponseAgentComplete: (agentId: string, result: any) => {
          console.log(`🤖 Agente de respuesta ${agentId} completado progresivamente`);
          setResponseAgentResult(agentId, result);
        },
        onDirectAgentComplete: (agentId: string, result: any) => {
          console.log(`🚀 Agente directo ${agentId} completado progresivamente`);
          setDirectAgentResult(agentId, result);
        }
      };

      // Ejecutar ambos workflows en paralelo
      const promises: Promise<any>[] = [];

      // Workflow Mathpix OCR
      promises.push(
        MultiOCRWorkflowService.processWorkflow(
          images,
          questionCompilerAgent,
          responseAgents,
          {
            appId: mathpixSettings.appId,
            appKey: mathpixSettings.appKey,
            includeMath: mathpixSettings.includeMath,
            outputFormats: mathpixSettings.outputFormats
          },
          sharedCallbacks
        )
      );

      // Workflow Directo a Agentes (solo si hay agentes y prompt seleccionados)
      if (directAgents.length > 0 && selectedPrompt) {
        promises.push(
          MultiOCRWorkflowService.processDirectAgents(
            images,
            directAgents,
            selectedPrompt,
            sharedCallbacks
          )
        );
      }

      // Esperar a que ambos workflows terminen
      const results = await Promise.all(promises);

      // Verificar resultados y mostrar errores si los hay
      const mathpixResult = results[0];
      if (!mathpixResult.success) {
        alert(`Error en el workflow Mathpix OCR: ${mathpixResult.error}`);
      }

      // Verificar resultados del workflow Directo a Agentes (si existe)
      if (results.length > 1) {
        const directResult = results[1];
        if (!directResult.success) {
          alert(`Error en el workflow Directo a Agentes: ${directResult.error}`);
        }
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

  // Función para el atajo "Procesar y Limpiar"
  const runWorkflowAndClean = useCallback(async () => {
    await runWorkflow();
    // Limpiar automáticamente al terminar (solo imágenes, mantener resultados)
    setTimeout(() => {
      resetImages();
    }, 2000); // Esperar 2 segundos para que el usuario vea los resultados
  }, [runWorkflow, resetImages]);

  const handleReset = () => {
    if (isRunning) {
      // Si está ejecutándose, cancelar (mantiene resultados)
      cancelWorkflow();
    } else {
      // Si no está ejecutándose, resetear solo imágenes (mantiene resultados)
      resetImages();
    }
  };

  const canRunWorkflow = !isRunning && !hasConfigurationErrors && images.length > 0 && 
                        !!config.questionCompilerAgentId && config.responseAgentIds.length > 0 &&
                        (config.directAgentsIds.length === 0 || !!config.selectedPromptId);

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: 'var(--color-background)' }}>
      {/* Header */}
      <PageHeader 
        title="Multi-OCR Workflow" 
        description="Procesamiento avanzado con Mathpix OCR y envío directo a agentes en paralelo"
        icon="⚡"
      />

      {/* Main Content */}
      <div className="">
        {/* Shortcuts Section */}
        <WorkflowShortcuts
          imagesCount={images.length}
          maxImages={config.maxImages}
          isRunning={isRunning}
          canRunWorkflow={canRunWorkflow}
          onTakePhoto={(file) => addImages([file])}
          onRunWorkflow={runWorkflowAndClean}
          onReset={handleReset}
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
                  
                  {/* Imagen */}
                  <div className="mb-3">
                    <img
                      src={URL.createObjectURL(image.file)}
                      alt={`Imagen ${index + 1}`}
                      className="w-full max-h-64 object-contain rounded-lg border border-gray-200 dark:border-gray-600"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                  
                  {/* Información del archivo */}
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

        {/* Camera Capture Section */}
        <MultiCameraCapture
          onImagesCapture={addImages}
          maxFiles={config.maxImages}
          currentFileCount={images.length}
          isProcessing={isRunning}
          disabled={isRunning}
        />

        {/* Results Summary Section */}
        <ResultsSummary 
          responseAgentsResults={responseAgentsResults} 
          directAgentsResults={directAgentsResults}
        />

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
              selectedAgentId=""
              selectedAgentIds={config.responseAgentIds}
              onAgentsSelect={handleResponseAgentsChange}
              multiple
              helpText="Estos agentes procesarán la respuesta del agente compilador en paralelo."
              required
              disabled={isRunning}
            />
          </div>

          {/* TTS Configuration */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                  Text-to-Speech (TTS)
                </h3>
                <p className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                  Leer automáticamente las respuestas de los agentes cuando terminen de procesar
                </p>
              </div>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.enableTTS}
                  onChange={(e) => handleTTSChange(e.target.checked)}
                  disabled={isRunning}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                  Habilitar TTS
                </span>
              </label>
            </div>
            {config.enableTTS && (
              <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
                <div className="flex items-start space-x-2">
                  <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-xs text-blue-700 dark:text-blue-300">
                    <p className="font-medium mb-1">💡 Información sobre TTS:</p>
                    <ul className="space-y-1 text-xs">
                      <li>• Las respuestas se leerán automáticamente cuando cada agente termine</li>
                      <li>• Las lecturas se ejecutan en secuencia (una después de la otra)</li>
                      <li>• Se detecta automáticamente el idioma español si está disponible</li>
                      <li>• Puedes pausar/reanudar desde los controles de TTS</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Direct Agents Configuration */}
          {(agents.length > 0 && prompts.length > 0) && (
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
              <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--color-text-primary)' }}>
                Workflow Directo a Agentes (Opcional)
              </h3>
              <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                Envía las imágenes directamente a agentes seleccionados con un prompt específico, ejecutándose en paralelo con el workflow Mathpix OCR.
              </p>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Direct Agents Selection */}
                <AgentSelector
                  label="Agentes Directos"
                  selectedAgentId=""
                  selectedAgentIds={config.directAgentsIds}
                  onAgentsSelect={handleDirectAgentsChange}
                  multiple
                  helpText="Estos agentes recibirán las imágenes directamente con el prompt seleccionado."
                  disabled={isRunning}
                />

                {/* Prompt Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
                    Prompt para Agentes Directos
                  </label>
                  <select
                    value={config.selectedPromptId}
                    onChange={(e) => handlePromptSelect(e.target.value)}
                    disabled={isRunning}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Selecciona un prompt...</option>
                    {prompts.map((prompt) => (
                      <option key={prompt.id} value={prompt.id}>
                        {prompt.name}
                      </option>
                    ))}
                  </select>
                  {config.selectedPromptId && (
                    <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
                      <p className="text-xs text-blue-700 dark:text-blue-300">
                        <strong>Prompt seleccionado:</strong> {prompts.find(p => p.id === config.selectedPromptId)?.content}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

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
            
            <div className="flex items-center space-x-3">
              <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                Máximo {config.maxImages} imágenes
              </div>
              <button
                onClick={() => {
                  if (window.confirm('¿Estás seguro de que quieres borrar TODOS los resultados y empezar desde cero?')) {
                    resetAll();
                  }
                }}
                className="text-xs px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded transition-colors duration-200"
                disabled={isRunning}
              >
                Borrar Todo
              </button>
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
          selectedFiles={images.map(img => img.file)}
          onRemoveFile={(index) => removeImage(images[index].id)}
        />



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
          directAgentsResults={directAgentsResults}
          isRunning={isRunning}
          enableTTS={config.enableTTS}
          onSpeakAgentResult={speakAgentResult}
          onSpeakConfidenceInfo={speakConfidenceInfo}
          onStopTTS={stopTTS}
          onPauseTTS={pauseTTS}
          onResumeTTS={resumeTTS}
          onClearTTSQueue={clearTTSQueue}
          getTTSStatus={getTTSStatus}
        />

        {/* Help Information */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200 mb-3">
            ¿Cómo funciona el Multi-OCR Workflow?
          </h3>
          
          {/* Workflow Mathpix OCR */}
          <div className="mb-6">
            <h4 className="text-md font-medium text-blue-800 dark:text-blue-200 mb-3">
              📄 Workflow Mathpix OCR
            </h4>
            <div className="space-y-3 text-sm text-blue-700 dark:text-blue-300">
              <div className="flex items-start space-x-2">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center text-xs font-bold text-blue-800 dark:text-blue-200">1</span>
                <div>
                  <strong>Captura de Imágenes:</strong> Sube archivos desde tu dispositivo o captura fotos con la cámara (hasta {config.maxImages} imágenes).
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center text-xs font-bold text-blue-800 dark:text-blue-200">2</span>
                <div>
                  <strong>Procesamiento OCR:</strong> Las imágenes se procesan en paralelo con Mathpix OCR para extraer texto y fórmulas.
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center text-xs font-bold text-blue-800 dark:text-blue-200">3</span>
                <div>
                  <strong>Compilación:</strong> Los resultados OCR se compilan en un texto estructurado con formato "OCR #1 {'{'}texto{'}'} FIN OCR #1".
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center text-xs font-bold text-blue-800 dark:text-blue-200">4</span>
                <div>
                  <strong>Agente Compilador:</strong> El texto compilado se envía al agente compilador que genera una pregunta o consulta procesada.
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center text-xs font-bold text-blue-800 dark:text-blue-200">5</span>
                <div>
                  <strong>Agentes de Respuesta:</strong> La respuesta del compilador se envía en paralelo a múltiples agentes especializados.
                </div>
              </div>
            </div>
          </div>

          {/* Workflow Directo a Agentes */}
          <div className="mb-4">
            <h4 className="text-md font-medium text-blue-800 dark:text-blue-200 mb-3">
              🚀 Workflow Directo a Agentes (Opcional)
            </h4>
            <div className="space-y-3 text-sm text-blue-700 dark:text-blue-300">
              <div className="flex items-start space-x-2">
                <span className="flex-shrink-0 w-6 h-6 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center text-xs font-bold text-green-800 dark:text-green-200">1</span>
                <div>
                  <strong>Selección de Agentes:</strong> Elige uno o más agentes que recibirán las imágenes directamente.
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <span className="flex-shrink-0 w-6 h-6 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center text-xs font-bold text-green-800 dark:text-green-200">2</span>
                <div>
                  <strong>Selección de Prompt:</strong> Elige un prompt que se aplicará a todos los agentes seleccionados.
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <span className="flex-shrink-0 w-6 h-6 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center text-xs font-bold text-green-800 dark:text-green-200">3</span>
                <div>
                  <strong>Envío Directo:</strong> Las imágenes se envían directamente a cada agente con el prompt seleccionado, ejecutándose en paralelo con el workflow Mathpix OCR.
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-800/30 rounded-lg">
            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
              💡 Consejos para mejores resultados:
            </h4>
            <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Usa la cámara para capturar pantallas de notebook con tu celular</li>
              <li>• Configura la resolución y delay de enfoque en Configuración</li>
              <li>• Asegúrate de que el texto sea legible y esté bien iluminado</li>
              <li>• Puedes combinar archivos subidos con fotos capturadas</li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
}
