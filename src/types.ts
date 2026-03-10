import type { Dispatch, ReactNode, SetStateAction } from "react";

export interface ContentSource {
  kind: "guideline" | "trial" | "consensus" | "review";
  label: string;
  citation: string;
  url?: string;
}

export type ContentConfidence = "high" | "moderate" | "emerging";

export interface ContentMeta {
  lastReviewed: string;
  confidence: ContentConfidence;
  guidelineVersion?: string;
  sources: ContentSource[];
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
    keyGuidelines: Array<{ name: string; detail: string }>;
    landmarkTrials: Array<{ name: string; detail: string }>;
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
  options: Array<{
    regimen: string;
    notes?: string;
    drug?: string;
    evidence?: string;
    evidenceSource?: string;
  }>;
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
}

export interface MonographCatalogSummary {
  id: string;
  name: string;
  drugClass: string;
  parentDiseaseId: string;
  parentDiseaseName: string;
}

export interface PatientContext {
  weight?: number;
  height?: number;
  age?: number;
  sex?: "male" | "female";
  scr?: number;
  dialysis?: "none" | "HD" | "PD" | "CRRT";
  pregnant?: boolean;
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
  matchType: "name" | "pearl" | "empiric";
};

export interface SearchResult {
  diseases: DiseaseState[];
  drugs: DrugSearchResult[];
  organisms: OrganismSearchResult[];
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
  removeAllergy: (name: string) => void;
}

export interface AllergyWarningProps {
  drugId: string;
  allergies: AllergyRecord[];
  S: Styles;
}

export interface AuditViewProps {
  diseaseStates: DiseaseState[];
  findMonograph: (drugId: string) => MonographLookupResult | null;
  S: Styles;
}

export interface CompareViewProps {
  drugs: MonographLookupResult[];
  compareItems: string[];
  setCompareItems: Dispatch<SetStateAction<string[]>>;
  allMonographs: MonographCatalogSummary[];
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

export interface EmpiricTierViewProps {
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
