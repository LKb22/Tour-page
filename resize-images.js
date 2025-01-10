const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Input and output directories
const inputDir = './img/images';
const outputDir = './img/resized';

// Sizes to generate
const sizes = [
  { width: 600, suffix: '600w' },    // Phone
  { width: 1200, suffix: '600w-2x' }, // High-DPI Phone

  { width: 900, suffix: '900w' },    // Tablet Portrait
  { width: 1800, suffix: '900w-2x' }, // High-DPI Tablet Portrait

  { width: 1200, suffix: '1200w' },  // Tablet Landscape
  { width: 2400, suffix: '1200w-2x' }, // High-DPI Tablet Landscape

  { width: 1800, suffix: '1800w' },  // Big Desktop
  { width: 3600, suffix: '1800w-2x' }  // High-DPI Big Desktop
];


// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Process each image in the input directory
fs.readdirSync(inputDir).forEach((file) => {
  const inputPath = path.join(inputDir, file);
  const fileName = path.parse(file).name;
  const fileExt = path.parse(file).ext;

  // Skip non-image files
  if (!['.jpg', '.jpeg', '.png'].includes(fileExt.toLowerCase())) {
    console.log(`Skipping non-image file: ${file}`);
    return;
  }

  sizes.forEach(({ width, suffix }) => {
    // Generate compressed versions in original format
    const outputPath = path.join(outputDir, `${fileName}-${suffix}${fileExt}`);
    sharp(inputPath)
      .resize({ width })
      .toFormat(fileExt === '.png' ? 'png' : 'jpeg', {
        quality: 80, // Compression quality: adjust as needed
      })
      .toFile(outputPath)
      .then(() => console.log(`Created: ${outputPath}`))
      .catch((err) => console.error(`Error processing ${file}:`, err));

    // Generate WebP versions
    const outputWebPPath = path.join(outputDir, `${fileName}-${suffix}.webp`);
    sharp(inputPath)
      .resize({ width })
      .webp({ quality: 80 }) // Compression quality for WebP
      .toFile(outputWebPPath)
      .then(() => console.log(`Created: ${outputWebPPath}`))
      .catch((err) => console.error(`Error processing ${file} to WebP:`, err));
  });
});

console.log('Image processing complete!');
