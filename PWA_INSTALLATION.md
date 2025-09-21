# Instalación como PWA (Progressive Web App)

Tu aplicación React MathPix Flowise ahora está configurada como una PWA (Progressive Web App) y se puede instalar en dispositivos móviles y escritorio.

## 📱 Cómo instalar la PWA

### En Android (Chrome/Edge):
1. Abre la aplicación en tu navegador móvil
2. Toca el menú de tres puntos (⋮) en la esquina superior derecha
3. Selecciona "Instalar aplicación" o "Agregar a pantalla de inicio"
4. Confirma la instalación tocando "Instalar"

### En iOS (Safari):
1. Abre la aplicación en Safari
2. Toca el botón de compartir (cuadrado con flecha hacia arriba)
3. Desplázate hacia abajo y selecciona "Agregar a pantalla de inicio"
4. Toca "Agregar" para confirmar

### En Windows (Edge/Chrome):
1. Abre la aplicación en tu navegador
2. Busca el ícono de instalación en la barra de direcciones o en el menú
3. Haz clic en "Instalar" cuando aparezca la notificación
4. Confirma la instalación

### En macOS (Safari/Chrome):
1. Abre la aplicación en tu navegador
2. En Safari: Archivo → "Agregar a pantalla de inicio"
3. En Chrome: Busca el ícono de instalación en la barra de direcciones

## ✨ Características PWA

- **Instalable**: Se puede instalar como una aplicación nativa
- **Offline**: Funciona sin conexión a internet (con cache)
- **Responsive**: Se adapta a diferentes tamaños de pantalla
- **Actualizaciones automáticas**: Se actualiza automáticamente cuando hay nuevas versiones
- **Iconos personalizados**: Iconos específicos para la aplicación
- **Pantalla completa**: Se ejecuta en modo standalone sin la barra del navegador

## 🔧 Configuración técnica

La PWA incluye:
- **Manifest**: Define la apariencia y comportamiento de la app
- **Service Worker**: Maneja el cache y las actualizaciones
- **Iconos**: Múltiples tamaños para diferentes dispositivos
- **Meta tags**: Optimización para dispositivos móviles

## 🚀 Despliegue

Para desplegar la PWA:

```bash
npm run build
npm run deploy
```

La aplicación estará disponible en GitHub Pages y se podrá instalar como PWA desde cualquier dispositivo.

## 📝 Notas importantes

- La PWA requiere HTTPS en producción
- Los usuarios recibirán notificaciones cuando haya actualizaciones disponibles
- La aplicación se puede usar offline una vez instalada
- Los datos se almacenan localmente en el dispositivo
