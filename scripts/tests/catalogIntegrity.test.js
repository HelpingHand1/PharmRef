const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const { DISEASE_STATES } = require(path.resolve(__dirname, "../../.tmp/validation/src/data/index.js"));
const { buildCatalogDerived } = require(path.resolve(__dirname, "../../.tmp/validation/src/data/derived.js"));
const {
  computeDiseaseOverviewFingerprint,
  getMonographContentKey,
  getSubcategoryContentKey,
  computeMonographFingerprint,
  computeSubcategoryFingerprint,
  PRIORITY_MONOGRAPH_META_KEYS,
  PRIORITY_SUBCATEGORY_META_KEYS,
  resolveContentMeta,
} = require(path.resolve(__dirname, "../../.tmp/validation/src/data/metadata.js"));
const {
  OVERVIEW_DISALLOWED_SOURCE_IDS,
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
  assert.equal(derived.allPathogens.length, 9);
  assert.equal(derived.allRegimens.length, 376);
  assert.equal(derived.searchIndex.length, 683);
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
    assert.match(disease.contentMeta.governance.owner, /\S/);
    assert.match(disease.contentMeta.governance.approvedBodyVersion, /^[0-9a-f]{8}$/);
    assert.equal(disease.contentMeta.governance.approvedBodyVersion, computeDiseaseOverviewFingerprint(disease));
    assertReviewHistory(disease.contentMeta, disease.id);
    disease.contentMeta.sources.forEach((source) => {
      assert.ok(resolveSourceEntry(source.id), `${disease.id} references unknown source ${source.id}`);
      assert.match(source.citation, /\S/);
    });

    for (const subcategory of disease.subcategories) {
      const resolved = resolveContentMeta(subcategory, disease, {
        contentKey: getSubcategoryContentKey(disease.id, subcategory.id),
      });
      assert.ok(resolved.meta, `${disease.id}/${subcategory.id} is missing metadata`);
      assert.match(resolved.meta.reviewedBy, /\S/);
      assert.match(resolved.meta.reviewScope, /\S/);
      assert.match(resolved.meta.governance.owner, /\S/);
      assert.match(resolved.meta.governance.approvedBodyVersion, /^[0-9a-f]{8}$/);
      assert.equal(resolved.meta.governance.approvedBodyVersion, computeSubcategoryFingerprint(subcategory));
      assertReviewHistory(resolved.meta, `${disease.id}/${subcategory.id}`);
      resolved.meta.sources.forEach((source) => {
        assert.ok(resolveSourceEntry(source.id), `${disease.id}/${subcategory.id} references unknown source ${source.id}`);
      });
    }

    for (const monograph of disease.drugMonographs) {
      const resolved = resolveContentMeta(monograph, disease, {
        contentKey: getMonographContentKey(disease.id, monograph.id),
      });
      assert.ok(resolved.meta, `${disease.id}/${monograph.id} is missing metadata`);
      assert.match(resolved.meta.reviewedBy, /\S/);
      assert.match(resolved.meta.reviewScope, /\S/);
      assert.match(resolved.meta.governance.owner, /\S/);
      assert.match(resolved.meta.governance.approvedBodyVersion, /^[0-9a-f]{8}$/);
      assert.equal(resolved.meta.governance.approvedBodyVersion, computeMonographFingerprint(monograph));
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

test("all empiric evidence labels resolve to direct-locator sources", () => {
  const unresolved = new Set();

  for (const disease of DISEASE_STATES) {
    for (const subcategory of disease.subcategories) {
      for (const tier of subcategory.empiricTherapy || []) {
        for (const option of tier.options) {
          if (!option.evidenceSource) continue;
          const sources = resolveEvidenceSourceText(option.evidenceSource);
          sources.forEach((source) => {
            if (!source.url && !source.pmid && !source.doi) {
              unresolved.add(source.id);
            }
          });
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

test("all overview evidence cards carry explicit source ids that resolve", () => {
  for (const disease of DISEASE_STATES) {
    for (const entry of [...disease.overview.keyGuidelines, ...disease.overview.landmarkTrials]) {
      assert.ok(entry.sourceIds?.length, `${disease.id} overview entry "${entry.name}" is missing sourceIds`);
      assert.ok(resolveOverviewEntrySources(entry).length > 0, `${disease.id} overview entry "${entry.name}" does not resolve`);
      entry.sourceIds.forEach((sourceId) => {
        assert.ok(
          !OVERVIEW_DISALLOWED_SOURCE_IDS.has(sourceId),
          `${disease.id} overview entry "${entry.name}" uses disallowed aggregate source ${sourceId}`,
        );
      });
    }
  }
});

test("curated overview sources expose direct locators", () => {
  const ids = [
    "idsa-2025-cuti",
    "idsa-escmid-2011-uti",
    "aua-cua-sufu-2019-ruti",
    "idsa-2010-cauti",
    "altar-trial",
    "gupta-2007-nitrofurantoin-tmpsmx",
    "gagyor-2015-ibuprofen-fosfomycin",
    "huttner-2018-nitrofurantoin-fosfomycin",
    "ats-idsa-2019-cap",
    "nice-ng138-pneumonia",
    "cap-start",
    "epic-cap-study",
    "meijvis-2011-dexamethasone-cap",
    "el-moussaoui-2006-short-course-cap",
    "garin-2014-cap",
    "ers-esicm-escmid-alat-2017-hap-vap",
    "shea-idsa-apic-2022-vap-prevention",
    "leone-2014-deescalation",
    "ptc-bouadma-2010",
    "stop-it",
    "chastre-2003-vap",
    "proseva",
    "inhale-trial",
    "merino-2",
    "acorn",
    "idsa-2011-mrsa",
    "talan-2016-abscess",
    "miller-2015-ssti",
    "daum-2017-ssti",
    "discover-1-2-dalbavancin",
    "eron-2003-ssti",
    "lrinec-wong-2004",
    "idsa-sis-2010-ciai",
    "sis-2017-ciai",
    "tokyo-guidelines",
    "idsa-shea-2021-cdi",
    "acg-2021-cdi",
    "idsa-shea-2017-cdi",
    "aga-2024-fmt",
    "extend-trial",
    "modify-trials",
    "punch-cd3",
    "ecospor-iii",
    "sirbu-2017-vanco-taper",
    "ciaow-study",
    "montravers-2016-deescalation",
    "durapop",
    "solomkin-2003-ertapenem-piptazo",
    "aha-2015-ie",
    "esc-2023-ie",
    "sepsis-3",
    "camera2",
    "fowler-2003-complicated-sab",
    "sullenberger-2005-tee-sab",
    "holland-2014-sab-review",
    "kang-2012-early-surgery",
    "datipo",
    "zimmerli-1998-rifampin-pji",
    "icm-2018-pji",
    "aahks-2023-chronic-pji-practice-patterns",
    "orthopedic-id-review",
    "idsa-2004-bacterial-meningitis",
    "idsa-2017-ventriculitis-meningitis",
    "escmid-2016-bacterial-meningitis",
    "escmid-2017-brain-abscess-update",
    "dexamethasone-meningitis",
    "van-de-beek-2006-meningitis",
    "brouwer-2015-dexamethasone",
    "escmid-2012-candida",
    "reboli-2007-anidulafungin",
    "herbrecht-2002-voriconazole",
    "secure-trial",
    "marr-2015-voriconazole-anidulafungin",
    "escmid-ecmm-ers-2017-aspergillosis",
    "idsa-2022-amr",
    "clsi-breakpoint-updates",
    "cdc-amr-threats-2019",
    "credible-cr",
    "aspect-cuti-ciai",
    "restore-imi-1",
    "falcone-2021-caz-avi-aztreonam",
    "establish",
    "hartford-nomogram",
    "iwgdf-2023-wound-classification",
    "wagner-1981",
    "ut-wound-classification",
    "lipsky-2005-ertapenem-dfi",
    "ha-van-2003-postop-osteomyelitis",
    "lavery-probe-to-bone",
    "lazaro-martinez-2014-dfi-osteomyelitis",
    "nccn-fever-neutropenia",
    "mascc-risk-index",
    "cisne-score",
    "asco-2015-gcsf",
    "cordonnier-2009-empirical-vs-preemptive",
    "walsh-1999-lamb-vs-amb",
    "walsh-2004-caspofungin",
    "winston-2000-empiric-antifungal",
    "freifeld-1999-low-risk-fn",
    "kern-1999-low-risk-fn",
    "cornely-2007-posaconazole",
    "wingard-2010-voriconazole",
  ];

  ids.forEach((sourceId) => {
    const source = resolveSourceEntry(sourceId);
    assert.ok(source, `${sourceId} is missing from the source registry`);
    assert.ok(source.url || source.pmid || source.doi, `${sourceId} is missing a direct locator`);
  });

  [
    "aha-acc-2023-ie",
    "idsa-2024-sepsis",
    "nice-2023-pneumonia",
    "postma-2015-dexamethasone-cap",
    "step-trial",
    "aga-2022-fmt",
    "pivmecillinam-vs-tmp-smx",
    "hooton-2012-cystitis",
    "combine-trial",
    "moran-2017-ssti",
    "solo-dalbavancin",
    "sis-idsa-iai",
    "idsa-sab-bundle-recommendations",
    "johnson-2014-vanco-taper",
    "solomkin-2010-ertapenem-piptazo",
    "montravers-2009-deescalation",
    "fowler-2003-tee-sab",
    "holland-2014-sab-duration",
    "escmid-2022-candida",
    "escmid-ecmm-ers-2022-aspergillosis",
    "attain-1-2",
    "acr-aahks-2023-pji",
    "aan-idsa-2008-brain-abscess",
    "idat-trial",
    "vaporize",
    "asco-2024-gcsf",
    "bow-1998-empiric-antifungal",
    "empiricus",
  ].forEach((sourceId) => {
    assert.equal(resolveSourceEntry(sourceId), null, `${sourceId} should not remain in the canonical source registry`);
  });
});

test("CAP overview trial source locators stay pinned to the correct records", () => {
  assert.deepEqual(
    {
      pmid: resolveSourceEntry("cap-start")?.pmid,
      doi: resolveSourceEntry("cap-start")?.doi,
    },
    {
      pmid: "25830421",
      doi: "10.1056/NEJMoa1406330",
    },
  );

  assert.deepEqual(
    {
      pmid: resolveSourceEntry("epic-cap-study")?.pmid,
      doi: resolveSourceEntry("epic-cap-study")?.doi,
    },
    {
      pmid: "26437713",
      doi: "10.1056/NEJMoa1500245",
    },
  );

  assert.deepEqual(
    {
      pmid: resolveSourceEntry("el-moussaoui-2006-short-course-cap")?.pmid,
      doi: resolveSourceEntry("el-moussaoui-2006-short-course-cap")?.doi,
    },
    {
      pmid: "17183630",
      doi: "10.1136/bmj.332.7554.1355",
    },
  );
});
