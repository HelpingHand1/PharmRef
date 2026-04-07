import type { DiseaseState } from "../types";
import { UTI } from "./generated/diseases/uti";
import { CAP } from "./generated/diseases/cap";
import { HAP_VAP } from "./generated/diseases/hap-vap";
import { SSTI } from "./generated/diseases/ssti";
import { IAI } from "./generated/diseases/iai";
import { CDI } from "./generated/diseases/c-difficile";
import { BONE_JOINT } from "./generated/diseases/bone-joint";
import { CNS_INFECTIONS } from "./generated/diseases/cns-infections";
import { FUNGAL_INFECTIONS } from "./generated/diseases/fungal-infections";
import { ADVANCED_AGENTS } from "./generated/diseases/advanced-agents";
import { FEBRILE_NEUTROPENIA } from "./generated/diseases/febrile-neutropenia";
import { DIABETIC_FOOT } from "./generated/diseases/diabetic-foot";
import { T2DM } from "./generated/diseases/t2dm";
import { AMR_GN } from "./generated/diseases/amr-gram-negative";
import { BACTEREMIA_ENDOCARDITIS } from "./generated/diseases/bacteremia-endocarditis";
import { SEPSIS } from "./generated/diseases/sepsis";
import { attachDiseaseMetadata } from "./metadata";

const RAW_DISEASE_STATES: DiseaseState[] = [
  UTI,
  CAP,
  HAP_VAP,
  SSTI,
  IAI,
  AMR_GN,
  BACTEREMIA_ENDOCARDITIS,
  CDI,
  BONE_JOINT,
  CNS_INFECTIONS,
  FUNGAL_INFECTIONS,
  ADVANCED_AGENTS,
  FEBRILE_NEUTROPENIA,
  DIABETIC_FOOT,
  T2DM,
  SEPSIS,
];

export const DISEASE_STATES: DiseaseState[] = RAW_DISEASE_STATES.map((disease) => attachDiseaseMetadata(disease));
