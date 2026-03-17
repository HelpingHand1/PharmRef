const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const validationRoot = path.resolve(__dirname, "../../.tmp/validation/src");
const { DISEASE_STATES } = require(path.join(validationRoot, "data/index.js"));
const { buildCatalogDerived } = require(path.join(validationRoot, "data/derived.js"));
const { searchCatalog } = require(path.join(validationRoot, "utils/searchCatalog.js"));

const derived = buildCatalogDerived(DISEASE_STATES);

function findDisease(diseaseId) {
  return DISEASE_STATES.find((disease) => disease.id === diseaseId) ?? null;
}

function findSubcategory(diseaseId, subcategoryId) {
  return findDisease(diseaseId)?.subcategories.find((subcategory) => subcategory.id === subcategoryId) ?? null;
}

function findOption(diseaseId, subcategoryId, line, drugKey) {
  const subcategory = findSubcategory(diseaseId, subcategoryId);
  const tiers = subcategory?.empiricTherapy ?? subcategory?.empiricRegimens ?? [];
  const tier = tiers.find((entry) => entry.line === line);
  return tier?.options.find((option) => option.drug === drugKey) ?? null;
}

test("representative high-priority empiric options expose structured regimen plans", () => {
  const capCeftriaxone = findOption(
    "cap",
    "cap-icu",
    "First-Line (ALWAYS Combination for Severe CAP)",
    "ceftriaxone",
  );
  const shockBackbone = findOption(
    "sepsis",
    "septic-shock",
    "Immediate Broad-Spectrum Empiric — Septic Shock (Within 1 Hour)",
    "vanco-meropenem",
  );

  assert.ok(capCeftriaxone?.plan, "Expected CAP ICU ceftriaxone backbone to have a regimen plan");
  assert.equal(capCeftriaxone.plan.role, "preferred");
  assert.ok(
    capCeftriaxone.plan.avoidIf?.some((entry) => /MRSA|Pseudomonas/i.test(entry)),
    "Expected CAP ICU ceftriaxone plan to encode escalation boundaries",
  );
  assert.ok(
    capCeftriaxone.plan.rapidDiagnosticActions?.some((entry) => /MRSA nares|Legionella/i.test(entry)),
    "Expected CAP ICU ceftriaxone plan to encode rapid-diagnostic actions",
  );

  assert.ok(shockBackbone?.plan, "Expected septic shock backbone to have a regimen plan");
  assert.equal(shockBackbone.plan.role, "preferred");
  assert.deepEqual(
    shockBackbone.plan.linkedMonographIds,
    ["vancomycin", "meropenem", "micafungin"],
    "Expected septic shock backbone to link the key monographs it references",
  );
});

test("regimen catalog cross-references combo agents through linked monograph ids", () => {
  const azithromycinRefs = derived.regimenXref.azithromycin ?? [];
  const meropenemRefs = derived.regimenXref.meropenem ?? [];

  assert.ok(
    azithromycinRefs.some(
      (regimen) =>
        regimen.diseaseId === "cap" &&
        regimen.subcategoryId === "cap-icu" &&
        regimen.line === "First-Line (ALWAYS Combination for Severe CAP)",
    ),
    "Expected azithromycin monograph to cross-reference severe CAP combination therapy",
  );
  assert.ok(
    meropenemRefs.some(
      (regimen) =>
        regimen.diseaseId === "sepsis" &&
        regimen.subcategoryId === "septic-shock" &&
        regimen.rapidDiagnosticActions?.some((entry) => /drop vancomycin|drop antifungal/i.test(entry)),
    ),
    "Expected meropenem monograph to inherit structured shock-regimen actions through regimen cross-references",
  );
});

test("search indexes regimen-plan risk triggers and rapid diagnostic actions", () => {
  const capResults = searchCatalog("MRSA AKI concern linezolid", derived.searchIndex);
  const fnResults = searchCatalog("catheter infection febrile neutropenia vancomycin", derived.searchIndex);
  const shockResults = searchCatalog("drop antifungal septic shock meropenem", derived.searchIndex);

  assert.ok(capResults, "Expected CAP regimen-plan search results");
  assert.ok(
    capResults.regimens.some(
      (regimen) =>
        regimen.diseaseId === "cap" &&
        regimen.subcategoryId === "cap-icu" &&
        regimen.regimen.toLowerCase().includes("linezolid"),
    ),
    "Expected CAP MRSA adjunct regimen to match plan-only risk language",
  );

  assert.ok(fnResults, "Expected FN regimen-plan search results");
  assert.ok(
    fnResults.regimens.some(
      (regimen) =>
        regimen.diseaseId === "febrile-neutropenia" &&
        regimen.subcategoryId === "high-risk-fn" &&
        regimen.regimen.toLowerCase().includes("vancomycin"),
    ),
    "Expected FN vancomycin add-on to match catheter-risk search language",
  );

  assert.ok(shockResults, "Expected septic shock rapid-diagnostic search results");
  assert.ok(
    shockResults.regimens.some(
      (regimen) =>
        regimen.diseaseId === "sepsis" &&
        regimen.subcategoryId === "septic-shock" &&
        regimen.regimen.toLowerCase().includes("meropenem") &&
        regimen.rapidDiagnosticActions?.some((entry) => /drop antifungal/i.test(entry)),
    ),
    "Expected septic shock backbone to match rapid-diagnostic regimen queries",
  );
});
