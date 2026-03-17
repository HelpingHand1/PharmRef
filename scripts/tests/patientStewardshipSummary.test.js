const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const validationRoot = path.resolve(__dirname, "../../.tmp/validation/src");
const {
  buildPatientContextTags,
  getPatientReassessmentFocus,
} = require(path.join(validationRoot, "utils/patientStewardshipSummary.js"));

test("patient context tags surface microbiology and source-control inputs", () => {
  const tags = buildPatientContextTags(
    {
      recentHospitalization: true,
      mrsaNares: "negative",
      rapidDiagnosticResult: "kpc",
      sourceControl: "pending",
      bacteremiaConcern: true,
      activeMedications: ["warfarin", "tacrolimus", "atorvastatin"],
    },
    42,
  );

  assert.ok(tags.includes("CrCl 42 mL/min"));
  assert.ok(tags.includes("Recent hospitalization"));
  assert.ok(tags.includes("MRSA nares negative"));
  assert.ok(tags.includes("Rapid dx: KPC"));
  assert.ok(tags.includes("Source control pending"));
  assert.ok(tags.includes("Bacteremia concern"));
  assert.ok(tags.includes("Meds: warfarin | tacrolimus | +1 more"));
});

test("patient reassessment focus prioritizes high-severity stewardship actions", () => {
  const focus = getPatientReassessmentFocus({
    cultureStatus: "final",
    rapidDiagnosticResult: "mbl",
    sourceControl: "achieved",
    endovascularConcern: true,
  });

  const titles = focus.map((item) => item.title);
  assert.deepEqual(titles.slice(0, 2), [
    "Rapid diagnostic MBL signal",
    "Endovascular infection concern",
  ]);
  assert.ok(titles.includes("Cultures are final"));
  assert.ok(titles.includes("Source control achieved"));
});
