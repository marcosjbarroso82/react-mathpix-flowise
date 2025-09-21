import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface Prompt {
  id: string;
  name: string;
  content: string;
  createdAt: string;
}

// Valores por defecto
export const DEFAULT_PROMPTS: Prompt[] = [
  {
    id: 'default-1',
    name: 'Pregunta General',
    content: '¿Puedes ayudarme con una pregunta general?',
    createdAt: new Date().toISOString()
  },
  {
    id: 'default-2',
    name: 'Análisis de Texto',
    content: 'Analiza el siguiente texto y proporciona un resumen detallado:',
    createdAt: new Date().toISOString()
  },
  {
    id: 'default-3',
    name: 'Generación de Ideas',
    content: 'Genera ideas creativas para:',
    createdAt: new Date().toISOString()
  }
];

interface PromptsContextType {
  prompts: Prompt[];
  addPrompt: (prompt: Omit<Prompt, 'id' | 'createdAt'>) => void;
  updatePrompt: (id: string, prompt: Partial<Omit<Prompt, 'id' | 'createdAt'>>) => void;
  deletePrompt: (id: string) => void;
  isLoading: boolean;
}

const PromptsContext = createContext<PromptsContextType | undefined>(undefined);

interface PromptsProviderProps {
  children: ReactNode;
}

export function PromptsProvider({ children }: PromptsProviderProps) {
  const [prompts, setPrompts] = useState<Prompt[]>(DEFAULT_PROMPTS);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar prompts desde localStorage al inicializar
  useEffect(() => {
    try {
      const savedPrompts = localStorage.getItem('prompts');
      if (savedPrompts) {
        const parsedPrompts = JSON.parse(savedPrompts);
        setPrompts(parsedPrompts);
      }
    } catch (error) {
      console.error('Error loading prompts from localStorage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const savePromptsToStorage = (newPrompts: Prompt[]) => {
    try {
      localStorage.setItem('prompts', JSON.stringify(newPrompts));
    } catch (error) {
      console.error('Error saving prompts to localStorage:', error);
    }
  };

  const addPrompt = (prompt: Omit<Prompt, 'id' | 'createdAt'>) => {
    const newPrompt: Prompt = {
      ...prompt,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    const newPrompts = [...prompts, newPrompt];
    setPrompts(newPrompts);
    savePromptsToStorage(newPrompts);
  };

  const updatePrompt = (id: string, updates: Partial<Omit<Prompt, 'id' | 'createdAt'>>) => {
    const newPrompts = prompts.map(prompt => 
      prompt.id === id ? { ...prompt, ...updates } : prompt
    );
    setPrompts(newPrompts);
    savePromptsToStorage(newPrompts);
  };

  const deletePrompt = (id: string) => {
    const newPrompts = prompts.filter(prompt => prompt.id !== id);
    setPrompts(newPrompts);
    savePromptsToStorage(newPrompts);
  };

  const value: PromptsContextType = {
    prompts,
    addPrompt,
    updatePrompt,
    deletePrompt,
    isLoading
  };

  return (
    <PromptsContext.Provider value={value}>
      {children}
    </PromptsContext.Provider>
  );
}

export function usePrompts() {
  const context = useContext(PromptsContext);
  if (context === undefined) {
    throw new Error('usePrompts must be used within a PromptsProvider');
  }
  return context;
}
