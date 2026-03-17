const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const validationRoot = path.resolve(__dirname, "../../.tmp/validation/src");
const { DISEASE_STATES } = require(path.join(validationRoot, "data/index.js"));
const {
  getMonographContentKey,
  getSubcategoryContentKey,
  resolveContentMeta,
} = require(path.join(validationRoot, "data/metadata.js"));

function findDisease(diseaseId) {
  return DISEASE_STATES.find((disease) => disease.id === diseaseId);
}

function findSubcategory(diseaseId, subcategoryId) {
  return findDisease(diseaseId)?.subcategories.find((subcategory) => subcategory.id === subcategoryId) ?? null;
}

function findMonograph(monographId) {
  for (const disease of DISEASE_STATES) {
    const match = disease.drugMonographs.find((monograph) => monograph.id === monographId);
    if (match) {
      return { disease, monograph: match };
    }
  }
  return null;
}

test("priority resistant-pathogen subcategories expose microbiology intelligence blocks", () => {
  const keys = [
    ["cap", "cap-icu"],
    ["hap-vap", "hap-mdr-risk"],
    ["uti", "complicated-uti"],
    ["sepsis", "septic-shock"],
    ["iai", "ha-iai"],
    ["febrile-neutropenia", "high-risk-fn"],
    ["bacteremia-endocarditis", "sab-workup"],
    ["bacteremia-endocarditis", "gram-negative-bacteremia"],
    ["amr-gn", "cre-kpc"],
    ["amr-gn", "cre-mbl"],
    ["amr-gn", "dtr-pa"],
    ["amr-gn", "crab-steno"],
    ["advanced-agents", "cre-management"],
    ["advanced-agents", "mdr-pseudomonas"],
  ];

  keys.forEach(([diseaseId, subcategoryId]) => {
    const subcategory = findSubcategory(diseaseId, subcategoryId);
    assert.ok(subcategory, `Missing ${diseaseId}/${subcategoryId}`);
    assert.ok(subcategory.rapidDiagnostics?.length, `${diseaseId}/${subcategoryId} is missing rapidDiagnostics`);
    assert.ok(subcategory.breakpointNotes?.length, `${diseaseId}/${subcategoryId} is missing breakpointNotes`);
    assert.ok(subcategory.intrinsicResistance?.length, `${diseaseId}/${subcategoryId} is missing intrinsicResistance`);
    assert.ok(subcategory.coverageMatrix?.length, `${diseaseId}/${subcategoryId} is missing coverageMatrix`);
  });
});

test("priority resistant-pathogen monographs expose microbiology intelligence blocks", () => {
  const ids = [
    "aztreonam",
    "ceftazidime-avibactam",
    "meropenem-vaborbactam",
    "cefiderocol",
    "ceftolozane-tazobactam",
    "imipenem-cilastatin-relebactam",
  ];

  ids.forEach((id) => {
    const match = findMonograph(id);
    assert.ok(match, `Missing monograph ${id}`);
    assert.ok(match.monograph.rapidDiagnostics?.length, `${id} is missing rapidDiagnostics`);
    assert.ok(match.monograph.breakpointNotes?.length, `${id} is missing breakpointNotes`);
    assert.ok(match.monograph.intrinsicResistance?.length, `${id} is missing intrinsicResistance`);
    assert.ok(match.monograph.coverageMatrix?.length, `${id} is missing coverageMatrix`);
  });
});

test("representative resistant-pathogen pages expose trust-surface metadata", () => {
  const creMblDisease = findDisease("amr-gn");
  const creMbl = findSubcategory("amr-gn", "cre-mbl");
  const creMblMeta = resolveContentMeta(creMbl, creMblDisease, {
    contentKey: getSubcategoryContentKey("amr-gn", "cre-mbl"),
  }).meta;
  assert.ok(creMblMeta?.whatChanged?.length, "Expected whatChanged on amr-gn/cre-mbl");
  assert.ok(creMblMeta?.sectionConfidence?.length, "Expected sectionConfidence on amr-gn/cre-mbl");
  assert.ok(creMblMeta?.guidelineDisagreements?.length, "Expected guidelineDisagreements on amr-gn/cre-mbl");

  const cefiderocol = findMonograph("cefiderocol");
  assert.ok(cefiderocol, "Expected cefiderocol monograph");
  const cefiderocolMeta = resolveContentMeta(cefiderocol.monograph, cefiderocol.disease, {
    contentKey: getMonographContentKey(cefiderocol.disease.id, "cefiderocol"),
  }).meta;
  assert.ok(cefiderocolMeta?.whatChanged?.length, "Expected whatChanged on cefiderocol");
  assert.ok(cefiderocolMeta?.sectionConfidence?.length, "Expected sectionConfidence on cefiderocol");
  assert.ok(cefiderocolMeta?.guidelineDisagreements?.length, "Expected guidelineDisagreements on cefiderocol");
});
