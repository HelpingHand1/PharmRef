const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const validationRoot = path.resolve(__dirname, "../../.tmp/validation/src");
const { DISEASE_STATES } = require(path.join(validationRoot, "data/index.js"));
const { buildCatalogDerived } = require(path.join(validationRoot, "data/derived.js"));
const { buildPathogenSearchPreview } = require(path.join(validationRoot, "data/search-presenters.js"));
const { searchCatalog } = require(path.join(validationRoot, "utils/searchCatalog.js"));

const derived = buildCatalogDerived(DISEASE_STATES);

test("search returns pathogen references distinctly alongside syndrome pathways", () => {
  const results = searchCatalog("KPC CRE", derived.searchIndex);
  assert.ok(results, "Expected results for KPC CRE");
  assert.ok(
    results.pathogens.some((entry) => entry.id === "kpc-cre"),
    "Expected KPC pathogen reference to appear in pathogen results",
  );
  assert.ok(
    results.subcategories.some((entry) => entry.parentDisease.id === "amr-gn" && entry.id === "cre-kpc"),
    "Expected AMR gram-negative CRE pathway to remain searchable alongside the pathogen reference",
  );
});

test("pathogen previews surface site-specific false reassurance traps", () => {
  const results = searchCatalog("MRSA pneumonia daptomycin", derived.searchIndex);
  const mrsa = results.pathogens.find((entry) => entry.id === "mrsa");
  assert.ok(mrsa, "Expected MRSA pathogen reference");

  const preview = buildPathogenSearchPreview(mrsa, "MRSA pneumonia daptomycin");
  assert.match(`${preview.primary} ${preview.secondary ?? ""}`, /MRSA|pneumonia|daptomycin/i);
});

test("catalog derives pathogen cross-links for disease, pathway, and monograph surfaces", () => {
  assert.ok(
    derived.findPathogensForDisease("hap-vap").some((entry) => entry.id === "mrsa"),
    "Expected HAP/VAP overview to expose at least one related pathogen reference",
  );
  assert.ok(
    derived.findPathogensForSubcategory("hap-vap", "hap-mdr-risk").some((entry) => entry.id === "dtr-pseudomonas"),
    "Expected HAP MDR-risk pathway to link to DTR Pseudomonas",
  );
  assert.ok(
    derived.findPathogensForMonograph("linezolid").some((entry) => entry.id === "mrsa"),
    "Expected linezolid monograph to link to MRSA phenotype guidance",
  );
});
