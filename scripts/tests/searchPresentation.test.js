const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const validationRoot = path.resolve(__dirname, "../../.tmp/validation/src");
const { DISEASE_STATES } = require(path.join(validationRoot, "data/index.js"));
const { buildCatalogDerived } = require(path.join(validationRoot, "data/derived.js"));
const { searchCatalog } = require(path.join(validationRoot, "utils/searchCatalog.js"));
const {
  buildDrugSearchPreview,
  buildRegimenSearchPreview,
  buildSubcategorySearchPreview,
} = require(path.join(validationRoot, "data/search-presenters.js"));

const derived = buildCatalogDerived(DISEASE_STATES);

function requireResults(query) {
  const results = searchCatalog(query, derived.searchIndex);
  assert.ok(results, `Expected search results for ${query}`);
  return results;
}

test("regimen search previews surface rapid-diagnostic action text", () => {
  const results = requireResults("drop antifungal coverage");
  const regimen = results.regimens.find(
    (entry) => entry.diseaseId === "sepsis" && entry.subcategoryId === "septic-shock",
  );

  assert.ok(regimen, "Expected septic shock regimen result");
  const preview = buildRegimenSearchPreview(regimen, "drop antifungal coverage");
  assert.match(`${preview.primary} ${preview.secondary ?? ""}`, /Drop antifungal coverage/i);
});

test("subcategory search previews surface workflow and microbiology context", () => {
  const workflowResults = requireResults("MRSA nares de-escalation");
  const workflowMatch = workflowResults.subcategories.find(
    (entry) => entry.parentDisease.id === "hap-vap" && entry.id === "hap-mdr-risk",
  );
  assert.ok(workflowMatch, "Expected HAP/VAP workflow result");
  const workflowPreview = buildSubcategorySearchPreview(workflowMatch, "MRSA nares de-escalation");
  assert.match(`${workflowPreview.primary} ${workflowPreview.secondary ?? ""}`, /MRSA|nares|de-escalat/i);

  const microResults = requireResults("Enterococcus cephalosporins");
  const microMatch = microResults.subcategories.find(
    (entry) => entry.parentDisease.id === "bacteremia-endocarditis" && entry.id === "sab-workup",
  );
  assert.ok(microMatch, "Expected bacteremia/endocarditis microbiology result");
  const microPreview = buildSubcategorySearchPreview(microMatch, "Enterococcus cephalosporins");
  assert.match(`${microPreview.primary} ${microPreview.secondary ?? ""}`, /Enterococcus|cephalosporin/i);
});

test("decision-support search previews carry explicit definitive-therapy labeling", () => {
  const results = requireResults("cefazolin definitive MSSA bacteremia");
  const match = results.subcategories.find(
    (entry) => entry.parentDisease.id === "bacteremia-endocarditis" && entry.id === "sab-workup",
  );

  assert.ok(match, "Expected SAB workup decision-support result");
  assert.equal(match.matchType, "decision-support");
  const preview = buildSubcategorySearchPreview(match, "cefazolin definitive MSSA bacteremia");
  assert.match(`${preview.primary} ${preview.secondary ?? ""}`, /Preferred definitive therapy|Cefazolin|MSSA/i);
});

test("drug search previews surface stewardship and local overlay context", () => {
  const cefiderocolResults = requireResults("cefiderocol CRAB mortality");
  const cefiderocol = cefiderocolResults.drugs.find((entry) => entry.id === "cefiderocol");
  assert.ok(cefiderocol, "Expected cefiderocol drug result");
  const cefiderocolPreview = buildDrugSearchPreview(cefiderocol, "cefiderocol CRAB mortality");
  assert.match(`${cefiderocolPreview.primary} ${cefiderocolPreview.secondary ?? ""}`, /CRAB|mortality|reserve/i);

  const meropenemResults = requireResults("CRRT meropenem");
  const meropenem = meropenemResults.drugs.find((entry) => entry.id === "meropenem");
  assert.ok(meropenem, "Expected meropenem drug result");
  const meropenemPreview = buildDrugSearchPreview(meropenem, "CRRT meropenem");
  assert.match(`${meropenemPreview.primary} ${meropenemPreview.secondary ?? ""}`, /Special population|CRRT|extended infusion|q8h/i);
});
