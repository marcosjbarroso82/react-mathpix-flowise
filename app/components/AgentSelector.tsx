import React from 'react';
import { useFlowiseAgents, type FlowiseAgent } from '../contexts/FlowiseAgentsContext';

interface AgentSelectorProps {
  label: string;
  selectedAgentId: string;
  selectedAgentIds?: string[];
  onAgentSelect?: (agentId: string) => void;
  onAgentsSelect?: (agentIds: string[]) => void;
  multiple?: boolean;
  disabled?: boolean;
  placeholder?: string;
  helpText?: string;
  required?: boolean;
}

export default function AgentSelector({
  label,
  selectedAgentId,
  selectedAgentIds = [],
  onAgentSelect,
  onAgentsSelect,
  multiple = false,
  disabled = false,
  placeholder = "Selecciona un agente...",
  helpText,
  required = false
}: AgentSelectorProps) {
  const { agents, isLoading } = useFlowiseAgents();

  const handleSingleSelect = (agentId: string) => {
    if (onAgentSelect) {
      onAgentSelect(agentId);
    }
  };

  const handleMultipleSelect = (agentId: string, checked: boolean) => {
    if (onAgentsSelect) {
      if (checked) {
        onAgentsSelect([...selectedAgentIds, agentId]);
      } else {
        onAgentsSelect(selectedAgentIds.filter(id => id !== agentId));
      }
    }
  };

  const getSelectedAgentNames = () => {
    if (multiple) {
      return selectedAgentIds
        .map(id => agents.find(agent => agent.id === id)?.name)
        .filter(Boolean)
        .join(', ');
    } else {
      return agents.find(agent => agent.id === selectedAgentId)?.name || '';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700">
          <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Cargando agentes...
          </span>
        </div>
      </div>
    );
  }

  if (agents.length === 0) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700">
          <span className="text-sm text-yellow-600 dark:text-yellow-400">
            No hay agentes configurados
          </span>
        </div>
        <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
          Ve a Configuración para agregar agentes de Flowise
        </p>
      </div>
    );
  }

  if (multiple) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        
        {/* Summary of selected agents */}
        {selectedAgentIds.length > 0 && (
          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
            <div className="text-xs text-blue-800 dark:text-blue-200 font-medium mb-1">
              {selectedAgentIds.length} agente{selectedAgentIds.length !== 1 ? 's' : ''} seleccionado{selectedAgentIds.length !== 1 ? 's' : ''}:
            </div>
            <div className="text-xs text-blue-700 dark:text-blue-300">
              {getSelectedAgentNames()}
            </div>
          </div>
        )}

        {/* Agent checkboxes */}
        <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-md p-2">
          {agents.map((agent) => {
            const isSelected = selectedAgentIds.includes(agent.id);
            return (
              <label
                key={agent.id}
                className={`flex items-start space-x-3 p-2 rounded cursor-pointer transition-colors ${
                  disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={(e) => handleMultipleSelect(agent.id, e.target.checked)}
                  disabled={disabled}
                  className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                    {agent.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {agent.url}
                  </div>
                </div>
              </label>
            );
          })}
        </div>
        
        {helpText && (
          <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
            {helpText}
          </p>
        )}
      </div>
    );
  }

  // Single select mode
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <select
        value={selectedAgentId}
        onChange={(e) => handleSingleSelect(e.target.value)}
        disabled={disabled}
        className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <option value="">{placeholder}</option>
        {agents.map((agent) => (
          <option key={agent.id} value={agent.id}>
            {agent.name}
          </option>
        ))}
      </select>
      
      {/* Show selected agent details */}
      {selectedAgentId && (
        <div className="p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
          <div className="text-xs text-green-800 dark:text-green-200 font-medium">
            Agente seleccionado:
          </div>
          <div className="text-xs text-green-700 dark:text-green-300">
            {getSelectedAgentNames()}
          </div>
          <div className="text-xs text-green-600 dark:text-green-400 truncate mt-1">
            {agents.find(agent => agent.id === selectedAgentId)?.url}
          </div>
        </div>
      )}
      
      {helpText && (
        <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
          {helpText}
        </p>
      )}
    </div>
  );
}
