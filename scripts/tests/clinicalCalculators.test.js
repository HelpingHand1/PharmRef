const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const calculators = require(path.resolve(__dirname, "../../.tmp/validation/src/utils/clinicalCalculators.js"));

test("Cockcroft-Gault returns expected rounded CrCl values", () => {
  assert.equal(
    calculators.calculateCreatinineClearance({ age: 65, weight: 70, scr: 1.2, sex: "male" }),
    60.8,
  );
  assert.equal(
    calculators.calculateCreatinineClearance({ age: 65, weight: 70, scr: 1.2, sex: "female" }),
    51.6,
  );
});

test("weight metrics return IBW, AdjBW, and BSA for obese adults", () => {
  assert.deepEqual(
    calculators.calculateWeightMetrics(170, 120, "male"),
    { ibw: 65.9, adjbw: 87.5, bsa: 2.38 },
  );
});

test("CURB-65 and PSI calculators classify risk as expected", () => {
  assert.deepEqual(
    calculators.calculateCurb65({
      confusion: true,
      bun: false,
      rr: true,
      bp: false,
      age65: true,
    }),
    {
      score: 3,
      risk: "High risk — ICU consideration warranted",
      management: "Inpatient required. Consider ICU if score ≥3 with sepsis criteria or hypoxia.",
    },
  );

  assert.deepEqual(
    calculators.calculatePsiClass({
      age: "70",
      sex: "male",
      nursingHome: false,
      neoplasm: false,
      liver: false,
      chf: false,
      cerebrovascular: false,
      renal: false,
      confusion: false,
      rr30: false,
      bp90: false,
      temp: false,
      hr125: false,
      ph735: false,
      bun30: false,
      na130: false,
      glucose250: false,
      hct30: false,
      po260: false,
      pleural: false,
    }),
    { score: 70, cls: 2, mortality: "0.6%", setting: "Outpatient" },
  );
});

test("vancomycin estimator uses weight-normalized CrCl and targets AUC 400-600", () => {
  // CL = (0.695 × 60/80 + 0.05) × 80 × 0.06 = 2.74 L/h; t½ 14.2 h → q12h; 750 mg q12h → AUC ≈ 547
  assert.deepEqual(
    calculators.estimateVancomycinRegimen(60, 80, 1),
    { dose: 750, interval: "q12h", dailyDose: 1500, auc: 547, halfLife: 14.2, warnings: [] },
  );
  const lowCrcl = calculators.estimateVancomycinRegimen(10, 70, 1);
  assert.equal(lowCrcl.interval, "q48h");
  assert.ok(lowCrcl.auc >= 400 && lowCrcl.auc <= 600);
  assert.match(lowCrcl.warnings[0], /level-guided dosing/);
  assert.match(calculators.estimateVancomycinRegimen(60, 80, 2).warnings[0], /alternative agent/);

  for (const [crcl, weight] of [[20, 50], [45, 60], [75, 90], [120, 75], [150, 130]]) {
    const estimate = calculators.estimateVancomycinRegimen(crcl, weight, 1);
    assert.ok(estimate.auc >= 400 && estimate.auc <= 600, `AUC out of range for CrCl ${crcl}, ${weight} kg`);
    assert.ok(estimate.dailyDose <= 4000, `Implausible daily dose for CrCl ${crcl}, ${weight} kg`);
  }
});

test("Hartford aminoglycoside estimator stays stable", () => {
  assert.deepEqual(
    calculators.calculateHartfordAminoglycoside(45, 80),
    {
      dose: 560,
      interval: "q36h",
      monitoring: "Check level 6–14h post-dose; adjust to nomogram",
    },
  );
});

test("extended-infusion beta-lactam helper escalates for ARC", () => {
  assert.deepEqual(
    calculators.estimateExtendedInfusionBetaLactam("meropenem", 135, false),
    {
      agent: "meropenem",
      regimen: "Meropenem 2 g IV q8h over 3 hours",
      rationale: "ARC or CrCl >=120 mL/min increases the risk of underexposure; preserve full prolonged-infusion exposure.",
    },
  );
});

test("PEN-FAST scores items and flags SCAR regardless of score", () => {
  const none = { recentReaction: false, anaphylaxisOrAngioedema: false, severeCutaneousReaction: false, treatmentRequired: false };
  assert.equal(calculators.calculatePenFast(none).risk, "Very low");
  assert.equal(calculators.calculatePenFast({ ...none, treatmentRequired: true }).score, 1);
  assert.equal(calculators.calculatePenFast({ ...none, recentReaction: true, treatmentRequired: true }).risk, "Moderate");

  const anaphylaxisAndScar = calculators.calculatePenFast({ ...none, anaphylaxisOrAngioedema: true, severeCutaneousReaction: true });
  assert.equal(anaphylaxisAndScar.score, 2, "A/S is a single 2-point item");

  const remoteScar = calculators.calculatePenFast({ ...none, severeCutaneousReaction: true });
  assert.equal(remoteScar.score, 2);
  assert.equal(remoteScar.avoidChallenge, true);
  assert.match(remoteScar.recommendation, /do not challenge/);

  const high = calculators.calculatePenFast({ recentReaction: true, anaphylaxisOrAngioedema: true, severeCutaneousReaction: false, treatmentRequired: true });
  assert.deepEqual([high.score, high.risk, high.positiveTestRate, high.avoidChallenge], [5, "High", "~50%", true]);
});

test("antibiotic course counts the start date as day 1", () => {
  assert.deepEqual(
    calculators.calculateAntibioticCourse("2026-11-01", 7, "2026-11-03"),
    { finalDay: "2026-11-07", dayOfTherapy: 3, daysRemaining: 4, status: "active" },
  );
  assert.equal(calculators.calculateAntibioticCourse("2026-11-28", 7, "2026-12-01").finalDay, "2026-12-04");
  assert.equal(calculators.calculateAntibioticCourse("2026-11-01", 7, "2026-11-07").daysRemaining, 0);
  assert.equal(calculators.calculateAntibioticCourse("2026-11-01", 7, "2026-11-08").status, "complete");
  assert.equal(calculators.calculateAntibioticCourse("2026-11-05", 14, "2026-11-03").status, "upcoming");
  assert.equal(calculators.calculateAntibioticCourse("2026-11-01", 0, "2026-11-03"), null);
  assert.equal(calculators.calculateAntibioticCourse("11/01/2026", 7, "2026-11-03"), null);
});

test("daptomycin, TMP-SMX, colistin, and azole helpers stay stable", () => {
  assert.deepEqual(
    calculators.calculateDaptomycinDose(92, 10),
    { mgPerKg: 10, totalDoseMg: 900 },
  );
  assert.deepEqual(
    calculators.calculateTmpSmxDose(80, 10, 2),
    { totalTmpMgPerDay: 800, tmpMgPerDose: 400, dsTabsPerDose: 2.5 },
  );
  assert.deepEqual(
    calculators.convertColistinDose(1, "million_iu"),
    { millionIU: 1, cmsMg: 80, cbaMg: 33 },
  );
  assert.deepEqual(
    calculators.assessAzoleTrough("voriconazole", 6.2),
    {
      goal: "1-5.5 mcg/mL",
      interpretation: "High exposure / toxicity risk",
      action: "Evaluate for hepatotoxicity or neurotoxicity and consider dose reduction or alternate azole strategy.",
    },
  );
});
