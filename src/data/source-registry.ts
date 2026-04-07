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
    url: "https://www.idsociety.org/practice-guideline/complicated-urinary-tract-infections/",
    searchQuery: "IDSA 2025 complicated urinary tract infection guidance",
  }),
  source("idsa-escmid-2011-uti", "guideline", "IDSA/ESCMID 2011", {
    aliases: ["IDSA 2011"],
    pmid: "21292654",
    searchQuery: "IDSA ESCMID 2011 uncomplicated cystitis pyelonephritis guideline",
  }),
  source("eau-2024-uti", "guideline", "EAU 2024", {
    url: "https://uroweb.org/guidelines/urological-infections/chapter/the-guideline",
    searchQuery: "EAU 2024 urinary tract infection guideline",
  }),
  source("ats-idsa-2019-cap", "guideline", "ATS/IDSA 2019 CAP", {
    aliases: ["IDSA/ATS 2019", "IDSA CAP 2019", "ATS/IDSA 2019 CAP Guidelines"],
    pmid: "31573350",
    doi: "10.1164/rccm.201908-1581ST",
    searchQuery: "ATS IDSA 2019 community acquired pneumonia guideline",
  }),
  source("cape-cod", "trial", "CAPE COD", {
    aliases: ["CAPE COD Trial (2023, NEJM)"],
    pmid: "36942789",
    doi: "10.1056/NEJMoa2215145",
    searchQuery: "CAPE COD hydrocortisone severe community acquired pneumonia NEJM 2023",
  }),
  source("el-moussaoui-2006-short-course-cap", "trial", "El Moussaoui et al. (2006) — 3 vs 8 Days", {
    aliases: [
      "El Moussaoui et al. (2006, BMJ) — 3 vs. 8 Days After Clinical Stability",
      "Short-course antibiotic treatment in community acquired pneumonia",
    ],
    pmid: "17183630",
    doi: "10.1136/bmj.332.7554.1355",
    searchQuery: "El Moussaoui 2006 short-course antibiotic treatment community acquired pneumonia",
  }),
  source("ats-idsa-2016-hap-vap", "guideline", "ATS/IDSA 2016 HAP/VAP", {
    aliases: ["IDSA/ATS 2016", "ATS/IDSA 2016 HAP/VAP Guidelines"],
    pmid: "27418577",
    doi: "10.1093/cid/ciw353",
    searchQuery: "ATS IDSA 2016 hospital acquired ventilator associated pneumonia guideline",
  }),
  source("idsa-2024-amr", "guideline", "IDSA 2024 AMR guidance", {
    aliases: ["IDSA 2024 AMR", "IDSA 2024 AMR guidance", "IDSA AMR guidance", "IDSA 2024 AMR Guidance v4.0 (Tamma et al., CID 2024)"],
    url: "https://www.idsociety.org/practice-guideline/amr-guidance/",
  }),
  source("pkpd-stewardship", "consensus", "PK/PD stewardship", {
    pmid: "27731492",
    searchQuery: "PK PD extended infusion beta lactam stewardship review",
  }),
  source("smart-trial", "trial", "SMART", {
    pmid: "29485925",
    doi: "10.1056/NEJMoa1711584",
    searchQuery: "SMART trial balanced crystalloids versus saline ICU NEJM 2018",
  }),
  source("idsa-2014-ssti", "guideline", "IDSA SSTI", {
    aliases: ["IDSA 2014", "IDSA 2014 SSTI Guidelines (NF component)", "IDSA 2014 SSTI Guidelines (Practice Guidelines for the Diagnosis and Management of SSTIs)"],
    pmid: "24947530",
    doi: "10.1093/cid/ciu296",
    searchQuery: "IDSA 2014 skin soft tissue infection guideline",
  }),
  source("oviva", "trial", "OVIVA", {
    aliases: ["OVIVA Trial (Li et al., NEJM 2019)"],
    pmid: "30699315",
    doi: "10.1056/NEJMoa1710926",
    searchQuery: "OVIVA oral versus intravenous antibiotics NEJM 2019",
  }),
  source("idsa-sis-2010-ciai", "guideline", "IDSA/SIS 2010 cIAI Guideline", {
    aliases: [
      "IDSA/SIS 2010 — Guidelines for Diagnosis and Management of cIAI (Solomkin et al.)",
      "IDSA/SIS 2010",
    ],
    pmid: "20034345",
    doi: "10.1086/649554",
    searchQuery: "SIS IDSA intra abdominal infection guideline",
  }),
  source("sis-2017-ciai", "guideline", "SIS 2017 Revised cIAI Guideline", {
    aliases: [
      "SIS/IDSA 2017",
      "SIS/IDSA 2017 Revised Guidelines (Mazuski et al.)",
      "SIS 2017",
    ],
    pmid: "28882984",
    doi: "10.1089/sur.2016.261",
    searchQuery: "Mazuski 2017 surgical infection society revised guidelines intra abdominal infection",
  }),
  source("tokyo-guidelines", "guideline", "Tokyo Guidelines 2018 Antimicrobial Therapy", {
    aliases: ["Tokyo Guidelines 2018 (TG18) — Acute Cholangitis and Cholecystitis"],
    pmid: "29090866",
    doi: "10.1002/jhbp.518",
    searchQuery: "Tokyo Guidelines acute cholangitis cholecystitis",
  }),
  source("stop-it", "trial", "STOP-IT", {
    aliases: ["STOP-IT Trial (Sawyer et al., 2015 NEJM)", "STOP-IT (Sawyer et al., 2015 NEJM)"],
    pmid: "25992746",
    doi: "10.1056/NEJMoa1411162",
    searchQuery: "STOP-IT short course antimicrobial therapy intra abdominal infection NEJM 2015",
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
    aliases: ["IDSA/SHEA CDI guidance"],
    pmid: "34164674",
    doi: "10.1093/cid/ciab549",
    searchQuery: "IDSA SHEA Clostridioides difficile guideline",
  }),
  source("fidaxomicin-trials", "trial", "Fidaxomicin trials", {
    aliases: ["Fidaxomicin recurrence trials"],
    pmid: "21288078",
    doi: "10.1056/NEJMoa0910812",
    searchQuery: "fidaxomicin recurrence trial Clostridioides difficile",
  }),
  source("fmt-stewardship", "review", "FMT stewardship", {
    pmid: "38395525",
    searchQuery: "fecal microbiota transplant recurrent Clostridioides difficile review",
  }),
  source("idsa-pji-osteomyelitis", "guideline", "IDSA PJI/osteomyelitis", {
    aliases: ["IDSA PJI/osteomyelitis guidance"],
    searchQuery: "IDSA prosthetic joint infection osteomyelitis guideline",
  }),
  source("idsa-2013-pji", "guideline", "IDSA 2013 Prosthetic Joint Infection Guideline", {
    aliases: ["IDSA prosthetic joint infection guideline", "IDSA PJI guideline 2013"],
    pmid: "23223583",
    doi: "10.1093/cid/cis803",
    searchQuery: "IDSA 2013 prosthetic joint infection guideline",
  }),
  source("orthopedic-id-review", "review", "Orthopedic ID review", {
    aliases: ["The Use of Oral Antibiotics After Total Joint Arthroplasty: A Critical Analysis Review"],
    pmid: "37812675",
    doi: "10.2106/JBJS.RVW.23.00083",
    searchQuery: "oral antibiotics after total joint arthroplasty critical analysis review",
  }),
  source("idsa-meningitis-ventriculitis", "guideline", "IDSA meningitis/ventriculitis", {
    aliases: ["IDSA meningitis/ventriculitis guidance"],
    searchQuery: "IDSA bacterial meningitis healthcare associated ventriculitis guideline",
  }),
  source("aan-idsa-encephalitis", "guideline", "AAN/IDSA encephalitis references", {
    searchQuery: "AAN IDSA encephalitis guideline",
  }),
  source("idsa-2008-encephalitis", "guideline", "IDSA 2008 Encephalitis Guideline", {
    aliases: ["IDSA encephalitis guideline", "Management of encephalitis guideline"],
    pmid: "18582201",
    doi: "10.1086/589747",
    searchQuery: "IDSA 2008 encephalitis guideline",
  }),
  source("idsa-candidiasis", "guideline", "IDSA candidiasis", {
    aliases: [
      "IDSA Candidiasis 2016",
      "IDSA Candidiasis Guidelines 2016",
      "IDSA 2016 Clinical Practice Guideline for the Management of Candidiasis",
      "IDSA 2016 Candidiasis Guidelines",
    ],
    pmid: "26679628",
    doi: "10.1093/cid/civ933",
    searchQuery: "IDSA candidiasis guideline 2016",
  }),
  source("idsa-aspergillosis", "guideline", "IDSA aspergillosis", {
    aliases: ["IDSA 2016 Practice Guidelines for Diagnosis and Management of Aspergillosis"],
    pmid: "27365388",
    doi: "10.1093/cid/ciw326",
    searchQuery: "IDSA aspergillosis guideline 2016",
  }),
  source("secure-trial", "trial", "SECURE", {
    aliases: ["Maertens et al., Lancet 2016 — SECURE Trial: Isavuconazole for Invasive Aspergillosis/Mucormycosis"],
    pmid: "26684607",
    doi: "10.1016/S0140-6736(15)01159-9",
    searchQuery: "SECURE isavuconazole voriconazole aspergillosis Lancet 2016",
  }),
  source("idsa-2022-amr", "guideline", "IDSA 2022 AMR guidance", {
    aliases: ["IDSA 2022", "IDSA 2022 Guidance on Resistant Gram-Negative Infections"],
    pmid: "36440896",
    doi: "10.1093/cid/ciac268",
    searchQuery: "IDSA 2022 antimicrobial resistant gram negative guidance",
  }),
  source("idsa-2023-amr", "guideline", "IDSA 2023 AMR guidance", {
    aliases: ["IDSA AMR Guidance 2023"],
    url: "https://www.idsociety.org/practice-guideline/amr-guidance/",
    searchQuery: "IDSA 2023 antimicrobial resistant gram negative guidance",
  }),
  source("idsa-2023-cre-guidance", "guideline", "IDSA CRE guidance 2023", {
    aliases: ["IDSA CRE Guidance 2023"],
    url: "https://www.idsociety.org/practice-guideline/amr-guidance/",
    searchQuery: "IDSA 2023 CRE guidance",
  }),
  source("aspect-program", "trial", "ASPECT", {
    searchQuery: "ASPECT ceftolozane tazobactam trial",
  }),
  source("restore-imi", "trial", "RESTORE-IMI", {
    pmid: "31400759",
    doi: "10.1093/cid/ciz530",
    searchQuery: "RESTORE IMI relebactam trial",
  }),
  source("idsa-febrile-neutropenia", "guideline", "IDSA febrile neutropenia", {
    aliases: ["IDSA 2010", "IDSA 2010 Febrile Neutropenia Guideline"],
    pmid: "21258094",
    doi: "10.1093/cid/cir073",
    searchQuery: "IDSA febrile neutropenia guideline",
  }),
  source("nccn-fever-neutropenia", "guideline", "NCCN fever and neutropenia", {
    aliases: ["NCCN 2024", "NCCN 2024 Prevention and Treatment of Cancer-Related Infections"],
    url: "https://www.nccn.org/professionals/physician_gls/pdf/infections.pdf",
    pmid: "39536464",
    doi: "10.6004/jnccn.2024.0056",
    searchQuery: "NCCN fever and neutropenia guideline",
  }),
  source("mascc-cisne", "consensus", "MASCC/CISNE", {
    aliases: ["MASCC/CISNE risk tools"],
    searchQuery: "MASCC CISNE febrile neutropenia risk stratification",
  }),
  source("iwgdf-idsa-dfi", "guideline", "IWGDF/IDSA DFI", {
    aliases: ["IDSA/IWGDF 2023", "IDSA/IWGDF 2023 Diabetic Foot Infection Guidelines", "IDSA 2023 Diabetic Foot Infection Guidelines (Update)"],
    pmid: "37338661",
    doi: "10.1093/cid/ciad527",
    searchQuery: "IWGDF IDSA diabetic foot infection guideline",
  }),
  source("ada-2026-diagnosis", "guideline", "ADA 2026 Diagnosis & Classification", {
    aliases: [
      "ADA 2026 Diagnosis and Classification",
      "Diagnosis and Classification of Diabetes: Standards of Care in Diabetes-2026",
    ],
    pmid: "41358893",
    doi: "10.2337/dc26-S002",
    searchQuery: "Diagnosis and Classification of Diabetes Standards of Care in Diabetes 2026",
  }),
  source("ada-2026-health-behaviors", "guideline", "ADA 2026 Health Behaviors", {
    aliases: [
      "ADA 2026 Health Behaviors and Well-being",
      "Facilitating Positive Health Behaviors and Well-being to Improve Health Outcomes: Standards of Care in Diabetes-2026",
    ],
    pmid: "41358898",
    doi: "10.2337/dc26-S005",
    searchQuery: "Facilitating Positive Health Behaviors and Well-being to Improve Health Outcomes Standards of Care in Diabetes 2026",
  }),
  source("ada-2026-glycemic-goals", "guideline", "ADA 2026 Glycemic Goals", {
    aliases: [
      "ADA 2026 Glycemic Goals and Hypoglycemia",
      "Glycemic Goals, Hypoglycemia, and Hyperglycemic Crises: Standards of Care in Diabetes-2026",
    ],
    pmid: "41358894",
    doi: "10.2337/dc26-S006",
    searchQuery: "Glycemic Goals Hypoglycemia and Hyperglycemic Crises Standards of Care in Diabetes 2026",
  }),
  source("ada-2026-obesity", "guideline", "ADA 2026 Obesity & Weight", {
    aliases: [
      "ADA 2026 Obesity and Weight Management",
      "Obesity and Weight Management for the Prevention and Treatment of Diabetes: Standards of Care in Diabetes-2026",
    ],
    pmid: "41358882",
    doi: "10.2337/dc26-S008",
    searchQuery: "Obesity and Weight Management for the Prevention and Treatment of Diabetes Standards of Care in Diabetes 2026",
  }),
  source("ada-2026-pharmacologic", "guideline", "ADA 2026 Pharmacologic Approaches", {
    aliases: [
      "ADA 2026 Pharmacologic Approaches to Glycemic Treatment",
      "Pharmacologic Approaches to Glycemic Treatment: Standards of Care in Diabetes-2026",
    ],
    pmid: "41358900",
    doi: "10.2337/dc26-S009",
    searchQuery: "Pharmacologic Approaches to Glycemic Treatment Standards of Care in Diabetes 2026",
  }),
  source("ada-2026-cv-risk", "guideline", "ADA 2026 CV Risk Management", {
    aliases: [
      "ADA 2026 Cardiovascular Disease and Risk Management",
      "Cardiovascular Disease and Risk Management: Standards of Care in Diabetes-2026",
    ],
    pmid: "41358899",
    doi: "10.2337/dc26-S010",
    searchQuery: "Cardiovascular Disease and Risk Management Standards of Care in Diabetes 2026",
  }),
  source("ada-2026-ckd-risk", "guideline", "ADA 2026 CKD Risk Management", {
    aliases: [
      "ADA 2026 Chronic Kidney Disease and Risk Management",
      "Chronic Kidney Disease and Risk Management: Standards of Care in Diabetes-2026",
    ],
    pmid: "41358881",
    doi: "10.2337/dc26-S011",
    searchQuery: "Chronic Kidney Disease and Risk Management Standards of Care in Diabetes 2026",
  }),
  source("ada-2026-hospital", "guideline", "ADA 2026 Diabetes Care in the Hospital", {
    aliases: [
      "ADA 2026 Hospital Care",
      "Diabetes Care in the Hospital: Standards of Care in Diabetes-2026",
    ],
    pmid: "41358892",
    doi: "10.2337/dc26-S016",
    searchQuery: "Diabetes Care in the Hospital Standards of Care in Diabetes 2026",
  }),
  source("endocrine-society-2022-hospital-hyperglycemia", "guideline", "Endocrine Society 2022 Inpatient Hyperglycemia", {
    aliases: [
      "Management of Hyperglycemia in Hospitalized Adult Patients in Non-Critical Care Settings",
      "Endocrine Society 2022 Hospital Hyperglycemia Guideline",
    ],
    pmid: "35690958",
    doi: "10.1210/clinem/dgac278",
    searchQuery: "Management of Hyperglycemia in Hospitalized Adult Patients in Non-Critical Care Settings Endocrine Society 2022",
  }),
  source("ada-kdigo-2022-ckd", "consensus", "ADA/KDIGO 2022 CKD Consensus", {
    aliases: [
      "ADA KDIGO consensus report diabetes chronic kidney disease",
      "Diabetes management in chronic kidney disease: a consensus report by the American Diabetes Association and Kidney Disease Improving Global Outcomes",
    ],
    pmid: "36202661",
    doi: "10.1016/j.kint.2022.08.012",
    searchQuery: "ADA KDIGO 2022 consensus report diabetes chronic kidney disease",
  }),
  source("kdigo-2022-diabetes-ckd", "guideline", "KDIGO 2022 Diabetes in CKD", {
    aliases: [
      "KDIGO 2022 diabetes management in chronic kidney disease",
      "Diabetes Management in Chronic Kidney Disease: Synopsis of the KDIGO 2022 Clinical Practice Guideline Update",
    ],
    pmid: "36623286",
    doi: "10.7326/M22-2904",
    searchQuery: "KDIGO 2022 clinical practice guideline diabetes management in chronic kidney disease synopsis",
  }),
  source("aha-acc-hfsa-2022-heart-failure", "guideline", "AHA/ACC/HFSA 2022 Heart Failure Guideline", {
    aliases: [
      "2022 AHA ACC HFSA Guideline for the Management of Heart Failure",
      "AHA ACC HFSA 2022 heart failure guideline",
    ],
    pmid: "35379503",
    doi: "10.1016/j.jacc.2021.12.012",
    searchQuery: "2022 AHA ACC HFSA Guideline for the Management of Heart Failure",
  }),
  source("fda-sglt2-perioperative-warning", "consensus", "FDA SGLT2 perioperative warning", {
    aliases: [
      "FDA SGLT2 surgery warning",
      "FDA revises labels of SGLT2 inhibitors for diabetes to include warnings about too much acid in the blood and serious urinary tract infections",
    ],
    url: "https://www.fda.gov/drugs/drug-safety-and-availability/fda-revises-labels-sglt2-inhibitors-diabetes-include-warnings-about-too-much-acid-blood-and-serious",
    searchQuery: "FDA SGLT2 inhibitors surgery stop 3 days before scheduled surgery",
  }),
  source("fda-metformin-renal-guidance", "consensus", "FDA metformin renal function guidance", {
    aliases: [
      "DailyMed metformin iodinated contrast guidance",
      "Metformin contrast restart 48 hours renal function stable",
    ],
    url: "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=c3dfa8a1-d10a-4a1a-8eba-5f4e2a5a2949",
    searchQuery: "DailyMed metformin iodinated contrast restart 48 hours renal function stable",
  }),
  source("ukpds-34", "trial", "UKPDS 34", {
    aliases: [
      "Effect of intensive blood-glucose control with metformin on complications in overweight patients with type 2 diabetes",
      "UKPDS 34 metformin",
    ],
    pmid: "9742977",
    doi: "10.1016/S0140-6736(98)07037-8",
    searchQuery: "UKPDS 34 metformin overweight type 2 diabetes",
  }),
  source("empa-reg-outcome", "trial", "EMPA-REG OUTCOME", {
    aliases: [
      "Empagliflozin Cardiovascular Outcomes",
      "Empagliflozin, Cardiovascular Outcomes, and Mortality in Type 2 Diabetes",
    ],
    pmid: "26378978",
    doi: "10.1056/NEJMoa1504720",
    searchQuery: "EMPA-REG OUTCOME empagliflozin cardiovascular outcomes type 2 diabetes",
  }),
  source("leader", "trial", "LEADER", {
    aliases: [
      "Liraglutide Cardiovascular Outcomes",
      "Liraglutide and Cardiovascular Outcomes in Type 2 Diabetes",
    ],
    pmid: "27295427",
    doi: "10.1056/NEJMoa1603827",
    searchQuery: "LEADER liraglutide cardiovascular outcomes type 2 diabetes",
  }),
  source("dapa-ckd", "trial", "DAPA-CKD", {
    aliases: [
      "Dapagliflozin in Patients with Chronic Kidney Disease",
      "DAPA CKD",
    ],
    pmid: "32970396",
    doi: "10.1056/NEJMoa2024816",
    searchQuery: "DAPA-CKD dapagliflozin chronic kidney disease",
  }),
  source("grade-trial", "trial", "GRADE", {
    aliases: [
      "Glycemia Reduction in Type 2 Diabetes - Glycemic Outcomes",
      "GRADE trial",
    ],
    pmid: "36129996",
    doi: "10.1056/NEJMoa2200433",
    searchQuery: "GRADE trial glycemia reduction in type 2 diabetes glycemic outcomes",
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
    pmid: "33058795",
    doi: "10.1016/S1473-3099(20)30796-9",
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
    pmid: "30477369",
    searchQuery: "galactomannan CT strategy neutropenia review",
  }),
  source("sab-bundle-literature", "review", "SAB bundle literature", {
    searchQuery: "Staphylococcus aureus bacteremia bundle literature review",
  }),
  source("endocarditis-surgery-review", "review", "Endocarditis surgery review", {
    searchQuery: "endocarditis surgery timing review",
  }),
  source("prosthetic-valve-ie-literature", "review", "Prosthetic valve IE literature", {
    pmid: "33925866",
    searchQuery: "prosthetic valve infective endocarditis review",
  }),
  source("rifampin-gentamicin-stewardship", "review", "Rifampin/gentamicin stewardship", {
    pmid: "36408468",
    searchQuery: "rifampin gentamicin prosthetic valve endocarditis review",
  }),
  source("yahav-short-course-gnb", "trial", "Yahav short-course trial", {
    pmid: "30535100",
    searchQuery: "Yahav seven versus fourteen days gram negative bacteremia trial",
  }),
  source("oral-stepdown-bacteremia", "review", "Oral step-down bacteremia literature", {
    pmid: "37424971",
    searchQuery: "oral step down gram negative bacteremia review",
  }),
  source("opat-stewardship", "review", "OPAT stewardship", {
    pmid: "30423035",
    searchQuery: "outpatient parenteral antimicrobial therapy stewardship review",
  }),
  source("amr-risk-stratification", "consensus", "AMR risk stratification", {
    searchQuery: "antimicrobial resistance risk stratification sepsis consensus",
  }),
  source("kpc-observational-outcomes", "review", "KPC observational outcomes", {
    pmid: "33249436",
    searchQuery: "KPC observational outcomes ceftazidime avibactam review",
  }),
  source("tango-i", "trial", "TANGO I", {
    pmid: "29486041",
    doi: "10.1001/jama.2018.0438",
    searchQuery: "TANGO I meropenem vaborbactam cUTI trial",
  }),
  source("apeks-np", "trial", "APEKS-NP", {
    pmid: "33058798",
    doi: "10.1016/S1473-3099(20)30731-3",
    searchQuery: "APEKS NP cefiderocol pneumonia trial",
  }),
  source("aspect-cuti-ciai", "trial", "ASPECT-cUTI/cIAI pooled phase 3 analysis", {
    aliases: [
      "ASPECT-cUTI / ASPECT-cIAI Trials (Ceftolozane-Tazobactam)",
      "ASPECT-cUTI/cIAI",
    ],
    pmid: "27707990",
    doi: "10.1093/jac/dkw374",
    searchQuery: "ASPECT cUTI cIAI ceftolozane tazobactam trial",
  }),
  source("restore-imi-2", "trial", "RESTORE-IMI 2", {
    pmid: "32785589",
    searchQuery: "RESTORE IMI 2 trial",
  }),
  source("aida", "trial", "AIDA", {
    pmid: "29456043",
    searchQuery: "AIDA colistin carbapenem resistant gram negative trial",
  }),
  source("absssi-labeling-stewardship", "review", "ABSSSI labeling and stewardship reviews", {
    url: "https://www.fda.gov/drugs/drug-approvals-and-databases/more-information-sivextro-tedizolid",
    searchQuery: "ABSSSI labeling stewardship tedizolid review",
  }),
  source("establish", "trial", "ESTABLISH 1 & 2 (Tedizolid)", {
    aliases: [
      "ESTABLISH 1 & 2 Trials (Tedizolid)",
      "ATTAIN 1 & 2 Trials (Tedizolid)",
    ],
    pmid: "25421472",
    doi: "10.1128/AAC.03688-14",
    searchQuery: "ESTABLISH tedizolid linezolid pooled phase 3 trials",
  }),
  source("long-course-tedizolid", "review", "Long-course tedizolid experience", {
    pmid: "35615295",
    searchQuery: "long course tedizolid observational review",
  }),
  source("aml-mds-prophylaxis", "trial", "AML/MDS prophylaxis data", {
    searchQuery: "posaconazole AML MDS prophylaxis trial",
  }),
  source("therapeutic-drug-monitoring", "review", "Therapeutic drug monitoring", {
    pmid: "31145490",
    searchQuery: "therapeutic drug monitoring posaconazole review",
  }),
  source("idsa-candidiasis-aspergillosis", "guideline", "IDSA candidiasis/aspergillosis", {
    searchQuery: "IDSA candidiasis aspergillosis guidance",
  }),
  source("mucormycosis-guidance", "guideline", "Mucormycosis guidance", {
    pmid: "31699664",
    doi: "10.1016/S1473-3099(19)30312-3",
    searchQuery: "mucormycosis guidance liposomal amphotericin B",
  }),
  source("nephrotoxicity-mitigation", "review", "Nephrotoxicity mitigation", {
    pmid: "41549663",
    searchQuery: "liposomal amphotericin nephrotoxicity mitigation review",
  }),
  source("ashp-idsa-pids-2020-vancomycin", "guideline", "ASHP/IDSA/PIDS 2020 vancomycin", {
    aliases: ["ASHP/IDSA Vancomycin Guidelines 2020", "ASHP/IDSA/SIDP 2020 Vancomycin Monitoring Consensus"],
    pmid: "32658968",
    searchQuery: "ASHP IDSA PIDS 2020 vancomycin monitoring guideline",
  }),
  source("auc-stewardship", "review", "AUC stewardship literature", {
    pmid: "29203493",
    searchQuery: "AUC stewardship vancomycin review",
  }),
  source("high-dose-daptomycin", "review", "High-dose daptomycin literature", {
    pmid: "36693240",
    searchQuery: "high dose daptomycin bacteremia endocarditis review",
  }),
  source("combination-salvage-therapy", "review", "Combination salvage therapy", {
    pmid: "25017183",
    searchQuery: "combination salvage therapy persistent MRSA bacteremia review",
  }),
  source("cefazolin-versus-asp", "review", "Cefazolin versus ASP literature", {
    pmid: "30305037",
    searchQuery: "cefazolin versus anti staphylococcal penicillin MSSA bacteremia review",
  }),
  source("cefazolin-inoculum-effect", "review", "Cefazolin inoculum effect", {
    pmid: "29977970",
    searchQuery: "cefazolin inoculum effect review",
  }),
  source("mssa-bacteremia-literature", "review", "MSSA bacteremia literature", {
    pmid: "31281864",
    searchQuery: "MSSA bacteremia nafcillin oxacillin review",
  }),
  source("opat-tolerability", "review", "OPAT tolerability review", {
    pmid: "24785233",
    searchQuery: "anti staphylococcal penicillin OPAT tolerability review",
  }),
  source("once-daily-opat", "review", "Once-daily OPAT literature", {
    pmid: "1909231",
    searchQuery: "ceftriaxone once daily OPAT literature",
  }),
  source("biliary-urinary-source-bacteremia", "review", "Biliary/urinary source bacteremia", {
    pmid: "39233214",
    searchQuery: "ceftriaxone urinary biliary source bacteremia review",
  }),
  source("polymyxin-toxicity", "review", "Polymyxin toxicity literature", {
    pmid: "30635223",
    searchQuery: "polymyxin toxicity review",
  }),
  source("idsa-2004-bacterial-meningitis", "guideline", "IDSA 2004 bacterial meningitis", {
    aliases: ["IDSA 2004"],
    pmid: "15494903",
    doi: "10.1086/425368",
    searchQuery: "IDSA 2004 bacterial meningitis guideline",
  }),
  source("fowler-2006-daptomycin", "trial", "Fowler et al., NEJM 2006", {
    aliases: ["Fowler et al., NEJM 2006"],
    pmid: "16914701",
    doi: "10.1056/NEJMoa053783",
    searchQuery: "Fowler NEJM 2006 daptomycin Staphylococcus aureus bacteremia",
  }),
  source("sepsispam", "trial", "SEPSISPAM Trial", {
    aliases: ["SEPSISPAM Trial NEJM 2014"],
    pmid: "24635770",
    doi: "10.1056/NEJMoa1312173",
    searchQuery: "SEPSISPAM trial NEJM 2014 septic shock",
  }),
  source("clovers", "trial", "CLOVERS", {
    pmid: "36688507",
    searchQuery: "CLOVERS trial sepsis NEJM 2023",
  }),
  source("aua-cua-sufu-2019-ruti", "guideline", "AUA/CUA/SUFU 2019", {
    pmid: "31042112",
    doi: "10.1097/JU.0000000000000296",
    searchQuery: "AUA CUA SUFU 2019 recurrent urinary tract infection guideline",
  }),
  source("idsa-2010-cauti", "guideline", "IDSA 2010 CAUTI", {
    pmid: "20175247",
    doi: "10.1086/650482",
    searchQuery: "IDSA 2010 catheter associated urinary tract infection guideline",
  }),
  source("altar-trial", "trial", "ALTAR Trial (Harding et al., 2022)", {
    aliases: ["ALTAR Trial (2018)"],
    pmid: "35535708",
    doi: "10.3310/QOIZ6538",
    searchQuery: "ALTAR trial recurrent UTI methenamine",
  }),
  source("gupta-2007-nitrofurantoin-tmpsmx", "trial", "Gupta et al. (2007) — Nitrofurantoin vs TMP-SMX", {
    pmid: "17998493",
    doi: "10.1001/archinte.167.20.2207",
    searchQuery: "Gupta 2007 nitrofurantoin trimethoprim sulfamethoxazole uncomplicated cystitis",
  }),
  source("gagyor-2015-ibuprofen-fosfomycin", "trial", "Gagyor et al. (2015) — Ibuprofen vs Fosfomycin", {
    pmid: "26698878",
    doi: "10.1136/bmj.h6544",
    searchQuery: "Gagyor 2015 ibuprofen fosfomycin uncomplicated cystitis",
  }),
  source("huttner-2018-nitrofurantoin-fosfomycin", "trial", "Huttner et al. (2018) — Nitrofurantoin vs Fosfomycin", {
    pmid: "29710295",
    doi: "10.1001/jama.2018.3627",
    searchQuery: "Huttner 2018 nitrofurantoin fosfomycin uncomplicated lower urinary tract infection",
  }),
  source("nice-ng138-pneumonia", "guideline", "NICE NG138 Pneumonia Antimicrobial Prescribing", {
    aliases: ["NICE 2023 Pneumonia Update"],
    url: "https://www.nice.org.uk/guidance/ng138",
    searchQuery: "NICE pneumonia antimicrobial prescribing guideline NG138",
  }),
  source("gold-2024-aecopd", "guideline", "GOLD 2024 (for AECOPD overlap)", {
    url: "https://goldcopd.org/2024-gold-report/",
    searchQuery: "GOLD 2024 COPD guideline pneumonia overlap",
  }),
  source("cap-start", "trial", "CAP-START Trial (2015, NEJM)", {
    pmid: "25830421",
    doi: "10.1056/NEJMoa1406330",
    searchQuery: "CAP START trial community acquired pneumonia NEJM 2015",
  }),
  source("epic-cap-study", "trial", "EPIC Study (Jain et al., 2015, NEJM)", {
    pmid: "26437713",
    doi: "10.1056/NEJMoa1500245",
    searchQuery: "EPIC study Jain NEJM 2015 community acquired pneumonia",
  }),
  source("meijvis-2011-dexamethasone-cap", "trial", "Meijvis et al. (2011) — Adjunctive Dexamethasone", {
    aliases: [
      "Meijvis et al. (2011, Lancet) — Adjunctive Dexamethasone",
      "Dexamethasone and length of hospital stay in patients with community-acquired pneumonia",
    ],
    pmid: "21636122",
    searchQuery: "Meijvis 2011 dexamethasone community acquired pneumonia trial",
  }),
  source("garin-2014-cap", "trial", "Garin et al. (2014, JAMA IM)", {
    pmid: "25286173",
    doi: "10.1001/jamainternmed.2014.4887",
    searchQuery: "Garin 2014 JAMA internal medicine beta lactam macrolide pneumonia trial",
  }),
  source("ers-esicm-escmid-alat-2017-hap-vap", "guideline", "ERS/ESICM/ESCMID/ALAT 2017", {
    pmid: "28890434",
    doi: "10.1183/13993003.00582-2017",
    searchQuery: "ERS ESICM ESCMID ALAT 2017 hospital acquired pneumonia ventilator associated pneumonia guideline",
  }),
  source("shea-idsa-apic-2022-vap-prevention", "guideline", "SHEA/IDSA/APIC Practice Recommendation 2022", {
    doi: "10.1017/ice.2022.120",
    url: "https://shea-online.org/practice-recommendation-strategies-to-prevent-ventilator-associated-pneumonia-ventilator-associated-events-in-acute-care-hospitals-2022-update/",
    searchQuery: "SHEA IDSA APIC 2022 ventilator associated pneumonia prevention recommendation",
  }),
  source("leone-2014-deescalation", "trial", "Leone et al. (2014) — De-escalation vs Continuation", {
    pmid: "25091790",
    doi: "10.1007/s00134-014-3411-8",
    searchQuery: "Leone 2014 de-escalation continuation empirical antimicrobial treatment severe sepsis",
  }),
  source("ptc-bouadma-2010", "trial", "PRORATA Trial (Bouadma et al., Lancet 2010)", {
    aliases: ["PTC Trial (Bouadma 2010, Lancet)"],
    pmid: "20863704",
    doi: "10.1016/S0140-6736(10)61872-6",
    searchQuery: "Bouadma 2010 Lancet procalcitonin respiratory infection ICU trial",
  }),
  source("chastre-2003-vap", "trial", "Chastre et al. (2003, JAMA)", {
    pmid: "14625336",
    doi: "10.1001/jama.290.19.2588",
    searchQuery: "Chastre 2003 JAMA ventilator associated pneumonia 8 days 15 days",
  }),
  source("proseva", "trial", "PROSEVA Trial (2013, NEJM)", {
    pmid: "23688302",
    doi: "10.1056/NEJMoa1214103",
    searchQuery: "PROSEVA trial proning ARDS NEJM 2013",
  }),
  source("inhale-trial", "trial", "INHALE Trial (Niederman et al., 2020 Lancet ID)", {
    pmid: "31866328",
    doi: "10.1016/S1473-3099(19)30574-2",
    searchQuery: "INHALE trial inhaled amikacin adjunctive standard of care antibiotics ventilated gram negative pneumonia",
  }),
  source("merino-2", "trial", "MerINO-2", {
    pmid: "34395716",
    doi: "10.1093/ofid/ofab387",
    searchQuery: "MerINO-2 trial ESBL bacteremia piperacillin tazobactam carbapenem",
  }),
  source("acorn", "trial", "ACORN", {
    pmid: "37837651",
    doi: "10.1001/jama.2023.20583",
    searchQuery: "ACORN trial cefepime piperacillin tazobactam acute kidney injury",
  }),
  source("idsa-2011-mrsa", "guideline", "IDSA 2011 MRSA Guidelines", {
    pmid: "21208910",
    doi: "10.1093/cid/ciq146",
    searchQuery: "IDSA 2011 MRSA guideline skin soft tissue infection",
  }),
  source("talan-2016-abscess", "trial", "Talan et al. (2016, NEJM) — TMP-SMX for Abscess After I&D", {
    pmid: "26962903",
    doi: "10.1056/NEJMoa1507476",
    searchQuery: "Talan 2016 NEJM trimethoprim sulfamethoxazole abscess incision drainage",
  }),
  source("miller-2015-ssti", "trial", "Miller et al. (2015, NEJM) — Clindamycin vs TMP-SMX", {
    pmid: "25785967",
    doi: "10.1056/NEJMoa1403789",
    searchQuery: "Miller 2015 clindamycin trimethoprim sulfamethoxazole uncomplicated skin infections",
  }),
  source("daum-2017-ssti", "trial", "Daum et al. (2017, NEJM) — Antibiotics for Smaller Abscesses", {
    pmid: "28657870",
    doi: "10.1056/NEJMoa1607033",
    searchQuery: "Daum 2017 placebo controlled trial antibiotics for smaller skin abscesses",
  }),
  source("discover-1-2-dalbavancin", "trial", "DISCOVER 1 & 2 (Dalbavancin, 2014, NEJM)", {
    pmid: "24897082",
    doi: "10.1056/NEJMoa1310480",
    searchQuery: "DISCOVER 1 2 dalbavancin acute bacterial skin and skin structure infection trial",
  }),
  source("eron-2003-ssti", "consensus", "Eron Classification (2003)", {
    pmid: "14662806",
    doi: "10.1093/jac/dkg466",
    searchQuery: "Eron classification skin soft tissue infection 2003",
  }),
  source("lrinec-wong-2004", "consensus", "Wong et al. LRINEC Score (2004)", {
    pmid: "15241098",
    doi: "10.1097/01.CCM.0000129486.35458.7D",
    searchQuery: "Wong LRINEC score necrotizing fasciitis 2004",
  }),
  source("ciaow-study", "review", "CIAOW Study (Sartelli et al., 2013)", {
    pmid: "24144389",
    doi: "10.1186/1749-7922-8-57",
    searchQuery: "CIAOW study Sartelli 2013 complicated intra abdominal infection",
  }),
  source("montravers-2016-deescalation", "trial", "Montravers et al. (2016) — De-escalation in cIAI", {
    aliases: ["Montravers et al. (2009) — De-escalation in IAI"],
    pmid: "28058568",
    doi: "10.1007/s15010-016-0999-3",
    searchQuery: "Montravers 2016 de escalation complicated intra abdominal infections",
  }),
  source("durapop", "trial", "DURAPOP (Montravers et al., 2018)", {
    pmid: "29447388",
    doi: "10.1007/s00134-018-5086-x",
    searchQuery: "DURAPOP Montravers 2018 postoperative peritonitis trial",
  }),
  source("solomkin-2003-ertapenem-piptazo", "trial", "Solomkin et al. (2003) — Ertapenem vs Pip-Tazo", {
    aliases: ["Solomkin et al. (2010) Ertapenem vs Pip-Tazo"],
    pmid: "12925242",
    doi: "10.1001/archsurg.138.2.146",
    searchQuery: "Solomkin 2003 ertapenem piperacillin tazobactam complicated intra abdominal infection trial",
  }),
  source("idsa-shea-2021-cdi", "guideline", "IDSA/SHEA 2021 Focused Update", {
    aliases: ["IDSA/SHEA 2021"],
    pmid: "34164674",
    doi: "10.1093/cid/ciab549",
    searchQuery: "IDSA SHEA 2021 focused update Clostridioides difficile",
  }),
  source("acg-2021-cdi", "guideline", "ACG 2021 CDI Guidelines", {
    pmid: "34003176",
    doi: "10.14309/ajg.0000000000001278",
    searchQuery: "ACG 2021 Clostridioides difficile guideline",
  }),
  source("idsa-shea-2017-cdi", "guideline", "IDSA/SHEA 2017 CDI Guidelines", {
    aliases: ["IDSA/SHEA 2017"],
    pmid: "29462280",
    doi: "10.1093/cid/cix1085",
    searchQuery: "IDSA SHEA 2017 Clostridioides difficile guideline",
  }),
  source("aga-2024-fmt", "guideline", "AGA 2024 Fecal Microbiota-Based Therapies Guideline", {
    aliases: ["AGA 2022 Fecal Microbiota Transplantation Guideline"],
    pmid: "38395525",
    searchQuery: "AGA clinical practice guideline fecal microbiota-based therapies recurrent Clostridioides difficile",
  }),
  source("extend-trial", "trial", "EXTEND Trial (Guery et al., Lancet ID 2018)", {
    aliases: ["EXTEND Trial (Cornely et al., CID 2012)"],
    pmid: "29273269",
    doi: "10.1016/S1473-3099(17)30751-X",
    searchQuery: "EXTEND trial fidaxomicin vancomycin Clostridioides difficile Cornely",
  }),
  source("modify-trials", "trial", "MODIFY I/II Trials (Wilcox et al., NEJM 2017)", {
    pmid: "28121498",
    doi: "10.1056/NEJMoa1602615",
    searchQuery: "MODIFY I II bezlotoxumab trial NEJM 2017",
  }),
  source("punch-cd3", "trial", "PUNCH CD3 Trial (Khanna et al., Drugs 2022)", {
    aliases: ["PUNCH CD3 Trial (Feuerstadt et al., NEJM 2022)"],
    pmid: "36287379",
    doi: "10.1007/s40265-022-01797-x",
    searchQuery: "PUNCH CD3 trial Rebyota Feuerstadt NEJM 2022",
  }),
  source("ecospor-iii", "trial", "ECOSPOR III Trial (Feuerstadt et al., NEJM 2022)", {
    pmid: "35045228",
    doi: "10.1056/NEJMoa2106516",
    searchQuery: "ECOSPOR III trial SER-109 Vowst NEJM 2022",
  }),
  source("sirbu-2017-vanco-taper", "review", "Sirbu et al. (2017) — Vancomycin Taper/Pulse", {
    aliases: ["Johnson et al., CID 2014 — Vancomycin Taper/Pulse"],
    pmid: "28166328",
    doi: "10.1093/cid/ciw848",
    searchQuery: "Sirbu 2017 vancomycin taper pulse recurrent Clostridioides difficile",
  }),
  source("idsa-2015-vertebral-osteomyelitis", "guideline", "IDSA 2015 Vertebral Osteomyelitis Guidelines", {
    pmid: "26229122",
    searchQuery: "IDSA 2015 vertebral osteomyelitis guideline",
  }),
  source("idsa-2013-pji", "guideline", "IDSA 2013 Prosthetic Joint Infection Guidelines", {
    pmid: "23223583",
    doi: "10.1093/cid/cis803",
    searchQuery: "IDSA 2013 prosthetic joint infection guideline",
  }),
  source("icm-2018-pji", "consensus", "2018 International Consensus Meeting (ICM) on PJI", {
    url: "https://www.ors.org/2018-icm/",
    searchQuery: "2018 international consensus meeting prosthetic joint infection",
  }),
  source("aahks-2023-chronic-pji-practice-patterns", "review", "AAHKS 2023 chronic PJI practice patterns", {
    pmid: "37142069",
    doi: "10.1016/j.arth.2023.04.059",
    searchQuery: "AAHKS chronic prosthetic joint infection practice patterns 2023",
  }),
  source("datipo", "trial", "DATIPO Trial (Wouthuyzen-Bakker et al., 2021)", {
    pmid: "34042388",
    doi: "10.1056/NEJMoa2020198",
    searchQuery: "DATIPO trial Wouthuyzen Bakker prosthetic joint infection 2021",
  }),
  source("zimmerli-1998-rifampin-pji", "trial", "Zimmerli et al., NEJM 1998 — Rifampin for Staphylococcal PJI", {
    pmid: "9445404",
    doi: "10.1001/jama.279.19.1537",
    searchQuery: "Zimmerli 1998 NEJM rifampin staphylococcal prosthetic joint infection",
  }),
  source("idsa-2017-ventriculitis-meningitis", "guideline", "IDSA 2017 Healthcare-Associated Ventriculitis/Meningitis", {
    pmid: "28595207",
    doi: "10.1093/cid/cix152",
    searchQuery: "IDSA 2017 healthcare associated ventriculitis meningitis guideline",
  }),
  source("escmid-2016-bacterial-meningitis", "guideline", "ESCMID 2016 Community-Acquired Bacterial Meningitis", {
    pmid: "27062097",
    doi: "10.1016/j.cmi.2016.01.007",
    searchQuery: "ESCMID 2016 community acquired bacterial meningitis guideline",
  }),
  source("escmid-2017-brain-abscess-update", "review", "ESCMID 2017 bacterial brain abscess update", {
    pmid: "28501669",
    doi: "10.1016/j.cmi.2017.05.004",
    searchQuery: "Sonneville 2017 update on bacterial brain abscess in immunocompetent patients",
  }),
  source("dexamethasone-meningitis", "trial", "de Gans & van de Beek, NEJM 2002 — Dexamethasone in Meningitis", {
    aliases: ["Dexamethasone in adults with bacterial meningitis"],
    pmid: "12432041",
    doi: "10.1056/NEJMoa021334",
    searchQuery: "de Gans van de Beek dexamethasone bacterial meningitis 2002",
  }),
  source("van-de-beek-2006-meningitis", "review", "van de Beek et al., NEJM 2006 — Meningitis Clinical Features", {
    pmid: "16394301",
    doi: "10.1056/NEJMra052116",
    searchQuery: "van de Beek 2006 NEJM bacterial meningitis clinical features",
  }),
  source("brouwer-2015-dexamethasone", "review", "Brouwer et al., Cochrane 2015 — Dexamethasone Meta-analysis", {
    pmid: "26362566",
    doi: "10.1002/14651858.CD004405.pub5",
    searchQuery: "Brouwer 2015 Cochrane dexamethasone bacterial meningitis",
  }),
  source("escmid-2012-candida", "guideline", "ESCMID 2012 Candida Guideline (Non-neutropenic Adults)", {
    aliases: ["ESCMID 2022 Guideline for the Diagnosis and Management of Candida Diseases"],
    pmid: "23137135",
    doi: "10.1111/1469-0691.12039",
    searchQuery: "ESCMID guideline Candida diseases 2012 non-neutropenic adult patients",
  }),
  source("reboli-2007-anidulafungin", "trial", "Reboli et al., NEJM 2007 — Anidulafungin vs Fluconazole for Candidemia", {
    pmid: "18003958",
    doi: "10.1056/NEJMoa066906",
    searchQuery: "Reboli 2007 NEJM anidulafungin fluconazole candidemia",
  }),
  source("herbrecht-2002-voriconazole", "trial", "Herbrecht et al., NEJM 2002 — Voriconazole vs Amphotericin B for Invasive Aspergillosis", {
    pmid: "12167683",
    doi: "10.1056/NEJMoa020191",
    searchQuery: "Herbrecht 2002 NEJM voriconazole amphotericin invasive aspergillosis",
  }),
  source("marr-2015-voriconazole-anidulafungin", "trial", "Marr et al., Ann Intern Med 2015 — Voriconazole + Anidulafungin Combination vs Voriconazole Monotherapy", {
    pmid: "25587956",
    doi: "10.1056/NEJMoa1413008",
    searchQuery: "Marr 2015 voriconazole anidulafungin combination invasive aspergillosis",
  }),
  source("escmid-ecmm-ers-2017-aspergillosis", "guideline", "ESCMID-ECMM-ERS 2017 Aspergillosis Guideline", {
    aliases: ["ESCMID/ECMM/ERS 2022 Aspergillosis Guidelines"],
    pmid: "29544767",
    doi: "10.1016/j.cmi.2018.01.002",
    searchQuery: "ESCMID ECMM ERS 2017 aspergillosis guideline executive summary",
  }),
  source("restore-imi-1", "trial", "RESTORE-IMI 1 (Motsch et al., 2020 CID)", {
    pmid: "31400759",
    doi: "10.1093/cid/ciz530",
    searchQuery: "RESTORE IMI 1 Motsch 2020 imipenem relebactam trial",
  }),
  source("hartford-nomogram", "consensus", "Hartford Nomogram (Aminoglycosides)", {
    pmid: "7625622",
    doi: "10.1093/ajhp/52.6.657",
    searchQuery: "Hartford nomogram aminoglycoside once daily dosing",
  }),
  source("mascc-risk-index", "consensus", "MASCC Risk Index (Multinational Association for Supportive Care in Cancer)", {
    pmid: "10491538",
    searchQuery: "MASCC risk index febrile neutropenia",
  }),
  source("cisne-score", "consensus", "CISNE Score (Clinical Index of Stable Febrile Neutropenia)", {
    pmid: "29128497",
    searchQuery: "CISNE score febrile neutropenia",
  }),
  source("asco-2015-gcsf", "guideline", "ASCO WBC Growth Factor Guideline Update (2015)", {
    aliases: ["ASCO G-CSF Guideline 2015 (Updated 2024)"],
    pmid: "26169616",
    searchQuery: "ASCO white blood cell growth factors guideline update 2015",
  }),
  source("cordonnier-2009-empirical-vs-preemptive", "trial", "Cordonnier et al. (2009) — Empirical vs Preemptive Antifungal Therapy", {
    aliases: ["EMPIRICUS Trial (Legrand et al., JAMA 2016)"],
    pmid: "19281327",
    doi: "10.1086/597395",
    searchQuery: "Cordonnier 2009 empirical versus preemptive antifungal therapy high-risk febrile neutropenic patients",
  }),
  source("winston-2000-empiric-antifungal", "trial", "Winston et al. (2000, J Infect Dis) — Fluconazole vs Amphotericin B Empiric Antifungal", {
    aliases: ["Bow et al. (NEJM 1998) — Fluconazole vs Amphotericin B Empiric Antifungal"],
    pmid: "11115982",
    searchQuery: "Winston 2000 fluconazole amphotericin B empirical antifungal therapy fever neutropenia",
  }),
  source("walsh-1999-lamb-vs-amb", "trial", "Walsh et al. (NEJM 1999) — Liposomal Amphotericin B vs Conventional AmB for Empiric Antifungal", {
    pmid: "10560227",
    searchQuery: "Walsh 1999 NEJM liposomal amphotericin B conventional amphotericin neutropenia",
  }),
  source("walsh-2004-caspofungin", "trial", "Walsh et al. (NEJM 2004) — Caspofungin vs Liposomal Amphotericin B for Empiric Antifungal", {
    pmid: "14711910",
    searchQuery: "Walsh 2004 NEJM caspofungin liposomal amphotericin febrile neutropenia",
  }),
  source("freifeld-1999-low-risk-fn", "trial", "Freifeld et al. (NEJM 1999) — Oral vs IV Antibiotics for Low-Risk FN", {
    pmid: "10423464",
    doi: "10.1056/NEJM199907293410501",
    searchQuery: "Freifeld 1999 NEJM oral intravenous antibiotics low risk febrile neutropenia",
  }),
  source("kern-1999-low-risk-fn", "trial", "Kern et al. (NEJM 1999) — Oral vs IV Empirical Therapy", {
    pmid: "10423465",
    doi: "10.1056/NEJM199907293410502",
    searchQuery: "Kern 1999 oral versus intravenous empirical antimicrobial therapy fever granulocytopenia cancer chemotherapy",
  }),
  source("cornely-2007-posaconazole", "trial", "GIMEMA/EORTC — Antifungal Prophylaxis Trials (Cornely et al., NEJM 2007)", {
    pmid: "17251531",
    doi: "10.1056/NEJMoa061094",
    searchQuery: "Cornely 2007 NEJM posaconazole prophylaxis AML MDS neutropenia",
  }),
  source("wingard-2010-voriconazole", "trial", "Wingard et al. (Blood 2010) — Voriconazole vs Fluconazole Prophylaxis in Allogeneic HSCT", {
    pmid: "20805356",
    doi: "10.1182/blood-2010-01-212506",
    searchQuery: "Wingard 2010 Blood voriconazole fluconazole prophylaxis allogeneic HSCT",
  }),
  source("iwgdf-2023-wound-classification", "guideline", "IWGDF 2023 Wound Classification Guidelines", {
    url: "https://iwgdfguidelines.org/guidelines/guidelines/",
    searchQuery: "IWGDF 2023 wound classification diabetic foot guideline",
  }),
  source("wagner-1981", "consensus", "Wagner Wound Classification (1981, widely used)", {
    pmid: "7442384",
    searchQuery: "Wagner wound classification diabetic foot 1981",
  }),
  source("ut-wound-classification", "consensus", "University of Texas (UT) Wound Classification System", {
    pmid: "9798089",
    searchQuery: "University of Texas wound classification diabetic foot",
  }),
  source("lipsky-2005-ertapenem-dfi", "trial", "Ertapenem vs Pip-Tazo for DFI — Lipsky et al. (2005, Clin Infect Dis)", {
    pmid: "16291062",
    doi: "10.1086/497371",
    searchQuery: "Lipsky 2005 ertapenem piperacillin tazobactam diabetic foot infection",
  }),
  source("ha-van-2003-postop-osteomyelitis", "review", "IDSA Post-Op Osteomyelitis Duration Study — Ha Van et al. (2003)", {
    pmid: "14585235",
    searchQuery: "Ha Van 2003 diabetic foot osteomyelitis postoperative antibiotic duration",
  }),
  source("lavery-probe-to-bone", "review", "Probe-to-Bone Test — Lavery et al. Validation Cohort", {
    pmid: "17259493",
    searchQuery: "Lavery probe to bone validation diabetic foot osteomyelitis",
  }),
  source("lazaro-martinez-2014-dfi-osteomyelitis", "trial", "Conservative vs Surgical Management of DFI Osteomyelitis — Lazaro-Martinez et al. (2014)", {
    pmid: "24130347",
    doi: "10.2337/dc13-1526",
    searchQuery: "Lazaro Martinez 2014 diabetic foot osteomyelitis conservative surgical trial",
  }),
  source("sepsis-3", "consensus", "Sepsis-3 Task Force (Singer et al., JAMA 2016)", {
    pmid: "26903338",
    searchQuery: "Singer JAMA 2016 Sepsis-3 definitions",
  }),
  source("arise", "trial", "ARISE", {
    pmid: "25272316",
    searchQuery: "ARISE trial septic shock NEJM 2014",
  }),
  source("process", "trial", "ProCESS", {
    pmid: "24635773",
    doi: "10.1056/NEJMoa1401602",
    searchQuery: "ProCESS trial septic shock NEJM 2014",
  }),
  source("promise", "trial", "ProMISe", {
    pmid: "25776532",
    doi: "10.1056/NEJMoa1500896",
    searchQuery: "ProMISe trial septic shock 2015",
  }),
  source("andromeda-shock", "trial", "ANDROMEDA-SHOCK Trial (Hernandez et al., JAMA 2019)", {
    pmid: "31081824",
    doi: "10.1001/jama.2019.0071",
    searchQuery: "ANDROMEDA SHOCK trial JAMA 2019 capillary refill sepsis",
  }),
  source("adrenal", "trial", "ADRENAL Trial (Venkatesh et al., NEJM 2018)", {
    pmid: "29768408",
    doi: "10.1056/NEJMoa1705835",
    searchQuery: "ADRENAL trial hydrocortisone septic shock NEJM 2018",
  }),
  source("clsi-breakpoint-updates", "consensus", "CLSI Breakpoint Updates (2022-2024)", {
    url: "https://clsi.org/standards/products/microbiology/documents/m100/",
    searchQuery: "CLSI breakpoint updates Enterobacterales aminoglycoside 2022 2024",
  }),
  source("cdc-amr-threats-2019", "review", "CDC Antibiotic Resistance Threats Report (2019)", {
    url: "https://www.cdc.gov/antimicrobial-resistance/data-research/threats/index.html",
    searchQuery: "CDC antibiotic resistance threats report 2019",
  }),
  source("falcone-2021-caz-avi-aztreonam", "review", "Observational: Ceftazidime-avibactam + Aztreonam for MBL (Falcone et al., 2021)", {
    pmid: "32427286",
    doi: "10.1093/cid/ciaa586",
    searchQuery: "Falcone 2021 ceftazidime avibactam aztreonam metallo beta lactamase bacteremia",
  }),
  source("aha-2015-ie", "guideline", "AHA 2015 IE Guideline", {
    pmid: "26373316",
    searchQuery: "AHA 2015 infective endocarditis guideline",
  }),
  source("esc-2023-ie", "guideline", "ESC 2023 IE Guidelines", {
    pmid: "37622656",
    searchQuery: "ESC 2023 infective endocarditis guideline",
  }),
  source("camera2", "trial", "CAMERA2 Trial (Tong et al., JAMA 2020)", {
    pmid: "32044943",
    doi: "10.1001/jama.2020.0103",
    searchQuery: "CAMERA2 trial MRSA bacteremia vancomycin beta lactam",
  }),
  source("fowler-2003-complicated-sab", "review", "Fowler et al. (2003) — Clinical Identifiers of Complicated SAB", {
    aliases: ["Fowler et al., JAMA 2003 — TEE in SAB"],
    pmid: "12874416",
    doi: "10.1001/archinte.163.17.2066",
    searchQuery: "Fowler 2003 clinical identifiers complicated Staphylococcus aureus bacteremia",
  }),
  source("sullenberger-2005-tee-sab", "review", "Sullenberger et al. (2005) — Echocardiography in SAB", {
    pmid: "15700431",
    searchQuery: "Sullenberger 2005 echocardiography Staphylococcus aureus bacteremia",
  }),
  source("holland-2014-sab-review", "review", "Holland et al. (2014, JAMA) — Clinical Management of SAB", {
    aliases: ["Holland et al., JAMA 2014 — Short vs Long Course SAB"],
    pmid: "25268440",
    doi: "10.1001/jama.2014.9743",
    searchQuery: "Holland 2014 JAMA clinical management Staphylococcus aureus bacteremia",
  }),
  source("kang-2012-early-surgery", "trial", "Kang et al., NEJM 2012 — Early Surgery in IE", {
    pmid: "22738096",
    doi: "10.1056/NEJMoa1112843",
    searchQuery: "Kang 2012 NEJM early surgery infective endocarditis",
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

export const OVERVIEW_DISALLOWED_SOURCE_IDS = new Set([
  "fidaxomicin-trials",
  "idsa-shea-cdi",
  "idsa-pji-osteomyelitis",
  "idsa-meningitis-ventriculitis",
  "mascc-cisne",
  "idsa-candidiasis-aspergillosis",
  "restore-imi",
  "sab-bundle-literature",
  "sis-idsa-iai",
  "idsa-sab-bundle-recommendations",
]);

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
  [normalizeSourceText("SSC 2021; IDSA HCAP guidance")]: ["ssc-2021", "ats-idsa-2016-hap-vap"],
  [normalizeSourceText("SSC 2021; ATS/IDSA 2016 HAP/VAP")]: ["ssc-2021", "ats-idsa-2016-hap-vap"],
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
