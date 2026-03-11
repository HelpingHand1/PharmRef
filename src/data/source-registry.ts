import type { ContentSource, EvidenceSource } from "../types";

type SourceRegistryIssue = {
  scope: string;
  message: string;
};

type ResolvedContentSource = EvidenceSource & ContentSource;

function source(
  id: string,
  kind: EvidenceSource["kind"],
  label: string,
  extras: Partial<Omit<EvidenceSource, "id" | "kind" | "label">> = {},
): EvidenceSource {
  return { id, kind, label, ...extras };
}

function normalizeSourceText(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

const SOURCE_LIST: EvidenceSource[] = [
  source("idsa-2025-cuti", "guideline", "IDSA 2025 cUTI", {
    aliases: ["IDSA 2025 cUTI Guideline", "IDSA 2025 cUTI Guideline (NEW)"],
    searchQuery: "IDSA 2025 complicated urinary tract infection guidance",
  }),
  source("idsa-escmid-2011-uti", "guideline", "IDSA/ESCMID 2011", {
    aliases: ["IDSA 2011"],
    searchQuery: "IDSA ESCMID 2011 uncomplicated cystitis pyelonephritis guideline",
  }),
  source("eau-2024-uti", "guideline", "EAU 2024", {
    searchQuery: "EAU 2024 urinary tract infection guideline",
  }),
  source("ats-idsa-2019-cap", "guideline", "ATS/IDSA 2019 CAP", {
    aliases: ["IDSA/ATS 2019", "IDSA CAP 2019", "ATS/IDSA 2019 CAP Guidelines"],
    searchQuery: "ATS IDSA 2019 community acquired pneumonia guideline",
  }),
  source("cape-cod", "trial", "CAPE COD", {
    aliases: ["CAPE COD Trial (2023, NEJM)"],
    searchQuery: "CAPE COD hydrocortisone severe community acquired pneumonia NEJM 2023",
  }),
  source("step-trial", "trial", "STEP", {
    aliases: ["STEP Trial (2023, NEJM)"],
    searchQuery: "STEP trial amoxicillin community acquired pneumonia NEJM 2023",
  }),
  source("ats-idsa-2016-hap-vap", "guideline", "ATS/IDSA 2016 HAP/VAP", {
    aliases: ["IDSA/ATS 2016", "ATS/IDSA 2016 HAP/VAP Guidelines"],
    searchQuery: "ATS IDSA 2016 hospital acquired ventilator associated pneumonia guideline",
  }),
  source("idsa-2024-amr", "guideline", "IDSA 2024 AMR guidance", {
    aliases: ["IDSA 2024 AMR", "IDSA 2024 AMR guidance", "IDSA AMR guidance", "IDSA 2024 AMR Guidance v4.0 (Tamma et al., CID 2024)"],
    url: "https://www.idsociety.org/practice-guideline/amr-guidance/",
  }),
  source("pkpd-stewardship", "consensus", "PK/PD stewardship", {
    searchQuery: "PK PD extended infusion beta lactam stewardship review",
  }),
  source("smart-trial", "trial", "SMART", {
    searchQuery: "SMART trial balanced crystalloids versus saline ICU NEJM 2018",
  }),
  source("idsa-2014-ssti", "guideline", "IDSA SSTI", {
    aliases: ["IDSA 2014", "IDSA 2014 SSTI Guidelines (NF component)", "IDSA 2014 SSTI Guidelines (Practice Guidelines for the Diagnosis and Management of SSTIs)"],
    searchQuery: "IDSA 2014 skin soft tissue infection guideline",
  }),
  source("oviva", "trial", "OVIVA", {
    aliases: ["OVIVA Trial (Li et al., NEJM 2019)"],
    searchQuery: "OVIVA oral versus intravenous antibiotics NEJM 2019",
  }),
  source("sis-idsa-iai", "guideline", "SIS/IDSA IAI", {
    aliases: [
      "SIS/IDSA 2017",
      "IDSA/SIS 2010 — Guidelines for Diagnosis and Management of cIAI (Solomkin et al.)",
      "SIS/IDSA 2017 Revised Guidelines (Mazuski et al.)",
    ],
    searchQuery: "SIS IDSA intra abdominal infection guideline",
  }),
  source("tokyo-guidelines", "guideline", "Tokyo Guidelines", {
    aliases: ["Tokyo Guidelines 2018 (TG18) — Acute Cholangitis and Cholecystitis"],
    searchQuery: "Tokyo Guidelines acute cholangitis cholecystitis",
  }),
  source("stop-it", "trial", "STOP-IT", {
    aliases: ["STOP-IT Trial (Sawyer et al., 2015 NEJM)", "STOP-IT (Sawyer et al., 2015 NEJM)"],
    searchQuery: "STOP-IT short course antimicrobial therapy intra abdominal infection NEJM 2015",
  }),
  source("aha-acc-2023-ie", "guideline", "AHA/ACC 2023 IE", {
    aliases: ["AHA/IDSA 2023", "AHA/ACC 2023 IE Guideline Update"],
    searchQuery: "AHA ACC 2023 infective endocarditis guideline",
  }),
  source("poet", "trial", "POET", {
    aliases: ["POET Trial (Iversen et al., NEJM 2019)"],
    doi: "10.1056/NEJMoa1808312",
    searchQuery: "POET partial oral treatment endocarditis NEJM 2019",
  }),
  source("arrest", "trial", "ARREST", {
    aliases: ["ARREST Trial (Thwaites et al., Lancet 2018)"],
    pmid: "29249276",
    searchQuery: "ARREST rifampin Staphylococcus aureus bacteremia Lancet 2018",
  }),
  source("idsa-shea-cdi", "guideline", "IDSA/SHEA CDI", {
    aliases: ["IDSA/SHEA 2021", "IDSA/SHEA 2021 Focused Update", "IDSA/SHEA 2017 CDI Guidelines"],
    searchQuery: "IDSA SHEA Clostridioides difficile guideline",
  }),
  source("fidaxomicin-trials", "trial", "Fidaxomicin trials", {
    aliases: ["EXTEND Trial (Cornely et al., CID 2012)"],
    searchQuery: "fidaxomicin recurrence trial Clostridioides difficile",
  }),
  source("fmt-stewardship", "review", "FMT stewardship", {
    searchQuery: "fecal microbiota transplant recurrent Clostridioides difficile review",
  }),
  source("idsa-pji-osteomyelitis", "guideline", "IDSA PJI/osteomyelitis", {
    aliases: ["IDSA 2015 Vertebral Osteomyelitis Guidelines", "IDSA 2013 Prosthetic Joint Infection Guidelines"],
    searchQuery: "IDSA prosthetic joint infection osteomyelitis guideline",
  }),
  source("orthopedic-id-review", "review", "Orthopedic ID review", {
    searchQuery: "orthopedic infection review source control oral step down",
  }),
  source("idsa-meningitis-ventriculitis", "guideline", "IDSA meningitis/ventriculitis", {
    aliases: ["IDSA 2017 Healthcare-Associated Ventriculitis/Meningitis"],
    searchQuery: "IDSA bacterial meningitis healthcare associated ventriculitis guideline",
  }),
  source("aan-idsa-encephalitis", "guideline", "AAN/IDSA encephalitis references", {
    searchQuery: "AAN IDSA encephalitis guideline",
  }),
  source("dexamethasone-meningitis", "trial", "Dexamethasone meningitis data", {
    aliases: ["de Gans & van de Beek, NEJM 2002 — Dexamethasone in Meningitis"],
    searchQuery: "dexamethasone bacterial meningitis trial",
  }),
  source("idsa-candidiasis", "guideline", "IDSA candidiasis", {
    aliases: [
      "IDSA Candidiasis 2016",
      "IDSA Candidiasis Guidelines 2016",
      "IDSA 2016 Clinical Practice Guideline for the Management of Candidiasis",
      "IDSA 2016 Candidiasis Guidelines",
    ],
    searchQuery: "IDSA candidiasis guideline 2016",
  }),
  source("idsa-aspergillosis", "guideline", "IDSA aspergillosis", {
    aliases: ["IDSA 2016 Practice Guidelines for Diagnosis and Management of Aspergillosis"],
    searchQuery: "IDSA aspergillosis guideline 2016",
  }),
  source("secure-trial", "trial", "SECURE", {
    aliases: ["Maertens et al., Lancet 2016 — SECURE Trial: Isavuconazole for Invasive Aspergillosis/Mucormycosis"],
    searchQuery: "SECURE isavuconazole voriconazole aspergillosis Lancet 2016",
  }),
  source("idsa-2022-amr", "guideline", "IDSA 2022 AMR guidance", {
    aliases: ["IDSA 2022", "IDSA 2022 Guidance on Resistant Gram-Negative Infections"],
    searchQuery: "IDSA 2022 antimicrobial resistant gram negative guidance",
  }),
  source("idsa-2023-amr", "guideline", "IDSA 2023 AMR guidance", {
    aliases: ["IDSA AMR Guidance 2023"],
    searchQuery: "IDSA 2023 antimicrobial resistant gram negative guidance",
  }),
  source("idsa-2023-cre-guidance", "guideline", "IDSA CRE guidance 2023", {
    aliases: ["IDSA CRE Guidance 2023"],
    searchQuery: "IDSA 2023 CRE guidance",
  }),
  source("aspect-program", "trial", "ASPECT", {
    searchQuery: "ASPECT ceftolozane tazobactam trial",
  }),
  source("restore-imi", "trial", "RESTORE-IMI", {
    searchQuery: "RESTORE IMI relebactam trial",
  }),
  source("idsa-febrile-neutropenia", "guideline", "IDSA febrile neutropenia", {
    aliases: ["IDSA 2010", "IDSA 2010 Febrile Neutropenia Guideline"],
    searchQuery: "IDSA febrile neutropenia guideline",
  }),
  source("nccn-fever-neutropenia", "guideline", "NCCN fever and neutropenia", {
    aliases: ["NCCN 2024", "NCCN 2024 Prevention and Treatment of Cancer-Related Infections"],
    searchQuery: "NCCN fever and neutropenia guideline",
  }),
  source("mascc-cisne", "consensus", "MASCC/CISNE", {
    aliases: [
      "MASCC Risk Index (Multinational Association for Supportive Care in Cancer)",
      "CISNE Score (Clinical Index of Stable Febrile Neutropenia)",
    ],
    searchQuery: "MASCC CISNE febrile neutropenia risk stratification",
  }),
  source("iwgdf-idsa-dfi", "guideline", "IWGDF/IDSA DFI", {
    aliases: ["IDSA/IWGDF 2023", "IDSA/IWGDF 2023 Diabetic Foot Infection Guidelines", "IDSA 2023 Diabetic Foot Infection Guidelines (Update)"],
    searchQuery: "IWGDF IDSA diabetic foot infection guideline",
  }),
  source("osteomyelitis-stewardship", "review", "Osteomyelitis stewardship", {
    searchQuery: "osteomyelitis stewardship oral step down review",
  }),
  source("source-control-principles", "consensus", "Source-control principles", {
    searchQuery: "source control principles infection review",
  }),
  source("ssc-2021", "guideline", "SSC 2021", {
    aliases: [
      "Surviving Sepsis Campaign 2021",
      "Surviving Sepsis Campaign (SSC) 2021 International Guidelines",
      "Surviving Sepsis Campaign 2021 International Guidelines",
    ],
    url: "https://www.sccm.org/clinical-resources/guidelines/guidelines/surviving-sepsis-guidelines-2021",
  }),
  source("idsa-2024-sepsis", "guideline", "IDSA 2024 sepsis guidance", {
    aliases: ["IDSA 2024 Sepsis Antimicrobial Guidance"],
    searchQuery: "IDSA 2024 sepsis antimicrobial guidance",
  }),
  source("balance", "trial", "BALANCE", {
    aliases: ["BALANCE Trial 2024 — 7 vs. 14 Days for Non-Endocarditis Bacteremia"],
    pmid: "39565030",
    searchQuery: "BALANCE bloodstream infection seven versus fourteen days trial",
  }),
  source("tango-ii", "trial", "TANGO II", {
    aliases: ["TANGO II (Wunderink et al., 2018 CID)"],
    pmid: "30270406",
    searchQuery: "TANGO II meropenem vaborbactam trial",
  }),
  source("reprise", "trial", "REPRISE", {
    pmid: "27107460",
    searchQuery: "REPRISE ceftazidime avibactam trial",
  }),
  source("aztreonam-avibactam-evidence", "review", "Aztreonam-avibactam evidence", {
    searchQuery: "aztreonam avibactam evidence review NDM VIM IMP",
  }),
  source("credible-cr", "trial", "CREDIBLE-CR", {
    aliases: ["TANGO III / CREDIBLE-CR (Bassetti et al., 2021 Lancet ID)"],
    searchQuery: "CREDIBLE CR cefiderocol trial",
  }),
  source("aspect-np", "trial", "ASPECT-NP", {
    aliases: ["ASPECT-cUTI / ASPECT-NP Trials (Ceftolozane-Tazobactam)"],
    pmid: "31563344",
    searchQuery: "ASPECT NP ceftolozane tazobactam trial",
  }),
  source("attack", "trial", "ATTACK", {
    aliases: ["ATTACK Trial (Kaye et al., 2023 Lancet ID)"],
    pmid: "37182534",
    searchQuery: "ATTACK sulbactam durlobactam Acinetobacter trial",
  }),
  source("galactomannan-ct-strategy", "review", "Galactomannan/CT strategy", {
    searchQuery: "galactomannan CT strategy neutropenia review",
  }),
  source("sab-bundle-literature", "review", "SAB bundle literature", {
    searchQuery: "Staphylococcus aureus bacteremia bundle literature review",
  }),
  source("endocarditis-surgery-review", "review", "Endocarditis surgery review", {
    searchQuery: "endocarditis surgery timing review",
  }),
  source("prosthetic-valve-ie-literature", "review", "Prosthetic valve IE literature", {
    searchQuery: "prosthetic valve infective endocarditis review",
  }),
  source("rifampin-gentamicin-stewardship", "review", "Rifampin/gentamicin stewardship", {
    searchQuery: "rifampin gentamicin prosthetic valve endocarditis review",
  }),
  source("yahav-short-course-gnb", "trial", "Yahav short-course trial", {
    searchQuery: "Yahav seven versus fourteen days gram negative bacteremia trial",
  }),
  source("oral-stepdown-bacteremia", "review", "Oral step-down bacteremia literature", {
    searchQuery: "oral step down gram negative bacteremia review",
  }),
  source("opat-stewardship", "review", "OPAT stewardship", {
    searchQuery: "outpatient parenteral antimicrobial therapy stewardship review",
  }),
  source("amr-risk-stratification", "consensus", "AMR risk stratification", {
    searchQuery: "antimicrobial resistance risk stratification sepsis consensus",
  }),
  source("kpc-observational-outcomes", "review", "KPC observational outcomes", {
    searchQuery: "KPC observational outcomes ceftazidime avibactam review",
  }),
  source("tango-i", "trial", "TANGO I", {
    searchQuery: "TANGO I meropenem vaborbactam cUTI trial",
  }),
  source("apeks-np", "trial", "APEKS-NP", {
    searchQuery: "APEKS NP cefiderocol pneumonia trial",
  }),
  source("aspect-cuti-ciai", "trial", "ASPECT-cUTI/cIAI", {
    searchQuery: "ASPECT cUTI cIAI ceftolozane tazobactam trial",
  }),
  source("restore-imi-2", "trial", "RESTORE-IMI 2", {
    pmid: "32785589",
    searchQuery: "RESTORE IMI 2 trial",
  }),
  source("aida", "trial", "AIDA", {
    searchQuery: "AIDA colistin carbapenem resistant gram negative trial",
  }),
  source("absssi-labeling-stewardship", "review", "ABSSSI labeling and stewardship reviews", {
    searchQuery: "ABSSSI labeling stewardship tedizolid review",
  }),
  source("establish", "trial", "ESTABLISH", {
    searchQuery: "ESTABLISH tedizolid linezolid trial",
  }),
  source("long-course-tedizolid", "review", "Long-course tedizolid experience", {
    searchQuery: "long course tedizolid observational review",
  }),
  source("aml-mds-prophylaxis", "trial", "AML/MDS prophylaxis data", {
    searchQuery: "posaconazole AML MDS prophylaxis trial",
  }),
  source("therapeutic-drug-monitoring", "review", "Therapeutic drug monitoring", {
    searchQuery: "therapeutic drug monitoring posaconazole review",
  }),
  source("idsa-candidiasis-aspergillosis", "guideline", "IDSA candidiasis/aspergillosis", {
    searchQuery: "IDSA candidiasis aspergillosis guidance",
  }),
  source("mucormycosis-guidance", "guideline", "Mucormycosis guidance", {
    searchQuery: "mucormycosis guidance liposomal amphotericin B",
  }),
  source("nephrotoxicity-mitigation", "review", "Nephrotoxicity mitigation", {
    searchQuery: "liposomal amphotericin nephrotoxicity mitigation review",
  }),
  source("ashp-idsa-pids-2020-vancomycin", "guideline", "ASHP/IDSA/PIDS 2020 vancomycin", {
    aliases: ["ASHP/IDSA Vancomycin Guidelines 2020", "ASHP/IDSA/SIDP 2020 Vancomycin Monitoring Consensus"],
    pmid: "32658968",
    searchQuery: "ASHP IDSA PIDS 2020 vancomycin monitoring guideline",
  }),
  source("auc-stewardship", "review", "AUC stewardship literature", {
    searchQuery: "AUC stewardship vancomycin review",
  }),
  source("high-dose-daptomycin", "review", "High-dose daptomycin literature", {
    searchQuery: "high dose daptomycin bacteremia endocarditis review",
  }),
  source("combination-salvage-therapy", "review", "Combination salvage therapy", {
    searchQuery: "combination salvage therapy persistent MRSA bacteremia review",
  }),
  source("cefazolin-versus-asp", "review", "Cefazolin versus ASP literature", {
    searchQuery: "cefazolin versus anti staphylococcal penicillin MSSA bacteremia review",
  }),
  source("cefazolin-inoculum-effect", "review", "Cefazolin inoculum effect", {
    searchQuery: "cefazolin inoculum effect review",
  }),
  source("mssa-bacteremia-literature", "review", "MSSA bacteremia literature", {
    searchQuery: "MSSA bacteremia nafcillin oxacillin review",
  }),
  source("opat-tolerability", "review", "OPAT tolerability review", {
    searchQuery: "anti staphylococcal penicillin OPAT tolerability review",
  }),
  source("once-daily-opat", "review", "Once-daily OPAT literature", {
    searchQuery: "ceftriaxone once daily OPAT literature",
  }),
  source("biliary-urinary-source-bacteremia", "review", "Biliary/urinary source bacteremia", {
    searchQuery: "ceftriaxone urinary biliary source bacteremia review",
  }),
  source("polymyxin-toxicity", "review", "Polymyxin toxicity literature", {
    searchQuery: "polymyxin toxicity review",
  }),
  source("idsa-2004-bacterial-meningitis", "guideline", "IDSA 2004 bacterial meningitis", {
    aliases: ["IDSA 2004"],
    searchQuery: "IDSA 2004 bacterial meningitis guideline",
  }),
  source("fowler-2006-daptomycin", "trial", "Fowler et al., NEJM 2006", {
    aliases: ["Fowler et al., NEJM 2006"],
    searchQuery: "Fowler NEJM 2006 daptomycin Staphylococcus aureus bacteremia",
  }),
  source("idsa-hcap-guidance", "guideline", "IDSA HCAP guidance", {
    searchQuery: "healthcare associated pneumonia guidance",
  }),
  source("sepsispam", "trial", "SEPSISPAM Trial", {
    aliases: ["SEPSISPAM Trial NEJM 2014"],
    searchQuery: "SEPSISPAM trial NEJM 2014 septic shock",
  }),
  source("clovers", "trial", "CLOVERS", {
    pmid: "36688507",
    searchQuery: "CLOVERS trial sepsis NEJM 2023",
  }),
  source("merino", "trial", "MERINO", {
    aliases: [
      "MERINO Trial",
      "MERINO Trial JAMA 2018",
      "MERINO Trial (Harris et al., JAMA 2018)",
      "MERINO (Harris et al., 2018 JAMA)",
      "MERINO Trial (Paul et al., JAMA 2018) — Pip-Tazo vs. Meropenem for ESBL Bacteremia",
    ],
    pmid: "30208454",
    searchQuery: "MERINO trial piperacillin tazobactam meropenem ESBL bacteremia",
  }),
];

export const SOURCE_REGISTRY: Record<string, EvidenceSource> = Object.fromEntries(
  SOURCE_LIST.map((entry) => [entry.id, entry]),
);

const SOURCE_TEXT_TO_IDS = new Map<string, string[]>();
const SOURCE_REGISTRY_ISSUES: SourceRegistryIssue[] = [];

function registerAlias(alias: string, id: string) {
  const key = normalizeSourceText(alias);
  const existing = SOURCE_TEXT_TO_IDS.get(key);
  if (!existing) {
    SOURCE_TEXT_TO_IDS.set(key, [id]);
    return;
  }
  if (!existing.includes(id)) {
    SOURCE_REGISTRY_ISSUES.push({
      scope: `source alias "${alias}"`,
      message: `Alias resolves to multiple source ids (${existing.join(", ")}, ${id}).`,
    });
    SOURCE_TEXT_TO_IDS.set(key, [...existing, id]);
  }
}

SOURCE_LIST.forEach((entry) => {
  registerAlias(entry.label, entry.id);
  entry.aliases?.forEach((alias) => registerAlias(alias, entry.id));
});

const COMPOSITE_SOURCE_ALIASES: Record<string, string[]> = {
  [normalizeSourceText("SSC 2021, IDSA CAP 2019")]: ["ssc-2021", "ats-idsa-2019-cap"],
  [normalizeSourceText("SSC 2021; MERINO Trial JAMA 2018")]: ["ssc-2021", "merino"],
  [normalizeSourceText("SSC 2021; MERINO Trial")]: ["ssc-2021", "merino"],
  [normalizeSourceText("SSC 2021; ASHP/IDSA Vancomycin Guidelines 2020")]: ["ssc-2021", "ashp-idsa-pids-2020-vancomycin"],
  [normalizeSourceText("SSC 2021; IDSA Candidiasis 2016")]: ["ssc-2021", "idsa-candidiasis"],
  [normalizeSourceText("SSC 2021; IDSA Candidiasis Guidelines 2016")]: ["ssc-2021", "idsa-candidiasis"],
  [normalizeSourceText("SSC 2021; IDSA HCAP guidance")]: ["ssc-2021", "idsa-hcap-guidance"],
  [normalizeSourceText("SSC 2021; SEPSISPAM Trial NEJM 2014")]: ["ssc-2021", "sepsispam"],
};

function uniq<T>(items: T[]) {
  return [...new Set(items)];
}

export function resolveSourceEntry(sourceId: string) {
  return SOURCE_REGISTRY[sourceId] ?? null;
}

export function resolveContentSource(source: ContentSource): ResolvedContentSource | null {
  const entry = resolveSourceEntry(source.id);
  if (!entry) return null;
  return { ...entry, ...source };
}

export function resolveEvidenceSourceText(value?: string): EvidenceSource[] {
  if (!value?.trim()) return [];

  const normalized = normalizeSourceText(value);
  const exact = COMPOSITE_SOURCE_ALIASES[normalized] ?? SOURCE_TEXT_TO_IDS.get(normalized);
  if (exact?.length) {
    return uniq(exact).map((id) => SOURCE_REGISTRY[id]).filter(Boolean);
  }

  const splitIds = uniq(
    value
      .split(/\s*[;,]\s*/)
      .flatMap((part) => SOURCE_TEXT_TO_IDS.get(normalizeSourceText(part)) ?? []),
  );

  if (!splitIds.length) return [];
  return splitIds.map((id) => SOURCE_REGISTRY[id]).filter(Boolean);
}

export function getSourceHref(source: Pick<EvidenceSource, "url" | "doi" | "pmid">) {
  if (source.url) return source.url;
  if (source.doi) return `https://doi.org/${source.doi}`;
  if (source.pmid) return `https://pubmed.ncbi.nlm.nih.gov/${source.pmid}/`;
  return null;
}

export function getSourceLookupHref(
  source: Pick<EvidenceSource, "label" | "url" | "doi" | "pmid" | "searchQuery">,
  fallbackText?: string,
) {
  const direct = getSourceHref(source);
  if (direct) {
    return { href: direct, direct: true as const, label: "Open source" };
  }

  const query = encodeURIComponent(source.searchQuery ?? fallbackText ?? source.label);
  return {
    href: `https://pubmed.ncbi.nlm.nih.gov/?term=${query}`,
    direct: false as const,
    label: "Search PubMed",
  };
}

export function getSourceRegistryIssues() {
  return [...SOURCE_REGISTRY_ISSUES];
}

export function getSourceIdentifiers(source: Pick<EvidenceSource, "doi" | "pmid" | "url">) {
  const identifiers: string[] = [];
  if (source.pmid) identifiers.push(`PMID ${source.pmid}`);
  if (source.doi) identifiers.push(`DOI ${source.doi}`);
  if (!source.pmid && !source.doi && source.url) identifiers.push("Direct source");
  return identifiers;
}
