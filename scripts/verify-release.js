const fs = require("fs");
const path = require("path");

function fail(message) {
  console.error(`release-check failed: ${message}`);
  process.exit(1);
}

function expect(condition, message) {
  if (!condition) fail(message);
}

const root = path.resolve(__dirname, "..");
const distDir = path.join(root, "dist");
const assetsDir = path.join(distDir, "assets");
const indexHtmlPath = path.join(distDir, "index.html");
const swPath = path.join(distDir, "sw.js");
const webmanifestPath = path.join(distDir, "manifest.webmanifest");
const catalogManifestPath = path.join(root, "src", "data", "catalog-manifest.ts");

expect(fs.existsSync(distDir), "dist/ does not exist. Run `npm run build` first.");
expect(fs.existsSync(indexHtmlPath), "dist/index.html is missing.");
expect(fs.existsSync(swPath), "dist/sw.js is missing.");
expect(fs.existsSync(webmanifestPath), "dist/manifest.webmanifest is missing.");
expect(fs.existsSync(assetsDir), "dist/assets is missing.");
expect(fs.existsSync(catalogManifestPath), "src/data/catalog-manifest.ts is missing.");

const indexHtml = fs.readFileSync(indexHtmlPath, "utf8");
const assetFiles = fs.readdirSync(assetsDir);
const catalogManifest = fs.readFileSync(catalogManifestPath, "utf8");

const indexChunk = assetFiles.find((file) => /^index-.*\.js$/.test(file));
const vendorChunk = assetFiles.find((file) => /^vendor-.*\.js$/.test(file));
const diseaseChunk = assetFiles.find((file) => /^disease-data-.*\.js$/.test(file));

expect(Boolean(indexChunk), "index chunk not found in dist/assets.");
expect(Boolean(vendorChunk), "vendor chunk not found in dist/assets.");
expect(Boolean(diseaseChunk), "disease-data chunk not found in dist/assets.");
expect(indexHtml.includes(vendorChunk), "dist/index.html does not preload the vendor chunk.");
expect(!indexHtml.includes(diseaseChunk), "dist/index.html should not preload the lazy disease-data chunk.");
expect(catalogManifest.includes('"confidence"'), "catalog manifest is missing confidence metadata.");

console.log("release-check passed:");
console.log(`- index chunk: ${indexChunk}`);
console.log(`- vendor chunk: ${vendorChunk}`);
console.log(`- lazy disease chunk: ${diseaseChunk}`);
console.log("- PWA artifacts present");
console.log("- catalog manifest contains confidence metadata");
