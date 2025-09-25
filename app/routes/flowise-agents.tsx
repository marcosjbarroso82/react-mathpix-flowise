import type { Route } from "./+types/flowise-agents";
import { useState, useEffect } from "react";
import { useFlowiseAgents, type FlowiseAgent } from "../contexts/FlowiseAgentsContext";
import { usePrompts, type Prompt } from "../contexts/PromptsContext";
import { PageHeader } from "../components/PageHeader";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Flowise Agents - AI Agent Testing" },
    { name: "description", content: "Plataforma para probar y experimentar con agentes de Flowise AI" },
  ];
}

export default function FlowiseAgents() {
  const { agents, isLoading } = useFlowiseAgents();
  const { prompts } = usePrompts();
  const [selectedAgent, setSelectedAgent] = useState<string>('');
  const [selectedPrompt, setSelectedPrompt] = useState<string>('');
  const [question, setQuestion] = useState('');
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [filesError, setFilesError] = useState<string | null>(null);

  // Validación independiente (sin Mathpix)
  const validateFiles = (files: File[]): { validFiles: File[]; errors: string[] } => {
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/bmp',
      'image/webp'
    ];
    const maxSize = 10 * 1024 * 1024; // 10MB

    const validFiles: File[] = [];
    const errors: string[] = [];

    files.forEach((file) => {
      if (!allowedTypes.includes(file.type)) {
        errors.push(`${file.name}: Tipo no soportado (${file.type || 'desconocido'})`);
        return;
      }
      if (file.size > maxSize) {
        errors.push(`${file.name}: Excede 10MB`);
        return;
      }
      validFiles.push(file);
    });

    return { validFiles, errors };
  };

  const handleFilesSelected = (filesList: FileList | File[]) => {
    const incoming = Array.from(filesList);
    const { validFiles, errors } = validateFiles(incoming);
    setFilesError(errors.length > 0 ? `Algunos archivos fueron rechazados:\n${errors.join('\n')}` : null);
    if (validFiles.length > 0) {
      // Acumular con los ya seleccionados
      setSelectedFiles((prev) => [...prev, ...validFiles]);
    }
  };

  const removeFileAtIndex = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const clearFiles = () => {
    setSelectedFiles([]);
    setFilesError(null);
  };

  const fileToDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        if (typeof result === 'string') {
          resolve(result);
        } else {
          reject(new Error('No se pudo leer el archivo'));
        }
      };
      reader.onerror = () => reject(reader.error || new Error('Error leyendo el archivo'));
      reader.readAsDataURL(file);
    });
  };

  // Cargar prompt desde URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const promptParam = urlParams.get('prompt');
    if (promptParam) {
      setQuestion(promptParam);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAgent || !question.trim()) return;

    const agent = agents.find(a => a.id === selectedAgent);
    if (!agent) return;

    setIsLoadingResponse(true);
    setError(null);
    setResponse(null);

    try {
      let uploads: Array<{ type: 'file'; name: string; mime: string; data: string }> | undefined;
      if (selectedFiles.length > 0) {
        const dataUrls = await Promise.all(selectedFiles.map((f) => fileToDataURL(f)));
        uploads = selectedFiles.map((file, idx) => ({
          type: 'file',
          name: file.name,
          mime: file.type,
          data: dataUrls[idx]
        }));
      }

      const response = await fetch(agent.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(
          uploads && uploads.length > 0
            ? { question: question.trim(), uploads }
            : { question: question.trim() }
        )
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      setResponse(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoadingResponse(false);
    }
  };

  const clearChat = () => {
    setQuestion('');
    setResponse(null);
    setError(null);
    clearFiles();
  };

  const handlePromptSelect = (promptId: string) => {
    const prompt = prompts.find(p => p.id === promptId);
    if (prompt) {
      setQuestion(prompt.content);
      setSelectedPrompt(promptId);
    }
  };

  const handleCustomQuestion = () => {
    setSelectedPrompt('');
    setQuestion('');
  };

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: 'var(--color-background)' }}>
      {/* Header */}
      <PageHeader 
        title="Flowise Agents" 
        description="Plataforma para probar y experimentar con agentes de IA"
        icon="🤖"
      />

      {/* Main Content */}
      <div className="p-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Cargando agentes...</div>
          </div>
        ) : agents.length === 0 ? (
          /* No Agents State */
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-accent)' }}>
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
              No hay agentes configurados
            </h2>
            <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
              Ve a Configuración para agregar tu primer agente de Flowise
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <button 
                onClick={() => window.location.href = '/settings'}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200"
              >
                Ir a Configuración
              </button>
              {prompts.length > 0 && (
                <button 
                  onClick={() => window.location.href = '/prompts'}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors duration-200"
                >
                  Gestionar Prompts
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Chat Interface */
          <div className="space-y-4">
            {/* Agent Selection */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
                Seleccionar Agente
              </label>
              <select
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="">Selecciona un agente...</option>
                {agents.map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Prompt Selection */}
            {selectedAgent && prompts.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                    Seleccionar Prompt
                  </label>
                  <button
                    onClick={() => window.location.href = '/prompts'}
                    className="text-xs text-blue-600 hover:text-blue-700 underline"
                  >
                    Gestionar Prompts
                  </button>
                </div>
                <div className="space-y-2">
                  <select
                    value={selectedPrompt}
                    onChange={(e) => handlePromptSelect(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Selecciona un prompt...</option>
                    {prompts.map((prompt) => (
                      <option key={prompt.id} value={prompt.id}>
                        {prompt.name}
                      </option>
                    ))}
                  </select>
                  {selectedPrompt && (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleCustomQuestion}
                        className="text-xs text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 underline"
                      >
                        Escribir pregunta personalizada
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Chat Form */}
            {selectedAgent && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
                      Pregunta
                    </label>
                    <textarea
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="Escribe tu pregunta aquí..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                    />
                  </div>
                  {/* Adjuntar Imágenes (opcional) */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
                      Adjuntar Imágenes (opcional)
                    </label>
                    <div
                      className={`border-2 border-dashed rounded-md p-4 text-center ${isLoadingResponse ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-blue-400 dark:hover:border-blue-500'} border-gray-300 dark:border-gray-600`}
                      onDragOver={(ev) => { ev.preventDefault(); ev.stopPropagation(); }}
                      onDrop={(ev) => { ev.preventDefault(); ev.stopPropagation(); if (!isLoadingResponse && ev.dataTransfer.files) handleFilesSelected(ev.dataTransfer.files); }}
                      onClick={() => { if (!isLoadingResponse) { const input = document.getElementById('flowise-images-input') as HTMLInputElement | null; input?.click(); } }}
                    >
                      <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                        Arrastra imágenes aquí o haz clic para seleccionar
                      </p>
                      <p className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                        Tipos: JPG, PNG, GIF, BMP, WebP. Máx 10MB por archivo.
                      </p>
                      <input
                        id="flowise-images-input"
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        disabled={isLoadingResponse}
                        onChange={(e) => { if (e.target.files) { handleFilesSelected(e.target.files); e.target.value = ''; } }}
                      />
                    </div>
                    {filesError && (
                      <div className="mt-2 p-2 text-xs rounded-md" style={{ backgroundColor: 'rgba(220,38,38,0.1)', color: '#fca5a5' }}>
                        {filesError}
                      </div>
                    )}
                    {selectedFiles.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm" style={{ color: 'var(--color-text-primary)' }}>
                            {selectedFiles.length} imagen{selectedFiles.length !== 1 ? 'es' : ''} seleccionada{selectedFiles.length !== 1 ? 's' : ''}
                          </span>
                          <button
                            type="button"
                            onClick={clearFiles}
                            className="text-xs text-red-600 hover:text-red-700"
                          >
                            Limpiar imágenes
                          </button>
                        </div>
                        <ul className="text-xs space-y-1" style={{ color: 'var(--color-text-secondary)' }}>
                          {selectedFiles.map((f, idx) => (
                            <li key={`${f.name}-${idx}`} className="flex items-center justify-between">
                              <span className="truncate mr-2">{f.name} ({Math.round(f.size / 1024)} KB)</span>
                              <button
                                type="button"
                                onClick={() => removeFileAtIndex(idx)}
                                className="text-red-600 hover:text-red-700"
                                aria-label={`Eliminar ${f.name}`}
                              >
                                ✕
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      disabled={!question.trim() || isLoadingResponse}
                      className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-md transition-colors duration-200 flex items-center justify-center"
                    >
                      {isLoadingResponse ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Enviando...
                        </>
                      ) : (
                        'Enviar Pregunta'
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={clearChat}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors duration-200"
                    >
                      Limpiar
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Response Display */}
            {(response || error) && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--color-text-primary)' }}>
                  Respuesta
                </h3>
                {error ? (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm text-red-800 dark:text-red-200 font-medium">Error</span>
                    </div>
                    <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                      <div className="flex items-center space-x-2 mb-2">
                        <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm text-green-800 dark:text-green-200 font-medium">Respuesta exitosa</span>
                      </div>
                      <pre className="text-sm text-green-700 dark:text-green-300 whitespace-pre-wrap overflow-x-auto">
                        {JSON.stringify(response, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
