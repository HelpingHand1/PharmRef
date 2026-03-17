const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const validationRoot = path.resolve(__dirname, "../../.tmp/validation/src");
const { DISEASE_STATES } = require(path.join(validationRoot, "data/index.js"));
const { buildCatalogDerived } = require(path.join(validationRoot, "data/derived.js"));
const { searchCatalog } = require(path.join(validationRoot, "utils/searchCatalog.js"));
const { buildDrugSearchPreview } = require(path.join(validationRoot, "data/search-presenters.js"));
const { PRIORITY_EXECUTION_MONOGRAPH_IDS } = require(path.join(validationRoot, "data/stewardship.js"));

const derived = buildCatalogDerived(DISEASE_STATES);

test("priority execution monographs expose the structured execution blocks", () => {
  for (const monographId of PRIORITY_EXECUTION_MONOGRAPH_IDS) {
    const record = derived.findMonograph(monographId);
    assert.ok(record, `Expected monograph ${monographId}`);
    const monograph = record.monograph;

    assert.ok(monograph.dosingByIndication?.length, `${monographId} is missing dosingByIndication`);
    assert.ok(monograph.renalReplacement?.length, `${monographId} is missing renalReplacement`);
    assert.ok(monograph.specialPopulations?.length, `${monographId} is missing specialPopulations`);
    assert.ok(monograph.therapeuticDrugMonitoring, `${monographId} is missing therapeuticDrugMonitoring`);
    assert.ok(monograph.administration, `${monographId} is missing administration`);
    assert.ok(monograph.ivToPoSwitch, `${monographId} is missing ivToPoSwitch`);
    assert.ok(monograph.opatEligibility, `${monographId} is missing opatEligibility`);
    assert.ok(monograph.interactionActions?.length, `${monographId} is missing interactionActions`);
    assert.ok(monograph.stewardshipUseCases?.length, `${monographId} is missing stewardshipUseCases`);
  }
});

test("execution-layer search finds IV-to-PO, OPAT, and interaction guidance for priority agents", () => {
  const ceftriaxoneResults = searchCatalog("ceftriaxone once daily OPAT", derived.searchIndex);
  assert.ok(ceftriaxoneResults, "Expected ceftriaxone OPAT search results");
  const ceftriaxone = ceftriaxoneResults.drugs.find((entry) => entry.id === "ceftriaxone");
  assert.ok(ceftriaxone, "Expected ceftriaxone drug result");
  const ceftriaxonePreview = buildDrugSearchPreview(ceftriaxone, "ceftriaxone once daily OPAT");
  assert.match(`${ceftriaxonePreview.primary} ${ceftriaxonePreview.secondary ?? ""}`, /OPAT|once-daily|bridge/i);

  const voriconazoleResults = searchCatalog("voriconazole tacrolimus trough", derived.searchIndex);
  assert.ok(voriconazoleResults, "Expected voriconazole interaction/TDM search results");
  const voriconazole = voriconazoleResults.drugs.find((entry) => entry.id === "voriconazole");
  assert.ok(voriconazole, "Expected voriconazole drug result");
  const voriconazolePreview = buildDrugSearchPreview(voriconazole, "voriconazole tacrolimus trough");
  assert.match(`${voriconazolePreview.primary} ${voriconazolePreview.secondary ?? ""}`, /tacrolimus|trough|CYP|monitor/i);

  const nitrofurantoinResults = searchCatalog("nitrofurantoin no IV formulation cystitis", derived.searchIndex);
  assert.ok(nitrofurantoinResults, "Expected nitrofurantoin oral-first search results");
  const nitrofurantoin = nitrofurantoinResults.drugs.find((entry) => entry.id === "nitrofurantoin");
  assert.ok(nitrofurantoin, "Expected nitrofurantoin drug result");
  const nitrofurantoinPreview = buildDrugSearchPreview(nitrofurantoin, "nitrofurantoin no IV formulation cystitis");
  assert.match(`${nitrofurantoinPreview.primary} ${nitrofurantoinPreview.secondary ?? ""}`, /PO-only|cystitis|oral-first|bladder/i);

  const ertapenemResults = searchCatalog("ertapenem once daily ESBL OPAT", derived.searchIndex);
  assert.ok(ertapenemResults, "Expected ertapenem OPAT search results");
  const ertapenem = ertapenemResults.drugs.find((entry) => entry.id === "ertapenem");
  assert.ok(ertapenem, "Expected ertapenem drug result");
  const ertapenemPreview = buildDrugSearchPreview(ertapenem, "ertapenem once daily ESBL OPAT");
  assert.match(`${ertapenemPreview.primary} ${ertapenemPreview.secondary ?? ""}`, /once-daily|OPAT|ESBL|carbapenem/i);

  const micafunginResults = searchCatalog("micafungin candidemia step-down fluconazole", derived.searchIndex);
  assert.ok(micafunginResults, "Expected micafungin site-fit search results");
  const micafungin = micafunginResults.drugs.find((entry) => entry.id === "micafungin");
  assert.ok(micafungin, "Expected micafungin drug result");
  const micafunginPreview = buildDrugSearchPreview(micafungin, "micafungin candidemia step-down fluconazole");
  assert.match(`${micafunginPreview.primary} ${micafunginPreview.secondary ?? ""}`, /fluconazole|step-down|candidemia|echinocandin/i);

  const ceftazidimeAvibactamResults = searchCatalog("ceftazidime-avibactam aztreonam NDM", derived.searchIndex);
  assert.ok(ceftazidimeAvibactamResults, "Expected ceftazidime-avibactam mechanism search results");
  const ceftazidimeAvibactam = ceftazidimeAvibactamResults.drugs.find((entry) => entry.id === "ceftazidime-avibactam");
  assert.ok(ceftazidimeAvibactam, "Expected ceftazidime-avibactam drug result");
  const ceftazidimeAvibactamPreview = buildDrugSearchPreview(ceftazidimeAvibactam, "ceftazidime-avibactam aztreonam NDM");
  assert.match(`${ceftazidimeAvibactamPreview.primary} ${ceftazidimeAvibactamPreview.secondary ?? ""}`, /aztreonam|NDM|MBL|CRE/i);

  const fidaxomicinResults = searchCatalog("fidaxomicin recurrence microbiome CDI", derived.searchIndex);
  assert.ok(fidaxomicinResults, "Expected fidaxomicin CDI search results");
  const fidaxomicin = fidaxomicinResults.drugs.find((entry) => entry.id === "fidaxomicin");
  assert.ok(fidaxomicin, "Expected fidaxomicin drug result");
  const fidaxomicinPreview = buildDrugSearchPreview(fidaxomicin, "fidaxomicin recurrence microbiome CDI");
  assert.match(`${fidaxomicinPreview.primary} ${fidaxomicinPreview.secondary ?? ""}`, /recurrence|microbiome|CDI|colon/i);

  const amoxicillinResults = searchCatalog("amoxicillin narrow CAP step-down pneumococcal", derived.searchIndex);
  assert.ok(amoxicillinResults, "Expected amoxicillin CAP search results");
  const amoxicillin = amoxicillinResults.drugs.find((entry) => entry.id === "amoxicillin");
  assert.ok(amoxicillin, "Expected amoxicillin drug result");
  const amoxicillinPreview = buildDrugSearchPreview(amoxicillin, "amoxicillin narrow CAP step-down pneumococcal");
  assert.match(`${amoxicillinPreview.primary} ${amoxicillinPreview.secondary ?? ""}`, /CAP|pneumococ|narrow|step-down/i);
});
