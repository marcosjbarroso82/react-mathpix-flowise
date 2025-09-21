import { useUI } from '../contexts/UIContext';

export function UIToggles() {
  const { uiSettings, toggleHeader, toggleNavigation, toggleCompactMode } = useUI();

  return (
    <div className="px-4 py-4 border-t" style={{ 
      backgroundColor: 'var(--color-surface)', 
      borderColor: 'var(--color-border)' 
    }}>
      <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--color-text-primary)' }}>
        🎛️ Controles de Interfaz
      </h3>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 rounded-lg border" style={{ 
          backgroundColor: 'var(--color-background)', 
          borderColor: 'var(--color-border)' 
        }}>
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
              Mostrar Header
            </p>
            <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              Mostrar/ocultar el encabezado de la página
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={uiSettings.showHeader}
              onChange={toggleHeader}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg border" style={{ 
          backgroundColor: 'var(--color-background)', 
          borderColor: 'var(--color-border)' 
        }}>
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
              Mostrar Menú
            </p>
            <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              Mostrar/ocultar el menú de navegación inferior
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={uiSettings.showNavigation}
              onChange={toggleNavigation}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg border" style={{ 
          backgroundColor: 'var(--color-background)', 
          borderColor: 'var(--color-border)' 
        }}>
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
              Modo Compacto
            </p>
            <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              Activar interfaz compacta para optimizar espacio
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={uiSettings.compactMode}
              onChange={toggleCompactMode}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>
  );
}
