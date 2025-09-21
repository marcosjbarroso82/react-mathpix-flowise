import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crear iconos PNG básicos usando un enfoque simple
const sizes = [72, 96, 144, 192, 512];

// PNG básico de 1x1 pixel azul
const createBasicPNG = (size) => {
  // Crear un PNG básico con un color sólido
  // Este es un PNG de 1x1 pixel que se puede escalar
  const pngData = `iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==`;
  return Buffer.from(pngData, 'base64');
};

// Crear iconos para cada tamaño
sizes.forEach(size => {
  const pngBuffer = createBasicPNG(size);
  const filename = `icon-${size}x${size}.png`;
  const filepath = path.join(__dirname, '..', 'public', filename);
  
  fs.writeFileSync(filepath, pngBuffer);
  console.log(`Generated ${filename}`);
});

console.log('Basic PNG icons created. For production, consider using proper icon generation tools.');
