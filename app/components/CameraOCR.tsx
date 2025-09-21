import React, { useRef, useCallback, useState } from 'react';
import Webcam from 'react-webcam';
import { useCameraSettings } from '../contexts/CameraSettingsContext';

interface CameraOCRProps {
  onImageCapture: (file: File) => void;
  isProcessing: boolean;
  disabled?: boolean;
}

export default function CameraOCR({ onImageCapture, isProcessing, disabled = false }: CameraOCRProps) {
  const webcamRef = useRef<Webcam>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  // Usar configuración del contexto global
  const { settings } = useCameraSettings();

  // Configuración de video constraints para react-webcam
  const videoConstraints = {
    width: settings.videoConstraints.width,
    height: settings.videoConstraints.height,
    facingMode: settings.videoConstraints.facingMode as 'user' | 'environment'
  };

  const capture = useCallback(async () => {
    if (!webcamRef.current || disabled || isProcessing || isCapturing) return;

    setIsCapturing(true);
    setError(null);

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
        onImageCapture(file);
      }
    } catch (err) {
      setError('Error al capturar la imagen');
      console.error('Error capturing image:', err);
    } finally {
      setIsCapturing(false);
    }
  }, [settings, onImageCapture, disabled, isProcessing, isCapturing]);

  const isDisabled = disabled || isProcessing || isCapturing;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
      <h2 className="text-lg font-medium mb-4" style={{ color: 'var(--color-text-primary)' }}>
        Capturar con Cámara
      </h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 rounded-md">
          {error}
        </div>
      )}

      <div className="relative">
        <Webcam
          ref={webcamRef}
          audio={false}
          videoConstraints={videoConstraints}
          className={`w-full h-auto rounded-lg ${isDisabled ? 'opacity-50' : ''}`}
          style={{ maxHeight: '60vh' }}
          onUserMediaError={(error) => {
            setError('Error al acceder a la cámara. Verifica los permisos.');
            console.error('Webcam error:', error);
          }}
        />
        
        {/* Overlay de loading */}
        {(isCapturing || isProcessing) && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
              <p>{isCapturing ? 'Enfocando...' : 'Procesando...'}</p>
            </div>
          </div>
        )}
      </div>

      {/* Botón de captura */}
      <div className="mt-4 text-center">
        <button
          onClick={capture}
          disabled={isDisabled}
          className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
            isDisabled
              ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {isCapturing ? 'Enfocando...' : isProcessing ? 'Procesando...' : 'Capturar y Procesar'}
        </button>
      </div>

      {/* Información de configuración */}
      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <div>Resolución: {settings.videoConstraints.width}x{settings.videoConstraints.height}</div>
          <div>Cámara: {settings.videoConstraints.facingMode === 'environment' ? 'Trasera' : 'Frontal'}</div>
          <div>Formato: {settings.screenshotFormat}</div>
          <div>Calidad: {settings.screenshotQuality}</div>
          <div>Delay: {settings.focusDelay}s</div>
        </div>
      </div>
    </div>
  );
}
