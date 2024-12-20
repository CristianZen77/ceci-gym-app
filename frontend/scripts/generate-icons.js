const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateIcons() {
  const inputImage = path.join(__dirname, '../public/logo.png');
  const androidResDir = path.join(__dirname, '../android/app/src/main/res');
  const publicDir = path.join(__dirname, '../public');

  // Asegurarse de que los directorios existen
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  try {
    // Generar iconos para Android
    const sizes = {
      'mipmap-mdpi': 48,
      'mipmap-hdpi': 72,
      'mipmap-xhdpi': 96,
      'mipmap-xxhdpi': 144,
      'mipmap-xxxhdpi': 192
    };

    for (const [folder, size] of Object.entries(sizes)) {
      const outputDir = path.join(androidResDir, folder);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      await sharp(inputImage)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .toFile(path.join(outputDir, 'ic_launcher.png'));

      await sharp(inputImage)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .toFile(path.join(outputDir, 'ic_launcher_round.png'));
    }

    // Generar iconos para la web
    await sharp(inputImage)
      .resize(192, 192, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .toFile(path.join(publicDir, 'logo192.png'));

    await sharp(inputImage)
      .resize(512, 512, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .toFile(path.join(publicDir, 'logo512.png'));

    console.log('Iconos generados exitosamente');
  } catch (error) {
    console.error('Error generando iconos:', error);
  }
}

generateIcons();
