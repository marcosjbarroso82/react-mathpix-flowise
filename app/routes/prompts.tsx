import type { Route } from "./+types/prompts";
import { useState } from "react";
import { usePrompts, type Prompt } from "../contexts/PromptsContext";
import { PageHeader } from "../components/PageHeader";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Prompts - Gestión de Plantillas" },
    { name: "description", content: "Gestiona tus prompts reutilizables para agentes de IA" },
  ];
}

export default function Prompts() {
  const { prompts, addPrompt, updatePrompt, deletePrompt } = usePrompts();
  const [isAddingPrompt, setIsAddingPrompt] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<string | null>(null);
  const [newPrompt, setNewPrompt] = useState({ name: '', content: '' });
  const [editPrompt, setEditPrompt] = useState({ name: '', content: '' });

  const handleAddPrompt = () => {
    if (newPrompt.name.trim() && newPrompt.content.trim()) {
      addPrompt({
        name: newPrompt.name.trim(),
        content: newPrompt.content.trim()
      });
      setNewPrompt({ name: '', content: '' });
      setIsAddingPrompt(false);
    }
  };

  const handleEditPrompt = (prompt: Prompt) => {
    setEditingPrompt(prompt.id);
    setEditPrompt({ 
      name: prompt.name, 
      content: prompt.content
    });
  };

  const handleSaveEdit = () => {
    if (editingPrompt && editPrompt.name.trim() && editPrompt.content.trim()) {
      updatePrompt(editingPrompt, {
        name: editPrompt.name.trim(),
        content: editPrompt.content.trim()
      });
      setEditingPrompt(null);
      setEditPrompt({ name: '', content: '' });
    }
  };

  const handleCancelEdit = () => {
    setEditingPrompt(null);
    setEditPrompt({ name: '', content: '' });
  };

  const handleDeletePrompt = (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este prompt?')) {
      deletePrompt(id);
    }
  };

  const handleUsePrompt = (prompt: Prompt) => {
    // Navegar a flowise-agents con el prompt pre-cargado
    const params = new URLSearchParams({ prompt: prompt.content });
    window.location.href = `/flowise-agents?${params.toString()}`;
  };

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: 'var(--color-background)' }}>
      {/* Header */}
      <PageHeader 
        title="Prompts" 
        description="Gestiona tus prompts reutilizables para agentes de IA"
        icon="📝"
      />

      {/* Main Content */}
      <div className="p-4">
        {/* Header with Add Button */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium" style={{ color: 'var(--color-text-primary)' }}>
                Mis Prompts ({prompts.length})
              </h2>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                Gestiona tus prompts reutilizables
              </p>
            </div>
            <button
              onClick={() => setIsAddingPrompt(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Nuevo Prompt</span>
            </button>
          </div>
        </div>

        {/* Add/Edit Prompt Form */}
        {(isAddingPrompt || editingPrompt) && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
            <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--color-text-primary)' }}>
              {isAddingPrompt ? 'Agregar Nuevo Prompt' : 'Editar Prompt'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text-primary)' }}>
                  Nombre del Prompt
                </label>
                <input
                  type="text"
                  value={isAddingPrompt ? newPrompt.name : editPrompt.name}
                  onChange={(e) => isAddingPrompt 
                    ? setNewPrompt(prev => ({ ...prev, name: e.target.value }))
                    : setEditPrompt(prev => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Mi Prompt Personalizado"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text-primary)' }}>
                  Contenido del Prompt
                </label>
                <textarea
                  value={isAddingPrompt ? newPrompt.content : editPrompt.content}
                  onChange={(e) => isAddingPrompt 
                    ? setNewPrompt(prev => ({ ...prev, content: e.target.value }))
                    : setEditPrompt(prev => ({ ...prev, content: e.target.value }))
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                  placeholder="Escribe aquí el contenido de tu prompt..."
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={isAddingPrompt ? handleAddPrompt : handleSaveEdit}
                  disabled={isAddingPrompt 
                    ? !newPrompt.name.trim() || !newPrompt.content.trim()
                    : !editPrompt.name.trim() || !editPrompt.content.trim()
                  }
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-md transition-colors duration-200"
                >
                  {isAddingPrompt ? 'Agregar Prompt' : 'Guardar Cambios'}
                </button>
                <button
                  onClick={() => {
                    if (isAddingPrompt) {
                      setIsAddingPrompt(false);
                      setNewPrompt({ name: '', content: '' });
                    } else {
                      handleCancelEdit();
                    }
                  }}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors duration-200"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Prompts List */}
        <div className="space-y-4">
          {prompts.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-accent)' }}>
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
              No hay prompts creados
            </h2>
            <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
              Crea tu primer prompt para empezar
            </p>
              <button
                onClick={() => setIsAddingPrompt(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200"
              >
                Crear Primer Prompt
              </button>
            </div>
          ) : (
            prompts.map((prompt) => (
              <div
                key={prompt.id}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700"
              >
                {editingPrompt === prompt.id ? (
                  // Edit mode - handled above
                  <div></div>
                ) : (
                  // View mode
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-sm mb-1" style={{ color: 'var(--color-text-primary)' }}>
                          {prompt.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {prompt.content}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          Creado: {new Date(prompt.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleUsePrompt(prompt)}
                          className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-md transition-colors duration-200"
                          title="Usar este prompt"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleEditPrompt(prompt)}
                          className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors duration-200"
                          title="Editar prompt"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeletePrompt(prompt.id)}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors duration-200"
                          title="Eliminar prompt"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
