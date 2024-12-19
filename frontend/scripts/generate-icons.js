const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateIcons() {
  const inputImage = path.join(__dirname, '../src/assets/logo.png');
  const publicDir = path.join(__dirname, '../public');

  // Asegurarse de que el directorio público existe
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Crear un fondo negro
  const composite = {
    input: Buffer.from(`<svg>
      <rect width="100%" height="100%" fill="black"/>
    </svg>`),
    blend: 'dest-over'
  };

  try {
    // Generar favicon.ico (32x32)
    await sharp(inputImage)
      .resize(32, 32, {
        fit: 'contain',
        position: 'center',
        background: { r: 0, g: 0, b: 0, alpha: 1 }
      })
      .composite([composite])
      .toFile(path.join(publicDir, 'favicon.ico'));
    console.log('✓ Generado favicon.ico');

    // Generar icon-64.png
    await sharp(inputImage)
      .resize(64, 64, {
        fit: 'contain',
        position: 'center',
        background: { r: 0, g: 0, b: 0, alpha: 1 }
      })
      .composite([composite])
      .toFile(path.join(publicDir, 'icon-64.png'));
    console.log('✓ Generado icon-64.png');

    // Generar icon-192.png
    await sharp(inputImage)
      .resize(192, 192, {
        fit: 'contain',
        position: 'center',
        background: { r: 0, g: 0, b: 0, alpha: 1 }
      })
      .composite([composite])
      .toFile(path.join(publicDir, 'icon-192.png'));
    console.log('✓ Generado icon-192.png');

    // Generar icon-512.png
    await sharp(inputImage)
      .resize(512, 512, {
        fit: 'contain',
        position: 'center',
        background: { r: 0, g: 0, b: 0, alpha: 1 }
      })
      .composite([composite])
      .toFile(path.join(publicDir, 'icon-512.png'));
    console.log('✓ Generado icon-512.png');

    console.log('✓ Todos los iconos han sido generados exitosamente');
  } catch (error) {
    console.error('Error generando los iconos:', error);
    process.exit(1);
  }
}

generateIcons();
