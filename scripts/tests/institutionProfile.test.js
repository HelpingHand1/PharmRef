const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const validationRoot = path.resolve(__dirname, "../../.tmp/validation/src");
const {
  getInstitutionDrugAntibiogram,
  INSTITUTION_PROFILE,
  getInstitutionOptionAntibiogram,
  getInstitutionDrugPolicy,
  getInstitutionOptionOverlay,
  getInstitutionPathwayAntibiogram,
  getInstitutionPathwayNotes,
  sortEmpiricOptionsForInstitution,
} = require(path.join(validationRoot, "data/institution-profile.js"));

test("institution profile exposes pathway notes and drug policy", () => {
  const notes = getInstitutionPathwayNotes("hap-vap", "hap-mdr-risk", INSTITUTION_PROFILE);
  assert.ok(notes.length > 0, "Expected pathway notes for HAP/VAP MDR-risk path");

  const creNotes = getInstitutionPathwayNotes("amr-gn", "cre-kpc", INSTITUTION_PROFILE);
  assert.ok(creNotes.length > 0, "Expected pathway notes for KPC-CRE path");

  const dtrAntibiogram = getInstitutionPathwayAntibiogram("advanced-agents", "mdr-pseudomonas", INSTITUTION_PROFILE);
  assert.ok(dtrAntibiogram.length > 0, "Expected antibiogram entries for MDR Pseudomonas path");

  const meropenemPolicy = getInstitutionDrugPolicy("meropenem", INSTITUTION_PROFILE);
  assert.ok(meropenemPolicy, "Expected meropenem policy in institution profile");
  assert.match(meropenemPolicy.restriction, /timeout/i);

  const cefiderocolPolicy = getInstitutionDrugPolicy("cefiderocol", INSTITUTION_PROFILE);
  assert.ok(cefiderocolPolicy, "Expected cefiderocol policy in institution profile");
  assert.match(cefiderocolPolicy.restriction, /reserve/i);
});

test("institution profile marks preferred and restricted regimen overlays", () => {
  const cefepimeOverlay = getInstitutionOptionOverlay(
    "hap-vap",
    "hap-mdr-risk",
    { regimen: "Cefepime 2g IV q8h", monographId: "cefepime" },
    INSTITUTION_PROFILE,
  );
  assert.ok(cefepimeOverlay?.preferred, "Expected cefepime to be locally preferred in HAP/VAP MDR-risk path");

  const meropenemOverlay = getInstitutionOptionOverlay(
    "hap-vap",
    "hap-mdr-risk",
    { regimen: "Meropenem 2g IV q8h", monographId: "meropenem" },
    INSTITUTION_PROFILE,
  );
  assert.ok(meropenemOverlay?.restricted, "Expected meropenem to be restricted in HAP/VAP MDR-risk path");

  const noOverlay = getInstitutionOptionOverlay(
    "hap-vap",
    "hap-mdr-risk",
    { regimen: "Piperacillin-tazobactam 4.5g IV q6h", monographId: "pip-tazo" },
    null,
  );
  assert.equal(noOverlay, null);

  const merVabOverlay = getInstitutionOptionOverlay(
    "amr-gn",
    "cre-kpc",
    { regimen: "Meropenem-vaborbactam 4g IV q8h", monographId: "meropenem-vaborbactam" },
    INSTITUTION_PROFILE,
  );
  assert.ok(merVabOverlay?.preferred, "Expected meropenem-vaborbactam to be locally preferred in KPC-CRE");

  const merVabAntibiogram = getInstitutionOptionAntibiogram(
    "amr-gn",
    "cre-kpc",
    { regimen: "Meropenem-vaborbactam 4g IV q8h", monographId: "meropenem-vaborbactam" },
    INSTITUTION_PROFILE,
  );
  assert.ok(merVabAntibiogram.length > 0, "Expected option-level antibiogram overlay for meropenem-vaborbactam");
});

test("institution profile sorts preferred options ahead of restricted ones", () => {
  const sorted = sortEmpiricOptionsForInstitution(
    "hap-vap",
    "hap-mdr-risk",
    [
      { regimen: "Meropenem 2g IV q8h", monographId: "meropenem" },
      { regimen: "Cefepime 2g IV q8h", monographId: "cefepime" },
      { regimen: "Piperacillin-tazobactam 4.5g IV q6h", monographId: "pip-tazo" },
    ],
    INSTITUTION_PROFILE,
  );

  assert.equal(sorted[0].option.monographId, "cefepime");
  assert.equal(sorted.at(-1).option.monographId, "meropenem");
});

test("institution profile exposes monograph-level antibiogram overlays", () => {
  const cefiderocolAntibiogram = getInstitutionDrugAntibiogram("cefiderocol", INSTITUTION_PROFILE);
  assert.ok(cefiderocolAntibiogram.length > 0, "Expected cefiderocol antibiogram entries");
  assert.match(cefiderocolAntibiogram[0].source, /dashboard|summary/i);
});
