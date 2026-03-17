const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const validationRoot = path.resolve(__dirname, "../../.tmp/validation/src");
const { DISEASE_STATES } = require(path.join(validationRoot, "data/index.js"));
const { buildCatalogDerived } = require(path.join(validationRoot, "data/derived.js"));
const {
  getMonographTransitionReadiness,
  getPathwayTransitionReadiness,
} = require(path.join(validationRoot, "utils/patientTransitionReadiness.js"));

const derived = buildCatalogDerived(DISEASE_STATES);

function monographById(monographId) {
  const record = derived.findMonograph(monographId);
  assert.ok(record, `Expected monograph ${monographId}`);
  return record.monograph;
}

function itemById(items, id) {
  const item = items.find((entry) => entry.id === id);
  assert.ok(item, `Expected readiness item ${id}`);
  return item;
}

test("pathway transition readiness classifies ready and blocked states predictably", () => {
  const ready = getPathwayTransitionReadiness({
    oralRoute: "adequate",
    sourceControl: "achieved",
    cultureStatus: "final",
    opatSupport: "adequate",
  });
  assert.equal(itemById(ready, "pathway-iv-to-po").status, "ready");
  assert.equal(itemById(ready, "pathway-opat").status, "ready");

  const blocked = getPathwayTransitionReadiness({
    oralRoute: "none",
    sourceControl: "pending",
    endovascularConcern: true,
    opatSupport: "limited",
  });
  assert.equal(itemById(blocked, "pathway-iv-to-po").status, "not_ready");
  assert.equal(itemById(blocked, "pathway-opat").status, "not_ready");
});

test("monograph transition readiness reacts to route, cultures, and OPAT logistics", () => {
  const ciprofloxacin = monographById("ciprofloxacin");
  const ciproReadiness = getMonographTransitionReadiness(ciprofloxacin, {
    oralRoute: "adequate",
    sourceControl: "achieved",
    cultureStatus: "final",
  });
  assert.equal(itemById(ciproReadiness, "monograph-iv-to-po").status, "ready");

  const daptomycin = monographById("daptomycin");
  const daptomycinReadiness = getMonographTransitionReadiness(daptomycin, {
    opatSupport: "adequate",
    sourceControl: "achieved",
    cultureStatus: "final",
  });
  assert.equal(itemById(daptomycinReadiness, "monograph-opat").status, "ready");

  const blockedDaptomycin = getMonographTransitionReadiness(daptomycin, {
    dialysis: "CRRT",
    opatSupport: "adequate",
  });
  assert.equal(itemById(blockedDaptomycin, "monograph-opat").status, "not_ready");

  const nitrofurantoin = monographById("nitrofurantoin");
  const blockedNitro = getMonographTransitionReadiness(nitrofurantoin, {
    oralRoute: "none",
  });
  assert.equal(itemById(blockedNitro, "monograph-iv-to-po").status, "not_ready");
});
