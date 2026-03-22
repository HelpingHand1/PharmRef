import type { PathogenReference } from "../types";

export const PATHOGEN_REFERENCES: PathogenReference[] = [
  {
    id: "mssa",
    name: "Methicillin-susceptible Staphylococcus aureus",
    phenotype: "MSSA bloodstream and deep-seated infection phenotype",
    summary: "MSSA should trigger same-day beta-lactam optimization because vancomycin is microbiologically active but clinically inferior for serious bloodstream infection.",
    likelySyndromes: ["S. aureus bacteremia", "Native-valve endocarditis", "Catheter-associated bloodstream infection", "Deep abscess or bone/joint seeding"],
    rapidDiagnosticInterpretation: [
      {
        title: "MSSA from blood is a same-day stewardship pivot",
        detail: "When rapid blood-culture identification supports MSSA, the preferred action is immediate exit from vancomycin to cefazolin or nafcillin unless a true beta-lactam contraindication exists.",
        sourceIds: ["aha-2015-ie", "sab-bundle-literature"],
      },
    ],
    contaminationPitfalls: [
      {
        scenario: "Single positive blood culture bottle with S. aureus",
        implication: "Treat S. aureus in blood as clinically meaningful rather than contamination until proven otherwise.",
        action: "Launch the SAB bundle: repeat cultures, source review, and endocarditis workup logic.",
        sourceIds: ["aha-2015-ie", "sab-bundle-literature"],
      },
    ],
    resistanceMechanisms: [
      {
        title: "Beta-lactam susceptibility changes outcomes",
        detail: "The key phenotype question is not whether vancomycin covers MSSA in vitro; it is whether the isolate allows de-escalation to an antistaphylococcal beta-lactam that clears bacteremia faster.",
        sourceIds: ["aha-2015-ie", "sab-bundle-literature"],
      },
    ],
    breakpointCaveats: [
      {
        title: "Do not confuse activity with optimal therapy",
        detail: "Vancomycin susceptibility does not make vancomycin an equal definitive option for MSSA bacteremia or endocarditis.",
        sourceIds: ["aha-2015-ie", "sab-bundle-literature"],
      },
    ],
    preferredTherapyBySite: [
      {
        site: "Bloodstream or endovascular infection",
        preferred: "Cefazolin or nafcillin",
        alternatives: ["Daptomycin only when beta-lactams truly cannot be used"],
        avoid: ["Continuing vancomycin as definitive MSSA therapy"],
        rationale: "Definitive beta-lactam therapy is one of the highest-yield outcome improvements in inpatient ID pharmacy.",
        linkedMonographIds: ["cefazolin", "nafcillin", "daptomycin"],
        sourceIds: ["aha-2015-ie", "sab-bundle-literature"],
      },
      {
        site: "Complicated OPAT completion",
        preferred: "Cefazolin when the syndrome fits and the patient can support IV completion",
        alternatives: ["Nafcillin when cefazolin is not appropriate"],
        rationale: "Cefazolin keeps strong MSSA activity with a cleaner outpatient operational profile than q4h antistaphylococcal penicillins.",
        linkedMonographIds: ["cefazolin", "nafcillin"],
        sourceIds: ["aha-2015-ie", "opat-stewardship"],
      },
    ],
    breakpointRules: [
      {
        title: "Rapid MSSA signal supports immediate de-escalation",
        outcome: "reliable",
        rapidDiagnostic: ["mssa"],
        detail: "If the clinical syndrome is true bloodstream or invasive staphylococcal infection, move to cefazolin or nafcillin the same day.",
        linkedMonographIds: ["cefazolin", "nafcillin"],
        sourceIds: ["aha-2015-ie", "sab-bundle-literature"],
      },
      {
        title: "Do not leave vancomycin on autopilot for MSSA",
        outcome: "avoid",
        interpretation: ["susceptible", "unknown"],
        detail: "Vancomycin can remain active in vitro while still being the wrong definitive execution choice for MSSA bacteremia.",
        linkedMonographIds: ["vancomycin", "cefazolin"],
        sourceIds: ["aha-2015-ie", "sab-bundle-literature"],
      },
    ],
    linkedMonographIds: ["cefazolin", "nafcillin", "vancomycin", "daptomycin"],
    relatedPathways: [
      { diseaseId: "bacteremia-endocarditis", subcategoryId: "sab-workup", label: "S. aureus bacteremia workup" },
      { diseaseId: "bacteremia-endocarditis", subcategoryId: "native-valve-ie", label: "Native-valve endocarditis" },
    ],
  },
  {
    id: "mrsa",
    name: "Methicillin-resistant Staphylococcus aureus",
    phenotype: "MRSA invasive infection phenotype",
    summary: "MRSA needs source-aware therapy plus clearance tracking; susceptibility alone is not enough if exposure, MIC behavior, or source control are off.",
    likelySyndromes: ["MRSA bacteremia", "Nosocomial pneumonia", "Endocarditis", "Complicated SSTI"],
    rapidDiagnosticInterpretation: [
      {
        title: "Rapid MRSA signal should keep active MRSA therapy on board",
        detail: "A blood-culture MRSA signal closes the door on empiric beta-lactam de-escalation and shifts the next decision to vancomycin exposure quality versus daptomycin fit.",
        sourceIds: ["aha-2015-ie", "ashp-idsa-pids-2020-vancomycin"],
      },
    ],
    contaminationPitfalls: [
      {
        scenario: "Positive MRSA nares alone",
        implication: "Colonization increases pretest probability but does not prove invasive MRSA disease.",
        action: "Use nares results to help stop therapy when negative, not as the sole reason to continue it indefinitely.",
        sourceIds: ["ats-idsa-2016-hap-vap"],
      },
    ],
    resistanceMechanisms: [
      {
        title: "PBP2a drives beta-lactam resistance",
        detail: "The mecA/PBP2a phenotype is why cefazolin or nafcillin no longer solve the bloodstream problem once MRSA is confirmed.",
        sourceIds: ["aha-2015-ie"],
      },
    ],
    breakpointCaveats: [
      {
        title: "Vancomycin susceptibility still requires PK stewardship",
        detail: "A 'susceptible' MRSA isolate still needs AUC-guided exposure and repeat-culture/source-control discipline; susceptibility is not permission for lazy dosing.",
        sourceIds: ["ashp-idsa-pids-2020-vancomycin", "camera2"],
      },
      {
        title: "Daptomycin is not a pneumonia rescue",
        detail: "MRSA susceptibility to daptomycin does not make it a lung option because pulmonary surfactant inactivates the drug.",
        sourceIds: ["aha-2015-ie"],
      },
    ],
    preferredTherapyBySite: [
      {
        site: "Bloodstream or endovascular infection",
        preferred: "Vancomycin with AUC/MIC 400-600 or daptomycin when vancomycin exposure is failing or kidney injury is escalating",
        alternatives: ["High-dose daptomycin for persistent bacteremia when lung infection is not the issue"],
        rationale: "Execution hinges on exposure quality, repeat-culture clearance, and source control.",
        linkedMonographIds: ["vancomycin", "daptomycin"],
        sourceIds: ["aha-2015-ie", "ashp-idsa-pids-2020-vancomycin", "camera2"],
      },
      {
        site: "Pneumonia",
        preferred: "Vancomycin or linezolid",
        avoid: ["Daptomycin"],
        rationale: "Linezolid and vancomycin remain the usable lung-directed MRSA options; daptomycin should not be carried into pneumonia because the bug looks susceptible on paper.",
        linkedMonographIds: ["vancomycin", "linezolid", "daptomycin"],
        sourceIds: ["ats-idsa-2016-hap-vap"],
      },
    ],
    breakpointRules: [
      {
        title: "MRSA pneumonia needs lung-active therapy",
        outcome: "avoid",
        site: ["lung", "pneumonia"],
        detail: "Do not interpret daptomycin susceptibility as a green light for MRSA pneumonia.",
        linkedMonographIds: ["daptomycin", "linezolid", "vancomycin"],
        sourceIds: ["ats-idsa-2016-hap-vap"],
      },
      {
        title: "Vancomycin requires exposure validation",
        outcome: "caution",
        interpretation: ["susceptible", "intermediate"],
        detail: "A vancomycin-susceptible report still demands AUC-guided dosing, renal review, and culture-clearance follow-up.",
        linkedMonographIds: ["vancomycin"],
        sourceIds: ["ashp-idsa-pids-2020-vancomycin", "camera2"],
      },
    ],
    linkedMonographIds: ["vancomycin", "linezolid", "daptomycin"],
    relatedPathways: [
      { diseaseId: "bacteremia-endocarditis", subcategoryId: "sab-workup", label: "S. aureus bacteremia workup" },
      { diseaseId: "hap-vap", subcategoryId: "hap-mdr-risk", label: "HAP with MDR risk" },
      { diseaseId: "cap", subcategoryId: "cap-icu", label: "Severe CAP / ICU CAP" },
    ],
  },
  {
    id: "esbl-enterobacterales",
    name: "ESBL-producing Enterobacterales",
    phenotype: "ESBL-E phenotype",
    summary: "Serious ESBL infection is mechanism-driven therapy: carbapenems up front for invasive disease, with oral step-down only when a high-bioavailability susceptible option is real.",
    likelySyndromes: ["Complicated UTI", "Gram-negative bacteremia", "Nosocomial pneumonia", "Sepsis with resistant urinary or abdominal source"],
    rapidDiagnosticInterpretation: [
      {
        title: "Rapid ESBL signal outranks an initially broad cephalosporin plan",
        detail: "Once ESBL is on the table, ceftriaxone and most routine beta-lactams stop being reliable definitive therapy for invasive infection.",
        sourceIds: ["idsa-2024-amr", "merino"],
      },
    ],
    contaminationPitfalls: [
      {
        scenario: "ESBL phenotype in a culture without true infection syndrome",
        implication: "Colonization and prior-history flags should influence empiric coverage but should not trigger prolonged reserve therapy in the absence of infection.",
        action: "Match the phenotype to the current syndrome and source before locking a carbapenem course.",
        sourceIds: ["idsa-2024-amr"],
      },
    ],
    resistanceMechanisms: [
      {
        title: "CTX-M and other ESBL enzymes hydrolyze third-generation cephalosporins",
        detail: "That is why ceftriaxone-nonsusceptibility matters so much in invasive Enterobacterales infection and why carbapenems remain the benchmark.",
        sourceIds: ["idsa-2024-amr", "merino"],
      },
    ],
    breakpointCaveats: [
      {
        title: "Piperacillin-tazobactam is not the serious ESBL default",
        detail: "Reported susceptibility does not outweigh MERINO-level outcome concerns in serious bloodstream ESBL infection.",
        sourceIds: ["merino", "idsa-2024-amr"],
      },
      {
        title: "Oral urinary options stay syndrome-limited",
        detail: "Nitrofurantoin and fosfomycin susceptibility does not make them acceptable for pyelonephritis, bacteremia, or septic obstruction.",
        sourceIds: ["idsa-2025-cuti", "idsa-2024-amr"],
      },
    ],
    preferredTherapyBySite: [
      {
        site: "Bloodstream, sepsis, or non-urinary invasive infection",
        preferred: "Meropenem",
        alternatives: ["Ertapenem only for stable, non-critically ill non-pseudomonal infection"],
        avoid: ["Ceftriaxone", "Piperacillin-tazobactam as definitive serious ESBL therapy"],
        rationale: "Carbapenems remain the most reliable serious-infection ESBL therapy while the source is controlled and bacteremia clears.",
        linkedMonographIds: ["meropenem", "ertapenem"],
        sourceIds: ["idsa-2024-amr", "merino"],
      },
      {
        site: "Complicated UTI / oral step-down",
        preferred: "Active TMP-SMX or fluoroquinolone when susceptibility and oral absorption are reliable",
        alternatives: ["Ertapenem when no good oral exit exists"],
        rationale: "Oral step-down is an execution opportunity only when the agent has true systemic and urinary exposure.",
        linkedMonographIds: ["tmp-smx", "ciprofloxacin", "levofloxacin", "ertapenem"],
        sourceIds: ["idsa-2025-cuti", "idsa-2024-amr", "oral-stepdown-bacteremia"],
      },
    ],
    breakpointRules: [
      {
        title: "Ceftriaxone nonsusceptibility should trigger ESBL thinking",
        outcome: "caution",
        interpretation: ["intermediate", "resistant", "sdd"],
        detail: "Do not keep leaning on ceftriaxone for invasive disease while waiting for the next day's finalized panel.",
        linkedMonographIds: ["ceftriaxone", "meropenem"],
        sourceIds: ["idsa-2024-amr", "merino"],
      },
      {
        title: "Lower-tract-only agents stay lower-tract-only",
        outcome: "avoid",
        site: ["bloodstream", "kidney", "systemic", "pyelonephritis"],
        detail: "A susceptible nitrofurantoin or fosfomycin report is false reassurance for pyelonephritis or bacteremia.",
        linkedMonographIds: ["nitrofurantoin", "fosfomycin"],
        sourceIds: ["idsa-2025-cuti", "idsa-2024-amr"],
      },
    ],
    linkedMonographIds: ["meropenem", "ertapenem", "tmp-smx", "ciprofloxacin", "levofloxacin", "ceftriaxone"],
    relatedPathways: [
      { diseaseId: "amr-gn", subcategoryId: "esbl-e", label: "ESBL Enterobacterales" },
      { diseaseId: "uti", subcategoryId: "complicated-uti", label: "Complicated UTI" },
      { diseaseId: "bacteremia-endocarditis", subcategoryId: "gram-negative-bacteremia", label: "Gram-negative bacteremia" },
    ],
  },
  {
    id: "kpc-cre",
    name: "KPC-producing CRE",
    phenotype: "KPC carbapenemase phenotype",
    summary: "KPC-CRE is where mechanism-directed reserve beta-lactam use matters most; the best agent is the one that matches KPC, site, and prior drug exposure rather than the broadest label.",
    likelySyndromes: ["CRE bacteremia", "Nosocomial pneumonia", "Complicated UTI", "Septic shock with prior CRE"],
    rapidDiagnosticInterpretation: [
      {
        title: "Rapid KPC signal should trigger same-shift reserve-agent alignment",
        detail: "KPC confirmation is actionable before the final panel: move to a KPC-active agent rather than staying on a failing routine carbapenem or cephalosporin plan.",
        sourceIds: ["idsa-2024-amr", "tango-ii", "kpc-observational-outcomes"],
      },
    ],
    contaminationPitfalls: [],
    resistanceMechanisms: [
      {
        title: "KPC is a serine carbapenemase",
        detail: "That is why meropenem-vaborbactam, ceftazidime-avibactam, and imipenem-cilastatin-relebactam can still be rational options when the phenotype fits.",
        sourceIds: ["idsa-2024-amr", "tango-ii", "restore-imi-1"],
      },
    ],
    breakpointCaveats: [
      {
        title: "A 'carbapenem susceptible' edge case does not erase the phenotype",
        detail: "When carbapenemase testing confirms KPC, use the KPC-active strategy rather than pretending a borderline traditional beta-lactam result restores routine therapy.",
        sourceIds: ["idsa-2024-amr", "kpc-observational-outcomes"],
      },
    ],
    preferredTherapyBySite: [
      {
        site: "Bloodstream, urine, or lung when KPC is confirmed",
        preferred: "Meropenem-vaborbactam or ceftazidime-avibactam",
        alternatives: ["Imipenem-cilastatin-relebactam when the isolate and site fit"],
        avoid: ["Routine cefepime, pip-tazo, or ceftriaxone continuation"],
        rationale: "The core decision is picking a serine-carbapenemase-active reserve beta-lactam and then protecting it with correct dosing and infusion strategy.",
        linkedMonographIds: ["meropenem-vaborbactam", "ceftazidime-avibactam", "imipenem-cilastatin-relebactam"],
        sourceIds: ["idsa-2024-amr", "tango-ii", "restore-imi-1", "kpc-observational-outcomes"],
      },
    ],
    breakpointRules: [
      {
        title: "KPC signal makes reserve therapy reliable sooner than AST alone",
        outcome: "reliable",
        rapidDiagnostic: ["kpc"],
        detail: "A rapid KPC result should move you toward meropenem-vaborbactam or another KPC-active reserve agent while the rest of the panel catches up.",
        linkedMonographIds: ["meropenem-vaborbactam", "ceftazidime-avibactam"],
        sourceIds: ["idsa-2024-amr", "tango-ii"],
      },
    ],
    linkedMonographIds: ["meropenem-vaborbactam", "ceftazidime-avibactam", "imipenem-cilastatin-relebactam"],
    relatedPathways: [
      { diseaseId: "amr-gn", subcategoryId: "cre-kpc", label: "KPC-CRE" },
      { diseaseId: "advanced-agents", subcategoryId: "cre-management", label: "Advanced-agent KPC lens" },
    ],
  },
  {
    id: "mbl-cre",
    name: "MBL-producing CRE",
    phenotype: "NDM / VIM / IMP metallo-beta-lactamase phenotype",
    summary: "MBL-CRE is a false-reassurance phenotype: several 'advanced' beta-lactams fail here unless the strategy deliberately accounts for aztreonam protection or uses cefiderocol.",
    likelySyndromes: ["MBL-CRE bacteremia", "Septic urinary-source CRE", "Resistant nosocomial pneumonia"],
    rapidDiagnosticInterpretation: [
      {
        title: "Rapid MBL signal changes the class logic immediately",
        detail: "Once an MBL is on the board, ceftazidime-avibactam alone is not a rescue plan; the strategy must shift to cefiderocol or deliberate aztreonam pairing.",
        sourceIds: ["idsa-2024-amr", "aztreonam-avibactam-evidence"],
      },
    ],
    contaminationPitfalls: [],
    resistanceMechanisms: [
      {
        title: "Metallo-beta-lactamases hydrolyze nearly all beta-lactams except aztreonam",
        detail: "The practical problem is that co-produced serine beta-lactamases usually still destroy aztreonam unless avibactam protection is supplied.",
        sourceIds: ["idsa-2024-amr", "aztreonam-avibactam-evidence"],
      },
    ],
    breakpointCaveats: [
      {
        title: "Ceftazidime-avibactam alone is not an MBL regimen",
        detail: "Avibactam does not inhibit NDM, VIM, or IMP by itself, so ceftazidime-avibactam monotherapy is false reassurance when MBL is the mechanism.",
        sourceIds: ["idsa-2024-amr", "aztreonam-avibactam-evidence"],
      },
    ],
    preferredTherapyBySite: [
      {
        site: "MBL bloodstream, lung, or severe urinary infection",
        preferred: "Ceftazidime-avibactam plus aztreonam or cefiderocol",
        avoid: ["Ceftazidime-avibactam monotherapy", "Meropenem-vaborbactam for true MBL phenotype"],
        rationale: "This is the classic mechanism-over-brand-name problem: pick the regimen that actually neutralizes the enzyme pattern.",
        linkedMonographIds: ["ceftazidime-avibactam", "aztreonam", "cefiderocol", "meropenem-vaborbactam"],
        sourceIds: ["idsa-2024-amr", "aztreonam-avibactam-evidence", "credible-cr"],
      },
    ],
    breakpointRules: [
      {
        title: "Rapid MBL signal should block avibactam monotherapy",
        outcome: "avoid",
        rapidDiagnostic: ["mbl"],
        detail: "Do not keep ceftazidime-avibactam alone when the carbapenemase is an MBL.",
        linkedMonographIds: ["ceftazidime-avibactam", "aztreonam", "cefiderocol"],
        sourceIds: ["idsa-2024-amr", "aztreonam-avibactam-evidence"],
      },
    ],
    linkedMonographIds: ["ceftazidime-avibactam", "aztreonam", "cefiderocol", "meropenem-vaborbactam"],
    relatedPathways: [
      { diseaseId: "amr-gn", subcategoryId: "cre-mbl", label: "MBL-CRE" },
      { diseaseId: "advanced-agents", subcategoryId: "cre-management", label: "Advanced resistant gram-negative agents" },
    ],
  },
  {
    id: "dtr-pseudomonas",
    name: "Difficult-to-treat Pseudomonas aeruginosa",
    phenotype: "DTR Pseudomonas phenotype",
    summary: "DTR Pseudomonas turns every 'susceptible' result into an exposure question: site, infusion strategy, prior beta-lactam exposure, and mechanism clues all matter before escalating to reserve drugs.",
    likelySyndromes: ["HAP/VAP", "Septic shock with prior resistant respiratory isolates", "Complicated UTI", "Bacteremia"],
    rapidDiagnosticInterpretation: [
      {
        title: "DTR Pseudomonas signal should redirect therapy before final AST",
        detail: "A rapid difficult-to-treat Pseudomonas signal is a cue to review prior beta-lactam exposure, site, and which novel anti-pseudomonal agent still matches the mechanism best.",
        sourceIds: ["idsa-2024-amr", "aspect-np", "restore-imi-1"],
      },
    ],
    contaminationPitfalls: [
      {
        scenario: "Respiratory isolation without compatible syndrome",
        implication: "Pseudomonas from chronic airways can represent colonization rather than active pneumonia.",
        action: "Re-anchor treatment to imaging, oxygenation trend, and true respiratory infection phenotype before keeping maximal antipseudomonal therapy.",
        sourceIds: ["ats-idsa-2016-hap-vap", "idsa-2024-amr"],
      },
    ],
    resistanceMechanisms: [
      {
        title: "Efflux, porin loss, and AmpC all shape the drug fit",
        detail: "That is why the best agent is often mechanism-specific rather than simply the most familiar anti-pseudomonal beta-lactam.",
        sourceIds: ["idsa-2024-amr"],
      },
    ],
    breakpointCaveats: [
      {
        title: "Susceptibility only matters if full exposure is delivered",
        detail: "In severe pneumonia or shock, underdosed short-infusion cefepime or meropenem can fail a technically susceptible isolate.",
        sourceIds: ["idsa-2024-amr", "pkpd-stewardship"],
      },
    ],
    preferredTherapyBySite: [
      {
        site: "Pneumonia or invasive DTR Pseudomonas infection",
        preferred: "Ceftolozane-tazobactam, ceftazidime-avibactam, imipenem-cilastatin-relebactam, or cefiderocol based on mechanism and prior exposure",
        alternatives: ["A traditional agent only if high-dose extended-infusion susceptibility remains dependable"],
        rationale: "The right novel agent depends on which resistance mechanism is actually present and whether MBL risk changes the field.",
        linkedMonographIds: ["ceftolozane-tazobactam", "ceftazidime-avibactam", "imipenem-cilastatin-relebactam", "cefiderocol", "cefepime", "meropenem"],
        sourceIds: ["idsa-2024-amr", "aspect-np", "restore-imi-1", "credible-cr"],
      },
    ],
    breakpointRules: [
      {
        title: "Traditional beta-lactam susceptibility may still be usable",
        outcome: "caution",
        interpretation: ["susceptible", "sdd"],
        detail: "Before defaulting to a reserve drug, verify whether a high-dose extended-infusion traditional anti-pseudomonal agent still covers the isolate and site.",
        linkedMonographIds: ["cefepime", "meropenem", "ceftolozane-tazobactam"],
        sourceIds: ["idsa-2024-amr", "pkpd-stewardship"],
      },
      {
        title: "MBL risk changes the novel beta-lactam choice",
        outcome: "avoid",
        rapidDiagnostic: ["mbl"],
        detail: "If the phenotype suggests an MBL-producing Pseudomonas, do not assume your usual novel beta-lactam still works.",
        linkedMonographIds: ["cefiderocol", "ceftolozane-tazobactam", "ceftazidime-avibactam"],
        sourceIds: ["idsa-2024-amr", "credible-cr"],
      },
    ],
    linkedMonographIds: ["ceftolozane-tazobactam", "ceftazidime-avibactam", "imipenem-cilastatin-relebactam", "cefiderocol", "cefepime", "meropenem"],
    relatedPathways: [
      { diseaseId: "amr-gn", subcategoryId: "dtr-pa", label: "DTR Pseudomonas" },
      { diseaseId: "hap-vap", subcategoryId: "hap-mdr-risk", label: "HAP with MDR risk" },
    ],
  },
  {
    id: "crab",
    name: "Carbapenem-resistant Acinetobacter baumannii",
    phenotype: "CRAB phenotype",
    summary: "CRAB is a reserve-pathway phenotype where combination framing and source control matter as much as the drug name; routine HAP bundles are not definitive therapy.",
    likelySyndromes: ["Ventilator-associated pneumonia", "ICU bacteremia", "Wound or line-associated CRAB infection"],
    rapidDiagnosticInterpretation: [
      {
        title: "Routine antipseudomonal therapy is not a CRAB plan",
        detail: "When the isolate phenotype points to CRAB, step out of standard cefepime/pip-tazo logic and move into a CRAB-specific pathway.",
        sourceIds: ["idsa-2024-amr", "attack", "credible-cr"],
      },
    ],
    contaminationPitfalls: [
      {
        scenario: "Respiratory Acinetobacter in chronically colonized ICU patients",
        implication: "The organism can colonize the airway, but when the patient truly has VAP or bacteremia, routine bundles underperform badly.",
        action: "Use the syndrome plus phenotype together; do not treat colonization, but do not mistake true CRAB VAP for routine nosocomial pneumonia.",
        sourceIds: ["idsa-2024-amr", "ats-idsa-2016-hap-vap"],
      },
    ],
    resistanceMechanisms: [
      {
        title: "OXA carbapenemases and multidrug resistance drive the phenotype",
        detail: "That is why sulbactam-durlobactam changed practice and why cefiderocol monotherapy remains a caution story, not a reflex answer.",
        sourceIds: ["idsa-2024-amr", "attack", "credible-cr"],
      },
    ],
    breakpointCaveats: [
      {
        title: "Cefiderocol activity is not monotherapy permission in CRAB",
        detail: "The CRAB subgroup signal in CREDIBLE-CR is why many teams still frame cefiderocol as part of a combination strategy rather than a casual standalone default.",
        sourceIds: ["credible-cr", "idsa-2024-amr"],
      },
    ],
    preferredTherapyBySite: [
      {
        site: "Serious CRAB infection",
        preferred: "Sulbactam-durlobactam-based therapy when available",
        alternatives: ["Cefiderocol in carefully framed salvage or alternative pathways"],
        rationale: "CRAB therapy is driven by phenotype-specific activity and should not be managed like ordinary ICU gram-negative pneumonia.",
        linkedMonographIds: ["cefiderocol"],
        sourceIds: ["idsa-2024-amr", "attack", "credible-cr"],
      },
    ],
    breakpointRules: [
      {
        title: "Routine HAP beta-lactams are false reassurance in CRAB",
        outcome: "avoid",
        interpretation: ["susceptible", "unknown"],
        detail: "Do not keep cycling cefepime or pip-tazo because the patient started there; once CRAB is the working phenotype, the routine HAP scaffold is no longer definitive therapy.",
        linkedMonographIds: ["cefepime", "pip-tazo", "cefiderocol"],
        sourceIds: ["idsa-2024-amr", "attack"],
      },
    ],
    linkedMonographIds: ["cefiderocol"],
    relatedPathways: [
      { diseaseId: "amr-gn", subcategoryId: "crab-steno", label: "CRAB / S. maltophilia" },
      { diseaseId: "hap-vap", subcategoryId: "vap", label: "Ventilator-associated pneumonia" },
    ],
  },
  {
    id: "enterococcus",
    name: "Enterococcus faecalis / faecium",
    phenotype: "Enterococcal bloodstream and endovascular phenotype",
    summary: "Enterococcal therapy is full of false reassurance traps: cephalosporins do not help, source control matters, and bacteremia or endocarditis execution differs sharply by species and susceptibility.",
    likelySyndromes: ["Bacteremia", "Endocarditis", "Biliary or urinary-source invasive infection"],
    rapidDiagnosticInterpretation: [
      {
        title: "Enterococcus changes the beta-lactam logic completely",
        detail: "Once bloodstream identification shifts from staphylococci to Enterococcus, the cephalosporin-based pathway needs to stop immediately.",
        sourceIds: ["aha-2015-ie", "esc-2023-ie"],
      },
    ],
    contaminationPitfalls: [
      {
        scenario: "Urine Enterococcus without invasive syndrome",
        implication: "Urinary isolation may not explain systemic illness by itself, especially in colonized or catheterized patients.",
        action: "Do not let colonizing urine Enterococcus distract from the true bloodstream or abdominal source if the patient remains unstable.",
        sourceIds: ["idsa-2025-cuti"],
      },
    ],
    resistanceMechanisms: [
      {
        title: "Cephalosporins are intrinsically inactive",
        detail: "This is the central stewardship trap: a ceftriaxone-susceptible-looking workflow elsewhere in the chart does not solve Enterococcus.",
        sourceIds: ["aha-2015-ie", "esc-2023-ie"],
      },
    ],
    breakpointCaveats: [
      {
        title: "Species and synergy still matter",
        detail: "Endovascular enterococcal infection is not a one-size-fits-all susceptibility problem; species, beta-lactam susceptibility, and aminoglycoside synergy all shape the regimen.",
        sourceIds: ["aha-2015-ie", "esc-2023-ie"],
      },
    ],
    preferredTherapyBySite: [
      {
        site: "Bacteremia or endocarditis",
        preferred: "Ampicillin-based therapy when the isolate and species fit; move to species-appropriate alternatives when they do not",
        rationale: "The big stewardship win is abandoning cephalosporin thinking early and aligning definitive therapy to real enterococcal biology.",
        linkedMonographIds: ["ampicillin", "gentamicin", "ceftriaxone"],
        sourceIds: ["aha-2015-ie", "esc-2023-ie"],
      },
    ],
    breakpointRules: [
      {
        title: "Cephalosporin activity is false reassurance for Enterococcus",
        outcome: "avoid",
        detail: "Do not keep ceftriaxone or cefepime as if they were definitive enterococcal therapy because another syndrome page used them upstream.",
        linkedMonographIds: ["ceftriaxone", "cefepime", "ampicillin"],
        sourceIds: ["aha-2015-ie", "esc-2023-ie"],
      },
    ],
    linkedMonographIds: ["ampicillin", "gentamicin", "ceftriaxone"],
    relatedPathways: [
      { diseaseId: "bacteremia-endocarditis", subcategoryId: "native-valve-ie", label: "Native-valve endocarditis" },
      { diseaseId: "bacteremia-endocarditis", subcategoryId: "prosthetic-valve-ie", label: "Prosthetic-valve endocarditis" },
    ],
  },
  {
    id: "candida-species",
    name: "Candida species",
    phenotype: "Invasive candidemia / invasive candidiasis phenotype",
    summary: "Candida therapy depends on separating colonization from invasive disease and then choosing the antifungal class that fits species, stability, and source control.",
    likelySyndromes: ["Candidemia", "Line-associated bloodstream infection", "Intra-abdominal candidiasis", "Critical illness with invasive fungal risk"],
    rapidDiagnosticInterpretation: [
      {
        title: "Yeast in blood should trigger invasive candidiasis workflow, not watchful waiting",
        detail: "Candida from blood is clinically meaningful, and the early execution questions are source control, echinocandin start, and ophthalmology/clearance follow-up when indicated.",
        sourceIds: ["idsa-candidiasis", "escmid-2012-candida"],
      },
    ],
    contaminationPitfalls: [
      {
        scenario: "Candida in urine without invasive syndrome",
        implication: "Candiduria frequently reflects colonization rather than a treatable invasive infection.",
        action: "Do not let asymptomatic candiduria create reflex systemic antifungal therapy.",
        sourceIds: ["idsa-candidiasis", "idsa-2025-cuti"],
      },
    ],
    resistanceMechanisms: [
      {
        title: "Species drives azole versus echinocandin fit",
        detail: "Candida glabrata and other non-albicans species are why echinocandins remain the clean default for unstable candidemia while the species and susceptibilities mature.",
        sourceIds: ["idsa-candidiasis", "escmid-2012-candida"],
      },
    ],
    breakpointCaveats: [
      {
        title: "Fluconazole is not the universal day-1 answer",
        detail: "Reported or presumed fluconazole activity is not enough when the patient is unstable, the species is unknown, or bloodstream infection is still clearing.",
        sourceIds: ["idsa-candidiasis", "escmid-2012-candida"],
      },
    ],
    preferredTherapyBySite: [
      {
        site: "Candidemia or unstable invasive candidiasis",
        preferred: "Micafungin or another echinocandin",
        alternatives: ["Fluconazole step-down once the species, susceptibility, and clinical stability fit"],
        rationale: "The high-yield move is starting with the safer broad antifungal class, then stepping down deliberately rather than starting too narrow.",
        linkedMonographIds: ["micafungin", "fluconazole"],
        sourceIds: ["idsa-candidiasis", "escmid-2012-candida"],
      },
    ],
    breakpointRules: [
      {
        title: "Urinary Candida is not automatic invasive disease",
        outcome: "caution",
        site: ["urine", "bladder"],
        detail: "Do not treat candiduria like candidemia unless the syndrome, host factors, and invasive context support it.",
        linkedMonographIds: ["fluconazole", "micafungin"],
        sourceIds: ["idsa-candidiasis", "idsa-2025-cuti"],
      },
      {
        title: "Unknown species candidemia favors an echinocandin first",
        outcome: "reliable",
        interpretation: ["unknown"],
        rapidDiagnostic: ["candida"],
        detail: "Micafungin-class therapy is the clean day-1 starting point while species and azole susceptibility clarify.",
        linkedMonographIds: ["micafungin", "fluconazole"],
        sourceIds: ["idsa-candidiasis", "escmid-2012-candida"],
      },
    ],
    linkedMonographIds: ["micafungin", "fluconazole"],
    relatedPathways: [
      { diseaseId: "fungal-infections", subcategoryId: "candidemia", label: "Candidemia" },
      { diseaseId: "sepsis", subcategoryId: "septic-shock", label: "Septic shock" },
    ],
  },
];

export const PATHOGEN_REFERENCE_BY_ID: Record<string, PathogenReference> = Object.fromEntries(
  PATHOGEN_REFERENCES.map((pathogen) => [pathogen.id, pathogen]),
);
