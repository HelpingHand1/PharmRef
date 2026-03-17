import type { DrugMonograph } from "../types";
import {
  AMOXICILLIN_EXECUTION_ENHANCEMENTS,
  AMPICILLIN_EXECUTION_ENHANCEMENTS,
  AMPICILLIN_SULBACTAM_EXECUTION_ENHANCEMENTS,
  AZITHROMYCIN_EXECUTION_ENHANCEMENTS,
  AZTREONAM_EXECUTION_ENHANCEMENTS,
  BEZLOTOXUMAB_EXECUTION_ENHANCEMENTS,
  CEFIDEROCOL_EXECUTION_ENHANCEMENTS,
  CEFAZOLIN_EXECUTION_ENHANCEMENTS,
  CEFTAZIDIME_AVIBACTAM_EXECUTION_ENHANCEMENTS,
  CEFTOLOZANE_TAZOBACTAM_EXECUTION_ENHANCEMENTS,
  CIPROFLOXACIN_EXECUTION_ENHANCEMENTS,
  CLINDAMYCIN_EXECUTION_ENHANCEMENTS,
  CEFTRIAXONE_EXECUTION_ENHANCEMENTS,
  COLISTIN_EXECUTION_ENHANCEMENTS,
  DAPTOMYCIN_EXECUTION_ENHANCEMENTS,
  DOXYCYCLINE_EXECUTION_ENHANCEMENTS,
  ERTAPENEM_EXECUTION_ENHANCEMENTS,
  FIDAXOMICIN_EXECUTION_ENHANCEMENTS,
  FLUCONAZOLE_EXECUTION_ENHANCEMENTS,
  FOSFOMYCIN_EXECUTION_ENHANCEMENTS,
  GENTAMICIN_EXECUTION_ENHANCEMENTS,
  IMIPENEM_CILASTATIN_RELEBACTAM_EXECUTION_ENHANCEMENTS,
  LEVOFLOXACIN_EXECUTION_ENHANCEMENTS,
  LIPOSOMAL_AMPHOTERICIN_B_EXECUTION_ENHANCEMENTS,
  METRONIDAZOLE_EXECUTION_ENHANCEMENTS,
  MEROPENEM_VABORBACTAM_EXECUTION_ENHANCEMENTS,
  MICAFUNGIN_EXECUTION_ENHANCEMENTS,
  MOXIFLOXACIN_EXECUTION_ENHANCEMENTS,
  NAFCILLIN_EXECUTION_ENHANCEMENTS,
  NITROFURANTOIN_EXECUTION_ENHANCEMENTS,
  POSACONAZOLE_EXECUTION_ENHANCEMENTS,
  RIFAMPIN_EXECUTION_ENHANCEMENTS,
  TEDIZOLID_EXECUTION_ENHANCEMENTS,
  TMP_SMX_EXECUTION_ENHANCEMENTS,
  VANCOMYCIN_ORAL_EXECUTION_ENHANCEMENTS,
  VORICONAZOLE_EXECUTION_ENHANCEMENTS,
} from "./execution-monograph-content";

export const CAP_MONOGRAPH_ENHANCEMENTS: Record<string, Partial<DrugMonograph>> = {
  amoxicillin: {
    ...AMOXICILLIN_EXECUTION_ENHANCEMENTS,
    penetration: [
      {
        site: "Lung / bronchial secretions",
        detail: "High-dose oral amoxicillin can achieve reliable lung exposure for susceptible pneumococcal CAP, but it does not solve atypical or beta-lactamase mediated gaps by penetration alone.",
      },
      {
        site: "Bloodstream",
        detail: "Serum exposure is adequate for susceptible community pathogens, but severe bacteremic pneumonia usually needs inpatient IV beta-lactam therapy rather than oral amoxicillin alone.",
      },
    ],
  },
  azithromycin: {
    ...AZITHROMYCIN_EXECUTION_ENHANCEMENTS,
    penetration: [
      {
        site: "Lung / epithelial lining fluid",
        detail: "Azithromycin concentrates heavily in respiratory tissue and epithelial lining fluid, which is why short courses can still cover atypical pulmonary pathogens.",
      },
      {
        site: "Intracellular compartment",
        detail: "Excellent intracellular entry supports activity against Legionella, Mycoplasma, and Chlamydophila despite modest serum concentrations.",
      },
      {
        site: "Bloodstream",
        detail: "Low serum levels are one reason azithromycin should not be the sole agent for severe pneumococcal or bacteremic CAP.",
      },
    ],
  },
  doxycycline: {
    ...DOXYCYCLINE_EXECUTION_ENHANCEMENTS,
    penetration: [
      {
        site: "Lung / intracellular compartment",
        detail: "Penetrates respiratory tissue and intracellular spaces well, supporting atypical CAP coverage and oral continuation once the patient stabilizes.",
      },
      {
        site: "Skin / soft tissue",
        detail: "Useful soft-tissue exposure helps when CAP overlap with skin MRSA colonization history complicates oral step-down planning.",
      },
      {
        site: "Urine",
        detail: "Urinary exposure is not dependable enough to make doxycycline a routine UTI agent even though it performs well in respiratory tissue.",
      },
    ],
  },
  moxifloxacin: {
    ...MOXIFLOXACIN_EXECUTION_ENHANCEMENTS,
    penetration: [
      {
        site: "Lung / epithelial lining fluid",
        detail: "Excellent lung penetration is the main reason moxifloxacin works as a respiratory fluoroquinolone for CAP.",
      },
      {
        site: "Sinus / respiratory tissue",
        detail: "High tissue exposure across the respiratory tract supports monotherapy when atypical and typical CAP pathogens both need coverage.",
      },
      {
        site: "Urine",
        detail: "Urinary exposure is weaker than ciprofloxacin or levofloxacin, so moxifloxacin should not be repurposed as the fluoroquinolone of choice for UTI.",
      },
    ],
  },
  "ampicillin-sulbactam": {
    ...AMPICILLIN_SULBACTAM_EXECUTION_ENHANCEMENTS,
    penetration: [
      {
        site: "Lung / aspiration tissue",
        detail: "Provides reliable exposure in aspiration pneumonia and mixed upper-airway inoculation where oral flora and streptococci matter.",
      },
      {
        site: "Pleural / soft tissue",
        detail: "Useful thoracic and adjacent soft-tissue penetration supports treatment when aspiration is complicated by empyema or necrotizing change after drainage.",
      },
      {
        site: "CSF",
        detail: "Central nervous system penetration is limited outside inflamed meninges, so it should not be treated as a meningitis beta-lactam.",
      },
    ],
  },
};

export const UTI_MONOGRAPH_ENHANCEMENTS: Record<string, Partial<DrugMonograph>> = {
  nitrofurantoin: {
    ...NITROFURANTOIN_EXECUTION_ENHANCEMENTS,
    penetration: [
      {
        site: "Urine / bladder lumen",
        detail: "Achieves very high urinary concentrations, which is why it works for cystitis despite minimal systemic exposure.",
      },
      {
        site: "Renal parenchyma",
        detail: "Kidney tissue exposure is poor, so nitrofurantoin should not be used for pyelonephritis or bacteremic UTI.",
      },
      {
        site: "Prostate",
        detail: "Prostatic penetration is unreliable, making it a poor prostatitis option even when the urine isolate appears susceptible.",
      },
    ],
  },
  "tmp-smx": {
    ...TMP_SMX_EXECUTION_ENHANCEMENTS,
    penetration: [
      {
        site: "Urine / renal parenchyma",
        detail: "High urinary and kidney tissue exposure supports use for pyelonephritis and oral step-down in susceptible Enterobacterales infection.",
      },
      {
        site: "Prostate",
        detail: "Excellent prostatic penetration is one of TMP-SMX's biggest advantages for bacterial prostatitis.",
      },
      {
        site: "Bone / soft tissue",
        detail: "Systemic tissue exposure is good enough to support selected oral step-down plans outside the urinary tract when susceptibility is confirmed.",
      },
    ],
  },
  fosfomycin: {
    ...FOSFOMYCIN_EXECUTION_ENHANCEMENTS,
    penetration: [
      {
        site: "Urine / bladder lumen",
        detail: "Produces very high urinary concentrations after oral dosing, making it a bladder-focused agent rather than a true systemic antibiotic.",
      },
      {
        site: "Renal parenchyma",
        detail: "Kidney tissue exposure is not reliable enough for pyelonephritis, septic obstruction, or bacteremia.",
      },
      {
        site: "Prostate",
        detail: "Some prostatic entry exists and supports off-label multidose use in selected cases, but it should not be treated as the default prostatitis workhorse.",
      },
    ],
  },
  ciprofloxacin: {
    ...CIPROFLOXACIN_EXECUTION_ENHANCEMENTS,
    penetration: [
      {
        site: "Urine / renal parenchyma",
        detail: "Excellent kidney and urinary tract exposure makes ciprofloxacin a strong oral step-down option when susceptibility is confirmed.",
      },
      {
        site: "Prostate",
        detail: "Prostatic penetration is excellent, supporting use in bacterial prostatitis when resistance and toxicity tradeoffs are acceptable.",
      },
      {
        site: "Bone / soft tissue",
        detail: "High oral bioavailability and tissue distribution also explain its role in selected gram-negative bone and deep-tissue step-down regimens.",
      },
    ],
  },
  ceftriaxone: {
    ...CEFTRIAXONE_EXECUTION_ENHANCEMENTS,
    penetration: [
      {
        site: "Urine / renal parenchyma",
        detail: "Provides strong bloodstream and renal parenchymal exposure for susceptible complicated UTI and bacteremic urinary-source infection.",
      },
      {
        site: "Biliary tract",
        detail: "Very high biliary penetration is clinically useful, but it does not substitute for agents with better prostatic or oral continuation profiles in UTI pathways.",
      },
      {
        site: "Prostate",
        detail: "Prostatic penetration is less dependable than fluoroquinolones or TMP-SMX, so ceftriaxone is often a bridge rather than the discharge agent for prostatitis.",
      },
    ],
  },
  levofloxacin: {
    ...LEVOFLOXACIN_EXECUTION_ENHANCEMENTS,
    penetration: [
      {
        site: "Urine / renal parenchyma",
        detail: "Strong urinary and kidney tissue exposure supports pyelonephritis treatment and oral bacteremic UTI step-down when susceptible.",
      },
      {
        site: "Prostate",
        detail: "Good prostatic penetration makes levofloxacin a common oral prostatitis option when safety and resistance concerns are addressed.",
      },
      {
        site: "Lung / epithelial lining fluid",
        detail: "The same tissue profile that helps in CAP explains why levofloxacin covers both respiratory and urinary syndromes well when the isolate is susceptible.",
      },
    ],
  },
};

export const SSTI_MONOGRAPH_ENHANCEMENTS: Record<string, Partial<DrugMonograph>> = {
  cefazolin: {
    ...CEFAZOLIN_EXECUTION_ENHANCEMENTS,
    penetration: [
      {
        site: "Skin / soft tissue",
        detail: "Reliable soft-tissue exposure makes cefazolin a core IV option for MSSA cellulitis and deep streptococcal infection.",
      },
      {
        site: "Bone / joint",
        detail: "Bone penetration is good enough for MSSA osteoarticular disease, especially once bacteremia clears and source control is in place.",
      },
      {
        site: "CSF",
        detail: "Central nervous system penetration is poor at standard dosing, so cefazolin should not be assumed to substitute for nafcillin or ceftriaxone in meningitis.",
      },
    ],
  },
  clindamycin: {
    ...CLINDAMYCIN_EXECUTION_ENHANCEMENTS,
    penetration: [
      {
        site: "Skin / abscess",
        detail: "Excellent soft-tissue and abscess penetration supports use in toxin-mediated SSTI and oral continuation when the organism is susceptible.",
      },
      {
        site: "Bone / joint",
        detail: "Bone exposure is among clindamycin's main strengths and helps explain its long history in osteomyelitis pathways.",
      },
      {
        site: "CSF",
        detail: "CSF penetration is poor, so its tissue profile should not tempt CNS use outside very unusual specialist scenarios.",
      },
    ],
  },
  daptomycin: {
    ...DAPTOMYCIN_EXECUTION_ENHANCEMENTS,
    penetration: [
      {
        site: "Bloodstream / endovascular space",
        detail: "High serum exposure supports bacteremia and right-sided endovascular infection treatment when rapid MRSA killing is needed.",
      },
      {
        site: "Bone / joint",
        detail: "Useful bone and biofilm-adjacent exposure supports osteoarticular MRSA treatment, especially in OPAT settings.",
      },
      {
        site: "Lung",
        detail: "Daptomycin is inactivated by pulmonary surfactant and should never be used for pneumonia regardless of in vitro susceptibility.",
      },
    ],
  },
};

export const IAI_MONOGRAPH_ENHANCEMENTS: Record<string, Partial<DrugMonograph>> = {
  metronidazole: {
    ...METRONIDAZOLE_EXECUTION_ENHANCEMENTS,
    penetration: [
      {
        site: "Peritoneal fluid / abscess",
        detail: "Excellent anaerobic abscess and peritoneal penetration is why metronidazole remains the classic anaerobe partner in intra-abdominal infection.",
      },
      {
        site: "CSF",
        detail: "Strong CNS penetration makes it useful when abdominal anaerobic infection overlaps with brain abscess risk.",
      },
      {
        site: "Oral vs IV systemic exposure",
        detail: "Oral bioavailability is essentially complete, so IV metronidazole rarely adds tissue penetration that the oral route cannot provide once gut absorption is reliable.",
      },
    ],
  },
  "ampicillin-sulbactam-iai": {
    ...AMPICILLIN_SULBACTAM_EXECUTION_ENHANCEMENTS,
    penetration: [
      {
        site: "Biliary tract",
        detail: "Useful biliary penetration supports cholecystitis and cholangitis pathways when local resistance still allows ampicillin-sulbactam to be active.",
      },
      {
        site: "Peritoneal fluid / soft tissue",
        detail: "Provides workable intra-abdominal soft-tissue exposure for community-type polymicrobial infection when source control is prompt.",
      },
      {
        site: "CSF",
        detail: "Central nervous system penetration is limited outside inflamed meninges, so it is not a meningitis substitute.",
      },
    ],
  },
  ertapenem: {
    ...ERTAPENEM_EXECUTION_ENHANCEMENTS,
    penetration: [
      {
        site: "Peritoneal fluid / biliary tract",
        detail: "Good peritoneal and biliary exposure supports once-daily treatment of community-acquired intra-abdominal infection when Pseudomonas is not a concern.",
      },
      {
        site: "Urine",
        detail: "Strong urinary exposure is an added advantage when intra-abdominal and urinary source questions overlap.",
      },
      {
        site: "CSF",
        detail: "CNS penetration is not dependable enough to make ertapenem a routine meningitis carbapenem.",
      },
    ],
  },
};

export const BACTEREMIA_ENDOCARDITIS_MONOGRAPH_ENHANCEMENTS: Record<string, Partial<DrugMonograph>> = {
  nafcillin: {
    ...NAFCILLIN_EXECUTION_ENHANCEMENTS,
    penetration: [
      {
        site: "Bloodstream / endocardium",
        detail: "High serum exposure and rapid MSSA killing make nafcillin a dependable endovascular drug when frequent dosing is operationally feasible.",
      },
      {
        site: "Bone / joint",
        detail: "Bone penetration is adequate for MSSA osteoarticular disease, although cefazolin is often operationally easier.",
      },
      {
        site: "CSF",
        detail: "With inflamed meninges, CNS penetration is better than cefazolin, which is why nafcillin remains the beta-lactam fallback for MSSA meningitis.",
      },
    ],
  },
  vancomycin: {
    penetration: [
      {
        site: "Bloodstream / endocardium",
        detail: "Endovascular exposure is reliable only when AUC targets are achieved early and source control is moving in parallel.",
      },
      {
        site: "Bone / joint",
        detail: "Bone penetration is serviceable but slower than clinicians often expect, so persistent osteoarticular MRSA disease should trigger source review rather than dose escalation alone.",
      },
      {
        site: "CSF",
        detail: "Inflamed meninges improve CSF entry, but CNS use still requires higher exposure and close toxicity monitoring.",
      },
    ],
  },
  daptomycin: {
    ...DAPTOMYCIN_EXECUTION_ENHANCEMENTS,
    penetration: [
      {
        site: "Bloodstream / endocardial vegetations",
        detail: "Strong serum exposure and concentration-dependent killing support MRSA bacteremia and right-sided endocarditis treatment.",
      },
      {
        site: "Bone / joint",
        detail: "Useful bone and hardware-adjacent exposure supports osteomyelitis and prosthetic infection pathways when MRSA activity is needed.",
      },
      {
        site: "Lung",
        detail: "It remains inactive in the lung because surfactant binds and inactivates the drug.",
      },
    ],
  },
  ceftriaxone: {
    ...CEFTRIAXONE_EXECUTION_ENHANCEMENTS,
    penetration: [
      {
        site: "Bloodstream / urine",
        detail: "Reliable serum and urinary exposure make ceftriaxone a common anchor for susceptible Enterobacterales bacteremia and urinary-source bloodstream infection.",
      },
      {
        site: "CSF",
        detail: "At meningitis dosing, ceftriaxone reaches therapeutic CSF concentrations and remains a core CNS beta-lactam.",
      },
      {
        site: "Biliary tract",
        detail: "Very high biliary penetration is a strength, but it can also complicate interpretation when biliary sludge or pseudocholelithiasis appears during prolonged therapy.",
      },
    ],
  },
  cefazolin: {
    ...CEFAZOLIN_EXECUTION_ENHANCEMENTS,
    penetration: [
      {
        site: "Bloodstream / endocardium",
        detail: "High serum exposure supports MSSA bacteremia and endocarditis treatment in most patients with less operational burden than nafcillin.",
      },
      {
        site: "Bone / joint",
        detail: "Bone penetration is reliable and makes cefazolin a workhorse for MSSA osteoarticular infection.",
      },
      {
        site: "CSF",
        detail: "CSF penetration is limited compared with nafcillin or ceftriaxone, so it is not the usual beta-lactam for MSSA meningitis.",
      },
    ],
  },
};

export const BONE_JOINT_MONOGRAPH_ENHANCEMENTS: Record<string, Partial<DrugMonograph>> = {
  rifampin: {
    ...RIFAMPIN_EXECUTION_ENHANCEMENTS,
    penetration: [
      {
        site: "Biofilm / hardware surface",
        detail: "Excellent biofilm penetration is rifampin's signature advantage in prosthetic joint infection and retained hardware scenarios.",
      },
      {
        site: "Bone / joint",
        detail: "Tissue entry is useful, but rifampin should only be used with a companion drug because monotherapy rapidly selects resistance.",
      },
      {
        site: "Intracellular compartment",
        detail: "Good intracellular entry helps when staphylococci are embedded in tissue or device-adjacent inflammatory debris.",
      },
    ],
  },
  linezolid: {
    penetration: [
      {
        site: "Bone / joint",
        detail: "Excellent bone and joint exposure plus oral equivalence make linezolid a practical step-down option for selected gram-positive osteoarticular infection.",
      },
      {
        site: "Soft tissue",
        detail: "Soft-tissue penetration is strong enough to support combined bone and overlying wound infection treatment when toxicity is being monitored.",
      },
      {
        site: "Lung",
        detail: "The same lung penetration advantage seen in MRSA pneumonia is one reason linezolid remains attractive when bone and pulmonary gram-positive disease overlap.",
      },
    ],
  },
};

export const AMR_GN_MONOGRAPH_ENHANCEMENTS: Record<string, Partial<DrugMonograph>> = {
  "ceftazidime-avibactam": {
    ...CEFTAZIDIME_AVIBACTAM_EXECUTION_ENHANCEMENTS,
    penetration: [
      {
        site: "Lung / epithelial lining fluid",
        detail: "Pulmonary penetration is adequate for resistant gram-negative pneumonia when full-dose prolonged-infusion strategies are used.",
      },
      {
        site: "Urine",
        detail: "High urinary exposure makes it especially useful for CRE or DTR phenotypes presenting as complicated UTI or urinary-source bacteremia.",
      },
      {
        site: "CSF",
        detail: "CNS use is possible in selected inflamed-meninges cases, but evidence is limited enough that specialist input is still important.",
      },
    ],
  },
  "meropenem-vaborbactam": {
    ...MEROPENEM_VABORBACTAM_EXECUTION_ENHANCEMENTS,
    penetration: [
      {
        site: "Urine",
        detail: "Very strong urinary exposure is one reason meropenem-vaborbactam performs well in KPC urinary-source infection.",
      },
      {
        site: "Lung / epithelial lining fluid",
        detail: "Pulmonary exposure is adequate for KPC pneumonia when high-dose q8h extended infusion is used.",
      },
      {
        site: "CSF",
        detail: "Data for CNS infection are much thinner than for standard meropenem, so it should not be assumed interchangeable in meningitis without expert review.",
      },
    ],
  },
  cefiderocol: {
    ...CEFIDEROCOL_EXECUTION_ENHANCEMENTS,
    penetration: [
      {
        site: "Lung / epithelial lining fluid",
        detail: "Lung penetration is clinically usable for MDR gram-negative pneumonia, but preserving the 3-hour infusion workflow is essential.",
      },
      {
        site: "Urine",
        detail: "Renal elimination produces strong urinary exposure, making cefiderocol a plausible option for susceptible resistant urinary syndromes.",
      },
      {
        site: "Deep tissue / bone",
        detail: "Site data outside urine and lung are thinner, so deep-seated infection should prompt especially careful source-control and follow-up planning.",
      },
    ],
  },
};

export const CDI_MONOGRAPH_ENHANCEMENTS: Record<string, Partial<DrugMonograph>> = {
  fidaxomicin: {
    ...FIDAXOMICIN_EXECUTION_ENHANCEMENTS,
    penetration: [
      {
        site: "Colon lumen",
        detail: "Extremely high intraluminal colonic concentrations with minimal systemic absorption are exactly why fidaxomicin works so well for CDI while sparing the microbiome more than vancomycin.",
      },
      {
        site: "Systemic / extraintestinal sites",
        detail: "Negligible systemic exposure means fidaxomicin should not be expected to treat extraintestinal C. difficile or other invasive infection.",
      },
    ],
  },
  "vancomycin-oral": {
    ...VANCOMYCIN_ORAL_EXECUTION_ENHANCEMENTS,
    penetration: [
      {
        site: "Colon lumen",
        detail: "Oral vancomycin achieves very high stool and colonic lumen concentrations and remains a direct local therapy for CDI rather than a systemic anti-MRSA strategy.",
      },
      {
        site: "Systemic circulation",
        detail: "Systemic absorption is usually minimal, though severe colitis or renal dysfunction can increase exposure enough to matter for toxicity monitoring.",
      },
      {
        site: "Distal colon during ileus",
        detail: "When ileus prevents oral drug delivery to the diseased colon, rectal vancomycin is added because oral capsules alone may not reach the distal lumen reliably.",
      },
    ],
  },
  bezlotoxumab: {
    ...BEZLOTOXUMAB_EXECUTION_ENHANCEMENTS,
    penetration: [
      {
        site: "Intravascular / interstitial space",
        detail: "Bezlotoxumab circulates systemically and neutralizes toxin B after it crosses injured mucosa; its value is toxin control, not antibacterial killing.",
      },
      {
        site: "Colon lumen",
        detail: "It does not create useful luminal antibiotic concentrations, so it cannot replace fidaxomicin or oral vancomycin for active CDI treatment.",
      },
    ],
  },
  metronidazole: {
    ...METRONIDAZOLE_EXECUTION_ENHANCEMENTS,
    penetration: [
      {
        site: "Colon tissue via systemic route",
        detail: "IV metronidazole reaches inflamed colonic tissue through the bloodstream, which is why it still has a role as adjunctive therapy in fulminant CDI with ileus.",
      },
      {
        site: "Peritoneal fluid / abscess",
        detail: "Excellent anaerobic tissue penetration remains one of metronidazole's main strengths outside CDI.",
      },
      {
        site: "CSF",
        detail: "Strong CNS penetration is clinically important when anaerobic infection extends beyond the abdomen.",
      },
    ],
  },
};

export const CNS_INFECTIONS_MONOGRAPH_ENHANCEMENTS: Record<string, Partial<DrugMonograph>> = {
  ampicillin: {
    ...AMPICILLIN_EXECUTION_ENHANCEMENTS,
    penetration: [
      {
        site: "CSF with inflamed meninges",
        detail: "Therapeutic CSF penetration during meningeal inflammation is what makes ampicillin essential for Listeria coverage.",
      },
      {
        site: "Bloodstream",
        detail: "Good serum exposure supports the bacteremic component of invasive listeriosis while CNS therapy is being delivered.",
      },
      {
        site: "Urine",
        detail: "Urinary exposure is strong, but its CNS role depends on meningeal inflammation and high-dose scheduling rather than renal elimination alone.",
      },
    ],
  },
  meropenem: {
    penetration: [
      {
        site: "CSF with inflamed meninges",
        detail: "At 2 g q8h standard infusion, meropenem can achieve therapeutic CSF levels for many susceptible CNS pathogens.",
      },
      {
        site: "Brain / abscess-adjacent tissue",
        detail: "Useful brain tissue exposure supports treatment of postoperative or gram-negative brain abscess syndromes when source control is also happening.",
      },
      {
        site: "Lung / abdomen outside CNS",
        detail: "Outside meningitis, the same molecule distributes well to lung and intra-abdominal sites, but the preferred infusion strategy changes once CNS penetration becomes the goal.",
      },
    ],
  },
};

export const FUNGAL_INFECTIONS_MONOGRAPH_ENHANCEMENTS: Record<string, Partial<DrugMonograph>> = {
  fluconazole: {
    ...FLUCONAZOLE_EXECUTION_ENHANCEMENTS,
    penetration: [
      {
        site: "CSF",
        detail: "Excellent CSF penetration is one of fluconazole's signature advantages for cryptococcal and selected Candida CNS infection pathways.",
      },
      {
        site: "Urine",
        detail: "High urinary concentrations make fluconazole the azole with the clearest role in susceptible Candida urinary tract infection.",
      },
      {
        site: "Eye / vitreous",
        detail: "Ocular penetration is good enough to support step-down in susceptible candidemia with ocular involvement once the patient is otherwise stable.",
      },
    ],
  },
  micafungin: {
    ...MICAFUNGIN_EXECUTION_ENHANCEMENTS,
    penetration: [
      {
        site: "Bloodstream / liver",
        detail: "Strong serum and hepatobiliary tissue exposure make micafungin an excellent candidemia and hepatosplenic candidiasis anchor.",
      },
      {
        site: "Urine",
        detail: "Urinary concentrations are poor, so echinocandins are not preferred for Candida cystitis when urine is the real source.",
      },
      {
        site: "CSF / eye",
        detail: "Penetration into the CNS and vitreous is limited, so step-down to another agent is usually needed when those sites are involved.",
      },
    ],
  },
  voriconazole: {
    ...VORICONAZOLE_EXECUTION_ENHANCEMENTS,
    penetration: [
      {
        site: "Lung",
        detail: "Excellent lung penetration supports its central role in invasive pulmonary aspergillosis.",
      },
      {
        site: "CSF / brain",
        detail: "Good CNS penetration is one reason voriconazole is favored over many other mold-active azoles when brain involvement is suspected.",
      },
      {
        site: "Eye / vitreous",
        detail: "Ocular penetration is clinically useful in mold or Candida eye disease when susceptibility and toxicity are being monitored closely.",
      },
      {
        site: "Urine",
        detail: "Urinary exposure is poor, so voriconazole should not be expected to treat fungal lower-tract urine infection.",
      },
    ],
  },
  "amphotericin-b": {
    ...LIPOSOMAL_AMPHOTERICIN_B_EXECUTION_ENHANCEMENTS,
    penetration: [
      {
        site: "Reticuloendothelial / deep tissue sites",
        detail: "Liposomal amphotericin B distributes broadly into deep tissues and remains a backbone for severe disseminated fungal infection.",
      },
      {
        site: "CSF / brain",
        detail: "CNS penetration is not as elegant as fluconazole or voriconazole, but high-dose liposomal amphotericin B is still used for cryptococcal and mold CNS disease because of broad fungicidal activity.",
      },
      {
        site: "Urine",
        detail: "Urinary concentrations are limited with the liposomal formulation, so it is not the same urinary antifungal as fluconazole.",
      },
    ],
  },
};

export const ADVANCED_AGENTS_MONOGRAPH_ENHANCEMENTS: Record<string, Partial<DrugMonograph>> = {
  gentamicin: {
    ...GENTAMICIN_EXECUTION_ENHANCEMENTS,
    penetration: [
      {
        site: "Urine / renal cortex",
        detail: "Very high urinary and renal cortical concentrations support pyelonephritis and gram-negative urinary-source synergy strategies.",
      },
      {
        site: "Lung",
        detail: "Pulmonary penetration is poor, which is why gentamicin should not be relied on as pneumonia monotherapy.",
      },
      {
        site: "CSF",
        detail: "Systemic CSF penetration is minimal; CNS use generally requires intrathecal or intraventricular administration if it is used at all.",
      },
    ],
  },
  aztreonam: {
    ...AZTREONAM_EXECUTION_ENHANCEMENTS,
    penetration: [
      {
        site: "Urine",
        detail: "Strong urinary exposure supports aztreonam use in susceptible gram-negative UTI when beta-lactam allergy limits options.",
      },
      {
        site: "Lung",
        detail: "Pulmonary penetration is usable for gram-negative pneumonia, though it usually functions as a targeted niche agent rather than a broad empiric anchor.",
      },
      {
        site: "CSF",
        detail: "Inflamed meninges allow some CSF entry, but aztreonam is not the usual first-line CNS beta-lactam.",
      },
    ],
  },
  "ceftolozane-tazobactam": {
    ...CEFTOLOZANE_TAZOBACTAM_EXECUTION_ENHANCEMENTS,
    penetration: [
      {
        site: "Lung / epithelial lining fluid",
        detail: "Adequate pulmonary penetration at the pneumonia dose and infusion strategy is one reason it is useful for resistant Pseudomonas pneumonia.",
      },
      {
        site: "Urine",
        detail: "High urinary exposure supports use in cUTI caused by susceptible MDR gram-negative pathogens.",
      },
      {
        site: "CSF",
        detail: "CNS experience is limited enough that it should not be assumed to cover meningitis simply because the isolate is susceptible.",
      },
    ],
  },
  "imipenem-cilastatin-relebactam": {
    ...IMIPENEM_CILASTATIN_RELEBACTAM_EXECUTION_ENHANCEMENTS,
    penetration: [
      {
        site: "Lung / epithelial lining fluid",
        detail: "Pulmonary exposure is sufficient for susceptible resistant gram-negative pneumonia when full-dose q6h therapy is used.",
      },
      {
        site: "Urine",
        detail: "Renal elimination produces strong urinary exposure, making it useful in resistant cUTI and urinary-source bacteremia.",
      },
      {
        site: "CSF",
        detail: "CNS use is not a strength because seizure liability and limited data make other carbapenems easier choices for meningitis.",
      },
    ],
  },
  colistin: {
    ...COLISTIN_EXECUTION_ENHANCEMENTS,
    penetration: [
      {
        site: "Urine",
        detail: "When given as colistimethate, renal excretion can produce clinically useful urinary concentrations for highly resistant lower-tract infection.",
      },
      {
        site: "Lung",
        detail: "IV colistin alone gives variable lung exposure, which is why inhaled adjunct therapy is often considered for severe MDR pneumonia.",
      },
      {
        site: "CSF",
        detail: "Systemic CSF penetration is poor, so intrathecal or intraventricular therapy may be required when no better CNS-active option exists.",
      },
    ],
  },
  tedizolid: {
    ...TEDIZOLID_EXECUTION_ENHANCEMENTS,
    penetration: [
      {
        site: "Skin / soft tissue",
        detail: "Excellent soft-tissue exposure supports once-daily treatment of gram-positive skin infection.",
      },
      {
        site: "Lung",
        detail: "Pulmonary penetration is good enough to make tedizolid biologically interesting for pneumonia, even though routine HAP use remains limited.",
      },
      {
        site: "Bone / joint",
        detail: "Bone penetration is reasonable, but the clinical experience is still thinner than with linezolid for long osteoarticular courses.",
      },
    ],
  },
  posaconazole: {
    ...POSACONAZOLE_EXECUTION_ENHANCEMENTS,
    penetration: [
      {
        site: "Lung / deep tissue",
        detail: "Good lung and tissue penetration supports prophylaxis and treatment roles in invasive mold disease, especially when Mucorales coverage is needed.",
      },
      {
        site: "CSF / brain",
        detail: "CNS exposure is variable and generally less predictable than voriconazole, so brain infection needs careful drug-level and outcome review.",
      },
      {
        site: "Urine",
        detail: "Urinary concentrations are poor, so posaconazole is not the azole to reach for in fungal UTI.",
      },
    ],
  },
  "liposomal-amphotericin-b": {
    ...LIPOSOMAL_AMPHOTERICIN_B_EXECUTION_ENHANCEMENTS,
    penetration: [
      {
        site: "Reticuloendothelial / deep tissue sites",
        detail: "Broad tissue distribution is one reason liposomal amphotericin B remains the fallback for severe mold and disseminated fungal disease.",
      },
      {
        site: "CSF / brain",
        detail: "CNS entry is imperfect but clinically meaningful enough to support use in cryptococcal and mold CNS infection when paired with the right companion regimen.",
      },
      {
        site: "Urine",
        detail: "Urinary concentrations are limited with the liposomal formulation, so lower-tract fungal infection may need another agent when susceptibility allows.",
      },
    ],
  },
};
