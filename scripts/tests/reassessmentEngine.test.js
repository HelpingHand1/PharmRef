const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const validationRoot = path.resolve(__dirname, "../../.tmp/validation/src");
const { DISEASE_STATES } = require(path.join(validationRoot, "data/index.js"));
const { getPathwayReassessmentItems } = require(path.join(validationRoot, "utils/patientReassessmentEngine.js"));
const STRUCTURED_REASSESSMENT_PATHWAYS = [
  ["sepsis", "sepsis-community"],
  ["sepsis", "sepsis-hcap"],
  ["cap", "cap-icu"],
  ["iai", "ha-iai"],
  ["febrile-neutropenia", "high-risk-fn"],
  ["febrile-neutropenia", "fn-with-fungal-risk"],
];

function findSubcategory(diseaseId, subcategoryId) {
  return DISEASE_STATES
    .find((disease) => disease.id === diseaseId)
    ?.subcategories.find((subcategory) => subcategory.id === subcategoryId) ?? null;
}

function itemByWindow(items, window) {
  const item = items.find((entry) => entry.id.includes(`reassessment-${window}-`));
  assert.ok(item, `Expected reassessment item for ${window}`);
  return item;
}

function hoursAgo(hours) {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
}

test("expanded high-acuity pathways expose structured reassessment content", () => {
  for (const [diseaseId, subcategoryId] of STRUCTURED_REASSESSMENT_PATHWAYS) {
    const subcategory = findSubcategory(diseaseId, subcategoryId);
    assert.ok(subcategory, `Expected ${diseaseId}/${subcategoryId}`);
    assert.ok(subcategory.diagnosticStewardship?.length, `${diseaseId}/${subcategoryId} missing diagnosticStewardship`);
    assert.ok(subcategory.reassessmentCheckpoints?.length, `${diseaseId}/${subcategoryId} missing reassessmentCheckpoints`);
    assert.ok(subcategory.contaminationPitfalls?.length, `${diseaseId}/${subcategoryId} missing contaminationPitfalls`);
    assert.ok(subcategory.durationAnchors?.length, `${diseaseId}/${subcategoryId} missing durationAnchors`);
  }
});

test("reassessment engine marks explicit cUTI checkpoints ready when culture and source-control milestones are complete", () => {
  const subcategory = findSubcategory("uti", "complicated-uti");
  assert.ok(subcategory, "Expected complicated UTI pathway");

  const items = getPathwayReassessmentItems(subcategory, {
    cultureCollectedOn: hoursAgo(72),
    cultureStatus: "final",
    finalCultureOn: hoursAgo(30),
    sourceControl: "achieved",
    sourceControlOn: hoursAgo(24),
  });

  assert.equal(itemByWindow(items, "24h").status, "ready");
  assert.equal(itemByWindow(items, "48h").status, "ready");
  assert.equal(itemByWindow(items, "definitive").status, "ready");
});

test("reassessment engine blocks early checkpoints when cultures were not sent and source control is pending", () => {
  const subcategory = findSubcategory("sepsis", "septic-shock");
  assert.ok(subcategory, "Expected septic shock pathway");

  const items = getPathwayReassessmentItems(subcategory, {
    cultureStatus: "not_sent",
    sourceControl: "pending",
  });

  assert.equal(itemByWindow(items, "24h").status, "not_ready");
  assert.equal(itemByWindow(items, "48h").status, "not_ready");
  assert.equal(itemByWindow(items, "definitive").status, "needs_data");
});

test("reassessment engine can lock definitive therapy when high-risk FN has final cultures and no procedural source-control need", () => {
  const subcategory = findSubcategory("febrile-neutropenia", "high-risk-fn");
  assert.ok(subcategory, "Expected high-risk FN pathway");

  const items = getPathwayReassessmentItems(subcategory, {
    cultureCollectedOn: hoursAgo(60),
    cultureStatus: "final",
    finalCultureOn: hoursAgo(18),
    sourceControl: "not_applicable",
  });

  assert.equal(itemByWindow(items, "24h").status, "ready");
  assert.equal(itemByWindow(items, "48h").status, "ready");
  assert.equal(itemByWindow(items, "definitive").status, "ready");
});
