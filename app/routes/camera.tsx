import type { Route } from "./+types/camera";
import CameraTest from "../components/CameraTest";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Cámara - React Webcam Explorer" },
    { name: "description", content: "Página de prueba para funcionalidades de react-webcam con configuración avanzada" },
  ];
}

export default function Camera() {
  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: 'var(--color-background)' }}>
      {/* Header */}
      <div className="shadow-sm border-b px-4 py-4" style={{ 
        backgroundColor: 'var(--color-surface)', 
        borderColor: 'var(--color-border)' 
      }}>
        <h1 className="text-xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>📷 Prueba de Cámara</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
          Configuración avanzada para captura de fotos con react-webcam
        </p>
      </div>

      {/* Camera Test Component */}
      <div className="p-4">
        <CameraTest />
      </div>

      {/* Instructions */}
      <div className="px-4 mt-6">
        <h2 className="text-lg font-medium mb-3" style={{ color: 'var(--color-text-primary)' }}>Instrucciones de Uso</h2>
        <div className="space-y-2">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: 'var(--color-accent)' }}></div>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              Configura los parámetros de la cámara según tus necesidades
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: 'var(--color-accent)' }}></div>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              Ajusta el delay de enfoque para obtener mejores resultados
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: 'var(--color-accent)' }}></div>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              Ideal para capturar pantallas de notebook con celular para OCR
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: 'var(--color-accent)' }}></div>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              Desactiva "Image Smoothing" para mantener bordes más definidos
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
