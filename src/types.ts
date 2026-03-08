import type { Dispatch, ReactNode, SetStateAction } from "react";

export interface DiseaseState {
  id: string;
  name: string;
  icon: string;
  category: string;
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

export interface Subcategory {
  id: string;
  name: string;
  definition: string;
  clinicalPresentation?: string;
  diagnostics?: string;
  pearls?: string[];
  empiricTherapy?: EmpiricTier[];
  organismSpecific?: OrganismSpecific[];
}

export interface EmpiricTier {
  line: string;
  options: Array<{
    regimen: string;
    notes?: string;
    drug?: string;
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
}

export interface AllergyRecord {
  name: string;
  severity: string;
}

export interface MonographLookupResult {
  monograph: DrugMonograph;
  disease: DiseaseState;
}

export type NavStateKey =
  | "home"
  | "disease_overview"
  | "subcategory"
  | "monograph"
  | "compare"
  | "audit";

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
  theme: "dark" | "light";
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
  allMonographs: DrugMonograph[];
  ExpandCollapseBar: () => ReactNode;
  S: Styles;
}

export interface CrossRefBadgesProps {
  drugId: string;
  currentDiseaseId?: string;
  monographXref: Record<string, DiseaseState[]>;
  navigateTo: (state: NavStateKey, data?: Partial<MonographLookupResult> & { subcategory?: Subcategory }) => void;
  showToast: (message: string, icon?: string) => void;
  currentDrugName: string;
  S: Styles;
}

export interface EmpiricTierViewProps {
  tier: EmpiricTier;
  S: Styles;
  navigateTo: (state: NavStateKey, data?: Partial<MonographLookupResult> & { subcategory?: Subcategory }) => void;
  findMonograph: (drugId: string) => MonographLookupResult | null;
  copiedId: string | null;
  onCopy: (text: string, id: string) => void;
  allergies: AllergyRecord[];
}

export interface DisclaimerModalProps {
  S: Styles;
}
