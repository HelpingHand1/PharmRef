import type { DiseaseState } from "../types";
import { UTI } from "./uti";
import { CAP } from "./cap";
import { HAP_VAP } from "./hap-vap";
import { SSTI } from "./ssti";
import { IAI } from "./iai";
import { AMR_GN } from "./amr-gram-negative";
import { BACTEREMIA_ENDOCARDITIS } from "./bacteremia-endocarditis";
import { CDI } from "./c-difficile";
import { BONE_JOINT } from "./bone-joint";
import { CNS_INFECTIONS } from "./cns-infections";
import FUNGAL_INFECTIONS from "./fungal-infections";

export const DISEASE_STATES: DiseaseState[] = [
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
  FUNGAL_INFECTIONS
];
