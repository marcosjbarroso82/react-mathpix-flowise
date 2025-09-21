import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface FlowiseAgent {
  id: string;
  name: string;
  url: string;
}

// Valores por defecto
export const DEFAULT_FLOWISE_AGENTS: FlowiseAgent[] = [];

interface FlowiseAgentsContextType {
  agents: FlowiseAgent[];
  addAgent: (agent: Omit<FlowiseAgent, 'id'>) => void;
  updateAgent: (id: string, agent: Partial<Omit<FlowiseAgent, 'id'>>) => void;
  deleteAgent: (id: string) => void;
  isLoading: boolean;
}

const FlowiseAgentsContext = createContext<FlowiseAgentsContextType | undefined>(undefined);

interface FlowiseAgentsProviderProps {
  children: ReactNode;
}

export function FlowiseAgentsProvider({ children }: FlowiseAgentsProviderProps) {
  const [agents, setAgents] = useState<FlowiseAgent[]>(DEFAULT_FLOWISE_AGENTS);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar agentes desde localStorage al inicializar
  useEffect(() => {
    try {
      const savedAgents = localStorage.getItem('flowise-agents');
      if (savedAgents) {
        const parsedAgents = JSON.parse(savedAgents);
        setAgents(parsedAgents);
      }
    } catch (error) {
      console.error('Error loading Flowise agents from localStorage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveAgentsToStorage = (newAgents: FlowiseAgent[]) => {
    try {
      localStorage.setItem('flowise-agents', JSON.stringify(newAgents));
    } catch (error) {
      console.error('Error saving Flowise agents to localStorage:', error);
    }
  };

  const addAgent = (agent: Omit<FlowiseAgent, 'id'>) => {
    const newAgent: FlowiseAgent = {
      ...agent,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    };
    const newAgents = [...agents, newAgent];
    setAgents(newAgents);
    saveAgentsToStorage(newAgents);
  };

  const updateAgent = (id: string, updates: Partial<Omit<FlowiseAgent, 'id'>>) => {
    const newAgents = agents.map(agent => 
      agent.id === id ? { ...agent, ...updates } : agent
    );
    setAgents(newAgents);
    saveAgentsToStorage(newAgents);
  };

  const deleteAgent = (id: string) => {
    const newAgents = agents.filter(agent => agent.id !== id);
    setAgents(newAgents);
    saveAgentsToStorage(newAgents);
  };

  const value: FlowiseAgentsContextType = {
    agents,
    addAgent,
    updateAgent,
    deleteAgent,
    isLoading
  };

  return (
    <FlowiseAgentsContext.Provider value={value}>
      {children}
    </FlowiseAgentsContext.Provider>
  );
}

export function useFlowiseAgents() {
  const context = useContext(FlowiseAgentsContext);
  if (context === undefined) {
    throw new Error('useFlowiseAgents must be used within a FlowiseAgentsProvider');
  }
  return context;
}
