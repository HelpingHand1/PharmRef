const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const validationRoot = path.resolve(__dirname, "../../.tmp/validation/src");
const { DISEASE_STATES } = require(path.join(validationRoot, "data/index.js"));
const { buildCatalogDerived } = require(path.join(validationRoot, "data/derived.js"));
const {
  getMonographPatientFit,
  getPatientFitSortRank,
  getRegimenPatientFit,
} = require(path.join(validationRoot, "utils/patientFit.js"));

const derived = buildCatalogDerived(DISEASE_STATES);

function monographById(monographId) {
  const record = derived.findMonograph(monographId);
  assert.ok(record, `Expected monograph ${monographId}`);
  return record.monograph;
}

test("regimen fit classifies avoid, caution, needs-data, and preferred predictably", () => {
  assert.deepEqual(
    getRegimenPatientFit(
      "Nitrofurantoin 100mg PO BID",
      "nitrofurantoin",
      { age: 50, weight: 70, scr: 2, sex: "female" },
      25,
    ),
    {
      status: "avoid",
      label: "Avoid",
      detail: "Renal cutoff",
      reasons: ["Renal cutoff"],
    },
  );

  assert.deepEqual(
    getRegimenPatientFit(
      "Moxifloxacin 400mg PO daily",
      "moxifloxacin",
      { qtRisk: true, oralRoute: "adequate" },
      null,
    ),
    {
      status: "caution",
      label: "Caution",
      detail: "QT risk present",
      reasons: ["QT risk present"],
    },
  );

  assert.deepEqual(
    getRegimenPatientFit(
      "Vancomycin IV",
      "vancomycin",
      { age: 65, weight: 70, scr: 1.2, sex: "male" },
      40,
    ),
    {
      status: "caution",
      label: "Caution",
      detail: "PK-guided dosing",
      reasons: ["PK-guided dosing"],
    },
  );

  assert.deepEqual(
    getRegimenPatientFit(
      "Daptomycin 8 mg/kg IV daily",
      "daptomycin",
      { age: 50 },
      null,
    ),
    {
      status: "needs_data",
      label: "Needs data",
      detail: "Weight missing",
      reasons: ["Weight missing"],
    },
  );
});

test("regimen fit honors microbiology and source-control context", () => {
  assert.deepEqual(
    getRegimenPatientFit(
      "Ceftazidime-avibactam IV",
      "ceftazidime-avibactam",
      { rapidDiagnosticResult: "mbl" },
      null,
    ),
    {
      status: "avoid",
      label: "Avoid",
      detail: "MBL-directed therapy needed",
      reasons: ["MBL-directed therapy needed"],
    },
  );

  assert.deepEqual(
    getRegimenPatientFit(
      "Ceftriaxone 2 g IV q24h + metronidazole 500 mg IV q8h",
      "ceftriaxone",
      { sourceControl: "pending" },
      null,
      {
        regimen: "Ceftriaxone + metronidazole",
        site: "Intra-abdominal infection",
      },
    ),
    {
      status: "caution",
      label: "Caution",
      detail: "Source control pending",
      reasons: ["Source control pending"],
    },
  );

  assert.deepEqual(
    getRegimenPatientFit(
      "TMP-SMX DS PO BID",
      "tmp-smx",
      { activeMedications: ["warfarin"] },
      60,
      null,
      [
        {
          interactingAgent: "Warfarin",
          effect: "Marked INR elevation can occur quickly through CYP2C9 inhibition and gut-flora effects.",
          management: "Choose another agent when feasible or reduce warfarin and check INR within a few days.",
          severity: "major",
        },
      ],
    ),
    {
      status: "caution",
      label: "Caution",
      detail: "Active medication interaction: warfarin matched",
      reasons: ["Active medication interaction: warfarin matched"],
    },
  );
});

test("monograph fit promotes positive patient-fit signals without downgrading", () => {
  const amoxicillin = monographById("amoxicillin");
  const fit = getMonographPatientFit(
    amoxicillin,
    { oralRoute: "adequate" },
    null,
    null,
    null,
  );

  assert.equal(fit.status, "preferred");
  assert.match(fit.detail, /PO-first fit|PO step-down candidate/i);
});

test("monograph fit detects avoid and caution states from bedside context", () => {
  const nitrofurantoin = monographById("nitrofurantoin");
  const nitroFit = getMonographPatientFit(
    nitrofurantoin,
    { age: 50, weight: 70, scr: 2, sex: "female", oralRoute: "none" },
    25,
    null,
    null,
  );
  assert.equal(nitroFit.status, "avoid");
  assert.match(nitroFit.detail, /Renal cutoff|Oral route unavailable/);

  const linezolid = monographById("linezolid");
  const linezolidFit = getMonographPatientFit(
    linezolid,
    { serotonergicMeds: true, oralRoute: "adequate" },
    null,
    null,
    null,
  );
  assert.equal(linezolidFit.status, "avoid");
  assert.match(linezolidFit.detail, /Serotonergic interaction risk/i);

  const cefepime = monographById("cefepime");
  const cefepimeFit = getMonographPatientFit(
    cefepime,
    { rapidDiagnosticResult: "kpc" },
    null,
    null,
    null,
  );
  assert.equal(cefepimeFit.status, "avoid");
  assert.match(cefepimeFit.detail, /KPC-directed therapy needed/i);

  const tmpSmx = monographById("tmp-smx");
  const tmpSmxFit = getMonographPatientFit(
    tmpSmx,
    { activeMedications: ["warfarin"] },
    60,
    null,
    null,
  );
  assert.equal(tmpSmxFit.status, "caution");
  assert.match(tmpSmxFit.detail, /Active medication interaction: warfarin matched/i);
});

test("patient fit sort rank keeps preferred options ahead of avoids", () => {
  assert.ok(
    getPatientFitSortRank({ status: "preferred" }) <
      getPatientFitSortRank({ status: "caution" }),
  );
  assert.ok(
    getPatientFitSortRank({ status: "caution" }) <
      getPatientFitSortRank({ status: "needs_data" }),
  );
  assert.ok(
    getPatientFitSortRank({ status: "needs_data" }) <
      getPatientFitSortRank({ status: "avoid" }),
  );
  assert.ok(
    getPatientFitSortRank({ status: "avoid" }) <
      getPatientFitSortRank({ status: "unavailable" }),
  );
});
