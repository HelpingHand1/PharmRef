const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const validationRoot = path.resolve(__dirname, "../../.tmp/validation/src");
const { DISEASE_STATES } = require(path.join(validationRoot, "data/index.js"));
const { buildCatalogDerived } = require(path.join(validationRoot, "data/derived.js"));
const { buildMonographCompareSnapshot } = require(path.join(validationRoot, "data/compare.js"));

const derived = buildCatalogDerived(DISEASE_STATES);

function lookupMonograph(drugId) {
  const result = derived.findMonograph(drugId);
  assert.ok(result, `Expected monograph ${drugId}`);
  return result;
}

test("compare snapshots surface trust, local policy, and regimen footprint for stewardship backbones", () => {
  const meropenem = lookupMonograph("meropenem");
  const snapshot = buildMonographCompareSnapshot(meropenem, derived.regimenXref.meropenem ?? []);

  assert.match(snapshot.trustSummary, /confidence|reviewed/i);
  assert.ok(snapshot.regimenCount > 0, "Expected meropenem to appear in structured regimen cross-references");
  assert.match(snapshot.regimenFootprintSummary, /structured regimen reference/i);
  assert.match(snapshot.institutionPolicySummary, /Carbapenem timeout|required/i);
});

test("compare snapshots expose rapid diagnostics and local antibiogram overlays for reserve agents", () => {
  const cefiderocol = lookupMonograph("cefiderocol");
  const snapshot = buildMonographCompareSnapshot(cefiderocol, derived.regimenXref.cefiderocol ?? []);

  assert.match(snapshot.rapidDiagnosticSummary, /NDM|MBL|CRAB/i);
  assert.match(snapshot.localAntibiogramSummary, /reserve-agent dashboard|restricted-use|susceptibility/i);
  assert.equal(snapshot.localBadge, "Restricted local use");
});

test("compare snapshots preserve IV-to-PO and OPAT summaries for oral-friendly agents", () => {
  const tedizolid = lookupMonograph("tedizolid");
  const snapshot = buildMonographCompareSnapshot(tedizolid, derived.regimenXref.tedizolid ?? []);

  assert.match(snapshot.ivToPoSummary, /bioavailability|switch when/i);
  assert.match(snapshot.opatSummary, /eligibility|administration|monitoring/i);
});

test("compare snapshots surface patient-specific fit when context is present", () => {
  const nitrofurantoin = lookupMonograph("nitrofurantoin");
  const snapshot = buildMonographCompareSnapshot(
    nitrofurantoin,
    derived.regimenXref.nitrofurantoin ?? [],
    undefined,
    { age: 50, weight: 70, scr: 2, sex: "female", oralRoute: "none" },
    25,
    null,
    null,
  );

  assert.equal(snapshot.patientFitBadge, "Patient fit: Avoid");
  assert.equal(snapshot.patientFitTone, "danger");
  assert.match(snapshot.patientFitSummary, /Renal cutoff|Oral route unavailable/i);
});

test("compare snapshots prefer matched medication interactions when a patient med list is present", () => {
  const tmpSmx = lookupMonograph("tmp-smx");
  const snapshot = buildMonographCompareSnapshot(
    tmpSmx,
    derived.regimenXref["tmp-smx"] ?? [],
    undefined,
    { activeMedications: ["warfarin"] },
    60,
    null,
    null,
  );

  assert.match(snapshot.interactionSummary, /warfarin matched/i);
  assert.match(snapshot.interactionSummary, /reduce warfarin and check INR/i);
});
