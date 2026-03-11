const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { GENERATED_DISEASE_MODULES } = require("../disease-module-config");

test("generated disease modules match the normalized authored source modules", () => {
  const diseaseGenerationDir = path.resolve(__dirname, "../../.tmp/disease-generation/src/data");
  const { normalizeDiseaseEmpiricOptions } = require(path.join(diseaseGenerationDir, "normalize-empiric-options.js"));
  const editorialModules = GENERATED_DISEASE_MODULES.map((moduleConfig) => ({
    moduleConfig,
    module: require(path.join(diseaseGenerationDir, moduleConfig.sourceFile)),
  }));
  const knownMonographIds = new Set(
    editorialModules.flatMap(({ moduleConfig, module }) =>
      module[moduleConfig.exportName].drugMonographs.map((monograph) => monograph.id),
    ),
  );

  for (const { moduleConfig, module } of editorialModules) {
    const generatedModule = require(
      path.resolve(
        __dirname,
        "../../.tmp/validation/src/data/generated/diseases",
        moduleConfig.outputFile.replace(/\.ts$/, ".js"),
      ),
    );
    const normalizedEditorialDisease = normalizeDiseaseEmpiricOptions(module[moduleConfig.exportName], knownMonographIds);
    assert.deepEqual(
      generatedModule[moduleConfig.exportName],
      normalizedEditorialDisease,
      moduleConfig.exportName,
    );
  }
});
