import type { DiseaseState } from "../types";
import { attachDiseaseMetadata } from "./metadata";
import { DISEASE_CATALOG } from "./catalog-manifest";

const diseaseLoaders: Record<string, () => Promise<DiseaseState>> = {
  uti: () => import("./uti").then((module) => module.UTI),
  cap: () => import("./cap").then((module) => module.CAP),
  "hap-vap": () => import("./hap-vap").then((module) => module.HAP_VAP),
  ssti: () => import("./ssti").then((module) => module.SSTI),
  iai: () => import("./iai").then((module) => module.IAI),
  "amr-gn": () => import("./amr-gram-negative").then((module) => module.AMR_GN),
  "bacteremia-endocarditis": () => import("./bacteremia-endocarditis").then((module) => module.BACTEREMIA_ENDOCARDITIS),
  "c-difficile": () => import("./c-difficile").then((module) => module.CDI),
  "bone-joint": () => import("./bone-joint").then((module) => module.BONE_JOINT),
  "cns-infections": () => import("./cns-infections").then((module) => module.CNS_INFECTIONS),
  "fungal-infections": () => import("./fungal-infections").then((module) => module.default),
  "advanced-agents": () => import("./advanced-agents").then((module) => module.ADVANCED_AGENTS),
  "febrile-neutropenia": () => import("./febrile-neutropenia").then((module) => module.FEBRILE_NEUTROPENIA),
  "diabetic-foot": () => import("./diabetic-foot").then((module) => module.DIABETIC_FOOT),
  sepsis: () => import("./sepsis").then((module) => module.SEPSIS),
};

const diseaseCache = new Map<string, Promise<DiseaseState | null>>();

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
