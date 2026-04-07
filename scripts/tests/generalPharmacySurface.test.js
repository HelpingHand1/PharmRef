const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const validationRoot = path.resolve(__dirname, "../../.tmp/validation/src");
const { DISEASE_STATES } = require(path.join(validationRoot, "data/index.js"));
const { buildCatalogDerived } = require(path.join(validationRoot, "data/derived.js"));
const { getPathwayWorkflowGroupTitles } = require(path.join(validationRoot, "data/stewardship.js"));
const {
  getTreatmentSectionTitle,
  getTreatmentSummaryLabel,
  getTreatmentTiers,
  showsInfectiousDetail,
} = require(path.join(validationRoot, "data/topic-surface.js"));
const { searchCatalog } = require(path.join(validationRoot, "utils/searchCatalog.js"));

const derived = buildCatalogDerived(DISEASE_STATES);

function findDisease(diseaseId) {
  return DISEASE_STATES.find((disease) => disease.id === diseaseId) ?? null;
}

test("t2dm is registered as a top-level general-pharmacy topic in the expected position", () => {
  const t2dm = findDisease("t2dm");

  assert.ok(t2dm, "Expected T2DM to be present in the catalog");
  assert.equal(t2dm.surfaceMode, "general-pharmacy");
  assert.deepEqual(t2dm.drugMonographs, []);
  assert.equal(t2dm.subcategories.length, 7);

  const ordering = DISEASE_STATES
    .filter((disease) => ["diabetic-foot", "t2dm", "sepsis"].includes(disease.id))
    .map((disease) => disease.id);

  assert.deepEqual(ordering, ["diabetic-foot", "t2dm", "sepsis"]);
});

test("general-pharmacy helpers expose neutral labels and treatment tiers for t2dm", () => {
  const t2dm = findDisease("t2dm");
  const hospitalPathway = t2dm?.subcategories.find((subcategory) => subcategory.id === "hospital-management-non-icu");

  assert.ok(t2dm, "Expected T2DM topic to exist");
  assert.ok(hospitalPathway, "Expected inpatient T2DM pathway to exist");
  assert.equal(showsInfectiousDetail(t2dm), false);
  assert.equal(getTreatmentSummaryLabel(t2dm), "Treatment Tiers");
  assert.equal(getTreatmentSectionTitle(hospitalPathway, t2dm), "Treatment Approach");
  assert.deepEqual(getPathwayWorkflowGroupTitles(t2dm), {
    "workflow-diagnostics": "Initial Assessment",
    "workflow-reassessment": "Ongoing Management",
    "workflow-transition": "Transition / Follow-up",
  });
  assert.ok(getTreatmentTiers(hospitalPathway).length > 0, "Expected T2DM pathways to expose neutral treatment tiers");
});

test("t2dm search aliases resolve and the topic stays free of infectious-only structures", () => {
  const t2dm = findDisease("t2dm");
  const t2dmSearch = searchCatalog("t2dm", derived.searchIndex);
  const diabetesSearch = searchCatalog("type 2 diabetes", derived.searchIndex);

  assert.ok(
    t2dmSearch?.diseases.some((disease) => disease.id === "t2dm"),
    "Expected t2dm alias to return the T2DM topic",
  );
  assert.ok(
    diabetesSearch?.diseases.some((disease) => disease.id === "t2dm"),
    "Expected type 2 diabetes alias to return the T2DM topic",
  );
  assert.deepEqual(derived.findPathogensForDisease("t2dm"), []);

  t2dm?.subcategories.forEach((subcategory) => {
    assert.ok(!subcategory.organismSpecific, `${subcategory.id} should not define organism-specific content`);
    assert.ok(!subcategory.definitiveTherapy, `${subcategory.id} should not define definitive therapy content`);
    assert.ok(!subcategory.oralStepDown, `${subcategory.id} should not define oral step-down content`);
  });
});
