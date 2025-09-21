import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface MultiOCRWorkflowConfig {
  questionCompilerAgentId: string;
  responseAgentIds: string[];
  maxImages: number;
}

export interface ImageItem {
  id: string;
  file: File;
  name: string;
  size: number;
  status: 'pending' | 'processing' | 'completed' | 'error';
  ocrResult?: {
    status: number;
    data: any;
    error?: string;
  };
}

export interface WorkflowStep {
  id: string;
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  startTime?: Date;
  endTime?: Date;
  result?: any;
  error?: string;
}

// Valores por defecto
export const DEFAULT_MULTI_OCR_WORKFLOW_CONFIG: MultiOCRWorkflowConfig = {
  questionCompilerAgentId: '',
  responseAgentIds: [],
  maxImages: 3,
};

interface MultiOCRWorkflowContextType {
  config: MultiOCRWorkflowConfig;
  updateConfig: (newConfig: Partial<MultiOCRWorkflowConfig>) => void;
  saveConfig: (newConfig: MultiOCRWorkflowConfig) => void;
  resetToDefaults: () => void;
  isLoading: boolean;
  
  // Workflow state
  images: ImageItem[];
  addImages: (files: File[]) => void;
  removeImage: (id: string) => void;
  clearImages: () => void;
  updateImageStatus: (id: string, status: ImageItem['status'], ocrResult?: ImageItem['ocrResult']) => void;
  
  // Workflow steps
  workflowSteps: WorkflowStep[];
  updateWorkflowStep: (id: string, updates: Partial<WorkflowStep>) => void;
  initializeWorkflowSteps: () => void;
  resetWorkflow: () => void;
  
  // Results
  compiledOCRText: string;
  setCompiledOCRText: (text: string) => void;
  questionCompilerResult: any;
  setQuestionCompilerResult: (result: any) => void;
  responseAgentsResults: { [agentId: string]: any };
  setResponseAgentResult: (agentId: string, result: any) => void;
  clearResults: () => void;
}

const MultiOCRWorkflowContext = createContext<MultiOCRWorkflowContextType | undefined>(undefined);

interface MultiOCRWorkflowProviderProps {
  children: ReactNode;
}

export function MultiOCRWorkflowProvider({ children }: MultiOCRWorkflowProviderProps) {
  const [config, setConfig] = useState<MultiOCRWorkflowConfig>(DEFAULT_MULTI_OCR_WORKFLOW_CONFIG);
  const [isLoading, setIsLoading] = useState(true);
  
  // Workflow state
  const [images, setImages] = useState<ImageItem[]>([]);
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([]);
  
  // Results
  const [compiledOCRText, setCompiledOCRText] = useState<string>('');
  const [questionCompilerResult, setQuestionCompilerResult] = useState<any>(null);
  const [responseAgentsResults, setResponseAgentsResults] = useState<{ [agentId: string]: any }>({});

  // Cargar configuración desde localStorage al inicializar
  useEffect(() => {
    try {
      const savedConfig = localStorage.getItem('multi-ocr-workflow-config');
      if (savedConfig) {
        const parsedConfig = JSON.parse(savedConfig);
        setConfig(prev => ({
          ...DEFAULT_MULTI_OCR_WORKFLOW_CONFIG,
          ...parsedConfig
        }));
      }
    } catch (error) {
      console.error('Error loading Multi-OCR Workflow config from localStorage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateConfig = (newConfig: Partial<MultiOCRWorkflowConfig>) => {
    setConfig(prev => ({
      ...prev,
      ...newConfig
    }));
  };

  const saveConfig = (newConfig: MultiOCRWorkflowConfig) => {
    setConfig(newConfig);
    // Guardar inmediatamente en localStorage
    try {
      localStorage.setItem('multi-ocr-workflow-config', JSON.stringify(newConfig));
    } catch (error) {
      console.error('Error saving Multi-OCR Workflow config to localStorage:', error);
    }
  };

  const resetToDefaults = () => {
    setConfig(DEFAULT_MULTI_OCR_WORKFLOW_CONFIG);
    try {
      localStorage.removeItem('multi-ocr-workflow-config');
    } catch (error) {
      console.error('Error removing Multi-OCR Workflow config from localStorage:', error);
    }
  };

  // Image management
  const addImages = (files: File[]) => {
    const maxImages = config.maxImages || 3;
    const currentCount = images.length;
    const availableSlots = Math.max(0, maxImages - currentCount);
    const filesToAdd = files.slice(0, availableSlots);
    
    const newImages: ImageItem[] = filesToAdd.map(file => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      file,
      name: file.name,
      size: file.size,
      status: 'pending'
    }));
    
    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const clearImages = () => {
    setImages([]);
  };

  const updateImageStatus = (id: string, status: ImageItem['status'], ocrResult?: ImageItem['ocrResult']) => {
    setImages(prev => prev.map(img => 
      img.id === id 
        ? { ...img, status, ...(ocrResult && { ocrResult }) }
        : img
    ));
  };

  // Workflow steps management
  const initializeWorkflowSteps = () => {
    const steps: WorkflowStep[] = [
      {
        id: 'ocr-processing',
        name: 'Procesamiento OCR de imágenes',
        status: 'pending'
      },
      {
        id: 'ocr-compilation',
        name: 'Compilación de resultados OCR',
        status: 'pending'
      },
      {
        id: 'question-compiler',
        name: 'Procesamiento con agente compilador',
        status: 'pending'
      },
      {
        id: 'response-agents',
        name: 'Procesamiento con agentes de respuesta',
        status: 'pending'
      }
    ];
    setWorkflowSteps(steps);
  };

  const updateWorkflowStep = (id: string, updates: Partial<WorkflowStep>) => {
    setWorkflowSteps(prev => prev.map(step =>
      step.id === id ? { ...step, ...updates } : step
    ));
  };

  const resetWorkflow = () => {
    setWorkflowSteps([]);
    clearImages();
    clearResults();
  };

  const setResponseAgentResult = (agentId: string, result: any) => {
    setResponseAgentsResults(prev => ({
      ...prev,
      [agentId]: result
    }));
  };

  const clearResults = () => {
    setCompiledOCRText('');
    setQuestionCompilerResult(null);
    setResponseAgentsResults({});
  };

  const value: MultiOCRWorkflowContextType = {
    config,
    updateConfig,
    saveConfig,
    resetToDefaults,
    isLoading,
    
    // Workflow state
    images,
    addImages,
    removeImage,
    clearImages,
    updateImageStatus,
    
    // Workflow steps
    workflowSteps,
    updateWorkflowStep,
    initializeWorkflowSteps,
    resetWorkflow,
    
    // Results
    compiledOCRText,
    setCompiledOCRText,
    questionCompilerResult,
    setQuestionCompilerResult,
    responseAgentsResults,
    setResponseAgentResult,
    clearResults
  };

  return (
    <MultiOCRWorkflowContext.Provider value={value}>
      {children}
    </MultiOCRWorkflowContext.Provider>
  );
}

export function useMultiOCRWorkflow() {
  const context = useContext(MultiOCRWorkflowContext);
  if (context === undefined) {
    throw new Error('useMultiOCRWorkflow must be used within a MultiOCRWorkflowProvider');
  }
  return context;
}
