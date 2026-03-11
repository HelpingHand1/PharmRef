const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const { DISEASE_STATES } = require(path.resolve(__dirname, "../../.tmp/validation/src/data/index.js"));
const { buildCatalogDerived } = require(path.resolve(__dirname, "../../.tmp/validation/src/data/derived.js"));

test("empiric options expose stable ids and valid monograph links", () => {
  const derived = buildCatalogDerived(DISEASE_STATES);
  const optionIds = new Set();

  for (const disease of DISEASE_STATES) {
    for (const subcategory of disease.subcategories) {
      for (const tier of subcategory.empiricTherapy || []) {
        for (const option of tier.options) {
          assert.match(option.id ?? "", /\S/, `${disease.id}/${subcategory.id} is missing an empiric option id`);
          assert.equal(optionIds.has(option.id), false, `duplicate empiric option id ${option.id}`);
          optionIds.add(option.id);

          if (option.monographId) {
            assert.ok(
              derived.findMonograph(option.monographId),
              `${disease.id}/${subcategory.id} references unknown monographId ${option.monographId}`,
            );
          }
          if (option.evidenceSource) {
            assert.ok(
              Array.isArray(option.evidenceSourceIds) && option.evidenceSourceIds.length > 0,
              `${disease.id}/${subcategory.id} is missing structured evidenceSourceIds for ${option.id}`,
            );
          }
        }
      }
    }
  }
});
