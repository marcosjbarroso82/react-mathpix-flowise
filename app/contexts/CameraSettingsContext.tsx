import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface CameraSettings {
  videoConstraints: {
    width: number;
    height: number;
    facingMode: string;
  };
  forceScreenshotSourceSize: boolean;
  screenshotQuality: number;
  screenshotFormat: string;
  imageSmoothing: boolean;
  focusDelay: number;
}


// Valores por defecto
export const DEFAULT_CAMERA_SETTINGS: CameraSettings = {
  videoConstraints: {
    width: 1920,
    height: 1080,
    facingMode: 'environment'
  },
  forceScreenshotSourceSize: true,
  screenshotQuality: 0.9,
  screenshotFormat: 'image/jpeg',
  imageSmoothing: false,
  focusDelay: 1
};


interface CameraSettingsContextType {
  settings: CameraSettings;
  updateSettings: (newSettings: Partial<CameraSettings>) => void;
  resetToDefaults: () => void;
  isLoading: boolean;
}

const CameraSettingsContext = createContext<CameraSettingsContextType | undefined>(undefined);

interface CameraSettingsProviderProps {
  children: ReactNode;
}

export function CameraSettingsProvider({ children }: CameraSettingsProviderProps) {
  const [settings, setSettings] = useState<CameraSettings>(DEFAULT_CAMERA_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar configuración desde localStorage al inicializar
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('settings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        if (parsedSettings.camera) {
          setSettings(prev => ({
            ...DEFAULT_CAMERA_SETTINGS,
            ...parsedSettings.camera
          }));
        }
      }
    } catch (error) {
      console.error('Error loading camera settings from localStorage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Guardar configuración en localStorage cuando cambie
  useEffect(() => {
    if (!isLoading) {
      try {
        const currentSettings = localStorage.getItem('settings');
        const parsedSettings = currentSettings ? JSON.parse(currentSettings) : {};
        
        localStorage.setItem('settings', JSON.stringify({
          ...parsedSettings,
          camera: settings
        }));
      } catch (error) {
        console.error('Error saving camera settings to localStorage:', error);
      }
    }
  }, [settings, isLoading]);

  const updateSettings = (newSettings: Partial<CameraSettings>) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings
    }));
  };

  const resetToDefaults = () => {
    setSettings(DEFAULT_CAMERA_SETTINGS);
  };

  const value: CameraSettingsContextType = {
    settings,
    updateSettings,
    resetToDefaults,
    isLoading
  };

  return (
    <CameraSettingsContext.Provider value={value}>
      {children}
    </CameraSettingsContext.Provider>
  );
}

export function useCameraSettings() {
  const context = useContext(CameraSettingsContext);
  if (context === undefined) {
    throw new Error('useCameraSettings must be used within a CameraSettingsProvider');
  }
  return context;
}
