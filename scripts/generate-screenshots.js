const sharp = require('sharp');

// Create a light mode background
const generateLightMode = (width, height) => ({
  create: {
    width,
    height,
    channels: 4,
    background: { r: 255, g: 255, b: 255, alpha: 1 }
  }
});

// Create a dark mode background
const generateDarkMode = (width, height) => ({
  create: {
    width,
    height,
    channels: 4,
    background: { r: 18, g: 18, b: 18, alpha: 1 }
  }
});

// Add text overlay
const addText = (text, y) => ({
  text: {
    text: `<span foreground="gray">${text}</span>`,
    font: 'sans',
    fontSize: 24,
    align: 'center',
    spacing: 10
  },
  top: y,
  left: 0
});

async function generateScreenshots() {
  // Mobile screenshots (750x1334)
  await sharp({
    create: {
      width: 750,
      height: 1334,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    }
  })
    .png()
    .toFile('public/screenshots/tasks-mobile-light.png');

  await sharp({
    create: {
      width: 750,
      height: 1334,
      channels: 4,
      background: { r: 18, g: 18, b: 18, alpha: 1 }
    }
  })
    .png()
    .toFile('public/screenshots/tasks-mobile-dark.png');

  // Desktop screenshots (1280x720)
  await sharp({
    create: {
      width: 1280,
      height: 720,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    }
  })
    .png()
    .toFile('public/screenshots/tasks-light.png');

  await sharp({
    create: {
      width: 1280,
      height: 720,
      channels: 4,
      background: { r: 18, g: 18, b: 18, alpha: 1 }
    }
  })
    .png()
    .toFile('public/screenshots/tasks-dark.png');
}

generateScreenshots().catch(console.error); 