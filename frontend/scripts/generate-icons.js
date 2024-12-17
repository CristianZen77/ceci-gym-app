const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ICON_SIZES = [64, 192, 512];
const SOURCE_ICON = path.join(__dirname, '../src/assets/logo.png');
const OUTPUT_DIR = path.join(__dirname, '../public');

async function generateIcons() {
  // Asegurarse de que el directorio de salida existe
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  try {
    // Generar favicon.ico (32x32)
    await sharp(SOURCE_ICON)
      .resize(32, 32)
      .toFile(path.join(OUTPUT_DIR, 'favicon.ico'));
    console.log('✓ Generado favicon.ico');

    // Generar los íconos PNG
    for (const size of ICON_SIZES) {
      await sharp(SOURCE_ICON)
        .resize(size, size)
        .toFile(path.join(OUTPUT_DIR, `icon-${size}.png`));
      console.log(`✓ Generado icon-${size}.png`);
    }

    console.log('✓ Todos los íconos han sido generados exitosamente');
  } catch (error) {
    console.error('Error generando los íconos:', error);
  }
}

generateIcons();
