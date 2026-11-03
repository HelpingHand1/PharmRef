const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const validationRoot = path.resolve(__dirname, "../../.tmp/validation/src");
const { DISEASE_STATES } = require(path.join(validationRoot, "data/index.js"));
const { buildCatalogDerived } = require(path.join(validationRoot, "data/derived.js"));
const { countSearchResults, searchCatalog, suggestSearchQuery } = require(path.join(validationRoot, "utils/searchCatalog.js"));

const { searchIndex } = buildCatalogDerived(DISEASE_STATES);

test("misspelled drug, brand, and organism searches suggest the catalog spelling", () => {
  const cases = {
    zosin: "zosyn",
    cefipime: "cefepime",
    vancomicin: "vancomycin",
    meropenam: "meropenem",
    psuedomonas: "pseudomonas",
    stenotrophamonas: "stenotrophomonas",
    "sepsis shok": "sepsis shock",
  };
  for (const [typo, expected] of Object.entries(cases)) {
    assert.equal(countSearchResults(searchCatalog(typo, searchIndex)), 0, `${typo} should miss before correction`);
    assert.equal(suggestSearchQuery(typo, searchIndex), expected);
  }
});

test("suggestions are skipped for correct spellings, short queries, and nonsense", () => {
  assert.equal(suggestSearchQuery("cefepime", searchIndex), null);
  assert.equal(suggestSearchQuery("cef", searchIndex), null);
  assert.equal(suggestSearchQuery("qqqqzzzz", searchIndex), null);
  assert.equal(suggestSearchQuery("zosin", null), null);
});
