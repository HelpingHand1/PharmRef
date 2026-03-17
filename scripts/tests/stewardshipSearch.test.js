const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const validationRoot = path.resolve(__dirname, "../../.tmp/validation/src");
const { DISEASE_STATES } = require(path.join(validationRoot, "data/index.js"));
const { buildCatalogDerived } = require(path.join(validationRoot, "data/derived.js"));
const { searchCatalog } = require(path.join(validationRoot, "utils/searchCatalog.js"));

const derived = buildCatalogDerived(DISEASE_STATES);

test("search finds workflow-driven MRSA nares de-escalation guidance", () => {
  const results = searchCatalog("MRSA nares de-escalation", derived.searchIndex);
  assert.ok(results, "Expected search results for MRSA nares de-escalation");
  assert.ok(
    results.subcategories.some((subcategory) => subcategory.parentDisease.id === "hap-vap" && subcategory.id === "hap-mdr-risk"),
    "Expected HAP/VAP MDR-risk pathway to match MRSA nares de-escalation query",
  );
});

test("search finds structured renal replacement guidance for meropenem", () => {
  const results = searchCatalog("CRRT meropenem", derived.searchIndex);
  assert.ok(results, "Expected search results for CRRT meropenem");
  assert.ok(
    results.drugs.some((drug) => drug.id === "meropenem"),
    "Expected meropenem monograph to match CRRT query",
  );
});

test("search finds ARC guidance for cefepime", () => {
  const results = searchCatalog("cefepime ARC", derived.searchIndex);
  assert.ok(results, "Expected search results for cefepime ARC");
  assert.ok(
    results.drugs.some((drug) => drug.id === "cefepime"),
    "Expected cefepime monograph to match ARC query",
  );
});

test("search still finds legacy oral step-down osteomyelitis content", () => {
  const results = searchCatalog("oral step-down osteomyelitis", derived.searchIndex);
  assert.ok(results, "Expected search results for oral step-down osteomyelitis");
  assert.ok(
    results.subcategories.some((subcategory) => subcategory.parentDisease.id === "bone-joint"),
    "Expected bone/joint content to remain searchable",
  );
});

test("search tokenizes resistant phenotype comparisons like KPC vs NDM", () => {
  const results = searchCatalog("KPC vs NDM", derived.searchIndex);
  assert.ok(results, "Expected search results for KPC vs NDM");
  assert.ok(
    results.subcategories.some(
      (subcategory) =>
        (subcategory.parentDisease.id === "advanced-agents" && subcategory.id === "cre-management") ||
        (subcategory.parentDisease.id === "amr-gn" && ["cre-kpc", "cre-mbl"].includes(subcategory.id)),
    ),
    "Expected CRE content to match KPC vs NDM search",
  );
});

test("search finds breakpoint-removal guidance for Stenotrophomonas", () => {
  const results = searchCatalog("Stenotrophomonas ceftazidime breakpoint", derived.searchIndex);
  assert.ok(results, "Expected search results for Stenotrophomonas breakpoint query");
  assert.ok(
    results.subcategories.some((subcategory) => subcategory.parentDisease.id === "amr-gn" && subcategory.id === "crab-steno"),
    "Expected CRAB/Stenotrophomonas pathway to match breakpoint-removal query",
  );
});

test("search finds cefiderocol mortality-signal guidance in CRAB", () => {
  const results = searchCatalog("cefiderocol CRAB mortality", derived.searchIndex);
  assert.ok(results, "Expected search results for cefiderocol CRAB mortality query");
  assert.ok(
    results.drugs.some((drug) => drug.id === "cefiderocol"),
    "Expected cefiderocol monograph to match CRAB mortality query",
  );
});

test("search finds OXA-48 avibactam coverage guidance", () => {
  const results = searchCatalog("OXA-48 avibactam", derived.searchIndex);
  assert.ok(results, "Expected search results for OXA-48 avibactam query");
  assert.ok(
    results.drugs.some((drug) => drug.id === "ceftazidime-avibactam"),
    "Expected ceftazidime-avibactam monograph to match OXA-48 avibactam query",
  );
});

test("search indexes local antibiogram overlays for reserve agents", () => {
  const results = searchCatalog("retained susceptibility ceftolozane pseudomonas", derived.searchIndex);
  assert.ok(results, "Expected search results for local antibiogram query");
  assert.ok(
    results.subcategories.some((subcategory) => subcategory.parentDisease.id === "advanced-agents" && subcategory.id === "mdr-pseudomonas") ||
      results.drugs.some((drug) => drug.id === "ceftolozane-tazobactam"),
    "Expected local antibiogram overlay to make MDR Pseudomonas or ceftolozane-tazobactam searchable",
  );
});

test("search finds severe CAP rapid-diagnostic stewardship guidance", () => {
  const results = searchCatalog("Legionella urinary antigen severe CAP", derived.searchIndex);
  assert.ok(results, "Expected search results for severe CAP rapid diagnostics");
  assert.ok(
    results.subcategories.some((subcategory) => subcategory.parentDisease.id === "cap" && subcategory.id === "cap-icu"),
    "Expected CAP ICU pathway to match Legionella rapid-diagnostic query",
  );
});

test("search finds syndrome-level microbiology warnings in hospital IAI", () => {
  const results = searchCatalog("Enterococcus cephalosporins intra abdominal", derived.searchIndex);
  assert.ok(results, "Expected search results for hospital IAI microbiology query");
  assert.ok(
    results.subcategories.some((subcategory) => subcategory.parentDisease.id === "iai" && subcategory.id === "ha-iai"),
    "Expected hospital-acquired IAI pathway to match Enterococcus cephalosporin query",
  );
});
