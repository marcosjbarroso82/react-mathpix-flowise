import React from 'react';

interface OCRResultsProps {
  result: {
    status: number;
    data: any;
    error?: string;
    request?: {
      url: string;
      method: string;
      headers: Record<string, string>;
      body: FormData;
      parameters: Record<string, any>;
    };
  } | null;
  isProcessing: boolean;
  selectedFile: File | null;
  error: string | null;
  onClearResult: () => void;
  onClearError: () => void;
}

export default function OCRResults({
  result,
  isProcessing,
  selectedFile,
  error,
  onClearResult,
  onClearError
}: OCRResultsProps) {
  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'text-green-600 dark:text-green-400';
    if (status >= 400 && status < 500) return 'text-yellow-600 dark:text-yellow-400';
    if (status >= 500) return 'text-red-600 dark:text-red-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  const getStatusIcon = (status: number) => {
    if (status >= 200 && status < 300) return '✅';
    if (status >= 400 && status < 500) return '⚠️';
    if (status >= 500) return '❌';
    return '❓';
  };

  const formatResponseData = (data: any): string => {
    if (typeof data === 'string') {
      return data;
    }
    
    if (typeof data === 'object' && data !== null) {
      return JSON.stringify(data, null, 2);
    }
    
    return String(data);
  };

  if (isProcessing) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
        <h2 className="text-lg font-medium mb-4" style={{ color: 'var(--color-text-primary)' }}>
          Procesando Imagen
        </h2>
        
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center animate-spin" style={{ backgroundColor: 'var(--color-accent)' }}>
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <p className="text-lg font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
            Analizando imagen con Mathpix...
          </p>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            {selectedFile?.name}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium" style={{ color: 'var(--color-text-primary)' }}>
            Error en el Procesamiento
          </h2>
          <button
            onClick={onClearError}
            className="px-3 py-1 text-sm bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors duration-200"
          >
            Cerrar
          </button>
        </div>
        
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-medium text-red-800 dark:text-red-200">
                Error
              </h4>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                {error}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
        <h2 className="text-lg font-medium mb-4" style={{ color: 'var(--color-text-primary)' }}>
          Resultados del OCR
        </h2>
        
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-700">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
            Los resultados del reconocimiento aparecerán aquí
          </p>
          <div className="text-xs px-3 py-1 rounded-full inline-block bg-gray-100 dark:bg-gray-700" style={{ color: 'var(--color-text-secondary)' }}>
            Sube una imagen para empezar
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium" style={{ color: 'var(--color-text-primary)' }}>
          Resultados del OCR
        </h2>
        <button
          onClick={onClearResult}
          className="px-3 py-1 text-sm bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors duration-200"
        >
          Limpiar
        </button>
      </div>

      {/* Status Code */}
      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
            Status Code:
          </span>
          <span className={`text-sm font-mono px-2 py-1 rounded ${getStatusColor(result.status)}`}>
            {getStatusIcon(result.status)} {result.status}
          </span>
        </div>
      </div>

      {/* Request Information */}
      {result.request && (
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
            Información de la Request:
          </h3>
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-3">
            {/* URL y Método */}
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">URL:</span>
                <span className="text-xs font-mono text-blue-600 dark:text-blue-400 break-all">
                  {result.request.method} {result.request.url}
                </span>
              </div>
            </div>

            {/* Headers */}
            <div>
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1">Headers:</span>
              <div className="bg-white dark:bg-gray-800 rounded p-2">
                <pre className="text-xs font-mono whitespace-pre-wrap" style={{ color: 'var(--color-text-secondary)' }}>
                  {JSON.stringify(result.request.headers, null, 2)}
                </pre>
              </div>
            </div>

            {/* Parámetros */}
            <div>
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1">Parámetros:</span>
              <div className="bg-white dark:bg-gray-800 rounded p-2">
                <pre className="text-xs font-mono whitespace-pre-wrap" style={{ color: 'var(--color-text-secondary)' }}>
                  {JSON.stringify(result.request.parameters, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Response Body */}
      <div>
        <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
          Respuesta de la API:
        </h3>
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 overflow-auto max-h-96">
          <pre className="text-xs font-mono whitespace-pre-wrap" style={{ color: 'var(--color-text-secondary)' }}>
            {formatResponseData(result.data)}
          </pre>
        </div>
      </div>

      {/* File Info */}
      {selectedFile && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            <span>Archivo procesado:</span>
            <span className="font-medium">{selectedFile.name}</span>
            <span>({(selectedFile.size / 1024).toFixed(1)} KB)</span>
          </div>
        </div>
      )}
    </div>
  );
}
