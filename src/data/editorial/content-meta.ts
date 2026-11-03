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
  cap: "Reviewed outpatient and inpatient CAP regimen selection, short-course data, and severe CAP steroid updates.",
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
  t2dm: "Reviewed adult T2DM diagnosis, target selection, cardiorenal-weight-guided therapy, inpatient glycemic management, and sick-day/discharge medication safety.",
  "t2dm/diagnosis-and-glycemic-targets": "Reviewed diagnostic confirmation rules, individualized A1c targets, and thresholds that should trigger urgent insulin-deficiency reassessment.",
  "t2dm/lifestyle-and-first-line-therapy": "Reviewed diabetes self-management education, weight-forward care, metformin use, and practical first-line sequencing.",
  "t2dm/cardiorenal-weight-guided-therapy": "Reviewed ASCVD, heart-failure, CKD, and obesity-driven sequencing for GLP-1 receptor agonist and SGLT2 inhibitor therapy.",
  "t2dm/treatment-intensification-and-injectables": "Reviewed when to intensify beyond foundation therapy, when to prefer GLP-1 receptor agonists before insulin, and when basal or prandial insulin is warranted.",
  "t2dm/hospital-management-non-icu": "Reviewed non-ICU glycemic targets, basal-bolus versus basal-plus insulin strategy, and limited DPP-4-based simplification pathways.",
  "t2dm/sick-day-and-perioperative-management": "Reviewed dehydration and ketone escalation, perioperative SGLT2 holds, metformin safety holds, and basal insulin handling during fasting.",
  "t2dm/discharge-and-follow-up": "Reviewed discharge medication reconciliation, safe restart timing for metformin and SGLT2 therapy, temporary basal insulin discharge planning, and follow-up timing.",
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

const GUIDELINE_UPDATE_ON = "2026-11-03";
const GUIDELINE_UPDATE_REVIEWER = "Pharmacist sign-off";

function guidelineUpdate(reviewKey: ReviewSummaryKey, summary: string) {
  return {
    lastReviewed: GUIDELINE_UPDATE_ON,
    reviewedBy: GUIDELINE_UPDATE_REVIEWER,
    owner: DEFAULT_CONTENT_REVIEWER,
    reviewHistory: [
      review(summary, GUIDELINE_UPDATE_ON, GUIDELINE_UPDATE_REVIEWER),
      review(REVIEW_SUMMARIES[reviewKey]),
    ],
  };
}

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
    ...guidelineUpdate("uti", "Aligned pyelonephritis durations with IDSA 2025 cUTI (5–7 days FQ, 7 days non-FQ), added pivmecillinam, gepotidacin, and oral sulopenem for cystitis, added 2026 approvals (cefepime-zidebactam, oral tebipenem) to the reserve tier, and aligned ESBL/CRE notes with IDSA 2026 AMR guidance."),
    guidelineVersion: "IDSA 2025 cUTI guidance + IDSA 2026 AMR guidance",
    sources: [
      buildSource("idsa-2025-cuti", "Infectious Diseases Society of America complicated UTI guidance, 2025."),
      buildSource("idsa-escmid-2011-uti", "International Clinical Practice Guidelines for uncomplicated cystitis and pyelonephritis, 2011."),
      buildSource("eau-2024-uti", "European Association of Urology UTI guidance, 2024."),
      buildSource("idsa-2026-amr", "IDSA guidance on antimicrobial-resistant gram-negative infections, 2026 (ESBL-E and CRE urinary recommendations)."),
      buildSource("fda-pivmecillinam-label", "Pivmecillinam (Pivya) prescribing information, 2024."),
      buildSource("fda-gepotidacin-label", "Gepotidacin (Blujepa) prescribing information."),
      buildSource("fda-sulopenem-label", "FDA approval of sulopenem etzadroxil/probenecid (Orlynvah), 2024."),
    ],
    whatChanged: [
      "Pyelonephritis durations now follow IDSA 2025 cUTI guidance: TMP-SMX 7 days (not 14), fluoroquinolone 5–7 days.",
      "Added pivmecillinam, gepotidacin, and oral sulopenem for uncomplicated cystitis.",
      "Added 2026 FDA approvals cefepime-zidebactam and oral tebipenem to the reserve-agent tier.",
    ],
  }),
  cap: withConfidence("high", "cap", {
    ...guidelineUpdate("cap", "Updated to the ATS 2025 CAP guideline: corticosteroids for severe CAP (not non-severe or influenza), 3–5 day courses for non-severe CAP once stable, ≥5 days for severe CAP, empiric antibacterials despite viral co-detection, and lung ultrasound as an imaging alternative."),
    guidelineVersion: "ATS 2025 CAP update + ATS/IDSA 2019 CAP guidance",
    sources: [
      buildSource("ats-2025-cap", "Diagnosis and management of community-acquired pneumonia, official ATS clinical practice guideline update, AJRCCM 2025."),
      buildSource("ats-idsa-2019-cap", "Adult community-acquired pneumonia guideline from ATS and IDSA, 2019."),
      buildSource("cape-cod", "Hydrocortisone for severe CAP, NEJM 2023."),
      buildSource("el-moussaoui-2006-short-course-cap", "Three-day versus eight-day amoxicillin strategy after early clinical stability in adult CAP, BMJ 2006."),
    ],
    whatChanged: [
      "Severe CAP now carries a conditional ATS 2025 recommendation for systemic corticosteroids; non-severe CAP is a strong recommendation against.",
      "Non-severe CAP durations updated to 3–5 days once clinically stable; severe CAP stays at ≥5 days.",
      "Positive respiratory virus tests no longer remove the need for empiric antibacterials in hospitalized CAP.",
    ],
  }),
  "hap-vap": withConfidence("moderate", "hap-vap", {
    ...guidelineUpdate("hap-vap", "Updated sepsis references to SSC 2026, resistant gram-negative references to IDSA 2026, and replaced outdated TMP-SMX-first Stenotrophomonas guidance with IDSA 2026 cefiderocol-monotherapy preference."),
    guidelineVersion: "ATS/IDSA 2016 HAP/VAP guidance + IDSA 2026 AMR guidance",
    sources: [
      buildSource("ats-idsa-2016-hap-vap", "Hospital-acquired and ventilator-associated pneumonia guideline, 2016."),
      buildSource("idsa-2026-amr", "Antimicrobial resistance guidance used for resistant gram-negative escalation decisions, 2026."),
      buildSource("ssc-2026", "Surviving Sepsis Campaign international guidelines, 2026."),
      buildSource("smart-trial", "Balanced crystalloids versus saline in ICU patients, NEJM 2018."),
    ],
    whatChanged: [
      "Stenotrophomonas: cefiderocol monotherapy is now preferred; TMP-SMX is a combination component, and ceftazidime is no longer listed.",
    ],
  }),
  ssti: withConfidence("moderate", "ssti", {
    ...guidelineUpdate("ssti", "Updated necrotizing-infection sepsis reference to SSC 2026 and resistant-organism references to IDSA 2026."),
    guidelineVersion: "IDSA SSTI guidance",
    sources: [
      buildSource("idsa-2014-ssti", "Skin and soft tissue infection guidance from IDSA."),
      buildSource("idsa-2026-amr", "Resistant organism escalation guidance, 2026."),
      buildSource("oviva", "Oral versus intravenous antibiotics for bone and joint and deep infection pathways, NEJM 2019."),
    ],
  }),
  iai: withConfidence("moderate", "iai", {
    ...guidelineUpdate("iai", "Aligned ESBL-E intra-abdominal recommendations with IDSA 2026 (pip-tazo not suggested outside the urinary tract; cefepime-enmetazobactam as an alternative)."),
    guidelineVersion: "SIS/IDSA intra-abdominal infection guidance",
    sources: [
      buildSource("idsa-sis-2010-ciai", "IDSA/SIS 2010 guideline for diagnosis and management of complicated intra-abdominal infection."),
      buildSource("sis-2017-ciai", "Surgical Infection Society 2017 revised guidance for intra-abdominal infection."),
      buildSource("tokyo-guidelines", "Biliary and cholecystitis/cholangitis guidance used for source-control framing."),
      buildSource("stop-it", "Short-course antimicrobial therapy for source-controlled intra-abdominal infection, NEJM 2015."),
    ],
  }),
  "amr-gn": withConfidence("high", "amr-gn", {
    ...guidelineUpdate("amr-gn", "Updated all six phenotype pathways to the IDSA 2026 AMR guidance, including the ceftriaxone MIC ≥4 ESBL proxy, new cystitis agents, aztreonam-avibactam for NDM, ceftolozane-tazobactam for DTR-PA pneumonia, sulbactam-durlobactam priority for CRAB with corrected label dosing, and cefiderocol monotherapy for S. maltophilia."),
    guidelineVersion: "IDSA 2026 AMR guidance",
    sources: [
      buildSource("idsa-2026-amr", "Guidance for ESBL-E, AmpC-E, CRE, DTR Pseudomonas, CRAB, and S. maltophilia, 2026."),
      buildSource("merino", "Piperacillin-tazobactam versus meropenem for ESBL bacteremia, JAMA 2018."),
      buildSource("pkpd-stewardship", "Extended-infusion beta-lactam stewardship principles used throughout resistant gram-negative pathways."),
    ],
    whatChanged: [
      "Rebased on IDSA 2026 AMR guidance (July 2026), superseding the 2024 version.",
      "Corrected sulbactam-durlobactam dosing to the label dose of 1 g sulbactam + 1 g durlobactam q6h.",
      "S. maltophilia: cefiderocol monotherapy is now preferred; TMP-SMX dosing updated to 8–12 mg/kg/day as a combination component.",
    ],
  }),
  "bacteremia-endocarditis": withConfidence("high", "bacteremia-endocarditis", {
    ...guidelineUpdate("bacteremia-endocarditis", "Added the AHA 2026 IE scientific statement and IDSA/ESCMID 2026 SAB consensus statements (TTE for all adults, risk-based TEE, 48-hour repeat cultures, 14 days without deep foci), aligned gram-negative bacteremia durations with Yahav and BALANCE, and corrected ESBL alternatives."),
    guidelineVersion: "AHA 2026 IE statement + ESC 2023 IE guidance + IDSA/ESCMID 2026 SAB consensus",
    sources: [
      buildSource("aha-2026-ie", "AHA scientific statement on infective endocarditis diagnosis, antibiotic therapy, and management, Circulation 2026."),
      buildSource("esc-2023-ie", "European infective endocarditis guideline update, 2023."),
      buildSource("idsa-escmid-2026-sab", "IDSA/ESCMID consensus statements on S. aureus bacteremia risk stratification, diagnostics, and duration, 2026."),
      buildSource("aha-2015-ie", "Prior AHA scientific statement for adult infective endocarditis, 2015."),
      buildSource("poet", "Partial oral treatment of endocarditis, NEJM 2019."),
      buildSource("arrest", "Adjunctive rifampin for Staphylococcus aureus bacteremia, Lancet 2018."),
    ],
    whatChanged: [
      "S. aureus bacteremia workup follows IDSA/ESCMID 2026: TTE for all adults, TEE by risk feature, repeat cultures at 48 hours.",
      "Endocarditis content reflects the AHA 2026 statement (Duke-ISCVID, partial oral therapy with TEE at transition, post-op duration).",
      "Gram-negative bacteremia durations now default to 7 days for responding patients with source control.",
    ],
  }),
  "c-difficile": withConfidence("high", "c-difficile", {
    ...guidelineUpdate("c-difficile", "Flagged bezlotoxumab as discontinued (US January 2025; EU authorization withdrawn October 2026) and redirected recurrence prevention to fidaxomicin and microbiome restoration; corrected the heart-failure warning (not boxed) and the ACG 2021 fidaxomicin statement."),
    guidelineVersion: "IDSA/SHEA CDI guidance",
    sources: [
      buildSource("idsa-shea-cdi", "Clostridioides difficile infection guideline from IDSA and SHEA."),
      buildSource("fidaxomicin-trials", "Registration and recurrence-reduction trials informing fidaxomicin preference."),
      buildSource("fmt-stewardship", "Evidence base for fecal microbiota transplant in multiply recurrent CDI."),
      buildSource("ashp-bezlotoxumab-discontinued", "ASHP drug shortage notice documenting the discontinuation of Zinplava (bezlotoxumab)."),
    ],
    whatChanged: [
      "Bezlotoxumab (Zinplava) is discontinued and no longer recommended; regimens now point to fidaxomicin and microbiota-based therapies.",
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
    ...guidelineUpdate("fungal-infections", "Added the ECMM/ISHAM/ASM 2025 global candidiasis guideline and rezafungin, flagged fluconazole-resistant C. parapsilosis, and corrected cryptococcal trial references (ACTA, AMBITION, COAT)."),
    guidelineVersion: "ECMM 2025 + IDSA 2016 candidiasis and IDSA 2016 aspergillosis guidance",
    sources: [
      buildSource("ecmm-2025-candidiasis", "Global guideline for the diagnosis and management of candidiasis, ECMM/ISHAM/ASM, Lancet Infect Dis 2025."),
      buildSource("idsa-candidiasis", "Clinical practice guideline for candidiasis, IDSA 2016."),
      buildSource("idsa-aspergillosis", "Diagnosis and management of aspergillosis, IDSA 2016."),
      buildSource("secure-trial", "Isavuconazole versus voriconazole for invasive aspergillosis, Lancet 2016."),
    ],
    whatChanged: [
      "Added the ECMM 2025 global candidiasis guideline and once-weekly rezafungin.",
      "Corrected the cryptococcal induction trial name (ACTA) and COAT mortality figures.",
    ],
  }),
  "advanced-agents": withConfidence("emerging", "advanced-agents", {
    ...guidelineUpdate("advanced-agents", "Replaced IDSA 2022 references with IDSA 2026, added aztreonam-avibactam for NDM-CRE, corrected aztreonam co-dosing to q8h, and fixed the ceftolozane-tazobactam ESBL activity statement."),
    guidelineVersion: "IDSA 2026 resistant pathogen guidance",
    sources: [
      buildSource("idsa-2026-amr", "Guidance for CRE, ESBL-E, DTR Pseudomonas, and resistant gram-negatives, 2026."),
      buildSource("aspect-cuti-ciai", "Ceftolozane-tazobactam cUTI and cIAI registration data."),
      buildSource("aspect-np", "Ceftolozane-tazobactam nosocomial pneumonia phase 3 data."),
      buildSource("restore-imi", "Imipenem-cilastatin-relebactam versus polymyxin-based therapy."),
    ],
  }),
  "febrile-neutropenia": withConfidence("moderate", "febrile-neutropenia", {
    ...guidelineUpdate("febrile-neutropenia", "Updated resistant gram-negative references to IDSA 2026 and noted that quinupristin-dalfopristin is no longer marketed in the US."),
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
    ...guidelineUpdate("sepsis", "Updated to the Surviving Sepsis Campaign 2026 guidelines: possible/probable/definite antimicrobial timing tiers, qSOFA not recommended as a single screening tool, source control ideally within 6 hours, prolonged beta-lactam infusion as a strong recommendation, corticosteroids for adults with septic shock, MAP 60–65 mmHg for adults ≥65, and suggestion against routine empiric antifungals."),
    guidelineVersion: "SSC 2026 + Sepsis-3 + BALANCE 2024",
    sources: [
      buildSource("ssc-2026", "Surviving Sepsis Campaign international guidelines for management of sepsis and septic shock, 2026."),
      buildSource("sepsis-3", "Consensus definitions and diagnostic framework for sepsis and septic shock, JAMA 2016."),
      buildSource("balance", "Seven versus fourteen days for bloodstream infection, 2024."),
    ],
    whatChanged: [
      "Rebased on SSC 2026 (March 2026), superseding SSC 2021.",
      "Corrected qSOFA guidance: it should not be used as a single screening tool.",
      "Corticosteroids now suggested for adults with septic shock; prolonged beta-lactam infusion is a strong recommendation.",
    ],
  }),
  t2dm: withConfidence("high", "t2dm", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "ADA Standards of Care 2026 with KDIGO and Endocrine Society support",
    sources: [
      buildSource("ada-2026-diagnosis", "ADA Standards of Care 2026 section on diagnosis and classification of diabetes."),
      buildSource("ada-2026-glycemic-goals", "ADA Standards of Care 2026 section on glycemic goals and hypoglycemia."),
      buildSource("ada-2026-pharmacologic", "ADA Standards of Care 2026 section on pharmacologic approaches to glycemic treatment."),
      buildSource("ada-2026-cv-risk", "ADA Standards of Care 2026 section on cardiovascular disease and risk management."),
      buildSource("ada-2026-ckd-risk", "ADA Standards of Care 2026 section on chronic kidney disease and risk management."),
      buildSource("ada-2026-hospital", "ADA Standards of Care 2026 section on diabetes care in the hospital."),
      buildSource("ada-kdigo-2022-ckd", "ADA/KDIGO consensus report supporting cardiorenal layering in diabetes with CKD."),
    ],
  }),
};

export const SUBCATEGORY_CONTENT_META: Record<string, ContentMetaSeed> = {
  "t2dm/diagnosis-and-glycemic-targets": withConfidence("high", "t2dm/diagnosis-and-glycemic-targets", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "ADA 2026 diagnosis and glycemic targets guidance",
    sources: [
      buildSource("ada-2026-diagnosis", "Diagnostic thresholds, confirmation rules, and phenotype reassessment guidance."),
      buildSource("ada-2026-glycemic-goals", "Individualized A1c targets and hypoglycemia-aware goal selection."),
      buildSource("ada-2026-pharmacologic", "Thresholds for early insulin when severe hyperglycemia or catabolic symptoms are present."),
    ],
  }),
  "t2dm/lifestyle-and-first-line-therapy": withConfidence("high", "t2dm/lifestyle-and-first-line-therapy", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "ADA 2026 first-line outpatient T2DM care",
    sources: [
      buildSource("ada-2026-health-behaviors", "Diabetes self-management education, nutrition, activity, and psychosocial support guidance."),
      buildSource("ada-2026-obesity", "Weight-management-first treatment framing for adults with T2DM and obesity."),
      buildSource("ada-2026-pharmacologic", "Metformin use and medication sequencing for newly treated T2DM."),
    ],
  }),
  "t2dm/cardiorenal-weight-guided-therapy": withConfidence("high", "t2dm/cardiorenal-weight-guided-therapy", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "ADA 2026 cardiorenal and weight-prioritized therapy",
    sources: [
      buildSource("ada-2026-cv-risk", "ASCVD-focused therapy selection and cardiovascular risk management."),
      buildSource("ada-2026-ckd-risk", "CKD-focused therapy selection and renal risk management."),
      buildSource("ada-kdigo-2022-ckd", "Layered therapy approach for diabetes with CKD."),
      buildSource("aha-acc-hfsa-2022-heart-failure", "Heart-failure guidance supporting SGLT2 inhibitor use when HF is present."),
    ],
  }),
  "t2dm/treatment-intensification-and-injectables": withConfidence("high", "t2dm/treatment-intensification-and-injectables", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "ADA 2026 intensification guidance with GRADE support",
    sources: [
      buildSource("ada-2026-pharmacologic", "Injectable sequencing, insulin thresholds, and multi-agent intensification guidance."),
      buildSource("grade-trial", "Comparative durability data for common add-on therapies after metformin."),
      buildSource("ukpds-34", "Foundational metformin outcome data underpinning durable base therapy."),
    ],
  }),
  "t2dm/hospital-management-non-icu": withConfidence("high", "t2dm/hospital-management-non-icu", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "ADA 2026 hospital care with Endocrine Society 2022 inpatient guidance",
    sources: [
      buildSource("ada-2026-hospital", "Inpatient target range, medication holds, and insulin-therapy principles."),
      buildSource("endocrine-society-2022-hospital-hyperglycemia", "Noncritical care insulin strategy and DPP-4-based simplification guidance."),
    ],
  }),
  "t2dm/sick-day-and-perioperative-management": withConfidence("high", "t2dm/sick-day-and-perioperative-management", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "ADA 2026 hospital/perioperative safety with FDA medication-hold guidance",
    sources: [
      buildSource("ada-2026-hospital", "Acute illness, perioperative, and medication-hold guidance in hospitalized diabetes care."),
      buildSource("fda-sglt2-perioperative-warning", "Perioperative and acute-illness SGLT2 hold safety guidance."),
      buildSource("fda-metformin-renal-guidance", "Metformin contrast and renal-function restart guidance."),
    ],
  }),
  "t2dm/discharge-and-follow-up": withConfidence("high", "t2dm/discharge-and-follow-up", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "ADA 2026 transition-of-care diabetes guidance",
    sources: [
      buildSource("ada-2026-hospital", "Discharge medication reconciliation and transition-of-care diabetes guidance."),
      buildSource("ada-2026-pharmacologic", "Outpatient sequencing logic for post-discharge regimen selection."),
      buildSource("fda-sglt2-perioperative-warning", "Safe restart boundaries for SGLT2 therapy after acute illness or procedures."),
      buildSource("fda-metformin-renal-guidance", "Safe metformin restart boundaries after kidney-risk events or contrast."),
    ],
  }),
  "amr-gn/esbl-e": withConfidence("high", "amr-gn/esbl-e", {
    ...guidelineUpdate("amr-gn/esbl-e", "Updated to IDSA 2026: ceftriaxone MIC ≥4 ESBL proxy, gepotidacin/pivmecillinam/sulopenem/single-dose aminoglycosides for cystitis, pip-tazo as a cUTI-only alternative, and cefepime-enmetazobactam outside the urinary tract."),
    guidelineVersion: "IDSA 2026 ESBL-E guidance",
    whatChanged: [
      "ESBL presumption threshold changed to ceftriaxone MIC ≥4 µg/mL (IDSA 2026).",
      "Added gepotidacin, pivmecillinam, oral sulopenem, and single-dose aminoglycosides as preferred cystitis options.",
    ],
    sources: [
      buildSource("idsa-2026-amr", "Guidance for ESBL-producing Enterobacterales, including preferred carbapenem use and oral step-down cautions, 2026."),
      buildSource("merino", "Piperacillin-tazobactam versus meropenem for ESBL bloodstream infection, JAMA 2018."),
      buildSource("pkpd-stewardship", "Extended-infusion beta-lactam principles applied to ESBL-E severe infection management."),
    ],
  }),
  "amr-gn/cre-kpc": withConfidence("high", "amr-gn/cre-kpc", {
    ...guidelineUpdate("amr-gn/cre-kpc", "Updated to IDSA 2026: three preferred KPC agents listed without ranking, CRE urinary options aligned, and MBL exit path points to aztreonam-avibactam or cefiderocol."),
    guidelineVersion: "IDSA 2026 KPC-CRE guidance",
    sources: [
      buildSource("idsa-2026-amr", "Preferred beta-lactam/beta-lactamase inhibitor strategy for KPC-producing CRE, 2026."),
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
        rationale: "IDSA 2026 and comparative KPC data consistently support novel beta-lactam/BLI therapy over polymyxin-era regimens.",
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
        guidanceA: "IDSA 2026 lists ceftazidime-avibactam, imipenem-cilastatin-relebactam, and meropenem-vaborbactam as preferred (alphabetically), discussing comparative resistance-emergence data in the rationale.",
        guidanceB: "Many institutions operationally treat the three agents as near-equivalent and default to whichever reaches the patient fastest.",
        pharmacistTakeaway: "Do not delay active therapy over a ranking nuance; start an active KPC agent promptly, then refine once logistics and prior exposure are reviewed.",
      },
    ],
  }),
  "amr-gn/cre-mbl": withConfidence("moderate", "amr-gn/cre-mbl", {
    ...guidelineUpdate("amr-gn/cre-mbl", "Updated to IDSA 2026: aztreonam-avibactam (FDA-approved 2025) and cefiderocol are preferred for NDM/MBL-CRE, with ceftazidime-avibactam plus aztreonam as the workaround when the fixed product is unavailable."),
    guidelineVersion: "IDSA 2026 MBL-CRE guidance",
    sources: [
      buildSource("idsa-2026-amr", "Aztreonam-avibactam, cefiderocol, and ceftazidime-avibactam plus aztreonam strategies for MBL producers, 2026."),
      buildSource("falcone-2021-caz-avi-aztreonam", "Clinical outcomes supporting ceftazidime-avibactam plus aztreonam for MBL-producing Enterobacterales."),
      buildSource("credible-cr", "Cefiderocol data in carbapenem-resistant gram-negative infections."),
    ],
    whatChanged: [
      "Added fixed-dose aztreonam-avibactam as an IDSA 2026 preferred option with label dosing.",
      "Added rapid-diagnostic actions for MBL confirmation and combo-testing workflow.",
      "Added explicit warning that aztreonam monotherapy remains unreliable despite apparent in vitro activity.",
    ],
    sectionConfidence: [
      {
        section: "Aztreonam-avibactam and ceftazidime-avibactam plus aztreonam strategy",
        confidence: "moderate",
        rationale: "Supported by strong mechanistic logic, registration data for the fixed combination, and observational data for the two-drug workaround, but still lacks large phenotype-specific randomized trials.",
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
        guidanceA: "IDSA 2026 lists aztreonam-avibactam and cefiderocol as preferred, with a slight preference for aztreonam-avibactam over ceftazidime-avibactam plus aztreonam.",
        guidanceB: "Programs without aztreonam-avibactam on formulary continue to use synchronized ceftazidime-avibactam plus aztreonam as their aztreonam-based strategy.",
        pharmacistTakeaway: "Prefer the fixed aztreonam-avibactam product when available; otherwise run the two-drug workaround with synchronized dosing, and keep cefiderocol as the other preferred option.",
      },
    ],
  }),
  "amr-gn/dtr-pa": withConfidence("moderate", "amr-gn/dtr-pa", {
    ...guidelineUpdate("amr-gn/dtr-pa", "Updated to IDSA 2026: ceftolozane-tazobactam preferred for DTR-PA pneumonia, cefiderocol moved to an alternative outside the urinary tract, imipenem-relebactam resistance-emergence data added, and nebulized-antibiotic stance softened."),
    guidelineVersion: "IDSA 2026 DTR Pseudomonas guidance",
    sources: [
      buildSource("idsa-2026-amr", "Preferred newer beta-lactams and susceptibility-based escalation framework for DTR Pseudomonas, 2026."),
      buildSource("aspect-np", "Ceftolozane-tazobactam for nosocomial pneumonia including resistant Pseudomonas."),
      buildSource("restore-imi", "Imipenem-cilastatin-relebactam versus colistin-based therapy for imipenem-nonsusceptible infections."),
    ],
    whatChanged: [
      "Ceftolozane-tazobactam is now the preferred agent for DTR-PA pneumonia; cefiderocol is an alternative outside the urinary tract (IDSA 2026).",
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
        guidanceA: "IDSA 2026 treats ceftazidime-avibactam, ceftolozane-tazobactam, and imipenem-relebactam as preferred outside the urinary tract, but favors ceftolozane-tazobactam for pneumonia.",
        guidanceB: "Many hospitals still promote one as a local first-look agent based on their novel-antibiogram data.",
        pharmacistTakeaway: "Trust local susceptibility data over generic brand familiarity when both drugs are active.",
      },
    ],
  }),
  "amr-gn/crab-steno": withConfidence("emerging", "amr-gn/crab-steno", {
    ...guidelineUpdate("amr-gn/crab-steno", "Updated to IDSA 2026: sulbactam-durlobactam plus imipenem or meropenem is the priority for invasive CRAB (all else bridge-only) with corrected label dosing, and cefiderocol monotherapy is now preferred for invasive S. maltophilia."),
    guidelineVersion: "IDSA 2026 CRAB/Stenotrophomonas guidance",
    sources: [
      buildSource("idsa-2026-amr", "Guidance for invasive CRAB and S. maltophilia infection, including sulbactam-durlobactam priority and cefiderocol monotherapy preference, 2026."),
      buildSource("attack", "Sulbactam-durlobactam versus colistin for Acinetobacter baumannii-calcoaceticus complex infection, 2023."),
      buildSource("credible-cr", "Cefiderocol resistant gram-negative outcomes including Acinetobacter subgroup concerns."),
    ],
    whatChanged: [
      "Corrected sulbactam-durlobactam dosing to 1 g sulbactam + 1 g durlobactam IV q6h over 3 hours (label dose).",
      "S. maltophilia: cefiderocol monotherapy is preferred; aztreonam-avibactam, levofloxacin, minocycline, and TMP-SMX are combination alternatives.",
      "Added explicit breakpoint warnings for Stenotrophomonas ceftazidime reporting and CRAB susceptibility workflow.",
    ],
    sectionConfidence: [
      {
        section: "Sulbactam-durlobactam as preferred CRAB therapy",
        confidence: "moderate",
        rationale: "The signal is strong and practice-changing, but the evidence base is still much smaller than for common syndromes.",
      },
      {
        section: "Cefiderocol monotherapy for invasive Stenotrophomonas infection",
        confidence: "emerging",
        rationale: "IDSA 2026 bases this mainly on susceptibility and neutropenic animal data, with limited clinical outcome data.",
      },
    ],
    guidelineDisagreements: [
      {
        topic: "How aggressively to combine cefiderocol in CRAB",
        guidanceA: "IDSA 2026 reserves cefiderocol for invasive CRAB when resistance precludes sulbactam-durlobactam or as bridge therapy, and the CREDIBLE-CR signal keeps it out of monotherapy framing.",
        guidanceB: "Some clinicians still individualize toward monotherapy late in therapy if cultures clear and no second active agent remains.",
        pharmacistTakeaway: "Start with combination thinking for CRAB and only simplify with specialist review after clear clinical improvement.",
      },
    ],
  }),
  "advanced-agents/cre-management": withConfidence("moderate", "advanced-agents/cre-management", {
    ...guidelineUpdate("advanced-agents/cre-management", "Updated CRE agent selection to IDSA 2026, added aztreonam-avibactam for NDM-CRE, and corrected aztreonam co-dosing with ceftazidime-avibactam to q8h."),
    guidelineVersion: "Advanced CRE agent review (IDSA 2026)",
    sources: [
      buildSource("idsa-2026-amr", "Agent selection across KPC, OXA, and MBL resistance mechanisms, 2026."),
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
    ...guidelineUpdate("advanced-agents/mdr-pseudomonas", "Updated DTR Pseudomonas agent positioning to IDSA 2026 and corrected the ceftolozane-tazobactam ESBL activity statement."),
    guidelineVersion: "Advanced DTR Pseudomonas agent review (IDSA 2026)",
    sources: [
      buildSource("idsa-2026-amr", "Mechanism-aware DTR Pseudomonas escalation strategy, 2026."),
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
    ...guidelineUpdate("bacteremia-endocarditis/sab-workup", "Updated to IDSA/ESCMID 2026 SAB consensus statements: TTE for all adults, risk-feature-based TEE, ≥2 repeat culture sets at 48 hours, whole-body imaging for unknown focus, and 14 days for low- and increased-risk SAB without deep-seated foci; added ceftobiprole."),
    guidelineVersion: "IDSA/ESCMID 2026 SAB consensus statements",
    whatChanged: [
      "Replaced the uncomplicated/complicated checklist with IDSA/ESCMID 2026 low- vs increased-risk stratification.",
      "TEE criteria now follow the 2026 risk features, including a positive blood culture ≥48 hours after the first.",
    ],
    sources: [
      buildSource("idsa-escmid-2026-sab", "Risk stratification, diagnostic evaluation, and duration of therapy for S. aureus bacteremia, IDSA/ESCMID 2026."),
      buildSource("aha-2015-ie", "Imaging, blood culture clearance, and infective endocarditis workup standards relevant to S. aureus bacteremia."),
      buildSource("arrest", "Adjunctive rifampin trial reinforcing the need for disciplined SAB management and source control, Lancet 2018."),
      buildSource("holland-2014-sab-review", "Diagnostic workup, complication screening, and management standards for S. aureus bacteremia."),
    ],
  }),
  "bacteremia-endocarditis/native-valve-ie": withConfidence("high", "bacteremia-endocarditis/native-valve-ie", {
    ...guidelineUpdate("bacteremia-endocarditis/native-valve-ie", "Added AHA 2026 statement positions: Duke-ISCVID endorsement, TEE as first-line imaging, partial oral therapy with TEE at transition, streptococcal penicillin-intermediate/resistant regimens, and post-operative duration."),
    guidelineVersion: "AHA 2026 / ESC 2023 native-valve IE guidance",
    sources: [
      buildSource("aha-2026-ie", "AHA 2026 scientific statement on infective endocarditis diagnosis, antibiotic therapy, and management."),
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
    ...guidelineUpdate("bacteremia-endocarditis/gram-negative-bacteremia", "Aligned duration options with Yahav 2019, BALANCE 2024, and IDSA 2025 cUTI (7 days for responding patients with source control), softened the 14-day Pseudomonas default, and removed ceftazidime-avibactam as an ESBL alternative."),
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
    ...guidelineUpdate("sepsis/sepsis-community", "Updated community sepsis framing to SSC 2026 timing tiers, prolonged beta-lactam infusion, and the suggestion against routine empiric antifungals."),
    guidelineVersion: "SSC 2026 + community sepsis stewardship review",
    sources: [
      buildSource("ssc-2026", "Early sepsis recognition, antibiotics, and hemodynamic management, 2026."),
      buildSource("balance", "Shorter-course bloodstream infection data informing duration once source control is achieved."),
      buildSource("clovers", "Fluid strategy data after initial sepsis resuscitation, NEJM 2023."),
    ],
  }),
  "sepsis/sepsis-hcap": withConfidence("moderate", "sepsis/sepsis-hcap", {
    ...guidelineUpdate("sepsis/sepsis-hcap", "Updated to SSC 2026 and IDSA 2026 AMR guidance, including aztreonam-avibactam for suspected MBL-CRE, risk-based empiric MDR coverage, and IDSA/ESCMID 2026 SAB workup."),
    guidelineVersion: "SSC 2026 + AMR risk-informed sepsis stewardship",
    sources: [
      buildSource("ssc-2026", "Core sepsis timing, empiric coverage, and de-escalation recommendations, 2026."),
      buildSource("idsa-2026-amr", "Mechanism-aware resistant-pathogen treatment guidance relevant to healthcare-associated sepsis, 2026."),
      buildSource("cdc-amr-threats-2019", "US resistant-pathogen epidemiology supporting healthcare-associated resistant-gram-negative risk assessment."),
    ],
  }),
  "sepsis/septic-shock": withConfidence("high", "sepsis/septic-shock", {
    ...guidelineUpdate("sepsis/septic-shock", "Updated to SSC 2026: corticosteroids suggested for adults with septic shock, MAP 60–65 mmHg for adults ≥65, peripheral vasopressor initiation, source control ideally within 6 hours, and prolonged beta-lactam infusion as a strong recommendation."),
    guidelineVersion: "SSC 2026 septic shock guidance",
    sources: [
      buildSource("ssc-2026", "Septic shock vasopressor targets, corticosteroids, and early antimicrobial recommendations, 2026."),
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
      buildSource("idsa-2026-amr", "Preferred use for KPC-producing CRE and other select resistant gram-negative infections."),
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
      buildSource("idsa-2026-amr", "Preferred KPC-producing CRE therapy when susceptible."),
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
      buildSource("idsa-2026-amr", "Selective use in MBL producers and salvage scenarios."),
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
      buildSource("idsa-2026-amr", "Mechanism-aware aztreonam pairing for MBL-producing gram-negative infection."),
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
      buildSource("idsa-2026-amr", "Preferred use for difficult-to-treat Pseudomonas when susceptible."),
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
      buildSource("idsa-2026-amr", "Mechanism-based use in select KPC and DTR Pseudomonas isolates."),
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
      buildSource("idsa-2026-amr", "Reserve role due to nephrotoxicity and inferior outcomes when newer agents are available."),
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
