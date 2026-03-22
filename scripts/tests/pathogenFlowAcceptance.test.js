const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const validationRoot = path.resolve(__dirname, "../../.tmp/validation/src");
const { DISEASE_STATES } = require(path.join(validationRoot, "data/index.js"));
const { buildCatalogDerived } = require(path.join(validationRoot, "data/derived.js"));
const { PATHOGEN_REFERENCE_BY_ID } = require(path.join(validationRoot, "data/pathogen-references.js"));
const { buildSusceptibilityWorkspaceResult } = require(path.join(validationRoot, "utils/susceptibilityWorkspace.js"));

const derived = buildCatalogDerived(DISEASE_STATES);

test("MRSA lung workflow links phenotype guidance to executable monograph data", () => {
  const pathogen = PATHOGEN_REFERENCE_BY_ID.mrsa;
  assert.ok(pathogen, "Expected MRSA pathogen reference");
  assert.ok(
    pathogen.rapidDiagnosticInterpretation.some((entry) => /rapid/i.test(entry.title)),
    "Expected explicit rapid-diagnostic interpretation on the pathogen page",
  );

  const workspace = buildSusceptibilityWorkspaceResult(pathogen, {
    pathogenId: "mrsa",
    site: "lung",
    interpretation: "susceptible",
    rapidDiagnostic: "mrsa",
  });

  assert.ok(
    workspace.matchedTherapy.some((entry) => /Vancomycin|Linezolid/i.test(entry.preferred)),
    "Expected lung-specific therapy guidance from the susceptibility workspace",
  );

  const linezolid = derived.findMonograph("linezolid")?.monograph;
  assert.ok(linezolid, "Expected linezolid monograph");
  assert.ok(
    linezolid.monitoringActions?.some((entry) => /platelets|CBC|marrow/i.test(`${entry.trigger} ${entry.action}`)),
    "Expected executable monitoring guidance on the linked monograph",
  );
  assert.ok(
    linezolid.misuseTraps?.some((entry) => /bloodstream|endocarditis/i.test(`${entry.scenario} ${entry.risk}`)),
    "Expected misuse-trap guidance on the linked monograph",
  );
});
