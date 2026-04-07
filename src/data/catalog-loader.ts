import type { DiseaseState } from "../types";
import { attachDiseaseMetadata } from "./metadata";
import { DISEASE_CATALOG } from "./catalog-manifest";
import type { RegimenCatalogData } from "./regimen-catalog";

const diseaseLoaders: Record<string, () => Promise<DiseaseState>> = {
  uti: () => import("./generated/diseases/uti").then((module) => module.UTI),
  cap: () => import("./generated/diseases/cap").then((module) => module.CAP),
  "hap-vap": () => import("./generated/diseases/hap-vap").then((module) => module.HAP_VAP),
  ssti: () => import("./generated/diseases/ssti").then((module) => module.SSTI),
  iai: () => import("./generated/diseases/iai").then((module) => module.IAI),
  "c-difficile": () => import("./generated/diseases/c-difficile").then((module) => module.CDI),
  "bone-joint": () => import("./generated/diseases/bone-joint").then((module) => module.BONE_JOINT),
  "cns-infections": () => import("./generated/diseases/cns-infections").then((module) => module.CNS_INFECTIONS),
  "fungal-infections": () => import("./generated/diseases/fungal-infections").then((module) => module.FUNGAL_INFECTIONS),
  "advanced-agents": () => import("./generated/diseases/advanced-agents").then((module) => module.ADVANCED_AGENTS),
  "febrile-neutropenia": () => import("./generated/diseases/febrile-neutropenia").then((module) => module.FEBRILE_NEUTROPENIA),
  "diabetic-foot": () => import("./generated/diseases/diabetic-foot").then((module) => module.DIABETIC_FOOT),
  t2dm: () => import("./generated/diseases/t2dm").then((module) => module.T2DM),
  "amr-gn": () => import("./generated/diseases/amr-gram-negative").then((module) => module.AMR_GN),
  "bacteremia-endocarditis": () => import("./generated/diseases/bacteremia-endocarditis").then((module) => module.BACTEREMIA_ENDOCARDITIS),
  sepsis: () => import("./generated/diseases/sepsis").then((module) => module.SEPSIS),
};

const diseaseCache = new Map<string, Promise<DiseaseState | null>>();
let regimenCatalogPromise: Promise<RegimenCatalogData> | null = null;

export function loadDisease(diseaseId: string): Promise<DiseaseState | null> {
  const loader = diseaseLoaders[diseaseId];
  if (!loader) {
    return Promise.resolve(null);
  }

  if (!diseaseCache.has(diseaseId)) {
    diseaseCache.set(
      diseaseId,
      loader().then((disease) => attachDiseaseMetadata(disease)),
    );
  }

  return diseaseCache.get(diseaseId)!;
}

export async function loadAllDiseases(): Promise<DiseaseState[]> {
  const loaded = await Promise.all(DISEASE_CATALOG.map((disease) => loadDisease(disease.id)));
  return loaded.filter((disease): disease is DiseaseState => disease !== null);
}

export function loadRegimenCatalog(): Promise<RegimenCatalogData> {
  if (!regimenCatalogPromise) {
    regimenCatalogPromise = import("./generated/regimen-catalog").then((module) => ({
      regimens: module.REGIMEN_CATALOG,
      xrefByMonographId: module.REGIMEN_XREF_BY_MONOGRAPH_ID,
    }));
  }

  return regimenCatalogPromise;
}
