import React from 'react';
import { useFlowiseAgents } from '../contexts/FlowiseAgentsContext';
import { MultiOCRWorkflowService } from '../services/multiOCRWorkflowService';
import { useUI } from '../contexts/UIContext';

interface ResultsSummaryProps {
  responseAgentsResults: { [agentId: string]: any };
  directAgentsResults?: { [agentId: string]: any };
}

export default function ResultsSummary({ responseAgentsResults, directAgentsResults = {} }: ResultsSummaryProps) {
  const { agents } = useFlowiseAgents();
  const { uiSettings } = useUI();

  // Función para extraer el campo "lectura" de la respuesta del agente
  const extractReadingField = (agentResult: any): string => {
    if (!agentResult || agentResult.error) {
      return agentResult?.error || 'Sin resultado';
    }

    // Buscar el campo "lectura" en diferentes niveles de la respuesta
    if (agentResult.data) {
      // Caso 1: data.lectura (directo)
      if (agentResult.data.lectura) {
        return agentResult.data.lectura;
      }
      
      // Caso 2: data es un string
      if (typeof agentResult.data === 'string') {
        return agentResult.data;
      }
      
      // Caso 3: data es un objeto, buscar lectura recursivamente
      if (typeof agentResult.data === 'object') {
        const findReadingField = (obj: any): string | null => {
          // Buscar directamente el campo "lectura"
          if (obj.lectura && typeof obj.lectura === 'string') {
            return obj.lectura;
          }
          
          // Buscar en propiedades anidadas
          for (const key in obj) {
            if (typeof obj[key] === 'object' && obj[key] !== null) {
              const result = findReadingField(obj[key]);
              if (result) return result;
            }
          }
          return null;
        };
        
        const reading = findReadingField(agentResult.data);
        if (reading) return reading;
      }
    }

    // Si no se encuentra "lectura", buscar en el resultado completo
    if (agentResult.lectura && typeof agentResult.lectura === 'string') {
      return agentResult.lectura;
    }

    // Fallback: mostrar mensaje de que no se encontró el campo lectura
    return 'Campo "lectura" no encontrado en la respuesta';
  };

  // Verificar si hay resultados para mostrar
  const hasResponseResults = Object.keys(responseAgentsResults).length > 0;
  const hasDirectResults = Object.keys(directAgentsResults).length > 0;
  const hasValidResponseResults = Object.values(responseAgentsResults).some(result => 
    result && !result.error && extractReadingField(result) !== 'Sin resultado'
  );
  const hasValidDirectResults = Object.values(directAgentsResults).some(result => 
    result && !result.error && extractReadingField(result) !== 'Sin resultado'
  );

  if ((!hasResponseResults || !hasValidResponseResults) && (!hasDirectResults || !hasValidDirectResults)) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      {!uiSettings.compactMode && (
        <h2 className="text-lg font-medium mb-4" style={{ color: 'var(--color-text-primary)' }}>
          📋 Resumen de Resultados
        </h2>
      )}
      
      <div className="space-y-6">
        {/* Resultados de Agentes de Respuesta (Mathpix OCR) */}
        {hasValidResponseResults && (
          <div>
            <h3 className="text-md font-medium mb-3" style={{ color: 'var(--color-text-primary)' }}>
              📄 Resultados Mathpix OCR
            </h3>
            <div className="space-y-4">
              {Object.entries(responseAgentsResults).map(([agentId, result]) => {
                const agent = agents.find(a => a.id === agentId);
                const agentName = agent ? agent.name : `Agente ${agentId}`;
                const reading = extractReadingField(result);
                
                // Solo mostrar si hay contenido válido
                if (!reading || reading === 'Sin resultado') {
                  return null;
                }

                return (
                  <div key={agentId} className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-green-800 dark:text-green-200">
                        {agentName}
                      </h4>
                      <div className="text-xs text-green-600 dark:text-green-400">
                        Lectura
                      </div>
                    </div>
                    
                    <div className="text-sm text-green-700 dark:text-green-300 whitespace-pre-wrap">
                      {reading}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Resultados de Agentes Directos */}
        {hasValidDirectResults && (
          <div>
            <h3 className="text-md font-medium mb-3" style={{ color: 'var(--color-text-primary)' }}>
              🚀 Resultados Agentes Directos
            </h3>
            <div className="space-y-4">
              {Object.entries(directAgentsResults).map(([agentId, result]) => {
                const agent = agents.find(a => a.id === agentId);
                const agentName = agent ? agent.name : `Agente ${agentId}`;
                const reading = extractReadingField(result);
                
                // Solo mostrar si hay contenido válido
                if (!reading || reading === 'Sin resultado') {
                  return null;
                }

                return (
                  <div key={agentId} className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                        {agentName}
                      </h4>
                      <div className="text-xs text-blue-600 dark:text-blue-400">
                        Lectura
                      </div>
                    </div>
                    
                    <div className="text-sm text-blue-700 dark:text-blue-300 whitespace-pre-wrap">
                      {reading}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      
      {/* Información adicional */}
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="flex items-center space-x-2">
          <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs text-blue-700 dark:text-blue-300">
            Mostrando solo el campo "lectura" de las respuestas de los agentes
          </span>
        </div>
      </div>
    </div>
  );
}
