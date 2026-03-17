const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const validationRoot = path.resolve(__dirname, "../../.tmp/validation/src");
const { DISEASE_STATES } = require(path.join(validationRoot, "data/index.js"));
const { buildCatalogDerived } = require(path.join(validationRoot, "data/derived.js"));
const { searchCatalog } = require(path.join(validationRoot, "utils/searchCatalog.js"));

const derived = buildCatalogDerived(DISEASE_STATES);

function findDisease(diseaseId) {
  return DISEASE_STATES.find((disease) => disease.id === diseaseId) ?? null;
}

function findSubcategory(diseaseId, subcategoryId) {
  return findDisease(diseaseId)?.subcategories.find((subcategory) => subcategory.id === subcategoryId) ?? null;
}

function findMonograph(diseaseId, monographId) {
  return findDisease(diseaseId)?.drugMonographs.find((monograph) => monograph.id === monographId) ?? null;
}

test("severe CAP ICU reassessment exposes a 48-72 hour stewardship workflow", () => {
  const capIcu = findSubcategory("cap", "cap-icu");
  assert.ok(capIcu, "Expected CAP ICU pathway");
  assert.ok(capIcu.deEscalation, "Expected structured de-escalation guidance on CAP ICU pathway");
  assert.match(capIcu.deEscalation.summary ?? "", /48-72/i);
  assert.match(capIcu.deEscalation.summary ?? "", /MRSA nares PCR/i);
  assert.match(capIcu.ivToPoPlan?.summary ?? "", /shock resolves/i);
  assert.match(capIcu.failureEscalation?.summary ?? "", /beta-lactam infusion strategy/i);
});

test("CRE guidance differentiates therapy by carbapenemase phenotype", () => {
  const kpc = findSubcategory("amr-gn", "cre-kpc");
  const mbl = findSubcategory("amr-gn", "cre-mbl");
  const merVab = findMonograph("amr-gn", "meropenem-vaborbactam");
  const cazAvi = findMonograph("amr-gn", "ceftazidime-avibactam");

  assert.ok(kpc, "Expected KPC-CRE pathway");
  assert.ok(mbl, "Expected MBL-CRE pathway");
  assert.ok(merVab, "Expected meropenem-vaborbactam monograph");
  assert.ok(cazAvi, "Expected ceftazidime-avibactam monograph");

  assert.ok(
    kpc.coverageMatrix?.some((entry) => entry.label === "KPC confirmed" && entry.status === "preferred"),
    "Expected KPC pathway to mark KPC-confirmed treatment as preferred",
  );
  assert.ok(
    kpc.coverageMatrix?.some((entry) => /MBL detected/i.test(entry.label) && entry.status === "avoid"),
    "Expected KPC pathway to reject MBL therapy carryover",
  );
  assert.ok(
    mbl.coverageMatrix?.some((entry) => /Confirmed NDM, VIM, or IMP/i.test(entry.label) && entry.status === "preferred"),
    "Expected MBL pathway to elevate phenotype-specific options",
  );
  assert.ok(
    merVab.rapidDiagnostics?.some((entry) => /KPC/i.test(entry.trigger) && /near the top/i.test(entry.action)),
    "Expected meropenem-vaborbactam to activate on KPC confirmation",
  );
  assert.ok(
    merVab.rapidDiagnostics?.some((entry) => /OXA-48|MBL/i.test(entry.trigger) && /Do not use/i.test(entry.action)),
    "Expected meropenem-vaborbactam to warn against non-KPC CRE mechanisms",
  );
  assert.ok(
    cazAvi.rapidDiagnostics?.some((entry) => /NDM|VIM|IMP/i.test(entry.trigger) && /pair aztreonam|cefiderocol/i.test(entry.action)),
    "Expected ceftazidime-avibactam to direct MBL therapy toward aztreonam pairing or cefiderocol",
  );
});

test("osteomyelitis workflow supports oral step-down after source control", () => {
  const vertebralOsteo = findSubcategory("bone-joint", "vertebral-osteomyelitis");
  const diabeticFootOsteo = findSubcategory("bone-joint", "diabetic-foot-osteo");

  assert.ok(vertebralOsteo, "Expected vertebral osteomyelitis pathway");
  assert.ok(diabeticFootOsteo, "Expected diabetic foot osteomyelitis pathway");

  assert.match(vertebralOsteo.sourceControl?.summary ?? "", /Drain|surgery|abscess/i);
  assert.match(vertebralOsteo.ivToPoPlan?.summary ?? "", /oral step-down/i);
  assert.match(vertebralOsteo.ivToPoPlan?.summary ?? "", /source control|bone penetration/i);
  assert.match(diabeticFootOsteo.sourceControl?.summary ?? "", /Debridement|resection|revascularization/i);
  assert.match(diabeticFootOsteo.ivToPoPlan?.summary ?? "", /oral step-down/i);
  assert.match(diabeticFootOsteo.durationAnchor?.summary ?? "", /clean margins|shorten therapy/i);

  const results = searchCatalog("oral step-down osteomyelitis source control", derived.searchIndex);
  assert.ok(results, "Expected osteomyelitis workflow to be searchable");
  assert.ok(
    results.subcategories.some(
      (subcategory) =>
        subcategory.parentDisease.id === "bone-joint" &&
        ["vertebral-osteomyelitis", "diabetic-foot-osteo"].includes(subcategory.id),
    ),
    "Expected structured bone/joint workflows to answer osteomyelitis step-down searches",
  );
});

test("vancomycin monograph encodes an AUC-guided monitoring workflow", () => {
  const vancomycin = findMonograph("hap-vap", "vancomycin");
  assert.ok(vancomycin, "Expected vancomycin monograph in HAP/VAP");
  assert.match(vancomycin.therapeuticDrugMonitoring?.target ?? "", /AUC\/MIC 400-600/i);
  assert.match(vancomycin.therapeuticDrugMonitoring?.sampling ?? "", /Bayesian|first maintenance/i);
  assert.ok(
    vancomycin.renalReplacement?.some((entry) => entry.modality === "CRRT"),
    "Expected CRRT guidance for vancomycin",
  );
  assert.ok(
    vancomycin.specialPopulations?.some((entry) => /Augmented renal clearance/i.test(entry.population)),
    "Expected ARC guidance for vancomycin",
  );
});

test("meropenem monograph captures CRRT and ARC dosing logic", () => {
  const meropenem = findMonograph("hap-vap", "meropenem");
  assert.ok(meropenem, "Expected meropenem monograph in HAP/VAP");
  assert.ok(
    meropenem.dosingByIndication?.some(
      (entry) => /HAP \/ VAP|septic shock/i.test(entry.label) && /extended infusion/i.test(entry.regimen),
    ),
    "Expected meropenem indication dosing to preserve extended infusion for severe infection",
  );
  assert.ok(
    meropenem.renalReplacement?.some((entry) => entry.modality === "CRRT" && /q8h|effluent/i.test(entry.guidance)),
    "Expected CRRT dosing guidance for meropenem",
  );
  assert.ok(
    meropenem.specialPopulations?.some(
      (entry) => /Augmented renal clearance/i.test(entry.population) && /q8h extended infusion|T>MIC/i.test(entry.guidance),
    ),
    "Expected ARC-specific meropenem guidance",
  );
  assert.match(meropenem.therapeuticDrugMonitoring?.adjustment ?? "", /infusion time|renal replacement exposure/i);
});
