const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const validationRoot = path.resolve(__dirname, "../../.tmp/validation/src");
const { DISEASE_STATES } = require(path.join(validationRoot, "data/index.js"));
const { buildContentAuditSummary } = require(path.join(validationRoot, "data/content-validation.js"));

test("content audit summary reports complete priority decision-support coverage", () => {
  const summary = buildContentAuditSummary(DISEASE_STATES);

  assert.equal(summary.totalPriorityItems, 16, "Expected 8 priority pathways and 8 priority monographs");
  assert.ok(summary.pathwayCoverage.every((metric) => metric.completed === metric.total), "Expected all priority pathway metrics to be complete");
  assert.ok(summary.monographCoverage.every((metric) => metric.completed === metric.total), "Expected all priority monograph metrics to be complete");
});

test("content audit summary keeps disagreement watchlists for priority pathways", () => {
  const summary = buildContentAuditSummary(DISEASE_STATES);

  assert.ok(
    summary.disagreementPriorityContent.some((item) => item.scope === "Pathway amr-gn/cre-mbl"),
    "Expected CRE MBL pathway to appear in the disagreement watchlist",
  );
});
