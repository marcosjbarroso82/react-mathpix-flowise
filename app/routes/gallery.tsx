import type { Route } from "./+types/gallery";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Galería - React Webcam Explorer" },
    { name: "description", content: "Galería de fotos y videos capturados con react-webcam" },
  ];
}

export default function Gallery() {
  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: 'var(--color-background)' }}>
      {/* Header */}
      <div className="shadow-sm border-b px-4 py-4" style={{ 
        backgroundColor: 'var(--color-surface)', 
        borderColor: 'var(--color-border)' 
      }}>
        <h1 className="text-xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>🖼️ Galería</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>Fotos y videos capturados</p>
      </div>

      {/* Gallery Grid */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-3">
          {/* Placeholder items */}
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="aspect-square rounded-lg border-2 border-dashed flex items-center justify-center" style={{ 
              backgroundColor: 'var(--color-surface)', 
              borderColor: 'var(--color-border)' 
            }}>
              <div className="text-center">
                <div className="w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-accent)' }}>
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Imagen {i + 1}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty State */}
      <div className="px-4 mt-6">
        <div className="rounded-lg p-6 text-center" style={{ backgroundColor: 'var(--color-surface)' }}>
          <div className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-accent)' }}>
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h3 className="font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>Galería Vacía</h3>
          <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
            Las fotos y videos capturados aparecerán aquí
          </p>
          <div className="text-xs px-3 py-1 rounded-full inline-block" style={{ 
            backgroundColor: 'var(--color-accent)', 
            color: 'white' 
          }}>
            Usa la cámara para empezar
          </div>
        </div>
      </div>

      {/* Features Preview */}
      <div className="px-4 mt-6">
        <h2 className="text-lg font-medium mb-3" style={{ color: 'var(--color-text-primary)' }}>Funcionalidades Planificadas</h2>
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#10b981' }}></div>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Vista previa de imágenes</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#10b981' }}></div>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Reproducción de videos</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#10b981' }}></div>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Descarga de archivos</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#10b981' }}></div>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Eliminación de elementos</p>
          </div>
        </div>
      </div>
    </div>
  );
}
