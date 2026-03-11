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

test("vancomycin and Hartford aminoglycoside estimators stay stable", () => {
  assert.deepEqual(
    calculators.estimateVancomycinRegimen(60, 80, 1),
    { dose: 4500, interval: "q6h", auc: "440–560" },
  );
  assert.deepEqual(
    calculators.calculateHartfordAminoglycoside(45, 80),
    {
      dose: 560,
      interval: "q36h",
      monitoring: "Check level 6–14h post-dose; adjust to nomogram",
    },
  );
});
