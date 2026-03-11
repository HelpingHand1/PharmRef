const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const { DISEASE_STATES } = require(path.resolve(__dirname, "../../.tmp/validation/src/data/index.js"));
const { buildCatalogDerived } = require(path.resolve(__dirname, "../../.tmp/validation/src/data/derived.js"));
const {
  PRIORITY_MONOGRAPH_META_KEYS,
  PRIORITY_SUBCATEGORY_META_KEYS,
  resolveContentMeta,
} = require(path.resolve(__dirname, "../../.tmp/validation/src/data/metadata.js"));
const {
  resolveEvidenceSourceText,
  resolveSourceEntry,
} = require(path.resolve(__dirname, "../../.tmp/validation/src/data/source-registry.js"));
const {
  resolveOverviewEntrySources,
} = require(path.resolve(__dirname, "../../.tmp/validation/src/data/overview-evidence.js"));

test("catalog derived counts stay stable", () => {
  const derived = buildCatalogDerived(DISEASE_STATES);
  assert.equal(DISEASE_STATES.length, 15);
  assert.equal(derived.totalSubcategories, 61);
  assert.equal(derived.allMonographs.length, 43);
  assert.equal(derived.allRegimens.length, 376);
  assert.equal(derived.searchIndex.length, 674);
  assert.equal(derived.findMonograph("vancomycin")?.monograph.name, "Vancomycin");
  assert.ok((derived.regimenXref.vancomycin?.length ?? 0) > 0);
});

test("all attached metadata includes review attribution and canonical source ids", () => {
  function assertReviewHistory(meta, scope) {
    assert.ok(Array.isArray(meta.reviewHistory) && meta.reviewHistory.length > 0, `${scope} is missing review history`);
    assert.equal(meta.reviewHistory[0].reviewedOn, meta.lastReviewed, `${scope} latest review does not match lastReviewed`);
    assert.equal(meta.reviewHistory[0].reviewedBy, meta.reviewedBy, `${scope} latest review does not match reviewedBy`);
    meta.reviewHistory.forEach((entry, index) => {
      assert.match(entry.reviewedOn, /\d{4}-\d{2}-\d{2}/, `${scope} review ${index + 1} has invalid reviewedOn`);
      assert.match(entry.reviewedBy, /\S/, `${scope} review ${index + 1} is missing reviewedBy`);
      assert.match(entry.summary, /\S/, `${scope} review ${index + 1} is missing summary`);
    });
  }

  for (const disease of DISEASE_STATES) {
    assert.ok(disease.contentMeta);
    assert.match(disease.contentMeta.reviewedBy, /\S/);
    assert.match(disease.contentMeta.reviewScope, /\S/);
    assertReviewHistory(disease.contentMeta, disease.id);
    disease.contentMeta.sources.forEach((source) => {
      assert.ok(resolveSourceEntry(source.id), `${disease.id} references unknown source ${source.id}`);
      assert.match(source.citation, /\S/);
    });

    for (const subcategory of disease.subcategories) {
      const resolved = resolveContentMeta(subcategory, disease);
      assert.ok(resolved.meta, `${disease.id}/${subcategory.id} is missing metadata`);
      assert.match(resolved.meta.reviewedBy, /\S/);
      assert.match(resolved.meta.reviewScope, /\S/);
      assertReviewHistory(resolved.meta, `${disease.id}/${subcategory.id}`);
      resolved.meta.sources.forEach((source) => {
        assert.ok(resolveSourceEntry(source.id), `${disease.id}/${subcategory.id} references unknown source ${source.id}`);
      });
    }

    for (const monograph of disease.drugMonographs) {
      const resolved = resolveContentMeta(monograph, disease);
      assert.ok(resolved.meta, `${disease.id}/${monograph.id} is missing metadata`);
      assert.match(resolved.meta.reviewedBy, /\S/);
      assert.match(resolved.meta.reviewScope, /\S/);
      assertReviewHistory(resolved.meta, monograph.id);
      resolved.meta.sources.forEach((source) => {
        assert.ok(resolveSourceEntry(source.id), `${monograph.id} references unknown source ${source.id}`);
      });
    }
  }
});

test("priority pathways and monographs never fall back to inherited metadata", () => {
  const inheritedPrioritySubcategories = [];
  const inheritedPriorityMonographs = [];

  for (const disease of DISEASE_STATES) {
    for (const subcategory of disease.subcategories) {
      const key = `${disease.id}/${subcategory.id}`;
      if (PRIORITY_SUBCATEGORY_META_KEYS.includes(key)) {
        const resolved = resolveContentMeta(subcategory, disease);
        if (resolved.inherited) inheritedPrioritySubcategories.push(key);
      }
    }

    for (const monograph of disease.drugMonographs) {
      if (PRIORITY_MONOGRAPH_META_KEYS.includes(monograph.id)) {
        const resolved = resolveContentMeta(monograph, disease);
        if (resolved.inherited) inheritedPriorityMonographs.push(monograph.id);
      }
    }
  }

  assert.deepEqual(inheritedPrioritySubcategories, []);
  assert.deepEqual(inheritedPriorityMonographs, []);
});

test("all empiric evidence labels resolve through the canonical source registry", () => {
  const unresolved = new Set();

  for (const disease of DISEASE_STATES) {
    for (const subcategory of disease.subcategories) {
      for (const tier of subcategory.empiricTherapy || []) {
        for (const option of tier.options) {
          if (option.evidenceSource && resolveEvidenceSourceText(option.evidenceSource).length === 0) {
            unresolved.add(option.evidenceSource);
          }
        }
      }
    }
  }

  assert.deepEqual([...unresolved], []);
});

test("overview evidence cards resolve canonical sources for representative long-form titles", () => {
  const cap = DISEASE_STATES.find((disease) => disease.id === "cap");
  const sepsis = DISEASE_STATES.find((disease) => disease.id === "sepsis");
  const boneJoint = DISEASE_STATES.find((disease) => disease.id === "bone-joint");

  assert.deepEqual(resolveOverviewEntrySources(cap.overview.keyGuidelines[0]).map((source) => source.id), ["ats-idsa-2019-cap"]);
  assert.deepEqual(resolveOverviewEntrySources(sepsis.overview.keyGuidelines[0]).map((source) => source.id), ["ssc-2021"]);
  assert.deepEqual(resolveOverviewEntrySources(boneJoint.overview.landmarkTrials[0]).map((source) => source.id), ["oviva"]);
});
