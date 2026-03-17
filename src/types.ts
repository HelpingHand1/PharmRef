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
  rapidDiagnostics?: RapidDiagnosticAction[];
  breakpointNotes?: BreakpointNote[];
  intrinsicResistance?: IntrinsicResistanceAlert[];
  coverageMatrix?: CoverageMatrixRow[];
  pearls?: string[];
  empiricTherapy?: EmpiricTier[];
  organismSpecific?: OrganismSpecific[];
  durationGuidance?: {
    standard: string;
    severe?: string;
    opatNote?: string;
    stewardshipNote?: string;
  };
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
  rapidDiagnosticResult?: "none" | "mrsa" | "mssa" | "esbl" | "kpc" | "mbl" | "dtr-pseudomonas";
  sourceControl?: "achieved" | "pending" | "not_applicable";
  bacteremiaConcern?: boolean;
  endovascularConcern?: boolean;
  activeMedications?: string[];
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

export type SubcategorySearchResult = Subcategory & {
  parentDisease: DiseaseState;
  matchType: "name" | "pearl" | "workflow" | "microbiology" | "empiric";
};

export type RegimenSearchResult = RegimenReference & {
  parentDisease: DiseaseState;
  parentSubcategory: Subcategory;
};

export interface SearchResult {
  diseases: DiseaseState[];
  drugs: DrugSearchResult[];
  organisms: OrganismSearchResult[];
  regimens: RegimenSearchResult[];
  subcategories: SubcategorySearchResult[];
}

export type RecentView =
  | { type: "disease"; diseaseId: string; label: string; meta: string; icon: string }
  | { type: "subcategory"; diseaseId: string; subcategoryId: string; label: string; meta: string; icon: string }
  | { type: "monograph"; diseaseId: string; monographId: string; label: string; meta: string; icon: string };

export type NavStateKey =
  | "home"
  | "disease_overview"
  | "subcategory"
  | "monograph"
  | "compare"
  | "audit"
  | "calculators";

export type NavigateToData = {
  disease?: { id: string } | null;
  diseaseId?: string | null;
  subcategory?: { id: string } | null;
  subcategoryId?: string | null;
  monograph?: { id: string } | null;
  monographId?: string | null;
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
