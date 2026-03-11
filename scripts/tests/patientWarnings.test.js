const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const {
  getRegimenPatientWarnings,
  hasAnyPatientSignals,
} = require(path.resolve(__dirname, "../../.tmp/validation/src/utils/regimenGuidance.js"));

test("patient signal detection stays conservative", () => {
  assert.equal(hasAnyPatientSignals({}), false);
  assert.equal(hasAnyPatientSignals({ dialysis: "HD" }), true);
  assert.equal(hasAnyPatientSignals({ age: 70 }), true);
});

test("nitrofurantoin flags the renal cutoff", () => {
  assert.deepEqual(
    getRegimenPatientWarnings(
      "Nitrofurantoin 100mg PO BID",
      "nitrofurantoin",
      { age: 50, weight: 70, scr: 2, sex: "female", dialysis: "none" },
      25,
    ),
    [
      {
        severity: "critical",
        title: "Renal cutoff",
        detail: "Nitrofurantoin is generally avoided when CrCl is below 30 mL/min.",
        calculatorLabel: "CrCl",
      },
    ],
  );
});

test("pregnancy and PK-guided dosing warnings resolve predictably", () => {
  assert.deepEqual(
    getRegimenPatientWarnings("Doxycycline 100mg PO BID", "doxycycline", { pregnant: true }, null),
    [
      {
        severity: "critical",
        title: "Pregnancy caution",
        detail: "Tetracyclines are usually avoided in pregnancy because of fetal bone and tooth effects.",
      },
    ],
  );

  assert.deepEqual(
    getRegimenPatientWarnings(
      "Vancomycin IV",
      "vancomycin",
      { age: 65, weight: 70, scr: 1.2, sex: "male" },
      40,
    ),
    [
      {
        severity: "warn",
        title: "PK-guided dosing",
        detail: "Current CrCl is 40 mL/min. Therapeutic drug monitoring and individualized interval selection are recommended here.",
        calculatorLabel: "Vancomycin AUC",
      },
    ],
  );
});
