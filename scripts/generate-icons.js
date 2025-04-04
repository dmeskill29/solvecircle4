const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [192, 512];
const sourceSvg = path.join(__dirname, '../public/icon.svg');
const outputDir = path.join(__dirname, '../public');

async function generateIcons() {
  try {
    console.log('Starting icon generation...');
    console.log('Source SVG path:', sourceSvg);
    console.log('Output directory:', outputDir);

    // Check if source SVG exists
    if (!fs.existsSync(sourceSvg)) {
      throw new Error(`Source SVG file not found at ${sourceSvg}`);
    }

    // Create output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
      console.log('Created output directory');
    }

    // First convert SVG to high-res PNG
    console.log('Converting SVG to PNG...');
    await sharp(sourceSvg)
      .resize(1024, 1024)
      .png()
      .toFile(path.join(outputDir, 'icon.png'));

    console.log('Created base PNG icon');

    // Generate icons for each size
    for (const size of sizes) {
      console.log(`Generating ${size}x${size} icon...`);
      const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);
      await sharp(path.join(outputDir, 'icon.png'))
        .resize(size, size)
        .toFile(outputPath);
      
      // Verify file was created
      if (fs.existsSync(outputPath)) {
        console.log(`Successfully generated ${size}x${size} icon at ${outputPath}`);
      } else {
        throw new Error(`Failed to create icon at ${outputPath}`);
      }
    }

    console.log('Icon generation complete!');
  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons(); 