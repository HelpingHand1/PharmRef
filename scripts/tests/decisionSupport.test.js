const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const validationRoot = path.resolve(__dirname, "../../.tmp/validation/src");
const { DISEASE_STATES } = require(path.join(validationRoot, "data/index.js"));

function getSubcategory(diseaseId, subcategoryId) {
  const disease = DISEASE_STATES.find((entry) => entry.id === diseaseId);
  assert.ok(disease, `Expected disease ${diseaseId}`);
  const subcategory = disease.subcategories.find((entry) => entry.id === subcategoryId);
  assert.ok(subcategory, `Expected subcategory ${diseaseId}/${subcategoryId}`);
  return { disease, subcategory };
}

function getMonograph(diseaseId, monographId) {
  const disease = DISEASE_STATES.find((entry) => entry.id === diseaseId);
  assert.ok(disease, `Expected disease ${diseaseId}`);
  const monograph = disease.drugMonographs.find((entry) => entry.id === monographId);
  assert.ok(monograph, `Expected monograph ${diseaseId}/${monographId}`);
  return monograph;
}

test("MSSA bacteremia pathway encodes cefazolin as preferred definitive therapy", () => {
  const { subcategory } = getSubcategory("bacteremia-endocarditis", "sab-workup");
  const rule = subcategory.definitiveTherapy.find((entry) => entry.id === "sab-mssa-definitive");
  assert.ok(rule, "Expected SAB MSSA definitive rule");
  assert.match(rule.preferred.regimen, /cefazolin/i);
});

test("KPC and MBL pathways keep phenotype-specific definitive therapy split", () => {
  const { subcategory: kpc } = getSubcategory("amr-gn", "cre-kpc");
  const { subcategory: mbl } = getSubcategory("amr-gn", "cre-mbl");

  assert.match(kpc.definitiveTherapy[0].preferred.regimen, /meropenem-vaborbactam|ceftazidime-avibactam/i);
  assert.match(mbl.definitiveTherapy[0].preferred.regimen, /cefiderocol|aztreonam/i);
  assert.notEqual(kpc.definitiveTherapy[0].preferred.regimen, mbl.definitiveTherapy[0].preferred.regimen);
});

test("MRSA pneumonia oral step-down encodes platelet and CNI guardrails", () => {
  const { subcategory } = getSubcategory("hap-vap", "hap-mdr-risk");
  const [linezolidStepdown] = subcategory.oralStepDown;
  assert.ok(linezolidStepdown, "Expected linezolid oral step-down option");
  assert.deepEqual(
    linezolidStepdown.match.avoidPatientSignals,
    ["poor_oral_route", "thrombocytopenia", "calcineurin_inhibitor"],
  );
});

test("primary-owner monographs carry new decision-support execution structures", () => {
  const vancomycin = getMonograph("hap-vap", "vancomycin");
  const cefazolin = getMonograph("ssti", "cefazolin");

  assert.ok(vancomycin.specialPopulationMatrix?.length, "Expected vancomycin special population matrix");
  assert.ok(vancomycin.monitoringSchedule?.length, "Expected vancomycin monitoring schedule");
  assert.ok(vancomycin.executionBurden, "Expected vancomycin execution burden");

  assert.ok(cefazolin.specialPopulationMatrix?.length, "Expected cefazolin special population matrix");
  assert.ok(cefazolin.monitoringSchedule?.length, "Expected cefazolin monitoring schedule");
  assert.ok(cefazolin.executionBurden, "Expected cefazolin execution burden");
});
