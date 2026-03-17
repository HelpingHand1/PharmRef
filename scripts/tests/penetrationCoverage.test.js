const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const validationRoot = path.resolve(__dirname, "../../.tmp/validation/src");
const { DISEASE_STATES } = require(path.join(validationRoot, "data/index.js"));

test("every authored monograph has structured tissue penetration guidance", () => {
  const missing = DISEASE_STATES.flatMap((disease) =>
    (disease.drugMonographs ?? [])
      .filter((monograph) => !monograph.penetration?.length)
      .map((monograph) => `${disease.id}/${monograph.id}`),
  );

  assert.deepEqual(
    missing,
    [],
    `Missing structured penetration guidance for: ${missing.join(", ")}`,
  );
});
