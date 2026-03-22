const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const validationRoot = path.resolve(__dirname, "../../.tmp/validation/src");
const { PATHOGEN_REFERENCE_BY_ID } = require(path.join(validationRoot, "data/pathogen-references.js"));
const { buildSusceptibilityWorkspaceResult } = require(path.join(validationRoot, "utils/susceptibilityWorkspace.js"));

test("workspace rejects daptomycin false reassurance for MRSA pneumonia", () => {
  const pathogen = PATHOGEN_REFERENCE_BY_ID.mrsa;
  assert.ok(pathogen, "Expected MRSA pathogen reference");

  const result = buildSusceptibilityWorkspaceResult(pathogen, {
    pathogenId: "mrsa",
    site: "lung",
    interpretation: "susceptible",
    rapidDiagnostic: "mrsa",
  });

  assert.ok(
    result.findings.some(
      (finding) =>
        finding.outcome === "avoid" &&
        /daptomycin/i.test(`${finding.title} ${finding.detail}`),
    ),
    "Expected an avoid finding warning against daptomycin for MRSA pneumonia",
  );
});

test("workspace rejects ceftazidime-avibactam monotherapy for MBL phenotype", () => {
  const pathogen = PATHOGEN_REFERENCE_BY_ID["mbl-cre"];
  assert.ok(pathogen, "Expected MBL pathogen reference");

  const result = buildSusceptibilityWorkspaceResult(pathogen, {
    pathogenId: "mbl-cre",
    site: "bloodstream",
    interpretation: "susceptible",
    rapidDiagnostic: "mbl",
  });

  assert.ok(
    result.findings.some(
      (finding) =>
        finding.outcome === "avoid" &&
        /ceftazidime-avibactam|monotherapy/i.test(`${finding.title} ${finding.detail}`),
    ),
    "Expected an avoid finding warning against ceftazidime-avibactam monotherapy for MBL",
  );
});

test("workspace adds dialysis execution caution for KPC reserve therapy", () => {
  const pathogen = PATHOGEN_REFERENCE_BY_ID["kpc-cre"];
  assert.ok(pathogen, "Expected KPC pathogen reference");

  const result = buildSusceptibilityWorkspaceResult(pathogen, {
    pathogenId: "kpc-cre",
    site: "bloodstream",
    interpretation: "susceptible",
    rapidDiagnostic: "kpc",
    dialysis: "HD",
  });

  assert.ok(
    result.findings.some(
      (finding) =>
        finding.outcome === "caution" &&
        /dialysis|HD/i.test(`${finding.title} ${finding.detail}`),
    ),
    "Expected a dialysis-specific execution caution for KPC reserve therapy",
  );
});

test("workspace adds renal execution caution for low-CrCl MBL therapy", () => {
  const pathogen = PATHOGEN_REFERENCE_BY_ID["mbl-cre"];
  assert.ok(pathogen, "Expected MBL pathogen reference");

  const result = buildSusceptibilityWorkspaceResult(pathogen, {
    pathogenId: "mbl-cre",
    site: "bloodstream",
    interpretation: "susceptible",
    rapidDiagnostic: "mbl",
    crcl: 20,
  });

  assert.ok(
    result.findings.some(
      (finding) =>
        finding.outcome === "avoid" &&
        /ceftazidime-avibactam|monotherapy/i.test(`${finding.title} ${finding.detail}`),
    ),
    "Expected the mechanism-based avoid finding to remain present",
  );
  assert.ok(
    result.findings.some(
      (finding) =>
        finding.outcome === "caution" &&
        /CrCl 20|renal adjustment|execution plan/i.test(`${finding.title} ${finding.detail}`),
    ),
    "Expected a renal execution caution for low-CrCl MBL therapy",
  );
});

test("workspace keeps unknown susceptibility in caution territory until AST finalizes", () => {
  const pathogen = PATHOGEN_REFERENCE_BY_ID["candida-species"];
  assert.ok(pathogen, "Expected Candida pathogen reference");

  const result = buildSusceptibilityWorkspaceResult(pathogen, {
    pathogenId: "candida-species",
    site: "bloodstream",
    interpretation: "unknown",
    rapidDiagnostic: "candida",
  });

  assert.ok(
    result.findings.some(
      (finding) =>
        finding.outcome === "caution" &&
        /AST is still incomplete|AST still pending/i.test(`${finding.title} ${finding.detail}`),
    ),
    "Expected a caution finding while AST is still pending",
  );
});

test("workspace normalizes a vancomycin MIC note and escalates MRSA bloodstream concern", () => {
  const pathogen = PATHOGEN_REFERENCE_BY_ID.mrsa;
  assert.ok(pathogen, "Expected MRSA pathogen reference");

  const result = buildSusceptibilityWorkspaceResult(pathogen, {
    pathogenId: "mrsa",
    site: "bloodstream",
    interpretation: "susceptible",
    rapidDiagnostic: "mrsa",
    mic: "vancomycin MIC 2 mg/L",
  });

  assert.equal(result.observation?.normalizedAgentId, "vancomycin");
  assert.equal(result.observation?.value, 2);
  assert.ok(
    result.findings.some(
      (finding) =>
        finding.outcome === "avoid" &&
        /Vancomycin MIC 2 or higher|daptomycin/i.test(`${finding.title} ${finding.detail}`),
    ),
    "Expected vancomycin MIC 2 to trigger a bloodstream-level MRSA warning",
  );
});

test("workspace blocks pip-tazo reassurance for invasive ESBL disease even with a favorable MIC", () => {
  const pathogen = PATHOGEN_REFERENCE_BY_ID["esbl-enterobacterales"];
  assert.ok(pathogen, "Expected ESBL pathogen reference");

  const result = buildSusceptibilityWorkspaceResult(pathogen, {
    pathogenId: "esbl-enterobacterales",
    site: "bloodstream",
    interpretation: "susceptible",
    rapidDiagnostic: "esbl",
    mic: "pip-tazo MIC 8",
  });

  assert.ok(
    result.findings.some(
      (finding) =>
        finding.outcome === "avoid" &&
        /Piperacillin-tazobactam MIC|carbapenem-centered definitive plan/i.test(`${finding.title} ${finding.detail}`),
    ),
    "Expected ESBL pip-tazo MIC data to still warn against invasive definitive therapy",
  );
});

test("workspace converts borderline cefepime MICs into PK/PD cautions for DTR Pseudomonas", () => {
  const pathogen = PATHOGEN_REFERENCE_BY_ID["dtr-pseudomonas"];
  assert.ok(pathogen, "Expected DTR Pseudomonas pathogen reference");

  const result = buildSusceptibilityWorkspaceResult(pathogen, {
    pathogenId: "dtr-pseudomonas",
    site: "lung",
    interpretation: "susceptible",
    rapidDiagnostic: "dtr-pseudomonas",
    mic: "cefepime MIC 8 mg/L",
  });

  assert.ok(
    result.findings.some(
      (finding) =>
        finding.outcome === "caution" &&
        /PK\/PD discipline|prolonged infusion|cefepime MIC 8/i.test(`${finding.title} ${finding.detail}`),
    ),
    "Expected DTR Pseudomonas borderline cefepime MIC to trigger an exposure caution",
  );
});

test("workspace recognizes KPC resistance-seesaw notes around restored meropenem", () => {
  const pathogen = PATHOGEN_REFERENCE_BY_ID["kpc-cre"];
  assert.ok(pathogen, "Expected KPC pathogen reference");

  const result = buildSusceptibilityWorkspaceResult(pathogen, {
    pathogenId: "kpc-cre",
    site: "bloodstream",
    interpretation: "unknown",
    rapidDiagnostic: "kpc",
    mic: "caz-avi resistant, meropenem restored MIC 1",
  });

  assert.ok(
    result.findings.some(
      (finding) =>
        finding.outcome === "caution" &&
        /Restored meropenem|resistance see-saw|routine monotherapy/i.test(`${finding.title} ${finding.detail}`),
    ),
    "Expected restored-meropenem note to trigger a KPC mechanism review warning",
  );
});

test("workspace combines structured agent observations for KPC resistance see-saw review", () => {
  const pathogen = PATHOGEN_REFERENCE_BY_ID["kpc-cre"];
  assert.ok(pathogen, "Expected KPC pathogen reference");

  const result = buildSusceptibilityWorkspaceResult(pathogen, {
    pathogenId: "kpc-cre",
    site: "bloodstream",
    interpretation: "unknown",
    rapidDiagnostic: "kpc",
    observations: [
      {
        raw: "Ceftazidime-avibactam resistant",
        normalizedAgentId: "ceftazidime-avibactam",
        agentLabel: "Ceftazidime-avibactam",
        interpretation: "resistant",
      },
      {
        raw: "Meropenem susceptible MIC 1 mg/L",
        normalizedAgentId: "meropenem",
        agentLabel: "Meropenem",
        interpretation: "susceptible",
        comparator: "=",
        value: 1,
        units: "mg/L",
      },
    ],
  });

  assert.ok(
    result.findings.some(
      (finding) =>
        finding.outcome === "caution" &&
        /Ceftazidime-avibactam resistance with restored meropenem|phenotype re-check/i.test(
          `${finding.title} ${finding.detail}`,
        ),
    ),
    "Expected structured dual-agent observations to trigger a KPC see-saw warning",
  );
});

test("workspace promotes documented caz-avi plus aztreonam combo support for MBL-CRE", () => {
  const pathogen = PATHOGEN_REFERENCE_BY_ID["mbl-cre"];
  assert.ok(pathogen, "Expected MBL pathogen reference");

  const result = buildSusceptibilityWorkspaceResult(pathogen, {
    pathogenId: "mbl-cre",
    site: "bloodstream",
    interpretation: "susceptible",
    rapidDiagnostic: "mbl",
    combinationObservations: [
      {
        raw: "Ceftazidime-avibactam + aztreonam susceptible BDE",
        comboId: "caz-avi-aztreonam",
        comboLabel: "Ceftazidime-avibactam + aztreonam",
        memberAgentIds: ["ceftazidime-avibactam", "aztreonam"],
        interpretation: "susceptible",
        testMethod: "bde",
      },
    ],
  });

  assert.ok(
    result.findings.some(
      (finding) =>
        finding.outcome === "reliable" &&
        /explicit combo support|aztreonam strategy/i.test(`${finding.title} ${finding.detail}`),
    ),
    "Expected explicit combo support to surface as a reliable MBL finding",
  );
  assert.ok(
    !result.findings.some(
      (finding) =>
        finding.outcome === "avoid" &&
        /monotherapy/i.test(`${finding.title} ${finding.detail}`),
    ),
    "Expected monotherapy warning to be suppressed when the combo is explicitly documented",
  );
});

test("workspace keeps separate MBL component rows in caution territory without combo support", () => {
  const pathogen = PATHOGEN_REFERENCE_BY_ID["mbl-cre"];
  assert.ok(pathogen, "Expected MBL pathogen reference");

  const result = buildSusceptibilityWorkspaceResult(pathogen, {
    pathogenId: "mbl-cre",
    site: "bloodstream",
    interpretation: "susceptible",
    rapidDiagnostic: "mbl",
    observations: [
      {
        raw: "Ceftazidime-avibactam susceptible",
        normalizedAgentId: "ceftazidime-avibactam",
        agentLabel: "Ceftazidime-avibactam",
        interpretation: "susceptible",
      },
      {
        raw: "Aztreonam susceptible MIC 2 mg/L",
        normalizedAgentId: "aztreonam",
        agentLabel: "Aztreonam",
        interpretation: "susceptible",
        comparator: "=",
        value: 2,
        units: "mg/L",
      },
    ],
  });

  assert.ok(
    result.findings.some(
      (finding) =>
        finding.outcome === "caution" &&
        /Separate agent rows are not the same as combo support/i.test(`${finding.title} ${finding.detail}`),
    ),
    "Expected separate single-agent rows to stay in caution territory for MBL-CRE",
  );
});

test("workspace parses raw combo notes into first-class combo observations", () => {
  const pathogen = PATHOGEN_REFERENCE_BY_ID["mbl-cre"];
  assert.ok(pathogen, "Expected MBL pathogen reference");

  const result = buildSusceptibilityWorkspaceResult(pathogen, {
    pathogenId: "mbl-cre",
    site: "bloodstream",
    interpretation: "susceptible",
    rapidDiagnostic: "mbl",
    mic: "caz-avi + aztreonam susceptible by BDE",
  });

  assert.equal(result.combinationObservations?.[0]?.comboId, "caz-avi-aztreonam");
  assert.equal(result.combinationObservations?.[0]?.testMethod, "bde");
});

test("workspace surfaces combo execution notes when paired MBL therapy is selected", () => {
  const pathogen = PATHOGEN_REFERENCE_BY_ID["mbl-cre"];
  assert.ok(pathogen, "Expected MBL pathogen reference");

  const result = buildSusceptibilityWorkspaceResult(pathogen, {
    pathogenId: "mbl-cre",
    site: "bloodstream",
    interpretation: "susceptible",
    rapidDiagnostic: "mbl",
    dialysis: "HD",
    combinationObservations: [
      {
        raw: "Ceftazidime-avibactam + aztreonam susceptible BDE",
        comboId: "caz-avi-aztreonam",
        comboLabel: "Ceftazidime-avibactam + aztreonam",
        memberAgentIds: ["ceftazidime-avibactam", "aztreonam"],
        interpretation: "susceptible",
        testMethod: "bde",
      },
    ],
  });

  assert.ok(
    result.executionNotes?.some(
      (note) =>
        /paired aztreonam execution|coordinated intentionally/i.test(`${note.title} ${note.detail}`),
    ),
    "Expected paired-execution guidance for the combo regimen",
  );
  assert.ok(
    result.executionNotes?.some(
      (note) =>
        /Hemodialysis|HD|renally adjust both agents/i.test(`${note.title} ${note.detail} ${note.action ?? ""}`),
    ),
    "Expected dialysis-specific execution guidance for the paired regimen",
  );
});

test("workspace marks paired MBL therapy as ready when support, renal context, and handoff anchors are present", () => {
  const pathogen = PATHOGEN_REFERENCE_BY_ID["mbl-cre"];
  assert.ok(pathogen, "Expected MBL pathogen reference");

  const result = buildSusceptibilityWorkspaceResult(pathogen, {
    pathogenId: "mbl-cre",
    site: "bloodstream",
    interpretation: "susceptible",
    rapidDiagnostic: "mbl",
    crcl: 82,
    patient: {
      cultureStatus: "final",
      sourceControl: "achieved",
      rapidDiagnosticResult: "mbl",
    },
    combinationObservations: [
      {
        raw: "Ceftazidime-avibactam + aztreonam susceptible BDE",
        comboId: "caz-avi-aztreonam",
        comboLabel: "Ceftazidime-avibactam + aztreonam",
        memberAgentIds: ["ceftazidime-avibactam", "aztreonam"],
        interpretation: "susceptible",
        testMethod: "bde",
      },
    ],
  });

  const readinessById = Object.fromEntries(
    (result.comboReadinessItems ?? []).map((item) => [item.id, item]),
  );

  assert.equal(readinessById["combo-support"]?.status, "ready");
  assert.equal(readinessById["combo-execution"]?.status, "ready");
  assert.equal(readinessById["combo-handoff"]?.status, "ready");
});

test("workspace leaves paired MBL execution in needs-data territory without renal context", () => {
  const pathogen = PATHOGEN_REFERENCE_BY_ID["mbl-cre"];
  assert.ok(pathogen, "Expected MBL pathogen reference");

  const result = buildSusceptibilityWorkspaceResult(pathogen, {
    pathogenId: "mbl-cre",
    site: "bloodstream",
    interpretation: "susceptible",
    rapidDiagnostic: "mbl",
    patient: {
      cultureStatus: "final",
      sourceControl: "achieved",
      rapidDiagnosticResult: "mbl",
    },
    combinationObservations: [
      {
        raw: "Ceftazidime-avibactam + aztreonam susceptible BDE",
        comboId: "caz-avi-aztreonam",
        comboLabel: "Ceftazidime-avibactam + aztreonam",
        memberAgentIds: ["ceftazidime-avibactam", "aztreonam"],
        interpretation: "susceptible",
        testMethod: "bde",
      },
    ],
  });

  const readinessById = Object.fromEntries(
    (result.comboReadinessItems ?? []).map((item) => [item.id, item]),
  );

  assert.equal(readinessById["combo-support"]?.status, "ready");
  assert.equal(readinessById["combo-execution"]?.status, "needs_data");
});

test("workspace blocks definitive paired-regimen handoff when source control is still pending", () => {
  const pathogen = PATHOGEN_REFERENCE_BY_ID["mbl-cre"];
  assert.ok(pathogen, "Expected MBL pathogen reference");

  const result = buildSusceptibilityWorkspaceResult(pathogen, {
    pathogenId: "mbl-cre",
    site: "bloodstream",
    interpretation: "susceptible",
    rapidDiagnostic: "mbl",
    crcl: 40,
    patient: {
      cultureStatus: "pending",
      sourceControl: "pending",
      rapidDiagnosticResult: "mbl",
      vasopressors: true,
    },
    combinationObservations: [
      {
        raw: "Ceftazidime-avibactam + aztreonam susceptible reported pair",
        comboId: "caz-avi-aztreonam",
        comboLabel: "Ceftazidime-avibactam + aztreonam",
        memberAgentIds: ["ceftazidime-avibactam", "aztreonam"],
        interpretation: "susceptible",
        testMethod: "reported-pair",
      },
    ],
  });

  const readinessById = Object.fromEntries(
    (result.comboReadinessItems ?? []).map((item) => [item.id, item]),
  );

  assert.equal(readinessById["combo-support"]?.status, "caution");
  assert.equal(readinessById["combo-execution"]?.status, "caution");
  assert.equal(readinessById["combo-handoff"]?.status, "not_ready");
  assert.ok(
    readinessById["combo-handoff"]?.cues.some((cue) => /Source control is still pending/i.test(cue)),
    "Expected source-control blocker to remain visible in handoff cues",
  );
});
