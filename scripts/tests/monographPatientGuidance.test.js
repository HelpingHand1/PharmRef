const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const validationRoot = path.resolve(__dirname, "../../.tmp/validation/src");
const { DISEASE_STATES } = require(path.join(validationRoot, "data/index.js"));
const { buildCatalogDerived } = require(path.join(validationRoot, "data/derived.js"));
const { getMonographPatientGuidance } = require(path.join(validationRoot, "utils/monographPatientGuidance.js"));

const derived = buildCatalogDerived(DISEASE_STATES);

function monographById(monographId) {
  const record = derived.findMonograph(monographId);
  assert.ok(record, `Expected monograph ${monographId}`);
  return record.monograph;
}

test("monograph guidance stays quiet without patient context", () => {
  const ceftriaxone = monographById("ceftriaxone");
  assert.deepEqual(getMonographPatientGuidance(ceftriaxone, {}, null, null, null), []);
});

test("nitrofurantoin guidance combines oral-route and renal cutoffs", () => {
  const nitrofurantoin = monographById("nitrofurantoin");
  const guidance = getMonographPatientGuidance(
    nitrofurantoin,
    {
      age: 50,
      weight: 70,
      scr: 2,
      sex: "female",
      oralRoute: "none",
    },
    25,
    null,
    null,
  );

  const titles = guidance.map((item) => item.title);
  assert.deepEqual(titles, ["Renal cutoff", "Oral route unavailable"]);
});

test("linezolid guidance highlights serotonergic and PO step-down context", () => {
  const linezolid = monographById("linezolid");
  const guidance = getMonographPatientGuidance(
    linezolid,
    {
      oralRoute: "adequate",
      serotonergicMeds: true,
    },
    null,
    null,
    null,
  );

  const titles = guidance.map((item) => item.title);
  assert.ok(titles.includes("Serotonergic interaction risk"));
  assert.ok(titles.includes("PO step-down candidate"));
});

test("ertapenem guidance blocks routine OPAT framing during CRRT", () => {
  const ertapenem = monographById("ertapenem");
  const guidance = getMonographPatientGuidance(
    ertapenem,
    {
      dialysis: "CRRT",
      opatSupport: "adequate",
    },
    null,
    null,
    null,
  );

  const titles = guidance.map((item) => item.title);
  assert.ok(titles.includes("Dialysis-specific dosing"));
  assert.ok(titles.includes("CRRT is not routine OPAT"));
});

test("monograph guidance reacts to bacteremia and rapid diagnostic stewardship signals", () => {
  const nitrofurantoin = monographById("nitrofurantoin");
  const nitroGuidance = getMonographPatientGuidance(
    nitrofurantoin,
    { bacteremiaConcern: true },
    60,
    null,
    null,
  );
  assert.ok(nitroGuidance.some((item) => item.title === "Poor bloodstream fit"));

  const cefepime = monographById("cefepime");
  const kpcGuidance = getMonographPatientGuidance(
    cefepime,
    { rapidDiagnosticResult: "kpc" },
    null,
    null,
    null,
  );
  assert.ok(kpcGuidance.some((item) => item.title === "KPC-directed therapy needed"));

  const meropenem = monographById("meropenem");
  const cultureGuidance = getMonographPatientGuidance(
    meropenem,
    { cultureStatus: "final" },
    null,
    null,
    null,
  );
  assert.ok(cultureGuidance.some((item) => item.title === "Culture final - narrowing review"));
});

test("monograph guidance surfaces active medication interactions from the patient profile", () => {
  const tmpSmx = monographById("tmp-smx");
  const guidance = getMonographPatientGuidance(
    tmpSmx,
    { activeMedications: ["warfarin"] },
    60,
    null,
    null,
  );

  assert.ok(guidance.some((item) => item.title === "Active medication interaction: warfarin matched"));
});
