import React, { useState, useEffect } from 'react';
import { useMathpixSettings } from '../contexts/MathpixSettingsContext';

interface MathpixSettingsProps {
  className?: string;
  showTitle?: boolean;
  showResetButton?: boolean;
}

export default function MathpixSettings({ 
  className = '', 
  showTitle = true, 
  showResetButton = true 
}: MathpixSettingsProps) {
  const { settings: mathpixSettings, saveSettings: saveMathpixSettings, resetToDefaults: resetMathpixToDefaults } = useMathpixSettings();
  
  // Estado temporal para los cambios no guardados
  const [tempSettings, setTempSettings] = useState(mathpixSettings);
  const [hasChanges, setHasChanges] = useState(false);

  // Sincronizar estado temporal cuando cambie la configuración guardada
  useEffect(() => {
    setTempSettings(mathpixSettings);
    setHasChanges(false);
  }, [mathpixSettings]);

  // Detectar cambios comparando con la configuración guardada
  useEffect(() => {
    const hasChanges = JSON.stringify(tempSettings) !== JSON.stringify(mathpixSettings);
    setHasChanges(hasChanges);
  }, [tempSettings, mathpixSettings]);

  const handleSettingChange = (key: string, value: any) => {
    setTempSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleFormatChange = (format: string, checked: boolean) => {
    if (checked) {
      setTempSettings(prev => ({
        ...prev,
        outputFormats: [...prev.outputFormats, format]
      }));
    } else {
      setTempSettings(prev => ({
        ...prev,
        outputFormats: prev.outputFormats.filter(f => f !== format)
      }));
    }
  };

  const resetToDefaults = () => {
    setTempSettings({
      appId: '',
      appKey: '',
      includeMath: true,
      outputFormats: ['text', 'latex', 'mathml']
    });
  };

  const saveSettings = () => {
    saveMathpixSettings(tempSettings);
    console.log('Mathpix settings saved:', tempSettings);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {showTitle && (
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Configuración de Mathpix API
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
        {/* Credenciales de API */}
        <div>
          <h4 className="font-medium mb-3 text-gray-700 dark:text-gray-300">Credenciales de API</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                App ID
              </label>
              <input
                type="text"
                value={tempSettings.appId}
                onChange={(e) => handleSettingChange('appId', e.target.value)}
                placeholder="Ingresa tu App ID de Mathpix"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                App Key
              </label>
              <input
                type="password"
                value={tempSettings.appKey}
                onChange={(e) => handleSettingChange('appKey', e.target.value)}
                placeholder="Ingresa tu App Key de Mathpix"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Opciones de Procesamiento */}
        <div>
          <h4 className="font-medium mb-3 text-gray-700 dark:text-gray-300">Opciones de Procesamiento</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Incluir Reconocimiento de Fórmulas
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Reconocer y convertir fórmulas matemáticas
                </p>
              </div>
              <input
                type="checkbox"
                checked={tempSettings.includeMath}
                onChange={(e) => handleSettingChange('includeMath', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
          </div>
        </div>

        {/* Formatos de Salida */}
        <div>
          <h4 className="font-medium mb-3 text-gray-700 dark:text-gray-300">Formatos de Salida</h4>
          <div className="space-y-2">
            {[
              { id: 'text', label: 'Texto Plano', desc: 'Texto extraído sin formato' },
              { id: 'latex', label: 'LaTeX', desc: 'Fórmulas en formato LaTeX' },
              { id: 'mathml', label: 'MathML', desc: 'Fórmulas en formato MathML' }
            ].map((format) => (
              <div key={format.id} className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {format.label}
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {format.desc}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={tempSettings.outputFormats.includes(format.id)}
                  onChange={(e) => handleFormatChange(format.id, e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Botón de Guardar */}
        <div className="pt-4">
          <button
            onClick={saveSettings}
            disabled={!hasChanges}
            className={`w-full px-4 py-2 font-medium rounded-md transition-colors duration-200 ${
              hasChanges
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }`}
          >
            {hasChanges ? 'Guardar Configuración' : 'Sin cambios para guardar'}
          </button>
        </div>

        {/* Información de Ayuda */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                ¿Cómo obtener las credenciales?
              </h4>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                1. Regístrate en mathpix.com<br/>
                2. Ve al dashboard y crea una nueva aplicación<br/>
                3. Copia el App ID y App Key generados
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
