import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crear iconos básicos usando canvas (si está disponible) o generar HTML para conversión
const sizes = [72, 96, 144, 192, 512];

const createIconHTML = (size) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { margin: 0; padding: 0; }
    .icon {
      width: ${size}px;
      height: ${size}px;
      background: #3b82f6;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }
    .camera {
      width: ${size * 0.6}px;
      height: ${size * 0.45}px;
      background: white;
      border-radius: 12px;
      position: relative;
    }
    .lens {
      width: ${size * 0.2}px;
      height: ${size * 0.2}px;
      background: #1e40af;
      border-radius: 50%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    .lens-inner {
      width: ${size * 0.13}px;
      height: ${size * 0.13}px;
      background: white;
      border-radius: 50%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    .lens-center {
      width: ${size * 0.065}px;
      height: ${size * 0.065}px;
      background: #1e40af;
      border-radius: 50%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    .flash {
      width: ${size * 0.12}px;
      height: ${size * 0.08}px;
      background: white;
      border-radius: 4px;
      position: absolute;
      top: ${size * 0.1}px;
      left: ${size * 0.2}px;
    }
    .text {
      position: absolute;
      bottom: ${size * 0.15}px;
      left: 50%;
      transform: translateX(-50%);
      color: white;
      font-family: Arial, sans-serif;
      font-size: ${size * 0.12}px;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="icon">
    <div class="camera">
      <div class="flash"></div>
      <div class="lens">
        <div class="lens-inner">
          <div class="lens-center"></div>
        </div>
      </div>
    </div>
    <div class="text">OCR</div>
  </div>
</body>
</html>
`;

// Crear directorio de iconos si no existe
const iconsDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generar archivos HTML para cada tamaño
sizes.forEach(size => {
  const html = createIconHTML(size);
  const filename = `icon-${size}x${size}.html`;
  fs.writeFileSync(path.join(iconsDir, filename), html);
  console.log(`Generated ${filename}`);
});

console.log('Icon HTML files generated. You can open them in a browser and take screenshots to create PNG files.');
