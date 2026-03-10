import type { ContentConfidence, ContentMeta, ContentSource, DiseaseState } from "../types";
import { CONTENT_REVIEWED_ON, CONTENT_STALE_AFTER_DAYS } from "../version";

function buildSource(kind: "guideline" | "trial" | "consensus" | "review", label: string, citation: string) {
  return { kind, label, citation };
}

function withConfidence(confidence: ContentConfidence, meta: Omit<ContentMeta, "confidence">): ContentMeta {
  return { confidence, ...meta };
}

const SOURCE_URLS: Record<string, string> = {
  "IDSA 2024 AMR": "https://www.idsociety.org/practice-guideline/amr-guidance/",
  "IDSA 2024 AMR guidance": "https://www.idsociety.org/practice-guideline/amr-guidance/",
  "IDSA AMR guidance": "https://www.idsociety.org/practice-guideline/amr-guidance/",
  "SSC 2021": "https://www.sccm.org/clinical-resources/guidelines/guidelines/surviving-sepsis-guidelines-2021",
  POET: "https://doi.org/10.1056/NEJMoa1808312",
  ARREST: "https://pubmed.ncbi.nlm.nih.gov/29249276/",
  CLOVERS: "https://pubmed.ncbi.nlm.nih.gov/36688507/",
  BALANCE: "https://pubmed.ncbi.nlm.nih.gov/39565030/",
  MERINO: "https://pubmed.ncbi.nlm.nih.gov/30208454/",
  "TANGO II": "https://pubmed.ncbi.nlm.nih.gov/30270406/",
  REPRISE: "https://pubmed.ncbi.nlm.nih.gov/27107460/",
  "RESTORE-IMI 2": "https://pubmed.ncbi.nlm.nih.gov/32785589/",
  "ASPECT-NP": "https://pubmed.ncbi.nlm.nih.gov/31563344/",
  ATTACK: "https://pubmed.ncbi.nlm.nih.gov/37182534/",
  "ASHP/IDSA/PIDS 2020 vancomycin": "https://pubmed.ncbi.nlm.nih.gov/32658968/",
};

function ageInDays(lastReviewed: string): number | null {
  const parsed = new Date(`${lastReviewed}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return null;
  return Math.floor((Date.now() - parsed.getTime()) / (1000 * 60 * 60 * 24));
}

export function formatReviewDate(value: string, format: "long" | "short" = "long") {
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-US", {
    month: format === "short" ? "short" : "long",
    day: "numeric",
    year: "numeric",
  });
}

export function getContentFreshness(meta: ContentMeta) {
  const ageDays = ageInDays(meta.lastReviewed);
  if (ageDays === null) {
    return {
      tone: "warn" as const,
      label: "Review date unavailable",
      shortLabel: "Date unavailable",
      ageDays: null,
    };
  }

  if (ageDays > CONTENT_STALE_AFTER_DAYS) {
    return {
      tone: "warn" as const,
      label: `Review stale (${ageDays} days old)`,
      shortLabel: "Stale review",
      ageDays,
    };
  }

  if (ageDays > CONTENT_STALE_AFTER_DAYS / 2) {
    return {
      tone: "info" as const,
      label: `Review aging (${ageDays} days old)`,
      shortLabel: "Review aging",
      ageDays,
    };
  }

  return {
    tone: "fresh" as const,
    label: `Reviewed ${formatReviewDate(meta.lastReviewed)}`,
    shortLabel: `Reviewed ${formatReviewDate(meta.lastReviewed, "short")}`,
    ageDays,
  };
}

export function getConfidenceBadge(confidence: ContentConfidence) {
  switch (confidence) {
    case "high":
      return { label: "High confidence", shortLabel: "High confidence", tone: "fresh" as const };
    case "moderate":
      return { label: "Moderate confidence", shortLabel: "Moderate confidence", tone: "info" as const };
    default:
      return { label: "Emerging evidence", shortLabel: "Emerging evidence", tone: "warn" as const };
  }
}

export function getContentSearchBoost(meta: ContentMeta | null): number {
  if (!meta) return 0;

  const confidenceBoost = meta.confidence === "high" ? 6 : meta.confidence === "moderate" ? 3 : 0;
  const freshness = getContentFreshness(meta);
  const freshnessBoost = freshness.tone === "fresh" ? 3 : freshness.tone === "info" ? 1 : 0;
  return confidenceBoost + freshnessBoost;
}

export function getSourceHref(source: ContentSource) {
  return source.url ?? SOURCE_URLS[source.label] ?? null;
}

export function getSourceLookupHref(source: ContentSource) {
  const direct = getSourceHref(source);
  if (direct) {
    return { href: direct, direct: true as const, label: "Open source" };
  }

  const query = encodeURIComponent(`${source.label} ${source.citation}`);
  return {
    href: `https://pubmed.ncbi.nlm.nih.gov/?term=${query}`,
    direct: false as const,
    label: "Search PubMed",
  };
}

export const DISEASE_CONTENT_META: Record<string, ContentMeta> = {
  uti: withConfidence("high", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "IDSA 2025 cUTI guidance",
    sources: [
      buildSource("guideline", "IDSA 2025 cUTI", "Infectious Diseases Society of America complicated UTI guidance, 2025."),
      buildSource("guideline", "IDSA/ESCMID 2011", "International Clinical Practice Guidelines for uncomplicated cystitis and pyelonephritis, 2011."),
      buildSource("guideline", "EAU 2024", "European Association of Urology UTI guidance, 2024."),
    ],
  }),
  cap: withConfidence("high", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "ATS/IDSA 2019 CAP guidance",
    sources: [
      buildSource("guideline", "ATS/IDSA 2019 CAP", "Adult community-acquired pneumonia guideline from ATS and IDSA, 2019."),
      buildSource("trial", "CAPE COD", "Hydrocortisone for severe CAP, NEJM 2023."),
      buildSource("trial", "STEP", "Three-day versus eight-day amoxicillin strategy for stabilized CAP, NEJM 2023."),
    ],
  }),
  "hap-vap": withConfidence("moderate", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "ATS/IDSA 2016 HAP/VAP guidance",
    sources: [
      buildSource("guideline", "ATS/IDSA 2016 HAP/VAP", "Hospital-acquired and ventilator-associated pneumonia guideline, 2016."),
      buildSource("guideline", "IDSA 2024 AMR guidance", "Antimicrobial resistance guidance used for resistant gram-negative escalation decisions, 2024."),
      buildSource("trial", "SMART", "Balanced crystalloids versus saline in ICU patients, NEJM 2018."),
    ],
  }),
  ssti: withConfidence("moderate", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "IDSA SSTI guidance",
    sources: [
      buildSource("guideline", "IDSA SSTI", "Skin and soft tissue infection guidance from IDSA."),
      buildSource("guideline", "IDSA 2024 AMR guidance", "Resistant organism escalation guidance, 2024."),
      buildSource("trial", "OVIVA", "Oral versus intravenous antibiotics for bone and joint and deep infection pathways, NEJM 2019."),
    ],
  }),
  iai: withConfidence("moderate", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "SIS/IDSA intra-abdominal infection guidance",
    sources: [
      buildSource("guideline", "SIS/IDSA IAI", "Surgical Infection Society and IDSA intra-abdominal infection guidance."),
      buildSource("guideline", "Tokyo Guidelines", "Biliary and cholecystitis/cholangitis guidance used for source-control framing."),
      buildSource("trial", "STOP-IT", "Short-course antimicrobial therapy for source-controlled intra-abdominal infection, NEJM 2015."),
    ],
  }),
  "amr-gn": withConfidence("high", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "IDSA 2024 AMR guidance",
    sources: [
      buildSource("guideline", "IDSA 2024 AMR", "Guidance for ESBL-E, CRE, DTR Pseudomonas, and resistant Acinetobacter, 2024."),
      buildSource("trial", "MERINO", "Piperacillin-tazobactam versus meropenem for ESBL bacteremia, JAMA 2018."),
      buildSource("consensus", "PK/PD stewardship", "Extended-infusion beta-lactam stewardship principles used throughout resistant gram-negative pathways."),
    ],
  }),
  "bacteremia-endocarditis": withConfidence("high", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "AHA/ACC 2023 IE update",
    sources: [
      buildSource("guideline", "AHA/ACC 2023 IE", "Infective endocarditis update from AHA/ACC, 2023."),
      buildSource("trial", "POET", "Partial oral treatment of endocarditis, NEJM 2019."),
      buildSource("trial", "ARREST", "Adjunctive rifampin for Staphylococcus aureus bacteremia, Lancet 2018."),
    ],
  }),
  "c-difficile": withConfidence("high", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "IDSA/SHEA CDI guidance",
    sources: [
      buildSource("guideline", "IDSA/SHEA CDI", "Clostridioides difficile infection guideline from IDSA and SHEA."),
      buildSource("trial", "Fidaxomicin trials", "Registration and recurrence-reduction trials informing fidaxomicin preference."),
      buildSource("review", "FMT stewardship", "Evidence base for fecal microbiota transplant in multiply recurrent CDI."),
    ],
  }),
  "bone-joint": withConfidence("moderate", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "OVIVA-informed bone and joint guidance",
    sources: [
      buildSource("trial", "OVIVA", "Oral versus intravenous antibiotics for bone and joint infection, NEJM 2019."),
      buildSource("guideline", "IDSA PJI/osteomyelitis", "IDSA guidance relevant to osteomyelitis and prosthetic joint infection pathways."),
      buildSource("review", "Orthopedic ID review", "Orthopedic infection source-control and step-down stewardship literature."),
    ],
  }),
  "cns-infections": withConfidence("moderate", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "IDSA CNS infection guidance",
    sources: [
      buildSource("guideline", "IDSA meningitis/ventriculitis", "IDSA guidance for bacterial meningitis and healthcare-associated ventriculitis."),
      buildSource("guideline", "AAN/IDSA encephalitis references", "Consensus references used for CNS diagnostic framing and adjunctive therapy."),
      buildSource("trial", "Dexamethasone meningitis data", "Adjunctive dexamethasone trials informing pneumococcal meningitis care."),
    ],
  }),
  "fungal-infections": withConfidence("moderate", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "IDSA 2016 candidiasis and aspergillosis guidance",
    sources: [
      buildSource("guideline", "IDSA candidiasis", "Clinical practice guideline for candidiasis, IDSA 2016."),
      buildSource("guideline", "IDSA aspergillosis", "Diagnosis and management of aspergillosis, IDSA 2016."),
      buildSource("trial", "SECURE", "Isavuconazole versus voriconazole for invasive aspergillosis, Lancet 2016."),
    ],
  }),
  "advanced-agents": withConfidence("emerging", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "IDSA 2022-2024 resistant pathogen guidance",
    sources: [
      buildSource("guideline", "IDSA AMR guidance", "Guidance for CRE, ESBL-E, DTR Pseudomonas, and resistant gram-negatives."),
      buildSource("trial", "ASPECT", "Ceftolozane-tazobactam registration studies for cUTI and nosocomial pneumonia."),
      buildSource("trial", "RESTORE-IMI", "Imipenem-cilastatin-relebactam versus polymyxin-based therapy."),
    ],
  }),
  "febrile-neutropenia": withConfidence("moderate", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "IDSA febrile neutropenia guidance",
    sources: [
      buildSource("guideline", "IDSA febrile neutropenia", "Guideline for evaluation and management of febrile neutropenia in cancer patients."),
      buildSource("guideline", "NCCN fever and neutropenia", "NCCN references for risk stratification and outpatient eligibility."),
      buildSource("consensus", "MASCC/CISNE", "Risk-stratification tools used for low-risk outpatient decision support."),
    ],
  }),
  "diabetic-foot": withConfidence("moderate", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "IWGDF/IDSA diabetic foot guidance",
    sources: [
      buildSource("guideline", "IWGDF/IDSA DFI", "Diabetic foot infection guidance from IWGDF and IDSA."),
      buildSource("review", "Osteomyelitis stewardship", "Shorter-course and oral step-down literature for diabetic foot osteomyelitis."),
      buildSource("consensus", "Source-control principles", "Surgical debridement and perfusion assessment references used in DFI pathways."),
    ],
  }),
  sepsis: withConfidence("high", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "SSC 2021; IDSA 2024 sepsis antimicrobial guidance",
    sources: [
      buildSource("guideline", "SSC 2021", "Surviving Sepsis Campaign international guidelines, 2021."),
      buildSource("guideline", "IDSA 2024 sepsis guidance", "Infectious disease-focused antimicrobial guidance for sepsis, 2024."),
      buildSource("trial", "BALANCE", "Seven versus fourteen days for bloodstream infection, 2024."),
    ],
  }),
};

export const SUBCATEGORY_CONTENT_META: Record<string, ContentMeta> = {
  "amr-gn/esbl-e": withConfidence("high", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "IDSA 2024 ESBL-E guidance",
    sources: [
      buildSource("guideline", "IDSA 2024 AMR", "Guidance for ESBL-producing Enterobacterales, including preferred carbapenem use and oral step-down cautions, 2024."),
      buildSource("trial", "MERINO", "Piperacillin-tazobactam versus meropenem for ESBL bloodstream infection, JAMA 2018."),
      buildSource("consensus", "PK/PD stewardship", "Extended-infusion beta-lactam principles applied to ESBL-E severe infection management."),
    ],
  }),
  "amr-gn/cre-kpc": withConfidence("high", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "IDSA 2024 KPC-CRE guidance",
    sources: [
      buildSource("guideline", "IDSA 2024 AMR", "Preferred beta-lactam/beta-lactamase inhibitor strategy for KPC-producing CRE, 2024."),
      buildSource("trial", "TANGO II", "Meropenem-vaborbactam versus best available therapy for CRE infections, 2018."),
      buildSource("trial", "REPRISE", "Ceftazidime-avibactam activity in resistant gram-negative infections, phase 3 data."),
    ],
  }),
  "amr-gn/cre-mbl": withConfidence("moderate", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "IDSA 2024 MBL-CRE guidance",
    sources: [
      buildSource("guideline", "IDSA 2024 AMR", "Aztreonam plus avibactam-based strategy and cefiderocol considerations for MBL producers, 2024."),
      buildSource("review", "Aztreonam-avibactam evidence", "Observational and mechanistic literature supporting aztreonam plus ceftazidime-avibactam for NDM/VIM/IMP producers."),
      buildSource("trial", "CREDIBLE-CR", "Cefiderocol data in carbapenem-resistant gram-negative infections."),
    ],
  }),
  "amr-gn/dtr-pa": withConfidence("moderate", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "IDSA 2024 DTR Pseudomonas guidance",
    sources: [
      buildSource("guideline", "IDSA 2024 AMR", "Preferred newer beta-lactams and susceptibility-based escalation framework for DTR Pseudomonas, 2024."),
      buildSource("trial", "ASPECT-NP", "Ceftolozane-tazobactam for nosocomial pneumonia including resistant Pseudomonas."),
      buildSource("trial", "RESTORE-IMI", "Imipenem-cilastatin-relebactam versus colistin-based therapy for imipenem-nonsusceptible infections."),
    ],
  }),
  "amr-gn/crab-steno": withConfidence("emerging", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "IDSA 2024 CRAB/Stenotrophomonas guidance",
    sources: [
      buildSource("guideline", "IDSA 2024 AMR", "Guidance for CRAB and Stenotrophomonas with emphasis on combination therapy and selective use of newer agents, 2024."),
      buildSource("trial", "ATTACK", "Sulbactam-durlobactam versus colistin for Acinetobacter baumannii-calcoaceticus complex infection, 2023."),
      buildSource("trial", "CREDIBLE-CR", "Cefiderocol resistant gram-negative outcomes including Acinetobacter subgroup concerns."),
    ],
  }),
  "advanced-agents/cre-management": withConfidence("moderate", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "Advanced CRE agent review 2024",
    sources: [
      buildSource("guideline", "IDSA 2024 AMR", "Agent selection across KPC, OXA, and MBL resistance mechanisms."),
      buildSource("trial", "TANGO II", "Meropenem-vaborbactam comparative data in CRE infections."),
      buildSource("trial", "REPRISE", "Ceftazidime-avibactam resistant gram-negative treatment data."),
    ],
  }),
  "advanced-agents/mdr-pseudomonas": withConfidence("moderate", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "Advanced DTR Pseudomonas agent review 2024",
    sources: [
      buildSource("guideline", "IDSA 2024 AMR", "Mechanism-aware DTR Pseudomonas escalation strategy."),
      buildSource("trial", "ASPECT-NP", "Ceftolozane-tazobactam pulmonary efficacy data."),
      buildSource("trial", "RESTORE-IMI", "Imipenem-cilastatin-relebactam data for imipenem-resistant Pseudomonas."),
    ],
  }),
  "febrile-neutropenia/high-risk-fn": withConfidence("high", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "IDSA/NCCN high-risk FN guidance",
    sources: [
      buildSource("guideline", "IDSA febrile neutropenia", "High-risk inpatient febrile neutropenia management and initial anti-pseudomonal coverage."),
      buildSource("guideline", "NCCN fever and neutropenia", "Risk-based escalation and antifungal trigger guidance."),
      buildSource("consensus", "MASCC/CISNE", "Risk tools used to separate outpatient from high-risk inpatient care."),
    ],
  }),
  "febrile-neutropenia/fn-with-fungal-risk": withConfidence("moderate", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "Persistent FN fungal-risk guidance",
    sources: [
      buildSource("guideline", "IDSA febrile neutropenia", "Persistent fever evaluation and empiric antifungal thresholds."),
      buildSource("guideline", "IDSA aspergillosis", "Diagnostic and treatment framing for invasive mold infection."),
      buildSource("review", "Galactomannan/CT strategy", "High-resolution CT and serial biomarker literature in prolonged neutropenia."),
    ],
  }),
  "bacteremia-endocarditis/sab-workup": withConfidence("high", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "SAB workup and IE-screening review 2023",
    sources: [
      buildSource("guideline", "AHA/ACC 2023 IE", "Imaging, blood culture clearance, and infective endocarditis workup standards relevant to S. aureus bacteremia."),
      buildSource("trial", "ARREST", "Adjunctive rifampin trial reinforcing the need for disciplined SAB management and source control, Lancet 2018."),
      buildSource("review", "SAB bundle literature", "Management-bundle and echocardiography literature for high-risk S. aureus bacteremia."),
    ],
  }),
  "bacteremia-endocarditis/native-valve-ie": withConfidence("high", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "AHA/ACC 2023 native-valve IE update",
    sources: [
      buildSource("guideline", "AHA/ACC 2023 IE", "Current diagnostic and treatment recommendations for native-valve infective endocarditis."),
      buildSource("trial", "POET", "Partial oral treatment strategy in stabilized left-sided infective endocarditis, NEJM 2019."),
      buildSource("review", "Endocarditis surgery review", "Operative timing and multidisciplinary endocarditis-team literature."),
    ],
  }),
  "bacteremia-endocarditis/prosthetic-valve-ie": withConfidence("moderate", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "AHA/ACC 2023 prosthetic-valve IE update",
    sources: [
      buildSource("guideline", "AHA/ACC 2023 IE", "Guidance for prosthetic-valve endocarditis, surgery triggers, and organism-directed therapy."),
      buildSource("review", "Prosthetic valve IE literature", "Observational evidence and surgical literature for prosthetic-valve endocarditis."),
      buildSource("review", "Rifampin/gentamicin stewardship", "Evidence reassessment for adjunctive rifampin and aminoglycosides in prosthetic-valve IE."),
    ],
  }),
  "bacteremia-endocarditis/gram-negative-bacteremia": withConfidence("high", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "Modern uncomplicated GNB duration review",
    sources: [
      buildSource("trial", "BALANCE", "Seven versus fourteen days for bloodstream infection, 2024."),
      buildSource("trial", "Yahav short-course trial", "Seven versus fourteen days for uncomplicated gram-negative bacteremia, 2019."),
      buildSource("review", "Oral step-down bacteremia literature", "IV-to-oral transition and source-specific duration literature for uncomplicated gram-negative bacteremia."),
    ],
  }),
  "bacteremia-endocarditis/opat-considerations": withConfidence("moderate", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "OPAT stewardship review 2024",
    sources: [
      buildSource("guideline", "AHA/ACC 2023 IE", "Outpatient treatment considerations and follow-up needs for stabilized endocarditis and bacteremia."),
      buildSource("trial", "POET", "Selective oral step-down model for stable endocarditis patients."),
      buildSource("review", "OPAT stewardship", "Monitoring, line-care, and adverse-event prevention literature for outpatient parenteral therapy."),
    ],
  }),
  "sepsis/sepsis-community": withConfidence("high", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "Community-acquired sepsis empiric review 2024",
    sources: [
      buildSource("guideline", "SSC 2021", "Early sepsis recognition, antibiotics, and hemodynamic management."),
      buildSource("guideline", "IDSA 2024 sepsis guidance", "Antimicrobial source-based empiric framing and de-escalation priorities."),
      buildSource("trial", "CLOVERS", "Fluid strategy data after initial sepsis resuscitation, NEJM 2023."),
    ],
  }),
  "sepsis/sepsis-hcap": withConfidence("moderate", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "Healthcare-associated sepsis empiric review 2024",
    sources: [
      buildSource("guideline", "SSC 2021", "Core septic shock bundle and timing recommendations."),
      buildSource("guideline", "IDSA 2024 sepsis guidance", "Healthcare exposure, resistant-pathogen risk, and de-escalation framing for sepsis."),
      buildSource("consensus", "AMR risk stratification", "Mechanism-aware resistant-pathogen coverage principles for healthcare-associated sepsis."),
    ],
  }),
  "sepsis/septic-shock": withConfidence("high", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "SSC 2021 septic shock guidance",
    sources: [
      buildSource("guideline", "SSC 2021", "Septic shock bundles, vasopressor targets, and early antimicrobial recommendations."),
      buildSource("trial", "CLOVERS", "Restrictive versus liberal fluids after initial resuscitation in sepsis, NEJM 2023."),
      buildSource("trial", "BALANCE", "Shorter-course bloodstream infection data informing de-escalation once source control is achieved, 2024."),
    ],
  }),
};

export const MONOGRAPH_CONTENT_META: Record<string, ContentMeta> = {
  "ceftazidime-avibactam": withConfidence("moderate", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "KPC-CRE and resistant Enterobacterales data",
    sources: [
      buildSource("guideline", "IDSA 2024 AMR", "Preferred use for KPC-producing CRE and other select resistant gram-negative infections."),
      buildSource("trial", "REPRISE", "Phase 3 ceftazidime-avibactam data in ceftazidime-resistant gram-negative infections."),
      buildSource("review", "KPC observational outcomes", "Real-world outcomes literature in bloodstream and deep-seated KPC infections."),
    ],
  }),
  "meropenem-vaborbactam": withConfidence("moderate", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "KPC-CRE beta-lactam/BLI data",
    sources: [
      buildSource("guideline", "IDSA 2024 AMR", "Preferred KPC-producing CRE therapy when susceptible."),
      buildSource("trial", "TANGO II", "Comparative meropenem-vaborbactam outcomes versus best available therapy for CRE infections."),
      buildSource("trial", "TANGO I", "Registration data for complicated urinary tract infection."),
    ],
  }),
  cefiderocol: withConfidence("emerging", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "Cefiderocol resistant gram-negative evidence review",
    sources: [
      buildSource("guideline", "IDSA 2024 AMR", "Selective use in MBL producers and salvage scenarios."),
      buildSource("trial", "CREDIBLE-CR", "Pathogen-specific outcomes and mortality signal discussion in CR infections."),
      buildSource("trial", "APEKS-NP", "Nosocomial pneumonia noninferiority data including resistant gram-negative organisms."),
    ],
  }),
  "ceftolozane-tazobactam": withConfidence("moderate", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "DTR Pseudomonas targeted beta-lactam data",
    sources: [
      buildSource("guideline", "IDSA 2024 AMR", "Preferred use for difficult-to-treat Pseudomonas when susceptible."),
      buildSource("trial", "ASPECT-NP", "Phase 3 HAP/VAP data with resistant Pseudomonas representation."),
      buildSource("trial", "ASPECT-cUTI/cIAI", "Registration studies informing dosing and exposure targets."),
    ],
  }),
  "imipenem-cilastatin-relebactam": withConfidence("moderate", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "Relebactam resistant Pseudomonas and CRE data",
    sources: [
      buildSource("guideline", "IDSA 2024 AMR", "Mechanism-based use in select KPC and DTR Pseudomonas isolates."),
      buildSource("trial", "RESTORE-IMI", "Comparative outcomes versus colistin-based therapy in imipenem-nonsusceptible infections."),
      buildSource("trial", "RESTORE-IMI 2", "Nosocomial pneumonia data for imipenem-cilastatin-relebactam."),
    ],
  }),
  colistin: withConfidence("emerging", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "Colistin salvage-use evidence review",
    sources: [
      buildSource("guideline", "IDSA 2024 AMR", "Reserve role due to nephrotoxicity and inferior outcomes when newer agents are available."),
      buildSource("trial", "AIDA", "Colistin-based combination therapy data in carbapenem-resistant gram-negative infection."),
      buildSource("review", "Polymyxin toxicity literature", "Nephrotoxicity and PK limitations of polymyxins in critically ill patients."),
    ],
  }),
  tedizolid: withConfidence("emerging", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "Tedizolid stewardship evidence review",
    sources: [
      buildSource("guideline", "ABSSSI labeling and stewardship reviews", "Evidence base is strongest in skin/soft tissue infection rather than invasive MRSA infection."),
      buildSource("trial", "ESTABLISH", "Tedizolid versus linezolid for acute bacterial skin and skin-structure infection."),
      buildSource("review", "Long-course tedizolid experience", "Limited observational data for prolonged use outside labeled indications."),
    ],
  }),
  posaconazole: withConfidence("moderate", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "Posaconazole prophylaxis and salvage-use data",
    sources: [
      buildSource("guideline", "IDSA aspergillosis", "Role in prophylaxis and salvage therapy for invasive mold disease."),
      buildSource("trial", "AML/MDS prophylaxis data", "Posaconazole prophylaxis superiority in prolonged neutropenia."),
      buildSource("review", "Therapeutic drug monitoring", "Exposure targets and formulation-specific PK guidance."),
    ],
  }),
  "liposomal-amphotericin-b": withConfidence("moderate", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "L-AmB invasive fungal infection guidance",
    sources: [
      buildSource("guideline", "IDSA candidiasis/aspergillosis", "Core role in invasive candidiasis salvage and mold-active therapy."),
      buildSource("guideline", "Mucormycosis guidance", "First-line role in mucormycosis and severe endemic mycoses."),
      buildSource("review", "Nephrotoxicity mitigation", "Dose, electrolyte, and renal monitoring literature for lipid amphotericin formulations."),
    ],
  }),
  vancomycin: withConfidence("high", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "AUC-guided vancomycin monitoring review",
    sources: [
      buildSource("guideline", "ASHP/IDSA/PIDS 2020 vancomycin", "Consensus guideline for AUC-guided therapeutic monitoring of vancomycin."),
      buildSource("guideline", "AHA/ACC 2023 IE", "Organism-specific roles for vancomycin in endocarditis and bloodstream infection."),
      buildSource("review", "AUC stewardship literature", "Clinical outcomes and nephrotoxicity literature supporting AUC-guided dosing."),
    ],
  }),
  daptomycin: withConfidence("moderate", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "High-dose daptomycin SAB/IE review",
    sources: [
      buildSource("guideline", "AHA/ACC 2023 IE", "Daptomycin role in right-sided and left-sided staphylococcal endocarditis management."),
      buildSource("review", "High-dose daptomycin literature", "Bacteremia and endocarditis outcomes with high-dose daptomycin strategies."),
      buildSource("review", "Combination salvage therapy", "Evidence for daptomycin-based salvage approaches in persistent MRSA bacteremia."),
    ],
  }),
  cefazolin: withConfidence("moderate", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "MSSA bacteremia beta-lactam review",
    sources: [
      buildSource("guideline", "AHA/ACC 2023 IE", "Cefazolin role in MSSA bacteremia and endocarditis treatment."),
      buildSource("review", "Cefazolin versus ASP literature", "Comparative outcomes literature against anti-staphylococcal penicillins in MSSA bacteremia."),
      buildSource("review", "Cefazolin inoculum effect", "Pharmacodynamic and inoculum-effect literature relevant to deep-seated MSSA infection."),
    ],
  }),
  nafcillin: withConfidence("moderate", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "Anti-staphylococcal penicillin review",
    sources: [
      buildSource("guideline", "AHA/ACC 2023 IE", "Preferred beta-lactam therapy framework for MSSA endocarditis."),
      buildSource("review", "MSSA bacteremia literature", "Historical standard-of-care outcomes with nafcillin and oxacillin."),
      buildSource("review", "OPAT tolerability review", "Hepatic, renal, and sodium-load considerations during prolonged anti-staphylococcal penicillin therapy."),
    ],
  }),
  ceftriaxone: withConfidence("moderate", {
    lastReviewed: CONTENT_REVIEWED_ON,
    guidelineVersion: "Ceftriaxone endocarditis/OPAT review",
    sources: [
      buildSource("guideline", "AHA/ACC 2023 IE", "Ceftriaxone role in streptococcal endocarditis and select gram-negative bloodstream infections."),
      buildSource("review", "Once-daily OPAT literature", "Ceftriaxone suitability for outpatient therapy and simplified administration."),
      buildSource("review", "Biliary/urinary source bacteremia", "Source-specific stewardship literature supporting ceftriaxone de-escalation when susceptible."),
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

type ContentCarrier = { contentMeta?: ContentMeta | null };

export function resolveContentMeta(primary?: ContentCarrier | null, fallback?: ContentCarrier | null) {
  if (primary?.contentMeta) {
    return { meta: primary.contentMeta, inherited: false };
  }

  if (fallback?.contentMeta) {
    return { meta: fallback.contentMeta, inherited: true };
  }

  return { meta: null, inherited: false };
}

export function requiresExplicitSubcategoryMeta(diseaseId: string, subcategoryId: string) {
  return PRIORITY_SUBCATEGORY_META_KEYS.includes(`${diseaseId}/${subcategoryId}` as (typeof PRIORITY_SUBCATEGORY_META_KEYS)[number]);
}

export function requiresExplicitMonographMeta(monographId: string) {
  return PRIORITY_MONOGRAPH_META_KEYS.includes(monographId as (typeof PRIORITY_MONOGRAPH_META_KEYS)[number]);
}

export function attachDiseaseMetadata<T extends DiseaseState>(disease: T): T {
  const diseaseMeta = disease.contentMeta ?? DISEASE_CONTENT_META[disease.id];

  return {
    ...disease,
    contentMeta: diseaseMeta,
    subcategories: disease.subcategories.map((subcategory) => ({
      ...subcategory,
      contentMeta: subcategory.contentMeta ?? SUBCATEGORY_CONTENT_META[`${disease.id}/${subcategory.id}`],
    })),
    drugMonographs: disease.drugMonographs.map((monograph) => ({
      ...monograph,
      contentMeta: monograph.contentMeta ?? MONOGRAPH_CONTENT_META[monograph.id],
    })),
  };
}
