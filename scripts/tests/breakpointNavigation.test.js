const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const validationRoot = path.resolve(__dirname, "../../.tmp/validation/src");
const {
  buildPathogenBreakpointPreset,
  normalizeBreakpointSitePreset,
} = require(path.join(validationRoot, "utils/breakpointWorkspacePreset.js"));
const {
  hashToState,
  stateToHash,
} = require(path.join(validationRoot, "utils/navigationState.js"));

test("pathogen breakpoint presets derive rapid-diagnostic context and normalize site labels", () => {
  assert.equal(normalizeBreakpointSitePreset("Bloodstream or endovascular infection"), "bloodstream");
  assert.equal(normalizeBreakpointSitePreset("Pneumonia"), "lung");
  assert.equal(normalizeBreakpointSitePreset("Complicated UTI / oral step-down"), "urine");

  const preset = buildPathogenBreakpointPreset({ id: "mrsa" }, { site: "Pneumonia" });

  assert.deepEqual(preset, {
    site: "lung",
    rapidDiagnostic: "mrsa",
    interpretation: "unknown",
    mic: null,
  });
});

test("breakpoint navigation hashes preserve preset site and rapid-diagnostic context", () => {
  const hash = stateToHash(
    "breakpoints",
    null,
    null,
    null,
    "mbl-cre",
    {
      site: "bloodstream",
      rapidDiagnostic: "mbl",
      interpretation: "unknown",
      mic: "caz-avi + aztreonam susceptible by BDE",
    },
  );

  assert.equal(
    hash,
    "#/breakpoints/mbl-cre?site=bloodstream&rapid=mbl&interp=unknown&mic=caz-avi+%2B+aztreonam+susceptible+by+BDE",
  );

  assert.deepEqual(hashToState(hash), {
    nav: "breakpoints",
    diseaseId: null,
    subcategoryId: null,
    monographId: null,
    pathogenId: "mbl-cre",
    breakpointPreset: {
      site: "bloodstream",
      rapidDiagnostic: "mbl",
      interpretation: "unknown",
      mic: "caz-avi + aztreonam susceptible by BDE",
    },
  });
});
