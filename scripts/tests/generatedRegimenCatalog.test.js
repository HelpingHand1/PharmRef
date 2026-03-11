const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

test("generated regimen catalog matches the normalized disease catalog", () => {
  const validationDir = path.resolve(__dirname, "../../.tmp/validation/src/data");
  const { DISEASE_STATES } = require(path.join(validationDir, "index.js"));
  const { buildRegimenCatalog } = require(path.join(validationDir, "regimen-catalog.js"));
  const generatedCatalog = require(path.join(validationDir, "generated/regimen-catalog.js"));

  const expected = buildRegimenCatalog(DISEASE_STATES);

  assert.deepEqual(generatedCatalog.REGIMEN_CATALOG, expected.regimens);
  assert.deepEqual(generatedCatalog.REGIMEN_XREF_BY_MONOGRAPH_ID, expected.xrefByMonographId);
});
