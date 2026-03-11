const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const { DISEASE_STATES } = require(path.resolve(__dirname, "../../.tmp/validation/src/data/index.js"));
const { buildContentValidationIssues } = require(path.resolve(__dirname, "../../.tmp/validation/src/data/content-validation.js"));

test("content validation passes without clinical-body errors or warnings", () => {
  const issues = buildContentValidationIssues(DISEASE_STATES).filter((issue) => issue.severity !== "info");
  assert.equal(
    issues.length,
    0,
    issues.map((issue) => `${issue.severity.toUpperCase()} [${issue.scope}] ${issue.message}`).join("\n"),
  );
});
