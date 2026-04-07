import type { Dispatch, ReactNode, SetStateAction } from "react";

export type EvidenceKind = "guideline" | "trial" | "consensus" | "review";

export interface EvidenceSource {
  id: string;
  kind: EvidenceKind;
  label: string;
  url?: string;
  doi?: string;
  pmid?: string;
  searchQuery?: string;
  aliases?: string[];
}

export interface ContentSource {
  id: string;
  citation: string;
  note?: string;
}

export interface ContentReviewEntry {
  reviewedOn: string;
  reviewedBy: string;
  summary: string;
}

export type ContentConfidence = "high" | "moderate" | "emerging";

export interface SectionConfidenceEntry {
  section: string;
  confidence: ContentConfidence;
  rationale: string;
}

export interface GuidelineDisagreement {
  topic: string;
  guidanceA: string;
  guidanceB: string;
  pharmacistTakeaway: string;
}

export interface ContentGovernance {
  owner: string;
  approvedBodyVersion: string;
}

export interface ContentMeta {
  lastReviewed: string;
  reviewedBy: string;
  reviewScope: string;
  confidence: ContentConfidence;
  guidelineVersion?: string;
  sources: ContentSource[];
  reviewHistory: ContentReviewEntry[];
  whatChanged?: string[];
  sectionConfidence?: SectionConfidenceEntry[];
  guidelineDisagreements?: GuidelineDisagreement[];
  governance: ContentGovernance;
}

export type PatientRapidDiagnosticResult =
  | "none"
  | "mrsa"
  | "mssa"
  | "esbl"
  | "kpc"
  | "mbl"
  | "dtr-pseudomonas";

export type BreakpointRapidDiagnostic = PatientRapidDiagnosticResult | "candida";

export type SusceptibilityInterpretation =
  | "susceptible"
  | "intermediate"
  | "resistant"
  | "sdd"
  | "unknown";

export type SusceptibilityComparator = "<" | "<=" | "=" | ">=" | ">";
export type SusceptibilityCombinationTestMethod =
  | "bde"
  | "local-combo"
  | "reported-pair"
  | "not-stated";

export interface NormalizedSusceptibilityObservation {
  raw: string;
  normalizedAgentId?: string;
  agentLabel?: string;
  interpretation?: SusceptibilityInterpretation;
  comparator?: SusceptibilityComparator;
  value?: number;
  units?: "mg/L" | "mcg/mL";
  keywords?: string[];
}

export interface NormalizedCombinationObservation {
  raw: string;
  comboId: string;
  comboLabel: string;
  memberAgentIds: string[];
  interpretation?: SusceptibilityInterpretation;
  testMethod?: SusceptibilityCombinationTestMethod;
  keywords?: string[];
}

export interface EvidenceStatement {
  title: string;
  detail: string;
  note?: string;
  sourceIds?: string[];
}

export interface ContaminationPitfall {
  scenario: string;
  implication: string;
  action: string;
  sourceIds?: string[];
}

export interface ReassessmentCheckpoint {
  window: "24h" | "48h" | "definitive";
  title: string;
  trigger: string;
  actions: string[];
  sourceIds?: string[];
}

export interface DurationAnchorEntry {
  event: string;
  anchor: string;
  rationale?: string;
  sourceIds?: string[];
}

export interface MonitoringAction {
  trigger: string;
  action: string;
  rationale?: string;
  sourceIds?: string[];
}

export interface MisuseTrap {
  scenario: string;
  risk: string;
  saferApproach: string;
  sourceIds?: string[];
}

export interface AdministrationConstraint {
  title: string;
  detail: string;
  action?: string;
  sourceIds?: string[];
}

export interface SiteSpecificAvoidance {
  site: string;
  reason: string;
  preferredApproach?: string;
  sourceIds?: string[];
}

export interface PathogenTherapyRecommendation {
  site: string;
  preferred: string;
  alternatives?: string[];
  avoid?: string[];
  rationale: string;
  linkedMonographIds?: string[];
  sourceIds?: string[];
}

export interface PathogenBreakpointRule {
  title: string;
  outcome: "reliable" | "caution" | "avoid";
  detail: string;
  site?: string[];
  interpretation?: SusceptibilityInterpretation[];
  rapidDiagnostic?: BreakpointRapidDiagnostic[];
  linkedMonographIds?: string[];
  sourceIds?: string[];
}

export interface RelatedPathwayReference {
  diseaseId: string;
  subcategoryId?: string;
  label: string;
}

export interface PathogenReference {
  id: string;
  name: string;
  phenotype: string;
  summary: string;
  likelySyndromes: string[];
  rapidDiagnosticInterpretation: EvidenceStatement[];
  contaminationPitfalls: ContaminationPitfall[];
  resistanceMechanisms: EvidenceStatement[];
  breakpointCaveats: EvidenceStatement[];
  preferredTherapyBySite: PathogenTherapyRecommendation[];
  breakpointRules?: PathogenBreakpointRule[];
  linkedMonographIds?: string[];
  relatedPathways?: RelatedPathwayReference[];
}

export interface SusceptibilityWorkspaceInput {
  pathogenId?: string;
  site: string;
  interpretation: SusceptibilityInterpretation;
  rapidDiagnostic?: BreakpointRapidDiagnostic;
  mic?: string;
  observation?: NormalizedSusceptibilityObservation | null;
  observations?: NormalizedSusceptibilityObservation[];
  combinationObservations?: NormalizedCombinationObservation[];
  dialysis?: PatientContext["dialysis"];
  crcl?: number | null;
  patient?: PatientContext;
}

export interface SusceptibilityWorkspaceFinding {
  outcome: "reliable" | "caution" | "avoid";
  title: string;
  detail: string;
  linkedMonographIds?: string[];
  sourceIds?: string[];
}

export interface SusceptibilityWorkspaceExecutionNote {
  title: string;
  detail: string;
  action?: string;
  linkedMonographIds?: string[];
  sourceIds?: string[];
}

export type WorkflowReadinessStatus =
  | "ready"
  | "caution"
  | "not_ready"
  | "needs_data"
  | "not_applicable";

export interface WorkflowReadinessItem {
  id: string;
  title: string;
  status: WorkflowReadinessStatus;
  summary: string;
  detail: string;
  cues: string[];
}

export interface SusceptibilityWorkspaceResult {
  pathogen: PathogenReference;
  matchedTherapy: PathogenTherapyRecommendation[];
  findings: SusceptibilityWorkspaceFinding[];
  executionNotes?: SusceptibilityWorkspaceExecutionNote[];
  comboReadinessItems?: WorkflowReadinessItem[];
  observation?: NormalizedSusceptibilityObservation | null;
  observations?: NormalizedSusceptibilityObservation[];
  combinationObservations?: NormalizedCombinationObservation[];
}

export interface OverviewEvidenceEntry {
  name: string;
  detail: string;
  sourceIds?: string[];
}

export type StructuredEntryStatus = "ready" | "not_applicable";

export interface WorkflowBlock {
  status?: StructuredEntryStatus;
  summary?: string;
  bullets?: string[];
}

export type PatientSignalKey =
  | "allergy_beta_lactam"
  | "pregnancy"
  | "renal_impairment"
  | "dialysis"
  | "poor_oral_route"
  | "opat_limited"
  | "bacteremia"
  | "endovascular"
  | "thrombocytopenia"
  | "qtc_prolonged"
  | "ck_elevated"
  | "neutropenia"
  | "transplant"
  | "calcineurin_inhibitor"
  | "arc"
  | "hepatic_injury"
  | "line_access_limited";

export interface DecisionMatchCriteria {
  pathogenIds?: string[];
  sites?: string[];
  rapidDiagnostics?: BreakpointRapidDiagnostic[];
  requiresPatientSignals?: PatientSignalKey[];
  avoidPatientSignals?: PatientSignalKey[];
}

export interface SourceBackedDecisionBlock {
  sourceIds?: string[];
  confidence?: ContentConfidence;
  disagreementNote?: string;
  whatChanged?: string[];
}

export type DefinitiveTherapyRole = "preferred" | "acceptable" | "rescue" | "avoid";

export interface DefinitiveTherapyBranch extends SourceBackedDecisionBlock {
  regimen: string;
  why: string;
  linkedMonographIds?: string[];
}

export interface DefinitiveTherapyRule extends SourceBackedDecisionBlock {
  id: string;
  title: string;
  organism: string;
  syndrome?: string;
  susceptibility: string;
  match?: DecisionMatchCriteria;
  preferred: DefinitiveTherapyBranch;
  acceptable?: DefinitiveTherapyBranch[];
  rescue?: DefinitiveTherapyBranch[];
  avoid?: DefinitiveTherapyBranch[];
  monitoringFocus?: string[];
}

export interface SpecialPopulationDosingMatrix extends SourceBackedDecisionBlock {
  population: string;
  doseStrategy: string;
  weightBasis?: string;
  infusionStrategy?: string;
  tdmTarget?: string;
  whenToConsult?: string;
}

export interface OralStepDownOption extends SourceBackedDecisionBlock {
  id: string;
  label: string;
  regimen: string;
  rank: number;
  match?: DecisionMatchCriteria;
  eligibilityChecklist: string[];
  bioavailability: string;
  penetration: string;
  barrierNotes?: string[];
  evidenceStrength?: string;
  linkedMonographIds?: string[];
}

export interface DurationRule extends SourceBackedDecisionBlock {
  id: string;
  label: string;
  defaultDuration: string;
  anchorEvent: string;
  appliesWhen?: string[];
  exceptions?: string[];
  linkedMonographIds?: string[];
}

export interface FailureEscalationBranch extends SourceBackedDecisionBlock {
  id: string;
  checkpoint: "24h" | "48-72h" | "not_improving";
  title: string;
  trigger: string;
  likelyCauses?: string[];
  actions: string[];
  broadenTo?: string[];
  linkedMonographIds?: string[];
}

export type MonitoringSchedulePhase = "baseline" | "early" | "weekly" | "event_driven";

export interface MonitoringSchedule extends SourceBackedDecisionBlock {
  id: string;
  phase: MonitoringSchedulePhase;
  cadence: string;
  labs?: string[];
  clinical?: string[];
  actionThresholds?: string[];
}

export interface ExecutionBurdenProfile extends SourceBackedDecisionBlock {
  infusionBurden: "low" | "moderate" | "high";
  lineAccess: "simple" | "moderate" | "complex";
  opatFit: "good" | "conditional" | "poor";
  monitoringBurden: "low" | "moderate" | "high";
  sodiumLoad?: string;
  vesicant?: string;
  homeInfusionNote?: string;
  comparatorSummary: string;
}

export interface PatientLabSnapshot {
  platelets?: number;
  ck?: number;
  ast?: number;
  alt?: number;
  bilirubin?: number;
  anc?: number;
  lactate?: number;
  qtc?: number;
}

export type PatientLineAccess = "limited" | "single_lumen" | "multi_lumen";

export interface RapidDiagnosticAction {
  trigger: string;
  action: string;
  rationale?: string;
}

export interface BreakpointNote {
  marker: string;
  interpretation: string;
  action?: string;
}

export interface IntrinsicResistanceAlert {
  organism: string;
  resistance: string;
  implication: string;
}

export interface CoverageMatrixRow {
  label: string;
  status: "preferred" | "active" | "conditional" | "inactive" | "avoid";
  detail: string;
  note?: string;
}

export interface RegimenPlan {
  regimen: string;
  indication?: string;
  site?: string;
  role?: "preferred" | "alternative" | "salvage" | "adjunct" | "situational";
  rationale?: string;
  pathogenFocus?: string[];
  riskFactorTriggers?: string[];
  avoidIf?: string[];
  renalFlags?: string[];
  dialysisFlags?: string[];
  rapidDiagnosticActions?: string[];
  linkedMonographIds?: string[];
}

export interface DosingByIndicationEntry {
  label: string;
  regimen: string;
  notes?: string;
}

export interface RenalReplacementEntry {
  modality: "HD" | "PD" | "CRRT" | "SLED" | "ECMO";
  guidance: string;
}

export interface SpecialPopulationEntry {
  population: string;
  guidance: string;
}

export interface TherapeuticDrugMonitoring {
  target: string;
  sampling: string;
  adjustment: string;
  pearls?: string[];
}

export interface AdministrationGuidance {
  infusion?: string;
  compatibility?: string;
  stability?: string;
  oralAbsorption?: string;
  note?: string;
}

export interface PenetrationEntry {
  site: string;
  detail: string;
}

export interface InteractionAction {
  interactingAgent: string;
  effect: string;
  management: string;
  severity?: "major" | "moderate" | "monitor";
}

export interface StewardshipUseCase {
  scenario: string;
  role: string;
  notes?: string;
}

export interface InstitutionPathwayNote {
  diseaseId: string;
  subcategoryId?: string;
  kind: "antibiogram" | "workflow" | "restriction";
  title: string;
  detail: string;
}

export interface InstitutionOptionPolicy {
  diseaseId: string;
  subcategoryId: string;
  optionId?: string;
  monographId?: string;
  regimenIncludes?: string;
  status: "preferred" | "restricted";
  detail: string;
  approval?: string;
}

export interface InstitutionDrugPolicy {
  drugId: string;
  restriction?: string;
  approval?: string;
  preferredContexts?: string[];
  notes?: string[];
}

export interface InstitutionAntibiogramEntry {
  diseaseId?: string;
  subcategoryId?: string;
  drugId?: string;
  regimenIncludes?: string;
  organism: string;
  sample: string;
  susceptibility: string;
  source: string;
  note?: string;
  status?: "preferred" | "caution";
}

export interface InstitutionProfile {
  id: string;
  name: string;
  lastUpdated: string;
  localNotes?: InstitutionPathwayNote[];
  optionPolicies?: InstitutionOptionPolicy[];
  drugPolicies?: InstitutionDrugPolicy[];
  antibiogram?: InstitutionAntibiogramEntry[];
}

export interface DiseaseState {
  id: string;
  name: string;
  icon: string;
  category: string;
  surfaceMode?: "infectious-disease" | "general-pharmacy";
  contentMeta?: ContentMeta;
  overview: {
    definition: string;
    epidemiology?: string;
    riskFactors?: string;
    keyGuidelines: OverviewEvidenceEntry[];
    landmarkTrials: OverviewEvidenceEntry[];
  };
  subcategories: Subcategory[];
  drugMonographs: DrugMonograph[];
}

export interface DiseaseCatalogSummary {
  id: string;
  name: string;
  icon: string;
  category: string;
  subcategoryCount: number;
  monographCount: number;
  contentMeta?: ContentMeta;
}

export interface Subcategory {
  id: string;
  name: string;
  contentMeta?: ContentMeta;
  definition: string;
  clinicalPresentation?: string;
  diagnostics?: string;
  diagnosticWorkup?: WorkflowBlock;
  severitySignals?: WorkflowBlock;
  mdroRiskFactors?: WorkflowBlock;
  sourceControl?: WorkflowBlock;
  deEscalation?: WorkflowBlock;
  ivToPoPlan?: WorkflowBlock;
  failureEscalation?: WorkflowBlock;
  consultTriggers?: WorkflowBlock;
  durationAnchor?: WorkflowBlock;
  diagnosticStewardship?: EvidenceStatement[];
  reassessmentCheckpoints?: ReassessmentCheckpoint[];
  contaminationPitfalls?: ContaminationPitfall[];
  durationAnchors?: DurationAnchorEntry[];
  rapidDiagnostics?: RapidDiagnosticAction[];
  breakpointNotes?: BreakpointNote[];
  intrinsicResistance?: IntrinsicResistanceAlert[];
  coverageMatrix?: CoverageMatrixRow[];
  definitiveTherapy?: DefinitiveTherapyRule[];
  oralStepDown?: OralStepDownOption[];
  durationRules?: DurationRule[];
  failureEscalationPath?: FailureEscalationBranch[];
  pearls?: string[];
  empiricTherapy?: EmpiricTier[];
  organismSpecific?: OrganismSpecific[];
  durationGuidance?: {
    standard: string;
    severe?: string;
    opatNote?: string;
    stewardshipNote?: string;
  };
  /** Neutral alias for non-infectious treatment pathways. */
  treatmentApproach?: EmpiricTier[];
  /** Alias: some data files use empiricRegimens instead of empiricTherapy */
  empiricRegimens?: EmpiricTier[];
}

export interface EmpiricTier {
  line: string;
  options: EmpiricOption[];
}

export interface EmpiricOption {
  id?: string;
  regimen: string;
  notes?: string;
  plan?: RegimenPlan;
  /** Legacy overloaded field retained for backward compatibility with authored content. */
  drug?: string;
  monographId?: string;
  evidence?: string;
  evidenceSource?: string;
  evidenceSourceIds?: string[];
}

export interface OrganismSpecific {
  organism: string;
  preferred?: string;
  alternative?: string;
  notes?: string;
}

export interface DrugMonograph {
  id: string;
  name: string;
  contentMeta?: ContentMeta;
  brandNames?: string;
  drugClass: string;
  mechanismOfAction: string;
  spectrum: string;
  dosing?: Record<string, string | undefined>;
  renalAdjustment: string;
  hepaticAdjustment: string;
  adverseEffects?: {
    common: string;
    serious: string;
    rare?: string;
    fdaBoxedWarnings?: string;
    contraindications?: string;
  };
  drugInteractions?: string[];
  monitoring: string;
  pregnancyLactation: string;
  pharmacistPearls?: string[];
  pkpdDriver?: {
    driver: "Time-dependent (T>MIC)" | "AUC/MIC-dependent" | "Concentration-dependent (Cmax/MIC)";
    target: string;
    extendedInfusion?: string;
  };
  ivToPoSwitch?: {
    poBioavailability: string;
    switchCriteria: string;
    note?: string;
  };
  opatEligibility?: {
    eligible: "yes" | "conditional" | "no";
    administration: string;
    monitoring: string;
    considerations?: string[];
  };
  dosingByIndication?: DosingByIndicationEntry[];
  renalReplacement?: RenalReplacementEntry[];
  specialPopulations?: SpecialPopulationEntry[];
  therapeuticDrugMonitoring?: TherapeuticDrugMonitoring;
  administration?: AdministrationGuidance;
  penetration?: PenetrationEntry[];
  specialPopulationMatrix?: SpecialPopulationDosingMatrix[];
  monitoringSchedule?: MonitoringSchedule[];
  executionBurden?: ExecutionBurdenProfile;
  tissuePenetration?: {
    csf?: string;
    lung?: string;
    boneJoint?: string;
    prostate?: string;
    urine?: string;
    notes?: string;
  };
  rapidDiagnostics?: RapidDiagnosticAction[];
  breakpointNotes?: BreakpointNote[];
  intrinsicResistance?: IntrinsicResistanceAlert[];
  coverageMatrix?: CoverageMatrixRow[];
  interactionActions?: InteractionAction[];
  stewardshipUseCases?: StewardshipUseCase[];
  monitoringActions?: MonitoringAction[];
  misuseTraps?: MisuseTrap[];
  administrationConstraints?: AdministrationConstraint[];
  siteSpecificAvoidances?: SiteSpecificAvoidance[];
}

export interface MonographCatalogSummary {
  id: string;
  name: string;
  drugClass: string;
  parentDiseaseId: string;
  parentDiseaseName: string;
}

export interface RegimenReference {
  id: string;
  diseaseId: string;
  diseaseName: string;
  diseaseIcon: string;
  subcategoryId: string;
  subcategoryName: string;
  line: string;
  regimen: string;
  notes?: string;
  indication?: string;
  site?: string;
  role?: RegimenPlan["role"];
  pathogenFocus?: string[];
  riskFactorTriggers?: string[];
  avoidIf?: string[];
  renalFlags?: string[];
  dialysisFlags?: string[];
  rapidDiagnosticActions?: string[];
  linkedMonographIds?: string[];
  drug?: string;
  monographId?: string;
  evidence?: string;
  evidenceSource?: string;
  evidenceSourceIds?: string[];
}

export interface PatientContext {
  weight?: number;
  height?: number;
  age?: number;
  sex?: "male" | "female";
  scr?: number;
  dialysis?: "none" | "HD" | "PD" | "CRRT";
  pregnant?: boolean;
  oralRoute?: "adequate" | "limited" | "none";
  enteralFeeds?: boolean;
  qtRisk?: boolean;
  serotonergicMeds?: boolean;
  opatSupport?: "adequate" | "uncertain" | "limited";
  recentHospitalization?: boolean;
  recentIvAntibiotics?: boolean;
  priorMrsa?: boolean;
  priorEsbl?: boolean;
  priorCre?: boolean;
  priorDtrPseudomonas?: boolean;
  mrsaNares?: "negative" | "positive" | "pending";
  cultureStatus?: "not_sent" | "pending" | "final";
  rapidDiagnosticResult?: PatientRapidDiagnosticResult;
  sourceControl?: "achieved" | "pending" | "not_applicable";
  bacteremiaConcern?: boolean;
  endovascularConcern?: boolean;
  immunocompromised?: boolean;
  neutropenic?: boolean;
  transplant?: boolean;
  icuLevelCare?: boolean;
  vasopressors?: boolean;
  cultureCollectedOn?: string;
  rapidDiagnosticOn?: string;
  finalCultureOn?: string;
  cultureClearanceOn?: string;
  sourceControlOn?: string;
  operativeSourceControlOn?: string;
  documentedSourceControlOn?: string;
  activeMedications?: string[];
  labs?: PatientLabSnapshot;
  lineAccess?: PatientLineAccess;
  transplantImmunosuppression?: "none" | "calcineurin_inhibitor" | "other";
}

export interface AllergyRecord {
  name: string;
  severity: string;
}

export interface MonographLookupResult {
  monograph: DrugMonograph;
  disease: DiseaseState;
}

export type DrugSearchResult = DrugMonograph & {
  parentDisease: DiseaseState;
};

export type OrganismSearchResult = OrganismSpecific & {
  parentDisease: DiseaseState;
  parentSubcategory: Subcategory;
};

export type PathogenSearchResult = PathogenReference;

export type SubcategorySearchResult = Subcategory & {
  parentDisease: DiseaseState;
  matchType: "name" | "pearl" | "decision-support" | "workflow" | "microbiology" | "empiric";
};

export type RegimenSearchResult = RegimenReference & {
  parentDisease: DiseaseState;
  parentSubcategory: Subcategory;
};

export interface SearchResult {
  diseases: DiseaseState[];
  drugs: DrugSearchResult[];
  organisms: OrganismSearchResult[];
  pathogens: PathogenSearchResult[];
  regimens: RegimenSearchResult[];
  subcategories: SubcategorySearchResult[];
}

export type RecentView =
  | { type: "disease"; diseaseId: string; label: string; meta: string; icon: string }
  | { type: "subcategory"; diseaseId: string; subcategoryId: string; label: string; meta: string; icon: string }
  | { type: "monograph"; diseaseId: string; monographId: string; label: string; meta: string; icon: string }
  | { type: "pathogen"; pathogenId: string; label: string; meta: string; icon: string };

export type NavStateKey =
  | "home"
  | "disease_overview"
  | "subcategory"
  | "monograph"
  | "pathogen"
  | "compare"
  | "audit"
  | "calculators"
  | "breakpoints";

export interface BreakpointWorkspacePreset {
  site?: string | null;
  rapidDiagnostic?: BreakpointRapidDiagnostic | null;
  interpretation?: SusceptibilityInterpretation | null;
  mic?: string | null;
}

export type NavigateToData = {
  disease?: { id: string } | null;
  diseaseId?: string | null;
  subcategory?: { id: string } | null;
  subcategoryId?: string | null;
  monograph?: { id: string } | null;
  monographId?: string | null;
  pathogen?: { id: string } | null;
  pathogenId?: string | null;
  breakpointPreset?: BreakpointWorkspacePreset | null;
};

export type NavigateTo = (state: NavStateKey, data?: NavigateToData) => void;

export type ThemeKey = "dark" | "light" | "oled";

export type Styles = Record<string, any>;

// ==================== COMPONENT PROPS ====================

export interface SectionProps {
  id: string;
  title: string;
  icon?: string;
  accentColor?: string;
  children: ReactNode;
  defaultOpen?: boolean;
  expandedSections: Record<string, boolean>;
  toggleSection: (id: string) => void;
  readingMode: boolean;
  S: Styles;
}

export interface ToastProps {
  toast: { message: string; icon: string; leaving?: boolean } | null;
  S: Styles;
}

export interface CopyBtnProps {
  text: string;
  id: string;
  copiedId: string | null;
  onCopy: (text: string, id: string) => void;
  S: Styles;
}

export interface AllergyModalProps {
  show: boolean;
  onClose: () => void;
  theme: ThemeKey;
  allergies: AllergyRecord[];
  allergyInput: string;
  setAllergyInput: (value: string) => void;
  allergySeverity: string;
  setAllergySeverity: (value: string) => void;
  addAllergy: () => void;
  onClearWorkData: () => void;
  removeAllergy: (name: string) => void;
}

export interface AllergyWarningProps {
  drugId: string;
  allergies: AllergyRecord[];
  S: Styles;
}

export interface AuditViewProps {
  diseaseStates: DiseaseState[];
  S: Styles;
}

export interface CompareViewProps {
  drugs: MonographLookupResult[];
  compareItems: string[];
  setCompareItems: Dispatch<SetStateAction<string[]>>;
  allMonographs: MonographCatalogSummary[];
  adjbw: number | null;
  crcl: number | null;
  ibw: number | null;
  patient: PatientContext;
  regimenXref: Record<string, RegimenReference[]>;
  ExpandCollapseBar: () => ReactNode;
  S: Styles;
}

export interface CrossRefBadgesProps {
  drugId: string;
  currentDiseaseId?: string;
  monographXref: Record<string, DiseaseState[]>;
  navigateTo: NavigateTo;
  showToast: (message: string, icon?: string) => void;
  currentDrugName: string;
  S: Styles;
}

export interface RegimenCrossRefsProps {
  currentDiseaseId?: string;
  currentDrugName: string;
  navigateTo: NavigateTo;
  regimenXref: Record<string, RegimenReference[]>;
  showToast: (message: string, icon?: string) => void;
  drugId: string;
  S: Styles;
}

export interface EmpiricTierViewProps {
  diseaseId: string;
  subcategoryId: string;
  surfaceMode?: DiseaseState["surfaceMode"];
  tier: EmpiricTier;
  S: Styles;
  navigateTo: NavigateTo;
  findMonograph: (drugId: string) => MonographLookupResult | null;
  copiedId: string | null;
  onCopy: (text: string, id: string) => void;
  allergies: AllergyRecord[];
  patient: PatientContext;
  crcl: number | null;
}

export interface DisclaimerModalProps {
  S: Styles;
}
