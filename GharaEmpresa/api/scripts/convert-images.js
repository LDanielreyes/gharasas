/**
 * Script para convertir imágenes PNG/JPEG a WebP
 * Ejecutar desde: GharaEmpresa/api/
 * Comando: node scripts/convert-images.js
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const DIRS_TO_CONVERT = [
  path.resolve(__dirname, '../../../gharasas/public/media/iconografia'),
  path.resolve(__dirname, '../../../gharasas/public/media/EquipoGhara'),
];

async function convertDir(dir) {
  if (!fs.existsSync(dir)) {
    console.log(`⏭️  Directorio no encontrado: ${dir}`);
    return;
  }

  const files = fs.readdirSync(dir);
  let converted = 0;
  let savedBytes = 0;

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (!['.png', '.jpeg', '.jpg'].includes(ext)) continue;

    const inputPath = path.join(dir, file);
    const outputName = file.replace(/\.(png|jpeg|jpg)$/i, '.webp');
    const outputPath = path.join(dir, outputName);

    // No sobreescribir si ya existe
    if (fs.existsSync(outputPath)) {
      console.log(`⏭️  Ya existe: ${outputName}`);
      continue;
    }

    try {
      const inputSize = fs.statSync(inputPath).size;
      await sharp(inputPath)
        .webp({ quality: 82 })
        .toFile(outputPath);
      const outputSize = fs.statSync(outputPath).size;
      const saved = inputSize - outputSize;
      savedBytes += saved;
      converted++;
      console.log(`✅ ${file} → ${outputName} (${(inputSize/1024).toFixed(0)}KB → ${(outputSize/1024).toFixed(0)}KB, -${(saved/1024).toFixed(0)}KB)`);
    } catch (err) {
      console.error(`❌ Error convirtiendo ${file}:`, err.message);
    }
  }

  console.log(`\n📊 ${dir}:`);
  console.log(`   Convertidos: ${converted} archivos`);
  console.log(`   Ahorro total: ${(savedBytes/1024/1024).toFixed(2)} MB\n`);
}

async function main() {
  console.log('🖼️  Convirtiendo imágenes a WebP...\n');
  for (const dir of DIRS_TO_CONVERT) {
    await convertDir(dir);
  }
  console.log('✨ Conversión completada.');
  console.log('⚠️  Recuerda actualizar las referencias .png/.jpeg → .webp en el código.');
}

main();
