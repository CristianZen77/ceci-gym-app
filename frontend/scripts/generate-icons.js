const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputIcon = path.join(__dirname, '../public/logo.png');
const androidResDir = path.join(__dirname, '../android/app/src/main/res');

const androidIconSizes = [
  { dir: 'mipmap-mdpi', size: 48 },
  { dir: 'mipmap-hdpi', size: 72 },
  { dir: 'mipmap-xhdpi', size: 96 },
  { dir: 'mipmap-xxhdpi', size: 144 },
  { dir: 'mipmap-xxxhdpi', size: 192 }
];

async function generateAndroidIcons() {
  for (const iconSize of androidIconSizes) {
    const outputPath = path.join(androidResDir, iconSize.dir, 'ic_launcher.png');
    const outputRoundPath = path.join(androidResDir, iconSize.dir, 'ic_launcher_round.png');

    try {
      // Resize and save square icon
      await sharp(inputIcon)
        .resize(iconSize.size, iconSize.size)
        .toFile(outputPath);

      // Resize and save round icon
      await sharp(inputIcon)
        .resize(iconSize.size, iconSize.size)
        .toFile(outputRoundPath);

      console.log(`Generated icons for ${iconSize.dir}`);
    } catch (error) {
      console.error(`Error generating icons for ${iconSize.dir}:`, error);
    }
  }
}

generateAndroidIcons();
