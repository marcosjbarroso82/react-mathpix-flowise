import React, { useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { useCameraSettings } from '../contexts/CameraSettingsContext';

interface WorkflowShortcutsProps {
  // Estado del workflow
  imagesCount: number;
  maxImages: number;
  isRunning: boolean;
  canRunWorkflow: boolean;
  
  // Funciones de control
  onTakePhoto: (file: File) => void;
  onRunWorkflow: () => void;
  onReset: () => void;
}

export default function WorkflowShortcuts({
  imagesCount,
  maxImages,
  isRunning,
  canRunWorkflow,
  onTakePhoto,
  onRunWorkflow,
  onReset
}: WorkflowShortcutsProps) {
  const { settings } = useCameraSettings();
  const webcamRef = useRef<Webcam>(null);

  // Verificar si se puede tomar foto
  const canTakePhoto = imagesCount < maxImages && !isRunning;

  // Función para captura automática de foto
  const handleAutoCapture = useCallback(async () => {
    if (!canTakePhoto || !webcamRef.current) return;

    try {
      // Aplicar delay de enfoque
      await new Promise(resolve => setTimeout(resolve, settings.focusDelay * 1000));

      const imageSrc = webcamRef.current.getScreenshot({
        width: settings.videoConstraints.width,
        height: settings.videoConstraints.height
      });

      if (imageSrc) {
        // Convertir dataURL a File object
        const response = await fetch(imageSrc);
        const blob = await response.blob();
        
        // Crear File object con el formato y calidad configurados
        const file = new File([blob], `camera-capture-${Date.now()}.${settings.screenshotFormat.split('/')[1]}`, {
          type: settings.screenshotFormat
        });

        // Llamar a la función de procesamiento
        onTakePhoto(file);
      }
    } catch (error) {
      console.error('Error en captura automática:', error);
    }
  }, [settings, canTakePhoto, onTakePhoto]);

  // Función para ejecutar workflow completo y limpiar
  const handleRunAndClean = useCallback(() => {
    if (canRunWorkflow) {
      onRunWorkflow();
    }
  }, [canRunWorkflow, onRunWorkflow]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
      <h2 className="text-lg font-medium mb-4" style={{ color: 'var(--color-text-primary)' }}>
        ⚡ Atajos de Ejecución
      </h2>
      
      {/* Primera línea: Tomar Foto y Procesar */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        {/* Botón Tomar Foto */}
        <button
          onClick={handleAutoCapture}
          disabled={!canTakePhoto}
          className={`px-4 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2 ${
            !canTakePhoto
              ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>Tomar Foto</span>
        </button>

        {/* Botón Procesar y Limpiar */}
        <button
          onClick={handleRunAndClean}
          disabled={!canRunWorkflow}
          className={`px-4 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2 ${
            !canRunWorkflow
              ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>Procesar y Limpiar</span>
          {imagesCount > 0 && (
            <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs font-bold">
              {imagesCount}
            </span>
          )}
        </button>
      </div>

      {/* Segunda línea: Reiniciar */}
      <button
        onClick={onReset}
        className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <span>{isRunning ? 'Cancelar Workflow' : 'Reiniciar'}</span>
      </button>

      {/* Información de estado */}
      <div className="mt-3 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
        <div className="flex justify-between">
          <span>Imágenes: {imagesCount}/{maxImages}</span>
          <span>Estado: {isRunning ? 'Ejecutando...' : 'Listo'}</span>
        </div>
      </div>

      {/* Webcam oculta para captura automática */}
      <div className="hidden">
        <Webcam
          ref={webcamRef}
          audio={false}
          videoConstraints={{
            width: settings.videoConstraints.width,
            height: settings.videoConstraints.height,
            facingMode: settings.videoConstraints.facingMode as 'user' | 'environment'
          }}
          onUserMediaError={(error) => {
            console.error('Webcam error:', error);
          }}
        />
      </div>
    </div>
  );
}
