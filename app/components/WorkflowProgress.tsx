import React from 'react';
import type { ImageItem, WorkflowStep } from '../contexts/MultiOCRWorkflowContext';
import { MultiOCRWorkflowService } from '../services/multiOCRWorkflowService';
import { MathpixService } from '../services/mathpixService';
import { useFlowiseAgents } from '../contexts/FlowiseAgentsContext';

interface WorkflowProgressProps {
  images: ImageItem[];
  workflowSteps: WorkflowStep[];
  compiledOCRText: string;
  questionCompilerResult: any;
  responseAgentsResults: { [agentId: string]: any };
  directAgentsResults?: { [agentId: string]: any };
  isRunning: boolean;
  // TTS props
  enableTTS?: boolean;
  onSpeakAgentResult?: (agentId: string, result: any) => void;
  onSpeakConfidenceInfo?: (ocrResults: any[]) => void;
  onStopTTS?: () => void;
  onPauseTTS?: () => void;
  onResumeTTS?: () => void;
  onClearTTSQueue?: () => void;
  getTTSStatus?: () => {
    isEnabled: boolean;
    isPlaying: boolean;
    queueLength: number;
    currentItem: any;
  };
}

export default function WorkflowProgress({
  images,
  workflowSteps,
  compiledOCRText,
  questionCompilerResult,
  responseAgentsResults,
  directAgentsResults = {},
  isRunning,
  enableTTS = false,
  onSpeakAgentResult,
  onSpeakConfidenceInfo,
  onStopTTS,
  onPauseTTS,
  onResumeTTS,
  onClearTTSQueue,
  getTTSStatus
}: WorkflowProgressProps) {
  const { agents } = useFlowiseAgents();
  const getStepIcon = (status: WorkflowStep['status']) => {
    switch (status) {
      case 'pending':
        return (
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
            <span className="text-gray-500 dark:text-gray-400 text-sm">⏳</span>
          </div>
        );
      case 'processing':
        return (
          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        );
      case 'completed':
        return (
          <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
            <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'error':
        return (
          <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
            <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
    }
  };

  const getImageStatusIcon = (status: ImageItem['status']) => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'processing':
        return '🔄';
      case 'completed':
        return '✅';
      case 'error':
        return '❌';
    }
  };

  const formatDuration = (startTime?: Date, endTime?: Date) => {
    if (!startTime) return '';
    const end = endTime || new Date();
    const duration = end.getTime() - startTime.getTime();
    return `${(duration / 1000).toFixed(1)}s`;
  };

  return (
    <div className="space-y-6">
      {/* Images Progress */}
      {images.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium" style={{ color: 'var(--color-text-primary)' }}>
              Estado de las Imágenes
            </h3>
            {/* Botón para leer información de confianza */}
            {enableTTS && onSpeakConfidenceInfo && (
              <button
                onClick={() => {
                  const ocrResults = images
                    .filter(img => img.status === 'completed' && img.ocrResult)
                    .map(img => img.ocrResult);
                  onSpeakConfidenceInfo(ocrResults);
                }}
                className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 flex items-center space-x-1"
                title="Leer información de confianza del OCR"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 4.663 12 5.109 12 6v12c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
                <span>Leer Confianza</span>
              </button>
            )}
          </div>
          <div className="space-y-3">
            {images.map((image, index) => (
              <div key={image.id} className="flex items-center space-x-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--color-surface)' }}>
                <span className="text-lg">{getImageStatusIcon(image.status)}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                      Imagen #{index + 1}: {image.name}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                      {(image.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                  {image.status === 'completed' && image.ocrResult && (
                    <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded text-xs">
                      <div className="font-medium text-green-800 dark:text-green-200 mb-1">Resultado OCR:</div>
                      <div className="text-green-700 dark:text-green-300 max-h-20 overflow-y-auto">
                        {MultiOCRWorkflowService.formatOCRResult(image.ocrResult)}
                      </div>
                      {/* Mostrar confianza de manera destacada */}
                      {image.ocrResult?.data && (() => {
                        const confidence = MathpixService.extractConfidence(image.ocrResult.data);
                        if (confidence !== null) {
                          const confidenceText = MathpixService.formatConfidence(confidence);
                          const confidenceColor = confidence >= 0.8 ? 'text-green-600 dark:text-green-400' : 
                                                confidence >= 0.6 ? 'text-yellow-600 dark:text-yellow-400' : 
                                                'text-red-600 dark:text-red-400';
                          return (
                            <div className={`mt-1 font-medium ${confidenceColor}`}>
                              🎯 Confianza: {confidenceText}
                            </div>
                          );
                        }
                        return null;
                      })()}
                    </div>
                  )}
                  {image.status === 'error' && image.ocrResult?.error && (
                    <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded text-xs">
                      <div className="font-medium text-red-800 dark:text-red-200 mb-1">Error:</div>
                      <div className="text-red-700 dark:text-red-300">{image.ocrResult.error}</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Workflow Steps Progress */}
      {workflowSteps.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--color-text-primary)' }}>
            Progreso del Workflow
          </h3>
          <div className="space-y-4">
            {workflowSteps.map((step, index) => (
              <div key={step.id} className="flex items-start space-x-4">
                {getStepIcon(step.status)}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                      {step.name}
                    </h4>
                    {step.startTime && (
                      <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                        {formatDuration(step.startTime, step.endTime)}
                      </span>
                    )}
                  </div>
                  
                  {step.status === 'error' && step.error && (
                    <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                      <div className="text-sm text-red-800 dark:text-red-200 font-medium">Error:</div>
                      <div className="text-sm text-red-700 dark:text-red-300">{step.error}</div>
                    </div>
                  )}
                  
                  {step.status === 'completed' && step.result && (
                    <div className="mt-2 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                      ✓ Completado exitosamente
                    </div>
                  )}
                </div>
                
                {/* Connection line to next step */}
                {index < workflowSteps.length - 1 && (
                  <div className="absolute left-4 top-8 w-px h-6 bg-gray-300 dark:bg-gray-600" style={{ marginTop: '2rem' }}></div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Compiled OCR Text */}
      {compiledOCRText && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--color-text-primary)' }}>
            Texto OCR Compilado
          </h3>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <pre className="text-sm whitespace-pre-wrap overflow-x-auto" style={{ color: 'var(--color-text-primary)' }}>
              {compiledOCRText}
            </pre>
          </div>
        </div>
      )}

      {/* Question Compiler Result */}
      {questionCompilerResult && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--color-text-primary)' }}>
            Resultado del Agente Compilador
          </h3>
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <pre className="text-sm whitespace-pre-wrap overflow-x-auto text-blue-800 dark:text-blue-200">
              {MultiOCRWorkflowService.formatAgentResult(questionCompilerResult)}
            </pre>
          </div>
        </div>
      )}

      {/* Response Agents Results */}
      {Object.keys(responseAgentsResults).length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium" style={{ color: 'var(--color-text-primary)' }}>
              Resultados de Agentes de Respuesta
            </h3>
            
            {/* TTS Controls */}
            {enableTTS && (
              <div className="flex items-center space-x-2">
                {getTTSStatus && (() => {
                  const ttsStatus = getTTSStatus();
                  return (
                    <>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {ttsStatus.isPlaying ? 'Reproduciendo...' : 
                         ttsStatus.queueLength > 0 ? `En cola: ${ttsStatus.queueLength}` : 
                         'TTS listo'}
                      </div>
                      <div className="flex space-x-1">
                        {ttsStatus.isPlaying ? (
                          <>
                            <button
                              onClick={onPauseTTS}
                              className="p-1 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                              title="Pausar TTS"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </button>
                            <button
                              onClick={onResumeTTS}
                              className="p-1 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                              title="Reanudar TTS"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6-8h8a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2V6a2 2 0 012-2z" />
                              </svg>
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={onPauseTTS}
                            className="p-1 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                            title="Pausar TTS"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </button>
                        )}
                        <button
                          onClick={onStopTTS}
                          className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
                          title="Detener TTS"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10h6v4H9z" />
                          </svg>
                        </button>
                        <button
                          onClick={onClearTTSQueue}
                          className="p-1 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                          title="Limpiar cola TTS"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            {Object.entries(responseAgentsResults).map(([agentId, result]) => {
              const agent = agents.find(a => a.id === agentId);
              const agentName = agent ? agent.name : `Agente ${agentId}`;
              
              return (
                <div key={agentId} className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium text-purple-800 dark:text-purple-200">
                      {agentName}
                    </div>
                    {enableTTS && onSpeakAgentResult && (
                      <button
                        onClick={() => onSpeakAgentResult(agentId, result)}
                        className="p-1 text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-200"
                        title="Leer respuesta con TTS"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 4.663 12 5.109 12 6v12c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        </svg>
                      </button>
                    )}
                  </div>
                  {agent && (
                    <div className="text-xs text-purple-600 dark:text-purple-400 mb-2 truncate">
                      {agent.url}
                    </div>
                  )}
                  <pre className="text-sm whitespace-pre-wrap overflow-x-auto text-purple-700 dark:text-purple-300">
                    {MultiOCRWorkflowService.formatAgentResult(result)}
                  </pre>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Direct Agents Results */}
      {Object.keys(directAgentsResults).length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium" style={{ color: 'var(--color-text-primary)' }}>
              Resultados de Agentes Directos
            </h3>
            
            {/* TTS Controls */}
            {enableTTS && (
              <div className="flex items-center space-x-2">
                {getTTSStatus && (() => {
                  const ttsStatus = getTTSStatus();
                  return (
                    <>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {ttsStatus.isPlaying ? 'Reproduciendo...' : 
                         ttsStatus.queueLength > 0 ? `En cola: ${ttsStatus.queueLength}` : 
                         'TTS listo'}
                      </div>
                      <div className="flex space-x-1">
                        {ttsStatus.isPlaying ? (
                          <>
                            <button
                              onClick={onPauseTTS}
                              className="p-1 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                              title="Pausar TTS"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </button>
                            <button
                              onClick={onResumeTTS}
                              className="p-1 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                              title="Reanudar TTS"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6-8h8a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2V6a2 2 0 012-2z" />
                              </svg>
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={onPauseTTS}
                            className="p-1 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                            title="Pausar TTS"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </button>
                        )}
                        <button
                          onClick={onStopTTS}
                          className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
                          title="Detener TTS"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10h6v4H9z" />
                          </svg>
                        </button>
                        <button
                          onClick={onClearTTSQueue}
                          className="p-1 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                          title="Limpiar cola TTS"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            {Object.entries(directAgentsResults).map(([agentId, result]) => {
              const agent = agents.find(a => a.id === agentId);
              const agentName = agent ? agent.name : `Agente ${agentId}`;
              
              return (
                <div key={agentId} className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium text-blue-800 dark:text-blue-200">
                      {agentName}
                    </div>
                    {enableTTS && onSpeakAgentResult && (
                      <button
                        onClick={() => onSpeakAgentResult(agentId, result)}
                        className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                        title="Leer respuesta con TTS"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 4.663 12 5.109 12 6v12c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        </svg>
                      </button>
                    )}
                  </div>
                  {agent && (
                    <div className="text-xs text-blue-600 dark:text-blue-400 mb-2 truncate">
                      {agent.url}
                    </div>
                  )}
                  <pre className="text-sm whitespace-pre-wrap overflow-x-auto text-blue-700 dark:text-blue-300">
                    {MultiOCRWorkflowService.formatAgentResult(result)}
                  </pre>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Running indicator */}
      {isRunning && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Ejecutando workflow...
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
