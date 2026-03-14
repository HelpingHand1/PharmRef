const fs = require("fs");
const path = require("path");
const { GENERATED_DISEASE_MODULES } = require("./disease-module-config");

function fail(message) {
  console.error(`release-check failed: ${message}`);
  process.exit(1);
}

function expect(condition, message) {
  if (!condition) fail(message);
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const root = path.resolve(__dirname, "..");
const distDir = path.join(root, "dist");
const assetsDir = path.join(distDir, "assets");
const indexHtmlPath = path.join(distDir, "index.html");
const swPath = path.join(distDir, "sw.js");
const webmanifestPath = path.join(distDir, "manifest.webmanifest");
const icon192Path = path.join(distDir, "pwa-192.png");
const icon512Path = path.join(distDir, "pwa-512.png");
const appleTouchIconPath = path.join(distDir, "apple-touch-icon.png");
const catalogManifestPath = path.join(root, "src", "data", "catalog-manifest.ts");
const contentApprovalsPath = path.join(root, "src", "data", "content-approvals.ts");
const generatedContentMetaPath = path.join(root, "src", "data", "generated-content-meta.ts");
const generatedDiseaseDir = path.join(root, "src", "data", "generated", "diseases");
const generatedRegimenCatalogPath = path.join(root, "src", "data", "generated", "regimen-catalog.ts");
const generatedDiseasePaths = GENERATED_DISEASE_MODULES.map((moduleConfig) =>
  path.join(generatedDiseaseDir, moduleConfig.outputFile),
);

expect(fs.existsSync(distDir), "dist/ does not exist. Run `npm run build` first.");
expect(fs.existsSync(indexHtmlPath), "dist/index.html is missing.");
expect(fs.existsSync(swPath), "dist/sw.js is missing.");
expect(fs.existsSync(webmanifestPath), "dist/manifest.webmanifest is missing.");
expect(fs.existsSync(icon192Path), "dist/pwa-192.png is missing.");
expect(fs.existsSync(icon512Path), "dist/pwa-512.png is missing.");
expect(fs.existsSync(appleTouchIconPath), "dist/apple-touch-icon.png is missing.");
expect(fs.existsSync(assetsDir), "dist/assets is missing.");
expect(fs.existsSync(catalogManifestPath), "src/data/catalog-manifest.ts is missing.");
expect(fs.existsSync(contentApprovalsPath), "src/data/content-approvals.ts is missing.");
expect(fs.existsSync(generatedContentMetaPath), "src/data/generated-content-meta.ts is missing.");
expect(fs.existsSync(generatedDiseaseDir), "src/data/generated/diseases is missing.");
expect(fs.existsSync(generatedRegimenCatalogPath), "src/data/generated/regimen-catalog.ts is missing.");
generatedDiseasePaths.forEach((generatedDiseasePath) => {
  expect(fs.existsSync(generatedDiseasePath), `${path.relative(root, generatedDiseasePath)} is missing.`);
});

const indexHtml = fs.readFileSync(indexHtmlPath, "utf8");
const assetFiles = fs.readdirSync(assetsDir);
const catalogManifest = fs.readFileSync(catalogManifestPath, "utf8");
const contentApprovals = fs.readFileSync(contentApprovalsPath, "utf8");
const generatedContentMeta = fs.readFileSync(generatedContentMetaPath, "utf8");
const generatedRegimenCatalog = fs.readFileSync(generatedRegimenCatalogPath, "utf8");

const indexChunk = assetFiles.find((file) => /^index-.*\.js$/.test(file));
const vendorChunk = assetFiles.find((file) => /^vendor-.*\.js$/.test(file));
const generatedDiseaseChunks = GENERATED_DISEASE_MODULES.map((moduleConfig) => {
  const chunkPrefix = moduleConfig.outputFile.replace(/\.ts$/, "");
  const chunkPattern = new RegExp(`^${escapeRegex(chunkPrefix)}-.*\\.js$`);
  const chunkFile = assetFiles.find((file) => chunkPattern.test(file));
  return { displayName: moduleConfig.displayName, chunkFile };
});
const regimenCatalogChunk = assetFiles.find((file) => /^regimen-catalog-.*\.js$/.test(file));

expect(Boolean(indexChunk), "index chunk not found in dist/assets.");
expect(Boolean(vendorChunk), "vendor chunk not found in dist/assets.");
generatedDiseaseChunks.forEach(({ displayName, chunkFile }) => {
  expect(Boolean(chunkFile), `${displayName} chunk not found in dist/assets.`);
});
expect(indexHtml.includes(vendorChunk), "dist/index.html does not preload the vendor chunk.");
generatedDiseaseChunks.forEach(({ displayName, chunkFile }) => {
  expect(!indexHtml.includes(chunkFile), `dist/index.html should not preload the lazy ${displayName} chunk.`);
});
if (regimenCatalogChunk) {
  expect(!indexHtml.includes(regimenCatalogChunk), "dist/index.html should not preload the lazy regimen catalog chunk.");
}
expect(catalogManifest.includes('"confidence"'), "catalog manifest is missing confidence metadata.");
expect(catalogManifest.includes('"reviewedBy"'), "catalog manifest is missing reviewer attribution metadata.");
expect(catalogManifest.includes('"reviewScope"'), "catalog manifest is missing review scope metadata.");
expect(catalogManifest.includes('"reviewHistory"'), "catalog manifest is missing review history metadata.");
expect(catalogManifest.includes('"approvedBodyVersion"'), "catalog manifest is missing content governance metadata.");
expect(contentApprovals.includes("AUTO-GENERATED by scripts/approve-content.js"), "content approvals file is missing the generator banner.");
expect(contentApprovals.includes("APPROVED_CONTENT_VERSIONS"), "content approvals file is missing the approval export.");
expect(generatedContentMeta.includes("AUTO-GENERATED by scripts/generate-content-meta.js"), "generated content metadata is missing the generator banner.");
expect(generatedContentMeta.includes('"guidelineVersion"'), "generated content metadata is missing structured guideline metadata.");
expect(generatedContentMeta.includes('"summary"'), "generated content metadata is missing review summary metadata.");
expect(generatedRegimenCatalog.includes("AUTO-GENERATED by scripts/generate-disease-modules.js"), "generated regimen catalog is missing the generator banner.");
expect(generatedRegimenCatalog.includes("REGIMEN_CATALOG"), "generated regimen catalog is missing the catalog export.");
expect(generatedRegimenCatalog.includes("REGIMEN_XREF_BY_MONOGRAPH_ID"), "generated regimen catalog is missing the monograph xref export.");

console.log("release-check passed:");
console.log(`- index chunk: ${indexChunk}`);
console.log(`- vendor chunk: ${vendorChunk}`);
if (regimenCatalogChunk) {
  console.log(`- lazy regimen catalog chunk: ${regimenCatalogChunk}`);
}
console.log(`- lazy disease chunks: ${generatedDiseaseChunks.map(({ chunkFile }) => chunkFile).join(", ")}`);
console.log("- PWA artifacts present");
console.log("- install icons present");
console.log("- catalog manifest contains confidence metadata");
console.log("- catalog manifest contains reviewer attribution metadata");
console.log("- catalog manifest contains review history metadata");
console.log("- catalog manifest contains content governance metadata");
console.log("- content approvals present");
console.log("- generated content metadata present");
console.log("- generated regimen catalog present");
console.log(`- generated disease modules present for ${GENERATED_DISEASE_MODULES.map((moduleConfig) => moduleConfig.displayName).join(", ")}`);
