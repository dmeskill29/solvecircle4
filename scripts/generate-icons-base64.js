const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Base64 string of the SolveCircle logo (white background, teal S)
const base64Logo = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIAAQMAAADOtka5AAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAANQTFRFAAAAp3o92gAAAAF0Uk5TAEDm2GYAAAAqSURBVHic7cExAQAAAMKg9U9tCF8gAAAAAAAAAAAAAAAAAAAAAAAAAAB4GhbUAAFdHd2SAAAAAElFTkSuQmCC`;

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const outputDir = path.join('public', 'icons');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Convert base64 to buffer
const base64Data = base64Logo.replace(/^data:image\/\w+;base64,/, '');
const imageBuffer = Buffer.from(base64Data, 'base64');

async function generateIcons() {
  try {
    for (const size of sizes) {
      await sharp(imageBuffer)
        .resize(size, size)
        .toFile(path.join(outputDir, `icon-${size}x${size}.png`));
      console.log(`Generated ${size}x${size} icon`);
    }
    console.log('All icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

generateIcons(); 