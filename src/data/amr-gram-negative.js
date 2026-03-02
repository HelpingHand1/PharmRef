export const AMR_GN = {
    id: "amr-gn",
    name: "AMR Gram-Negative Infections",
    icon: "🛡️",
    category: "Antimicrobial Resistance — IDSA 2024 Guidance (Tamma et al.)",
    overview: {
      definition: "The IDSA 2024 Guidance on the Treatment of Antimicrobial-Resistant Gram-Negative Infections (Tamma et al., CID 2024, v4.0) is the definitive US resource for managing resistant gram-negative pathogens. It covers six resistance phenotypes: ESBL-E, AmpC-E, CRE, DTR P. aeruginosa, CRAB, and S. maltophilia. This is NOT a disease-state guideline — it is a RESISTANCE-PATTERN guideline. It assumes the causative organism and susceptibilities are KNOWN, and provides preferred/alternative agent selection stratified by site of infection (cystitis vs pyelonephritis/cUTI vs non-urinary). The key principle: treatment selection should be guided by the specific resistance mechanism, not just the organism name.",
      epidemiology: "AMR gram-negatives caused >2.8 million infections and >35,000 deaths annually in the US (2012-2017, CDC). ESBL-E are the most common resistance phenotype encountered in clinical practice — CTX-M-15 is the dominant ESBL in the US. CRE are classified as an urgent threat by the CDC. KPC is the dominant US carbapenemase (~80-86% of carbapenemase-producing CRE), but MBL prevalence (NDM, VIM, IMP) is RISING (from 4% to 20% of CRE between 2019-2021). DTR P. aeruginosa (non-susceptible to all standard beta-lactams, FQs, and carbapenems) represents the most challenging Pseudomonal infections. CRAB carries the highest crude mortality of any gram-negative resistance phenotype (40-60%).",
      keyGuidelines: [
        { name: "IDSA 2024 AMR Guidance v4.0 (Tamma et al., CID 2024)", detail: "Fourth iteration of the living guidance document. Panel of 6 ID specialists. Key updates from v3.0 (2023): sulbactam-durlobactam added as preferred for CRAB, high-dose amp-sulb downgraded to alternative for CRAB, MBL prevalence increasing in US acknowledged, cefepime MIC 4-8 concern for AmpC-E removed, ceftolozane-tazobactam acknowledged as likely effective for ESBL-E but reserved for DTR-PA. Current as of December 31, 2023. Updated annually at idsociety.org/practice-guideline/amr-guidance/." },
        { name: "MERINO Trial (Harris et al., JAMA 2018)", detail: "Landmark RCT: pip-tazo vs meropenem for ESBL-E bloodstream infections. 30-day mortality 12.3% (pip-tazo) vs 3.7% (meropenem). Pip-tazo FAILED non-inferiority. Established carbapenems as standard of care for serious ESBL-E infections. Even on reanalysis restricting to pip-tazo MIC <=16, risk difference still favored meropenem (9% vs 4%). Practice-changing: do NOT use pip-tazo for serious ESBL-E infections." },
        { name: "CLSI Breakpoint Updates (2022-2024)", detail: "Pip-tazo Enterobacterales breakpoints lowered (2022): susceptible <=8/4, susceptible dose-dependent 16. Aminoglycoside breakpoints revised (2023). Ceftazidime breakpoints for S. maltophilia removed (2024). Broth disk elution method endorsed for testing ceftazidime-avibactam/aztreonam combination against MBL-producers and S. maltophilia." },
        { name: "CDC Antibiotic Resistance Threats Report (2019)", detail: "Classified resistance threats by urgency. URGENT: CRE, CRAB, C. auris. SERIOUS: ESBL-E, DTR P. aeruginosa, S. maltophilia (not formally classified but covered in IDSA guidance). Guides national stewardship priorities and funding allocation." },
      ],
      landmarkTrials: [
        { name: "MERINO (Harris et al., 2018 JAMA)", detail: "391 patients with ceftriaxone-non-susceptible E. coli/K. pneumoniae BSI (87% confirmed ESBL). Pip-tazo 4.5g q6h vs meropenem 1g q8h (both standard infusion). 30-day mortality: 12.3% vs 3.7%. Pip-tazo failed non-inferiority. Cemented carbapenems as preferred for serious ESBL-E. Key nuance: standard infusion was used — extended infusion pip-tazo was NOT tested." },
        { name: "TANGO II (Wunderink et al., 2018 CID)", detail: "Meropenem-vaborbactam vs best available therapy (BAT, often polymyxin-based) for CRE infections. Clinical cure 59% vs 26%. 28-day mortality 16% vs 33%. Demonstrated superiority of novel BL-BLI agents over polymyxin-based regimens for CRE." },
        { name: "TANGO III / CREDIBLE-CR (Bassetti et al., 2021 Lancet ID)", detail: "Cefiderocol vs BAT for carbapenem-resistant infections (CRE, CRAB, DTR-PA). All-cause mortality numerically higher with cefiderocol in CRAB subgroup, raising caution about cefiderocol monotherapy for CRAB. Supported cefiderocol use for CRE and DTR-PA but led to recommendation for combination therapy for CRAB." },
        { name: "RESTORE-IMI 1 (Motsch et al., 2020 CID)", detail: "Imipenem-cilastatin-relebactam vs imipenem + colistin for imipenem-non-susceptible infections. Favorable response 71% vs 40%. Supported imipenem-relebactam for CRE and DTR-PA with lower toxicity than colistin-based regimens." },
        { name: "ATTACK Trial (Kaye et al., 2023 Lancet ID)", detail: "Sulbactam-durlobactam + imipenem-cilastatin vs colistin + imipenem-cilastatin for CRAB. 28-day mortality 19% vs 32%. Led to FDA approval of sulbactam-durlobactam (Xacduro) and its addition as preferred agent for CRAB in 2024 guidance update." },
        { name: "Observational: Ceftazidime-avibactam + Aztreonam for MBL (Falcone et al., 2021)", detail: "102 patients with MBL-producing Enterobacterales BSI. Ceftazidime-avibactam + aztreonam vs other regimens. 30-day mortality 19% vs 44%. Established caz-avi + aztreonam as preferred treatment for MBL-CRE pending FDA-approved aztreonam-avibactam." },
      ],
      riskFactors: "Risk factors for AMR gram-negatives: prior antibiotic exposure (especially FQs, cephalosporins) within 90 days, prior MDR culture within 12 months, recent hospitalization (>48h in past 90 days), residence in long-term care facility, international travel (especially South/Southeast Asia for ESBL/NDM), presence of indwelling devices (urinary catheters, central lines), immunosuppression, recurrent UTIs, prior organ transplant, chronic wounds, ICU stay, mechanical ventilation (for DTR-PA, CRAB).",
    },
    subcategories: [
      {
        id: "esbl-e",
        name: "ESBL-Producing Enterobacterales (ESBL-E)",
        definition: "ESBLs are enzymes that hydrolyze most penicillins, cephalosporins, and aztreonam. CTX-M-15 is the dominant ESBL in the US. Most prevalent in E. coli, K. pneumoniae, K. oxytoca, and P. mirabilis. ESBL-E generally remain susceptible to carbapenems. Non-susceptibility to ceftriaxone (MIC >=2) is used as a proxy for ESBL production. IDSA 2024: Carbapenems are preferred for serious ESBL-E infections outside the urinary tract. Pip-tazo is NOT recommended (MERINO). Cefepime is NOT recommended for ESBL-E even if susceptible.",
        clinicalPresentation: "ESBL-E cause the same clinical syndromes as susceptible Enterobacterales — UTIs, bacteremia, IAI, pneumonia, SSTIs. The difference is not the presentation but the TREATMENT. Suspect ESBL when: prior ESBL culture, recent cephalosporin/FQ exposure, travel to endemic areas, recurrent UTIs with resistance, nursing home residence. The microbiology lab identifies ESBL via ceftriaxone non-susceptibility (MIC >=2) — routine ESBL confirmatory testing is not performed at most labs.",
        diagnostics: "Identified by antimicrobial susceptibility testing: ceftriaxone non-susceptible (MIC >=2) is used as a proxy for ESBL production. Molecular testing (PCR for blaCTX-M, blaTEM, blaSHV genes) confirms ESBL type but is not routine. CLSI breakpoints guide interpretation. KEY: pip-tazo MIC testing may be INACCURATE for ESBL-E (poor reproducibility with commercial AST methods) — susceptibility on the report does NOT guarantee clinical efficacy.",
        empiricTherapy: [
          {
            line: "Preferred — Uncomplicated Cystitis",
            options: [
              { drug: "nitrofurantoin", regimen: "Nitrofurantoin 100mg PO BID × 5 days", notes: "IDSA 2024 preferred for ESBL-E uncomplicated cystitis. NOT affected by ESBL enzymes (different mechanism). Achieves high urinary concentrations. Does NOT achieve systemic levels — for cystitis ONLY, never for pyelonephritis or bacteremia." },
              { drug: "tmp-smx", regimen: "TMP-SMX DS 1 tab PO BID × 3 days", notes: "IDSA 2024 preferred for ESBL-E uncomplicated cystitis IF susceptible. Not a beta-lactam — unaffected by ESBLs. Co-resistance is common (ESBL-E often carry additional resistance genes), so susceptibility must be confirmed." },
            ],
          },
          {
            line: "Preferred — Pyelonephritis / Complicated UTI",
            options: [
              { drug: "tmp-smx", regimen: "TMP-SMX DS 1 tab PO BID × 5-7 days", notes: "IDSA 2024 preferred for ESBL-E pyelonephritis/cUTI if susceptible. High urinary AND renal parenchymal concentrations. Oral step-down target from carbapenems. Achieves adequate serum levels for tissue penetration." },
              { drug: "ciprofloxacin", regimen: "Ciprofloxacin 500mg PO BID × 5-7 days (or Levofloxacin 750mg PO daily)", notes: "IDSA 2024 preferred for ESBL-E pyelonephritis/cUTI if susceptible. High bioavailability. However, ESBL-E frequently co-resistant to FQs. Reserve for confirmed susceptible isolates to limit further FQ selection pressure." },
              { drug: "ertapenem", regimen: "Ertapenem 1g IV daily", notes: "IDSA 2024 preferred when TMP-SMX/FQ are not options (resistance or toxicity). Transition to oral TMP-SMX or FQ when susceptible and clinically improving. NOT for critically ill or hypoalbuminemic patients — use meropenem instead." },
            ],
          },
          {
            line: "Preferred — Non-Urinary Infections (BSI, IAI, Pneumonia)",
            options: [
              { drug: "meropenem", regimen: "Meropenem 1g IV q8h (extended infusion over 3h)", notes: "IDSA 2024 preferred for ESBL-E infections outside urinary tract. MERINO trial standard of care. Extended infusion optimizes T>MIC. For critically ill or hypoalbuminemic patients, use meropenem or imipenem — NOT ertapenem." },
              { drug: "ertapenem", regimen: "Ertapenem 1g IV daily", notes: "IDSA 2024 preferred for non-critically ill with normal albumin. Once-daily dosing ideal for OPAT. Ertapenem clearance increases with hypoalbuminemia (highly protein-bound) — observational data showed 5× higher mortality in hypoalbuminemic patients receiving ertapenem vs meropenem." },
            ],
          },
          {
            line: "Avoid for ESBL-E (Even If Susceptible on Report)",
            options: [
              { drug: "pip-tazo-avoid", regimen: "Piperacillin-tazobactam — NOT recommended for ESBL-E", notes: "MERINO trial: pip-tazo FAILED non-inferiority vs meropenem for ESBL-E BSI (12% vs 4% mortality). Mechanistic concerns: tazobactam may not reliably inhibit ESBLs (low tazobactam:piperacillin ratio of 1:8, MIC testing unreliable, inoculum effect). In vitro susceptibility does NOT guarantee clinical efficacy. Exception: if pip-tazo was started empirically for uncomplicated cystitis and patient improves, no change needed." },
              { drug: "cefepime-avoid", regimen: "Cefepime — NOT recommended for ESBL-E", notes: "ESBLs commonly hydrolyze cefepime. Cefepime MIC testing unreliable for ESBL-E. Clinical trial arm terminated early for high failure signal in ESBL-E pyelonephritis/cUTI despite MICs of 1-2. Observational data show poorer outcomes vs carbapenems for invasive ESBL-E. Do NOT trust cefepime susceptibility for confirmed ESBL-E." },
            ],
          },
        ],
        organismSpecific: [
          { organism: "ESBL-E — Uncomplicated Cystitis", preferred: "Nitrofurantoin, TMP-SMX", alternative: "FQs, single-dose aminoglycoside, fosfomycin (E. coli only), carbapenems", notes: "For cystitis: use narrow-spectrum agents. Nitrofurantoin and TMP-SMX are unaffected by ESBLs. Reserve carbapenems and FQs for when narrow agents are not active. Fosfomycin only for E. coli (other species carry fosA gene = intrinsic resistance). Doxycycline NOT recommended for ESBL-E cystitis (limited urinary excretion)." },
          { organism: "ESBL-E — Pyelonephritis / Complicated UTI", preferred: "TMP-SMX, FQs (if susceptible); carbapenems (if TMP-SMX/FQ not options)", alternative: "Aminoglycosides (once-daily, duration-limited)", notes: "Step down to oral TMP-SMX or FQ whenever possible. Carbapenems for initial therapy if severely ill, then de-escalate. Nitrofurantoin and fosfomycin do NOT achieve adequate renal parenchymal concentrations — never use for pyelonephritis." },
          { organism: "ESBL-E — Non-Urinary (BSI, IAI, Pneumonia)", preferred: "Meropenem, imipenem-cilastatin (critically ill/hypoalbuminemic); ertapenem (stable, normal albumin)", alternative: "Oral step-down to TMP-SMX or FQ after clinical improvement", notes: "MERINO established carbapenems as the standard. Step down to oral agents aggressively. Novel BL-BLIs (caz-avi, mer-vab, imi-rele) are effective but should be RESERVED for CRE. Using caz-avi for ESBL-E is wasteful stewardship." },
        ],
        pearls: [
          "MERINO IS THE DEFINING TRIAL: Pip-tazo failed non-inferiority to meropenem for ESBL-E BSI. This is not a debatable point — it's a completed, well-designed RCT. When someone wants to use pip-tazo for ESBL-E bacteremia because 'it was susceptible on the report,' cite MERINO. The AST result is unreliable for ESBL-E with pip-tazo.",
          "Pip-tazo susceptibility is MECHANISTICALLY unreliable for ESBL-E: The tazobactam:piperacillin ratio in a dose (1:8) means relatively little inhibitor is present. With high ESBL expression, increased inoculum, or multiple beta-lactamases, tazobactam is overwhelmed. MIC testing doesn't capture this — 94% of MERINO isolates were pip-tazo 'susceptible' by current breakpoints, yet pip-tazo still failed.",
          "Ertapenem vs meropenem selection matters: Ertapenem is highly protein-bound (92-95%). Hypoalbuminemia increases free drug, increases clearance, decreases half-life — potentially leading to subtherapeutic levels. Observational data showed 5× higher mortality in hypoalbuminemic patients (albumin <2.5) receiving ertapenem vs meropenem. Rule: critically ill or albumin <2.5 → meropenem. Stable outpatient with normal albumin → ertapenem (OPAT-friendly).",
          "Cefepime for ESBL-E: DON'T. A randomized trial for ESBL-E pyelonephritis TERMINATED the cefepime arm early for high clinical failure, even with cefepime MICs of 1-2. This is not just about MIC accuracy — ESBLs hydrolyze cefepime, and commercial AST may not reliably detect this. Cefepime is for AmpC-E, not ESBL-E.",
          "ORAL STEP-DOWN IS THE GOAL: The biggest stewardship win in ESBL-E management is transitioning from carbapenem to oral TMP-SMX or FQ. Multiple observational studies support oral step-down for ESBL-E BSI after clinical milestones (hemodynamically stable, source controlled, susceptibility confirmed). Every day of unnecessary carbapenem selects for CRE.",
          "Novel BL-BLIs for ESBL-E = stewardship failure: Caz-avi, mer-vab, and imi-rele are all active against ESBL-E but should be RESERVED for CRE. Using these agents for ESBL-E when a standard carbapenem would suffice wastes the agents we need for much harder-to-treat CRE infections.",
        ],
      },
      {
        id: "ampc-e",
        name: "AmpC β-Lactamase-Producing Enterobacterales (AmpC-E)",
        definition: "AmpC β-lactamases are chromosomally encoded enzymes that hydrolyze cephalosporins when overexpressed. The IDSA 2024 guidance identifies three organisms at MODERATE risk for clinically significant inducible AmpC production: Enterobacter cloacae complex, Klebsiella aerogenes, and Citrobacter freundii. Key concept: an isolate may initially test SUSCEPTIBLE to ceftriaxone, but exposure to ceftriaxone INDUCES ampC expression → resistance emerges during treatment (~20% risk). Cefepime is the preferred agent — it is both a weak ampC inducer AND resistant to AmpC hydrolysis. The old SPACE/SPICE mnemonics are oversimplified and outdated.",
        clinicalPresentation: "Same clinical syndromes as other Enterobacterales. The clinical challenge is not the presentation but the TREATMENT TRAP: cultures return susceptible to ceftriaxone, clinician starts ceftriaxone, resistance emerges during therapy, patient fails treatment. This is the classic AmpC story and occurs in ~20% of E. cloacae/K. aerogenes/C. freundii infections treated with ceftriaxone.",
        diagnostics: "Routine AST identifies susceptibility patterns. There is NO CLSI-endorsed test for AmpC detection in clinical isolates. The pharmacist must KNOW which organisms carry inducible ampC genes and intervene regardless of reported ceftriaxone susceptibility. If the lab reports 'E. cloacae susceptible to ceftriaxone,' YOUR job is to flag this and recommend cefepime instead.",
        empiricTherapy: [
          {
            line: "Preferred — Invasive Infections (E. cloacae, K. aerogenes, C. freundii)",
            options: [
              { drug: "cefepime", regimen: "Cefepime 2g IV q8h (extended infusion over 3h)", notes: "IDSA 2024 preferred for AmpC-E infections. Weak ampC inducer AND stable against AmpC hydrolysis (forms stable acyl enzyme complexes). Observational studies and meta-analysis show similar outcomes to carbapenems. No clinical trial exists comparing cefepime vs carbapenem for AmpC-E, but mechanism and observational data strongly support cefepime. CARBAPENEM-SPARING — this is the critical stewardship advantage." },
              { drug: "meropenem", regimen: "Meropenem 1g IV q8h (extended infusion)", notes: "Carbapenems are stable against AmpC hydrolysis. Use for AmpC-E when cefepime cannot be used (allergy, cefepime neurotoxicity, polymicrobial infection requiring broader coverage). Imipenem is a potent ampC inducer but remains stable to hydrolysis. Ertapenem reasonable for stable, non-critically ill." },
            ],
          },
          {
            line: "Preferred — Uncomplicated Cystitis",
            options: [
              { drug: "nitrofurantoin", regimen: "Nitrofurantoin 100mg PO BID × 5 days", notes: "IDSA 2024 preferred for AmpC-E uncomplicated cystitis. Not a beta-lactam — unaffected by AmpC. Ceftriaxone is also acceptable for uncomplicated cystitis (high urinary concentrations overcome AmpC concerns)." },
              { drug: "tmp-smx", regimen: "TMP-SMX DS 1 tab PO BID × 3 days", notes: "IDSA 2024 preferred for AmpC-E cystitis if susceptible. Not a beta-lactam substrate." },
            ],
          },
          {
            line: "Avoid for Invasive AmpC-E Infections",
            options: [
              { drug: "ceftriaxone-avoid", regimen: "Ceftriaxone — NOT recommended for invasive E. cloacae, K. aerogenes, C. freundii", notes: "EVEN IF SUSCEPTIBLE on initial AST. ~20% resistance emergence during therapy. Ceftriaxone is a substrate for AmpC hydrolysis — once ampC is induced/derepressed, ceftriaxone fails. This is the most common AmpC treatment error. Exception: uncomplicated cystitis (high urinary concentrations) or step-down after clear clinical improvement with no ongoing source." },
              { drug: "pip-tazo-ampc-avoid", regimen: "Piperacillin-tazobactam — NOT recommended for invasive AmpC-E infections", notes: "Tazobactam is a POOR inhibitor of AmpC enzymes (unlike avibactam/relebactam/vaborbactam). Multiple observational studies show poorer outcomes with pip-tazo vs cefepime or carbapenems for AmpC-E bacteremia. Pilot RCT showed higher microbiological failure with pip-tazo vs meropenem for AmpC-E BSI." },
            ],
          },
        ],
        organismSpecific: [
          { organism: "E. cloacae complex, K. aerogenes, C. freundii (MODERATE AmpC risk)", preferred: "Cefepime, carbapenems (meropenem/ertapenem/imipenem)", alternative: "TMP-SMX, FQs (if susceptible, for oral step-down)", notes: "These three organisms: ~20% risk of resistance emergence on ceftriaxone. ALWAYS use cefepime or carbapenem for invasive infections regardless of ceftriaxone susceptibility. Basal AmpC production makes them intrinsically resistant to ampicillin, amoxicillin-clavulanate, amp-sulbactam, and first/second-gen cephalosporins." },
          { organism: "S. marcescens, M. morganii, Providencia spp. (LOW AmpC risk)", preferred: "Treat per AST results — ceftriaxone acceptable if susceptible", alternative: "Cefepime (if high bacterial burden or limited source control)", notes: "IDSA 2024: <5% clinically significant ampC induction. Treat according to AST. DO NOT reflexively avoid ceftriaxone for these organisms — the old SPACE mnemonic overestimates their AmpC risk. Exception: for high-inoculum infections (endocarditis, undrained abscess), reasonable to use cefepime over ceftriaxone even for these organisms." },
        ],
        pearls: [
          "CEFEPIME IS THE KEY DRUG FOR AmpC-E: It is both a weak inducer AND resistant to hydrolysis. This dual property makes it uniquely suited for AmpC-E. Carbapenems also work but are broader than necessary. Cefepime = carbapenem-sparing first-line for AmpC-E. This is a high-value stewardship intervention.",
          "The SPACE/SPICE mnemonics are OUTDATED: These mnemonics lump organisms with very different ampC induction potential into one group. Serratia and Providencia have <5% induction risk — treating them like Enterobacter is stewardship overcorrection. IDSA 2024 simplifies it: MODERATE risk = E. cloacae, K. aerogenes, C. freundii. LOW risk = S. marcescens, M. morganii, Providencia. Treat accordingly.",
          "Ceftriaxone susceptibility is a TRAP for E. cloacae: The isolate tests susceptible today. You start ceftriaxone. By day 3-5, ampC is induced, resistance emerges, the patient fails. This happens in ~20% of cases — that's 1 in 5 patients. The cost of using cefepime instead is zero additional toxicity and massively reduced risk of treatment failure.",
          "Cefepime SDD (MIC 4-8) for AmpC-E: IDSA 2024 REMOVED the previous concern about cefepime MICs 4-8 indicating ESBL co-production. Updated data show no reliable correlation between cefepime SDD MICs and ESBL presence in AmpC-E. Cefepime 2g q8h extended infusion is appropriate for cefepime SDD isolates.",
          "Pip-tazo is NOT a good AmpC-E agent: Tazobactam is a poor AmpC inhibitor compared to avibactam, relebactam, and vaborbactam. Observational studies consistently show higher failure rates with pip-tazo vs cefepime or carbapenems for AmpC-E BSI. Save pip-tazo for infections where AmpC is not a concern.",
        ],
      },
      {
        id: "cre-kpc",
        name: "CRE — KPC-Producing Enterobacterales",
        definition: "KPC (Klebsiella pneumoniae carbapenemase) is the dominant carbapenemase in the US, accounting for 80-86% of carbapenemase-producing CRE. KPC hydrolyzes all beta-lactams including carbapenems. It is inhibited by avibactam, vaborbactam, and relebactam — making the newer BL-BLI combinations the treatment of choice. The IDSA 2024 guidance slightly favors meropenem-vaborbactam, followed by ceftazidime-avibactam, then imipenem-cilastatin-relebactam, based on clinical outcomes data and resistance emergence risk.",
        clinicalPresentation: "CRE cause the same syndromes as other Enterobacterales but with dramatically higher mortality (30-50% for BSI). CDC classifies CRE as an URGENT threat. Common presentations: BSI (often from urinary or abdominal source), complicated UTI, hospital-acquired pneumonia, IAI. Most CRE infections are healthcare-associated — suspect in patients with recent hospitalization, ICU stays, prior broad-spectrum antibiotics, or residence in endemic facilities.",
        diagnostics: "AST identifies carbapenem non-susceptibility. Carbapenemase detection: phenotypic (modified carbapenem inactivation method — mCIM, distinguishes carbapenemase vs non-carbapenemase CRE) and molecular (PCR for blaKPC, blaNDM, blaVIM, blaIMP, blaOXA-48-like). IDSA strongly encourages labs to implement SPECIFIC carbapenemase identification — the choice of preferred agent depends on WHICH carbapenemase is present. Knowing 'CRE' is not enough; knowing 'KPC-producing CRE' drives treatment selection.",
        empiricTherapy: [
          {
            line: "Preferred — KPC-Producing CRE (Non-Urinary Infections)",
            options: [
              { drug: "meropenem-vaborbactam", regimen: "Meropenem-vaborbactam 4g IV q8h (extended infusion over 3h)", notes: "IDSA 2024: slightly favored among the three preferred agents. TANGO II trial: 59% clinical cure vs 26% with BAT for CRE. >95% activity against KPC-producing CRE. Vaborbactam is a potent boronic acid inhibitor of KPCs. Lowest resistance emergence risk of the three preferred agents. 4g = 2g meropenem + 2g vaborbactam per dose." },
              { drug: "ceftazidime-avibactam", regimen: "Ceftazidime-avibactam 2.5g IV q8h (infused over 2h)", notes: "IDSA 2024 preferred. >95% activity against KPC-CRE. Avibactam inhibits KPC, ESBL, AmpC, and OXA-48-like enzymes. Most clinical experience of any novel BL-BLI for CRE. CAUTION: higher resistance emergence risk than mer-vab (KPC mutations in omega loop can cause caz-avi resistance). 2.5g = 2g ceftazidime + 0.5g avibactam." },
              { drug: "imipenem-relebactam", regimen: "Imipenem-cilastatin-relebactam 1.25g IV q6h (infused over 30 min)", notes: "IDSA 2024 preferred. RESTORE-IMI 1: 71% favorable response vs 40% for imipenem + colistin. >95% activity against KPC-CRE. Relebactam inhibits KPC and AmpC. Fewest clinical data of the three preferred agents, hence ranked third. 1.25g = 500mg imipenem + 500mg cilastatin + 250mg relebactam." },
            ],
          },
          {
            line: "Preferred — CRE Pyelonephritis / Complicated UTI",
            options: [
              { drug: "tmp-smx-cre-uti", regimen: "TMP-SMX, ciprofloxacin, or levofloxacin (if susceptible)", notes: "IDSA 2024: if susceptibility confirmed, non-beta-lactam agents are preferred for CRE UTI to preserve novel BL-BLIs. Minority of CRE will be susceptible to these agents, but always check. Oral agents allow outpatient completion." },
              { drug: "caz-avi-cre-uti", regimen: "Ceftazidime-avibactam, meropenem-vaborbactam, or imipenem-relebactam (any preferred for CRE UTI)", notes: "Use novel BL-BLIs for CRE pyelonephritis/cUTI when TMP-SMX/FQ not available. Aminoglycosides (once-daily) are alternative for CRE UTI — good renal cortex concentrations, convenient dosing for short courses." },
            ],
          },
          {
            line: "Alternative — KPC-CRE",
            options: [
              { drug: "cefiderocol-cre", regimen: "Cefiderocol 2g IV q8h (infused over 3h)", notes: "IDSA 2024 alternative for KPC-CRE. Siderophore cephalosporin — uses bacterial iron transport for cell entry. >95% activity against KPC-CRE. Reserved as alternative to preserve for MBL-CRE and CRAB where fewer options exist. Clinical data for KPC-CRE more limited than the three preferred BL-BLIs." },
            ],
          },
        ],
        organismSpecific: [
          { organism: "KPC-producing K. pneumoniae (most common US CRE)", preferred: "Meropenem-vaborbactam > ceftazidime-avibactam > imipenem-relebactam", alternative: "Cefiderocol; tigecycline/eravacycline (non-BSI, non-UTI only)", notes: "The '>' indicates slight preference based on clinical outcomes and resistance emergence data, not a strict hierarchy. All three are >95% active and any is acceptable. Resistance emergence: caz-avi resistance most reported (KPC omega loop mutations like D179Y). Mer-vab and imi-rele appear more stable. If caz-avi resistance emerges, switch to mer-vab or imi-rele (cross-resistance is not automatic)." },
          { organism: "KPC-producing E. coli (less common)", preferred: "Same as KPC-KP: meropenem-vaborbactam, ceftazidime-avibactam, imipenem-relebactam", notes: "KPC in E. coli is less common than in K. pneumoniae but treatment approach is identical. Check susceptibility — E. coli may retain TMP-SMX or FQ susceptibility more often than K. pneumoniae." },
        ],
        pearls: [
          "KNOW YOUR CARBAPENEMASE: The single most important piece of information for CRE treatment is WHICH carbapenemase is present. KPC → mer-vab, caz-avi, or imi-rele. NDM/MBL → caz-avi + aztreonam or cefiderocol. OXA-48-like → caz-avi. The treatment is completely different depending on the mechanism. Push your lab to perform molecular or antigen-based carbapenemase identification.",
          "Meropenem-vaborbactam is slightly favored for KPC: Based on TANGO II trial data (strongest clinical trial), observational studies showing slightly higher cure rates and lower resistance emergence vs caz-avi, and potent boronic acid inhibition of KPC. However, all three preferred agents are >95% active and acceptable. Don't delay therapy waiting for a specific agent — use what's on your formulary.",
          "Caz-avi resistance is the BIGGEST concern: KPC mutations (particularly omega loop mutations like D179Y) can render caz-avi ineffective while potentially RESTORING meropenem activity. This has created the phenomenon of 'caz-avi resistant, meropenem restored' CRE. If caz-avi resistance emerges during therapy: (1) check meropenem MIC (may be restored), (2) switch to mer-vab or imi-rele. This pattern is well-described in the literature.",
          "DO NOT use polymyxin-based regimens for CRE if BL-BLIs are available: The era of polymyxin-based CRE treatment is OVER. Every comparative study (TANGO II, RESTORE-IMI 1, observational) shows BL-BLIs are superior with dramatically lower toxicity. Using colistin/polymyxin B for CRE when caz-avi/mer-vab/imi-rele are available is substandard care.",
          "Extended-infusion meropenem monotherapy for CRE is NO LONGER recommended: Previously, some used high-dose extended-infusion meropenem for CRE with MICs of 8-16. This is obsolete — novel BL-BLIs are superior. Do not attempt to 'push through' carbapenem resistance with high-dose meropenem. Use the right drug for the resistance mechanism.",
        ],
      },
      {
        id: "cre-mbl",
        name: "CRE — Metallo-β-Lactamase Producers (NDM, VIM, IMP)",
        definition: "Metallo-β-lactamases (MBLs) — including NDM, VIM, and IMP — are zinc-dependent carbapenemases that hydrolyze ALL beta-lactams EXCEPT aztreonam. Critically, MBLs are NOT inhibited by avibactam, vaborbactam, or relebactam — meaning caz-avi, mer-vab, and imi-rele used ALONE are ineffective. Treatment requires either: (1) ceftazidime-avibactam PLUS aztreonam (avibactam protects aztreonam from co-produced serine beta-lactamases; aztreonam is intrinsically stable to MBLs), or (2) cefiderocol (siderophore cephalosporin, stable to MBL hydrolysis). MBL prevalence in US CRE is RISING: from 4% to 20% between 2019-2021. NDM is the dominant MBL in the US.",
        clinicalPresentation: "Same as other CRE — BSI, UTI, IAI, pneumonia. MBL-producing CRE are often MORE resistant than KPC-CRE because MBL genes are frequently co-located on plasmids carrying additional resistance determinants (aminoglycoside-modifying enzymes, FQ resistance, etc.). The treatment options are severely limited. These are among the hardest-to-treat infections in medicine. ID consultation is mandatory.",
        diagnostics: "Carbapenemase-specific testing is ESSENTIAL. Phenotypic: EDTA-based tests (EDTA inhibits MBLs by chelating zinc). Molecular: PCR for blaNDM, blaVIM, blaIMP genes. CLSI has endorsed broth disk elution (BDE) method for testing ceftazidime-avibactam/aztreonam combination susceptibility against MBL-producers. Knowing 'MBL' vs 'KPC' vs 'OXA-48' completely changes the treatment algorithm.",
        empiricTherapy: [
          {
            line: "Preferred — MBL-Producing CRE (Non-Urinary Infections)",
            options: [
              { drug: "caz-avi-aztreonam", regimen: "Ceftazidime-avibactam 2.5g IV q8h + Aztreonam 2g IV q8h (simultaneous administration)", notes: "IDSA 2024 preferred for MBL-CRE. Rationale: aztreonam is intrinsically stable to MBL hydrolysis, but MBL-producers usually co-produce ESBLs/AmpC that would hydrolyze aztreonam. Avibactam inhibits those co-produced serine beta-lactamases, allowing aztreonam to work. ~90% activity against MBL-producing Enterobacterales. Observational data: 19% mortality vs 44% for other regimens. Administer q8h simultaneously. Monitor LFTs (elevated in ~40% in phase 1 study)." },
              { drug: "cefiderocol", regimen: "Cefiderocol 2g IV q8h (infused over 3h)", notes: "IDSA 2024 preferred for MBL-CRE. Siderophore cephalosporin — enters bacteria via iron transporters, bypassing porin-dependent entry. Stable against MBL hydrolysis. ~92% activity against MBL-producing Enterobacterales. Limited clinical trial data specifically for MBL-CRE but clinical trial showed 80% cure vs 0% for BAT in MBL-E infections. Monitor for resistance emergence — described with and without prior cefiderocol exposure." },
            ],
          },
          {
            line: "Alternative — MBL-CRE",
            options: [
              { drug: "aztreonam-mervab", regimen: "Aztreonam 2g IV q8h + meropenem-vaborbactam or imipenem-relebactam", notes: "If caz-avi + aztreonam or cefiderocol not possible (allergy, intolerance). Limited clinical data. Rationale: vaborbactam/relebactam inhibit co-produced serine beta-lactamases, allowing aztreonam to function. NOT effective if OXA-type carbapenemases are also present." },
              { drug: "tigecycline-mbl", regimen: "Tigecycline 100mg IV load then 50mg IV q12h (or eravacycline 1mg/kg IV q12h)", notes: "Alternative for non-BSI, non-UTI MBL-CRE infections (IAI, SSTI, pneumonia). Activity is independent of carbapenemase type. NOT for BSI (low serum concentrations) or UTI (minimal urinary excretion). Nausea/vomiting common. FDA boxed warning for increased mortality." },
            ],
          },
        ],
        organismSpecific: [
          { organism: "NDM-producing Enterobacterales", preferred: "Caz-avi + aztreonam, or cefiderocol", alternative: "Aztreonam + mer-vab or imi-rele; tigecycline/eravacycline (non-BSI/UTI)", notes: "NDM is the most common MBL in US. Rising prevalence is a major concern. Often carried on highly transmissible plasmids with additional resistance genes. Co-resistance to aminoglycosides, FQs, TMP-SMX is common. Extremely limited treatment options — ID consultation mandatory." },
          { organism: "VIM/IMP-producing Enterobacterales", preferred: "Same as NDM: caz-avi + aztreonam, or cefiderocol", notes: "VIM and IMP are less common MBLs in the US but treatment approach is identical to NDM. Ceftolozane-tazobactam has NO activity against MBL-producers — never use. Pip-tazo, cefepime, carbapenems alone — all ineffective against MBLs." },
        ],
        pearls: [
          "Caz-avi ALONE does NOT work for MBL-CRE: Avibactam does NOT inhibit MBLs (zinc-dependent enzymes are structurally different from serine beta-lactamases). Ceftazidime alone would be hydrolyzed by the MBL. The caz-avi is there to provide avibactam to protect the AZTREONAM from co-produced serine enzymes. Without aztreonam, caz-avi is useless for MBL-CRE. This is a common and dangerous misconception.",
          "MBL prevalence in the US is RISING FAST: CDC data show MBL genes increased from 4% to 20% of carbapenemase-producing CRE between 2019-2021. This has treatment implications: if your institution uses caz-avi as first-line for all CRE, you WILL miss MBL-producers. Know your local epidemiology and always obtain carbapenemase-specific testing.",
          "Aztreonam-avibactam (Emblaveo) is in development: This fixed combination is the ideal agent for MBL-CRE. Until it's available, we use the workaround of caz-avi + aztreonam. The ceftazidime component is essentially along for the ride — it's the avibactam we need. Administer both drugs q8h simultaneously to ensure avibactam levels are adequate when aztreonam is present.",
          "Cefiderocol is an option but monitor for resistance: ~92% activity against MBL-CRE, but resistance emergence has been described both during therapy and de novo. For critical infections, some experts advocate combination therapy (cefiderocol + another active agent) until the clinical field has more experience with cefiderocol monotherapy for MBL-CRE.",
          "These infections REQUIRE ID consultation: MBL-CRE are among the most dangerous infections a hospitalized patient can develop. The treatment algorithm is complex (carbapenemase identification → agent selection → dosing optimization → monitoring for resistance). Non-ID clinicians should not manage these independently.",
        ],
      },
      {
        id: "dtr-pa",
        name: "DTR Pseudomonas aeruginosa",
        definition: "Difficult-to-treat resistant (DTR) P. aeruginosa is defined as non-susceptible to ALL of the following: piperacillin-tazobactam, ceftazidime, cefepime, aztreonam, meropenem, imipenem, ciprofloxacin, and levofloxacin. This is the most restrictive definition of resistant Pseudomonas — only novel BL-BLIs and cefiderocol remain active. IDSA 2024 preferred agents: ceftolozane-tazobactam, ceftazidime-avibactam, imipenem-cilastatin-relebactam, or cefiderocol. Important: if the isolate IS susceptible to a traditional agent (e.g., cefepime), use that agent as HIGH-DOSE EXTENDED INFUSION first.",
        clinicalPresentation: "DTR-PA typically occurs in patients with significant healthcare exposure: prolonged ICU stays, chronic ventilator dependence, cystic fibrosis, bronchiectasis, recurrent hospital admissions with multiple antibiotic courses. Common sites: ventilator-associated pneumonia (most common serious DTR-PA infection), bloodstream infections, complicated UTI, wound infections, osteomyelitis. Pseudomonal infections are characterized by biofilm formation, making eradication difficult.",
        diagnostics: "Standard AST identifies susceptibility pattern. DTR is defined by NON-susceptibility to ALL traditional anti-pseudomonal agents. If the isolate retains susceptibility to ANY traditional agent (cefepime, meropenem, pip-tazo, etc.), administer that agent as high-dose extended infusion rather than jumping to novel BL-BLIs. Susceptibility to ceftolozane-tazobactam, ceftazidime-avibactam, imipenem-relebactam, and cefiderocol should be tested when DTR phenotype is identified.",
        empiricTherapy: [
          {
            line: "FIRST: If Susceptible to ANY Traditional Agent — Use It",
            options: [
              { drug: "cefepime-dtr-traditional", regimen: "Cefepime 2g IV q8h (extended infusion over 3h) — or whichever traditional agent retains activity", notes: "IDSA 2024: If isolate is NOT susceptible to carbapenems but IS susceptible to cefepime (or vice versa), use the susceptible traditional agent as high-dose extended infusion. This is NOT truly DTR — it's resistant to some but not all standard agents. Reserve novel BL-BLIs for TRUE DTR (resistant to ALL traditional agents)." },
            ],
          },
          {
            line: "Preferred — True DTR P. aeruginosa (Non-Urinary Infections)",
            options: [
              { drug: "ceftolozane-tazobactam-dtr", regimen: "Ceftolozane-tazobactam 3g IV q8h (infused over 3h) — use HAP/VAP dose for all serious infections", notes: "IDSA 2024 preferred for DTR-PA. Ceftolozane has intrinsic anti-pseudomonal potency greater than ceftazidime. 3g dose (2g ceftolozane + 1g tazobactam) is the HAP/VAP dose — many experts use this dose for all serious DTR-PA infections. Activity is independent of MBL/KPC status — relies on ceftolozane's stability to Pseudomonal AmpC and efflux resistance." },
              { drug: "ceftazidime-avibactam-dtr", regimen: "Ceftazidime-avibactam 2.5g IV q8h (infused over 2h)", notes: "IDSA 2024 preferred. Avibactam inhibits Pseudomonal AmpC and some OXA enzymes. Activity varies by regional resistance mechanisms — some areas show lower DTR-PA susceptibility to caz-avi than to ceftolozane-tazobactam." },
              { drug: "imipenem-relebactam-dtr", regimen: "Imipenem-cilastatin-relebactam 1.25g IV q6h (infused over 30 min)", notes: "IDSA 2024 preferred. Relebactam restores imipenem activity against Pseudomonas with AmpC/OXA-mediated resistance. RESTORE-IMI 1 trial supports efficacy. Less data specifically for DTR-PA compared to ceftolozane-tazobactam." },
              { drug: "cefiderocol-dtr", regimen: "Cefiderocol 2g IV q8h (infused over 3h)", notes: "IDSA 2024 preferred. Siderophore mechanism bypasses porin loss and efflux — two major Pseudomonal resistance mechanisms. Broadest activity against DTR-PA of any single agent. Some experts prefer to use combination therapy initially, transitioning to monotherapy if clinical improvement occurs." },
            ],
          },
          {
            line: "Preferred — DTR P. aeruginosa UTI",
            options: [
              { drug: "ceftolozane-taz-uti", regimen: "Ceftolozane-tazobactam 1.5g IV q8h (UTI dose)", notes: "Standard UTI/cUTI dose (lower than HAP/VAP dose). Any of the four preferred novel agents can be used for DTR-PA UTI. Once-daily tobramycin or amikacin are IDSA 2024 alternatives for DTR-PA UTI (prolonged renal cortex activity, convenient dosing)." },
            ],
          },
        ],
        organismSpecific: [
          { organism: "DTR P. aeruginosa (all mechanisms)", preferred: "Ceftolozane-tazobactam, ceftazidime-avibactam, imipenem-relebactam, cefiderocol", alternative: "Aminoglycosides (UTI only); combination therapy for life-threatening infections", notes: "If an MBL (VIM, IMP) is identified in DTR-PA: ceftolozane-tazobactam and caz-avi are likely INEFFECTIVE. Use cefiderocol or caz-avi + aztreonam. MBL-producing Pseudomonas is rare but check. Nebulized antibiotics NOT recommended for respiratory DTR-PA infections (IDSA 2024)." },
        ],
        pearls: [
          "NOT ALL 'RESISTANT PSEUDOMONAS' IS DTR: DTR requires non-susceptibility to ALL traditional anti-pseudomonal agents. If the isolate is meropenem-resistant but cefepime-susceptible, use high-dose extended infusion cefepime — this is NOT DTR and does not need a novel BL-BLI. Correctly identifying DTR vs selective resistance preserves novel agents for when they're truly needed.",
          "Ceftolozane-tazobactam dose matters: UTI = 1.5g q8h. Serious non-UTI infections = 3g q8h (the HAP/VAP dose). Many experts now use the 3g dose for ALL serious DTR-PA infections regardless of site. Underdosing ceftolozane-tazobactam for DTR-PA is a common error.",
          "Regional DTR-PA susceptibility patterns vary: In some US regions, ceftolozane-tazobactam retains higher activity against DTR-PA than caz-avi. In others, the reverse is true. This is driven by local resistance mechanisms (AmpC mutations vs MBL vs efflux vs porin loss). Know your institutional antibiogram for novel agents.",
          "Nebulized antibiotics for DTR-PA pneumonia: IDSA 2024 does NOT recommend nebulized antibiotics (tobramycin, colistin) for DTR-PA respiratory infections. Evidence does not support improved outcomes, and nebulized delivery is associated with bronchospasm, variable drug delivery, and selection for further resistance.",
          "MBL-producing P. aeruginosa is the hardest scenario: If DTR-PA produces VIM or IMP, both ceftolozane-tazobactam and caz-avi are inactive. Cefiderocol becomes the primary option. This is rare in the US but increasing globally. Always check for MBL if DTR-PA is identified.",
        ],
      },
      {
        id: "crab-steno",
        name: "CRAB & Stenotrophomonas maltophilia",
        definition: "CRAB (carbapenem-resistant Acinetobacter baumannii) carries the highest mortality of any gram-negative AMR phenotype (40-60% crude mortality). IDSA 2024: sulbactam-durlobactam (+ carbapenem backbone) is now the PREFERRED agent. S. maltophilia is an intrinsically resistant, opportunistic glucose non-fermenter found in ICU patients, immunocompromised hosts, and CF patients. Intrinsically resistant to carbapenems, aminoglycosides, and most beta-lactams. Preferred agents: cefiderocol (+ second agent initially), caz-avi + aztreonam, minocycline, TMP-SMX, or levofloxacin (each with a second agent).",
        clinicalPresentation: "CRAB: predominantly healthcare-associated — ventilator-associated pneumonia (most common), bloodstream infections, wound infections, meningitis (post-neurosurgical). Environmental reservoir (survives on surfaces for weeks). Outbreaks in ICUs. Mortality: 40-60% for BSI. S. maltophilia: hospital-acquired pneumonia (especially ventilated patients), bloodstream infections (often catheter-related), immunocompromised hosts (hematologic malignancy, transplant). KEY for both: distinguish colonization from true infection. Unnecessary treatment drives further resistance.",
        diagnostics: "CRAB: AST shows resistance to carbapenems + most other agents. Most CRAB produce OXA-type carbapenemases (OXA-23, OXA-24/40, OXA-58). Sulbactam-durlobactam susceptibility testing should be performed. S. maltophilia: intrinsically resistant to carbapenems (L1 metallo-beta-lactamase) and aminoglycosides. CLSI 2024: ceftazidime breakpoints REMOVED for S. maltophilia (do not test). TMP-SMX, minocycline, levofloxacin, and cefiderocol susceptibility should be tested. BDE method available for caz-avi/aztreonam combination testing.",
        empiricTherapy: [
          {
            line: "Preferred — CRAB Infections",
            options: [
              { drug: "sulbactam-durlobactam", regimen: "Sulbactam-durlobactam 1g/0.5g IV q6h + Imipenem-cilastatin 500mg IV q6h (or Meropenem 2g IV q8h)", notes: "IDSA 2024 preferred for CRAB. ATTACK trial: 28-day mortality 19% vs 32% with colistin. Durlobactam is a diazabicyclooctane BLI that inhibits Acinetobacter OXA carbapenemases + Class A/C enzymes. Sulbactam provides the intrinsic anti-Acinetobacter killing. Carbapenem backbone adds additional activity and covers potential co-pathogens. Brand name: Xacduro." },
            ],
          },
          {
            line: "Alternative — CRAB (If Sulbactam-Durlobactam Unavailable)",
            options: [
              { drug: "high-dose-amp-sulb-crab", regimen: "High-dose ampicillin-sulbactam 9g IV q8h (= 27g/day total: 18g ampicillin + 9g sulbactam) + at least 1 additional agent", notes: "IDSA 2024 alternative (downgraded from preferred in 2023 update). Sulbactam component provides intrinsic Acinetobacter activity. Must be combined with at least one other agent: polymyxin B, minocycline (preferred over tigecycline), or cefiderocol. The 27g/day dosing (9g sulbactam) maximizes the sulbactam PK/PD target." },
              { drug: "polymyxin-b-crab", regimen: "Polymyxin B 2.5-3 mg/kg/day IV divided q12h (NOT colistimethate for systemic CRAB)", notes: "Component of CRAB combination therapy. Polymyxin B preferred over colistimethate (colistin) for systemic infections: more predictable PK, does not require conversion from prodrug, less nephrotoxic. Colistimethate has a role in urinary tract infections (converts to active colistin in urine) and nebulized therapy. Never use polymyxin monotherapy for CRAB — always combine." },
            ],
          },
          {
            line: "Preferred — S. maltophilia Infections (in order of preference)",
            options: [
              { drug: "cefiderocol-steno", regimen: "Cefiderocol 2g IV q8h (with a second agent at least initially)", notes: "IDSA 2024 preferred (listed first). Stable against S. maltophilia's intrinsic L1 MBL and L2 serine BL. Siderophore entry bypasses efflux/porin resistance. Add a second agent initially (minocycline, TMP-SMX, or levofloxacin) until clinical improvement, then consider cefiderocol monotherapy." },
              { drug: "caz-avi-aztreonam-steno", regimen: "Ceftazidime-avibactam 2.5g IV q8h + Aztreonam 2g IV q8h", notes: "IDSA 2024 preferred (listed second). Same rationale as for MBL-CRE: aztreonam stable to L1 MBL, avibactam inhibits L2 serine BL. BDE testing endorsed by CLSI for this combination against S. maltophilia." },
              { drug: "tmp-smx-steno", regimen: "TMP-SMX 15 mg/kg/day IV divided q6-8h (with a second agent)", notes: "IDSA 2024 preferred (with second agent). Historically the first-line agent for S. maltophilia. Still effective but rising resistance (10-20% in some centers). IV dosing uses the TMP component for calculation. Combine with minocycline, levofloxacin, or cefiderocol." },
              { drug: "minocycline-steno", regimen: "Minocycline 200mg IV/PO q12h (with a second agent)", notes: "IDSA 2024 preferred (with second agent). Minocycline is preferred over tigecycline for S. maltophilia (better activity, fewer GI side effects). Good oral bioavailability for step-down. 70-80% S. maltophilia susceptibility in most centers." },
            ],
          },
        ],
        organismSpecific: [
          { organism: "CRAB (OXA-producing A. baumannii)", preferred: "Sulbactam-durlobactam + carbapenem", alternative: "High-dose amp-sulb (27g/day) + polymyxin B or minocycline or cefiderocol", notes: "CRAB treatment ALWAYS requires combination therapy. Monotherapy failure rates are unacceptable. Sulbactam-durlobactam changed the landscape (ATTACK trial) — if available, it is clearly preferred. If not, high-dose amp-sulb-based combination is the alternative. Tigecycline was removed from IDSA 2024 guidance for CRAB (minocycline preferred). Distinguish colonization from infection — many CRAB-positive cultures represent colonization." },
          { organism: "S. maltophilia", preferred: "Cefiderocol (+2nd agent), caz-avi + aztreonam, TMP-SMX (+2nd agent), minocycline (+2nd agent), levofloxacin (+2nd agent)", alternative: "Combinations of the above", notes: "S. maltophilia is intrinsically resistant to carbapenems (L1 MBL), aminoglycosides, and most beta-lactams. Ceftazidime breakpoints REMOVED by CLSI 2024 — do not test or use. TMP-SMX was historically first-line but resistance is increasing. Combination therapy preferred for serious infections. Colonization vs infection distinction is critical — S. maltophilia in respiratory cultures often represents colonization in ventilated patients." },
        ],
        pearls: [
          "SULBACTAM-DURLOBACTAM CHANGED CRAB TREATMENT: The ATTACK trial showed 28-day mortality of 19% (sulbactam-durlobactam) vs 32% (colistin-based). This is the first agent to demonstrate superiority over polymyxin-based therapy for CRAB. If your formulary carries it, sulbactam-durlobactam + carbapenem is now first-line. High-dose amp-sulb was downgraded to alternative in the 2024 update.",
          "CRAB = COMBINATION THERAPY ALWAYS: No single agent is adequate for CRAB. Even sulbactam-durlobactam is given with a carbapenem backbone. High-dose amp-sulb is given with at least one additional agent. Polymyxin monotherapy for CRAB is associated with unacceptable failure rates. Every CRAB regimen should have at least 2 active components.",
          "S. maltophilia: ceftazidime is DEAD for this organism. CLSI 2024 removed ceftazidime breakpoints for S. maltophilia. The intrinsic L2 serine beta-lactamase and inducible L1 metallo-beta-lactamase make ceftazidime unreliable. If your lab still reports ceftazidime for S. maltophilia, flag this as outdated.",
          "Colonization vs infection is CRITICAL for CRAB and S. maltophilia: Both organisms are frequently cultured from respiratory specimens (sputum, BAL) in ICU patients without causing true infection. Treating colonization drives further resistance, exposes patients to drug toxicity, and wastes resources. Evaluate: are there clinical signs of infection (new fever, worsening WBC/oxygenation, new infiltrates)? Is there an alternative explanation? ID consultation is strongly recommended before starting CRAB or S. maltophilia-directed therapy.",
          "Minocycline > tigecycline for CRAB and S. maltophilia: IDSA 2024 favors minocycline over tigecycline. Minocycline has better in vitro activity against both organisms, better GI tolerability, and oral bioavailability for step-down. Tigecycline was REMOVED from S. maltophilia combination therapy recommendations in the 2024 update.",
        ],
      },
    ],
    drugMonographs: [
      {
        id: "ceftazidime-avibactam",
        name: "Ceftazidime-Avibactam",
        brandNames: "Avycaz",
        drugClass: "Cephalosporin + diazabicyclooctane β-lactamase inhibitor",
        mechanismOfAction: "Ceftazidime: binds PBP3, inhibiting cell wall synthesis (bactericidal, time-dependent). Avibactam: non-β-lactam β-lactamase inhibitor (diazabicyclooctane) that covalently and REVERSIBLY binds serine β-lactamases. Inhibits Class A (KPC, CTX-M, SHV, TEM), Class C (AmpC), and some Class D (OXA-48-like) enzymes. Does NOT inhibit Class B metallo-β-lactamases (NDM, VIM, IMP) — this is the critical gap. The reversible binding of avibactam means it can dissociate and inhibit another enzyme molecule, providing efficient inhibition even at lower concentrations than irreversible inhibitors.",
        spectrum: "With avibactam: Enterobacterales (including KPC-producing CRE, ESBL-E, AmpC-E, OXA-48-like producers), P. aeruginosa (including many DTR strains). When combined with aztreonam: MBL-producing Enterobacterales, S. maltophilia. GAPS: MBL-producers (when used ALONE — requires aztreonam addition), CRAB (minimal activity), anaerobes, gram-positives.",
        dosing: {
          standard: "2.5g (ceftazidime 2g + avibactam 0.5g) IV q8h, infused over 2h",
          with_aztreonam: "2.5g IV q8h + Aztreonam 2g IV q8h (administer simultaneously for MBL-CRE)",
          uti: "2.5g IV q8h (same dose for all indications)",
        },
        renalAdjustment: "CrCl 31-50: 1.25g IV q8h. CrCl 16-30: 0.94g IV q12h. CrCl 6-15: 0.94g IV q24h. CrCl <=5: 0.94g IV q48h. Hemodialysis: 0.94g IV q48h (administer after HD on dialysis days). ALL components are renally cleared — dose reduction is critical.",
        hepaticAdjustment: "No adjustment needed — renally eliminated.",
        adverseEffects: {
          common: "Diarrhea (8-12%), nausea (5-8%), vomiting, headache, constipation",
          serious: "C. difficile colitis, hypersensitivity (cross-reactive with cephalosporin allergy), neurotoxicity (seizures — ceftazidime component, especially in renal impairment), elevated LFTs (particularly with aztreonam combination — ~40% in phase 1 study)",
          rare: "Anaphylaxis, hemolytic anemia, encephalopathy",
        },
        drugInteractions: [
          "Probenecid — decreases renal clearance of ceftazidime. Not typically clinically relevant at standard doses.",
          "Valproic acid — as with all cephalosporins, potential for reduced VPA levels, though the interaction is most significant with carbapenems. Monitor VPA levels.",
          "Chloramphenicol — may antagonize cephalosporin bactericidal activity (bacteriostatic agent). Avoid combination.",
        ],
        monitoring: "Renal function (dose adjustment critical). LFTs (especially when combined with aztreonam). Seizure monitoring (particularly in renal impairment or CNS disease). Clinical response. Repeat cultures to assess microbiological clearance, especially for CRE BSI. Monitor for resistance emergence — KPC omega loop mutations (D179Y) can cause caz-avi failure.",
        pregnancyLactation: "Category B. Limited human data. Animal studies showed no harm at therapeutic doses. Use only if clearly needed. Unknown if excreted in breast milk.",
        pharmacistPearls: [
          "THE MOST VERSATILE NOVEL BL-BLI: Caz-avi is effective against KPC-CRE, ESBL-E, AmpC-E, OXA-48-CRE, DTR-PA, and (with aztreonam) MBL-CRE and S. maltophilia. No other single agent covers this breadth. However, this versatility means it should be used JUDICIOUSLY — resistance emergence is the biggest concern.",
          "Caz-avi + aztreonam for MBL-CRE: The avibactam is the hero here, not the ceftazidime. Avibactam protects aztreonam from serine beta-lactamases co-produced by MBL organisms. Aztreonam is intrinsically stable to MBLs. Administer simultaneously q8h. Monitor LFTs closely.",
          "RESISTANCE EMERGENCE IS THE ACHILLES HEEL: KPC mutations (omega loop — D179Y, T243M, D179Y/T243M) can abolish avibactam binding, causing caz-avi resistance. Paradoxically, these mutations may RESTORE meropenem activity. If caz-avi fails: (1) check meropenem MIC, (2) switch to mer-vab or imi-rele. This 'resistance seesaw' is well-described.",
          "Renal dosing matters enormously: Caz-avi is entirely renally eliminated. Incorrect dose adjustment in renal impairment leads to subtherapeutic levels and treatment failure OR accumulation and toxicity. Use actual measured CrCl, not estimated, for dosing decisions in critically ill patients.",
          "For DTR-PA: regional susceptibility varies. In some areas, ceftolozane-tazobactam has better DTR-PA activity than caz-avi. In others, the reverse is true. Know your institutional antibiogram for novel agents. Don't assume one is universally better than the other for Pseudomonas.",
        ],
      },
      {
        id: "meropenem-vaborbactam",
        name: "Meropenem-Vaborbactam",
        brandNames: "Vabomere",
        drugClass: "Carbapenem + cyclic boronic acid β-lactamase inhibitor",
        mechanismOfAction: "Meropenem: binds PBPs (primarily PBP-2), inhibiting cell wall synthesis. Bactericidal, time-dependent. Vaborbactam: cyclic boronic acid β-lactamase inhibitor. Forms reversible covalent bonds with serine β-lactamases. Potently inhibits Class A β-lactamases (KPC — its primary target, ESBLs, SHV, TEM). Does NOT inhibit Class B (MBLs), Class D (OXA-48-like) — key gaps. The boronic acid scaffold provides high binding affinity for KPC specifically, resulting in lower resistance emergence risk compared to avibactam.",
        spectrum: "KPC-producing CRE (primary indication — >95% activity), ESBL-E, AmpC-E, plus standard meropenem spectrum (Enterobacterales, P. aeruginosa, anaerobes, Streptococci). GAPS: MBL-producing CRE (NDM, VIM, IMP), OXA-48-like CRE (vaborbactam does not inhibit OXA-48), CRAB, S. maltophilia. For non-KPC CRE, the meropenem component alone may contribute activity if MIC is restored by vaborbactam.",
        dosing: {
          standard: "4g (meropenem 2g + vaborbactam 2g) IV q8h, infused over 3h",
          all_indications: "Same dose for all indications (UTI, BSI, IAI, pneumonia)",
        },
        renalAdjustment: "CrCl 30-49: 2g IV q8h. CrCl 15-29: 2g IV q12h. CrCl <15: 1g IV q12h. Hemodialysis: 1g IV q12h (administer after HD). CRRT: limited data, 2g IV q8h commonly used. Extended infusion over 3h maintained for all dose adjustments.",
        hepaticAdjustment: "No adjustment needed — renally eliminated.",
        adverseEffects: {
          common: "Headache (9%), diarrhea (5%), nausea, phlebitis/infusion site reactions",
          serious: "C. difficile colitis, seizures (meropenem component — risk increases in renal impairment and CNS disease), hypersensitivity (carbapenem cross-reactivity), thrombocytopenia",
          rare: "Anaphylaxis, encephalopathy, hepatitis",
        },
        drugInteractions: [
          "Valproic acid — CRITICAL: ALL carbapenems (including meropenem-vaborbactam) reduce VPA levels by 60-100% within 24h. Switch VPA to levetiracetam BEFORE starting. This interaction is pharmacologically inevitable.",
          "Probenecid — competes for renal tubular secretion, increasing meropenem levels. Generally not clinically significant.",
        ],
        monitoring: "Renal function (for dose adjustment). Seizure monitoring (meropenem component). Clinical response. Repeat cultures for CRE BSI to document clearance. CBC (thrombocytopenia risk with prolonged courses). Hepatic function (baseline and periodic).",
        pregnancyLactation: "Limited data. Meropenem is Category B. Vaborbactam has limited human pregnancy data. Use only if clearly needed.",
        pharmacistPearls: [
          "SLIGHTLY FAVORED FOR KPC-CRE by IDSA 2024: Based on TANGO II trial (strongest clinical trial data for any BL-BLI vs CRE), observational studies showing higher cure rates and lower resistance emergence vs caz-avi, and potent KPC-specific inhibition. The preference is slight — all three preferred agents are acceptable.",
          "LOWEST RESISTANCE EMERGENCE of the three preferred KPC agents: Boronic acid scaffold provides high-affinity KPC binding. KPC mutations that escape vaborbactam are less common than those escaping avibactam. Observational data: 0% resistance emergence with mer-vab vs 20% with caz-avi in one comparative study. This matters for prolonged courses.",
          "The VPA interaction applies: Same as meropenem — switch valproate to levetiracetam before starting mer-vab. This is non-negotiable. The vaborbactam component does not change this interaction.",
          "Extended infusion is standard: 3-hour infusion is built into the product labeling. This optimizes meropenem T>MIC, which is critical for CRE with elevated MICs. Do not administer as standard 30-minute infusion.",
          "Does NOT cover MBL-CRE or OXA-48-CRE: Vaborbactam is KPC-specific in clinical impact. If the carbapenemase is NDM → need caz-avi + aztreonam or cefiderocol. If OXA-48-like → need caz-avi (avibactam inhibits OXA-48). Know the carbapenemase before selecting the agent.",
        ],
      },
      {
        id: "cefiderocol",
        name: "Cefiderocol",
        brandNames: "Fetroja",
        drugClass: "Siderophore cephalosporin (first-in-class)",
        mechanismOfAction: "Unique dual mechanism: (1) Siderophore component chelates iron and hijacks bacterial iron transport systems (TonB-dependent transporters) to actively transport the drug into the periplasm. This bypasses porin channels — the major route of entry for other beta-lactams — overcoming porin loss resistance. (2) Once inside, the cephalosporin moiety binds PBP-3, inhibiting cell wall synthesis. Bactericidal, time-dependent. The siderophore-mediated entry achieves periplasmic concentrations 3-5× higher than passive diffusion would achieve, overcoming many resistance mechanisms simultaneously.",
        spectrum: "THE BROADEST-SPECTRUM SINGLE AGENT FOR GRAM-NEGATIVE AMR: KPC-CRE (>95%), MBL-CRE including NDM (>90%), OXA-48-like CRE, DTR P. aeruginosa, CRAB, S. maltophilia, Burkholderia cepacia. Stable against ALL four Ambler classes (A, B, C, D). GAPS: gram-positives, anaerobes. CAUTION: CREDIBLE-CR trial showed numerically higher mortality in CRAB subgroup vs BAT — use combination therapy for CRAB.",
        dosing: {
          standard: "2g IV q8h, infused over 3h",
          all_serious: "Same dose for all serious infections",
          uti: "2g IV q8h (same dose)",
        },
        renalAdjustment: "CrCl 30-59: 1.5g IV q8h. CrCl 15-29: 1g IV q8h. CrCl <15: 0.75g IV q12h. Hemodialysis: 0.75g IV q12h (dose after HD). UNIQUE — augmented renal clearance (ARC): CrCl >120: increase to 2g IV q6h. Cefiderocol clearance increases linearly with CrCl — patients with ARC (common in burns, sepsis, young patients) require HIGHER doses.",
        hepaticAdjustment: "No adjustment needed — renally eliminated.",
        adverseEffects: {
          common: "Diarrhea (10%), nausea, constipation, rash, elevated LFTs",
          serious: "C. difficile colitis, hypersensitivity, seizures (rare, cephalosporin class), iron-related effects (theoretical — siderophore mechanism, but clinically insignificant iron chelation at therapeutic doses)",
          rare: "Anaphylaxis, CREDIBLE-CR mortality signal in CRAB (may be related to trial design/severity, not drug-specific — but led to caution for CRAB monotherapy)",
        },
        drugInteractions: [
          "Minimal clinically significant drug interactions identified. Cefiderocol is primarily renally eliminated and not a significant CYP enzyme inducer/inhibitor.",
          "Iron supplements — theoretical concern that exogenous iron could compete with siderophore-mediated uptake. Clinical significance uncertain but some experts avoid IV iron during cefiderocol therapy.",
        ],
        monitoring: "Renal function (critical — both for dose reduction AND for identifying augmented renal clearance requiring dose increase). Clinical response. Repeat cultures to document microbiological clearance. CBC. Hepatic function (LFT elevations reported). Monitor for resistance emergence — described with and without prior exposure.",
        pregnancyLactation: "Limited human data. Animal studies showed skeletal variations at high doses. Use only if clearly needed.",
        pharmacistPearls: [
          "THE BROADEST SINGLE AGENT IN THE AMR TOOLKIT: Cefiderocol is active against ALL major AMR gram-negative phenotypes — KPC-CRE, MBL-CRE, OXA-48-CRE, DTR-PA, CRAB, S. maltophilia. No other single agent covers all six. This makes it invaluable when carbapenemase type is unknown or for empiric coverage of MDR gram-negatives. However, breadth means it must be preserved — don't use for ESBL-E or routine CRE when narrower BL-BLIs suffice.",
          "AUGMENTED RENAL CLEARANCE (ARC) DOSE INCREASE: Cefiderocol is one of few drugs with UPWARD dose adjustment for ARC (CrCl >120). Young patients, burns, early sepsis, and pregnant women commonly have ARC. Standard dosing in ARC → subtherapeutic levels → treatment failure. Measure CrCl; if >120, increase to 2g q6h. This is a pharmacist-driven intervention.",
          "CRAB CAUTION: CREDIBLE-CR trial showed numerically higher all-cause mortality with cefiderocol vs BAT in the CRAB subgroup (49% vs 18%). This may reflect imbalanced severity or trial limitations, but it led to the recommendation for COMBINATION therapy when using cefiderocol for CRAB. Cefiderocol monotherapy for CRAB is NOT recommended.",
          "Siderophore mechanism is elegant but not invulnerable: Bacteria can develop resistance by: (1) mutating TonB-dependent transporters, (2) modifying siderophore receptors, (3) producing MBLs that can partially hydrolyze cefiderocol (NDM-5 variants). Resistance has been reported during therapy. For serious infections, combination therapy at least initially may reduce resistance emergence risk.",
          "3-hour infusion is non-negotiable: Time-dependent killing means T>MIC drives efficacy. The 3h infusion maximizes the percentage of the dosing interval above the MIC. Shorter infusions reduce efficacy. Extended infusion programs should be established for cefiderocol just as for meropenem and pip-tazo.",
        ],
      },
    ],
};