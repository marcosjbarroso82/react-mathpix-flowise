# Requerimientos - Página de Prueba de Cámara

## Objetivo
Crear una página para probar la cámara con react-webcam enfocada en fotografía, especialmente para capturar pantallas de notebook con celular para posterior procesamiento OCR.

## Funcionalidades Principales

### 1. Vista Previa de Cámara
- Mostrar lo que la cámara está capturando en tiempo real
- Mantener la proporción original de la cámara
- La cámara debe capturar tanto como sea posible (sin recortar)

### 2. Configuración de Cámara
- Mostrar todos los parámetros (habilitados y deshabilitados) con su estado actual
- Permitir configurar parámetros con checkboxes para habilitar/deshabilitar

### 3. Parámetros Configurables
- `videoConstraints: { width: 1920, height: 1080, facingMode: 'environment' }`
- `forceScreenshotSourceSize: true`
- `screenshotQuality: 0.9-1`
- `screenshotFormat: "image/jpeg" o "image/png"`
- `imageSmoothing: false`

### 4. Captura de Foto
- Botón para tomar foto
- Delay de enfoque configurable por el usuario
- Mostrar la foto capturada debajo de la vista previa

### 5. Información de la Foto
- Formato de la imagen
- Dimensiones (ancho x alto)
- Tamaño del archivo en bytes/KB

### 6. Delay de Enfoque
- Regulable por el usuario
- Aplicarse después del click en "Tomar Foto"

## Detalles Técnicos

### Responsive Design
- Funcionar bien en desktop y móvil
- Prioridad en móvil

### Manejo de Errores
- Mostrar mensaje de error si la cámara no está disponible
- Manejar casos donde no se pueda acceder a la cámara

### Guardado
- Solo mostrar la foto en la página
- No implementar descarga de archivos

## Caso de Uso Específico
- Tomar fotos de pantallas de notebook con celular
- Para posterior procesamiento con OCR (API de terceros)
- Mantener bordes definidos (imageSmoothing: false)

## Librería a Utilizar
- react-webcam para la funcionalidad de cámara
