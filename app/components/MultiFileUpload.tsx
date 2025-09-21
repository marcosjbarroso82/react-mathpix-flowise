import React, { useRef, useCallback, useState } from 'react';
import { MathpixService } from '../services/mathpixService';

interface MultiFileUploadProps {
  onFilesSelect: (files: File[]) => void;
  maxFiles: number;
  currentFileCount: number;
  isProcessing: boolean;
  disabled?: boolean;
}

export default function MultiFileUpload({ 
  onFilesSelect, 
  maxFiles, 
  currentFileCount, 
  isProcessing, 
  disabled = false 
}: MultiFileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const availableSlots = Math.max(0, maxFiles - currentFileCount);
  const canAddFiles = availableSlots > 0 && !disabled && !isProcessing;

  const validateAndSelectFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const validFiles: File[] = [];
    const errors: string[] = [];

    fileArray.forEach(file => {
      const validation = MathpixService.validateImageFile(file);
      if (validation.valid) {
        validFiles.push(file);
      } else {
        errors.push(`${file.name}: ${validation.error}`);
      }
    });

    if (errors.length > 0) {
      alert(`Algunos archivos no son válidos:\n${errors.join('\n')}`);
    }

    if (validFiles.length > 0) {
      const filesToSelect = validFiles.slice(0, availableSlots);
      onFilesSelect(filesToSelect);

      if (filesToSelect.length < validFiles.length) {
        alert(`Se seleccionaron ${filesToSelect.length} de ${validFiles.length} archivos válidos debido al límite de ${maxFiles} imágenes.`);
      }
    }
  }, [onFilesSelect, availableSlots, maxFiles]);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      validateAndSelectFiles(event.target.files);
    }
    // Reset input value para permitir seleccionar los mismos archivos otra vez
    event.target.value = '';
  }, [validateAndSelectFiles]);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
    
    if (!canAddFiles) return;

    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      validateAndSelectFiles(files);
    }
  }, [validateAndSelectFiles, canAddFiles]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleDragEnter = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (canAddFiles) {
      setDragActive(true);
    }
  }, [canAddFiles]);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
  }, []);

  const handleClick = useCallback(() => {
    if (canAddFiles && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [canAddFiles]);

  const getStatusMessage = () => {
    if (isProcessing) return 'Procesando...';
    if (disabled) return 'Deshabilitado';
    if (availableSlots === 0) return `Máximo ${maxFiles} imágenes alcanzado`;
    return `Selecciona hasta ${availableSlots} imagen${availableSlots !== 1 ? 'es' : ''} más`;
  };

  const getStatusColor = () => {
    if (isProcessing) return 'text-blue-600';
    if (disabled || availableSlots === 0) return 'text-gray-500';
    return 'text-gray-700';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium" style={{ color: 'var(--color-text-primary)' }}>
          Subir Múltiples Imágenes
        </h2>
        <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          {currentFileCount}/{maxFiles} imágenes
        </div>
      </div>
      
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
          !canAddFiles
            ? 'border-gray-300 dark:border-gray-600 cursor-not-allowed opacity-50'
            : dragActive
            ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 cursor-pointer'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
          !canAddFiles ? 'bg-gray-100 dark:bg-gray-700' : 'bg-blue-100 dark:bg-blue-900/30'
        }`}>
          <svg 
            className={`w-8 h-8 ${!canAddFiles ? 'text-gray-400' : 'text-blue-600 dark:text-blue-400'}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 12l3 3m0 0l3-3m-3 3V9" 
            />
          </svg>
        </div>
        
        <p className={`text-lg font-medium mb-2`} style={{ 
          color: !canAddFiles ? 'var(--color-text-secondary)' : 'var(--color-text-primary)' 
        }}>
          {dragActive ? 'Suelta las imágenes aquí' : 'Arrastra imágenes aquí o haz clic para seleccionar'}
        </p>
        
        <p className={`text-sm mb-4 ${getStatusColor()}`}>
          {getStatusMessage()}
        </p>

        <p className="text-xs mb-4" style={{ color: 'var(--color-text-secondary)' }}>
          Soporta JPG, PNG, GIF, BMP, WebP y PDF (máximo 10MB por archivo)
        </p>
        
        <button 
          className={`px-6 py-2 rounded-lg transition-colors duration-200 ${
            !canAddFiles
              ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
          disabled={!canAddFiles}
          type="button"
        >
          {isProcessing ? 'Procesando...' : 'Seleccionar Archivos'}
        </button>
      </div>

      {/* Current file count indicator */}
      {currentFileCount > 0 && (
        <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-green-800 dark:text-green-200 font-medium">
              {currentFileCount} imagen{currentFileCount !== 1 ? 'es' : ''} seleccionada{currentFileCount !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf"
        multiple
        onChange={handleFileChange}
        className="hidden"
        disabled={!canAddFiles}
      />
    </div>
  );
}
