import type { Route } from "./+types/about";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Acerca de - Mathpix OCR Explorer" },
    { name: "description", content: "Información sobre Mathpix API y este proyecto de exploración de OCR" },
  ];
}

export default function About() {
  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: 'var(--color-background)' }}>
      {/* Header */}
      <div className="shadow-sm border-b px-4 py-4" style={{ 
        backgroundColor: 'var(--color-surface)', 
        borderColor: 'var(--color-border)' 
      }}>
        <h1 className="text-xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>ℹ️ Acerca de</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>Mathpix OCR Explorer</p>
      </div>

      {/* Project Info */}
      <div className="p-4">
        <div className="rounded-lg p-6 mb-6" style={{ backgroundColor: 'var(--color-surface)' }}>
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--color-accent)' }}>
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>Mathpix OCR Explorer</h2>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>v1.0.0</p>
            </div>
          </div>
          <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
            Un proyecto de exploración para aprender y experimentar con la API de OCR de Mathpix. 
            Este template te permite descubrir las capacidades de reconocimiento de texto y fórmulas matemáticas.
          </p>
        </div>

        {/* Mathpix API Info */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3" style={{ color: 'var(--color-text-primary)' }}>Sobre Mathpix API</h3>
          <div className="space-y-3">
            <div className="p-4 rounded-lg border" style={{ 
              backgroundColor: 'var(--color-surface)', 
              borderColor: 'var(--color-border)' 
            }}>
              <h4 className="font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>¿Qué es Mathpix?</h4>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                Una API de reconocimiento óptico de caracteres (OCR) especializada en texto matemático y científico. 
                Convierte imágenes de ecuaciones, fórmulas y texto a formato LaTeX, MathML y texto plano.
              </p>
            </div>

            <div className="p-4 rounded-lg border" style={{ 
              backgroundColor: 'var(--color-surface)', 
              borderColor: 'var(--color-border)' 
            }}>
              <h4 className="font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>Características principales</h4>
              <ul className="text-sm space-y-1" style={{ color: 'var(--color-text-secondary)' }}>
                <li>• Reconocimiento de fórmulas matemáticas complejas</li>
                <li>• Conversión a LaTeX, MathML y texto plano</li>
                <li>• Soporte para múltiples formatos de imagen</li>
                <li>• Alta precisión en texto científico</li>
                <li>• API REST fácil de integrar</li>
              </ul>
            </div>
          </div>
        </div>

        {/* API Setup Guide */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3" style={{ color: 'var(--color-text-primary)' }}>Configuración de API</h3>
          <div className="p-4 rounded-lg border" style={{ 
            backgroundColor: 'var(--color-surface)', 
            borderColor: 'var(--color-border)' 
          }}>
            <p className="text-sm mb-3" style={{ color: 'var(--color-text-secondary)' }}>
              Para empezar a usar Mathpix API en este proyecto:
            </p>
            <div className="space-y-2">
              <div className="bg-gray-900 text-green-400 p-3 rounded text-sm font-mono">
                1. Regístrate en mathpix.com
              </div>
              <div className="bg-gray-900 text-green-400 p-3 rounded text-sm font-mono">
                2. Obtén tu App ID y App Key
              </div>
              <div className="bg-gray-900 text-green-400 p-3 rounded text-sm font-mono">
                3. Configura las credenciales en la app
              </div>
            </div>
            <p className="text-xs mt-2" style={{ color: 'var(--color-text-secondary)' }}>
              Las imágenes se procesan enviando requests POST a la API de Mathpix
            </p>
          </div>
        </div>

        {/* Features List */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3" style={{ color: 'var(--color-text-primary)' }}>Funcionalidades a Explorar</h3>
          <div className="grid grid-cols-1 gap-2">
            {[
              { icon: '🔍', title: 'Reconocimiento de Texto', desc: 'Extraer texto de imágenes con alta precisión' },
              { icon: '🧮', title: 'Fórmulas Matemáticas', desc: 'Convertir ecuaciones a LaTeX y MathML' },
              { icon: '📷', title: 'Captura con Cámara', desc: 'Tomar fotos directamente para procesar' },
              { icon: '📁', title: 'Subida de Archivos', desc: 'Procesar imágenes desde el dispositivo' },
              { icon: '📊', title: 'Múltiples Formatos', desc: 'Texto, LaTeX, MathML y más' },
              { icon: '⚙️', title: 'Configuración API', desc: 'Gestionar credenciales y opciones' }
            ].map((feature, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border" style={{ 
                backgroundColor: 'var(--color-surface)', 
                borderColor: 'var(--color-border)' 
              }}>
                <span className="text-lg">{feature.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                    {feature.title}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resources */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3" style={{ color: 'var(--color-text-primary)' }}>Recursos Útiles</h3>
          <div className="space-y-2">
            <a 
              href="https://mathpix.com/docs" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block p-3 rounded-lg border hover:opacity-80 transition-opacity" 
              style={{ 
                backgroundColor: 'var(--color-surface)', 
                borderColor: 'var(--color-border)' 
              }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 rounded" style={{ backgroundColor: 'var(--color-accent)' }}></div>
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                    Mathpix API Documentation
                  </p>
                  <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    Documentación oficial de la API de Mathpix
                  </p>
                </div>
              </div>
            </a>

            <a 
              href="https://github.com/mozmorris/react-webcam" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block p-3 rounded-lg border hover:opacity-80 transition-opacity" 
              style={{ 
                backgroundColor: 'var(--color-surface)', 
                borderColor: 'var(--color-border)' 
              }}
            >
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                    GitHub - react-webcam
                  </p>
                  <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    Librería para captura de cámara web
                  </p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
