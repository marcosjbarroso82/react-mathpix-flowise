import type { Route } from "./+types/flowise-agents";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Flowise Agents - AI Agent Testing" },
    { name: "description", content: "Plataforma para probar y experimentar con agentes de Flowise AI" },
  ];
}

export default function FlowiseAgents() {
  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: 'var(--color-background)' }}>
      {/* Header */}
      <div className="shadow-sm border-b px-4 py-4" style={{ 
        backgroundColor: 'var(--color-surface)', 
        borderColor: 'var(--color-border)' 
      }}>
        <h1 className="text-xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>🤖 Flowise Agents</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
          Plataforma para probar y experimentar con agentes de IA
        </p>
      </div>

      {/* Main Content */}
      <div className="p-4">
        {/* Welcome Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--color-accent)' }}>
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>Bienvenido a Flowise Agents</h2>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>v1.0.0</p>
            </div>
          </div>
          <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
            Esta plataforma te permite probar y experimentar con diferentes agentes de IA construidos con Flowise. 
            Conecta, prueba y optimiza tus flujos de trabajo de inteligencia artificial.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex items-start space-x-3 p-4 rounded-lg" style={{ backgroundColor: 'var(--color-surface)' }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-accent)' }}>
              <span className="text-white text-sm">🔗</span>
            </div>
            <div>
              <h3 className="font-medium text-sm" style={{ color: 'var(--color-text-primary)' }}>Conexión a Flowise</h3>
              <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Conecta con tu instancia de Flowise</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-4 rounded-lg" style={{ backgroundColor: 'var(--color-surface)' }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-accent)' }}>
              <span className="text-white text-sm">🧪</span>
            </div>
            <div>
              <h3 className="font-medium text-sm" style={{ color: 'var(--color-text-primary)' }}>Pruebas de Agentes</h3>
              <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Prueba diferentes agentes y configuraciones</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-4 rounded-lg" style={{ backgroundColor: 'var(--color-surface)' }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-accent)' }}>
              <span className="text-white text-sm">📊</span>
            </div>
            <div>
              <h3 className="font-medium text-sm" style={{ color: 'var(--color-text-primary)' }}>Análisis de Resultados</h3>
              <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Visualiza y analiza las respuestas</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-4 rounded-lg" style={{ backgroundColor: 'var(--color-surface)' }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-accent)' }}>
              <span className="text-white text-sm">⚙️</span>
            </div>
            <div>
              <h3 className="font-medium text-sm" style={{ color: 'var(--color-text-primary)' }}>Configuración Avanzada</h3>
              <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Personaliza parámetros y configuraciones</p>
            </div>
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-6 border border-blue-200 dark:border-gray-600">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Próximamente</h3>
          </div>
          <p className="text-sm text-blue-800 dark:text-blue-200 mb-4">
            Estamos trabajando en las funcionalidades principales. Mientras tanto, puedes explorar las otras secciones de la aplicación.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="text-sm text-blue-700 dark:text-blue-300">
              • Configuración de endpoints de Flowise
            </div>
            <div className="text-sm text-blue-700 dark:text-blue-300">
              • Interfaz de chat con agentes
            </div>
            <div className="text-sm text-blue-700 dark:text-blue-300">
              • Historial de conversaciones
            </div>
            <div className="text-sm text-blue-700 dark:text-blue-300">
              • Métricas de rendimiento
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--color-text-primary)' }}>Acciones Rápidas</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button 
              className="p-4 rounded-lg border-2 border-dashed text-center hover:border-solid transition-all"
              style={{ 
                borderColor: 'var(--color-border)',
                backgroundColor: 'var(--color-surface)'
              }}
            >
              <div className="text-2xl mb-2">🔧</div>
              <div className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>Configurar Flowise</div>
              <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Próximamente</div>
            </button>
            
            <button 
              className="p-4 rounded-lg border-2 border-dashed text-center hover:border-solid transition-all"
              style={{ 
                borderColor: 'var(--color-border)',
                backgroundColor: 'var(--color-surface)'
              }}
            >
              <div className="text-2xl mb-2">💬</div>
              <div className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>Probar Agente</div>
              <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Próximamente</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
