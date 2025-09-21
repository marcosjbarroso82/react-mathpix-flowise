import React, { useRef, useCallback } from 'react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
  disabled?: boolean;
}

export default function FileUpload({ onFileSelect, isProcessing, disabled = false }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (disabled || isProcessing) return;

    const file = event.dataTransfer.files[0];
    if (file) {
      onFileSelect(file);
    }
  }, [onFileSelect, disabled, isProcessing]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleClick = useCallback(() => {
    if (!disabled && !isProcessing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [disabled, isProcessing]);

  const isDisabled = disabled || isProcessing;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
      <h2 className="text-lg font-medium mb-4" style={{ color: 'var(--color-text-primary)' }}>
        Subir Imagen
      </h2>
      
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
          isDisabled
            ? 'border-gray-300 dark:border-gray-600 cursor-not-allowed opacity-50'
            : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 cursor-pointer'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={handleClick}
      >
        <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
          isDisabled ? 'bg-gray-100 dark:bg-gray-700' : 'bg-blue-100 dark:bg-blue-900/30'
        }`}>
          <svg className={`w-8 h-8 ${isDisabled ? 'text-gray-400' : 'text-blue-600 dark:text-blue-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        
        <p className={`text-lg font-medium mb-2 ${isDisabled ? 'text-gray-400' : ''}`} style={{ color: isDisabled ? 'var(--color-text-secondary)' : 'var(--color-text-primary)' }}>
          {isProcessing ? 'Procesando...' : 'Arrastra una imagen aquí o haz clic para seleccionar'}
        </p>
        
        <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
          Soporta JPG, PNG, GIF, BMP, WebP y PDF (máximo 10MB)
        </p>
        
        <button 
          className={`px-6 py-2 rounded-lg transition-colors duration-200 ${
            isDisabled
              ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
          disabled={isDisabled}
          type="button"
        >
          {isProcessing ? 'Procesando...' : 'Seleccionar Archivo'}
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf"
        onChange={handleFileChange}
        className="hidden"
        disabled={isDisabled}
      />
    </div>
  );
}
