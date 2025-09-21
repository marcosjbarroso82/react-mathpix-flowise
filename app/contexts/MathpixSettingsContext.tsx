import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface MathpixSettings {
  appId: string;
  appKey: string;
  includeMath: boolean;
  outputFormats: string[];
}

// Valores por defecto
export const DEFAULT_MATHPIX_SETTINGS: MathpixSettings = {
  appId: '',
  appKey: '',
  includeMath: true,
  outputFormats: ['text', 'latex', 'mathml']
};

interface MathpixSettingsContextType {
  settings: MathpixSettings;
  updateSettings: (newSettings: Partial<MathpixSettings>) => void;
  saveSettings: (newSettings: MathpixSettings) => void;
  resetToDefaults: () => void;
  isLoading: boolean;
}

const MathpixSettingsContext = createContext<MathpixSettingsContextType | undefined>(undefined);

interface MathpixSettingsProviderProps {
  children: ReactNode;
}

export function MathpixSettingsProvider({ children }: MathpixSettingsProviderProps) {
  const [settings, setSettings] = useState<MathpixSettings>(DEFAULT_MATHPIX_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar configuración desde localStorage al inicializar
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('settings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        if (parsedSettings.mathpix) {
          setSettings(prev => ({
            ...DEFAULT_MATHPIX_SETTINGS,
            ...parsedSettings.mathpix
          }));
        }
      }
    } catch (error) {
      console.error('Error loading Mathpix settings from localStorage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateSettings = (newSettings: Partial<MathpixSettings>) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings
    }));
  };

  const saveSettings = (newSettings: MathpixSettings) => {
    setSettings(newSettings);
    // Guardar inmediatamente en localStorage
    try {
      const currentSettings = localStorage.getItem('settings');
      const parsedSettings = currentSettings ? JSON.parse(currentSettings) : {};
      
      localStorage.setItem('settings', JSON.stringify({
        ...parsedSettings,
        mathpix: newSettings
      }));
    } catch (error) {
      console.error('Error saving Mathpix settings to localStorage:', error);
    }
  };

  const resetToDefaults = () => {
    setSettings(DEFAULT_MATHPIX_SETTINGS);
  };

  const value: MathpixSettingsContextType = {
    settings,
    updateSettings,
    saveSettings,
    resetToDefaults,
    isLoading
  };

  return (
    <MathpixSettingsContext.Provider value={value}>
      {children}
    </MathpixSettingsContext.Provider>
  );
}

export function useMathpixSettings() {
  const context = useContext(MathpixSettingsContext);
  if (context === undefined) {
    throw new Error('useMathpixSettings must be used within a MathpixSettingsProvider');
  }
  return context;
}
