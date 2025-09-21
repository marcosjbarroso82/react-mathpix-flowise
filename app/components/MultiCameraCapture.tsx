import React, { useRef, useCallback, useState } from 'react';
import Webcam from 'react-webcam';
import { useCameraSettings } from '../contexts/CameraSettingsContext';

interface MultiCameraCaptureProps {
  onImagesCapture: (files: File[]) => void;
  maxFiles: number;
  currentFileCount: number;
  isProcessing: boolean;
  disabled?: boolean;
}

export default function MultiCameraCapture({ 
  onImagesCapture, 
  maxFiles, 
  currentFileCount, 
  isProcessing, 
  disabled = false 
}: MultiCameraCaptureProps) {
  const webcamRef = useRef<Webcam>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImages, setCapturedImages] = useState<File[]>([]);

  // Usar configuración del contexto global
  const { settings } = useCameraSettings();

  // Configuración de video constraints para react-webcam
  const videoConstraints = {
    width: settings.videoConstraints.width,
    height: settings.videoConstraints.height,
    facingMode: settings.videoConstraints.facingMode as 'user' | 'environment'
  };

  const availableSlots = Math.max(0, maxFiles - currentFileCount);
  const canCapture = availableSlots > 0 && !disabled && !isProcessing && !isCapturing;

  const capture = useCallback(async () => {
    if (!webcamRef.current || !canCapture) return;

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

        // Agregar a la lista de imágenes capturadas
        const newCapturedImages = [...capturedImages, file];
        setCapturedImages(newCapturedImages);

        // Si hemos alcanzado el límite o el usuario quiere procesar, enviar las imágenes
        if (newCapturedImages.length >= availableSlots) {
          onImagesCapture(newCapturedImages);
          setCapturedImages([]);
        }
      }
    } catch (err) {
      setError('Error al capturar la imagen');
      console.error('Error capturing image:', err);
    } finally {
      setIsCapturing(false);
    }
  }, [settings, canCapture, capturedImages, availableSlots, onImagesCapture]);

  const processCapturedImages = useCallback(() => {
    if (capturedImages.length > 0) {
      onImagesCapture(capturedImages);
      setCapturedImages([]);
    }
  }, [capturedImages, onImagesCapture]);

  const clearCapturedImages = useCallback(() => {
    setCapturedImages([]);
  }, []);

  const isDisabled = disabled || isProcessing || isCapturing;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium" style={{ color: 'var(--color-text-primary)' }}>
          Capturar con Cámara
        </h2>
        <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          {currentFileCount + capturedImages.length}/{maxFiles} imágenes
        </div>
      </div>
      
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

      {/* Botones de captura */}
      <div className="mt-4 flex flex-col sm:flex-row gap-3">
        <button
          onClick={capture}
          disabled={!canCapture}
          className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
            !canCapture
              ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {isCapturing ? 'Enfocando...' : isProcessing ? 'Procesando...' : 'Capturar Foto'}
        </button>

        {capturedImages.length > 0 && (
          <>
            <button
              onClick={processCapturedImages}
              disabled={isProcessing}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors duration-200"
            >
              Procesar {capturedImages.length} foto{capturedImages.length !== 1 ? 's' : ''}
            </button>
            <button
              onClick={clearCapturedImages}
              disabled={isProcessing}
              className="px-4 py-3 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white rounded-lg transition-colors duration-200"
            >
              Limpiar
            </button>
          </>
        )}
      </div>

      {/* Imágenes capturadas pendientes */}
      {capturedImages.length > 0 && (
        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L3.354 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              {capturedImages.length} foto{capturedImages.length !== 1 ? 's' : ''} capturada{capturedImages.length !== 1 ? 's' : ''} pendiente{capturedImages.length !== 1 ? 's' : ''} de procesar
            </span>
          </div>
          <div className="text-xs text-yellow-700 dark:text-yellow-300">
            Haz clic en "Procesar" para agregar a la lista de imágenes o "Capturar Foto" para tomar más.
          </div>
        </div>
      )}

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
