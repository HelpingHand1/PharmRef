import type { ContentConfidence, ContentMeta, ContentReviewEntry, ContentSource } from "../../types";
import { CONTENT_REVIEWED_ON } from "../../version";
import { DEFAULT_CONTENT_REVIEWER } from "../review-defaults";

export type ContentMetaSeed = Omit<ContentMeta, "reviewedBy" | "reviewScope" | "reviewHistory" | "governance"> &
  Partial<Pick<ContentMeta, "reviewedBy" | "reviewScope" | "reviewHistory">> & {
    owner?: string;
  };

function buildSource(id: string, citation: string, note?: string): ContentSource {
  return note === undefined ? { id, citation } : { id, citation, note };
}

function review(summary: string, reviewedOn = CONTENT_REVIEWED_ON, reviewedBy = DEFAULT_CONTENT_REVIEWER): ContentReviewEntry {
  return { reviewedOn, reviewedBy, summary };
}

const REVIEW_SUMMARIES = {
  uti: "Reviewed 2025 cUTI reclassification, shorter-course recommendations, and IV-to-PO bacteremic UTI guidance.",
  cap: "Reviewed outpatient and inpatient CAP regimen selection, STEP short-course data, and severe CAP steroid updates.",
  "hap-vap": "Reviewed HAP/VAP empiric coverage, resistant gram-negative escalation, and ICU stewardship framing.",
  ssti: "Reviewed purulent and nonpurulent SSTI pathways, MRSA coverage boundaries, and oral step-down strategy.",
  iai: "Reviewed source-control-first IAI management, biliary coverage boundaries, and short-course post-control durations.",
  "amr-gn": "Reviewed IDSA AMR mechanism-based therapy, carbapenem-sparing strategy, and extended-infusion beta-lactam use.",
  "bacteremia-endocarditis": "Reviewed bloodstream infection duration, endocarditis evaluation, and oral or OPAT transition criteria.",
  "c-difficile": "Reviewed CDI severity stratification, fidaxomicin preference, and recurrence-prevention escalation.",
  "bone-joint": "Reviewed osteomyelitis and prosthetic-joint step-down strategy, source control, and OVIVA-aligned oral therapy.",
  "cns-infections": "Reviewed meningitis and ventriculitis empiric therapy, adjunctive dexamethasone use, and CNS diagnostic priorities.",
  "fungal-infections": "Reviewed candidiasis and aspergillosis first-line agents, salvage roles, and therapeutic monitoring priorities.",
  "advanced-agents": "Reviewed reserve-agent positioning for resistant gram-negatives and stewardship boundaries for novel therapies.",
  "febrile-neutropenia": "Reviewed high-risk febrile neutropenia initial coverage, escalation triggers, and outpatient risk stratification.",
  "diabetic-foot": "Reviewed diabetic foot severity staging, debridement and perfusion priorities, and osteomyelitis step-down options.",
  sepsis: "Reviewed early sepsis antimicrobials, resistant-risk stratification, and shorter-course de-escalation evidence.",
  "amr-gn/esbl-e": "Reviewed ESBL empiric boundaries, carbapenem preference, and oral step-down cautions.",
  "amr-gn/cre-kpc": "Reviewed KPC-CRE preferred BL/BLI therapy and definitive selection criteria.",
  "amr-gn/cre-mbl": "Reviewed MBL-CRE salvage strategy, aztreonam combination use, and cefiderocol role.",
  "amr-gn/dtr-pa": "Reviewed DTR Pseudomonas susceptibility-based escalation and newer beta-lactam positioning.",
  "amr-gn/crab-steno": "Reviewed CRAB and Stenotrophomonas combination strategies and limited-agent stewardship.",
  "advanced-agents/cre-management": "Reviewed mechanism-specific CRE agent selection across KPC, OXA, and MBL phenotypes.",
  "advanced-agents/mdr-pseudomonas": "Reviewed advanced agent positioning for MDR Pseudomonas and susceptibility-guided de-escalation.",
  "febrile-neutropenia/high-risk-fn": "Reviewed initial anti-pseudomonal coverage and inpatient escalation thresholds for high-risk febrile neutropenia.",
  "febrile-neutropenia/fn-with-fungal-risk": "Reviewed persistent-fever fungal evaluation triggers, imaging strategy, and empiric mold coverage.",
  "bacteremia-endocarditis/sab-workup": "Reviewed S. aureus bacteremia bundle elements, repeat-culture timing, and echocardiography triggers.",
  "bacteremia-endocarditis/native-valve-ie": "Reviewed native-valve endocarditis diagnostic criteria, surgical triggers, and oral step-down boundaries.",
  "bacteremia-endocarditis/prosthetic-valve-ie": "Reviewed prosthetic-valve endocarditis adjunctive therapy risks and multidisciplinary surgical timing.",
  "bacteremia-endocarditis/gram-negative-bacteremia": "Reviewed uncomplicated gram-negative bacteremia duration evidence and IV-to-PO transition criteria.",
  "bacteremia-endocarditis/opat-considerations": "Reviewed OPAT eligibility, monitoring burden, and complications that should block outpatient therapy.",
  "sepsis/sepsis-community": "Reviewed community-onset sepsis empiric framing and early narrowing after source clarification.",
  "sepsis/sepsis-hcap": "Reviewed healthcare-exposure resistance risk, broader empiric coverage boundaries, and de-escalation triggers.",
  "sepsis/septic-shock": "Reviewed septic shock antimicrobial timing, hemodynamic support references, and post-control de-escalation.",
  "ceftazidime-avibactam": "Reviewed KPC-CRE positioning, definitive-use boundaries, and outcome data for deep-seated infection.",
  "meropenem-vaborbactam": "Reviewed KPC-CRE efficacy data, definitive-use positioning, and cUTI registration support.",
  cefiderocol: "Reviewed salvage use in MBL and resistant gram-negative infections and outcome-signal cautions.",
  aztreonam: "Reviewed aztreonam use in MBL pairing strategies, allergy-driven selection, and key spectrum gaps.",
  "ceftolozane-tazobactam": "Reviewed DTR Pseudomonas positioning, pulmonary data, and exposure-driven dosing considerations.",
  "imipenem-cilastatin-relebactam": "Reviewed relebactam use in resistant Pseudomonas and KPC-CRE with comparative outcome data.",
  colistin: "Reviewed nephrotoxicity-limited salvage role and reasons to prefer newer agents when available.",
  tedizolid: "Reviewed off-label stewardship limits, skin-structure data, and prolonged-use uncertainty.",
  posaconazole: "Reviewed prophylaxis indications, salvage therapy role, and therapeutic drug monitoring targets.",
  "liposomal-amphotericin-b": "Reviewed invasive mold and mucormycosis role with renal and electrolyte monitoring priorities.",
  vancomycin: "Reviewed AUC-guided dosing, bacteremia and endocarditis roles, and nephrotoxicity mitigation.",
  daptomycin: "Reviewed high-dose SAB and endocarditis use, salvage combinations, and monitoring priorities.",
  cefazolin: "Reviewed MSSA bacteremia role, inoculum-effect caveats, and beta-lactam comparative outcomes.",
  nafcillin: "Reviewed anti-staphylococcal penicillin use in deep MSSA infection and OPAT tolerability tradeoffs.",
  ceftriaxone: "Reviewed streptococcal endocarditis and bloodstream infection role with once-daily OPAT advantages.",
} as const;

type ReviewSummaryKey = keyof typeof REVIEW_SUMMARIES;

function withConfidence(
  confidence: ContentConfidence,
  reviewKey: ReviewSummaryKey,
  meta: Omit<ContentMetaSeed, "confidence" | "reviewHistory"> & Partial<Pick<ContentMetaSeed, "reviewHistory">>,
): ContentMetaSeed {
  const reviewedBy = meta.reviewedBy ?? DEFAULT_CONTENT_REVIEWER;
  return {
    confidence,
    ...meta,
    reviewHistory: meta.reviewHistory ?? [review(REVIEW_SUMMARIES[reviewKey], meta.lastReviewed, reviewedBy)],
  };
}

export const DISEASE_CONTENT_META: Record<string, ContentMetaSeed> = {
  uti: withConfidence("high", "uti", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "IDSA 2025 cUTI guidance",
    sources: [
      buildSource("idsa-2025-cuti", "Infectious Diseases Society of America complicated UTI guidance, 2025."),
      buildSource("idsa-escmid-2011-uti", "International Clinical Practice Guidelines for uncomplicated cystitis and pyelonephritis, 2011."),
      buildSource("eau-2024-uti", "European Association of Urology UTI guidance, 2024."),
    ],
  }),
  cap: withConfidence("high", "cap", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "ATS/IDSA 2019 CAP guidance",
    sources: [
      buildSource("ats-idsa-2019-cap", "Adult community-acquired pneumonia guideline from ATS and IDSA, 2019."),
      buildSource("cape-cod", "Hydrocortisone for severe CAP, NEJM 2023."),
      buildSource("el-moussaoui-2006-short-course-cap", "Three-day versus eight-day amoxicillin strategy after early clinical stability in adult CAP, BMJ 2006."),
    ],
  }),
  "hap-vap": withConfidence("moderate", "hap-vap", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "ATS/IDSA 2016 HAP/VAP guidance",
    sources: [
      buildSource("ats-idsa-2016-hap-vap", "Hospital-acquired and ventilator-associated pneumonia guideline, 2016."),
      buildSource("idsa-2024-amr", "Antimicrobial resistance guidance used for resistant gram-negative escalation decisions, 2024."),
      buildSource("smart-trial", "Balanced crystalloids versus saline in ICU patients, NEJM 2018."),
    ],
  }),
  ssti: withConfidence("moderate", "ssti", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "IDSA SSTI guidance",
    sources: [
      buildSource("idsa-2014-ssti", "Skin and soft tissue infection guidance from IDSA."),
      buildSource("idsa-2024-amr", "Resistant organism escalation guidance, 2024."),
      buildSource("oviva", "Oral versus intravenous antibiotics for bone and joint and deep infection pathways, NEJM 2019."),
    ],
  }),
  iai: withConfidence("moderate", "iai", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "SIS/IDSA intra-abdominal infection guidance",
    sources: [
      buildSource("idsa-sis-2010-ciai", "IDSA/SIS 2010 guideline for diagnosis and management of complicated intra-abdominal infection."),
      buildSource("sis-2017-ciai", "Surgical Infection Society 2017 revised guidance for intra-abdominal infection."),
      buildSource("tokyo-guidelines", "Biliary and cholecystitis/cholangitis guidance used for source-control framing."),
      buildSource("stop-it", "Short-course antimicrobial therapy for source-controlled intra-abdominal infection, NEJM 2015."),
    ],
  }),
  "amr-gn": withConfidence("high", "amr-gn", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "IDSA 2024 AMR guidance",
    sources: [
      buildSource("idsa-2024-amr", "Guidance for ESBL-E, CRE, DTR Pseudomonas, and resistant Acinetobacter, 2024."),
      buildSource("merino", "Piperacillin-tazobactam versus meropenem for ESBL bacteremia, JAMA 2018."),
      buildSource("pkpd-stewardship", "Extended-infusion beta-lactam stewardship principles used throughout resistant gram-negative pathways."),
    ],
  }),
  "bacteremia-endocarditis": withConfidence("high", "bacteremia-endocarditis", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "ESC 2023 + AHA 2015 IE guidance",
    sources: [
      buildSource("esc-2023-ie", "Current European infective endocarditis guideline update, 2023."),
      buildSource("aha-2015-ie", "Foundational AHA scientific statement for adult infective endocarditis, 2015."),
      buildSource("poet", "Partial oral treatment of endocarditis, NEJM 2019."),
      buildSource("arrest", "Adjunctive rifampin for Staphylococcus aureus bacteremia, Lancet 2018."),
    ],
  }),
  "c-difficile": withConfidence("high", "c-difficile", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "IDSA/SHEA CDI guidance",
    sources: [
      buildSource("idsa-shea-cdi", "Clostridioides difficile infection guideline from IDSA and SHEA."),
      buildSource("fidaxomicin-trials", "Registration and recurrence-reduction trials informing fidaxomicin preference."),
      buildSource("fmt-stewardship", "Evidence base for fecal microbiota transplant in multiply recurrent CDI."),
    ],
  }),
  "bone-joint": withConfidence("moderate", "bone-joint", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "OVIVA-informed bone and joint guidance",
    sources: [
      buildSource("oviva", "Oral versus intravenous antibiotics for bone and joint infection, NEJM 2019."),
      buildSource("idsa-2013-pji", "IDSA prosthetic joint infection guideline used for surgical strategy and hardware retention decisions."),
      buildSource("orthopedic-id-review", "Orthopedic infection source-control and step-down stewardship literature."),
    ],
  }),
  "cns-infections": withConfidence("moderate", "cns-infections", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "IDSA CNS infection guidance",
    sources: [
      buildSource("idsa-2004-bacterial-meningitis", "IDSA bacterial meningitis guideline for community-acquired disease."),
      buildSource("idsa-2017-ventriculitis-meningitis", "IDSA healthcare-associated ventriculitis and meningitis guideline."),
      buildSource("idsa-2008-encephalitis", "IDSA encephalitis guideline used for diagnostic framing and early empiric antiviral therapy."),
      buildSource("dexamethasone-meningitis", "Adjunctive dexamethasone trials informing pneumococcal meningitis care."),
    ],
  }),
  "fungal-infections": withConfidence("moderate", "fungal-infections", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "IDSA 2016 candidiasis and aspergillosis guidance",
    sources: [
      buildSource("idsa-candidiasis", "Clinical practice guideline for candidiasis, IDSA 2016."),
      buildSource("idsa-aspergillosis", "Diagnosis and management of aspergillosis, IDSA 2016."),
      buildSource("secure-trial", "Isavuconazole versus voriconazole for invasive aspergillosis, Lancet 2016."),
    ],
  }),
  "advanced-agents": withConfidence("emerging", "advanced-agents", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "IDSA 2022-2024 resistant pathogen guidance",
    sources: [
      buildSource("idsa-2024-amr", "Guidance for CRE, ESBL-E, DTR Pseudomonas, and resistant gram-negatives."),
      buildSource("aspect-cuti-ciai", "Ceftolozane-tazobactam cUTI and cIAI registration data."),
      buildSource("aspect-np", "Ceftolozane-tazobactam nosocomial pneumonia phase 3 data."),
      buildSource("restore-imi", "Imipenem-cilastatin-relebactam versus polymyxin-based therapy."),
    ],
  }),
  "febrile-neutropenia": withConfidence("moderate", "febrile-neutropenia", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "IDSA febrile neutropenia guidance",
    sources: [
      buildSource("idsa-febrile-neutropenia", "Guideline for evaluation and management of febrile neutropenia in cancer patients."),
      buildSource("nccn-fever-neutropenia", "NCCN references for risk stratification and outpatient eligibility."),
      buildSource("mascc-risk-index", "MASCC risk index used for outpatient eligibility and early disposition."),
      buildSource("cisne-score", "CISNE score used to refine low-risk classification in clinically stable solid-tumor outpatients."),
    ],
  }),
  "diabetic-foot": withConfidence("moderate", "diabetic-foot", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "IWGDF/IDSA diabetic foot guidance",
    sources: [
      buildSource("iwgdf-idsa-dfi", "Diabetic foot infection guidance from IWGDF and IDSA."),
      buildSource("lazaro-martinez-2014-dfi-osteomyelitis", "Probe-to-bone and imaging-supported management strategy for suspected diabetic foot osteomyelitis."),
      buildSource("iwgdf-2023-wound-classification", "Wound classification and perfusion framing used to guide source control, limb threat staging, and debridement urgency."),
    ],
  }),
  sepsis: withConfidence("high", "sepsis", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "SSC 2021 + Sepsis-3 + BALANCE 2024",
    sources: [
      buildSource("ssc-2021", "Surviving Sepsis Campaign international guidelines, 2021."),
      buildSource("sepsis-3", "Consensus definitions and diagnostic framework for sepsis and septic shock, JAMA 2016."),
      buildSource("balance", "Seven versus fourteen days for bloodstream infection, 2024."),
    ],
  }),
};

export const SUBCATEGORY_CONTENT_META: Record<string, ContentMetaSeed> = {
  "amr-gn/esbl-e": withConfidence("high", "amr-gn/esbl-e", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "IDSA 2024 ESBL-E guidance",
    sources: [
      buildSource("idsa-2024-amr", "Guidance for ESBL-producing Enterobacterales, including preferred carbapenem use and oral step-down cautions, 2024."),
      buildSource("merino", "Piperacillin-tazobactam versus meropenem for ESBL bloodstream infection, JAMA 2018."),
      buildSource("pkpd-stewardship", "Extended-infusion beta-lactam principles applied to ESBL-E severe infection management."),
    ],
  }),
  "amr-gn/cre-kpc": withConfidence("high", "amr-gn/cre-kpc", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "IDSA 2024 KPC-CRE guidance",
    sources: [
      buildSource("idsa-2024-amr", "Preferred beta-lactam/beta-lactamase inhibitor strategy for KPC-producing CRE, 2024."),
      buildSource("tango-ii", "Meropenem-vaborbactam versus best available therapy for CRE infections, 2018."),
      buildSource("reprise", "Ceftazidime-avibactam activity in resistant gram-negative infections, phase 3 data."),
    ],
    whatChanged: [
      "Added rapid-diagnostic steps tying KPC confirmation directly to reserve-agent selection.",
      "Added breakpoint interpretation notes for ceftazidime-avibactam and meropenem-vaborbactam.",
    ],
    sectionConfidence: [
      {
        section: "Preferred therapy sequencing",
        confidence: "high",
        rationale: "IDSA 2024 and comparative KPC data consistently support novel beta-lactam/BLI therapy over polymyxin-era regimens.",
      },
      {
        section: "Resistance emergence comparisons",
        confidence: "moderate",
        rationale: "The signal favoring meropenem-vaborbactam over ceftazidime-avibactam is real but driven mostly by observational datasets.",
      },
    ],
    guidelineDisagreements: [
      {
        topic: "First-choice KPC agent when all are susceptible",
        guidanceA: "IDSA 2024 slightly favors meropenem-vaborbactam over ceftazidime-avibactam and imipenem-cilastatin-relebactam.",
        guidanceB: "Many institutions operationally treat the three agents as near-equivalent and default to whichever reaches the patient fastest.",
        pharmacistTakeaway: "Do not delay active therapy over a ranking nuance; start an active KPC agent promptly, then refine once logistics and prior exposure are reviewed.",
      },
    ],
  }),
  "amr-gn/cre-mbl": withConfidence("moderate", "amr-gn/cre-mbl", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "IDSA 2024 MBL-CRE guidance",
    sources: [
      buildSource("idsa-2024-amr", "Aztreonam plus avibactam-based strategy and cefiderocol considerations for MBL producers, 2024."),
      buildSource("falcone-2021-caz-avi-aztreonam", "Clinical outcomes supporting ceftazidime-avibactam plus aztreonam for MBL-producing Enterobacterales."),
      buildSource("credible-cr", "Cefiderocol data in carbapenem-resistant gram-negative infections."),
    ],
    whatChanged: [
      "Added rapid-diagnostic actions for MBL confirmation and combo-testing workflow.",
      "Added explicit warning that aztreonam monotherapy remains unreliable despite apparent in vitro activity.",
    ],
    sectionConfidence: [
      {
        section: "Ceftazidime-avibactam plus aztreonam strategy",
        confidence: "moderate",
        rationale: "Supported by strong mechanistic logic and growing observational data, but still lacks large randomized trials.",
      },
      {
        section: "Cefiderocol fallback or bridge role",
        confidence: "moderate",
        rationale: "Useful and guideline-endorsed, though resistance emergence and limited phenotype-specific trial data keep certainty below high.",
      },
    ],
    guidelineDisagreements: [
      {
        topic: "Preferred first-line option for serious MBL-CRE",
        guidanceA: "IDSA 2024 lists ceftazidime-avibactam plus aztreonam and cefiderocol as preferred options.",
        guidanceB: "Many stewardship programs operationally favor ceftazidime-avibactam plus aztreonam first when synchronized co-administration is feasible.",
        pharmacistTakeaway: "Use the combo-first approach when your lab and infusion workflow can support it; cefiderocol remains an important alternative when they cannot.",
      },
    ],
  }),
  "amr-gn/dtr-pa": withConfidence("moderate", "amr-gn/dtr-pa", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "IDSA 2024 DTR Pseudomonas guidance",
    sources: [
      buildSource("idsa-2024-amr", "Preferred newer beta-lactams and susceptibility-based escalation framework for DTR Pseudomonas, 2024."),
      buildSource("aspect-np", "Ceftolozane-tazobactam for nosocomial pneumonia including resistant Pseudomonas."),
      buildSource("restore-imi", "Imipenem-cilastatin-relebactam versus colistin-based therapy for imipenem-nonsusceptible infections."),
    ],
    whatChanged: [
      "Added rapid-diagnostic actions separating MBL-positive DTR Pseudomonas from the broader reserve-beta-lactam group.",
      "Added dose-interpretation callouts clarifying when the pneumonia exposure should be used.",
    ],
    sectionConfidence: [
      {
        section: "Use of traditional extended-infusion beta-lactams before reserve agents",
        confidence: "high",
        rationale: "This hierarchy is stable across IDSA guidance and stewardship practice.",
      },
      {
        section: "Novel-agent sequencing within true DTR Pseudomonas",
        confidence: "moderate",
        rationale: "Local mechanism prevalence drives a meaningful part of the ranking, so portability across institutions is limited.",
      },
    ],
    guidelineDisagreements: [
      {
        topic: "Ceftolozane-tazobactam versus ceftazidime-avibactam as the default reserve beta-lactam",
        guidanceA: "IDSA 2024 treats several newer agents as acceptable depending on susceptibility and mechanism.",
        guidanceB: "Many hospitals still promote one as a local first-look agent based on their novel-antibiogram data.",
        pharmacistTakeaway: "Trust local susceptibility data over generic brand familiarity when both drugs are active.",
      },
    ],
  }),
  "amr-gn/crab-steno": withConfidence("emerging", "amr-gn/crab-steno", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "IDSA 2024 CRAB/Stenotrophomonas guidance",
    sources: [
      buildSource("idsa-2024-amr", "Guidance for CRAB and Stenotrophomonas with emphasis on combination therapy and selective use of newer agents, 2024."),
      buildSource("attack", "Sulbactam-durlobactam versus colistin for Acinetobacter baumannii-calcoaceticus complex infection, 2023."),
      buildSource("credible-cr", "Cefiderocol resistant gram-negative outcomes including Acinetobacter subgroup concerns."),
    ],
    whatChanged: [
      "Added explicit breakpoint warnings for Stenotrophomonas ceftazidime reporting and CRAB susceptibility workflow.",
      "Added intrinsic-resistance callouts clarifying why carbapenems should come off once Stenotrophomonas is the target.",
    ],
    sectionConfidence: [
      {
        section: "Sulbactam-durlobactam as preferred CRAB therapy",
        confidence: "moderate",
        rationale: "The signal is strong and practice-changing, but the evidence base is still much smaller than for common syndromes.",
      },
      {
        section: "Combination framing for severe Stenotrophomonas infection",
        confidence: "emerging",
        rationale: "Most recommendations are mechanistic and observational rather than trial-driven.",
      },
    ],
    guidelineDisagreements: [
      {
        topic: "How aggressively to combine cefiderocol in CRAB",
        guidanceA: "IDSA 2024 discourages cefiderocol monotherapy and favors combination framing for CRAB.",
        guidanceB: "Some clinicians still individualize toward monotherapy late in therapy if cultures clear and no second active agent remains.",
        pharmacistTakeaway: "Start with combination thinking for CRAB and only simplify with specialist review after clear clinical improvement.",
      },
    ],
  }),
  "advanced-agents/cre-management": withConfidence("moderate", "advanced-agents/cre-management", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "Advanced CRE agent review 2024",
    sources: [
      buildSource("idsa-2024-amr", "Agent selection across KPC, OXA, and MBL resistance mechanisms."),
      buildSource("tango-ii", "Meropenem-vaborbactam comparative data in CRE infections."),
      buildSource("reprise", "Ceftazidime-avibactam resistant gram-negative treatment data."),
    ],
    whatChanged: [
      "Added mechanism-based rapid-diagnostic cues and a phenotype coverage matrix.",
      "Added explicit breakpoint guidance reinforcing MIC and carbapenemase-driven interpretation.",
    ],
    sectionConfidence: [
      {
        section: "Mechanism-specific CRE agent selection",
        confidence: "high",
        rationale: "This is now the dominant organizing principle across modern CRE guidance.",
      },
      {
        section: "Salvage sequencing once first-choice novel agents fail",
        confidence: "moderate",
        rationale: "Evidence remains limited and often center-specific after first-line options are exhausted.",
      },
    ],
  }),
  "advanced-agents/mdr-pseudomonas": withConfidence("moderate", "advanced-agents/mdr-pseudomonas", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "Advanced DTR Pseudomonas agent review 2024",
    sources: [
      buildSource("idsa-2024-amr", "Mechanism-aware DTR Pseudomonas escalation strategy."),
      buildSource("aspect-np", "Ceftolozane-tazobactam pulmonary efficacy data."),
      buildSource("restore-imi", "Imipenem-cilastatin-relebactam data for imipenem-resistant Pseudomonas."),
    ],
    whatChanged: [
      "Added rapid-diagnostic actions separating MBL-positive isolates from the broader reserve-agent bucket.",
      "Added susceptibility-matrix language that makes local antibiogram differences explicit.",
    ],
    sectionConfidence: [
      {
        section: "Reserve-beta-lactam role in true DTR Pseudomonas",
        confidence: "moderate",
        rationale: "The category is well supported, but head-to-head sequencing is still heavily shaped by local susceptibility patterns.",
      },
      {
        section: "Polymyxin fallback role",
        confidence: "high",
        rationale: "There is broad agreement that toxicity and poorer outcomes push polymyxins into late salvage status.",
      },
    ],
  }),
  "febrile-neutropenia/high-risk-fn": withConfidence("high", "febrile-neutropenia/high-risk-fn", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "IDSA/NCCN high-risk FN guidance",
    sources: [
      buildSource("idsa-febrile-neutropenia", "High-risk inpatient febrile neutropenia management and initial anti-pseudomonal coverage."),
      buildSource("nccn-fever-neutropenia", "Risk-based escalation and antifungal trigger guidance."),
      buildSource("mascc-risk-index", "MASCC risk index used to identify patients who should not be managed as low risk."),
      buildSource("cisne-score", "CISNE score used to avoid outpatient classification in clinically stable but higher-risk solid-tumor patients."),
    ],
  }),
  "febrile-neutropenia/fn-with-fungal-risk": withConfidence("moderate", "febrile-neutropenia/fn-with-fungal-risk", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "Persistent FN fungal-risk guidance",
    sources: [
      buildSource("idsa-febrile-neutropenia", "Persistent fever evaluation and empiric antifungal thresholds."),
      buildSource("idsa-aspergillosis", "Diagnostic and treatment framing for invasive mold infection."),
      buildSource("galactomannan-ct-strategy", "High-resolution CT and serial biomarker literature in prolonged neutropenia."),
    ],
  }),
  "bacteremia-endocarditis/sab-workup": withConfidence("high", "bacteremia-endocarditis/sab-workup", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "SAB workup and IE-screening review",
    sources: [
      buildSource("aha-2015-ie", "Imaging, blood culture clearance, and infective endocarditis workup standards relevant to S. aureus bacteremia."),
      buildSource("arrest", "Adjunctive rifampin trial reinforcing the need for disciplined SAB management and source control, Lancet 2018."),
      buildSource("holland-2014-sab-review", "Diagnostic workup, complication screening, and management standards for S. aureus bacteremia."),
    ],
  }),
  "bacteremia-endocarditis/native-valve-ie": withConfidence("high", "bacteremia-endocarditis/native-valve-ie", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "ESC 2023 / AHA 2015 native-valve IE guidance",
    sources: [
      buildSource("esc-2023-ie", "Current diagnostic and treatment recommendations for native-valve infective endocarditis."),
      buildSource("poet", "Partial oral treatment strategy in stabilized left-sided infective endocarditis, NEJM 2019."),
      buildSource("kang-2012-early-surgery", "Randomized data supporting early surgery in selected left-sided infective endocarditis."),
    ],
  }),
  "bacteremia-endocarditis/prosthetic-valve-ie": withConfidence("moderate", "bacteremia-endocarditis/prosthetic-valve-ie", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "ESC 2023 / AHA 2015 prosthetic-valve IE guidance",
    sources: [
      buildSource("esc-2023-ie", "Guidance for prosthetic-valve endocarditis, surgery triggers, and organism-directed therapy."),
      buildSource("prosthetic-valve-ie-literature", "Observational evidence and surgical literature for prosthetic-valve endocarditis."),
      buildSource("rifampin-gentamicin-stewardship", "Evidence reassessment for adjunctive rifampin and aminoglycosides in prosthetic-valve IE."),
    ],
  }),
  "bacteremia-endocarditis/gram-negative-bacteremia": withConfidence("high", "bacteremia-endocarditis/gram-negative-bacteremia", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "Modern uncomplicated GNB duration review",
    sources: [
      buildSource("balance", "Seven versus fourteen days for bloodstream infection, 2024."),
      buildSource("yahav-short-course-gnb", "Seven versus fourteen days for uncomplicated gram-negative bacteremia, 2019."),
      buildSource("oral-stepdown-bacteremia", "IV-to-oral transition and source-specific duration literature for uncomplicated gram-negative bacteremia."),
    ],
  }),
  "bacteremia-endocarditis/opat-considerations": withConfidence("moderate", "bacteremia-endocarditis/opat-considerations", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "OPAT stewardship review 2024",
    sources: [
      buildSource("esc-2023-ie", "Outpatient treatment considerations and follow-up needs for stabilized endocarditis and bacteremia."),
      buildSource("poet", "Selective oral step-down model for stable endocarditis patients."),
      buildSource("opat-stewardship", "Monitoring, line-care, and adverse-event prevention literature for outpatient parenteral therapy."),
    ],
  }),
  "sepsis/sepsis-community": withConfidence("high", "sepsis/sepsis-community", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "SSC 2021 + community sepsis stewardship review",
    sources: [
      buildSource("ssc-2021", "Early sepsis recognition, antibiotics, and hemodynamic management."),
      buildSource("balance", "Shorter-course bloodstream infection data informing duration once source control is achieved."),
      buildSource("clovers", "Fluid strategy data after initial sepsis resuscitation, NEJM 2023."),
    ],
  }),
  "sepsis/sepsis-hcap": withConfidence("moderate", "sepsis/sepsis-hcap", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "SSC 2021 + AMR risk-informed sepsis stewardship",
    sources: [
      buildSource("ssc-2021", "Core septic shock bundle and timing recommendations."),
      buildSource("idsa-2024-amr", "Mechanism-aware resistant-pathogen treatment guidance relevant to healthcare-associated sepsis."),
      buildSource("cdc-amr-threats-2019", "US resistant-pathogen epidemiology supporting healthcare-associated resistant-gram-negative risk assessment."),
    ],
  }),
  "sepsis/septic-shock": withConfidence("high", "sepsis/septic-shock", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "SSC 2021 septic shock guidance",
    sources: [
      buildSource("ssc-2021", "Septic shock bundles, vasopressor targets, and early antimicrobial recommendations."),
      buildSource("clovers", "Restrictive versus liberal fluids after initial resuscitation in sepsis, NEJM 2023."),
      buildSource("balance", "Shorter-course bloodstream infection data informing de-escalation once source control is achieved, 2024."),
    ],
  }),
};

export const MONOGRAPH_CONTENT_META: Record<string, ContentMetaSeed> = {
  "ceftazidime-avibactam": withConfidence("moderate", "ceftazidime-avibactam", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "KPC-CRE and resistant Enterobacterales data",
    sources: [
      buildSource("idsa-2024-amr", "Preferred use for KPC-producing CRE and other select resistant gram-negative infections."),
      buildSource("reprise", "Phase 3 ceftazidime-avibactam data in ceftazidime-resistant gram-negative infections."),
      buildSource("kpc-observational-outcomes", "Real-world outcomes literature in bloodstream and deep-seated KPC infections."),
    ],
    whatChanged: [
      "Added rapid-diagnostic direction for KPC/OXA-48 use versus mandatory aztreonam pairing in MBL infections.",
      "Added susceptibility notes around resistance emergence and repeat-culture triggers.",
    ],
    sectionConfidence: [
      {
        section: "KPC and OXA-48 activity",
        confidence: "high",
        rationale: "Supported by guideline consensus and extensive clinical use.",
      },
      {
        section: "Resistance-emergence management",
        confidence: "moderate",
        rationale: "Well described, but the best rescue sequence after failure still depends on repeat susceptibility patterns.",
      },
    ],
    guidelineDisagreements: [
      {
        topic: "How early to reserve ceftazidime-avibactam for narrower indications",
        guidanceA: "Some stewardship programs reserve it aggressively because of resistance-emergence concerns.",
        guidanceB: "Others use it broadly for any susceptible KPC or OXA-48 isolate because bedside familiarity is high.",
        pharmacistTakeaway: "Use it confidently when mechanism and susceptibility support it, but keep prior exposure and local preservation goals visible.",
      },
    ],
  }),
  "meropenem-vaborbactam": withConfidence("moderate", "meropenem-vaborbactam", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "KPC-CRE beta-lactam/BLI data",
    sources: [
      buildSource("idsa-2024-amr", "Preferred KPC-producing CRE therapy when susceptible."),
      buildSource("tango-ii", "Comparative meropenem-vaborbactam outcomes versus best available therapy for CRE infections."),
      buildSource("tango-i", "Registration data for complicated urinary tract infection."),
    ],
    whatChanged: [
      "Added KPC-focused rapid-diagnostic guidance and explicit noncoverage warnings for OXA-48 and MBL phenotypes.",
      "Added infusion and breakpoint interpretation notes tied to the KPC-specific role of vaborbactam.",
    ],
    sectionConfidence: [
      {
        section: "KPC-CRE preferred role",
        confidence: "high",
        rationale: "Supported by guideline preference and relatively strong comparative data.",
      },
      {
        section: "Use beyond KPC",
        confidence: "moderate",
        rationale: "Theoretical activity does not translate into dependable clinical positioning outside KPC-driven infection.",
      },
    ],
  }),
  cefiderocol: withConfidence("emerging", "cefiderocol", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "Cefiderocol resistant gram-negative evidence review",
    sources: [
      buildSource("idsa-2024-amr", "Selective use in MBL producers and salvage scenarios."),
      buildSource("credible-cr", "Pathogen-specific outcomes and mortality signal discussion in CR infections."),
      buildSource("apeks-np", "Nosocomial pneumonia noninferiority data including resistant gram-negative organisms."),
    ],
    whatChanged: [
      "Added rapid-diagnostic cues for MBL rescue use and CRAB combination framing.",
      "Added ARC dosing and prolonged-infusion interpretation notes.",
    ],
    sectionConfidence: [
      {
        section: "Role in MBL-producing Enterobacterales",
        confidence: "moderate",
        rationale: "Guideline support is solid, but trial data remain smaller than for more established syndromes.",
      },
      {
        section: "Role in CRAB",
        confidence: "emerging",
        rationale: "CREDIBLE-CR created enough uncertainty that clinicians still individualize heavily around this phenotype.",
      },
    ],
    guidelineDisagreements: [
      {
        topic: "How early cefiderocol should be used in CRAB",
        guidanceA: "Some experts hold cefiderocol for later salvage because of the mortality signal.",
        guidanceB: "Others use it earlier in combination when few active agents are available.",
        pharmacistTakeaway: "Use combination framing, document why alternatives are inadequate, and reassess quickly with repeat cultures.",
      },
    ],
  }),
  aztreonam: withConfidence("moderate", "aztreonam", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "Aztreonam MBL-pairing and allergy-use review",
    sources: [
      buildSource("idsa-2024-amr", "Mechanism-aware aztreonam pairing for MBL-producing gram-negative infection."),
      buildSource("falcone-2021-caz-avi-aztreonam", "Clinical outcomes supporting ceftazidime-avibactam plus aztreonam."),
      buildSource("clsi-breakpoint-updates", "Breakpoint and combo-testing updates relevant to aztreonam-based MBL strategies."),
    ],
    whatChanged: [
      "Added rapid-diagnostic direction for aztreonam use inside avibactam-containing MBL regimens.",
      "Added explicit spectrum-gap and ceftazidime side-chain interpretation notes.",
    ],
    sectionConfidence: [
      {
        section: "Role in MBL combination therapy",
        confidence: "moderate",
        rationale: "Mechanistically strong and increasingly supported, but still not backed by large randomized trials.",
      },
      {
        section: "Allergy-driven use as a stand-alone beta-lactam",
        confidence: "high",
        rationale: "The gram-negative-only allergy niche is well established and stable.",
      },
    ],
  }),
  "ceftolozane-tazobactam": withConfidence("moderate", "ceftolozane-tazobactam", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "DTR Pseudomonas targeted beta-lactam data",
    sources: [
      buildSource("idsa-2024-amr", "Preferred use for difficult-to-treat Pseudomonas when susceptible."),
      buildSource("aspect-np", "Phase 3 HAP/VAP data with resistant Pseudomonas representation."),
      buildSource("aspect-cuti-ciai", "Registration studies informing dosing and exposure targets."),
    ],
    whatChanged: [
      "Added rapid-diagnostic triggers for MBL exclusion before use.",
      "Added dose-interpretation language separating serious-infection exposure from the smaller cUTI/cIAI regimen.",
    ],
    sectionConfidence: [
      {
        section: "Role in non-MBL DTR Pseudomonas",
        confidence: "high",
        rationale: "This is a stable and guideline-concordant use case.",
      },
      {
        section: "Use in non-Pseudomonas resistant phenotypes",
        confidence: "moderate",
        rationale: "The drug can be active in some ESBL settings, but stewardship generally discourages spending it there.",
      },
    ],
  }),
  "imipenem-cilastatin-relebactam": withConfidence("moderate", "imipenem-cilastatin-relebactam", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "Relebactam resistant Pseudomonas and CRE data",
    sources: [
      buildSource("idsa-2024-amr", "Mechanism-based use in select KPC and DTR Pseudomonas isolates."),
      buildSource("restore-imi", "Comparative outcomes versus colistin-based therapy in imipenem-nonsusceptible infections."),
      buildSource("restore-imi-2", "Nosocomial pneumonia data for imipenem-cilastatin-relebactam."),
    ],
    whatChanged: [
      "Added rapid-diagnostic positioning for KPC-CRE and non-MBL DTR Pseudomonas.",
      "Added mechanism-based noncoverage warnings for OXA-48 and MBL phenotypes.",
    ],
    sectionConfidence: [
      {
        section: "Use in DTR Pseudomonas",
        confidence: "moderate",
        rationale: "Good supportive data exist, but local susceptibility patterns still shape the real-world ranking against other reserve agents.",
      },
      {
        section: "Use in KPC-CRE",
        confidence: "moderate",
        rationale: "A valid option, though it is usually not the first ranked KPC agent when meropenem-vaborbactam or ceftazidime-avibactam are available.",
      },
    ],
  }),
  colistin: withConfidence("emerging", "colistin", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "Colistin salvage-use evidence review",
    sources: [
      buildSource("idsa-2024-amr", "Reserve role due to nephrotoxicity and inferior outcomes when newer agents are available."),
      buildSource("aida", "Colistin-based combination therapy data in carbapenem-resistant gram-negative infection."),
      buildSource("polymyxin-toxicity", "Nephrotoxicity and PK limitations of polymyxins in critically ill patients."),
    ],
  }),
  tedizolid: withConfidence("emerging", "tedizolid", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "Tedizolid stewardship evidence review",
    sources: [
      buildSource("absssi-labeling-stewardship", "Evidence base is strongest in skin/soft tissue infection rather than invasive MRSA infection."),
      buildSource("establish", "Tedizolid versus linezolid for acute bacterial skin and skin-structure infection."),
      buildSource("long-course-tedizolid", "Limited observational data for prolonged use outside labeled indications."),
    ],
  }),
  posaconazole: withConfidence("moderate", "posaconazole", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "Posaconazole prophylaxis and salvage-use data",
    sources: [
      buildSource("idsa-aspergillosis", "Role in prophylaxis and salvage therapy for invasive mold disease."),
      buildSource("cornely-2007-posaconazole", "Posaconazole prophylaxis superiority in prolonged neutropenia and AML/MDS induction."),
      buildSource("therapeutic-drug-monitoring", "Exposure targets and formulation-specific PK guidance."),
    ],
  }),
  "liposomal-amphotericin-b": withConfidence("moderate", "liposomal-amphotericin-b", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "L-AmB invasive fungal infection guidance",
    sources: [
      buildSource("idsa-candidiasis", "Role in candidemia salvage therapy and invasive Candida infection."),
      buildSource("idsa-aspergillosis", "Role in mold-active therapy when azoles are not appropriate or not tolerated."),
      buildSource("mucormycosis-guidance", "First-line role in mucormycosis and severe endemic mycoses."),
      buildSource("nephrotoxicity-mitigation", "Dose, electrolyte, and renal monitoring literature for lipid amphotericin formulations."),
    ],
  }),
  vancomycin: withConfidence("high", "vancomycin", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "AUC-guided vancomycin monitoring review",
    sources: [
      buildSource("ashp-idsa-pids-2020-vancomycin", "Consensus guideline for AUC-guided therapeutic monitoring of vancomycin."),
      buildSource("aha-2015-ie", "Organism-specific roles for vancomycin in endocarditis and bloodstream infection."),
      buildSource("auc-stewardship", "Clinical outcomes and nephrotoxicity literature supporting AUC-guided dosing."),
    ],
  }),
  daptomycin: withConfidence("moderate", "daptomycin", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "High-dose daptomycin SAB/IE review",
    sources: [
      buildSource("aha-2015-ie", "Daptomycin role in right-sided and left-sided staphylococcal endocarditis management."),
      buildSource("high-dose-daptomycin", "Bacteremia and endocarditis outcomes with high-dose daptomycin strategies."),
      buildSource("combination-salvage-therapy", "Evidence for daptomycin-based salvage approaches in persistent MRSA bacteremia."),
    ],
  }),
  cefazolin: withConfidence("moderate", "cefazolin", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "MSSA bacteremia beta-lactam review",
    sources: [
      buildSource("aha-2015-ie", "Cefazolin role in MSSA bacteremia and endocarditis treatment."),
      buildSource("cefazolin-versus-asp", "Comparative outcomes literature against anti-staphylococcal penicillins in MSSA bacteremia."),
      buildSource("cefazolin-inoculum-effect", "Pharmacodynamic and inoculum-effect literature relevant to deep-seated MSSA infection."),
    ],
  }),
  nafcillin: withConfidence("moderate", "nafcillin", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "Anti-staphylococcal penicillin review",
    sources: [
      buildSource("aha-2015-ie", "Preferred beta-lactam therapy framework for MSSA endocarditis."),
      buildSource("mssa-bacteremia-literature", "Historical standard-of-care outcomes with nafcillin and oxacillin."),
      buildSource("opat-tolerability", "Hepatic, renal, and sodium-load considerations during prolonged anti-staphylococcal penicillin therapy."),
    ],
  }),
  ceftriaxone: withConfidence("moderate", "ceftriaxone", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "Ceftriaxone endocarditis/OPAT review",
    sources: [
      buildSource("aha-2015-ie", "Ceftriaxone role in streptococcal endocarditis and select gram-negative bloodstream infections."),
      buildSource("once-daily-opat", "Ceftriaxone suitability for outpatient therapy and simplified administration."),
      buildSource("biliary-urinary-source-bacteremia", "Source-specific stewardship literature supporting ceftriaxone de-escalation when susceptible."),
    ],
  }),
};

export const PRIORITY_SUBCATEGORY_META_KEYS = [
  "amr-gn/esbl-e",
  "amr-gn/cre-kpc",
  "amr-gn/cre-mbl",
  "amr-gn/dtr-pa",
  "amr-gn/crab-steno",
  "advanced-agents/cre-management",
  "advanced-agents/mdr-pseudomonas",
  "febrile-neutropenia/high-risk-fn",
  "febrile-neutropenia/fn-with-fungal-risk",
  "bacteremia-endocarditis/sab-workup",
  "bacteremia-endocarditis/native-valve-ie",
  "bacteremia-endocarditis/prosthetic-valve-ie",
  "bacteremia-endocarditis/gram-negative-bacteremia",
  "bacteremia-endocarditis/opat-considerations",
  "sepsis/sepsis-community",
  "sepsis/sepsis-hcap",
  "sepsis/septic-shock",
] as const;

export const PRIORITY_MONOGRAPH_META_KEYS = [
  "aztreonam",
  "ceftazidime-avibactam",
  "meropenem-vaborbactam",
  "cefiderocol",
  "ceftolozane-tazobactam",
  "imipenem-cilastatin-relebactam",
  "colistin",
  "tedizolid",
  "posaconazole",
  "liposomal-amphotericin-b",
  "vancomycin",
  "daptomycin",
  "cefazolin",
  "nafcillin",
  "ceftriaxone",
] as const;
