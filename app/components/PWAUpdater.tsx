import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAUpdater() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    // Verificar si ya está instalada
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Escuchar el evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };

    // Escuchar el evento appinstalled
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Service Worker con actualización más agresiva
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        setRegistration(reg);
        
        // Forzar verificación de actualizaciones cada 30 segundos
        const checkForUpdates = () => {
          reg.update().then(() => {
            console.log('Service Worker update check completed');
          }).catch((error) => {
            console.log('Service Worker update check failed:', error);
          });
        };

        // Verificar actualizaciones inmediatamente y luego cada 30 segundos
        checkForUpdates();
        const updateInterval = setInterval(checkForUpdates, 30000);
        
        // Escuchar actualizaciones del service worker
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  setUpdateAvailable(true);
                } else {
                  // Primera instalación, recargar inmediatamente
                  window.location.reload();
                }
              }
            });
          }
        });

        // Limpiar intervalo al desmontar
        return () => clearInterval(updateInterval);
      });

      // Escuchar mensajes del service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'SW_UPDATE_AVAILABLE') {
          setUpdateAvailable(true);
        }
      });
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (installPrompt) {
      const result = await installPrompt.prompt();
      const choiceResult = await installPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('Usuario aceptó la instalación');
      } else {
        console.log('Usuario rechazó la instalación');
      }
      
      setInstallPrompt(null);
    }
  };

  const handleUpdate = () => {
    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  };

  // Mostrar prompt de instalación
  if (installPrompt && !isInstalled) {
    return (
      <div className="fixed bottom-20 left-4 right-4 z-50 bg-green-600 text-white p-4 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">📱 Instalar App</h3>
            <p className="text-sm opacity-90">Instala esta aplicación para una mejor experiencia</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleInstall}
              className="bg-white text-green-600 px-4 py-2 rounded font-medium hover:bg-gray-100 transition-colors"
            >
              Instalar
            </button>
            <button
              onClick={() => setInstallPrompt(null)}
              className="bg-gray-500 text-white px-4 py-2 rounded font-medium hover:bg-gray-600 transition-colors"
            >
              Ahora no
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Mostrar actualización disponible
  if (updateAvailable) {
    return (
      <div className="fixed bottom-20 left-4 right-4 z-50 bg-blue-600 text-white p-4 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Actualización disponible</h3>
            <p className="text-sm opacity-90">Hay una nueva versión de la aplicación disponible.</p>
          </div>
          <button
            onClick={handleUpdate}
            className="ml-4 bg-white text-blue-600 px-4 py-2 rounded font-medium hover:bg-gray-100 transition-colors"
          >
            Actualizar
          </button>
        </div>
      </div>
    );
  }

  return null;
}
