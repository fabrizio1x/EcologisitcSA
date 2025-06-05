const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svgPath = path.join(__dirname, '../src/assets/icons/truck-marker.svg');
const pngPath = path.join(__dirname, '../src/assets/icons/truck-marker.png');

// Leer el archivo SVG
fs.readFile(svgPath, (err, data) => {
  if (err) {
    console.error('Error al leer el archivo SVG:', err);
    return;
  }

  // Convertir SVG a PNG
  sharp(data)
    .png()
    .toFile(pngPath)
    .then(() => {
      console.log('Conversión completada exitosamente!');
      console.log('PNG guardado en:', pngPath);
    })
    .catch(err => {
      console.error('Error al convertir SVG a PNG:', err);
    });
}); 