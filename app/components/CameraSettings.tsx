import React from 'react';
import { useCameraSettings } from '../contexts/CameraSettingsContext';

interface CameraSettingsProps {
  className?: string;
  showTitle?: boolean;
  showResetButton?: boolean;
}

export default function CameraSettings({ 
  className = '', 
  showTitle = true, 
  showResetButton = true 
}: CameraSettingsProps) {
  const { settings, updateSettings, resetToDefaults } = useCameraSettings();

  const handleSettingChange = (key: keyof typeof settings, value: any) => {
    updateSettings({ [key]: value });
  };

  const handleVideoConstraintChange = (key: string, value: any) => {
    updateSettings({
      videoConstraints: {
        ...settings.videoConstraints,
        [key]: value
      }
    });
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {showTitle && (
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Configuración de la Cámara
          </h3>
          {showResetButton && (
            <button
              onClick={resetToDefaults}
              className="px-3 py-1 text-sm bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors duration-200"
            >
              Restablecer
            </button>
          )}
        </div>
      )}

      <div className="space-y-4">
        {/* Video Constraints */}
        <div>
          <h4 className="font-medium mb-2 text-gray-700 dark:text-gray-300">Video Constraints</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Ancho
              </label>
              <input
                type="number"
                value={settings.videoConstraints.width}
                onChange={(e) => handleVideoConstraintChange('width', parseInt(e.target.value) || 1920)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Alto
              </label>
              <input
                type="number"
                value={settings.videoConstraints.height}
                onChange={(e) => handleVideoConstraintChange('height', parseInt(e.target.value) || 1080)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Cámara
              </label>
              <select
                value={settings.videoConstraints.facingMode}
                onChange={(e) => handleVideoConstraintChange('facingMode', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="environment">Trasera (environment)</option>
                <option value="user">Frontal (user)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Otras configuraciones */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Force Screenshot Source Size
            </label>
            <input
              type="checkbox"
              checked={settings.forceScreenshotSourceSize}
              onChange={(e) => handleSettingChange('forceScreenshotSourceSize', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Image Smoothing (mantener bordes definidos)
            </label>
            <input
              type="checkbox"
              checked={settings.imageSmoothing}
              onChange={(e) => handleSettingChange('imageSmoothing', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Calidad de Captura (0.1 - 1.0)
            </label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={settings.screenshotQuality}
              onChange={(e) => handleSettingChange('screenshotQuality', parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {settings.screenshotQuality}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Formato de Imagen
            </label>
            <select
              value={settings.screenshotFormat}
              onChange={(e) => handleSettingChange('screenshotFormat', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="image/jpeg">JPEG</option>
              <option value="image/png">PNG</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Delay de Enfoque (segundos)
            </label>
            <input
              type="range"
              min="0"
              max="5"
              step="0.5"
              value={settings.focusDelay}
              onChange={(e) => handleSettingChange('focusDelay', parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {settings.focusDelay} segundos
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
