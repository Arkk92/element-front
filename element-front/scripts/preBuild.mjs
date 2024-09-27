// scripts/preBuild.mjs

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Recreate __dirname using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the folder where your assets are located (e.g., public/assets)
const assetsDir = path.resolve(__dirname, '../public/assets');

// Function to recursively get all asset paths
const getAssetPaths = (dir) => {
  const files = fs.readdirSync(dir);
  let assetPaths = [];

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Recurse into directories
      assetPaths = assetPaths.concat(getAssetPaths(filePath));
    } else {
      // Check if the file is a supported asset type (images, videos, etc.)
      const ext = path.extname(file).toLowerCase();
      const supportedFormats = ['.jpg', '.jpeg', '.png', '.gif', '.mp4', '.webm', '.ogg']; // Add more extensions if needed

      if (supportedFormats.includes(ext)) {
        // Add the file path relative to the public folder
        assetPaths.push(filePath.replace(`${assetsDir}/`, '/assets/').replace(/\\/g, '/'));
      }
    }
  });

  return assetPaths;
};

// Get all asset paths from the directory
const assetPaths = getAssetPaths(assetsDir);

// Write the asset paths to a JSON file
const output = {
  assets: assetPaths
};

// Save the JSON to the src/assets folder (or any preferred location)
const outputPath = path.resolve(__dirname, '../src/assets/assets.json');
fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

console.log('Asset paths written to assets.json:', assetPaths);
