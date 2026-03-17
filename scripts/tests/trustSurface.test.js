const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const validationRoot = path.resolve(__dirname, "../../.tmp/validation/src");
const { DISEASE_STATES } = require(path.join(validationRoot, "data/index.js"));
const { getMonographContentKey, getSubcategoryContentKey, resolveContentMeta } = require(path.join(validationRoot, "data/metadata.js"));
const { buildTrustSurfaceSummary } = require(path.join(validationRoot, "data/trust-surface.js"));

function findDisease(diseaseId) {
  return DISEASE_STATES.find((disease) => disease.id === diseaseId) ?? null;
}

test("trust surface summary prioritizes disagreements and recent updates for representative pages", () => {
  const amrGn = findDisease("amr-gn");
  const creMbl = amrGn?.subcategories.find((subcategory) => subcategory.id === "cre-mbl");
  assert.ok(amrGn && creMbl, "Expected amr-gn/cre-mbl content");

  const creMblMeta = resolveContentMeta(creMbl, amrGn, {
    contentKey: getSubcategoryContentKey("amr-gn", "cre-mbl"),
  }).meta;
  const creMblSummary = buildTrustSurfaceSummary(creMblMeta);

  assert.ok(creMblSummary, "Expected trust summary for cre-mbl");
  assert.match(creMblSummary.headline, /disagreement|recent editorial changes|moderate-confidence/i);
  assert.ok(
    creMblSummary.highlights.some((highlight) => /Preferred first-line option/i.test(highlight.title)),
    "Expected guideline disagreement highlight for cre-mbl",
  );
  assert.ok(
    creMblSummary.highlights.some((highlight) => /Recent update/i.test(highlight.title)),
    "Expected recent update highlight for cre-mbl",
  );
});

test("trust surface summary captures monograph disagreement highlights", () => {
  const amrGn = findDisease("amr-gn");
  const cefiderocol = amrGn?.drugMonographs.find((monograph) => monograph.id === "cefiderocol");
  assert.ok(amrGn && cefiderocol, "Expected cefiderocol monograph");

  const cefiderocolMeta = resolveContentMeta(cefiderocol, amrGn, {
    contentKey: getMonographContentKey("amr-gn", "cefiderocol"),
  }).meta;
  const cefiderocolSummary = buildTrustSurfaceSummary(cefiderocolMeta);

  assert.ok(cefiderocolSummary, "Expected trust summary for cefiderocol");
  assert.ok(
    cefiderocolSummary.highlights.some((highlight) => /CRAB|cefiderocol/i.test(highlight.title) || /CRAB/i.test(highlight.detail)),
    "Expected cefiderocol trust summary to carry CRAB disagreement or update context",
  );
});

test("trust surface summary emits a stale-content headline when review is out of date", () => {
  const staleMeta = {
    lastReviewed: "2024-01-01",
    reviewedBy: "Editorial Team",
    reviewScope: "Synthetic stale test",
    confidence: "moderate",
    sources: [],
    reviewHistory: [
      {
        reviewedOn: "2024-01-01",
        reviewedBy: "Editorial Team",
        summary: "Legacy review before retesting stale banner behavior.",
      },
    ],
    governance: {
      owner: "Synthetic Test",
      approvedBodyVersion: "deadbeef",
    },
  };

  const summary = buildTrustSurfaceSummary(staleMeta);
  assert.ok(summary, "Expected stale trust summary");
  assert.match(summary.headline, /past its freshness threshold/i);
  assert.ok(
    summary.highlights.some((highlight) => /Stale content/i.test(highlight.title)),
    "Expected stale highlight entry",
  );
});
