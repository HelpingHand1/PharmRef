const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const editorial = require(path.resolve(__dirname, "../../.tmp/validation/src/data/editorial/content-meta.js"));
const generated = require(path.resolve(__dirname, "../../.tmp/validation/src/data/generated-content-meta.js"));

test("generated content metadata matches the editorial source of truth", () => {
  assert.deepEqual(generated.DISEASE_CONTENT_META, editorial.DISEASE_CONTENT_META);
  assert.deepEqual(generated.SUBCATEGORY_CONTENT_META, editorial.SUBCATEGORY_CONTENT_META);
  assert.deepEqual(generated.MONOGRAPH_CONTENT_META, editorial.MONOGRAPH_CONTENT_META);
  assert.deepEqual(generated.PRIORITY_SUBCATEGORY_META_KEYS, editorial.PRIORITY_SUBCATEGORY_META_KEYS);
  assert.deepEqual(generated.PRIORITY_MONOGRAPH_META_KEYS, editorial.PRIORITY_MONOGRAPH_META_KEYS);
});
