import React, { useState, useEffect } from 'react';
import { useFlowiseAgents, type FlowiseAgent } from '../contexts/FlowiseAgentsContext';

interface FlowiseAgentsSettingsProps {
  className?: string;
  showTitle?: boolean;
  showResetButton?: boolean;
}

export default function FlowiseAgentsSettings({ 
  className = '', 
  showTitle = true, 
  showResetButton = true 
}: FlowiseAgentsSettingsProps) {
  const { agents, addAgent, updateAgent, deleteAgent } = useFlowiseAgents();
  
  // Estado para el formulario de nuevo agente
  const [isAddingAgent, setIsAddingAgent] = useState(false);
  const [newAgent, setNewAgent] = useState({ name: '', url: '' });
  const [editingAgent, setEditingAgent] = useState<string | null>(null);
  const [editAgent, setEditAgent] = useState({ name: '', url: '' });

  const handleAddAgent = () => {
    if (newAgent.name.trim() && newAgent.url.trim()) {
      addAgent({
        name: newAgent.name.trim(),
        url: newAgent.url.trim()
      });
      setNewAgent({ name: '', url: '' });
      setIsAddingAgent(false);
    }
  };

  const handleEditAgent = (agent: FlowiseAgent) => {
    setEditingAgent(agent.id);
    setEditAgent({ name: agent.name, url: agent.url });
  };

  const handleSaveEdit = () => {
    if (editingAgent && editAgent.name.trim() && editAgent.url.trim()) {
      updateAgent(editingAgent, {
        name: editAgent.name.trim(),
        url: editAgent.url.trim()
      });
      setEditingAgent(null);
      setEditAgent({ name: '', url: '' });
    }
  };

  const handleCancelEdit = () => {
    setEditingAgent(null);
    setEditAgent({ name: '', url: '' });
  };

  const handleDeleteAgent = (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este agente?')) {
      deleteAgent(id);
    }
  };

  const resetToDefaults = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar todos los agentes?')) {
      agents.forEach(agent => deleteAgent(agent.id));
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {showTitle && (
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium" style={{ color: 'var(--color-text-primary)' }}>
            Agentes de Flowise
          </h3>
          {showResetButton && agents.length > 0 && (
            <button
              onClick={resetToDefaults}
              className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-200"
            >
              Eliminar Todos
            </button>
          )}
        </div>
      )}

      <div className="space-y-4">
        {/* Lista de agentes existentes */}
        {agents.length > 0 && (
          <div>
            <h4 className="font-medium mb-3" style={{ color: 'var(--color-text-primary)' }}>
              Agentes Configurados ({agents.length})
            </h4>
            <div className="space-y-3">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  className="p-4 rounded-lg border"
                  style={{ 
                    backgroundColor: 'var(--color-surface)', 
                    borderColor: 'var(--color-border)' 
                  }}
                >
                  {editingAgent === agent.id ? (
                    // Modo edición
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text-primary)' }}>
                          Nombre del Agente
                        </label>
                        <input
                          type="text"
                          value={editAgent.name}
                          onChange={(e) => setEditAgent(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          placeholder="Nombre del agente"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text-primary)' }}>
                          URL del Agente
                        </label>
                        <input
                          type="url"
                          value={editAgent.url}
                          onChange={(e) => setEditAgent(prev => ({ ...prev, url: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          placeholder="https://cloud.flowiseai.com/api/v1/prediction/..."
                        />
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={handleSaveEdit}
                          className="px-3 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors duration-200"
                        >
                          Guardar
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="px-3 py-1 text-sm bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors duration-200"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Modo visualización
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h5 className="font-medium text-sm" style={{ color: 'var(--color-text-primary)' }}>
                          {agent.name}
                        </h5>
                        <p className="text-xs text-gray-500 dark:text-gray-400 break-all">
                          {agent.url}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditAgent(agent)}
                          className="p-1 text-blue-600 hover:text-blue-700"
                          title="Editar agente"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteAgent(agent.id)}
                          className="p-1 text-red-600 hover:text-red-700"
                          title="Eliminar agente"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Formulario para agregar nuevo agente */}
        {isAddingAgent ? (
          <div className="p-4 rounded-lg border border-dashed" style={{ 
            backgroundColor: 'var(--color-surface)', 
            borderColor: 'var(--color-border)' 
          }}>
            <h4 className="font-medium mb-3" style={{ color: 'var(--color-text-primary)' }}>
              Agregar Nuevo Agente
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text-primary)' }}>
                  Nombre del Agente
                </label>
                <input
                  type="text"
                  value={newAgent.name}
                  onChange={(e) => setNewAgent(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Mi Agente de IA"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text-primary)' }}>
                  URL del Agente
                </label>
                <input
                  type="url"
                  value={newAgent.url}
                  onChange={(e) => setNewAgent(prev => ({ ...prev, url: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="https://cloud.flowiseai.com/api/v1/prediction/..."
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleAddAgent}
                  disabled={!newAgent.name.trim() || !newAgent.url.trim()}
                  className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-md transition-colors duration-200"
                >
                  Agregar Agente
                </button>
                <button
                  onClick={() => {
                    setIsAddingAgent(false);
                    setNewAgent({ name: '', url: '' });
                  }}
                  className="px-4 py-2 text-sm bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors duration-200"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAddingAgent(true)}
            className="w-full p-4 rounded-lg border-2 border-dashed text-center hover:border-solid transition-all"
            style={{ 
              borderColor: 'var(--color-border)',
              backgroundColor: 'var(--color-surface)'
            }}
          >
            <div className="text-2xl mb-2">➕</div>
            <div className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
              Agregar Nuevo Agente
            </div>
            <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              Configurar un agente de Flowise
            </div>
          </button>
        )}

        {/* Información de ayuda */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                ¿Cómo obtener la URL del agente?
              </h4>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                1. Ve a tu instancia de Flowise<br/>
                2. Selecciona el agente que quieres usar<br/>
                3. Copia la URL de la API (formato: /api/v1/prediction/...)<br/>
                4. Pega la URL completa incluyendo el dominio
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
