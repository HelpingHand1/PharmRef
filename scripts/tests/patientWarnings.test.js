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
  assert.equal(hasAnyPatientSignals({ oralRoute: "adequate" }), true);
  assert.equal(hasAnyPatientSignals({ cultureStatus: "final" }), true);
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

test("bedside execution flags trigger regimen warnings predictably", () => {
  assert.deepEqual(
    getRegimenPatientWarnings(
      "Linezolid 600mg PO q12h",
      "linezolid",
      { serotonergicMeds: true, oralRoute: "adequate" },
      null,
    ),
    [
      {
        severity: "critical",
        title: "Serotonergic interaction risk",
        detail: "This regimen can interact with serotonergic medications. Confirm whether a washout, monitoring plan, or alternative is needed.",
      },
    ],
  );

  assert.deepEqual(
    getRegimenPatientWarnings(
      "Moxifloxacin 400mg PO daily",
      "moxifloxacin",
      { qtRisk: true, oralRoute: "adequate" },
      null,
    ),
    [
      {
        severity: "warn",
        title: "QT risk present",
        detail: "This regimen includes QT-active therapy. Recheck ECG and electrolytes before relying on this option.",
      },
    ],
  );

  assert.deepEqual(
    getRegimenPatientWarnings(
      "Nitrofurantoin 100mg PO BID",
      "nitrofurantoin",
      { oralRoute: "none" },
      60,
    ),
    [
      {
        severity: "critical",
        title: "Oral route unavailable",
        detail: "This regimen relies on oral-only therapy. Choose an IV or non-oral alternative until enteral access is reliable.",
      },
    ],
  );
});

test("microbiology and source-control stewardship flags drive regimen warnings", () => {
  assert.deepEqual(
    getRegimenPatientWarnings(
      "Vancomycin IV",
      "vancomycin",
      { mrsaNares: "negative", weight: 70 },
      60,
      {
        regimen: "Vancomycin IV",
        site: "Pneumonia",
      },
    ),
    [
      {
        severity: "warn",
        title: "MRSA de-escalation candidate",
        detail: "Negative MRSA nares lowers the probability of MRSA pneumonia. Reassess whether anti-MRSA coverage is still needed at 48 to 72 hours.",
      },
    ],
  );

  assert.deepEqual(
    getRegimenPatientWarnings(
      "Ceftazidime-avibactam IV",
      "ceftazidime-avibactam",
      { rapidDiagnosticResult: "mbl" },
      null,
    ),
    [
      {
        severity: "critical",
        title: "MBL-directed therapy needed",
        detail: "An MBL signal is present. Avibactam monotherapy is not enough here, so use cefiderocol or synchronized aztreonam pairing if appropriate.",
      },
    ],
  );

  assert.deepEqual(
    getRegimenPatientWarnings(
      "Ceftriaxone 2 g IV q24h + metronidazole 500 mg IV q8h",
      "ceftriaxone",
      { sourceControl: "pending" },
      null,
      {
        regimen: "Ceftriaxone + metronidazole",
        site: "Intra-abdominal infection",
      },
    ),
    [
      {
        severity: "warn",
        title: "Source control pending",
        detail: "Source control is still pending, so antibiotic changes should be interpreted alongside drainage, debridement, or device removal timing.",
      },
    ],
  );

  assert.deepEqual(
    getRegimenPatientWarnings(
      "Nitrofurantoin 100mg PO BID",
      "nitrofurantoin",
      { bacteremiaConcern: true },
      60,
    ),
    [
      {
        severity: "critical",
        title: "Poor bloodstream fit",
        detail: "This regimen depends on agents with poor serum or tissue exposure and is a poor fit when bacteremia is a realistic concern.",
      },
    ],
  );
});

test("active medication profile triggers structured interaction warnings", () => {
  assert.deepEqual(
    getRegimenPatientWarnings(
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
    [
      {
        severity: "warn",
        title: "Active medication interaction: warfarin matched",
        detail: "Marked INR elevation can occur quickly through CYP2C9 inhibition and gut-flora effects. Choose another agent when feasible or reduce warfarin and check INR within a few days.",
      },
    ],
  );
});
