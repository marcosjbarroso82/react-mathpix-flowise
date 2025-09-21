# React Flowise Agents Platform

Una plataforma base para probar y experimentar con agentes de Flowise AI. Este proyecto combina funcionalidades de captura de imágenes con `react-webcam` y procesamiento OCR con la API de Mathpix, además de proporcionar una base sólida para integrar agentes de Flowise.

## 🎯 Objetivo

Este proyecto sirve como una plataforma completa para:
- **Probar agentes de Flowise AI** - Interfaz principal para conectar y experimentar con agentes
- **Funcionalidades de OCR** - Reconocimiento de texto y fórmulas matemáticas con Mathpix
- **Captura de imágenes** - Usando react-webcam para capturas en tiempo real
- **Base extensible** - Arquitectura preparada para integrar nuevas funcionalidades de IA

## 🚀 Características Implementadas

### 🤖 **Página de Flowise Agents** (`/`)
- **Interfaz principal** para probar agentes de Flowise AI
- **Configuración de endpoints** de Flowise (próximamente)
- **Interfaz de chat** con agentes (próximamente)
- **Análisis de resultados** y métricas (próximamente)
- **Base sólida** para integración con Flowise

### 🔍 **Página de OCR** (`/ocr`)
- **Subida de archivos** para procesamiento con Mathpix API
- **Captura con cámara** integrada usando react-webcam
- **Procesamiento de imágenes** con reconocimiento de texto y fórmulas
- **Múltiples formatos de salida**:
  - Texto plano extraído
  - Fórmulas en formato LaTeX
  - Representación MathML
- **Interfaz intuitiva** para gestión de archivos y resultados
- **Configuración de API** para credenciales de Mathpix

### 📷 **Página de Cámara** (`/camera`)
- **Vista previa en tiempo real** de la cámara con configuración personalizable
- **Captura de fotos** con delay de enfoque configurable
- **Información detallada de la cámara** incluyendo:
  - Resoluciones soportadas (ancho/alto)
  - Configuración actual (resolución, cámara, FPS, dispositivo)
  - Capacidades adicionales (zoom, enfoque, balance de blancos, exposición)
- **Configuración avanzada** de parámetros:
  - Resolución de video (ancho x alto)
  - Cámara frontal/trasera (facingMode)
  - Force Screenshot Source Size
  - Image Smoothing (para mantener bordes definidos)
  - Calidad de captura (0.1 - 1.0)
  - Formato de imagen (JPEG/PNG)
  - Delay de enfoque (0-5 segundos)
- **Información de imagen capturada**:
  - Formato de la imagen
  - Dimensiones (ancho x alto)
  - Tamaño del archivo en bytes/KB
- **Manejo de errores** con mensajes informativos
- **Optimizado para OCR** con configuración específica para captura de pantallas

### 🖼️ **Galería** (`/gallery`)
- Interfaz preparada para mostrar imágenes procesadas y sus resultados OCR
- Diseño responsive con grid de imágenes
- Estado vacío con instrucciones de uso
- Funcionalidades planificadas documentadas

### ⚙️ **Configuración** (`/settings`)
- **Configuración de cámara** completa con todos los parámetros
- **Configuración de Mathpix API**:
  - App ID y App Key
  - Formatos de salida preferidos
  - Opciones de procesamiento
- **Configuración avanzada** adicional:
  - Auto-focus
  - Estabilización
  - Guardado automático
- **Persistencia** de configuraciones en localStorage
- **Botón de restablecimiento** a valores por defecto

### ℹ️ **Acerca de** (`/about`)
- Información completa del proyecto
- Documentación sobre Mathpix API
- Guía de configuración de API
- Lista de funcionalidades a explorar
- Enlaces a recursos útiles

## 🛠️ Tecnologías Utilizadas

- **React 19** - Framework principal
- **React Router 7** - Enrutamiento
- **TypeScript** - Tipado estático
- **TailwindCSS 4** - Estilos y diseño responsive
- **Flowise AI** - Plataforma de agentes de IA (integración futura)
- **Mathpix API** - Reconocimiento de texto y fórmulas matemáticas
- **react-webcam 7.2.0** - Funcionalidad de cámara web
- **Vite** - Herramienta de construcción
- **gh-pages** - Despliegue en GitHub Pages

## 📦 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- Navegador moderno con soporte para WebRTC
- Cámara web o dispositivo móvil con cámara (para funcionalidades de OCR)
- Cuenta de Mathpix con App ID y App Key (opcional, para funcionalidades de OCR)
- Instancia de Flowise (opcional, para funcionalidades de agentes)

### Instalación
```bash
# Clonar el repositorio
git clone <repository-url>
cd react-mathpix-flowise

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

### Configuración de Mathpix API

1. Regístrate en [mathpix.com](https://mathpix.com)
2. Obtén tu App ID y App Key desde el dashboard
3. Configura las credenciales en la página de Configuración de la aplicación

### Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Iniciar servidor de desarrollo

# Construcción
npm run build        # Crear build de producción
npm run start        # Servir build de producción

# Despliegue
npm run predeploy    # Ejecutar build antes del despliegue
npm run deploy       # Desplegar a GitHub Pages

# Utilidades
npm run typecheck    # Verificar tipos de TypeScript
```

## 📱 Estructura del Proyecto

```
app/
├── components/
│   ├── BottomNavigation.tsx      # Navegación inferior fija
│   ├── CameraSettings.tsx        # Componente de configuración de cámara
│   └── CameraTest.tsx           # Componente principal de prueba de cámara
├── contexts/
│   ├── CameraSettingsContext.tsx # Contexto global para configuración de cámara
│   └── ThemeContext.tsx         # Contexto de tema (claro/oscuro)
├── routes/
│   ├── flowise-agents.tsx       # Página principal de Flowise Agents (/)
│   ├── ocr.tsx                  # Página de OCR (/ocr)
│   ├── camera.tsx               # Página de cámara (/camera)
│   ├── gallery.tsx              # Galería de capturas (/gallery)
│   ├── settings.tsx             # Configuraciones (/settings)
│   └── about.tsx                # Información del proyecto (/about)
├── app.css                      # Estilos globales y variables CSS
└── root.tsx                     # Componente raíz de la aplicación
```

## ⚙️ Configuración

### Configuración de Flowise (Próximamente)
- **Endpoint de Flowise** - URL de tu instancia de Flowise
- **API Key** - Clave de autenticación para Flowise
- **Configuración de Agentes** - Selección y configuración de agentes específicos

### Configuración de Mathpix API (Opcional)
| Parámetro | Descripción | Requerido |
|-----------|-------------|-----------|
| `appId` | ID de aplicación de Mathpix | Sí (para OCR) |
| `appKey` | Clave de aplicación de Mathpix | Sí (para OCR) |
| `outputFormats` | Formatos de salida deseados | No |
| `includeMath` | Incluir reconocimiento de fórmulas | No |

### Configuración de Cámara

| Parámetro | Descripción | Valores | Por Defecto |
|-----------|-------------|---------|-------------|
| `width` | Ancho de resolución | Número | 1920 |
| `height` | Alto de resolución | Número | 1080 |
| `facingMode` | Cámara a usar | 'environment' \| 'user' | 'environment' |
| `forceScreenshotSourceSize` | Forzar tamaño de captura | boolean | true |
| `screenshotQuality` | Calidad de imagen | 0.1 - 1.0 | 0.9 |
| `screenshotFormat` | Formato de imagen | 'image/jpeg' \| 'image/png' | 'image/jpeg' |
| `imageSmoothing` | Suavizado de imagen | boolean | false |
| `focusDelay` | Delay de enfoque (seg) | 0 - 5 | 1 |

### Configuración Recomendada para OCR

Para obtener mejores resultados en captura de pantallas para OCR:

```javascript
{
  videoConstraints: {
    width: 1920,
    height: 1080,
    facingMode: 'environment'
  },
  forceScreenshotSourceSize: true,
  screenshotQuality: 0.9,
  screenshotFormat: 'image/jpeg',
  imageSmoothing: false,  // Mantiene bordes definidos
  focusDelay: 1.5
}
```

## 🎨 Funcionalidades Implementadas

### ✅ Completadas
- [x] Página principal de Flowise Agents con interfaz dummy
- [x] Página de OCR con funcionalidad completa de Mathpix
- [x] Captura de fotos con diferentes formatos (JPEG/PNG)
- [x] Configuración completa de resolución y calidad
- [x] Información detallada de la cámara y capacidades
- [x] Configuración persistente en localStorage
- [x] Interfaz responsive optimizada para móviles
- [x] Manejo de errores y permisos de cámara
- [x] Delay de enfoque configurable
- [x] Optimización para captura de pantallas (OCR)
- [x] Navegación actualizada con Flowise como página principal

### 🔄 En Desarrollo
- [ ] Integración con Flowise API
- [ ] Interfaz de chat con agentes
- [ ] Configuración de endpoints de Flowise
- [ ] Análisis de resultados de agentes

### 📋 Planificadas
- [ ] Configuración de credenciales de Flowise
- [ ] Historial de conversaciones con agentes
- [ ] Métricas de rendimiento de agentes
- [ ] Exportación de resultados de agentes
- [ ] Integración avanzada con múltiples agentes

## 🚀 Despliegue

### GitHub Pages
El proyecto está configurado para desplegarse automáticamente en GitHub Pages:

```bash
npm run deploy
```

### Docker
Incluye `Dockerfile` para despliegue en contenedores:

```bash
docker build -t react-mathpix-flowise .
docker run -p 3000:3000 react-mathpix-flowise
```

## 🔧 Desarrollo

### Estructura de Contextos

El proyecto utiliza React Context para manejar el estado global:

- **CameraSettingsContext**: Gestiona toda la configuración de la cámara
- **ThemeContext**: Maneja el tema claro/oscuro de la aplicación

### Estilos

Utiliza variables CSS personalizadas para el sistema de colores:

```css
:root {
  --color-background: #ffffff;
  --color-surface: #f8f9fa;
  --color-text-primary: #1a1a1a;
  --color-text-secondary: #6b7280;
  --color-accent: #3b82f6;
  --color-border: #e5e7eb;
}
```

## 📱 Compatibilidad

- **Navegadores**: Chrome 60+, Firefox 55+, Safari 11+, Edge 79+
- **Dispositivos**: Desktop, tablet, móvil
- **Cámaras**: Webcam USB, cámara frontal/trasera de móviles
- **Resoluciones**: Soporte para múltiples resoluciones según dispositivo

## 🐛 Solución de Problemas

### Cámara no funciona
1. Verificar permisos del navegador
2. Asegurar que no hay otras aplicaciones usando la cámara
3. Probar en modo incógnito
4. Verificar que la URL sea HTTPS (requerido para WebRTC)

### Calidad de imagen baja
1. Ajustar `screenshotQuality` a 1.0
2. Aumentar resolución en `videoConstraints`
3. Activar `forceScreenshotSourceSize`
4. Desactivar `imageSmoothing` para bordes más definidos

### Problemas de rendimiento
1. Reducir resolución de video
2. Ajustar `screenshotQuality`
3. Verificar recursos del dispositivo

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

---

**Construido con ❤️ para explorar la API de Mathpix OCR y facilitar el reconocimiento de texto y fórmulas matemáticas.**