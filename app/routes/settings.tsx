import type { Route } from "./+types/settings";
import CameraSettings from "../components/CameraSettings";
import MathpixSettings from "../components/MathpixSettings";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Configuración - Mathpix OCR Explorer" },
    { name: "description", content: "Configuraciones de cámara y API de Mathpix para OCR" },
  ];
}

export default function Settings() {
  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: 'var(--color-background)' }}>
      {/* Header */}
      <div className="shadow-sm border-b px-4 py-4" style={{ 
        backgroundColor: 'var(--color-surface)', 
        borderColor: 'var(--color-border)' 
      }}>
        <h1 className="text-xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>⚙️ Configuración</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>Ajustes de cámara y API de Mathpix</p>
      </div>

      {/* Mathpix API Settings */}
      <div className="p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
          <MathpixSettings showTitle={true} showResetButton={true} />
        </div>
      </div>

      {/* Camera Settings */}
      <div className="px-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <CameraSettings showTitle={true} showResetButton={true} />
        </div>
      </div>

      {/* Advanced Settings */}
      <div className="px-4">
        <h2 className="text-lg font-medium mb-4" style={{ color: 'var(--color-text-primary)' }}>Configuración Avanzada</h2>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg border" style={{ 
            backgroundColor: 'var(--color-surface)', 
            borderColor: 'var(--color-border)' 
          }}>
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                Auto-focus
              </p>
              <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                Enfoque automático de la cámara
              </p>
            </div>
            <input 
              type="checkbox" 
              className="w-4 h-4"
              style={{ accentColor: 'var(--color-accent)' }}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border" style={{ 
            backgroundColor: 'var(--color-surface)', 
            borderColor: 'var(--color-border)' 
          }}>
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                Estabilización
              </p>
              <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                Reducir vibración en videos
              </p>
            </div>
            <input 
              type="checkbox" 
              className="w-4 h-4"
              style={{ accentColor: 'var(--color-accent)' }}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border" style={{ 
            backgroundColor: 'var(--color-surface)', 
            borderColor: 'var(--color-border)' 
          }}>
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                Guardar automáticamente
              </p>
              <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                Descargar archivos automáticamente
              </p>
            </div>
            <input 
              type="checkbox" 
              className="w-4 h-4"
              style={{ accentColor: 'var(--color-accent)' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}