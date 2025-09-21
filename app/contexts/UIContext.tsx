import { createContext, useContext, useEffect, useState } from 'react';

interface UISettings {
  showHeader: boolean;
  showNavigation: boolean;
  compactMode: boolean;
}

interface UIContextType {
  uiSettings: UISettings;
  toggleHeader: () => void;
  toggleNavigation: () => void;
  toggleCompactMode: () => void;
  setUISettings: (settings: UISettings) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [uiSettings, setUISettingsState] = useState<UISettings>({
    showHeader: true,
    showNavigation: true,
    compactMode: false,
  });

  // Cargar configuración del localStorage al inicializar
  useEffect(() => {
    const savedSettings = localStorage.getItem('ui-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setUISettingsState({
          showHeader: parsed.showHeader !== false, // default true
          showNavigation: parsed.showNavigation !== false, // default true
          compactMode: parsed.compactMode === true, // default false
        });
      } catch (error) {
        console.error('Error parsing UI settings:', error);
      }
    }
  }, []);

  const setUISettings = (settings: UISettings) => {
    setUISettingsState(settings);
    localStorage.setItem('ui-settings', JSON.stringify(settings));
  };

  const toggleHeader = () => {
    const newSettings = {
      ...uiSettings,
      showHeader: !uiSettings.showHeader,
    };
    setUISettings(newSettings);
  };

  const toggleNavigation = () => {
    const newSettings = {
      ...uiSettings,
      showNavigation: !uiSettings.showNavigation,
    };
    setUISettings(newSettings);
  };

  const toggleCompactMode = () => {
    const newSettings = {
      ...uiSettings,
      compactMode: !uiSettings.compactMode,
    };
    setUISettings(newSettings);
  };

  return (
    <UIContext.Provider value={{ uiSettings, toggleHeader, toggleNavigation, toggleCompactMode, setUISettings }}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
}
