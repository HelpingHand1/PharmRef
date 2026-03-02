import { useState, useMemo, useCallback } from "react";

// ============================================================
// DATA STRUCTURE - Add new disease states here
// ============================================================
const DISEASE_STATES = [
  {
    id: "uti",
    name: "Urinary Tract Infections",
    icon: "🔬",
    category: "Infectious Disease",
    overview: {
      definition: "Infections of the urinary tract encompassing the bladder (cystitis), kidneys (pyelonephritis), and associated structures. Classification depends on anatomical location, severity, and presence of complicating factors.",
      epidemiology: "Among the most common bacterial infections worldwide. ~50-60% of women will experience at least one UTI in their lifetime. Recurrence rate of ~25% within 6 months of initial episode.",
      keyGuidelines: [
        { name: "IDSA 2025 cUTI Guideline (NEW)", detail: "First-ever IDSA guideline on complicated UTI. Introduces a 4-step empiric therapy approach (severity → resistance risk factors → patient factors → antibiogram). Supports shorter durations (FQ 5-7d, non-FQ 7d) and early IV-to-PO switch even in bacteremia. Reclassifies cUTI based on systemic symptoms, not anatomy. Endorsed by AUA, ESCMID, ASM, SAEM, SHM, SIDP, AMMI-CA." },
        { name: "IDSA/ESCMID 2011", detail: "International Clinical Practice Guidelines for uncomplicated cystitis and pyelonephritis in women — remains relevant for uncomplicated UTI management" },
        { name: "AUA/CUA/SUFU 2019", detail: "Recurrent UTI guideline — important for prophylaxis strategies" },
        { name: "IDSA 2010 CAUTI", detail: "Diagnosis, prevention, and treatment of catheter-associated UTI" },
        { name: "EAU 2024", detail: "European Association of Urology guidelines — frequently updated, good for emerging resistance data" },
      ],
      landmarkTrials: [
        { name: "IDSA 2025 cUTI Guideline", detail: "First-ever IDSA guideline on complicated UTI. Paradigm shift: reclassifies UTI by symptoms (systemic signs) not anatomy, introduces 4-step empiric approach, endorses 7-day courses even for bacteremic UTI, formalizes IV-to-PO switch in bacteremia, and restricts novel agents to definitive therapy only." },
        { name: "ALTAR Trial (2018)", detail: "Demonstrated non-inferiority of antibiotic advice vs. immediate antibiotics for uncomplicated UTI in women. Delayed/back-up prescription is a viable strategy." },
        { name: "Pivmecillinam vs TMP-SMX (Nicolle, 2000s)", detail: "Established pivmecillinam as a viable alternative in regions with high TMP-SMX resistance." },
        { name: "Hooton et al. NEJM 2012", detail: "Ibuprofen vs. fosfomycin for uncomplicated cystitis — showed ~⅔ of women with uncomplicated cystitis resolved with ibuprofen alone, but higher pyelonephritis risk. Does NOT support replacing antibiotics with NSAIDs." },
        { name: "COMBINE Trial (2023)", detail: "Nitrofurantoin 3 days vs 5 days for uncomplicated cystitis — 3 days was non-inferior, supporting shorter courses." },
      ],
      riskFactors: "Sexual intercourse, spermicide use, prior UTI history, diabetes, urinary catheterization, anatomical abnormalities, post-menopausal status (estrogen depletion), pregnancy, immunosuppression, urinary retention/obstruction.",
    },
    subcategories: [
      {
        id: "uncomplicated-cystitis",
        name: "Uncomplicated Cystitis",
        definition: "Acute cystitis in a non-pregnant, pre-menopausal woman with no known urological abnormalities, no recent instrumentation, and no systemic signs of infection.",
        clinicalPresentation: "Dysuria, urinary frequency, urgency, suprapubic pain/discomfort. Absence of fever, flank pain, or systemic symptoms.",
        diagnostics: "Urinalysis (positive LE and/or nitrites) is sufficient. Urine culture NOT routinely required per IDSA guidelines for straightforward presentations. Culture recommended if: recurrent infection, recent antibiotic use, or uncertain diagnosis.",
        empiricTherapy: [
          {
            line: "First-Line",
            options: [
              { drug: "nitrofurantoin", regimen: "Nitrofurantoin monohydrate/macrocrystals 100mg PO BID × 5 days", notes: "Preferred agent. COMBINE trial supports potential 3-day course. Avoid if CrCl <30 mL/min (though recent data supports use down to ~20). Not effective for anything beyond the bladder." },
              { drug: "tmp-smx", regimen: "TMP-SMX DS (160/800mg) PO BID × 3 days", notes: "Use only if local resistance <20%. Avoid if used in prior 3 months. Check sulfa allergy. 3-day course is well established." },
              { drug: "fosfomycin", regimen: "Fosfomycin trometamol 3g PO × 1 dose", notes: "Single-dose convenience. Slightly inferior efficacy vs. multi-day regimens per meta-analyses. Good for adherence-challenged patients. Mix in water, not hot beverages." },
            ],
          },
          {
            line: "Second-Line (use when first-line agents cannot be used)",
            options: [
              { drug: "amox-clav", regimen: "Amoxicillin-Clavulanate 500/125mg PO BID × 5-7 days", notes: "Inferior efficacy to first-line agents for uncomplicated cystitis. More collateral damage. Reserve when others unavailable." },
              { drug: "cephalexin", regimen: "Cephalexin 500mg PO BID-QID × 5-7 days", notes: "Reasonable alternative. Better tolerated than amox-clav. Limited guideline support as first choice." },
              { drug: "cefpodoxime", regimen: "Cefpodoxime 100mg PO BID × 5-7 days", notes: "Third-gen oral cephalosporin option. Broader spectrum than needed for most uncomplicated cases." },
            ],
          },
          {
            line: "AVOID for Uncomplicated Cystitis",
            options: [
              { drug: "fluoroquinolones", regimen: "Ciprofloxacin, Levofloxacin", notes: "FDA boxed warning — reserve for infections with no other options. Massive collateral ecological damage. Risk of tendinopathy, aortic dissection, QT prolongation, CNS effects, peripheral neuropathy. IDSA explicitly recommends AGAINST for uncomplicated cystitis." },
            ],
          },
        ],
        organismSpecific: [
          { organism: "E. coli (75-95%)", preferred: "Per empiric guidelines above — nitrofurantoin, TMP-SMX (if susceptible), fosfomycin", alternative: "Cephalexin, cefpodoxime, amox-clav", notes: "Dominant pathogen. Rising resistance to TMP-SMX (15-25% in US) and fluoroquinolones (10-20%). Always check local antibiogram." },
          { organism: "Klebsiella pneumoniae (5-10%)", preferred: "TMP-SMX (if susceptible), cephalexin, cefpodoxime", alternative: "Amox-clav, fluoroquinolone", notes: "Intrinsically resistant to ampicillin. Watch for ESBL producers. Nitrofurantoin has borderline activity — generally avoid." },
          { organism: "Staphylococcus saprophyticus (5-10%)", preferred: "Nitrofurantoin, TMP-SMX, cephalexin", alternative: "Amox-clav", notes: "Second most common cause in young sexually active women. Typically very susceptible. Nitrite test often NEGATIVE (doesn't reduce nitrates)." },
          { organism: "Proteus mirabilis (3-5%)", preferred: "TMP-SMX (if susceptible), amox-clav, cephalosporins", alternative: "Fluoroquinolone", notes: "Intrinsically resistant to nitrofurantoin. Urease producer — associated with struvite stones. Alkaline urine is a clue." },
          { organism: "Enterococcus faecalis", preferred: "Amoxicillin 500mg TID, Nitrofurantoin", alternative: "Fosfomycin", notes: "Intrinsically resistant to cephalosporins and TMP-SMX. Do NOT use these even if lab reports 'susceptible' for cephalosporins — this is a known lab/clinical discordance." },
        ],
        pearls: [
          "Pyuria without bacteriuria? Think: recent antibiotics, interstitial cystitis, STI (chlamydia/gonorrhea), renal TB, or contamination.",
          "Asymptomatic bacteriuria (ASB) should NOT be treated except in pregnancy and before urologic procedures. Treating ASB drives resistance.",
          "Nitrofurantoin achieves excellent bladder concentrations but negligible serum/tissue levels — it ONLY treats cystitis, never pyelonephritis or bacteremia.",
          "The classic 'cranberry juice prevents UTIs' has weak evidence. PAC-A (proanthocyanidins) at 36mg/day in supplement form has slightly better data but is not a substitute for antibiotics.",
          "Post-menopausal women with recurrent UTI: vaginal estrogen cream is evidence-based prophylaxis (Cochrane review supports). Counsel patients on this.",
          "D-mannose 2g daily has RCT data (Kranjčec 2014) showing similar recurrence prevention to nitrofurantoin prophylaxis. Reasonable to trial.",
        ],
      },
      {
        id: "complicated-uti",
        name: "Complicated UTI",
        definition: "Per IDSA 2025 reclassification: UTI with localized symptoms AND systemic signs (fever ≥38°C, hemodynamic instability, or signs of sepsis) suggesting infection beyond the bladder. Also includes UTI with indwelling urinary catheter. IMPORTANT: The 2025 guidelines shift classification from anatomy-based (old: structural abnormalities, male sex) to symptom-based (new: presence of systemic signs at point-of-care). Pyelonephritis with fever is now classified as cUTI. Male UTI with fever is cUTI. Male UTI without systemic signs may be treated as uncomplicated.",
        clinicalPresentation: "Fever ≥38°C, flank pain, CVA tenderness, rigors, hemodynamic instability, altered mental status — any systemic sign suggesting infection beyond the bladder. The 2025 classification emphasizes point-of-care assessment: vital signs and catheter status are the primary drivers, NOT anatomical workup.",
        diagnostics: "Urine culture is REQUIRED (pre-treatment). Blood cultures if systemic signs or sepsis suspected. Assess severity: is the patient septic? Use Sepsis-3 criteria (SOFA ≥2), qSOFA, or SIRS as screening tools. CBC, BMP, lactate if sepsis concern. Imaging (CT/US) if obstruction, abscess, or failure to improve at 48-72h.",
        empiricTherapy: [
          {
            line: "IDSA 2025 Four-Step Approach",
            options: [
              { drug: "four-step-overview", regimen: "Step 1: Severity (sepsis vs. non-sepsis) → Step 2: Resistance risk factors → Step 3: Patient-specific factors → Step 4: Antibiogram (sepsis only)", notes: "This structured approach replaces the old 'pick an antibiotic' model. Each step narrows the empiric selection. The guideline emphasizes that inappropriate empiric therapy has little impact on mortality in NON-SEPTIC cUTI (mortality ≤5%), but is critical in sepsis/septic shock." },
            ],
          },
          {
            line: "First-Line — cUTI WITHOUT Sepsis",
            options: [
              { drug: "ceftriaxone", regimen: "Ceftriaxone 1-2g IV daily (or cefepime 2g IV q8h if AmpC/Pseudomonas concern)", notes: "IDSA 2025 preferred: 3rd/4th-gen cephalosporins. Carbapenems are NOT first-line for non-septic cUTI — this is a key stewardship change. Reserve carbapenems for sepsis or confirmed ESBL." },
              { drug: "pip-tazo", regimen: "Piperacillin-tazobactam 3.375g IV q6h (or 4.5g q8h extended infusion)", notes: "IDSA 2025 preferred empiric option. Extended infusion (over 4h) optimizes PK/PD. Appropriate when broader coverage desired (Pseudomonas risk)." },
              { drug: "ciprofloxacin", regimen: "Ciprofloxacin 500mg PO BID or Levofloxacin 750mg PO daily", notes: "IDSA 2025 preferred IF no FQ exposure in past 12 months (Step 2). Advantage: oral administration avoids IV, enables outpatient treatment. AVOID if FQ used in prior 12 months — guideline-specific recommendation." },
            ],
          },
          {
            line: "First-Line — cUTI WITH Sepsis",
            options: [
              { drug: "ceftriaxone-sepsis", regimen: "Ceftriaxone 2g IV daily or Cefepime 2g IV q8h", notes: "IDSA 2025: same preferred classes but carbapenems now INCLUDED as first-line for sepsis (not restricted to ESBL). Priority shifts to ensuring early appropriate therapy — stewardship deferred to definitive phase." },
              { drug: "pip-tazo-sepsis", regimen: "Piperacillin-tazobactam 4.5g IV q6-8h (extended infusion)", notes: "Preferred in sepsis. Extended infusion standard of care. Consider if Pseudomonas risk based on prior cultures." },
              { drug: "meropenem", regimen: "Meropenem 1g IV q8h (extended infusion over 3h)", notes: "IDSA 2025 includes carbapenems as first-line option for SEPSIS (unlike non-septic cUTI). Use if ESBL risk, prior MDR organisms, or septic shock. Antibiogram step: select agent with ≥90% susceptibility for septic shock, ≥80% for sepsis without shock." },
              { drug: "levofloxacin-sepsis", regimen: "Levofloxacin 750mg IV daily", notes: "FQs remain a preferred class even in sepsis IF no prior FQ exposure in 12 months. 100% bioavailability supports early PO switch once stable." },
            ],
          },
          {
            line: "Newer Agents (Reserve — NOT First-Line per IDSA 2025)",
            options: [
              { drug: "newer-agents", regimen: "Ceftazidime-avibactam, Meropenem-vaborbactam, Ceftolozane-tazobactam, Cefiderocol, Plazomicin", notes: "IDSA 2025 explicitly recommends AGAINST using novel BL-BLI agents and cefiderocol as empiric first-line, even in sepsis. Reserve for definitive therapy of MDR/XDR organisms (CRE, MBL-producers, DTR Pseudomonas). This is a major stewardship statement — protect these agents." },
            ],
          },
          {
            line: "Duration (IDSA 2025 — Shorter Courses Endorsed)",
            options: [
              { drug: "duration-fq", regimen: "Fluoroquinolone: 5-7 days total (moderate certainty evidence)", notes: "Counted from first day of EFFECTIVE therapy. Shorter than traditional 7-14 day recommendations. Practice-changing for stewardship." },
              { drug: "duration-non-fq", regimen: "Non-fluoroquinolone: 7 days total (very low certainty evidence)", notes: "7 days is now the suggested standard, NOT 10-14 days. Applies to cephalosporins, pip-tazo, carbapenems. Exception: suspected prostatitis in men — may need 10-14 days." },
              { drug: "duration-bacteremia", regimen: "cUTI with gram-negative bacteremia: 7 days total (low certainty evidence)", notes: "IDSA 2025 suggests 7 days even for BACTEREMIC cUTI, not 14 days. This is a landmark recommendation — shorter courses for bacteremic UTI are now guideline-endorsed. Count from first day of effective therapy." },
            ],
          },
          {
            line: "IV-to-PO Step-Down (IDSA 2025 — Formally Endorsed)",
            options: [
              { drug: "iv-po-switch", regimen: "Switch when: clinically improving, able to take oral meds, effective oral option available", notes: "IDSA 2025 formally endorses early IV-to-PO transition, even in gram-negative bacteremia (conditional recommendation). Oral options: FQs (ciprofloxacin, levofloxacin), TMP-SMX, amox-clav (if susceptible). Effective oral agent must achieve therapeutic levels in urine AND tissue AND be active against the pathogen." },
            ],
          },
        ],
        organismSpecific: [
          { organism: "ESBL-producing Enterobacterales", preferred: "Carbapenems (ertapenem 1g IV daily for non-Pseudomonal; meropenem if Pseudomonas risk)", alternative: "IDSA 2025 lists novel BL-BLIs for definitive therapy of confirmed ESBL. Pip-tazo controversial per MERINO trial for bacteremia but IDSA 2025 does not exclude it for UTI-source if susceptible.", notes: "MERINO Trial (2018, JAMA): Pip-tazo inferior to meropenem for ESBL E. coli/Kleb bacteremia. For ESBL cUTI without bacteremia, pip-tazo may suffice if MIC ≤16. Nitrofurantoin or fosfomycin may work for ESBL cystitis (uncomplicated). IDSA 2025 Step 2: prior urine culture showing ESBL = avoid cephalosporins/pip-tazo empirically → go to carbapenem." },
          { organism: "Pseudomonas aeruginosa", preferred: "Cefepime, pip-tazo, meropenem (IV); Ciprofloxacin (only reliable oral anti-pseudomonal)", alternative: "Ceftazidime, tobramycin", notes: "Culture-guided therapy essential. IDSA 2025 Step 2: if prior urine culture grew Pseudomonas, select agent with known activity. Cipro is the only oral option with reliable Pseudomonal activity — critical for step-down." },
          { organism: "Enterococcus faecium (VRE)", preferred: "Linezolid 600mg PO/IV BID, Nitrofurantoin (if cystitis only)", alternative: "Fosfomycin (limited data), Daptomycin (poor urinary excretion — unreliable for UTI)", notes: "Confirm true infection vs colonization. Many VRE UTIs are ASB. Linezolid achieves urinary concentrations. IDSA 2025 does not specifically address VRE UTI in the cUTI guideline — expert opinion applies." },
          { organism: "CRE (Carbapenem-Resistant Enterobacterales)", preferred: "Ceftazidime-avibactam (KPC), Meropenem-vaborbactam (KPC), Cefiderocol (MBL/broad)", alternative: "Plazomicin, Imipenem-relebactam", notes: "IDSA 2025 explicitly reserves these novel agents for DEFINITIVE therapy of confirmed resistant organisms. Do NOT use empirically unless prior cultures confirm CRE. Know your mechanism: KPC → ceftaz-avi or mer-vab. MBL (NDM, VIM) → cefiderocol or aztreonam + ceftaz-avi." },
        ],
        pearls: [
          "IDSA 2025 RECLASSIFICATION: The biggest conceptual change — complicated vs uncomplicated UTI is now based on SYMPTOMS (systemic signs like fever, hemodynamic instability), NOT anatomy. A male with cystitis symptoms only and no fever may be treated as uncomplicated. This is a paradigm shift from the old 'male UTI = always complicated' teaching.",
          "THE FOUR-STEP APPROACH: (1) Sepsis? → determines which agents are first-line. (2) Prior resistant urine cultures? Prior FQ in 12 months? → avoid those agents empirically. (3) Allergies, drug interactions, renal function? → refine selection. (4) Septic? → check antibiogram, target ≥90% susceptibility for shock, ≥80% for sepsis without shock.",
          "SHORTER DURATIONS ARE HERE: 5-7 days for FQ, 7 days for non-FQ, and 7 days even for BACTEREMIC cUTI. The traditional 10-14 day courses are no longer guideline-supported for most patients. This is a massive stewardship win — advocate for it.",
          "CARBAPENEMS RESTRICTED FOR NON-SEPTIC cUTI: IDSA 2025 explicitly recommends against carbapenems as first-line for cUTI without sepsis. This is carbapenem-sparing stewardship at the guideline level. Push cephalosporins and pip-tazo first.",
          "NOVEL AGENTS ARE NOT EMPIRIC: Ceftazidime-avibactam, meropenem-vaborbactam, cefiderocol, plazomicin — these are reserved for DEFINITIVE therapy of confirmed MDR/XDR organisms. Using them empirically drives resistance to our last-line agents. Protect them.",
          "FQ AVOIDANCE IF PRIOR EXPOSURE: If the patient received ANY fluoroquinolone in the past 12 months, the 2025 guideline specifically recommends avoiding empiric FQ for cUTI. The risk of FQ-resistant uropathogen is substantially increased. Use a cephalosporin or pip-tazo instead.",
          "IV-TO-PO SWITCH IN BACTEREMIA: IDSA 2025 formally endorses oral step-down even in gram-negative bacteremia from UTI source — when clinically improving, afebrile, hemodynamically stable, source controlled, and effective oral option available. This eliminates the 'must complete IV for bacteremia' dogma. Champion this.",
          "ANTIBIOGRAM THRESHOLDS: For septic shock, select an agent with ≥90% susceptibility on the local antibiogram. For sepsis without shock, ≥80% is acceptable. These thresholds are derived from mortality modeling — not arbitrary numbers.",
          "Male UTI nuance: The 2025 guidelines note that men with febrile UTI where prostatitis is suspected may need 10-14 days (the 7-day recommendation may not apply). Always consider prostatitis in febrile male UTI — it changes duration AND agent selection (need prostate-penetrating drugs: FQs, TMP-SMX).",
        ],
      },
      {
        id: "pyelonephritis",
        name: "Acute Pyelonephritis",
        definition: "Upper urinary tract infection involving the renal parenchyma. NOTE: Per IDSA 2025 reclassification, pyelonephritis WITH fever/systemic signs is now classified as COMPLICATED UTI — see the Complicated UTI section for the 4-step empiric approach, duration, and IV-to-PO switch guidance. This section retains the clinical presentation, organism-specific data, and outpatient management details. Uncomplicated pyelonephritis (non-pregnant, pre-menopausal woman, no systemic toxicity) can still be managed outpatient per IDSA/ESCMID 2011.",
        clinicalPresentation: "Fever (>38°C), flank pain, costovertebral angle (CVA) tenderness, with or without lower urinary tract symptoms. Nausea, vomiting common. May present with sepsis. Per IDSA 2025: the presence of fever makes this a complicated UTI by new classification.",
        diagnostics: "Urine culture REQUIRED. Blood cultures recommended (bacteremia present in 15-30% of cases). CBC, BMP (assess renal function). CT abdomen/pelvis if: no improvement at 48-72h, suspected obstruction, or abscess concern.",
        empiricTherapy: [
          {
            line: "Outpatient (Uncomplicated, Tolerating PO, Not Septic)",
            options: [
              { drug: "ciprofloxacin", regimen: "Ciprofloxacin 500mg PO BID × 7 days", notes: "IDSA first-line for outpatient pyelo IF local FQ resistance <10%. 7-day course is established." },
              { drug: "tmp-smx", regimen: "TMP-SMX DS PO BID × 14 days", notes: "Alternative if FQ cannot be used. Requires 14 days (longer than FQ). IDSA recommends a one-time IV dose of ceftriaxone 1g or aminoglycoside with initiation if using TMP-SMX empirically (pending cultures)." },
              { drug: "ceftriaxone-oral-step", regimen: "Ceftriaxone 1g IV/IM × 1 dose THEN oral step-down (cefpodoxime, TMP-SMX, or FQ per susceptibility)", notes: "Excellent strategy for ED-treat-and-release. The single IV dose provides immediate high tissue levels while you await culture results for definitive oral selection." },
            ],
          },
          {
            line: "Inpatient (Complicated, Septic, Unable to Tolerate PO)",
            options: [
              { drug: "ceftriaxone", regimen: "Ceftriaxone 2g IV daily", notes: "Workhorse empiric. Broad gram-negative coverage. Step down when clinically improved." },
              { drug: "pip-tazo", regimen: "Piperacillin-tazobactam 3.375g IV q6h (or 4.5g q8h EI)", notes: "Use if Pseudomonas risk or healthcare-associated exposure. Extended infusion preferred." },
              { drug: "meropenem", regimen: "Meropenem 1g IV q8h", notes: "Reserve for ESBL risk, prior MDR organisms, or septic shock. De-escalate aggressively." },
            ],
          },
          {
            line: "Adjunctive",
            options: [
              { drug: "supportive", regimen: "IV fluids, antipyretics, antiemetics", notes: "Aggressive hydration is critical. Urology consult if obstructive cause suspected — may require percutaneous nephrostomy or ureteral stent urgently." },
            ],
          },
        ],
        organismSpecific: [
          { organism: "E. coli (>80%)", preferred: "Fluoroquinolone (outpatient) or ceftriaxone (inpatient)", alternative: "TMP-SMX if susceptible (14-day course)", notes: "Dominant pathogen. Bacteremia common. ESBL E. coli pyelo rising — always check prior cultures." },
          { organism: "Proteus, Klebsiella, Enterobacter", preferred: "Ceftriaxone, fluoroquinolone", alternative: "Pip-tazo, carbapenems for resistant isolates", notes: "Proteus + stones = think struvite/staghorn calculus. Enterobacter: avoid ceftriaxone (AmpC induction risk) — use cefepime instead." },
        ],
        pearls: [
          "CRITICAL: Enterobacter, Citrobacter freundii, Serratia — these are AmpC producers. Ceftriaxone can induce AmpC and fail clinically even if the lab reports susceptible. Use cefepime for these 'SPACE' organisms.",
          "Outpatient pyelo: always give the first dose in the ED/clinic and observe 4-6 hours. If tolerating PO and hemodynamically stable, safe to discharge with close follow-up.",
          "Failure to improve at 48-72h? Get imaging. Think: perinephric abscess (requires drainage), obstruction (requires decompression), or wrong antibiotic (check cultures).",
          "Pregnancy + pyelonephritis = ALWAYS inpatient. Risk of preterm labor and sepsis. Ceftriaxone is preferred. Avoid fluoroquinolones and TMP-SMX (first trimester folate antagonism, third trimester kernicterus risk).",
          "Duration debates: IDSA 2025 now formally endorses shorter courses for cUTI (which includes febrile pyelo): FQ 5-7 days, non-FQ 7 days, even bacteremic UTI 7 days. The old 10-14 day default is no longer guideline-supported. For FQs, 7 days is well-established; for beta-lactams, 7 days is the new target based on the 2025 guideline (very low certainty evidence for non-FQ, but the direction is clear).",
        ],
      },
      {
        id: "cauti",
        name: "Catheter-Associated UTI (CAUTI)",
        definition: "UTI in a patient with an indwelling urethral catheter, suprapubic catheter, or intermittent catheterization within the past 48 hours. Requires BOTH symptoms AND significant bacteriuria (≥10³ CFU/mL). Do NOT treat asymptomatic catheter-associated bacteriuria (CA-ASB).",
        clinicalPresentation: "Fever, rigors, altered mental status, malaise, flank pain, CVA tenderness, acute hematuria, pelvic discomfort. NOTE: Cloudy or malodorous urine ALONE is NOT an indication to treat — this reflects colonization and catheter biofilm, not infection.",
        diagnostics: "Replace catheter BEFORE collecting specimen (biofilm on old catheter = misleading results). Culture from the freshly placed catheter. Blood cultures if systemic signs. ≥10³ CFU/mL is the CAUTI diagnostic threshold (lower than standard UTI).",
        empiricTherapy: [
          {
            line: "Empiric (Pending Cultures — Always De-escalate)",
            options: [
              { drug: "ceftriaxone", regimen: "Ceftriaxone 1-2g IV daily", notes: "Reasonable empiric for non-critically ill. Narrow once cultures return. Always assess for Pseudomonas risk." },
              { drug: "pip-tazo", regimen: "Piperacillin-tazobactam 4.5g IV q8h (EI over 4h)", notes: "Use if Pseudomonas or MDR risk (prior cultures, healthcare exposure). Extended infusion recommended." },
              { drug: "ciprofloxacin", regimen: "Ciprofloxacin 500mg PO BID (if can take PO and not critically ill)", notes: "Only oral option with Pseudomonal activity. But FQ resistance is high in catheterized populations — empiric use risky without prior culture data." },
            ],
          },
          {
            line: "Duration",
            options: [
              { drug: "duration-guide", regimen: "7 days if rapid clinical response; 10-14 days if delayed response", notes: "IDSA 2010: 7 days is adequate for most CAUTI with prompt clinical improvement. Shorter courses reduce C. diff risk and resistance selection." },
            ],
          },
        ],
        organismSpecific: [
          { organism: "Polymicrobial (common in CAUTI)", preferred: "Target the most pathogenic organism, not every isolate", alternative: "Broad-spectrum if critically ill, then narrow", notes: "CAUTI cultures are frequently polymicrobial. Not every organism needs treatment. Focus on gram-negative rods and enterococci. Coagulase-negative staph is almost always contamination in this setting." },
          { organism: "Candida species", preferred: "Remove/replace catheter — this alone may resolve candiduria", alternative: "Fluconazole 200mg daily × 14 days if symptomatic and catheter removal doesn't clear", notes: "DO NOT reflexively treat candiduria. Most is colonization. Treat only if: symptomatic, neutropenic, undergoing urologic procedure, or renal transplant. Echinocandins achieve poor urinary concentrations." },
        ],
        pearls: [
          "THE cardinal rule of CAUTI: Remove the catheter. If the catheter must stay, replace it before starting antibiotics. Biofilm = treatment failure.",
          "Cloudy/smelly urine in a catheterized patient is NOT an indication for antibiotics. This is the #1 driver of inappropriate antibiotic use in hospitals.",
          "CA-ASB (asymptomatic bacteriuria with catheter) should NOT be treated. Treat symptoms, not the lab result.",
          "CAUTI prevention bundle: daily assessment of catheter necessity, aseptic insertion, closed drainage, maintain below bladder level. Nurse-driven removal protocols reduce CAUTI rates by 50%+.",
          "Candiduria pearl: Echinocandins (micafungin, caspofungin) do NOT achieve therapeutic urinary concentrations. Only fluconazole and flucytosine reliably treat urinary Candida. Amphotericin B bladder irrigation is a last resort.",
          "Antibiotic stewardship role: Pharmacists should flag treatment of CA-ASB as a stewardship intervention. Many institutions have reduced unnecessary CAUTI treatment by 30-40% with pharmacist-driven protocols.",
        ],
      },
    ],
    drugMonographs: [
      {
        id: "nitrofurantoin",
        name: "Nitrofurantoin",
        brandNames: "Macrobid (monohydrate/macrocrystals), Macrodantin (macrocrystals), Furadantin (microcrystals)",
        drugClass: "Nitrofuran antibiotic",
        mechanismOfAction: "Reduced by bacterial nitroreductases to reactive intermediates that damage DNA, RNA, proteins, and cell wall synthesis. Multiple mechanisms make resistance development slow and uncommon.",
        spectrum: "Gram-positive: E. faecalis, S. saprophyticus, Group B Strep. Gram-negative: E. coli (>95% susceptible), Citrobacter. GAPS: NO Pseudomonas, Proteus, Serratia, Klebsiella (variable), Enterobacter. Does NOT cover any organism outside the bladder (no tissue/serum levels).",
        dosing: {
          standard: "100mg PO BID × 5 days (COMBINE trial supports 3-day course)",
          prophylaxis: "50-100mg PO at bedtime (for recurrent UTI prevention)",
          pediatric: "5-7 mg/kg/day divided BID-QID",
        },
        renalAdjustment: "Traditionally contraindicated at CrCl <30 mL/min (lack of urinary concentration + risk of toxicity). HOWEVER: Recent AAC study (Oplinger & Andrews 2013) and real-world data suggest usability down to CrCl ~20 mL/min for short courses (5 days) of cystitis treatment. Many ID pharmacists now use it cautiously in this range. Prophylactic use still avoid at <30.",
        hepaticAdjustment: "Use with caution. Rare hepatotoxicity (cholestatic and hepatocellular) — more common with prolonged use (>6 months). Baseline LFTs if planning prophylaxis.",
        adverseEffects: {
          common: "Nausea, headache, flatulence (GI effects significantly less with macrocrystal formulation — always use Macrobid)",
          serious: "Pulmonary toxicity (acute hypersensitivity pneumonitis OR chronic interstitial fibrosis with prolonged use >6 months), peripheral neuropathy, hepatotoxicity",
          rare: "Hemolytic anemia in G6PD deficiency (though actual risk is debated and may be lower than traditionally taught), lupus-like syndrome",
        },
        drugInteractions: [
          "Magnesium trisilicate antacids — decrease absorption",
          "Probenecid — blocks tubular secretion, reduces urinary levels and increases serum toxicity risk",
          "Norfloxacin — antagonism in vitro (clinical significance unclear, but avoid combination)",
        ],
        monitoring: "Short course: none routinely needed. Prophylaxis >6 months: CBC (monitor for megaloblastic anemia), LFTs q6 months, pulmonary symptoms review. Counsel patients to report any new cough or SOB immediately.",
        pregnancyLactation: "Category B. Generally safe in 2nd and 3rd trimesters. AVOID at term (≥38 weeks) — theoretical risk of hemolytic anemia in newborn. Avoid in 1st trimester if alternatives available (AAP guidance). Compatible with breastfeeding (but avoid if infant <1 month or G6PD deficient).",
        pharmacistPearls: [
          "ALWAYS dispense as Macrobid (macrocrystals/monohydrate), NOT Macrodantin or generic microcrystalline — dramatically less nausea.",
          "MUST be taken with food — absorption increases by ~40% and reduces GI side effects.",
          "It only works in the urine. If you suspect anything beyond cystitis (pyelo, bacteremia, prostatitis) — nitrofurantoin is the WRONG drug.",
          "The CrCl <30 'contraindication' is being re-evaluated. For a short course of cystitis in an elderly patient with CrCl 20-30, it's often the best option vs. fluoroquinolones. Document your clinical rationale.",
          "Turns urine brown/rust-colored — always counsel patients or they'll call in panicked.",
          "Despite decades of use, resistance rates remain remarkably low (~3-5% for E. coli). This is likely because of its multiple mechanisms — a lesson in antibiotic stewardship.",
        ],
      },
      {
        id: "tmp-smx",
        name: "Trimethoprim-Sulfamethoxazole",
        brandNames: "Bactrim, Bactrim DS, Septra, Sulfatrim",
        drugClass: "Folate pathway inhibitor (dihydrofolate reductase inhibitor + dihydropteroate synthase inhibitor)",
        mechanismOfAction: "Sequential blockade of folate synthesis. Trimethoprim inhibits dihydrofolate reductase (DHFR); sulfamethoxazole inhibits dihydropteroate synthase (DHPS). Synergistic bactericidal effect due to dual pathway inhibition.",
        spectrum: "Broad: E. coli, Proteus, Klebsiella (variable), S. saprophyticus, MRSA (PO option!), Stenotrophomonas maltophilia (drug of choice), PJP, Nocardia, Listeria, Toxoplasma. GAPS: Pseudomonas, Enterococci, Anaerobes, Group A & B Strep.",
        dosing: {
          standard: "1 DS tab (160/800mg) PO BID × 3 days (cystitis), 7-14 days (complicated UTI/pyelo)",
          uti: "DS PO BID × 3 days for uncomplicated cystitis",
          prostatitis: "DS PO BID × 4-6 weeks (excellent prostatic penetration)",
          mrsa: "1-2 DS PO BID (skin/soft tissue)",
          pjp: "15-20 mg/kg/day (TMP component) divided q6-8h",
        },
        renalAdjustment: "CrCl 15-30: reduce dose by 50%. CrCl <15: avoid (risk of hyperkalemia and myelosuppression). Monitor potassium — trimethoprim blocks ENaC in the collecting duct (acts like amiloride).",
        hepaticAdjustment: "Hepatotoxicity rare but can occur. Avoid in severe hepatic disease. Sulfonamide component can cause cholestatic jaundice.",
        adverseEffects: {
          common: "Nausea, vomiting, rash (morbilliform), photosensitivity",
          serious: "Hyperkalemia (TMP blocks ENaC — acts like K-sparing diuretic), myelosuppression (folate antagonism), Stevens-Johnson Syndrome/TEN (sulfonamide component), acute kidney injury (TMP inhibits creatinine secretion — serum Cr rises ~0.5-1 mg/dL without true GFR change)",
          rare: "Aseptic meningitis, C. diff, hemolytic anemia in G6PD deficiency, pancreatitis",
        },
        drugInteractions: [
          "Warfarin — MAJOR: TMP inhibits CYP2C9, potentiates warfarin. INR can spike dangerously. Monitor closely or choose alternative antibiotic.",
          "Methotrexate — additive folate antagonism → bone marrow suppression. Avoid combination if possible.",
          "ACE inhibitors/ARBs/spironolactone — additive hyperkalemia risk (TMP + RAAS blockade). Check K within 3-5 days.",
          "Phenytoin — increased phenytoin levels (CYP2C9 inhibition by TMP)",
          "Dapsone — both cause methemoglobinemia and marrow suppression. Monitor closely.",
          "CREATININE ARTIFACT: TMP competitively inhibits tubular creatinine secretion. Serum creatinine rises 0.5-1 mg/dL without actual GFR decline. Do NOT reflexively change dosing of renally-cleared drugs based on this.",
        ],
        monitoring: "Short course (3 days): potassium if on RAAS inhibitors. Prolonged use: CBC weekly (first month, then monthly), BMP (K, Cr), LFTs. Watch for rash — discontinue immediately if any mucosal involvement.",
        pregnancyLactation: "AVOID in 1st trimester (neural tube defect risk — folate antagonism) and near term/3rd trimester (risk of kernicterus in newborn, displacement of bilirubin from albumin). Category D. Compatible with breastfeeding in term, healthy infants, but avoid in premature or G6PD-deficient infants.",
        pharmacistPearls: [
          "The creatinine rise is NOT real AKI — teach this to your medical teams. TMP blocks tubular secretion of creatinine. Cystatin C-based GFR is unaffected. This is a high-value pharmacist intervention.",
          "Hyperkalemia from TMP is real and clinically significant, especially in elderly patients on ACE/ARB + TMP-SMX. One study showed 7-fold increase in hyperkalemia-related hospitalizations. Check K at day 3-5.",
          "For MRSA: TMP-SMX is one of the few ORAL options. Pairs well with doxycycline for complicated SSTI.",
          "Sulfa allergy is often over-reported. True IgE-mediated allergy (anaphylaxis) is rare. Rash with sulfonamide antibiotics does NOT necessarily cross-react with non-antibiotic sulfonamides (furosemide, thiazides) — different chemical structures.",
          "Desensitization protocols exist for PJP prophylaxis in HIV patients with sulfa allergy — critical knowledge for pharmacy.",
          "Always check local antibiogram for TMP-SMX resistance before using empirically for UTI. If resistance >20%, it's not appropriate as empiric therapy.",
        ],
      },
      {
        id: "fosfomycin",
        name: "Fosfomycin",
        brandNames: "Monurol (oral trometamol salt)",
        drugClass: "Phosphonic acid derivative (cell wall synthesis inhibitor — unique MOA)",
        mechanismOfAction: "Inhibits MurA (UDP-N-acetylglucosamine enolpyruvyl transferase), the first committed step of peptidoglycan synthesis. Completely unique mechanism — no cross-resistance with any other antibiotic class.",
        spectrum: "E. coli (excellent, >90% susceptible including many ESBL producers), Enterococcus faecalis (including VRE — useful niche!), Klebsiella (variable). GAPS: Pseudomonas (oral formulation), Acinetobacter, poor against many non-fermenters.",
        dosing: {
          standard: "3g PO × 1 dose (dissolved in cold water)",
          recurrent: "3g PO every 72 hours × 3 doses (some clinicians use this for recurrent/resistant cystitis — off-label but published data supports)",
          iv: "IV formulation available in Europe (not US) — used for serious systemic infections at doses of 12-24g/day divided q6-8h. Under investigation for ESBL/MDR infections.",
        },
        renalAdjustment: "No dose adjustment needed for oral single-dose. Excreted renally — concentrations adequate even in moderate renal impairment.",
        hepaticAdjustment: "No adjustment needed.",
        adverseEffects: {
          common: "Diarrhea (~10%), nausea, headache, vaginitis",
          serious: "Very rare with single-dose therapy. Aplastic anemia reported with prolonged/IV use.",
          rare: "Angioedema, toxic epidermal necrolysis (extremely rare case reports)",
        },
        drugInteractions: [
          "Metoclopramide — decreases fosfomycin absorption (increased GI motility reduces absorption time)",
          "Minimal drug interactions overall — a significant advantage",
        ],
        monitoring: "Single-dose therapy: none required. For off-label multi-dose regimens: BMP, CBC.",
        pregnancyLactation: "Category B. Single-dose considered safe in pregnancy for uncomplicated cystitis. Italian and European data support use in pregnant women. A useful option when nitrofurantoin and cephalosporins aren't suitable.",
        pharmacistPearls: [
          "Dissolve in 3-4 oz of COLD water. Not hot — not juice (acid reduces efficacy). Take on empty stomach or it doesn't matter much, but cold water specifically.",
          "Single-dose convenience is the biggest selling point. Perfect for the patient you know won't complete a course.",
          "Slightly inferior clinical cure rate vs. multi-day regimens (meta-analyses show ~85% vs ~90%). Accept this trade-off for adherence.",
          "Useful for ESBL E. coli cystitis — one of the few oral options. The oral formulation only treats cystitis (poor tissue penetration).",
          "The IV formulation (available in EU, not US) is a game-changer for ESBL/CRE — 12-24g/day divided doses. Be aware of this if doing international stewardship work.",
          "Can use for E. faecalis UTI (including VRE urinary isolates) — niche but valuable.",
          "Susceptibility testing: Agar dilution is the reference method. Disk diffusion is unreliable for fosfomycin — if your lab uses disk diffusion, interpret with caution.",
          "E. coli resistance to fosfomycin is mediated by chromosomal mutations (not plasmid) — resistance develops slowly and remains low (~1-3%).",
        ],
      },
      {
        id: "ciprofloxacin",
        name: "Ciprofloxacin",
        brandNames: "Cipro, Cipro XR",
        drugClass: "Fluoroquinolone (2nd generation) — DNA gyrase and topoisomerase IV inhibitor",
        mechanismOfAction: "Inhibits bacterial DNA gyrase (primarily gram-negative target) and topoisomerase IV (primarily gram-positive target). Causes double-strand DNA breaks. Bactericidal and concentration-dependent killing.",
        spectrum: "Excellent gram-negative: E. coli, Klebsiella, Proteus, Pseudomonas aeruginosa (most reliable oral anti-pseudomonal agent), Salmonella, Shigella, H. influenzae. Moderate: some atypicals (Legionella, Mycoplasma). GAPS: Poor gram-positive (especially Streptococcus pneumoniae — never use for CAP), MRSA, Anaerobes.",
        dosing: {
          uncomplicated_uti: "250mg PO BID × 3 days or Cipro XR 500mg daily × 3 days (but should be AVOIDED for uncomplicated cystitis per IDSA/FDA)",
          complicated_uti: "500mg PO BID × 7-14 days",
          pyelonephritis: "500mg PO BID × 7 days",
          iv: "400mg IV q12h (equivalent to 500mg PO — excellent bioavailability makes IV rarely necessary if GI tract functional)",
          pseudomonal: "750mg PO BID or 400mg IV q8h for serious Pseudomonal infections",
        },
        renalAdjustment: "CrCl 30-50: no change. CrCl 5-29: 250-500mg PO q12-18h or 200-400mg IV q18-24h. Hemodialysis: dose after dialysis (slightly dialyzed).",
        hepaticAdjustment: "No routine adjustment, but use caution in severe hepatic impairment (hepatotoxicity reported).",
        adverseEffects: {
          common: "Nausea, diarrhea, headache, dizziness, photosensitivity, insomnia",
          serious: "Tendon rupture/tendinopathy (Achilles most common — risk increases with age >60, corticosteroids, renal disease, solid organ transplant), aortic aneurysm/dissection, QT prolongation, peripheral neuropathy (may be irreversible), C. difficile, seizures, CNS effects (anxiety, confusion, psychosis), retinal detachment (epidemiologic signal)",
          rare: "Myasthenia gravis exacerbation (FQs have neuromuscular blocking activity), crystalluria (ensure hydration)",
          fdaBoxedWarnings: "Tendinitis/tendon rupture, peripheral neuropathy, CNS effects, myasthenia gravis exacerbation. FDA restricts use for uncomplicated infections when alternatives exist.",
        },
        drugInteractions: [
          "Divalent/trivalent cations (Ca²⁺, Mg²⁺, Al³⁺, Fe²⁺/³⁺, Zn²⁺) — chelation reduces absorption 50-90%. Separate by 2h before or 6h after. This includes antacids, dairy, multivitamins, sucralfate, calcium supplements, tube feeds.",
          "Tizanidine — CONTRAINDICATED. Cipro inhibits CYP1A2, causing 10-fold increase in tizanidine levels → severe hypotension and sedation.",
          "Theophylline — CYP1A2 inhibition → theophylline toxicity (seizures, arrhythmias). Monitor levels.",
          "Warfarin — enhanced anticoagulant effect. Monitor INR.",
          "QT-prolonging drugs — additive risk. Avoid with Class IA/III antiarrhythmics.",
          "NSAIDs — may lower seizure threshold in combination with FQs.",
          "Methotrexate — FQs reduce renal tubular secretion of MTX → increased toxicity.",
        ],
        monitoring: "Short course: clinical response. Longer courses: BMP (crystalluria risk — hydrate well), tendon symptoms review, neuropsychiatric assessment. Educate patient to report tendon pain immediately.",
        pregnancyLactation: "Category C. Traditionally avoided due to arthropathy in juvenile animals. However, human data doesn't show clear joint toxicity. Generally avoid if alternatives exist. AAP considers compatible with breastfeeding, but caution advised.",
        pharmacistPearls: [
          "The cation interaction is the #1 pharmacist intervention for ciprofloxacin. Patients on calcium, iron, or antacids WILL have treatment failure if not counseled. Separate by 2h before or 6h after.",
          "Cipro has ~70-80% oral bioavailability. IV-to-PO conversion is a major stewardship opportunity — 500mg PO ≈ 400mg IV. Push for early switch.",
          "NEVER use cipro for pneumonia — it has poor Streptococcus pneumoniae activity. This is a common and dangerous error. Levofloxacin is the 'respiratory FQ,' not cipro.",
          "Cipro is THE oral anti-pseudomonal agent. When you need oral Pseudomonas coverage (step-down from IV, outpatient UTI), cipro is often your only choice. This is its niche value — don't waste it on uncomplicated cystitis.",
          "For tube feeds: must hold feeds 1-2h before and after cipro administration (cation chelation with formula calcium). This is frequently missed in hospitals.",
          "Achilles tendon rupture risk is real but often over-feared. Absolute risk is ~0.4%. Highest risk: age >60, concurrent steroids, renal impairment, prior tendon issues. Still — always counsel.",
          "Photosensitivity: counsel patients to use SPF 30+ sunscreen. Some patients develop severe phototoxic reactions.",
        ],
      },
      {
        id: "ceftriaxone",
        name: "Ceftriaxone",
        brandNames: "Rocephin",
        drugClass: "Third-generation cephalosporin",
        mechanismOfAction: "Inhibits penicillin-binding proteins (PBPs), primarily PBP-3, disrupting cell wall synthesis. Bactericidal. Time-dependent killing (T>MIC drives efficacy).",
        spectrum: "Broad gram-negative: E. coli, Klebsiella, Proteus, Serratia, H. influenzae, N. gonorrhoeae, N. meningitidis, Salmonella. Moderate gram-positive: Streptococci (including S. pneumoniae), but NOT MRSA, NOT Enterococcus. GAPS: ESBL producers (typically resistant), AmpC producers (may induce — avoid for SPACE organisms), Pseudomonas, Listeria, Anaerobes (poor).",
        dosing: {
          uti: "1-2g IV/IM daily",
          meningitis: "2g IV q12h",
          gonorrhea: "500mg IM × 1 (updated CDC 2021 — was previously 250mg)",
          cap: "1-2g IV daily (usually with azithromycin or doxycycline)",
          sbp: "2g IV daily × 5-7 days",
          singleDose: "1g IV/IM × 1 dose as empiric bridge for outpatient pyelo/UTI step-down",
        },
        renalAdjustment: "No adjustment needed in renal impairment alone (biliary excretion ~40%). If COMBINED hepatic + renal impairment: max 2g/day.",
        hepaticAdjustment: "Monitor closely in hepatic impairment due to biliary excretion. Risk of biliary sludge/pseudolithiasis (especially in children, prolonged courses, fasting patients).",
        adverseEffects: {
          common: "Diarrhea, injection site pain (IM), rash, elevated LFTs",
          serious: "C. difficile (higher risk than narrow-spectrum agents), biliary sludge/pseudolithiasis (reversible, US-detectable), hypersensitivity/anaphylaxis (cross-reactivity with penicillin is ~1-2%, much lower than the old 10% myth)",
          rare: "Hemolytic anemia (immune-mediated), neurotoxicity at very high doses, leukopenia (prolonged use)",
          contraindications: "Neonates (<28 days) receiving calcium-containing IV solutions (risk of fatal cardiopulmonary precipitates). NEVER co-infuse with calcium in neonates.",
        },
        drugInteractions: [
          "Calcium-containing IV solutions — contraindicated in neonates, use caution in other patients (precipitation risk in the line, not systemically in adults)",
          "Warfarin — may enhance effect (vitamin K depletion from gut flora suppression). Monitor INR.",
          "Ringer's lactate — contains calcium. Use NS for reconstitution/infusion in neonates.",
        ],
        monitoring: "Short courses: clinical response. Prolonged use (>2 weeks): CBC, LFTs, RUS if symptomatic for biliary sludge. Assess for C. diff if diarrhea develops.",
        pregnancyLactation: "Category B. Considered safe in all trimesters. Preferred agent for UTI/pyelo in pregnancy when IV needed. Low breast milk excretion — compatible with breastfeeding.",
        pharmacistPearls: [
          "Ceftriaxone is the pharmacist's Swiss Army knife for empiric gram-negative coverage. Know its limitations: NO Pseudomonas, NO ESBL, NO Enterococcus, NO MRSA.",
          "The penicillin-cephalosporin cross-reactivity myth: The old '10% cross-reactivity' number came from contaminated early penicillin batches. Actual cross-reactivity is ~1-2% and is based on R1 side chain similarity. Ceftriaxone has DIFFERENT side chains than ampicillin/amoxicillin — cross-reactivity is very low. Most penicillin-allergic patients can safely receive ceftriaxone.",
          "IM administration: reconstitute with 1% lidocaine to reduce pain. This is standard of care and drastically improves patient experience. Make sure there's no lidocaine allergy.",
          "AmpC warning: For SPACE organisms (Serratia, Providencia/Pseudomonas, Acinetobacter, Citrobacter freundii, Enterobacter), ceftriaxone can induce AmpC beta-lactamase production, leading to clinical failure even if initial susceptibility testing says 'susceptible.' Switch to cefepime.",
          "Once-daily dosing with a long half-life (~8h) makes it ideal for OPAT (outpatient parenteral antibiotic therapy). Perfect for ED treat-and-release strategies.",
          "Biliary sludge risk: more common with doses >2g/day, courses >14 days, fasting/TPN patients, and children. Usually reversible upon discontinuation. Counsel to stay hydrated.",
        ],
      },
      {
        id: "levofloxacin",
        name: "Levofloxacin",
        brandNames: "Levaquin",
        drugClass: "Fluoroquinolone (3rd generation, 'respiratory fluoroquinolone')",
        mechanismOfAction: "L-isomer of ofloxacin. Inhibits DNA gyrase and topoisomerase IV. Enhanced gram-positive activity (especially S. pneumoniae) compared to ciprofloxacin. Concentration-dependent killing with prolonged PAE.",
        spectrum: "Broad gram-negative (similar to cipro but slightly less anti-pseudomonal potency), PLUS excellent gram-positive: S. pneumoniae (including drug-resistant — hence 'respiratory FQ'), atypicals (Legionella, Mycoplasma, Chlamydophila). GAPS: MRSA, Anaerobes (limited), some Pseudomonas strains.",
        dosing: {
          uti_uncomplicated: "250mg PO daily × 3 days (AVOID per IDSA/FDA for uncomplicated — same as cipro)",
          uti_complicated: "750mg PO daily × 5-7 days",
          pyelonephritis: "750mg PO daily × 5 days",
          cap: "750mg PO/IV daily × 5 days (CABP standard)",
          iv: "750mg IV daily (100% bioavailability — PO = IV, nearly dollar-for-dollar)",
        },
        renalAdjustment: "750mg dose: CrCl 20-49: 750mg q48h. CrCl 10-19: 500mg q48h. Hemodialysis: 500mg q48h (not significantly dialyzed). 500mg dose: CrCl 20-49: 250mg q24h. CrCl 10-19: 250mg q48h.",
        hepaticAdjustment: "No specific adjustment. Use caution — hepatotoxicity reported (rare).",
        adverseEffects: {
          common: "Same as ciprofloxacin class effects: nausea, diarrhea, headache, insomnia",
          serious: "Same FDA boxed warnings as cipro: tendinitis/rupture, peripheral neuropathy, CNS effects, MG exacerbation. Additionally: hypoglycemia (especially in diabetic patients on sulfonylureas/insulin), QT prolongation (more pronounced than cipro)",
          rare: "Hepatic failure, toxic epidermal necrolysis, torsades de pointes",
        },
        drugInteractions: [
          "Cation chelation — same as ciprofloxacin. Separate from Ca, Mg, Al, Fe, Zn.",
          "QT-prolonging agents — levofloxacin has MORE QT effect than cipro. Be extra cautious with amiodarone, sotalol, ondansetron, methadone.",
          "Insulin/sulfonylureas — FQs can cause both hypo- and hyperglycemia. Levo seems to have a higher dysglycemia signal than cipro.",
          "Warfarin — enhanced anticoagulation. Monitor INR.",
          "Note: UNLIKE cipro, levofloxacin does NOT significantly inhibit CYP1A2, so NO tizanidine or theophylline interaction. This is a key differentiator.",
        ],
        monitoring: "Blood glucose (especially diabetics), QTc if on other QT-prolonging agents, tendon symptoms, neuropsychiatric effects.",
        pregnancyLactation: "Category C. Same general FQ avoidance in pregnancy. Breastfeeding: enters breast milk — generally avoided.",
        pharmacistPearls: [
          "Levo vs. Cipro: Cipro is better for Pseudomonas; Levo is better for respiratory pathogens (S. pneumoniae). Use the right one for the right bug.",
          "100% oral bioavailability — there is ZERO reason to use IV levofloxacin if the patient can swallow. This is one of the most impactful stewardship interventions (cost savings: IV ~$30-80/dose vs. PO ~$1-5).",
          "750mg × 5 days for pyelo is a well-validated short course. Higher dose, shorter duration — takes advantage of concentration-dependent killing.",
          "Unlike cipro, levo does NOT inhibit CYP1A2. So: tizanidine is safe with levo (CONTRAINDICATED with cipro). Theophylline is safer with levo. Know this distinction — it matters clinically.",
          "Hypoglycemia risk: FDA strengthened warning in 2018. Highest risk in elderly diabetics on sulfonylureas. Some cases resulted in coma. Always check diabetes medication list.",
          "QT prolongation: levo has a stronger QT signal than cipro. Always check the QTc and concomitant meds. If baseline QTc >500ms, avoid.",
        ],
      },
    ],
  },
  {
    id: "cap",
    name: "Community-Acquired Pneumonia",
    icon: "🫁",
    category: "Infectious Disease",
    overview: {
      definition: "Acute infection of the pulmonary parenchyma acquired outside of a hospital or long-term care facility. Classified by severity and treatment setting: outpatient, inpatient (non-ICU), and ICU/severe CAP. The 2019 ATS/IDSA guidelines eliminated the old 'HCAP' category — all pneumonia acquired in the community is now CAP regardless of healthcare exposure.",
      epidemiology: "Leading infectious cause of death in the US. ~1.5 million adults hospitalized annually. Mortality: outpatient <1%, inpatient 5-15%, ICU 20-50%. Incidence increases dramatically with age >65 and comorbidities.",
      keyGuidelines: [
        { name: "ATS/IDSA 2019 CAP Guidelines", detail: "Current definitive guideline. Eliminated HCAP category. Emphasizes severity-based treatment, procalcitonin-guided de-escalation, and steroid role in severe CAP. Replaced the 2007 guidelines." },
        { name: "NICE 2023 Pneumonia Update", detail: "UK guideline — useful perspective on amoxicillin monotherapy and shorter courses. CRB-65 scoring emphasis." },
        { name: "GOLD 2024 (for AECOPD overlap)", detail: "Important for distinguishing CAP from acute exacerbation of COPD with pneumonia — treatment differs." },
        { name: "Surviving Sepsis Campaign 2021", detail: "Relevant for severe CAP with sepsis — 1-hour bundle, lactate-guided resuscitation, vasopressor selection." },
      ],
      landmarkTrials: [
        { name: "CAP-START Trial (2015, NEJM)", detail: "Dutch RCT comparing beta-lactam monotherapy vs. beta-lactam + macrolide vs. respiratory FQ monotherapy for moderate-severe CAP. Non-inferiority for all three strategies at 90-day mortality. KEY TAKEAWAY: Beta-lactam monotherapy may be sufficient for non-ICU inpatients — challenged the dogma of mandatory macrolide addition." },
        { name: "EPIC Study (Jain et al., 2015, NEJM)", detail: "CDC landmark epidemiologic study of hospitalized CAP in the US. Found a pathogen in only 38% of cases. Rhinovirus and influenza were the most common pathogens overall. S. pneumoniae was the most common bacterial pathogen but detected in only 5%. Changed our understanding of CAP etiology." },
        { name: "Postma et al. (2015) — Adjunctive Dexamethasone", detail: "RCT showing dexamethasone 5mg IV × 4 days reduced length of stay by ~1 day in hospitalized CAP. Did NOT reduce mortality. Steroid role remains nuanced — most benefit in severe CAP." },
        { name: "STEP Trial (2023, NEJM)", detail: "3-day vs. 8-day amoxicillin for CAP in hospitalized patients who achieved clinical stability by day 3. 3 days was non-inferior. Landmark for antibiotic stewardship — shortest validated course for inpatient CAP." },
        { name: "Garin et al. (2014, JAMA IM)", detail: "Beta-lactam + macrolide vs. beta-lactam alone for hospitalized non-ICU CAP. Combination was NOT superior for non-severe cases. Supports monotherapy approach from CAP-START." },
        { name: "CAPE COD Trial (2023, NEJM)", detail: "Hydrocortisone 200mg/day × 4 days then tapered for severe CAP. Significantly reduced 28-day mortality (6.2% vs. 11.9%). Practice-changing for severe/ICU CAP. NNT = 18." },
      ],
      riskFactors: "Age >65, smoking, COPD, asthma, diabetes, heart failure, chronic liver/renal disease, immunosuppression, alcohol use disorder, recent viral URI, poor dental hygiene, dysphagia/aspiration risk, PPI use (controversial but epidemiologically associated).",
    },
    subcategories: [
      {
        id: "cap-outpatient-healthy",
        name: "Outpatient CAP — No Comorbidities",
        definition: "CAP in a previously healthy outpatient with no significant comorbidities, no recent antibiotic use (past 90 days), and no risk factors for drug-resistant pathogens. These patients can be safely treated at home with oral monotherapy.",
        clinicalPresentation: "Cough (productive or dry), fever, pleuritic chest pain, dyspnea, tachypnea. Physical exam: focal crackles/rales, dullness to percussion, bronchial breath sounds, egophony. Mild cases may have subtle findings.",
        diagnostics: "Chest X-ray is recommended to confirm diagnosis (ATS/IDSA). Sputum culture and blood cultures NOT recommended for outpatients. No procalcitonin needed. Assessment with CURB-65 or PSI/PORT score to confirm outpatient appropriateness (CURB-65 score 0-1, PSI class I-II).",
        empiricTherapy: [
          {
            line: "First-Line (Pick ONE — Monotherapy)",
            options: [
              { drug: "amoxicillin", regimen: "Amoxicillin 1g PO TID × 5 days", notes: "ATS/IDSA 2019 first-line. HIGH-DOSE (1g, not 500mg) targets intermediate-resistant S. pneumoniae. Excellent safety profile. STEP trial supports even 3-day courses if rapid clinical improvement." },
              { drug: "doxycycline", regimen: "Doxycycline 100mg PO BID × 5 days", notes: "Covers typicals AND atypicals (Mycoplasma, Chlamydophila). Good alternative for penicillin-allergic patients. Avoids azithromycin resistance selection. Well-tolerated." },
              { drug: "azithromycin", regimen: "Azithromycin 500mg PO day 1, then 250mg daily × 4 days (Z-pack)", notes: "Covers atypicals well. HOWEVER: Rising S. pneumoniae macrolide resistance (~30-40% in US) is a concern. ATS/IDSA 2019 only recommends as monotherapy where local pneumococcal macrolide resistance <25%. QT risk. Many ID physicians now prefer doxycycline over azithromycin." },
            ],
          },
        ],
        organismSpecific: [
          { organism: "Streptococcus pneumoniae", preferred: "Amoxicillin 1g TID (high-dose overcomes intermediate resistance)", alternative: "Doxycycline, respiratory FQ", notes: "Most common bacterial cause of CAP. PCV13/PCV20 vaccine has reduced invasive disease but not eliminated it. Drug-resistant S. pneumoniae (DRSP): penicillin intermediate resistance ~20-30%, macrolide resistance ~30-40%. High-dose amoxicillin achieves PK/PD targets for intermediately resistant isolates." },
          { organism: "Mycoplasma pneumoniae", preferred: "Doxycycline 100mg BID or Azithromycin", alternative: "Respiratory FQ (levofloxacin, moxifloxacin)", notes: "Most common cause of 'atypical' CAP. Walking pneumonia. Younger adults (5-40 years). Can cause bullous myringitis, rash, cold agglutinins. Usually self-limited but antibiotics shorten duration. Macrolide-resistant Mycoplasma emerging (~10-15% in US, >80% in parts of Asia) — doxycycline unaffected by this resistance." },
          { organism: "Chlamydophila pneumoniae", preferred: "Doxycycline or Azithromycin", alternative: "Respiratory FQ", notes: "Often indistinguishable from Mycoplasma clinically. Can cause laryngitis (hoarseness is a clue). Prolonged cough. Usually mild." },
          { organism: "Respiratory viruses (Influenza, SARS-CoV-2, RSV)", preferred: "Oseltamivir (influenza), Paxlovid (COVID-19)", alternative: "Supportive care", notes: "EPIC study showed viruses are the most common CAP pathogens overall. Always consider influenza in season — early oseltamivir (within 48h, ideally 24h) reduces complications. COVID-19: follow current NIH guidelines. RSV: no specific approved antiviral for adults as of early 2025, but nirsevimab for infants." },
          { organism: "Haemophilus influenzae", preferred: "Amoxicillin-clavulanate, doxycycline", alternative: "Respiratory FQ, cephalosporins", notes: "Non-typeable H. influenzae is common in COPD patients. ~30-40% produce beta-lactamase → amoxicillin alone may fail. Amox-clav or doxycycline covers this. Ceftriaxone is reliable." },
        ],
        pearls: [
          "Amoxicillin 1g TID — the dose matters. Standard 500mg TID does NOT achieve adequate PK/PD targets for intermediately resistant S. pneumoniae. Always use the high dose.",
          "Doxycycline is the underappreciated gem for outpatient CAP: covers typicals + atypicals, no QT prolongation, no macrolide resistance selection, and it's cheap. Many ID physicians now prefer it over azithromycin.",
          "The Z-pack (azithromycin) is massively overprescribed. With ~30-40% macrolide resistance in S. pneumoniae, it's becoming unreliable as monotherapy. If you use it, make sure local resistance data supports it.",
          "Duration: ATS/IDSA recommends minimum 5 days, with the caveat that the patient should be clinically stable for 48-72h before stopping. The STEP trial validates even shorter (3-day) courses for patients who stabilize rapidly.",
          "CURB-65 score: Confusion, Uremia (BUN >19), Respiratory rate ≥30, Blood pressure (SBP <90 or DBP ≤60), Age ≥65. Score 0-1 = outpatient. 2 = consider admission. ≥3 = inpatient. Simple, bedside, no labs needed (CRB-65 drops the U).",
          "Always ask about influenza exposure and symptoms during flu season. If influenza CAP is suspected, add oseltamivir regardless of presentation timing — late treatment still reduces complications in severe cases.",
        ],
      },
      {
        id: "cap-outpatient-comorbid",
        name: "Outpatient CAP — With Comorbidities",
        definition: "CAP in outpatients with significant comorbidities (COPD, diabetes, chronic heart/liver/renal disease, alcoholism, malignancy, asplenia) OR recent antibiotic use within 90 days. These patients need broader empiric coverage.",
        clinicalPresentation: "Same as above, but comorbidities may blunt typical presentation. Elderly/diabetic patients may present without fever. COPD patients may be difficult to distinguish from AECOPD. Heart failure patients may mimic pneumonia with pulmonary edema.",
        diagnostics: "Chest X-ray recommended. Consider procalcitonin to help differentiate bacterial CAP from viral/AECOPD (PCT >0.25 supports bacterial). Sputum culture not routinely needed for outpatients. Calculate CURB-65/PSI to confirm outpatient safety.",
        empiricTherapy: [
          {
            line: "First-Line (Combination Therapy)",
            options: [
              { drug: "amox-clav-combo", regimen: "Amoxicillin-Clavulanate 875/125mg PO BID + Azithromycin 500mg day 1 then 250mg × 4 days", notes: "OR Amox-clav + Doxycycline 100mg BID. The beta-lactam covers S. pneumoniae, H. influenzae (beta-lactamase producers), M. catarrhalis. Macrolide/doxy adds atypical coverage. Duration: 5 days." },
              { drug: "cephalexin-combo", regimen: "Cephalexin 500mg PO TID (or Cefpodoxime 200mg BID) + Azithromycin or Doxycycline", notes: "Alternative beta-lactam backbone. Cefpodoxime preferred over cephalexin for broader gram-negative coverage." },
            ],
          },
          {
            line: "Second-Line (Monotherapy — Respiratory Fluoroquinolone)",
            options: [
              { drug: "levofloxacin", regimen: "Levofloxacin 750mg PO daily × 5 days", notes: "Respiratory FQ covers typicals + atypicals in one agent. Reserve as second-line per ATS/IDSA due to FDA boxed warnings and collateral damage. Appropriate when beta-lactam allergy is severe or combination therapy not feasible." },
              { drug: "moxifloxacin", regimen: "Moxifloxacin 400mg PO daily × 5 days", notes: "Best anti-pneumococcal FQ. Excellent bioavailability. NO Pseudomonas activity (unlike levo). Higher QT risk than levofloxacin. No renal adjustment needed. AVOID if any QT concern." },
            ],
          },
        ],
        organismSpecific: [
          { organism: "S. pneumoniae (DRSP risk higher)", preferred: "Amox-clav (high-dose amoxicillin component), respiratory FQ", alternative: "Ceftriaxone IM/IV single dose + oral step-down", notes: "Recent antibiotics select for resistant pneumococci. Prior beta-lactam → consider FQ. Prior FQ → use beta-lactam + macrolide. Don't repeat the same class within 90 days." },
          { organism: "H. influenzae (beta-lactamase producer)", preferred: "Amox-clav, cefpodoxime, doxycycline", alternative: "Respiratory FQ", notes: "Beta-lactamase production: ~30-40%. Amoxicillin alone insufficient. Clavulanate or cephalosporin overcomes this." },
          { organism: "Moraxella catarrhalis", preferred: "Amox-clav, cephalosporins, macrolides", alternative: "Doxycycline, respiratory FQ", notes: "Nearly 100% beta-lactamase positive — amoxicillin alone WILL fail. Common in COPD patients. Usually self-limited but can cause severe disease in immunocompromised." },
          { organism: "S. aureus (MSSA post-influenza)", preferred: "Amox-clav, cephalexin (MSSA)", alternative: "TMP-SMX + beta-lactam if MRSA concern", notes: "Post-influenza staphylococcal pneumonia is a classic lethal combination. Rapidly progressive, necrotizing. If suspected, treat aggressively — don't wait for cultures. Consider MRSA coverage (vancomycin or linezolid) if risk factors present." },
        ],
        pearls: [
          "The 90-day antibiotic rule: If the patient received ANY antibiotic in the past 90 days, use a different class for CAP. Beta-lactam recently? Use respiratory FQ. FQ recently? Use beta-lactam + macrolide. This reduces treatment failure from resistant organisms.",
          "Moxifloxacin vs. Levofloxacin: Moxi has better pneumococcal activity and no renal dosing needed. Levo has Pseudomonas coverage (moxi does NOT). Moxi has higher QT risk. Choose based on patient factors.",
          "Don't forget to vaccinate: PCV20 (Prevnar 20) for all adults ≥65 or at high risk. This is a pharmacist-driven intervention that prevents the disease you're treating.",
          "Procalcitonin <0.25: consider viral etiology or non-infectious cause. Can help you withhold antibiotics or stop them early. Not perfect but a useful stewardship tool.",
          "COPD + CAP: The organism profile shifts — H. influenzae and M. catarrhalis become more common. Amox-clav is a strong choice here because it handles all three common pathogens (pneumococcus, H. flu, Moraxella).",
        ],
      },
      {
        id: "cap-inpatient",
        name: "Inpatient CAP (Non-ICU)",
        definition: "CAP requiring hospital admission but NOT ICU-level care. CURB-65 ≥2 or PSI class III-IV. Patients who are hypoxic, tachypneic, confused, or have significant comorbidity exacerbation warranting admission.",
        clinicalPresentation: "Moderate-severe symptoms: high fever, productive cough, dyspnea, tachypnea (RR ≥22-30), hypoxia (SpO2 <94% on room air), dehydration, confusion (especially elderly). May have multilobar infiltrates on CXR.",
        diagnostics: "Chest X-ray (REQUIRED). Blood cultures × 2 BEFORE antibiotics (ATS/IDSA recommends for inpatients). Sputum culture (if quality specimen obtainable). Procalcitonin (baseline — helps guide de-escalation). Legionella urinary antigen and pneumococcal urinary antigen if severity warrants. Consider respiratory viral panel (especially flu season). Lactate if sepsis suspected.",
        empiricTherapy: [
          {
            line: "First-Line (Combination — Preferred by ATS/IDSA)",
            options: [
              { drug: "ceftriaxone", regimen: "Ceftriaxone 1-2g IV daily + Azithromycin 500mg IV/PO daily", notes: "The classic inpatient CAP regimen. Beta-lactam covers typicals; macrolide adds atypical coverage + immunomodulatory effects. ATS/IDSA 2019 preferred combination. Note: CAP-START suggests beta-lactam monotherapy may suffice — but most US institutions still use combination." },
              { drug: "ampicillin-sulbactam", regimen: "Ampicillin-Sulbactam 3g IV q6h + Azithromycin 500mg IV/PO daily", notes: "Alternative beta-lactam backbone. Better anaerobic coverage than ceftriaxone (relevant if aspiration component suspected). Covers H. influenzae and M. catarrhalis beta-lactamase producers." },
              { drug: "ceftriaxone-doxy", regimen: "Ceftriaxone 1-2g IV daily + Doxycycline 100mg PO/IV BID", notes: "Doxycycline substitution for macrolide-intolerant patients (QT concern, azithromycin allergy). Equally effective for atypical coverage." },
            ],
          },
          {
            line: "Second-Line (Monotherapy — Respiratory FQ)",
            options: [
              { drug: "levofloxacin", regimen: "Levofloxacin 750mg IV/PO daily", notes: "Monotherapy alternative. Covers typicals + atypicals in one drug. 100% oral bioavailability — switch to PO as soon as patient can swallow. Reserve for beta-lactam allergy or when combination therapy not feasible." },
              { drug: "moxifloxacin", regimen: "Moxifloxacin 400mg IV/PO daily", notes: "Superior pneumococcal activity vs. levo. NO Pseudomonal coverage. Higher QT prolongation risk. No IV-to-PO dose change needed. No renal adjustment." },
            ],
          },
        ],
        organismSpecific: [
          { organism: "S. pneumoniae (still #1 bacterial cause)", preferred: "Ceftriaxone, ampicillin (high-dose), respiratory FQ", alternative: "Vancomycin (only if highly resistant — rare in US)", notes: "Even with PCV13/20, still the most common identified bacterial cause of CAP. Penicillin 'resistance' in pneumonia is defined differently than meningitis — MIC breakpoint for IV penicillin in non-meningitis is ≤2 (vs ≤0.06 for meningitis). Most 'resistant' isolates are treatable with ceftriaxone or high-dose ampicillin." },
          { organism: "Legionella pneumophila", preferred: "Azithromycin 500mg daily or Levofloxacin 750mg daily", alternative: "Doxycycline (less data but reasonable)", notes: "Classic presentation: high fever, GI symptoms (diarrhea), hyponatremia, elevated LFTs, relative bradycardia. Urinary antigen only detects serogroup 1 (~70% of disease). Culture on BCYE agar is gold standard but rarely done. Outbreaks linked to water systems." },
          { organism: "Mycoplasma pneumoniae", preferred: "Azithromycin, Doxycycline", alternative: "Respiratory FQ", notes: "Less common cause of hospitalized CAP (more outpatient). When severe enough to hospitalize, doxycycline may be preferred over azithromycin given rising macrolide resistance. Extrapulmonary manifestations: encephalitis, hemolytic anemia, Stevens-Johnson Syndrome, cardiac." },
          { organism: "Influenza A/B", preferred: "Oseltamivir 75mg PO BID × 5 days", alternative: "Baloxavir (single dose — useful for adherence, but less data in hospitalized severe influenza)", notes: "Treat ALL hospitalized influenza patients regardless of symptom duration. Even >48h from onset, oseltamivir reduces mortality in hospitalized patients. Always add bacterial CAP coverage if concurrent bacterial pneumonia suspected (influenza + S. aureus or S. pneumoniae is a deadly combination)." },
          { organism: "MRSA (if risk factors present)", preferred: "Vancomycin (trough 15-20 or AUC/MIC 400-600) or Linezolid 600mg PO/IV BID", alternative: "TMP-SMX (for mild cases, oral step-down)", notes: "ATS/IDSA 2019: Only add MRSA coverage if risk factors present (prior MRSA colonization/infection, IV drug use, recent influenza, empyema/cavitation on imaging). Do NOT add empirically for all CAP. Nasal MRSA swab has excellent negative predictive value (~95%) — if negative, safely de-escalate." },
          { organism: "Pseudomonas aeruginosa (if risk factors present)", preferred: "Pip-tazo, cefepime, meropenem (IV) + Ciprofloxacin or Levofloxacin (if susceptible)", alternative: "Double-cover pending susceptibilities", notes: "ATS/IDSA 2019: Only add Pseudomonas coverage if VALIDATED risk factors: structural lung disease (bronchiectasis, CF), prior Pseudomonas respiratory cultures, very severe immunosuppression. Prior hospitalization alone is NOT sufficient — this was the key change from old HCAP guidelines." },
        ],
        pearls: [
          "CAP-START changed the game: For non-ICU inpatient CAP, beta-lactam monotherapy was non-inferior to beta-lactam + macrolide and to respiratory FQ monotherapy. Many stewardship programs now support ceftriaxone monotherapy for non-severe CAP without Legionella risk factors. The macrolide adds most value when Legionella is a concern.",
          "The macrolide immunomodulatory effect: Beyond atypical coverage, azithromycin has anti-inflammatory properties that may improve outcomes in severe CAP (reduced IL-6, IL-8). This is why many clinicians still add it even when atypical coverage isn't needed. The data is strongest for severe/bacteremic pneumococcal CAP.",
          "IV-to-PO switch: Both levofloxacin and azithromycin have excellent oral bioavailability. Switch to PO as soon as the patient can swallow and is not vomiting. This is a pharmacist-driven intervention that reduces line infections and LOS.",
          "Nasal MRSA swab: Negative predictive value ~95% for MRSA pneumonia. If the swab is negative, you can safely stop vancomycin/linezolid. Champion this at your institution — it's one of the highest-impact stewardship tools.",
          "Procalcitonin-guided de-escalation: If PCT <0.25 or drops by >80%, consider stopping antibiotics. Multiple RCTs support this approach for reducing antibiotic duration without increasing mortality. Pharmacists should actively engage with PCT trending.",
          "Blood cultures: ATS/IDSA recommends for all inpatients. Positivity rate is only 5-14%, but when positive, it changes management significantly (organism identification, targeted therapy, ID consult trigger).",
          "Don't forget the vaccinations before discharge: PCV20 and annual influenza vaccine. Pharmacist-driven immunization at discharge is evidence-based and is a CMS quality measure.",
        ],
      },
      {
        id: "cap-icu",
        name: "Severe CAP / ICU Admission",
        definition: "CAP requiring ICU admission. ATS/IDSA defines severe CAP by meeting ≥1 major criterion (mechanical ventilation or vasopressor-dependent septic shock) OR ≥3 minor criteria (RR ≥30, PaO2/FiO2 ≤250, multilobar infiltrates, confusion, BUN ≥20, WBC <4000, platelets <100K, hypothermia <36°C, hypotension requiring aggressive fluids).",
        clinicalPresentation: "Respiratory failure, septic shock, multilobar/bilateral infiltrates, rapidly progressive disease. May present with ARDS. High mortality — 20-50% depending on severity and organism.",
        diagnostics: "Full workup: blood cultures × 2, sputum culture (intubated: BAL or mini-BAL preferred), Legionella urinary antigen, pneumococcal urinary antigen, respiratory viral panel (including COVID-19), procalcitonin, lactate, CBC with differential, CMP, ABG. Consider CT chest if CXR unclear or complications suspected (empyema, abscess, PE). Consider bronchoscopy if not improving.",
        empiricTherapy: [
          {
            line: "First-Line (ALWAYS Combination for Severe CAP)",
            options: [
              { drug: "ceftriaxone", regimen: "Ceftriaxone 2g IV daily + Azithromycin 500mg IV daily", notes: "ATS/IDSA standard for severe CAP. The macrolide is STRONGLY recommended here (not optional like non-ICU). Macrolide immunomodulatory effect is most impactful in severe/bacteremic disease. Duration: minimum 5 days, typically 7 days." },
              { drug: "ceftriaxone-fq", regimen: "Ceftriaxone 2g IV daily + Levofloxacin 750mg IV daily", notes: "Alternative combination if macrolide cannot be used (QT prolongation, allergy). Note: combining ceftriaxone + FQ gives broader coverage but loses the macrolide immunomodulatory benefit." },
              { drug: "amp-sulbactam-combo", regimen: "Ampicillin-sulbactam 3g IV q6h + Azithromycin 500mg IV daily", notes: "Alternative beta-lactam backbone with better anaerobic coverage. Useful if aspiration component suspected in ICU CAP." },
            ],
          },
          {
            line: "Add-On for MRSA Risk Factors",
            options: [
              { drug: "vancomycin", regimen: "Vancomycin IV (AUC/MIC-guided dosing, target AUC 400-600)", notes: "Add if: prior MRSA infection/colonization, IVDU, post-influenza necrotizing pneumonia, cavitation/empyema. Check nasal MRSA swab — if negative, de-escalate within 48h. AUC-guided dosing is now preferred over trough-based (2020 vancomycin consensus guidelines)." },
              { drug: "linezolid", regimen: "Linezolid 600mg IV/PO BID", notes: "Alternative to vancomycin for MRSA pneumonia. Some data suggests better lung penetration. 100% oral bioavailability. Myelosuppression risk with courses >14 days. Monitor CBC weekly. Serotonin syndrome risk with SSRIs/MAOIs." },
            ],
          },
          {
            line: "Add-On for Pseudomonas Risk Factors",
            options: [
              { drug: "pip-tazo", regimen: "Piperacillin-tazobactam 4.5g IV q6h (extended infusion over 4h)", notes: "Replace ceftriaxone with pip-tazo + azithromycin or FQ. Extended infusion critical for optimizing time above MIC. Consider adding an aminoglycoside or anti-pseudomonal FQ for double coverage in critically ill." },
              { drug: "cefepime", regimen: "Cefepime 2g IV q8h (extended infusion)", notes: "Alternative anti-pseudomonal beta-lactam. Also covers SPACE organisms (AmpC producers) — better than ceftriaxone for Enterobacter, Citrobacter, Serratia." },
              { drug: "meropenem", regimen: "Meropenem 1-2g IV q8h (extended infusion over 3h)", notes: "Reserve for severe septic shock, ESBL/MDR risk, or failure of other agents. Always de-escalate aggressively once cultures return. Extended infusion is standard of care in the ICU." },
            ],
          },
          {
            line: "Adjunctive Therapy",
            options: [
              { drug: "corticosteroids", regimen: "Hydrocortisone 200mg IV daily (50mg q6h) × 4-7 days, then taper", notes: "CAPE COD Trial (2023): Hydrocortisone reduced 28-day mortality in severe CAP (6.2% vs 11.9%, NNT=18). Practice-changing. ATS/IDSA 2019 conditionally recommends for refractory septic shock. Now extending to all severe CAP based on CAPE COD. Avoid in influenza pneumonia (worsens outcomes) and suspected fungal infection." },
              { drug: "oseltamivir", regimen: "Oseltamivir 75mg PO BID × 5 days (or longer if immunocompromised)", notes: "Add empirically during influenza season for all ICU CAP until influenza is ruled out. Even if >48h from symptom onset, treat in severe/hospitalized cases." },
            ],
          },
        ],
        organismSpecific: [
          { organism: "S. pneumoniae (bacteremic)", preferred: "Ceftriaxone + Azithromycin (dual therapy reduces mortality in bacteremic pneumococcal CAP per observational data)", alternative: "Respiratory FQ + beta-lactam", notes: "Baddour et al. and Martinez et al. observational studies showed mortality benefit of combination therapy (beta-lactam + macrolide) over monotherapy in bacteremic pneumococcal CAP. The macrolide immunomodulatory effect appears to be the key — not just the antimicrobial coverage." },
          { organism: "Legionella (severe)", preferred: "Levofloxacin 750mg IV daily (preferred in severe) or Azithromycin 500mg IV daily", alternative: "Combination of both for severe Legionella", notes: "FQ may be preferred in severe Legionella due to intracellular killing kinetics. Legionella is the second most common identified cause of severe CAP in some series. Hyponatremia + diarrhea + high fever in a severely ill patient = think Legionella until proven otherwise." },
          { organism: "PVL+ MRSA (necrotizing)", preferred: "Vancomycin + Linezolid (some experts use both for toxin suppression) + Clindamycin (toxin suppression)", alternative: "Linezolid preferred over vancomycin (suppresses PVL toxin production at ribosomal level)", notes: "PVL-positive (Panton-Valentine Leukocidin) MRSA causes rapidly necrotizing, cavitary pneumonia with extremely high mortality. Often post-influenza in young, previously healthy adults. Clindamycin or linezolid suppress toxin production (ribosomal inhibitors). Vancomycin does NOT suppress toxin production — this is a critical distinction." },
          { organism: "Pseudomonas aeruginosa", preferred: "Anti-pseudomonal beta-lactam (pip-tazo, cefepime, meropenem) + anti-pseudomonal FQ or aminoglycoside", alternative: "Monotherapy after susceptibilities confirmed and clinical improvement", notes: "Double coverage recommended empirically in septic shock pending susceptibilities. De-escalate to monotherapy once susceptibilities confirm sensitivity. Cipro has better anti-pseudomonal activity than levo in vitro." },
        ],
        pearls: [
          "CAPE COD trial is practice-changing: Hydrocortisone for severe CAP reduced 28-day mortality with NNT of 18. This is being rapidly adopted. KEY EXCEPTION: Do NOT give steroids for influenza pneumonia — steroids worsen outcomes in influenza (increased mortality, superinfections).",
          "PVL-MRSA pneumonia: Think about this when you see a previously healthy young person with rapidly necrotizing pneumonia, especially post-influenza. Toxin suppression is the key — use linezolid or clindamycin (ribosomal inhibitors), not just vancomycin. Some experts add clindamycin to vancomycin specifically for toxin suppression.",
          "Extended infusion beta-lactams in ICU: This is mandatory stewardship at this severity level. Pip-tazo over 4h, cefepime over 3-4h, meropenem over 3h. Monte Carlo simulations show dramatically improved PTA (probability of target attainment). Push for this as a pharmacy protocol.",
          "Day 1 matters: In septic shock, every hour of delayed appropriate antibiotics increases mortality by ~7.6% (Kumar et al., 2006). Ensure antibiotics are administered within 1 hour of recognition. This is a pharmacist operational responsibility — have them available, mixed, and ready.",
          "De-escalation is as important as escalation: Once cultures return (48-72h), aggressively narrow therapy. If MRSA swab negative → stop vancomycin. If Pseudomonas cultures negative and no risk factors → step down from pip-tazo to ceftriaxone. Stewardship in the ICU has the biggest impact.",
          "ARDS from CAP: Lung-protective ventilation (6 mL/kg IBW) is the cornerstone. Prone positioning for P/F <150. Neither is a pharmacy intervention directly, but understanding the pathophysiology helps with drug dosing (increased Vd in ARDS, altered PK for many drugs).",
        ],
      },
      {
        id: "aspiration-pneumonia",
        name: "Aspiration Pneumonia",
        definition: "Pneumonia resulting from aspiration of oropharyngeal or gastric contents into the lower respiratory tract. Distinguished from aspiration pneumonitis (chemical inflammation without infection). True aspiration pneumonia involves bacterial infection and typically occurs in patients with impaired swallowing, altered consciousness, or impaired cough reflex.",
        clinicalPresentation: "Often insidious onset. Fever, cough, purulent sputum, dyspnea. Classic: dependent lung segments affected (right lower lobe if upright, posterior segments of upper lobes or superior segments of lower lobes if supine). May present with lung abscess or empyema if delayed diagnosis. Risk factors: stroke, dementia, intubation, alcoholism, GERD, poor dentition, procedural sedation.",
        diagnostics: "CXR showing infiltrate in dependent lung segments. Blood cultures if febrile/systemic signs. Sputum culture (often polymicrobial). CT chest if abscess or empyema suspected. Distinguish from aspiration pneumonitis: pneumonitis occurs within hours of witnessed aspiration, is chemical/inflammatory, and typically resolves within 24-48h WITHOUT antibiotics.",
        empiricTherapy: [
          {
            line: "First-Line (Community-Acquired Aspiration)",
            options: [
              { drug: "amp-sulbactam-asp", regimen: "Ampicillin-sulbactam 3g IV q6h", notes: "Excellent choice — covers streptococci, oral anaerobes, H. influenzae, and gram-negatives. The gold standard for aspiration pneumonia. Good anaerobic coverage without being overly broad." },
              { drug: "amox-clav-asp", regimen: "Amoxicillin-clavulanate 875/125mg PO BID (if outpatient/mild)", notes: "Oral equivalent for mild aspiration pneumonia that can be treated outpatient. Same spectrum as IV amp-sulbactam. Duration: 5-7 days." },
            ],
          },
          {
            line: "Alternatives",
            options: [
              { drug: "ceftriaxone-metro", regimen: "Ceftriaxone 1-2g IV daily + Metronidazole 500mg IV q8h", notes: "If amp-sulbactam unavailable. Ceftriaxone handles gram-negatives and streptococci; metronidazole adds anaerobic coverage. Note: the role of anaerobic coverage is debated — some experts argue it's unnecessary for most community-acquired aspiration." },
              { drug: "clindamycin", regimen: "Clindamycin 600mg IV q8h (or 300-450mg PO QID)", notes: "Traditional aspiration pneumonia drug — excellent anaerobic and streptococcal coverage. Fallen somewhat out of favor due to high C. diff risk. Still useful for penicillin-allergic patients or lung abscess." },
              { drug: "moxifloxacin-asp", regimen: "Moxifloxacin 400mg IV/PO daily", notes: "Covers typicals, atypicals, AND has moderate anaerobic activity (unique among FQs). Can be used as monotherapy for mild-moderate aspiration pneumonia. No Pseudomonas coverage." },
            ],
          },
          {
            line: "Lung Abscess / Empyema",
            options: [
              { drug: "prolonged-course", regimen: "Amp-sulbactam or clindamycin × 4-6 weeks minimum for lung abscess", notes: "Lung abscess requires prolonged therapy — typically until radiographic resolution or significant improvement. Some abscesses >6cm may require percutaneous drainage or surgical intervention. Empyema requires chest tube drainage ± fibrinolytics (tPA + DNase per MIST2 trial) + antibiotics." },
            ],
          },
        ],
        organismSpecific: [
          { organism: "Mixed oral flora (Streptococcus spp. + anaerobes)", preferred: "Amp-sulbactam, amox-clav", alternative: "Clindamycin, moxifloxacin", notes: "The traditional teaching of 'aspiration = anaerobes' has been challenged. Modern studies using molecular diagnostics show that streptococci (viridans group, S. intermedius/anginosus group) are actually the dominant pathogens. Anaerobes play a supporting role, especially in abscess formation." },
          { organism: "S. anginosus/intermedius/constellatus group (milleri group)", preferred: "Ampicillin, amox-clav, penicillin", alternative: "Ceftriaxone, clindamycin", notes: "These are the streptococci most associated with abscess formation anywhere in the body — lung, brain, liver. Very common in aspiration pneumonia complicated by abscess. Usually penicillin-susceptible. If you see a lung abscess, think milleri group." },
          { organism: "Gram-negative rods (Klebsiella, E. coli — if healthcare-associated)", preferred: "Ceftriaxone, pip-tazo", alternative: "Meropenem if MDR risk", notes: "Healthcare-associated aspiration (nursing home, recent hospitalization) shifts the flora toward gram-negative rods. Empiric coverage should be broader. Consider local antibiogram." },
        ],
        pearls: [
          "Aspiration pneumonitis ≠ aspiration pneumonia. Pneumonitis is a chemical inflammation from gastric acid — it occurs within hours, causes bilateral infiltrates, and typically resolves in 24-48h WITHOUT antibiotics. DO NOT reflexively start antibiotics for witnessed aspiration in the OR or intubation — observe and only treat if fever/infiltrate persists >48h.",
          "The 'anaerobe dogma' is being dismantled: Modern molecular studies show that streptococci (especially the anginosus/milleri group) are the primary pathogens in aspiration pneumonia, not anaerobes. Anaerobes play a role in abscess formation and empyema but may not be necessary to cover in simple aspiration pneumonia. This is why ceftriaxone alone sometimes works.",
          "Metronidazole monotherapy does NOT work for aspiration pneumonia — it misses the streptococci and aerobic gram-negatives that are actually the dominant pathogens. Never use metronidazole alone; always combine with a cephalosporin or similar.",
          "Clindamycin: Once the drug of choice for aspiration pneumonia and lung abscess. Still effective but high C. diff rate (~10-15%) has pushed it to second-line. Amp-sulbactam has comparable efficacy with less C. diff risk.",
          "Poor dentition is the modifiable risk factor that gets overlooked. Dental care reduces aspiration pneumonia risk in elderly and institutionalized patients. Advocate for oral care protocols in your institution — chlorhexidine oral care reduces ventilator-associated pneumonia by ~40%.",
          "Lung abscess duration: Unlike most pneumonias, lung abscess requires extended treatment — typically 3-6 weeks or until radiographic improvement. Patients often need outpatient IV antibiotics (OPAT) or prolonged oral therapy (amox-clav or clindamycin). Plan for this at discharge.",
        ],
      },
    ],
    drugMonographs: [
      {
        id: "amoxicillin",
        name: "Amoxicillin",
        brandNames: "Amoxil, Trimox, Moxatag (ER)",
        drugClass: "Aminopenicillin (beta-lactam)",
        mechanismOfAction: "Inhibits penicillin-binding proteins (PBPs), primarily PBP-1a, 1b, 2, and 3, disrupting peptidoglycan cross-linking in the bacterial cell wall. Bactericidal. Time-dependent killing (T>MIC drives efficacy).",
        spectrum: "Excellent: Streptococcus pneumoniae (including intermediate-resistant at high doses), Group A and B Strep, Enterococcus faecalis, Listeria, H. influenzae (non-beta-lactamase producing ~60-70%). Moderate: E. coli (variable, ~50-60% susceptible). GAPS: MRSA, beta-lactamase producing organisms (H. flu, M. catarrhalis, many gram-negatives), Pseudomonas, Mycoplasma, Legionella.",
        dosing: {
          standard: "500mg PO TID or 875mg PO BID",
          cap_high_dose: "1g PO TID (HIGH-DOSE for CAP per ATS/IDSA 2019 — targets intermediate-resistant S. pneumoniae)",
          aom: "80-90 mg/kg/day divided BID (pediatric acute otitis media — high-dose)",
          endocarditis_prophylaxis: "2g PO × 1 dose, 30-60 min before procedure",
          helicobacter: "1g PO BID (as part of triple/quadruple therapy)",
        },
        renalAdjustment: "GFR 10-30: 250-500mg q12h. GFR <10: 250-500mg q24h. Hemodialysis: dose after HD (removed by dialysis). For high-dose CAP regimen, reduce frequency proportionally.",
        hepaticAdjustment: "No adjustment needed. Primarily renally eliminated.",
        adverseEffects: {
          common: "Diarrhea (~5-10%), nausea, rash (maculopapular — important: distinguish from true allergy)",
          serious: "Anaphylaxis (rare, ~0.01-0.05%), C. difficile, seizures at very high IV doses (penicillin class effect), interstitial nephritis (rare)",
          rare: "Serum sickness-like reaction (especially in children), hepatitis, crystalluria at very high doses",
        },
        drugInteractions: [
          "Methotrexate — reduced renal tubular secretion → increased MTX levels. Monitor closely.",
          "Warfarin — rare reports of increased INR. Monitor if initiating amoxicillin in a patient on warfarin.",
          "Allopurinol — increased incidence of maculopapular rash (not true allergy — benign but alarming). Counsel patients.",
          "Oral contraceptives — historically cited interaction is largely mythical. No dose adjustment needed, but counsel to use backup method during acute GI illness (diarrhea reduces absorption of OCP, not the antibiotic interaction itself).",
          "Probenecid — blocks renal tubular secretion of amoxicillin → increased levels/duration. Actually therapeutically used in some settings.",
        ],
        monitoring: "Short courses: none routinely needed. Prolonged courses (endocarditis): CBC, BMP, LFTs periodically. Monitor for rash (distinguish maculopapular 'amoxicillin rash' from urticarial true allergy).",
        pregnancyLactation: "Category B. Safe in all trimesters. One of the most commonly used antibiotics in pregnancy. Compatible with breastfeeding — small amounts in breast milk but not clinically significant.",
        pharmacistPearls: [
          "High-dose amoxicillin for CAP: The 1g TID dosing is critical for pneumonia. Standard 500mg TID does NOT achieve the PK/PD target (T>MIC >50%) for intermediately resistant S. pneumoniae (MIC 2-4). This is the single most important dosing pearl for outpatient CAP.",
          "The 'amoxicillin rash' in mononucleosis: ~70-100% of patients with EBV mono develop a maculopapular (NOT urticarial) rash when given amoxicillin/ampicillin. This is NOT a true penicillin allergy and does NOT predict future penicillin reactions. Do NOT label these patients as penicillin-allergic — this leads to years of unnecessary broad-spectrum antibiotic use.",
          "Amoxicillin has ~80-90% oral bioavailability (much better than ampicillin ~50%). This is why amoxicillin replaced ampicillin for oral therapy. The IV equivalent is ampicillin, not 'IV amoxicillin' (which doesn't exist in the US).",
          "Suspension stability: Reconstituted amoxicillin suspension is stable for 14 days refrigerated. Always label with expiration date. Unused portion should be discarded — patients often save it.",
          "For H. pylori regimens: Amoxicillin is not affected by the clarithromycin resistance that plagues triple therapy. In areas with high clarithromycin resistance, bismuth quadruple therapy (with amoxicillin) is preferred.",
          "Penicillin allergy de-labeling: ~90% of patients labeled 'penicillin-allergic' are NOT truly allergic on testing. Pharmacist-driven penicillin allergy assessment and de-labeling programs improve patient outcomes and reduce broad-spectrum antibiotic use. Champion this.",
        ],
      },
      {
        id: "azithromycin",
        name: "Azithromycin",
        brandNames: "Zithromax, Z-pack, Zmax (ER)",
        drugClass: "Macrolide (azalide subclass — 15-membered ring)",
        mechanismOfAction: "Binds to the 50S ribosomal subunit (23S rRNA), inhibiting translocation of peptidyl-tRNA. Bacteriostatic at standard concentrations (can be bactericidal at high concentrations for certain organisms). Unique azalide structure gives it exceptional tissue penetration and long half-life.",
        spectrum: "Gram-positive: S. pneumoniae (BUT 30-40% resistance in US), Group A Strep (alternative for penicillin allergy), S. aureus (limited, not reliable for serious infections). Atypicals: Mycoplasma, Chlamydophila, Legionella (excellent). Others: H. influenzae (moderate), M. catarrhalis, Bordetella pertussis, NTM (MAC — in combination). GAPS: MRSA, Enterococcus, most Enterobacterales, Pseudomonas, anaerobes.",
        dosing: {
          cap: "500mg PO day 1, then 250mg daily × 4 days (Z-pack) — OR 500mg PO/IV daily × 3 days for inpatient",
          iv_cap: "500mg IV daily (for inpatient CAP as part of combination therapy)",
          mac_prophylaxis: "1200mg PO weekly (HIV, CD4 <50 — largely replaced by effective ART)",
          pertussis: "500mg day 1, then 250mg × 4 days",
          traveler_diarrhea: "1000mg PO × 1 dose (or 500mg daily × 3 days)",
          chlamydia: "1g PO × 1 dose (being replaced by doxycycline 100mg BID × 7d per updated CDC STI guidelines)",
        },
        renalAdjustment: "No adjustment needed — hepatically metabolized, biliary excretion. Safe in renal impairment.",
        hepaticAdjustment: "Use with caution in severe hepatic disease. Rare but potentially fatal hepatotoxicity reported (cholestatic hepatitis). Avoid if prior azithromycin-induced hepatitis.",
        adverseEffects: {
          common: "Diarrhea (~5%), nausea, abdominal pain, headache",
          serious: "QT prolongation / Torsades de Pointes (FDA safety communication 2013 — increased risk of cardiovascular death in patients with baseline QT prolongation or risk factors), hepatotoxicity (cholestatic, can be severe), C. difficile",
          rare: "Hearing loss (high-dose, prolonged use — usually reversible), myasthenia gravis exacerbation, interstitial nephritis",
        },
        drugInteractions: [
          "QT-prolonging drugs — ADDITIVE risk. Avoid with: Class IA/III antiarrhythmics (amiodarone, sotalol, dofetilide), fluoroquinolones, ondansetron, methadone, certain antipsychotics. This is the most clinically important interaction.",
          "Warfarin — enhanced anticoagulant effect (mechanism unclear, possibly gut flora disruption). Monitor INR.",
          "Digoxin — azithromycin can increase digoxin levels by inhibiting P-glycoprotein in the gut and by reducing gut flora that metabolize digoxin. Monitor digoxin levels.",
          "Nelfinavir — significantly increases azithromycin levels. Monitor for toxicity.",
          "NOTABLE ABSENCE: Unlike clarithromycin and erythromycin, azithromycin does NOT significantly inhibit CYP3A4. This makes it far safer with statins, calcineurin inhibitors, and other CYP3A4 substrates. This is a key clinical advantage.",
        ],
        monitoring: "Short courses: clinical response. QTc if patient has risk factors for QT prolongation (baseline ECG if concern). LFTs if symptoms of hepatitis develop. Hearing assessment if prolonged/high-dose use.",
        pregnancyLactation: "Category B. Generally considered safe in pregnancy. Used for chlamydia treatment in pregnancy. Compatible with breastfeeding — low breast milk levels.",
        pharmacistPearls: [
          "The Z-pack is America's most overprescribed antibiotic. ~30-40% of S. pneumoniae in the US are macrolide-resistant (erm(B) and mef(A) genes). Using azithromycin as monotherapy for CAP in areas with high resistance is gambling with the patient's life.",
          "Azithromycin's tissue penetration is its superpower: Tissue concentrations are 10-100× higher than serum levels. This is why a 5-day course works — the drug persists in tissues for 5-7 days after the last dose. The 'Z-pack is too short' criticism misunderstands its pharmacokinetics.",
          "QT prolongation: The 2013 FDA warning was based on the Ray et al. NEJM study showing increased cardiovascular death in azithromycin users. Risk is highest in patients with: baseline prolonged QT, hypokalemia, hypomagnesemia, bradycardia, or concomitant QT-prolonging drugs. Always check the QTc and K/Mg.",
          "CYP3A4 advantage: Unlike clarithromycin (potent CYP3A4 inhibitor), azithromycin has minimal CYP interactions. This makes it safe with statins, tacrolimus, cyclosporine, and many other drugs. When a patient needs a macrolide and is on a CYP3A4-sensitive drug, azithromycin is the clear choice.",
          "Immunomodulatory effects: Beyond antimicrobial activity, azithromycin reduces neutrophilic inflammation, decreases pro-inflammatory cytokines (IL-6, IL-8, TNF-α), and modulates macrophage function. This is why it's used in COPD exacerbation prophylaxis (MACRO trial: azithromycin 250mg daily reduced AECOPD frequency) and CF lung disease. In severe CAP, this immunomodulatory effect may contribute to mortality reduction beyond pathogen coverage.",
          "For chlamydia: CDC 2021 STI guidelines now recommend doxycycline 100mg BID × 7 days OVER azithromycin 1g single dose due to better cure rates. The single-dose azithromycin era for chlamydia is ending.",
          "Storage: azithromycin oral suspension does NOT need refrigeration (stable at room temperature for 10 days). This is a practical counseling point for parents — one less thing in the fridge.",
        ],
      },
      {
        id: "doxycycline",
        name: "Doxycycline",
        brandNames: "Vibramycin, Doryx, Monodox, Acticlate, Oracea (sub-antimicrobial)",
        drugClass: "Tetracycline (2nd generation — lipophilic tetracycline)",
        mechanismOfAction: "Binds to the 30S ribosomal subunit, blocking aminoacyl-tRNA from binding to the mRNA-ribosome complex. Bacteriostatic (but bactericidal against some organisms at higher concentrations). Also has anti-inflammatory and immunomodulatory properties independent of antimicrobial activity.",
        spectrum: "Remarkably broad: Gram-positive: S. pneumoniae (~85-90% susceptible), MRSA (many strains), Enterococcus (some). Gram-negative: H. influenzae, Brucella, Vibrio, Yersinia. Atypicals: Mycoplasma (excellent — NOT affected by macrolide resistance), Chlamydophila, Chlamydia trachomatis, Rickettsia (drug of choice for all rickettsial diseases). Spirochetes: Borrelia (Lyme), Leptospira. Parasites: Malaria (prophylaxis/treatment). Others: Bartonella, Coxiella (Q fever). GAPS: Pseudomonas, Proteus, most Enterobacterales (variable), group A strep (may be resistant), Bacteroides fragilis.",
        dosing: {
          standard: "100mg PO BID (loading dose 200mg on day 1 sometimes used for serious infections)",
          cap: "100mg PO BID × 5 days (outpatient CAP)",
          mrsa_ssti: "100mg PO BID × 5-10 days",
          chlamydia: "100mg PO BID × 7 days (now CDC preferred over azithromycin single dose)",
          malaria_prophylaxis: "100mg PO daily (start 1-2 days before, continue 4 weeks after travel)",
          acne: "50-100mg PO daily (sub-antimicrobial: 40mg MR daily — Oracea)",
          lyme: "100mg PO BID × 10-21 days (depending on manifestation)",
          rocky_mountain_spotted_fever: "100mg PO/IV BID (ALL ages — including children, even <8 years)",
        },
        renalAdjustment: "NO adjustment needed — a major advantage over other tetracyclines. Doxycycline is primarily eliminated via the GI tract (chelated with bile salts). Safe in renal impairment, including dialysis patients. This is unlike tetracycline (which accumulates in renal failure).",
        hepaticAdjustment: "Use with caution in severe hepatic impairment. Primarily hepatically metabolized. Can cause hepatotoxicity, especially with high doses or in pregnancy (rare fatty liver of pregnancy).",
        adverseEffects: {
          common: "Nausea, esophageal irritation/ulceration (TAKE WITH WATER, upright × 30 min), photosensitivity (dose-dependent), vaginal candidiasis",
          serious: "Esophageal ulceration (if taken improperly), severe photosensitivity/phototoxicity, intracranial hypertension (pseudotumor cerebri — especially with isotretinoin combination), C. difficile",
          rare: "Drug-induced lupus, pancreatitis, hepatotoxicity, hypersensitivity syndrome",
        },
        drugInteractions: [
          "Divalent/trivalent cations (Ca²⁺, Mg²⁺, Al³⁺, Fe²⁺, Zn²⁺, Bi³⁺) — chelation reduces absorption. Separate by 2-3h. Includes dairy products, antacids, calcium supplements, iron, bismuth subsalicylate.",
          "Warfarin — doxycycline can enhance anticoagulant effect. Monitor INR (mechanism: reduced vitamin K production from gut flora + possible protein binding displacement).",
          "Isotretinoin — CONTRAINDICATED combination. Both cause intracranial hypertension (pseudotumor cerebri). NEVER combine.",
          "Methotrexate — potential increased toxicity (mechanism not fully elucidated).",
          "Oral contraceptives — theoretical interaction, clinically not significant. Backup contraception not routinely needed (unlike with rifampin).",
          "Phenytoin, carbamazepine, barbiturates — enzyme induction can reduce doxycycline half-life by ~50%. May need 200mg BID in patients on these enzymes inducers.",
          "Sucralfate — chelation, reduced absorption. Separate by 2h.",
        ],
        monitoring: "Short courses: clinical response. Prolonged courses (acne, Lyme): No routine labs needed for standard dosing. Monitor for photosensitivity symptoms. Consider BMP if prolonged use in elderly (rare reports of increased BUN without true renal injury). If using sub-antimicrobial dose (Oracea 40mg), no specific monitoring needed.",
        pregnancyLactation: "Category D. AVOID in pregnancy (permanent tooth discoloration in fetus after ~4 months gestation, inhibits bone growth). AVOID in children <8 years old EXCEPT for life-threatening infections: Rocky Mountain Spotted Fever is the classic exception — doxycycline is the drug of choice even in children and pregnant women when RMSF is suspected because the alternative (chloramphenicol) is worse and delay kills. Compatible with short-term breastfeeding per AAP (calcium in breast milk chelates doxycycline, reducing infant exposure).",
        pharmacistPearls: [
          "Esophageal ulceration prevention: ALWAYS counsel patients to take doxycycline with a FULL glass of water (8 oz), remain upright for at least 30 minutes after, and NOT take it right before bed. Esophageal ulcers from doxycycline are preventable but cause severe retrosternal pain and odynophagia.",
          "The renal advantage: Unlike tetracycline, doxycycline does NOT accumulate in renal failure and does NOT need dose adjustment. It's eliminated via the GI tract. This makes it one of the most versatile antibiotics in CKD/dialysis patients.",
          "Photosensitivity is dose-dependent. At 100mg BID for a short CAP course, the risk is moderate. At 200mg daily for prolonged acne treatment, it's significant. Always counsel on sun protection (SPF 30+, protective clothing, avoid peak UV hours).",
          "Doxycycline for MRSA: Many community MRSA strains are doxycycline-susceptible. For uncomplicated MRSA SSTI, doxycycline is an effective oral option alongside TMP-SMX and clindamycin. It's underutilized for this indication.",
          "Food interaction nuance: Unlike tetracycline, doxycycline absorption is NOT significantly reduced by food (only ~20% reduction with dairy). You CAN take it with food to reduce nausea — this is a major tolerability advantage. The cation (Ca/Mg/Fe/Al) chelation still applies for supplements/antacids, but a normal meal is fine.",
          "The RMSF exception for children: Doxycycline is the DRUG OF CHOICE for suspected RMSF in ALL ages, including children <8 and pregnant women. The CDC, AAP, and IDSA are unanimous on this. Delayed treatment of RMSF kills. A short course of doxycycline does NOT cause tooth staining. Do not let the pediatric 'tetracycline rule' prevent life-saving treatment.",
          "Macrolide-resistant Mycoplasma: This is the emerging reason doxycycline is gaining favor over azithromycin for outpatient CAP. Macrolide-resistant Mycoplasma (>80% in parts of Asia, ~10-15% in US) is fully susceptible to doxycycline. As resistance rises, doxycycline will become the preferred atypical agent.",
        ],
      },
      {
        id: "moxifloxacin",
        name: "Moxifloxacin",
        brandNames: "Avelox",
        drugClass: "Fluoroquinolone (4th generation — 'respiratory fluoroquinolone')",
        mechanismOfAction: "Inhibits both DNA gyrase (topoisomerase II) and topoisomerase IV with balanced dual-targeting. The 8-methoxy group provides enhanced gram-positive activity and reduced selection for resistance compared to older FQs. Concentration-dependent bactericidal activity with prolonged PAE.",
        spectrum: "Best-in-class gram-positive for an FQ: S. pneumoniae (including DRSP — MPC is well above achievable concentrations), S. aureus (MSSA, some MRSA activity but not reliable). Good gram-negative: H. influenzae, M. catarrhalis, Klebsiella. Excellent atypicals: Mycoplasma, Chlamydophila, Legionella. MODERATE anaerobes: Bacteroides, Peptostreptococcus (unique among FQs). GAPS: Pseudomonas aeruginosa (NO activity — critical distinction from levo/cipro), ESBL Enterobacterales, MRSA.",
        dosing: {
          standard: "400mg PO/IV once daily",
          cap: "400mg PO daily × 5 days (outpatient) or 400mg IV/PO daily (inpatient)",
          absssi: "400mg PO/IV daily × 5-14 days",
          intraabdominal: "400mg IV daily (mild-moderate, monomicrobial — rare use)",
        },
        renalAdjustment: "NO adjustment needed at any level of renal function, including dialysis. Hepatically metabolized (glucuronide and sulfate conjugation). This is a significant advantage over levofloxacin.",
        hepaticAdjustment: "Avoid in severe hepatic impairment (Child-Pugh C). Hepatotoxicity reported. Cases of fulminant hepatic failure have occurred.",
        adverseEffects: {
          common: "Nausea (~7%), diarrhea (~5%), dizziness, headache",
          serious: "QT prolongation (MOST significant among fluoroquinolones — mean QTc prolongation ~6-10 ms), tendinitis/tendon rupture, peripheral neuropathy, CNS effects, C. difficile, hepatotoxicity (including fatal hepatic failure), myasthenia gravis exacerbation",
          rare: "Torsades de Pointes, aortic aneurysm/dissection, retinal detachment",
          fdaBoxedWarnings: "Same class warnings as all FQs: tendinitis/rupture, peripheral neuropathy, CNS effects, MG exacerbation. Additional: moxifloxacin was withdrawn from the European IV market in some countries due to hepatotoxicity concerns (oral remains available).",
        },
        drugInteractions: [
          "QT-prolonging drugs — HIGHEST RISK among fluoroquinolones. Absolutely avoid with Class IA/III antiarrhythmics, and use extreme caution with ondansetron, methadone, antipsychotics, TCAs, and other QT-prolonging agents.",
          "Divalent/trivalent cations — same chelation as other FQs. Separate from Ca, Mg, Al, Fe, Zn by 4h before or 8h after (moxifloxacin package insert uses 4h/8h, unlike cipro's 2h/6h).",
          "Warfarin — enhanced anticoagulation. Monitor INR.",
          "Insulin/sulfonylureas — dysglycemia risk (hypo- and hyperglycemia).",
          "NOTABLE: Moxifloxacin does NOT significantly inhibit CYP enzymes — no tizanidine or theophylline interaction (similar to levofloxacin, unlike ciprofloxacin).",
        ],
        monitoring: "Baseline ECG recommended if any QT risk factors. Monitor QTc during therapy if concurrent QT-prolonging drugs. Blood glucose in diabetics. LFTs if symptoms of hepatitis develop. Tendon symptoms — discontinue immediately if tendinopathy suspected.",
        pregnancyLactation: "Category C. Avoid in pregnancy (same class concerns as all FQs — arthropathy in juvenile animals). Breastfeeding: enters breast milk, generally avoided.",
        pharmacistPearls: [
          "Moxi vs. Levo — know the critical differences: Moxi has NO Pseudomonas activity (levo does). Moxi has better pneumococcal killing. Moxi has MORE QT prolongation. Moxi needs NO renal adjustment (levo does). Moxi has anaerobic activity (levo doesn't). Choose wisely based on the clinical scenario.",
          "The QT prolongation risk is real and significant. Moxifloxacin causes ~6-10 ms mean QTc prolongation. In a patient with baseline QTc 480 and on methadone, moxifloxacin could tip them into Torsades. ALWAYS check baseline QTc and concomitant medications.",
          "No renal dosing needed — ever. This makes moxi attractive in elderly patients with fluctuating renal function, dialysis patients, and AKI situations where levofloxacin dosing becomes complicated.",
          "Anaerobic coverage: Moxifloxacin is the ONLY fluoroquinolone with meaningful anaerobic activity. This is why it appears in some aspiration pneumonia regimens and intra-abdominal infection guidelines. However, this moderate anaerobic coverage is not as reliable as metronidazole or amp-sulbactam.",
          "Once-daily dosing with excellent oral bioavailability (~90%) and no food interaction makes moxifloxacin extremely convenient. IV-to-PO conversion is seamless — same dose, same frequency.",
          "In TB treatment: Moxifloxacin has a niche role in drug-resistant TB regimens and in the shortened TB-PRACTECAL and STREAM regimens. If you work in a setting with TB patients, know that moxi is a WHO Group A drug for MDR-TB treatment.",
        ],
      },
      {
        id: "ampicillin-sulbactam",
        name: "Ampicillin-Sulbactam",
        brandNames: "Unasyn",
        drugClass: "Aminopenicillin + beta-lactamase inhibitor (BLI)",
        mechanismOfAction: "Ampicillin inhibits PBPs (cell wall synthesis). Sulbactam irreversibly inhibits class A beta-lactamases (TEM, SHV — NOT AmpC or ESBL), restoring ampicillin activity against beta-lactamase producers. Sulbactam also has intrinsic activity against Acinetobacter baumannii (unique among BLIs).",
        spectrum: "Broad: S. pneumoniae, Group A/B Strep, Enterococcus faecalis, H. influenzae (including beta-lactamase+), M. catarrhalis, E. coli (many), Klebsiella (some), oral anaerobes (excellent), Bacteroides (moderate — less reliable than metronidazole/carbapenems for B. fragilis). GAPS: MRSA, Pseudomonas, ESBL producers, AmpC producers, Acinetobacter (sulbactam has activity, but resistance rising).",
        dosing: {
          standard: "3g (2g ampicillin/1g sulbactam) IV q6h",
          aspiration_pna: "3g IV q6h",
          intraabdominal: "3g IV q6h",
          pelvic_inflammatory: "3g IV q6h + doxycycline",
          epiglottitis: "3g IV q6h",
          high_dose_acinetobacter: "9g IV q8h (3g ampicillin + 6g sulbactam — high-dose sulbactam for Acinetobacter, off-label)",
        },
        renalAdjustment: "CrCl 15-29: 3g q12h. CrCl 5-14: 3g q24h. Hemodialysis: 3g q24h + supplemental dose after HD.",
        hepaticAdjustment: "No specific adjustment. Monitor LFTs with prolonged use.",
        adverseEffects: {
          common: "Diarrhea (~10%), injection site pain, rash",
          serious: "C. difficile, anaphylaxis (penicillin allergy cross-reactivity), seizures (high doses in renal impairment — ampicillin lowers seizure threshold more than other beta-lactams)",
          rare: "Interstitial nephritis, hemolytic anemia, serum sickness",
        },
        drugInteractions: [
          "Methotrexate — reduced renal clearance → increased MTX toxicity. Monitor levels.",
          "Allopurinol — increased rash incidence (same as amoxicillin).",
          "Warfarin — potential INR increase. Monitor.",
          "Probenecid — increases ampicillin levels (blocks tubular secretion).",
          "Aminoglycosides — in vitro inactivation if mixed in same IV line. Administer separately.",
        ],
        monitoring: "Short courses: clinical response. Prolonged: CBC (leukopenia, thrombocytopenia with extended courses), BMP (renal function — guides dosing), LFTs. Monitor for C. diff if diarrhea develops.",
        pregnancyLactation: "Category B. Safe in pregnancy — commonly used for intrapartum GBS prophylaxis (ampicillin), obstetric infections (chorioamnionitis, postpartum endometritis). Compatible with breastfeeding.",
        pharmacistPearls: [
          "Amp-sulbactam is the GOLD STANDARD for aspiration pneumonia. Covers streptococci (including viridans/anginosus group), oral anaerobes, and H. influenzae in one drug. Better tolerated than clindamycin with less C. diff risk.",
          "Oral equivalent: Amoxicillin-clavulanate (Augmentin) is the oral step-down. The sulbactam component of Unasyn inhibits the same beta-lactamases as clavulanate. Use amox-clav 875/125mg PO BID for discharge.",
          "Sulbactam's intrinsic activity against Acinetobacter baumannii is unique and clinically important. In MDR Acinetobacter infections, high-dose sulbactam (up to 4g q6h) is used as a therapeutic agent — the ampicillin is essentially along for the ride. This is a niche but life-saving application.",
          "q6h dosing: The 6-hour dosing interval is important for time-dependent killing. Do not extend to q8h — you'll fall below the MIC target. This can be a nursing compliance challenge; advocate for consistent timing.",
          "For diabetic foot infections: Amp-sulbactam is an excellent empiric choice — covers streptococci, staphylococci (MSSA), gram-negatives, and anaerobes. Add vancomycin if MRSA risk is present.",
          "Seizure risk: Ampicillin (like all penicillins) can lower seizure threshold, especially at high doses in renal impairment. Adjust dose in renal failure to avoid accumulation. This is more relevant for amp-sulbactam than for piperacillin-tazobactam.",
        ],
      },
    ],
  },
  {
    id: "hap-vap",
    name: "Hospital-Acquired & Ventilator-Associated Pneumonia",
    icon: "🏥",
    category: "Infectious Disease",
    overview: {
      definition: "Hospital-Acquired Pneumonia (HAP): pneumonia occurring ≥48 hours after hospital admission that was not incubating at admission. Ventilator-Associated Pneumonia (VAP): pneumonia occurring >48 hours after endotracheal intubation. The 2016 ATS/IDSA guidelines separated HAP/VAP from CAP and eliminated the old 'HCAP' category entirely.",
      epidemiology: "HAP is the most common healthcare-associated infection contributing to death. VAP occurs in 5-15% of mechanically ventilated patients. Crude mortality: HAP 20-50%, VAP 20-40% (attributable mortality debated — likely 5-13%). VAP adds ~7-9 days to ICU length of stay per episode. HAP/VAP represents the largest single target for inpatient antibiotic stewardship.",
      keyGuidelines: [
        { name: "ATS/IDSA 2016 HAP/VAP Guidelines", detail: "Current definitive US guideline. Eliminated HCAP category. Emphasizes local antibiogram-driven empiric therapy, de-escalation, 7-day treatment courses, and avoiding unnecessary broad-spectrum coverage. Recommends AGAINST routine biomarkers (PCT, CRP, sTREM-1) for VAP diagnosis." },
        { name: "ERS/ESICM/ESCMID/ALAT 2017", detail: "European/Latin American guidelines. More emphasis on risk stratification for MDR pathogens and biomarker-guided duration. Endorses PCT-guided de-escalation more strongly than ATS/IDSA." },
        { name: "Surviving Sepsis Campaign 2021", detail: "Relevant for HAP/VAP with sepsis — 1-hour antibiotic administration, source control, de-escalation within 48-72h of culture results." },
        { name: "SHEA/IDSA/APIC Practice Recommendation 2022", detail: "VAP prevention bundle: head-of-bed elevation, daily sedation vacation + SBT, oral care with chlorhexidine (note: some institutions moving away from CHG oral care due to mortality signal in meta-analyses), subglottic secretion drainage, stress ulcer prophylaxis, DVT prophylaxis." },
      ],
      landmarkTrials: [
        { name: "IDAT Trial (2015, JAMA)", detail: "Antibiotic de-escalation in VAP: De-escalation was non-inferior to continuation of broad-spectrum therapy in clinical cure. However, de-escalation group had MORE superinfections (paradoxical finding, possibly due to selection of resistant organisms). Trial challenged the assumption that de-escalation is always beneficial, but consensus still supports it." },
        { name: "PTC Trial (Bouadma 2010, Lancet)", detail: "Procalcitonin-guided antibiotic discontinuation in ICU respiratory infections reduced antibiotic exposure by ~3 days without affecting mortality. Supports PCT-guided de-escalation, though ATS/IDSA 2016 did not strongly endorse this for VAP specifically." },
        { name: "Chastre et al. (2003, JAMA)", detail: "Landmark trial comparing 8 vs 15 days of antibiotics for VAP. 8 days was non-inferior for most pathogens EXCEPT non-fermenting GNRs (Pseudomonas, Acinetobacter) where relapse was higher with 8 days. Established 7-day courses as standard and flagged non-fermenters as an exception." },
        { name: "PROSEVA Trial (2013, NEJM)", detail: "Prone positioning in severe ARDS reduced mortality (16% vs 32.8%). While not a HAP-specific trial, relevant because many HAP/VAP patients develop ARDS and proning affects drug distribution and PK." },
        { name: "VAPORIZE Trial (2024)", detail: "Inhaled amikacin + IV antibiotics vs IV antibiotics alone for VAP. Inhaled aminoglycosides did NOT improve clinical outcomes despite achieving higher lung concentrations. Challenged the practice of adjunctive inhaled antibiotics for VAP." },
        { name: "MerINO-2 / ACORN (2023-2024)", detail: "Ongoing and recent trials examining pip-tazo vs carbapenems for ESBL bacteremia (relevant to HAP-source bacteremia). Evolving evidence on whether pip-tazo can be used for ESBL infections in certain contexts." },
      ],
      riskFactors: "Prolonged mechanical ventilation (>5-7 days), prior antibiotic use (strongest MDR risk factor), prolonged hospitalization, ARDS, supine positioning, reintubation, enteral feeding, immunosuppression, chronic lung disease (COPD, bronchiectasis), witnessed aspiration, prior MDR colonization, high local MDR prevalence on the unit's antibiogram.",
    },
    subcategories: [
      {
        id: "hap-no-mdr",
        name: "HAP — No MDR Risk Factors, Not High Mortality Risk",
        definition: "Hospital-acquired pneumonia (≥48h after admission) in patients WITHOUT risk factors for MDR pathogens and NOT at high risk of mortality. ATS/IDSA 2016 defines MDR risk factors as: IV antibiotic use in prior 90 days AND structural lung disease (bronchiectasis, CF) for Pseudomonas; IV antibiotics in prior 90 days for MRSA; >5 days hospitalization before HAP onset. High mortality risk: requiring ventilatory support for HAP or septic shock.",
        clinicalPresentation: "New or progressive radiographic infiltrate + at least 2 of: fever >38°C, leukocytosis (>10K) or leukopenia (<4K), purulent secretions. Modified Clinical Pulmonary Infection Score (CPIS) can assist but is not validated for diagnosis. ATS/IDSA 2016: clinical criteria alone are sufficient — do NOT require invasive sampling for HAP (unlike VAP).",
        diagnostics: "Non-invasive respiratory sampling (sputum culture). Blood cultures × 2. CXR or CT chest. ATS/IDSA 2016: recommends AGAINST routine invasive sampling (BAL, mini-BAL) for HAP (differs from VAP). Procalcitonin and other biomarkers NOT recommended as sole diagnostic criteria but may assist with de-escalation.",
        empiricTherapy: [
          {
            line: "First-Line (Monotherapy — Standard Risk)",
            options: [
              { drug: "pip-tazo-hap", regimen: "Piperacillin-tazobactam 4.5g IV q6h (extended infusion over 4h)", notes: "ATS/IDSA 2016 preferred for HAP without MDR risk. Extended infusion standard of care. Covers Enterobacterales, Pseudomonas (empiric), MSSA, and anaerobes." },
              { drug: "cefepime", regimen: "Cefepime 2g IV q8h (extended infusion over 3-4h)", notes: "Alternative first-line. Covers gram-negatives including most Pseudomonas and AmpC producers (SPACE organisms). NO anaerobic coverage. NO MRSA coverage." },
              { drug: "levofloxacin", regimen: "Levofloxacin 750mg IV daily", notes: "ATS/IDSA lists as an option. Covers typicals + atypicals. BUT: high rates of FQ resistance in hospital-acquired gram-negatives limit utility. Check local antibiogram before selecting. 100% bioavailability — PO = IV." },
              { drug: "meropenem-hap", regimen: "Meropenem 1g IV q8h (extended infusion)", notes: "Listed by ATS/IDSA as an option even without MDR risk, but stewardship principles favor reserving carbapenems. Use if high local ESBL prevalence or patient has multiple beta-lactam allergies limiting options." },
            ],
          },
        ],
        organismSpecific: [
          { organism: "S. aureus (MSSA — most common gram-positive)", preferred: "Pip-tazo, cefepime, oxacillin/nafcillin (if confirmed MSSA)", alternative: "Vancomycin (if MRSA not yet excluded)", notes: "MSSA is common in HAP. Once confirmed MSSA, de-escalate from vancomycin to nafcillin/oxacillin or cefazolin — these have SUPERIOR anti-MSSA activity and better outcomes than vancomycin for MSSA. This is a critical stewardship intervention." },
          { organism: "Enterobacterales (E. coli, Klebsiella, Enterobacter)", preferred: "Cefepime, pip-tazo", alternative: "Meropenem (if ESBL), levofloxacin (if susceptible)", notes: "Enterobacter, Citrobacter, Serratia — AmpC producers. Use cefepime, NOT ceftriaxone (AmpC induction risk). Hospital-acquired E. coli/Klebsiella have higher ESBL rates than community isolates — check prior cultures." },
          { organism: "Pseudomonas aeruginosa", preferred: "Pip-tazo, cefepime, meropenem", alternative: "Ciprofloxacin/levofloxacin (if susceptible)", notes: "Even in 'low-risk' HAP, Pseudomonas is possible. Monotherapy is acceptable for non-MDR-risk patients per ATS/IDSA. De-escalate or stop anti-pseudomonal coverage if cultures are negative for Pseudomonas." },
        ],
        pearls: [
          "Monotherapy is appropriate for HAP without MDR risk factors. ATS/IDSA 2016 is explicit: do NOT reflexively double-cover or add MRSA coverage in every HAP patient. Overtreatment drives resistance.",
          "The HCAP category is DEAD. Nursing home residents, dialysis patients, recent hospitalization — these no longer automatically get broad-spectrum 'HCAP' regimens. Treat based on actual MDR risk factors, not just healthcare exposure. This was the single biggest change in the 2016 guidelines.",
          "Sputum quality matters: Gram stain showing >25 WBCs and <10 squamous epithelial cells per low-power field = adequate specimen. Reject specimens with high squamous cells — they represent mouth flora, not lung infection.",
          "Start antibiotics promptly but don't wait for perfect diagnostics. In HAP, clinical diagnosis is sufficient to initiate therapy. Adjust at 48-72h based on culture results and clinical trajectory.",
        ],
      },
      {
        id: "hap-mdr-risk",
        name: "HAP — MDR Risk Factors OR High Mortality Risk",
        definition: "HAP in patients with risk factors for MDR pathogens (IV antibiotics in prior 90 days, ≥5 days hospitalization before HAP onset, septic shock, ARDS/ventilatory support requirement, prior MDR colonization) OR at high mortality risk (requiring ventilatory support for HAP, or septic shock). These patients need empiric broadening to cover MRSA and/or Pseudomonas.",
        clinicalPresentation: "Same as standard HAP but with higher acuity. More likely to present with sepsis, respiratory failure, or rapid clinical decline. These patients are often in the ICU or step-down unit.",
        diagnostics: "Same as standard HAP plus: consider broader microbiology (fungal cultures if immunosuppressed, respiratory viral panel). Blood cultures essential. Nasal MRSA PCR swab — negative predictive value ~95% for MRSA pneumonia (de-escalation tool). Consider CT chest if CXR unclear or complications suspected.",
        empiricTherapy: [
          {
            line: "Empiric — Anti-Pseudomonal Beta-Lactam (choose one)",
            options: [
              { drug: "pip-tazo-mdr", regimen: "Piperacillin-tazobactam 4.5g IV q6h (extended infusion over 4h)", notes: "Preferred anti-pseudomonal backbone. Extended infusion is mandatory at this severity level. Covers gram-negatives, MSSA, anaerobes." },
              { drug: "cefepime-mdr", regimen: "Cefepime 2g IV q8h (extended infusion)", notes: "Preferred if AmpC producers suspected (Enterobacter, Serratia, Citrobacter). NO anaerobic or MRSA coverage — add metronidazole if aspiration component, add vancomycin if MRSA risk." },
              { drug: "meropenem-mdr", regimen: "Meropenem 2g IV q8h (extended infusion over 3h)", notes: "Use for ESBL risk, prior MDR gram-negatives, or septic shock with high local resistance. Higher dose (2g) for pneumonia — lung penetration requires higher serum levels. De-escalate aggressively." },
              { drug: "imipenem", regimen: "Imipenem-cilastatin 500mg IV q6h", notes: "Alternative carbapenem. Slightly better gram-positive coverage than meropenem. Seizure risk higher than meropenem (especially renal impairment, CNS disease). Requires cilastatin to prevent renal metabolism." },
            ],
          },
          {
            line: "ADD MRSA Coverage (if risk factors present)",
            options: [
              { drug: "vancomycin", regimen: "Vancomycin IV — AUC/MIC-guided dosing (target AUC 400-600 mg·h/L)", notes: "ATS/IDSA 2016: add MRSA coverage if: IV antibiotics in prior 90 days, unit with >20% MRSA prevalence (or unknown), or prior MRSA colonization/infection. AUC-guided dosing is now standard (2020 vancomycin consensus). Check nasal MRSA swab — if negative, de-escalate within 48-72h." },
              { drug: "linezolid", regimen: "Linezolid 600mg IV/PO BID", notes: "Alternative to vancomycin. Potential advantages in pneumonia: better lung penetration, 100% oral bioavailability, no renal dosing. ZEPHyR trial showed linezolid non-inferior to vancomycin for MRSA nosocomial pneumonia with some secondary outcome advantages. Risk: myelosuppression (>14 days), serotonin syndrome with SSRIs." },
            ],
          },
          {
            line: "ADD Second Anti-Pseudomonal Agent (if MDR Pseudomonas risk)",
            options: [
              { drug: "ciprofloxacin-hap", regimen: "Ciprofloxacin 400mg IV q8h", notes: "ATS/IDSA 2016: add a second anti-pseudomonal agent from a DIFFERENT class if: prior IV antibiotics in 90 days AND unit with >10% gram-negative resistance to monotherapy agent. FQ provides the different class from the beta-lactam backbone. Check local Pseudomonal FQ susceptibility." },
              { drug: "tobramycin", regimen: "Tobramycin 5-7 mg/kg IV daily (extended-interval dosing)", notes: "Alternative second anti-pseudomonal agent. Best gram-negative aminoglycoside for Pseudomonas. Extended-interval (once-daily) dosing maximizes peak:MIC ratio (concentration-dependent killing). Monitor levels: target peak >20× MIC, trough <1. Nephrotoxicity and ototoxicity with prolonged courses." },
              { drug: "amikacin", regimen: "Amikacin 15-20 mg/kg IV daily (extended-interval dosing)", notes: "Most resistant to aminoglycoside-modifying enzymes — use when tobramycin-resistant. Higher doses needed for pneumonia due to poor lung penetration. Monitor levels closely." },
              { drug: "aztreonam", regimen: "Aztreonam 2g IV q8h", notes: "Monobactam — NO cross-allergenicity with penicillins (safe in true penicillin allergy). Anti-pseudomonal. Covers gram-negatives only — no gram-positive or anaerobic activity. Useful in penicillin/cephalosporin allergy with Pseudomonas risk." },
            ],
          },
        ],
        organismSpecific: [
          { organism: "MRSA", preferred: "Vancomycin (AUC 400-600) or Linezolid 600mg BID", alternative: "TMP-SMX (limited pneumonia data, but used in some settings for mild-moderate disease)", notes: "Nasal MRSA PCR: ~95% negative predictive value. ATS/IDSA 2016 recommends using it to de-escalate. If nasal swab negative AND cultures negative at 48h → STOP vancomycin/linezolid. This is a pharmacist-champion intervention. Vancomycin for MSSA is INFERIOR to beta-lactams — always de-escalate to nafcillin/oxacillin/cefazolin if MSSA confirmed." },
          { organism: "MDR Pseudomonas aeruginosa", preferred: "Cefepime, pip-tazo, or meropenem (based on susceptibility) + second agent from different class", alternative: "Ceftolozane-tazobactam, ceftazidime-avibactam, imipenem-relebactam for DTR (difficult-to-treat resistance) Pseudomonas", notes: "Double-cover empirically, then de-escalate to monotherapy once susceptibilities confirm. DTR Pseudomonas (resistant to all standard agents) — consult ID and consider novel BL-BLIs or cefiderocol. Inhaled aminoglycosides: VAPORIZE trial showed NO benefit of adjunctive inhaled amikacin — not recommended routinely." },
          { organism: "ESBL-producing Enterobacterales", preferred: "Meropenem (or ertapenem if non-critical)", alternative: "Ceftazidime-avibactam, meropenem-vaborbactam for carbapenem-resistant isolates", notes: "For HAP-source ESBL bacteremia, carbapenems remain standard per MERINO. Pip-tazo is NOT reliable empirically for ESBL. Once cultures confirm ESBL, de-escalate to ertapenem (narrowest carbapenem) if possible." },
          { organism: "Acinetobacter baumannii", preferred: "Ampicillin-sulbactam (high-dose sulbactam component), meropenem", alternative: "Polymyxin B or colistin (last resort), cefiderocol", notes: "Rising global threat in ICUs. Intrinsically resistant to many agents. Sulbactam has intrinsic activity against Acinetobacter — high-dose sulbactam (9g amp-sulbactam q8h = 3g sulbactam q8h) is a key strategy. Carbapenems are first-line if susceptible. For CRAB (carbapenem-resistant Acinetobacter): polymyxins + high-dose sulbactam ± meropenem (combination therapy, consult ID). Tigecycline achieves poor serum levels — avoid for pneumonia despite in vitro activity." },
          { organism: "Stenotrophomonas maltophilia", preferred: "TMP-SMX (drug of choice — 15-20 mg/kg/day TMP component divided q6-8h)", alternative: "Levofloxacin, ceftazidime, minocycline/tigecycline", notes: "Intrinsically resistant to carbapenems, aminoglycosides, and most beta-lactams. TMP-SMX is THE drug. Often emerges during prolonged carbapenem therapy — a reason to de-escalate carbapenems as soon as possible. If S. maltophilia appears in cultures of a patient on meropenem, this is not surprising — it's selection pressure." },
        ],
        pearls: [
          "THE 20% MRSA THRESHOLD: ATS/IDSA 2016 says add empiric MRSA coverage if the unit's MRSA prevalence is >20% or unknown. Many ICUs exceed this threshold. Know YOUR unit's MRSA rate — it should drive your empiric protocol.",
          "THE 10% GNR RESISTANCE THRESHOLD: If >10% of gram-negatives on the unit's antibiogram are resistant to the monotherapy agent you'd choose, add a second anti-pseudomonal agent from a different class. This is why every ICU needs a unit-specific antibiogram, not just a hospital-wide one.",
          "Nasal MRSA swab is the stewardship MVP for HAP/VAP: ~95% NPV for MRSA pneumonia. If negative, you can safely stop vancomycin/linezolid within 48-72h. Multiple studies show this reduces unnecessary vancomycin days by 2-3 days per patient. Champion this protocol.",
          "Extended infusion beta-lactams in HAP/VAP: This is NOT optional at this severity level. Pip-tazo over 4h, cefepime over 3-4h, meropenem over 3h. Monte Carlo simulations show 30-60% improvement in probability of target attainment vs. intermittent bolus. Make this an institutional protocol.",
          "De-escalation at 48-72h: Once cultures return, narrow therapy. Stop MRSA coverage if swab/cultures negative. Stop double Pseudomonal coverage if Pseudomonas not isolated. Switch from meropenem to narrower agents if non-ESBL organism. The ATS/IDSA guideline explicitly recommends this.",
          "Vancomycin AUC-guided dosing: The 2020 vancomycin consensus (ASHP/IDSA/SIDP/PIDS) recommends AUC/MIC 400-600 over trough-based dosing. AUC-guided dosing achieves the same efficacy with LESS nephrotoxicity. If your institution still uses trough goals of 15-20, advocate for switching to AUC-guided protocols with Bayesian software (e.g., PrecisePK, DoseMeRx).",
        ],
      },
      {
        id: "vap",
        name: "Ventilator-Associated Pneumonia (VAP)",
        definition: "Pneumonia developing >48 hours after endotracheal intubation. Distinguished from ventilator-associated tracheobronchitis (VAT) which has purulent secretions without new infiltrate. VAP diagnosis is notoriously difficult — no gold standard exists. Clinical criteria have ~70% sensitivity/specificity vs. histopathology.",
        clinicalPresentation: "New or progressive infiltrate on CXR + at least 2 of: fever >38°C, leukocytosis/leukopenia, purulent tracheal secretions, worsening oxygenation (PaO2/FiO2 decline). Portable CXR in ICU is notoriously unreliable — CT chest may be needed for equivocal cases. VAP should be suspected when a ventilated patient develops new fever + purulent secretions + worsening gas exchange.",
        diagnostics: "ATS/IDSA 2016 recommends NON-INVASIVE quantitative cultures (endotracheal aspirate, ETA) over invasive sampling (BAL, mini-BAL) — based on evidence showing no mortality difference. ETA threshold: ≥10⁶ CFU/mL. BAL threshold: ≥10⁴ CFU/mL. Blood cultures × 2 (positive in only ~15% but changes management). ATS/IDSA 2016 recommends AGAINST using biomarkers (PCT, CRP, sTREM-1) ALONE to decide whether to initiate antibiotics for VAP, but PCT may guide DURATION.",
        empiricTherapy: [
          {
            line: "VAP — No MDR Risk Factors (Low-Risk)",
            options: [
              { drug: "pip-tazo-vap", regimen: "Piperacillin-tazobactam 4.5g IV q6h (extended infusion)", notes: "Monotherapy is appropriate if no MDR risk factors AND unit gram-negative resistance <10% to the chosen agent. Same first-line agents as HAP without MDR risk." },
              { drug: "cefepime-vap", regimen: "Cefepime 2g IV q8h (extended infusion)", notes: "Good choice for AmpC producers. Extended infusion essential. Neurotoxicity risk in renal impairment — monitor for confusion, myoclonus, seizures (cefepime encephalopathy)." },
              { drug: "levofloxacin-vap", regimen: "Levofloxacin 750mg IV daily", notes: "Alternative monotherapy. Check local FQ susceptibility — hospital-acquired gram-negatives often have high FQ resistance. May not be reliable in many ICUs." },
            ],
          },
          {
            line: "VAP — MDR Risk Factors (High-Risk)",
            options: [
              { drug: "vap-mdr-backbone", regimen: "Anti-pseudomonal beta-lactam (pip-tazo, cefepime, or meropenem) + second anti-gram-negative agent (FQ or aminoglycoside) + MRSA coverage (vancomycin or linezolid)", notes: "Triple therapy for high-risk VAP. ATS/IDSA 2016: two anti-pseudomonal agents from different classes + MRSA coverage when risk factors present. The goal is to maximize probability of at least one active agent against the causative pathogen. De-escalate aggressively at 48-72h." },
            ],
          },
          {
            line: "Duration (ATS/IDSA 2016 — 7 Days Standard)",
            options: [
              { drug: "duration-vap", regimen: "7 days for most VAP (strong recommendation, moderate quality evidence)", notes: "Chastre 2003 trial established 8 vs 15 days — 8 days non-inferior for most pathogens. ATS/IDSA 2016 recommends 7 days for ALL HAP/VAP (not 8, not 14). EXCEPTION: non-fermenting GNRs (Pseudomonas, Acinetobacter, Stenotrophomonas) — some experts extend to 10-14 days due to higher relapse rates at 8 days, though ATS/IDSA still recommends 7 days even for these. Clinical judgment applies." },
            ],
          },
          {
            line: "Adjunctive Therapies",
            options: [
              { drug: "inhaled-abx", regimen: "Inhaled aminoglycosides or colistin — NOT routinely recommended", notes: "ATS/IDSA 2016: recommends AGAINST adjunctive inhaled antibiotics for HAP/VAP. VAPORIZE trial (2024) confirmed no benefit of inhaled amikacin. Exception: may consider for MDR/XDR gram-negatives susceptible only to aminoglycosides or polymyxins, where systemic therapy alone is failing — last-resort measure, consult ID." },
            ],
          },
        ],
        organismSpecific: [
          { organism: "Pseudomonas aeruginosa (20-30% of VAP)", preferred: "Anti-pseudomonal beta-lactam (pip-tazo, cefepime, meropenem) ± second agent", alternative: "Ceftolozane-tazobactam, ceftazidime-avibactam, cefiderocol for DTR Pseudomonas", notes: "The most feared VAP pathogen. Biofilm formation on ETT complicates eradication. Empiric double-coverage is for maximizing probability of initial appropriate therapy — NOT for synergy (synergy is unproven in clinical trials for Pseudomonas VAP). Once susceptibility confirmed, de-escalate to monotherapy. Consider extending to 10-14 days for confirmed Pseudomonas VAP given higher relapse rates." },
          { organism: "MRSA (10-20% of VAP in many ICUs)", preferred: "Vancomycin (AUC 400-600) or Linezolid 600mg BID", alternative: "None with strong evidence for nosocomial pneumonia", notes: "ZEPHyR trial: linezolid vs. vancomycin for MRSA nosocomial pneumonia — linezolid was non-inferior with numerically higher clinical cure rates at end-of-study visit. Linezolid advantages: better lung penetration (ELF concentrations 5-10× serum), 100% oral bioavailability, no renal dosing needed. Linezolid disadvantages: thrombocytopenia (>14 days), serotonin syndrome, cost. Vancomycin advantages: most experience, can monitor AUC. Vancomycin disadvantages: nephrotoxicity, poor lung penetration (ELF levels only 20-30% of serum)." },
          { organism: "Klebsiella pneumoniae (including KPC)", preferred: "Meropenem (if susceptible), ceftazidime-avibactam (KPC)", alternative: "Meropenem-vaborbactam, imipenem-relebactam, cefiderocol", notes: "Carbapenem-resistant Klebsiella (KPC producers) is an ICU nightmare. Know your mechanism of resistance: KPC → ceftaz-avi or mer-vab are excellent options. MBL (NDM) → cefiderocol or aztreonam + ceftaz-avi (combination). OXA-48 → ceftaz-avi usually active. Always get ID consultation for CRE infections." },
          { organism: "Acinetobacter baumannii (MDR/XDR)", preferred: "High-dose ampicillin-sulbactam (sulbactam for Acinetobacter activity), meropenem (if susceptible)", alternative: "Polymyxin B + high-dose sulbactam ± meropenem for CRAB", notes: "CRAB (carbapenem-resistant Acinetobacter) mortality exceeds 50%. Combination therapy is standard for CRAB: sulbactam-based + polymyxin ± carbapenem. Durlobactam-sulbactam (Xacduro) — FDA approved 2023 specifically for CRAB HAP/VAP. Tigecycline: adequate in vitro activity but LOW serum/lung levels; associated with increased mortality in VAP — FDA boxed warning. Avoid tigecycline for pneumonia." },
        ],
        pearls: [
          "VAP prevention is better than VAP treatment: The VAP bundle (HOB elevation 30-45°, daily sedation vacation + SBT, DVT and stress ulcer prophylaxis, oral care, subglottic secretion drainage) reduces VAP rates by 40-70%. Pharmacists contribute to the bundle through stress ulcer and DVT prophylaxis protocols.",
          "The 7-day rule: ATS/IDSA 2016 recommends 7 days for ALL HAP/VAP. Resist the temptation to extend courses. Each additional day of broad-spectrum antibiotics in the ICU increases C. diff risk, MDR selection, and drug toxicity. The only time to consider extension is confirmed non-fermenting GNR with slow clinical response.",
          "Cefepime neurotoxicity: Often missed and underdiagnosed. Presents as confusion, myoclonus, nonconvulsive status epilepticus, and reduced consciousness. Risk factors: renal impairment, elderly, high doses. Check cefepime trough levels if available (target <20 mg/L to avoid neurotoxicity). This is a pharmacist recognition and intervention opportunity.",
          "Vancomycin lung penetration is POOR: ELF concentrations are only 20-30% of serum levels. This is why AUC targets of 400-600 are needed — you need high serum levels to get adequate lung levels. Linezolid achieves ELF concentrations 5-10× serum — a pharmacokinetic advantage for pneumonia. Discuss with the team if vancomycin is failing clinically.",
          "Tigecycline trap: Tigecycline has excellent Acinetobacter activity in vitro, but FDA boxed warning notes increased mortality. The problem is pharmacokinetic — serum and lung levels are inadequate for pneumonia. NEVER use tigecycline monotherapy for HAP/VAP. This error kills patients.",
          "Culture BEFORE antibiotics: VAP cultures become unreliable within hours of starting antibiotics. If you suspect VAP, get the ETA or BAL BEFORE the first dose. Post-antibiotic cultures may be falsely negative, leading to inappropriate de-escalation.",
          "Pseudomonas relapse: Even with 'curative' therapy, Pseudomonas VAP has a 30-40% recurrence rate. If a patient develops VAP again after treating Pseudomonas, assume it's a relapse with the same (or more resistant) strain until proven otherwise. Re-culture and consider different class antibiotics.",
        ],
      },
      {
        id: "vap-prevention",
        name: "VAP Prevention Bundle & Stewardship",
        definition: "Evidence-based interventions to prevent VAP and optimize antibiotic use in ventilated patients. Prevention is the most effective 'treatment' for VAP. The VAP bundle has been shown to reduce VAP rates by 40-70% in multiple studies.",
        clinicalPresentation: "N/A — Prevention and stewardship section.",
        diagnostics: "N/A — This section covers prevention, not diagnosis.",
        empiricTherapy: [
          {
            line: "VAP Prevention Bundle Components",
            options: [
              { drug: "hob-elevation", regimen: "Head-of-bed elevation 30-45 degrees", notes: "Reduces aspiration of colonized oropharyngeal secretions. One of the simplest and most effective interventions. Should be maintained at all times unless contraindicated (spinal injury, hemodynamic instability)." },
              { drug: "sedation-vacation", regimen: "Daily sedation interruption + spontaneous breathing trial (SBT)", notes: "Reduces duration of mechanical ventilation (the single strongest risk factor for VAP). The ABC trial (Awakening and Breathing Controlled) showed this combination reduced ICU LOS and mortality. Pharmacist role: optimize sedation protocols, advocate for daily sedation vacation, manage analgo-sedation." },
              { drug: "oral-care", regimen: "Oral care protocol (chlorhexidine 0.12% oral rinse BID — note controversy)", notes: "Chlorhexidine oral care reduces oropharyngeal colonization and has been associated with reduced VAP in many studies. HOWEVER: Deschepper et al. (2018) meta-analysis found a possible mortality INCREASE with CHG oral care in non-cardiac surgery ICU patients. Some institutions have removed CHG oral care. Know your institution's stance. Regardless, tooth brushing and oral hygiene are beneficial." },
              { drug: "subglottic-drainage", regimen: "Continuous or intermittent subglottic secretion drainage (via specialized ETT)", notes: "Reduces early-onset VAP by draining secretions pooled above the ETT cuff. Requires specialized endotracheal tube with a subglottic suction port. Meta-analyses show 45% reduction in VAP. Cost-effective. Should be standard for patients expected to be ventilated >48h." },
              { drug: "dvt-prophylaxis", regimen: "Enoxaparin 40mg SQ daily (or heparin 5000 units SQ q8-12h)", notes: "DVT prophylaxis is a bundle component for VAP prevention bundles — not directly preventing VAP but part of the comprehensive ICU quality bundle. Pharmacist role: ensure appropriate dosing, renal adjustment, anti-Xa monitoring for enoxaparin in obesity/renal impairment." },
              { drug: "stress-ulcer", regimen: "PPI or H2RA for stress ulcer prophylaxis in at-risk patients", notes: "Controversial component: PPIs may increase risk of C. diff and HAP/VAP (gastric pH elevation → bacterial overgrowth → aspiration). SUP-ICU trial (2018): pantoprazole vs. placebo in ICU patients at risk of GI bleeding — pantoprazole reduced GI bleeding but no mortality difference. Balance GI bleed prevention vs. infection risk. Pharmacist role: ensure appropriate indication and discontinue at ICU discharge." },
            ],
          },
          {
            line: "Antibiotic Stewardship in HAP/VAP",
            options: [
              { drug: "de-escalation", regimen: "Mandatory culture review at 48-72h with de-escalation plan", notes: "ATS/IDSA 2016 strongly recommends de-escalation based on culture results. Stop MRSA coverage if MRSA swab/cultures negative. Stop double Pseudomonal coverage if Pseudomonas not isolated. Switch from carbapenem to narrower agent if non-ESBL organism. Document rationale." },
              { drug: "antibiotic-timeout", regimen: "Antibiotic time-out at 48-72h and at day 7", notes: "Structured reassessment: Is there still evidence of infection? Are cultures positive? Can therapy be narrowed? Should therapy be stopped (7-day mark)? Pharmacist-driven antibiotic time-outs reduce unnecessary antibiotic days by 1-3 days per patient." },
              { drug: "pct-guided", regimen: "Procalcitonin-guided discontinuation (PCT <0.25 or >80% decline)", notes: "PTC trial (Bouadma 2010): PCT-guided strategy reduced antibiotic days by ~3 without affecting mortality. ATS/IDSA 2016 does not strongly endorse PCT for VAP diagnosis but supports its use for guiding DURATION. If PCT is trending down and patient is improving, consider stopping antibiotics even before day 7." },
            ],
          },
        ],
        organismSpecific: [],
        pearls: [
          "The pharmacist's role in VAP prevention is bigger than most realize: sedation management (less sedation = earlier extubation = less VAP), stress ulcer prophylaxis optimization, DVT prophylaxis protocols, antibiotic stewardship with de-escalation, and medication-related bundle compliance audits.",
          "Chlorhexidine oral care controversy: The cardiac surgery data strongly supports CHG oral care. The non-cardiac ICU data is murkier — Deschepper meta-analysis raised mortality concerns. Many institutions now do CHG for cardiac surgery patients only and tooth brushing + oral hygiene for all other ICU patients. Know your institution's protocol and the evidence behind it.",
          "Early mobility reduces ventilator days, which reduces VAP. Advocate for physical therapy consults in the ICU and minimize sedation to enable patient participation. The ABCDEF bundle (A: assess pain, B: both SATs and SBTs, C: choice of analgesia and sedation, D: delirium monitoring, E: early mobility, F: family engagement) is the comprehensive framework.",
          "Antibiotic stewardship in the ICU has the highest potential impact of any setting. ICU patients receive ~10× more antibiotic days than floor patients. Every unnecessary antibiotic day increases C. diff risk by ~2-3% and selects for MDR organisms that cause the next patient's infection.",
          "Subglottic secretion drainage ETTs should be placed at intubation for any patient expected to be ventilated >48-72h. This requires PROSPECTIVE identification — you can't retrofit a standard ETT. Work with respiratory therapy and anesthesia to build this into intubation protocols.",
        ],
      },
    ],
    drugMonographs: [
      {
        id: "pip-tazo",
        name: "Piperacillin-Tazobactam",
        brandNames: "Zosyn",
        drugClass: "Extended-spectrum penicillin + beta-lactamase inhibitor (BLI)",
        mechanismOfAction: "Piperacillin inhibits PBPs (acylates PBP-3 in gram-negatives, disrupting septum formation → filamentation → cell lysis). Tazobactam irreversibly inhibits class A beta-lactamases (TEM, SHV, CTX-M partially). Bactericidal. Time-dependent killing (T>MIC drives efficacy — the foundation for extended infusion).",
        spectrum: "Broadest spectrum among penicillins. Gram-negative: E. coli, Klebsiella, Proteus, Enterobacter (but NOT reliable for ESBL or AmpC producers), Pseudomonas aeruginosa, H. influenzae. Gram-positive: Streptococci, MSSA (NOT MRSA), Enterococcus faecalis. Anaerobes: Excellent — Bacteroides fragilis, Peptostreptococcus, Fusobacterium. GAPS: MRSA, ESBL producers (tazobactam has limited ESBL inhibition — MERINO trial), AmpC producers (variable), Stenotrophomonas, Acinetobacter (variable).",
        dosing: {
          standard: "3.375g IV q6h (intermittent) or 4.5g IV q8h extended infusion (over 4h)",
          extended_infusion: "4.5g IV q8h, each dose infused over 4 hours (preferred for HAP/VAP, serious infections — maximizes T>MIC)",
          continuous_infusion: "13.5-18g IV over 24h (continuous infusion — some ICUs use this for critically ill patients; requires stability data)",
          febrile_neutropenia: "4.5g IV q6h (higher dose for immunocompromised)",
          nosocomial_pneumonia: "4.5g IV q6h (or q8h extended infusion)",
        },
        renalAdjustment: "CrCl 20-40: 2.25g q6h (intermittent) or 3.375g q8h EI. CrCl <20: 2.25g q8h. Hemodialysis: 2.25g q8h + supplemental dose 0.75g after HD. CRRT: 3.375g q6-8h (facility-dependent). Extended infusion dosing in renal impairment is nuanced — consult pharmacy.",
        hepaticAdjustment: "No specific adjustment. Monitor LFTs — hepatotoxicity is rare but can occur.",
        adverseEffects: {
          common: "Diarrhea (~11%), nausea, headache, insomnia, rash",
          serious: "C. difficile, hypersensitivity/anaphylaxis (penicillin cross-reactivity), leukopenia/neutropenia (prolonged courses >10-14 days — mechanism: immune-mediated), thrombocytopenia, seizures (rare, high doses in renal impairment), interstitial nephritis",
          rare: "Drug fever, hemolytic anemia, Stevens-Johnson Syndrome",
        },
        drugInteractions: [
          "Vancomycin — Combination increases risk of AKI by 2-3× compared to pip-tazo or vancomycin alone (multiple retrospective studies, Navarro et al., Luther et al.). Mechanism debated (interstitial nephritis, tubular toxicity). If possible, use cefepime instead of pip-tazo when co-administering with vancomycin. If combination unavoidable, monitor renal function closely (BMP q24-48h).",
          "Aminoglycosides — in vitro inactivation if mixed in same IV line (piperacillin physically inactivates aminoglycosides). Administer through separate lines or flush between. This applies to tobramycin and gentamicin more than amikacin.",
          "Methotrexate — reduced renal clearance → increased MTX toxicity. Avoid combination or monitor MTX levels closely.",
          "Probenecid — blocks renal secretion of piperacillin → increased levels.",
          "Warfarin — potential enhanced anticoagulation. Monitor INR.",
          "Vecuronium — prolonged neuromuscular blockade. Monitor in OR/ICU setting.",
        ],
        monitoring: "Renal function (BMP q48-72h, especially if co-administered with vancomycin). CBC with differential weekly (neutropenia signal usually appears day 10-14). LFTs if prolonged course. Clinical response. In extended infusion, ensure adequate stability data — pip-tazo is stable at room temperature for 24h.",
        pregnancyLactation: "Category B. Generally safe in pregnancy. Used for chorioamnionitis and other obstetric infections. Compatible with breastfeeding — low breast milk excretion.",
        pharmacistPearls: [
          "THE NEPHROTOXICITY SIGNAL WITH VANCOMYCIN: The pip-tazo + vancomycin combination is associated with significantly higher rates of AKI compared to cefepime + vancomycin. Multiple studies confirm this (RR ~2-3×). If MRSA + gram-negative coverage needed, consider cefepime + vancomycin as a less nephrotoxic combination. This is one of the highest-impact pharmacist interventions in the ICU.",
          "Extended infusion is NOT optional for serious infections: Monte Carlo simulations show that standard intermittent pip-tazo (3.375g q6h over 30 min) achieves only ~60% probability of target attainment for organisms with MIC 16 (the CLSI breakpoint). Extended infusion (4.5g over 4h q8h) achieves >90%. The difference is clinical cure vs. treatment failure. Advocate for institutional extended infusion protocols.",
          "Neutropenia from pip-tazo: Immune-mediated neutropenia typically appears after 10-14 days. Monitor CBC weekly. If ANC drops, stop pip-tazo and switch to another agent. Recovery usually occurs within 3-7 days of discontinuation.",
          "Stability matters for extended infusion: Pip-tazo is stable at room temperature for 24h after reconstitution. For continuous infusion, verify stability data with your pharmacy's IV room. Ethylenediamine (EDTA)-containing formulations may have different stability profiles.",
          "Pip-tazo for Enterococcus: Piperacillin has intrinsic activity against E. faecalis (NOT E. faecium/VRE). This means pip-tazo provides empiric enterococcal coverage — useful in intra-abdominal infections. However, for serious enterococcal infections (endocarditis), use ampicillin, not pip-tazo.",
          "MERINO trial impact: Pip-tazo was inferior to meropenem for ESBL E. coli/Klebsiella bacteremia (30-day mortality 12.3% vs 3.7%). This shifted practice globally — do NOT rely on pip-tazo for known ESBL infections. However, for empiric coverage when ESBL prevalence is <10-15% in your institution, pip-tazo remains reasonable.",
          "Y-site incompatibilities: Pip-tazo is incompatible in the same line as vancomycin, aminoglycosides, and many other drugs. Always use separate lines or flush with NS between infusions. This is a common source of medication errors.",
        ],
      },
      {
        id: "cefepime",
        name: "Cefepime",
        brandNames: "Maxipime",
        drugClass: "Fourth-generation cephalosporin",
        mechanismOfAction: "Inhibits PBPs (high affinity for PBP-3). The zwitterionic structure allows rapid penetration through gram-negative outer membrane porins. Uniquely stable against AmpC beta-lactamases (chromosomal cephalosporinases) — does NOT induce AmpC like ceftriaxone/ceftazidime. Bactericidal, time-dependent killing.",
        spectrum: "Broadest spectrum of conventional cephalosporins. Gram-negative: E. coli, Klebsiella, Enterobacter/Citrobacter/Serratia (AmpC producers — stable), Pseudomonas aeruginosa, H. influenzae, Proteus, Neisseria. Gram-positive: S. pneumoniae (excellent), MSSA, Streptococci. GAPS: MRSA, ESBL producers (most, though MIC-dependent), anaerobes (poor), Enterococcus, Acinetobacter (variable), Stenotrophomonas.",
        dosing: {
          standard: "2g IV q8h (extended infusion preferred for serious infections)",
          hap_vap: "2g IV q8h (extended infusion over 3-4h)",
          meningitis: "2g IV q8h (standard infusion — need high peaks for CSF penetration)",
          febrile_neutropenia: "2g IV q8h (monotherapy per IDSA FN guidelines)",
          uti: "1-2g IV q8-12h",
          extended_infusion: "2g IV q8h, each dose infused over 3-4 hours",
        },
        renalAdjustment: "CrCl 30-60: 2g q12h. CrCl 11-29: 2g q24h. CrCl ≤10: 1g q24h. Hemodialysis: 1g q24h + supplemental dose after HD. CRRT: 1-2g q8-12h (ICU-specific). CRITICAL: dose adjustments are essential — cefepime accumulates in renal impairment and causes neurotoxicity.",
        hepaticAdjustment: "No adjustment needed — renally eliminated.",
        adverseEffects: {
          common: "Rash (~3%), diarrhea, nausea, headache, injection site reactions",
          serious: "NEUROTOXICITY (most clinically important — see pearls): confusion, myoclonus, nonconvulsive status epilepticus, encephalopathy, reduced consciousness. Also: C. difficile, hypersensitivity, leukopenia (prolonged courses), positive Coombs test (rarely clinically significant hemolysis)",
          rare: "Seizures (especially renal impairment), agranulocytosis, toxic epidermal necrolysis",
        },
        drugInteractions: [
          "Aminoglycosides — synergistic for gram-negatives (useful for Pseudomonas double-coverage). Administer separately (physical incompatibility in IV line).",
          "Probenecid — decreased renal clearance of cefepime. Monitor for toxicity.",
          "Warfarin — possible enhanced anticoagulation (vitamin K disruption from gut flora). Monitor INR.",
          "Loop diuretics (furosemide) — theoretical increase in nephrotoxicity risk. Clinical significance uncertain but monitor renal function.",
          "Valproic acid — cephalosporins (including cefepime) can reduce valproic acid levels substantially. Monitor VPA levels if co-administered.",
        ],
        monitoring: "Renal function (BMP q48-72h — guides dosing). Neurological status (mental status, myoclonus — cefepime neurotoxicity). CBC weekly for prolonged courses. Consider cefepime trough levels if available (target <20 mg/L to avoid neurotoxicity, though not widely standardized). If patient develops confusion on cefepime, consider EEG (nonconvulsive status epilepticus).",
        pregnancyLactation: "Category B. Generally considered safe in pregnancy. Low breast milk excretion — compatible with breastfeeding.",
        pharmacistPearls: [
          "CEFEPIME NEUROTOXICITY: This is underdiagnosed and the pharmacist's responsibility to catch. Risk factors: renal impairment (GFR <50), age >65, high doses without renal adjustment. Presents as altered mental status, myoclonus, tremors, confusion, and nonconvulsive status epilepticus (NCSE). If a patient on cefepime becomes confused — check renal function, check dose appropriateness, and consider EEG. Trough >20 mg/L associated with neurotoxicity. Symptoms are REVERSIBLE upon discontinuation.",
          "AmpC stability is cefepime's superpower: For SPACE organisms (Serratia, Providencia, Acinetobacter, Citrobacter freundii, Enterobacter), cefepime is SUPERIOR to ceftriaxone. Ceftriaxone can induce AmpC beta-lactamase production → clinical failure even if initially susceptible. Cefepime passes through the AmpC without being hydrolyzed. This is why cefepime is preferred for Enterobacter, Citrobacter, and Serratia infections.",
          "Extended infusion matters: Like all beta-lactams, cefepime's efficacy depends on T>MIC. Extended infusion (3-4h) increases the probability of target attainment from ~60-70% to >90% for organisms with MIC at breakpoint. This is especially important for Pseudomonas, which tends to have higher MICs.",
          "Cefepime vs. pip-tazo when combined with vancomycin: Cefepime + vancomycin causes significantly LESS nephrotoxicity than pip-tazo + vancomycin (RR reduction ~50%). When MRSA + gram-negative coverage is needed, cefepime is the preferred beta-lactam backbone. Note: cefepime lacks anaerobic coverage — add metronidazole if anaerobes are a concern.",
          "Febrile neutropenia: Cefepime 2g IV q8h is one of the first-line monotherapy options per IDSA FN guidelines. Its broad gram-negative coverage (including Pseudomonas) and gram-positive coverage (including streptococci) make it well-suited for neutropenic patients.",
          "Cefepime has NO anaerobic coverage. This is a critical gap: if aspiration component is suspected in HAP/VAP, add metronidazole. Or switch to pip-tazo which covers anaerobes inherently. This decision point matters clinically.",
          "Cross-reactivity with penicillin: Cefepime has a different R1 side chain than most penicillins. Cross-reactivity risk with reported penicillin allergy is ~1-2%. Most patients with penicillin allergy can receive cefepime safely. Use clinical judgment and allergy history (urticaria/anaphylaxis vs. remote vague 'allergy').",
        ],
      },
      {
        id: "vancomycin",
        name: "Vancomycin",
        brandNames: "Vancocin (oral), various IV manufacturers",
        drugClass: "Glycopeptide antibiotic",
        mechanismOfAction: "Binds to D-Ala-D-Ala terminus of peptidoglycan precursors (lipid II), preventing transglycosylation and transpeptidation. Inhibits cell wall synthesis at a step PRIOR to the PBPs (which is why it works against MRSA — MRSA modifies PBPs but vancomycin bypasses PBPs entirely). Bactericidal against most organisms. Slow concentration-dependent killing (AUC/MIC is the primary PK/PD driver).",
        spectrum: "GRAM-POSITIVE ONLY. Excellent: MRSA, MSSA (inferior to beta-lactams for MSSA — important), coagulase-negative Staphylococci, Streptococci (including S. pneumoniae), Enterococcus faecalis (NOT VRE), Clostridium difficile (oral only — does not reach colon systemically). GAPS: ALL gram-negatives (no activity), VRE (vanB/vanA), some CoNS with vancomycin MIC creep.",
        dosing: {
          standard_iv: "15-20 mg/kg IV q8-12h (based on ACTUAL body weight), loading dose 25-30 mg/kg for seriously ill",
          auc_guided: "Target AUC/MIC 400-600 mg·h/L (2020 ASHP/IDSA/SIDP/PIDS consensus — preferred over trough-based dosing)",
          loading_dose: "25-30 mg/kg IV × 1 (for serious infections, sepsis, meningitis — maximum ~3g single dose)",
          oral_cdiff: "125mg PO QID × 10 days (for C. diff — IV vancomycin does NOT reach the colon)",
          trough_based: "Troughs 15-20 mg/L (LEGACY method — AUC-guided is now preferred due to less nephrotoxicity)",
          obese: "Use actual body weight for dosing. Obese patients need higher doses. Consider loading dose 25-30 mg/kg.",
        },
        renalAdjustment: "Vancomycin is primarily renally cleared. Dosing must be individualized. Reduced CrCl → extend interval. CrCl <30: may dose q24-48h. Hemodialysis: dose post-HD (removed ~30% by conventional HD; less by high-flux). CRRT: 15-20 mg/kg q24h (institution-dependent). AUC-guided dosing handles renal adjustment automatically through Bayesian software. Always use clinical pharmacokinetics consultation for complex patients.",
        hepaticAdjustment: "No adjustment needed — not hepatically metabolized.",
        adverseEffects: {
          common: "Red Man Syndrome (histamine-mediated infusion reaction — NOT allergy; prevent by slowing infusion rate to ≥1h, can premedicate with diphenhydramine), nephrotoxicity (AKI — risk increases with troughs >20, concurrent nephrotoxins, prolonged courses)",
          serious: "Nephrotoxicity (dose-dependent, increased with pip-tazo combination), ototoxicity (usually with concurrent aminoglycosides or very high levels), DRESS syndrome, linear IgA bullous dermatosis, neutropenia/thrombocytopenia (immune-mediated, prolonged courses >14 days)",
          rare: "Vancomycin-induced linear IgA bullous dermatosis (LABD — drug-induced blistering skin disease), anaphylaxis (true IgE-mediated — distinct from Red Man Syndrome)",
        },
        drugInteractions: [
          "Piperacillin-tazobactam — SYNERGISTIC NEPHROTOXICITY. AKI risk 2-3× higher than vancomycin alone or cefepime + vancomycin. If possible, substitute cefepime for pip-tazo when vancomycin is needed.",
          "Aminoglycosides — additive nephrotoxicity AND ototoxicity. Monitor renal function and drug levels closely. Avoid prolonged concurrent use if possible.",
          "Loop diuretics (furosemide) — additive ototoxicity risk, potential volume depletion → increased vancomycin levels.",
          "IV contrast — additive nephrotoxicity. Hydrate adequately and hold vancomycin if possible around contrast administration.",
          "NSAIDs — may decrease renal clearance of vancomycin → increased levels. Monitor.",
        ],
        monitoring: "AUC-guided dosing (preferred): Use Bayesian software (PrecisePK, DoseMeRx, InsightRx). Draw 2 levels per dosing interval (peak 1-2h post-infusion, trough before next dose) for first estimation, then 1 level per interval for subsequent adjustments. Target AUC 400-600. If Bayesian software unavailable: trough-based dosing with target 15-20 mg/L (legacy method). Monitor: BMP q48-72h (SCr, BUN), CBC weekly (neutropenia), signs of ototoxicity (hearing changes), infusion reactions.",
        pregnancyLactation: "Category C (limited human data). Used in pregnancy when benefits outweigh risks (MRSA infections, penicillin allergy for GBS prophylaxis). Potential fetal auditory nerve damage reported in animals at very high doses. Compatible with breastfeeding — poorly absorbed orally by infant.",
        pharmacistPearls: [
          "AUC-GUIDED DOSING IS THE NEW STANDARD: The 2020 ASHP/IDSA/SIDP/PIDS consensus guideline recommends AUC/MIC 400-600 over trough-based dosing. AUC-guided dosing achieves EQUIVALENT efficacy with 25-40% LESS nephrotoxicity compared to trough-based targeting. If your institution is still using trough goals of 15-20, champion the transition to AUC-guided protocols. Bayesian software makes this practical.",
          "Red Man Syndrome is NOT an allergy: It's a rate-related histamine release reaction. Slow the infusion (infuse over ≥2 hours), premedicate with diphenhydramine 25-50mg. Do NOT label the patient as 'vancomycin-allergic' for Red Man Syndrome. True vancomycin allergy (anaphylaxis, DRESS, LABD) is different and rare.",
          "Vancomycin is INFERIOR to beta-lactams for MSSA: Multiple studies show higher mortality, higher treatment failure, and slower bactericidal activity when vancomycin is used for MSSA vs. nafcillin/oxacillin/cefazolin. ALWAYS de-escalate from vancomycin to a beta-lactam when MSSA is confirmed. This is a life-saving intervention.",
          "Loading dose: 25-30 mg/kg (actual body weight, cap ~3g) for seriously ill patients achieves therapeutic levels 12-24h faster. Calculate carefully in obese patients. A 120kg patient needs a 3g loading dose — this is a large dose but pharmacokinetically appropriate.",
          "The pip-tazo + vancomycin nephrotoxicity signal is robust: At least 15 studies show ~2-3× increased AKI risk. The ACORN trial (2023) partially addressed this. If you must combine vancomycin with an anti-pseudomonal beta-lactam, cefepime is the safer choice. This is a pharmacist stewardship opportunity that prevents harm.",
          "Oral vancomycin does NOT achieve systemic levels. ONLY use oral vancomycin for C. diff colitis. IV vancomycin does NOT reach the colonic lumen at therapeutic levels. These are completely different clinical uses despite being the same drug.",
          "MIC creep: Some MRSA strains have vancomycin MIC of 2 (susceptible but at the breakpoint). At MIC = 2, achieving AUC/MIC 400 requires very high serum levels, increasing nephrotoxicity risk. If MRSA MIC = 2, consider linezolid or daptomycin (for non-pneumonia indications) instead. For pneumonia specifically, linezolid may be preferred at MIC = 2.",
          "Vancomycin trough timing: Draw the trough within 30 minutes BEFORE the next dose (at true steady-state, typically before the 4th dose). Incorrectly timed troughs lead to dosing errors. For AUC-guided dosing, draw a peak 1-2h after the end of infusion AND a trough — both levels feed into the Bayesian calculation.",
        ],
      },
      {
        id: "linezolid",
        name: "Linezolid",
        brandNames: "Zyvox",
        drugClass: "Oxazolidinone (first-in-class)",
        mechanismOfAction: "Binds to the 23S rRNA of the 50S ribosomal subunit at the peptidyl transferase center, preventing formation of the 70S initiation complex. Blocks the very first step of translation (initiation complex formation) — a unique mechanism shared by no other antibiotic class. Bacteriostatic against staphylococci and enterococci. Bactericidal against streptococci. Importantly: as a ribosomal inhibitor, linezolid SUPPRESSES TOXIN PRODUCTION (PVL, TSST-1, alpha-hemolysin) — relevant for toxin-mediated disease.",
        spectrum: "GRAM-POSITIVE ONLY. Excellent: MRSA (all strains including hVISA/VISA), VRE (E. faecium and E. faecalis — one of few oral options), MSSA, Streptococci (including DRSP), Nocardia, some Mycobacteria (M. tuberculosis — component of bedaquiline-based MDR-TB regimens). GAPS: ALL gram-negatives, ALL anaerobes (variable, not reliable).",
        dosing: {
          standard: "600mg PO/IV BID (100% oral bioavailability — PO = IV)",
          pneumonia: "600mg PO/IV BID × 7-10 days",
          ssti: "600mg PO/IV BID × 10-14 days (400mg BID for uncomplicated SSTI)",
          vre: "600mg PO/IV BID",
          mdr_tb: "600mg PO daily (reduced dose for prolonged use to minimize toxicity)",
        },
        renalAdjustment: "No dose adjustment needed for any level of renal impairment, including dialysis. 30% removed by HD — give dose after HD as a precaution but no dose change. This is a MAJOR advantage over vancomycin in renal impairment.",
        hepaticAdjustment: "No adjustment for mild-moderate (Child-Pugh A/B). Caution in severe hepatic impairment. Linezolid is a weak reversible MAOI — hepatic dysfunction may increase serotonergic risk.",
        adverseEffects: {
          common: "Nausea, diarrhea, headache, insomnia, altered taste (metallic)",
          serious: "Myelosuppression (thrombocytopenia most common, then anemia, then neutropenia — dose- and duration-dependent, usually >10-14 days), serotonin syndrome (MAOI activity — see interactions), peripheral and optic neuropathy (prolonged use >28 days, may be irreversible), lactic acidosis (mitochondrial toxicity, prolonged use)",
          rare: "Optic neuritis (vision changes — counsel patients), hypoglycemia (MAOI effect on insulin secretion), convulsions",
        },
        drugInteractions: [
          "SSRIs/SNRIs (sertraline, fluoxetine, venlafaxine, duloxetine, etc.) — SEROTONIN SYNDROME RISK. Linezolid is a reversible, non-selective MAO inhibitor. Concurrent use with serotonergic drugs can cause life-threatening serotonin syndrome (hyperthermia, rigidity, myoclonus, autonomic instability). FDA has issued specific warnings. Management: ideally hold SSRI/SNRI, or if linezolid is essential and short-course (<14 days), monitor very closely with daily assessment.",
          "Tyramine-rich foods — MAOI effect means potential hypertensive crisis with high-tyramine foods (aged cheese, cured meats, draft beer, fermented foods). Practical significance is LOW with linezolid (it's a weak, reversible MAOI), but counsel patients to avoid excessive quantities.",
          "Tramadol, meperidine, methadone — serotonergic effects + MAOI → serotonin syndrome risk. Avoid meperidine absolutely. Tramadol and methadone: use with caution.",
          "Sympathomimetics (pseudoephedrine, phenylephrine) — MAOI potentiation → hypertensive crisis. Avoid OTC cold medications containing these during linezolid therapy.",
          "Insulin/oral hypoglycemics — linezolid can cause hypoglycemia via MAOI mechanism. Monitor blood glucose in diabetic patients.",
        ],
        monitoring: "CBC with differential weekly (thrombocytopenia is the red flag — usually appears day 10-14). Visual acuity assessment if course exceeds 28 days (optic neuropathy). Lactate if prolonged course and symptoms of lactic acidosis (nausea, vomiting, fatigue). Blood glucose in diabetics. Serotonin syndrome assessment (mental status, vital signs, neuromuscular exam) especially if on serotonergic drugs.",
        pregnancyLactation: "Category C. Limited human data. Animal studies showed decreased fetal viability. Use only if benefit clearly outweighs risk. Breastfeeding: enters breast milk — weigh risks and benefits.",
        pharmacistPearls: [
          "100% ORAL BIOAVAILABILITY: There is ZERO pharmacokinetic reason to use IV linezolid in a patient who can swallow. This is one of the most impactful IV-to-PO conversion opportunities. The cost difference is enormous (~$150-300/day IV vs. ~$60-100/day PO, varies by institution).",
          "Lung penetration superiority: Linezolid achieves ELF (epithelial lining fluid) concentrations that are 5-10× serum levels. Vancomycin ELF levels are only 20-30% of serum. This pharmacokinetic advantage is why many experts prefer linezolid for MRSA pneumonia, and why the ZEPHyR trial showed numerically better outcomes.",
          "Toxin suppression: As a ribosomal inhibitor, linezolid suppresses production of staphylococcal toxins (PVL, TSST-1, alpha-hemolysin). Vancomycin (a cell wall agent) does NOT suppress toxins. For PVL-positive MRSA necrotizing pneumonia or toxic shock syndrome, linezolid (or clindamycin) should be part of the regimen for toxin suppression. This is a pharmacology-based clinical pearl that saves lives.",
          "Thrombocytopenia is the duration-limiting toxicity: Monitor CBC weekly. Platelet count typically drops after day 10-14. If platelets drop below 100K or drop >50% from baseline, consider discontinuation. Recovery usually occurs within 5-7 days. For prolonged courses (TB, bone/joint infections), this becomes a real limiting factor.",
          "The serotonin syndrome risk is REAL but manageable: ~50% of hospitalized patients are on SSRIs/SNRIs. You CANNOT always stop the SSRI. For short courses (<14 days), many experts continue the SSRI with close monitoring (daily assessment for agitation, tremor, diaphoresis, clonus). For longer courses, discuss with psychiatry about temporary SSRI hold or alternative antibiotic. Document your risk-benefit analysis.",
          "No renal dosing needed: In contrast to vancomycin (which requires complex PK monitoring and dose adjustments), linezolid needs no renal adjustment at any GFR. For MRSA infections in patients with fluctuating renal function, AKI, or dialysis, linezolid is often the simpler and safer choice.",
          "Linezolid-resistant organisms are rare but emerging: cfr gene (methylation of 23S rRNA) and optrA gene confer resistance. Prevalence is <1% for MRSA but up to 5-10% for some VRE strains. If linezolid resistance is suspected, daptomycin is the alternative for non-pulmonary infections.",
        ],
      },
      {
        id: "meropenem",
        name: "Meropenem",
        brandNames: "Merrem",
        drugClass: "Carbapenem (beta-lactam)",
        mechanismOfAction: "Binds to PBPs (high affinity for PBP-2 and PBP-3 in gram-negatives). Uniquely stable against class A, C, and D serine beta-lactamases (including ESBLs and AmpC) — but NOT stable against metallo-beta-lactamases (MBLs: NDM, VIM, IMP) or KPC (class A carbapenemase). Bactericidal, time-dependent killing.",
        spectrum: "The broadest-spectrum conventional antibiotic. Gram-negative: E. coli, Klebsiella, Enterobacter, Serratia, Citrobacter (including ESBL and AmpC producers), Pseudomonas aeruginosa, H. influenzae, Neisseria. Gram-positive: Streptococci, MSSA (less active than cefazolin for MSSA), Listeria (imipenem better). Anaerobes: Excellent — Bacteroides fragilis, Clostridium (except C. diff). GAPS: MRSA, VRE, Stenotrophomonas maltophilia (intrinsically resistant), Mycoplasma/Chlamydophila, CRE (KPC, MBL producers).",
        dosing: {
          standard: "1g IV q8h",
          extended_infusion: "1-2g IV q8h, each dose infused over 3 hours (preferred for serious infections — maximizes T>MIC)",
          meningitis: "2g IV q8h (standard infusion — need high Cmax for CSF penetration)",
          hap_vap: "1-2g IV q8h (extended infusion; 2g for Pseudomonas MIC close to breakpoint)",
          febrile_neutropenia: "1g IV q8h (IDSA-recommended monotherapy option)",
          esbl_bacteremia: "1g IV q8h (standard of care per MERINO trial)",
        },
        renalAdjustment: "CrCl 26-50: 1g q12h. CrCl 10-25: 500mg q12h. CrCl <10: 500mg q24h. Hemodialysis: 500mg q24h + supplemental dose after HD. CRRT: 1g q8-12h (institution-dependent). Extended infusion adjustments may differ — consult pharmacy PK service.",
        hepaticAdjustment: "No adjustment needed. Renally eliminated.",
        adverseEffects: {
          common: "Diarrhea (~5%), nausea/vomiting, headache, rash, injection site reaction",
          serious: "C. difficile (broad-spectrum → high ecological damage), seizures (LOWER risk than imipenem — meropenem is the preferred carbapenem in CNS infections), hypersensitivity/anaphylaxis, leukopenia/thrombocytopenia (prolonged courses)",
          rare: "Stevens-Johnson Syndrome, hepatotoxicity, hemolytic anemia",
        },
        drugInteractions: [
          "Valproic acid — CRITICAL INTERACTION. Carbapenems (meropenem, imipenem, ertapenem, doripenem) drastically reduce valproic acid levels (by 60-100%) within 24 hours. The interaction is NOT manageable by increasing VPA dose. If a patient on valproic acid needs a carbapenem, switch the antiepileptic (e.g., to levetiracetam) for the duration of carbapenem therapy. NEVER co-administer.",
          "Probenecid — blocks renal secretion → increased meropenem levels. Avoid combination.",
          "Aminoglycosides — physically incompatible in the same IV line. Administer separately.",
        ],
        monitoring: "Renal function (BMP q48-72h — dose adjustments needed in AKI). Seizure activity (lower risk than imipenem, but monitor in CNS disease, renal impairment, or elderly). CBC weekly for prolonged courses. C. diff surveillance (any new diarrhea). LFTs periodically.",
        pregnancyLactation: "Category B. Limited human data but no evidence of teratogenicity. Used in pregnancy for serious infections when benefits outweigh risks. Enters breast milk in low concentrations — likely compatible with breastfeeding.",
        pharmacistPearls: [
          "THE VALPROIC ACID INTERACTION: This is a HARD STOP interaction. All carbapenems reduce VPA levels by 60-100% within 24 hours, and increasing VPA dose does NOT compensate. The mechanism is multifactorial (increased glucuronidation, impaired enterohepatic recirculation). Solution: switch VPA to levetiracetam (or another non-interacting AED) before starting the carbapenem. Switch back after the carbapenem course ends. This is a pharmacist-driven intervention that prevents breakthrough seizures.",
          "Extended infusion is standard of care for serious infections: Meropenem's PK/PD target is T>MIC >40-50%. Extended infusion (3h) dramatically improves the probability of target attainment, especially for Pseudomonas (MIC breakpoint = 2). For MIC = 2: standard bolus achieves ~60% PTA; extended infusion achieves >95%. This difference can be the difference between clinical cure and failure.",
          "Meropenem vs. Imipenem: Meropenem has LOWER seizure risk (does NOT antagonize GABA receptors like imipenem). Preferred in CNS infections (meningitis, brain abscess), renal impairment, and elderly patients. Imipenem has slightly better gram-positive coverage (Enterococcus faecalis).",
          "CARBAPENEM STEWARDSHIP: Meropenem is the broadest-spectrum standard antibiotic. Every unnecessary day of meropenem selects for CRE — the most feared resistance mechanism. De-escalate AGGRESSIVELY: if cultures show susceptibility to ceftriaxone, pip-tazo, or other narrower agents, SWITCH. If ESBL but non-Pseudomonal, consider ertapenem (narrowest carbapenem). Document your de-escalation rationale.",
          "ESBL gold standard: MERINO trial established meropenem as the definitive treatment for ESBL E. coli/Klebsiella bacteremia. Pip-tazo failed non-inferiority. For serious ESBL infections (bacteremia, HAP/VAP), carbapenems remain the standard of care. Don't let stewardship pressure override this evidence when the patient needs a carbapenem.",
          "Meropenem has poor CSF penetration with inflamed meninges (~10-20% of serum). Despite this, it achieves concentrations above the MIC for most CNS pathogens. Dose at 2g q8h for meningitis — standard infusion (need high peaks for CSF penetration, unlike the extended infusion approach for non-CNS infections).",
        ],
      },
    ],
  },
  {
    id: "ssti",
    name: "Skin & Soft Tissue Infections",
    icon: "🩹",
    category: "Infectious Disease",
    overview: {
      definition: "Skin and soft tissue infections (SSTIs) encompass a spectrum from superficial impetigo to life-threatening necrotizing fasciitis. The 2014 IDSA SSTI guidelines classify infections by the critical decision point: PURULENT vs NON-PURULENT. This distinction drives empiric therapy — purulent infections require Staphylococcal coverage (including MRSA), while non-purulent infections are primarily Streptococcal and may not need MRSA coverage unless risk factors present.",
      epidemiology: "SSTIs account for ~14 million outpatient visits and ~870,000 hospitalizations annually in the US. Cellulitis and abscess are the most common subtypes. MRSA prevalence in purulent SSTIs varies by region (30-75% in many US EDs). Community-associated MRSA (CA-MRSA, predominantly USA300/ST8) has been the dominant purulent SSTI pathogen since the early 2000s. Necrotizing fasciitis is rare (~1,000 cases/year in the US) but carries 20-40% mortality.",
      keyGuidelines: [
        { name: "IDSA 2014 SSTI Guidelines (Practice Guidelines for the Diagnosis and Management of SSTIs)", detail: "Current definitive US guideline. Key framework: purulent vs non-purulent classification. Emphasizes I&D as primary therapy for purulent SSTIs, oral antibiotics for mild-moderate, IV for severe. Defines mild (no systemic signs), moderate (systemic signs), and severe (failed oral therapy, immunocompromised, signs of deep infection/necrotizing). Recommends AGAINST antibiotics for uncomplicated abscesses after adequate I&D in mild disease." },
        { name: "IDSA 2023 Diabetic Foot Infection Guidelines (Update)", detail: "Updated DFI guidance emphasizing wound classification (IDSA/IWGDF severity), probe-to-bone test, MRI for osteomyelitis, and culture-directed therapy. Shorter antibiotic courses endorsed (1-2 weeks soft tissue, 4-6 weeks osteomyelitis). Stresses multidisciplinary approach: ID, surgery, vascular, podiatry, wound care." },
        { name: "IDSA 2011 MRSA Guidelines", detail: "Comprehensive MRSA management including SSTIs. Recommends I&D alone for uncomplicated abscesses; TMP-SMX or doxycycline for outpatient MRSA SSTI; vancomycin, daptomycin, linezolid, or clindamycin for severe MRSA SSTI. Still widely referenced despite age." },
        { name: "Surviving Sepsis Campaign 2021", detail: "Relevant for necrotizing fasciitis with sepsis — 1-hour antibiotic bundle, aggressive resuscitation, emergent surgical source control." },
      ],
      landmarkTrials: [
        { name: "Talan et al. (2016, NEJM) — TMP-SMX for Abscess After I&D", detail: "Landmark RCT: TMP-SMX added to I&D for uncomplicated abscess improved cure rates (80.5% vs 73.6%) and reduced new abscesses and skin infections at 1 month. Changed practice — previously many guidelines said I&D alone was sufficient for uncomplicated abscess. Supports adding oral antibiotics after I&D for most purulent SSTIs." },
        { name: "ESTABLISH-1 & ESTABLISH-2 (Moran et al., 2017, NEJM)", detail: "Clindamycin vs TMP-SMX for uncomplicated SSTI (abscess + cellulitis). Both were equivalent for cure rates (~83%). TMP-SMX had fewer adverse effects than clindamycin. Established TMP-SMX and clindamycin as equivalent first-line oral MRSA options." },
        { name: "Daum et al. (2017, NEJM) — Clindamycin vs TMP-SMX in Children", detail: "Pediatric SSTI trial. Clindamycin and TMP-SMX were equivalent in children with uncomplicated SSTIs. TMP-SMX preferred by many due to fewer GI side effects and lower C. diff risk." },
        { name: "SOLO I & II (Dalbavancin, 2014-2015, NEJM)", detail: "Dalbavancin (long-acting lipoglycopeptide) single IV dose or 2-dose regimen was non-inferior to vancomycin followed by linezolid for ABSSSI. Demonstrated feasibility of single-dose SSTI treatment — relevant for patients with adherence challenges, IVDU, or OPAT candidates." },
        { name: "Eron Classification (2003)", detail: "Foundational severity classification for SSTIs: Class 1 (afebrile, healthy), Class 2 (febrile OR comorbid), Class 3 (toxic/septic OR limb-threatening), Class 4 (necrotizing/sepsis). Guides disposition: Class 1 = outpatient, Class 2 = outpatient or observation, Class 3 = inpatient IV, Class 4 = ICU + surgery." },
        { name: "Wong et al. LRINEC Score (2004)", detail: "Laboratory Risk Indicator for Necrotizing Fasciitis. Scoring system (WBC, hemoglobin, sodium, glucose, creatinine, CRP) to identify necrotizing fasciitis. Score >=6 has PPV of 92%. Useful screening tool but should NOT delay surgical exploration if clinical suspicion is high — sensitivity is imperfect and false negatives kill." },
      ],
      riskFactors: "Skin breaks (trauma, surgical wounds, injection drug use, dermatitis, tinea pedis), obesity, diabetes mellitus, peripheral vascular disease, lymphedema, chronic venous insufficiency, immunosuppression (HIV, transplant, steroids), prior SSTI/cellulitis (recurrence rate 20-40%), prior MRSA colonization/infection, household MRSA contacts, crowded living conditions (shelters, prisons), recent hospitalization, chronic wounds.",
    },
    subcategories: [
      {
        id: "nonpurulent-ssti",
        name: "Non-Purulent SSTI (Cellulitis & Erysipelas)",
        definition: "Non-purulent SSTIs lack a drainable focus of pus. Includes cellulitis (deeper dermis/subcutaneous tissue) and erysipelas (superficial dermis/lymphatics with sharply demarcated raised borders). Primarily caused by beta-hemolytic Streptococci (Group A Strep predominates). S. aureus is a less common cause in TRUE non-purulent cellulitis without wound/trauma entry point. IDSA 2014: empiric therapy should target Streptococci; MRSA coverage is NOT routinely needed unless specific risk factors present.",
        clinicalPresentation: "Erysipelas: well-demarcated, raised, erythematous, painful plaque, often on face or lower extremities. Peau d'orange texture. Rapid onset with fever/chills. Cellulitis: poorly demarcated, spreading erythema, warmth, tenderness, edema. Lower extremities most common. May have lymphangitis (red streaking). Fever present in moderate-severe. CRITICAL MIMICS to rule out: DVT (unilateral leg swelling), stasis dermatitis (bilateral, chronic, pruritic), contact dermatitis, gout/septic arthritis (periarticular), necrotizing fasciitis (pain out of proportion, dusky skin, crepitus, rapid progression).",
        diagnostics: "CLINICAL DIAGNOSIS — no specific labs required for mild cellulitis. Blood cultures: positive in only 2-5% of cellulitis cases; obtain only if severe/septic, immunocompromised, or special exposures (water, animal bite). Wound cultures: N/A for non-purulent cellulitis (no wound to culture). Skin biopsy/aspirate: very low yield (<30%), NOT recommended routinely. Mark borders with pen to track progression. Imaging: NOT routine; ultrasound if concern for occult abscess; CT/MRI if concern for necrotizing fasciitis or osteomyelitis.",
        empiricTherapy: [
          {
            line: "First-Line — Mild (Outpatient, Oral)",
            options: [
              { drug: "cephalexin-ssti", regimen: "Cephalexin 500mg PO QID (or 1000mg PO BID)", notes: "IDSA 2014 first-line for non-purulent cellulitis. Targets Streptococci and MSSA. NO MRSA coverage. QID dosing is traditional but BID dosing of 1g achieves adequate T>MIC and improves adherence — many experts now prefer this. Duration: 5 days (IDSA), extend to 7-10 if slow response." },
              { drug: "dicloxacillin-ssti", regimen: "Dicloxacillin 500mg PO QID", notes: "Alternative first-line. Anti-staphylococcal penicillin. Narrower spectrum than cephalexin. Must be taken on empty stomach (1h before or 2h after meals). Poor adherence due to QID + empty stomach. Cephalexin preferred by most clinicians." },
              { drug: "clindamycin-ssti-oral", regimen: "Clindamycin 300-450mg PO TID", notes: "Alternative if penicillin allergy. Covers Streptococci, MSSA, most CA-MRSA (check local susceptibility — resistance rising, now 15-25% in some areas). Also covers anaerobes. C. diff risk higher than beta-lactams. Use when MRSA coverage desired in outpatient non-purulent SSTI with risk factors." },
            ],
          },
          {
            line: "First-Line — Moderate/Severe (Inpatient, IV)",
            options: [
              { drug: "cefazolin", regimen: "Cefazolin 2g IV q8h", notes: "IDSA 2014 first-line IV for non-purulent cellulitis requiring hospitalization. MSSA + Streptococcal coverage. The simplest, narrowest IV option. No MRSA coverage — add vancomycin only if MRSA risk factors present. Convert to oral cephalexin when improving." },
              { drug: "nafcillin-ssti", regimen: "Nafcillin 2g IV q4h (or Oxacillin 2g IV q4h)", notes: "Anti-staphylococcal penicillins. Narrowest anti-MSSA agents. Superior to vancomycin for MSSA (multiple studies show faster bactericidal activity). Disadvantages: q4h dosing, phlebitis, hepatotoxicity (oxacillin > nafcillin), interstitial nephritis. Cefazolin is generally preferred due to ease of dosing." },
            ],
          },
          {
            line: "ADD MRSA Coverage If Risk Factors Present",
            options: [
              { drug: "vancomycin-ssti", regimen: "Vancomycin IV (AUC/MIC 400-600) — add to cefazolin", notes: "Add MRSA coverage for: prior MRSA infection/colonization, IVDU, failed initial beta-lactam therapy, penetrating trauma, concurrent purulent wound. Continue cefazolin for Streptococcal coverage — vancomycin alone has suboptimal Streptococcal killing kinetics. De-escalate when cultures return." },
              { drug: "linezolid-ssti", regimen: "Linezolid 600mg IV/PO BID", notes: "Alternative to vancomycin for MRSA cellulitis. 100% oral bioavailability. FDA-approved for complicated SSTIs. Advantage: PO = IV, no renal dosing, no levels to monitor. Disadvantage: cost, myelosuppression risk if >14 days, serotonin syndrome risk." },
            ],
          },
          {
            line: "Duration",
            options: [
              { drug: "duration-cellulitis", regimen: "5 days (IDSA 2014), extend to 7-10 days if slow clinical response", notes: "IDSA 2014 recommends 5 days for uncomplicated cellulitis, with extension if not improved. Multiple RCTs support 5-day courses as non-inferior to 10 days. Longer courses (10-14 days) may be needed for: immunosuppressed patients, slow-responding infections, cellulitis with associated bacteremia. Reassess at 48-72h — failure to improve should prompt imaging (abscess? necrotizing?) and broadening." },
            ],
          },
        ],
        organismSpecific: [
          { organism: "Group A Streptococcus (S. pyogenes)", preferred: "Penicillin VK, amoxicillin, cephalexin, cefazolin", alternative: "Clindamycin (if penicillin-allergic), azithromycin", notes: "GAS is the PREDOMINANT cause of true non-purulent cellulitis. Universally penicillin-susceptible — no resistance. Penicillin VK 500mg QID is technically the most targeted oral agent but cephalexin is used more often due to broader coverage of potential co-pathogens. For severe/invasive GAS (necrotizing fasciitis, toxic shock): add clindamycin for toxin suppression." },
          { organism: "S. aureus (MSSA)", preferred: "Cefazolin IV, cephalexin PO, nafcillin/oxacillin IV", alternative: "Clindamycin, dicloxacillin", notes: "MSSA causes cellulitis particularly when there's a wound, surgical site, or device entry point. Cefazolin is SUPERIOR to vancomycin for MSSA — this has been demonstrated repeatedly. Always de-escalate from vancomycin to cefazolin/nafcillin when MSSA confirmed." },
          { organism: "MRSA (if risk factors present)", preferred: "TMP-SMX PO, doxycycline PO (outpatient); vancomycin IV, daptomycin IV, linezolid IV/PO (inpatient)", alternative: "Clindamycin PO/IV (check susceptibility — D-test for inducible resistance)", notes: "MRSA is NOT the primary cause of non-purulent cellulitis in most patients. However, always consider MRSA if: prior MRSA, IVDU, failed beta-lactam, purulent component develops. CA-MRSA (USA300) remains susceptible to TMP-SMX (>95%) and doxycycline (>95%) in most regions." },
        ],
        pearls: [
          "THE PURULENT vs NON-PURULENT DISTINCTION IS THE SINGLE MOST IMPORTANT DECISION IN SSTI: Non-purulent = Streptococcal = beta-lactam. Purulent = Staphylococcal = consider MRSA. Reflexive MRSA coverage for all cellulitis is inappropriate and drives resistance.",
          "Bilateral cellulitis is almost NEVER bilateral cellulitis. If both legs are red, think stasis dermatitis, contact dermatitis, or heart failure — not infection. True bilateral cellulitis is exceedingly rare and should prompt investigation for alternative diagnoses.",
          "Mark the borders with a pen and timestamp. This is the most reliable way to track response to therapy. Cellulitis frequently looks WORSE in the first 24-48 hours due to ongoing inflammation even with effective antibiotics. Don't panic-switch antibiotics at 24h — reassess at 48-72h.",
          "Predisposing factors drive recurrence: Tinea pedis is the #1 modifiable risk factor for lower extremity cellulitis. Treating the tinea (topical antifungal) and maintaining skin hydration reduces cellulitis recurrence by 50%+. Lymphedema management (compression, elevation) is the other major intervention.",
          "Blood cultures in cellulitis are almost always negative (<5% positive). IDSA says obtain only if: severe sepsis, immunocompromised, special exposures (water/animal bite), or failed outpatient therapy. Don't order blood cultures reflexively on every cellulitis admission — it wastes resources.",
          "Cephalexin BID vs QID: Pharmacokinetically, cephalexin 1000mg BID achieves comparable T>MIC to 500mg QID for susceptible Streptococci and MSSA (MIC <=2). BID dosing dramatically improves adherence. Many ID pharmacists now recommend the BID regimen as default.",
          "Outpatient parenteral antibiotic therapy (OPAT) with cefazolin: Cefazolin has the longest half-life of first-gen cephalosporins (~2h). Can be given as 2g IV q8h in a clinic setting or via home infusion. For cellulitis failing oral therapy but not requiring admission, OPAT cefazolin is an excellent step-up before hospitalization.",
          "Elevation is therapeutic: Lower extremity cellulitis improves significantly with leg elevation above the heart. This reduces edema, improves lymphatic drainage, and accelerates resolution. It is an actual therapeutic intervention, not just comfort care.",
        ],
      },
      {
        id: "purulent-ssti",
        name: "Purulent SSTI (Abscess, Furuncle, Carbuncle)",
        definition: "Purulent SSTIs are characterized by a drainable collection of pus. Includes cutaneous abscesses, furuncles (infected hair follicles), and carbuncles (coalescent furuncles). S. aureus is the dominant pathogen — in the US, CA-MRSA (USA300) causes 50-75% of purulent SSTIs in most communities. IDSA 2014: Incision and drainage (I&D) is the PRIMARY therapy. Antibiotics are ADJUNCTIVE, not a substitute for drainage.",
        clinicalPresentation: "Fluctuant, tender, erythematous nodule with overlying warmth. May have a visible pustule or point of drainage. Surrounding cellulitis common. Furuncles center on hair follicles. Carbuncles are larger, deeper, with multiple drainage tracts — more common in diabetics and immunocompromised. Abscess may be deeper and require imaging (ultrasound) to confirm collection. Fever and systemic symptoms suggest moderate-severe disease.",
        diagnostics: "Ultrasound: Point-of-care ultrasound (POCUS) is the best tool to confirm a drainable abscess vs. cellulitis without collection. Sensitivity 96%, specificity 83%. Should be used when exam is equivocal. Wound culture: Obtain at time of I&D — guides targeted therapy and tracks local resistance. Blood cultures: only if systemic signs (fever, tachycardia, hypotension). Gram stain of purulent material can provide rapid pathogen identification.",
        empiricTherapy: [
          {
            line: "First-Line — Mild (Outpatient, After I&D)",
            options: [
              { drug: "tmp-smx-ssti", regimen: "TMP-SMX DS 1-2 tablets PO BID", notes: "IDSA 2014 + Talan 2016 trial first-line after I&D. Excellent CA-MRSA activity (>95% susceptibility). Talan trial showed adding TMP-SMX to I&D improved cure rates from 73.6% to 80.5%. DS = 160/800mg. Double-strength dosing (2 DS BID) used by some for larger abscesses. Duration: 5-7 days." },
              { drug: "doxycycline-ssti", regimen: "Doxycycline 100mg PO BID", notes: "ESTABLISH trials: equivalent to clindamycin for uncomplicated SSTI. Excellent CA-MRSA activity (>95%). Advantages: BID dosing, low C. diff risk, no renal dosing. Disadvantages: photosensitivity, esophageal ulceration (take with full glass of water, upright), limited Streptococcal coverage (a gap if surrounding cellulitis is significant). Duration: 5-7 days." },
              { drug: "clindamycin-ssti", regimen: "Clindamycin 300-450mg PO TID", notes: "ESTABLISH trials: equivalent to TMP-SMX. Covers MRSA + Streptococci + anaerobes. KEY LIMITATION: rising clindamycin resistance (15-25% in some areas). MUST check D-test for inducible clindamycin resistance (erythromycin-resistant, clindamycin-susceptible isolates need D-test). If D-test positive, clindamycin will fail. C. diff risk higher than TMP-SMX or doxycycline." },
            ],
          },
          {
            line: "First-Line — Moderate/Severe (Inpatient, IV)",
            options: [
              { drug: "vancomycin-purulent", regimen: "Vancomycin IV (AUC/MIC 400-600)", notes: "IDSA 2014 first-line IV for severe purulent SSTI (failed oral therapy, systemic toxicity, immunocompromised). Provides definitive MRSA coverage. AUC-guided dosing standard (2020 consensus). Convert to oral TMP-SMX or doxycycline when improving." },
              { drug: "daptomycin", regimen: "Daptomycin 4-6 mg/kg IV once daily", notes: "FDA-approved for complicated SSTIs at 4mg/kg. Many experts dose 6mg/kg for serious infections. Rapidly bactericidal against MRSA. MUST NOT use for pneumonia (inactivated by pulmonary surfactant). Advantages: once-daily dosing, no nephrotoxicity at standard doses. Monitor CPK weekly." },
              { drug: "linezolid-purulent", regimen: "Linezolid 600mg IV/PO BID", notes: "FDA-approved for complicated SSTIs including MRSA. 100% PO bioavailability — can step down to oral immediately. Suppresses toxin production (PVL). Monitor CBC weekly for thrombocytopenia if >7 days." },
              { drug: "cefazolin-purulent", regimen: "Cefazolin 2g IV q8h (if MSSA confirmed or low MRSA suspicion)", notes: "Use when cultures confirm MSSA. SUPERIOR to vancomycin for MSSA. De-escalation target: once MSSA confirmed, switch from vancomycin to cefazolin. This is one of the highest-impact stewardship interventions in SSTI." },
            ],
          },
          {
            line: "I&D Without Antibiotics — When to Consider",
            options: [
              { drug: "id-alone", regimen: "I&D alone for small (<2cm), uncomplicated abscess in healthy patient", notes: "IDSA 2014 suggests I&D alone MAY be sufficient for small, uncomplicated abscesses in immunocompetent patients. HOWEVER: Talan 2016 trial showed antibiotics after I&D improved outcomes even for uncomplicated abscesses. Current practice has shifted toward adding a 5-day course of TMP-SMX or doxycycline after I&D for most abscesses. I&D alone may still be reasonable for very small (<2cm) abscesses that are completely drained with no surrounding cellulitis." },
            ],
          },
          {
            line: "Duration",
            options: [
              { drug: "duration-purulent", regimen: "5-7 days (outpatient); 7-14 days (severe/complicated)", notes: "Mild-moderate after I&D: 5-7 days. Severe: 7-14 days depending on response. Bacteremia from SSTI source: 14 days minimum for S. aureus (longer if endocarditis — see below). KEY: S. aureus bacteremia ALWAYS warrants echocardiography and ID consultation to rule out endocarditis — even if the apparent source is 'just' a skin infection." },
            ],
          },
        ],
        organismSpecific: [
          { organism: "CA-MRSA (USA300/ST8)", preferred: "TMP-SMX PO, doxycycline PO (outpatient); vancomycin IV, daptomycin IV, linezolid (inpatient)", alternative: "Clindamycin (if susceptible and D-test negative)", notes: "USA300 is the dominant CA-MRSA clone in the US. Characteristically: PVL-positive (Panton-Valentine Leukocidin — cytotoxin that causes tissue necrosis and abscess formation), resistant to beta-lactams and erythromycin, typically susceptible to TMP-SMX, doxycycline, clindamycin (variable), and vancomycin. PVL positivity drives the purulent, necrotic presentation. For severe PVL-positive infections, add a toxin-suppressing agent (clindamycin or linezolid) to the cell-wall-active drug." },
          { organism: "MSSA", preferred: "Cefazolin IV, cephalexin PO, nafcillin/oxacillin IV", alternative: "Clindamycin, dicloxacillin", notes: "MSSA still causes 25-50% of purulent SSTIs depending on local epidemiology. Always de-escalate from vancomycin to beta-lactam when MSSA confirmed — mortality benefit in bacteremia and faster clinical response. Do NOT use vancomycin for definitive MSSA treatment." },
          { organism: "Streptococcus pyogenes (mixed with Staph)", preferred: "Amoxicillin-clavulanate (covers both), cephalexin (if MSSA)", alternative: "Clindamycin (covers both Strep + Staph including most MRSA)", notes: "Mixed Streptococcal-Staphylococcal infections occur when purulent SSTIs have significant surrounding cellulitis. TMP-SMX has limited Streptococcal activity — if significant cellulitis surrounds the abscess, consider clindamycin (covers both) or add cephalexin/amoxicillin to TMP-SMX for dual coverage." },
        ],
        pearls: [
          "I&D IS THE TREATMENT — antibiotics are adjunctive. No antibiotic can sterilize an undrained abscess. If a patient with an abscess is not improving on antibiotics, the answer is almost always DRAINAGE, not broader antibiotics. Ensure adequate I&D was performed before escalating therapy.",
          "TMP-SMX vs doxycycline: Both are excellent oral MRSA agents. TMP-SMX advantages: better data (Talan trial), covers UTIs simultaneously, pediatric-friendly. Doxycycline advantages: BID dosing, broader coverage (Rickettsia, atypicals), lower C. diff risk. TMP-SMX disadvantage: limited Streptococcal coverage. Doxycycline disadvantage: limited Streptococcal coverage. For purulent SSTIs with significant surrounding cellulitis, either agent may leave a Streptococcal gap.",
          "The Streptococcal gap of TMP-SMX and doxycycline: Neither drug reliably covers Group A Strep. For a pure abscess, this doesn't matter (Staph is the target). But for abscess with extensive surrounding cellulitis, consider: clindamycin (covers both), or TMP-SMX + cephalexin, or doxycycline + amoxicillin. This combination addresses both the Staphylococcal abscess and the Streptococcal cellulitis.",
          "S. aureus bacteremia from SSTI: ALWAYS get an echocardiogram. ALWAYS consult ID. Even 'transient' S. aureus bacteremia has a 10-25% rate of occult endocarditis. This is not cellulitis-level care anymore — it's a completely different management pathway requiring 2-6 weeks of IV antibiotics. Missing endocarditis is catastrophic.",
          "Recurrent abscesses: If a patient has recurrent MRSA SSTIs, address decolonization: mupirocin 2% nasal ointment BID × 5 days + chlorhexidine body washes × 5 days, repeated monthly × 3 months. Decolonize household contacts simultaneously. Bleach baths (1/4 cup bleach per bathtub) 2× weekly can reduce recurrence. Environmental cleaning of high-touch surfaces.",
          "D-test for clindamycin: If the isolate is erythromycin-resistant and clindamycin-susceptible, the lab MUST perform a D-test to check for inducible clindamycin resistance (erm gene). If D-test positive: clindamycin will fail clinically despite in vitro susceptibility. If D-test negative: clindamycin is safe to use. Check your lab's reporting — some automatically report D-test results, others require you to request it.",
          "Point-of-care ultrasound changes management: Studies show POCUS changes the diagnosis in 50% of cases where the clinician is unsure if there's a drainable collection. A patient labeled as 'cellulitis' may actually have an abscess that needs I&D. Advocate for ultrasound when the exam is equivocal.",
        ],
      },
      {
        id: "necrotizing-ssti",
        name: "Necrotizing Soft Tissue Infections (NSTI / Necrotizing Fasciitis)",
        definition: "Life-threatening deep soft tissue infection causing rapidly progressive necrosis of fascia, subcutaneous tissue, and sometimes muscle (myonecrosis). Two major types: Type I (polymicrobial — mixed aerobes + anaerobes, often in diabetics, post-surgical, or perineal/Fournier's) and Type II (monomicrobial — Group A Strep or occasionally MRSA/Clostridium). Mortality: 20-40% overall, higher with delayed surgical intervention. TIME TO SURGERY IS THE SINGLE MOST IMPORTANT PROGNOSTIC FACTOR.",
        clinicalPresentation: "PAIN OUT OF PROPORTION to exam findings is the hallmark — often the earliest and most reliable sign. Skin changes progress rapidly: erythema → dusky/violaceous → hemorrhagic bullae → frank necrosis (black eschar). Crepitus (gas in tissues) is classic but LATE and present in only ~18% of cases. Wooden-hard induration of subcutaneous tissue. Rapidly expanding area. Hemodynamic instability and sepsis. Fournier's gangrene: necrotizing infection of the perineum/genitalia — surgical emergency. CLINICAL SUSPICION ALONE warrants surgical exploration — do NOT wait for imaging or labs to confirm.",
        diagnostics: "SURGICAL EXPLORATION IS DIAGNOSTIC AND THERAPEUTIC — do NOT delay for imaging. CT with contrast: most sensitive imaging modality (gas tracking along fascial planes, fascial thickening/enhancement, fluid collections). MRI: highest sensitivity but takes too long in emergencies. LRINEC Score (WBC, Hgb, Na, glucose, Cr, CRP): score >=6 suggests necrotizing infection, but sensitivity is only ~60-80% — a negative score does NOT rule it out. Blood cultures, wound cultures, surgical tissue cultures (Gram stain + aerobic + anaerobic). Lactate (prognostic marker). CBC, BMP, CRP, procalcitonin for trending.",
        empiricTherapy: [
          {
            line: "First-Line — Empiric Broad-Spectrum (Start Immediately, Before Surgery)",
            options: [
              { drug: "nsti-backbone", regimen: "Vancomycin IV (AUC 400-600) + Piperacillin-tazobactam 4.5g IV q6h (extended infusion) + Clindamycin 900mg IV q8h", notes: "IDSA 2014 recommended triple therapy: (1) MRSA coverage (vancomycin), (2) Broad gram-negative + anaerobic coverage (pip-tazo), (3) Toxin suppression (clindamycin). Clindamycin is added specifically for its ribosomal-mediated suppression of Streptococcal exotoxins (SPE-A, SPE-B), Staphylococcal PVL, and Clostridial alpha-toxin. This toxin suppression reduces inflammatory cascade and improves survival. Do NOT omit clindamycin." },
              { drug: "nsti-alt", regimen: "Vancomycin + Meropenem 1g IV q8h + Clindamycin 900mg IV q8h", notes: "Alternative backbone using meropenem instead of pip-tazo. Preferred if: ESBL risk, prior resistant organisms, or concern for polymicrobial infection with resistant gram-negatives. Same triple-therapy rationale: MRSA + broad gram-negative/anaerobic + toxin suppression." },
            ],
          },
          {
            line: "Adjunctive — Toxin Suppression (Critical Component)",
            options: [
              { drug: "clindamycin-nsti", regimen: "Clindamycin 900mg IV q8h", notes: "NON-NEGOTIABLE component of NSTI therapy. Mechanism: inhibits ribosomal protein synthesis, thereby suppressing production of bacterial exotoxins (superantigens, cytolysins, tissue-destroying enzymes). Beta-lactams and vancomycin (cell wall agents) do NOT suppress toxin production — in fact, cell lysis from beta-lactams can RELEASE preformed toxins. Clindamycin addresses this by shutting down the toxin factory. Eagle effect: at high bacterial density (as in NSTI), beta-lactam killing slows because bacteria are in stationary phase with reduced PBP expression. Clindamycin is NOT affected by inoculum size. Continue until clinical improvement or de-escalation per ID." },
            ],
          },
          {
            line: "Duration",
            options: [
              { drug: "duration-nsti", regimen: "Continue until surgical debridement complete + clinical improvement, typically 2-4 weeks total", notes: "No fixed duration — guided by surgical findings and clinical response. Multiple debridements are common (every 24-48h until no further necrotic tissue). Antibiotics continue through the surgical phase. De-escalate based on cultures once pathogen identified. Transition to targeted therapy: Type I (polymicrobial) — may narrow to amp-sulbactam or pip-tazo; Type II (GAS) — penicillin G + clindamycin; Type II (MRSA) — vancomycin + clindamycin." },
            ],
          },
        ],
        organismSpecific: [
          { organism: "Group A Streptococcus (Type II NSTI)", preferred: "Penicillin G 4MU IV q4h + Clindamycin 900mg IV q8h", alternative: "Ceftriaxone + Clindamycin (if penicillin allergy unclear)", notes: "GAS necrotizing fasciitis carries 30% mortality even with optimal care. The penicillin + clindamycin combination is the gold standard: penicillin for bactericidal activity, clindamycin for toxin suppression. Streptococcal toxic shock syndrome (STSS) occurs in ~50% of GAS NSTI. IVIG (intravenous immunoglobulin) has been used adjunctively for STSS — mechanism: neutralizes superantigens. Evidence is mixed but many experts recommend it for refractory STSS." },
          { organism: "Polymicrobial / Type I (mixed aerobes + anaerobes)", preferred: "Pip-tazo or meropenem + vancomycin + clindamycin", alternative: "Amp-sulbactam + vancomycin + metronidazole", notes: "Type I is more common than Type II. Typical pathogens: mixed Enterobacterales, anaerobes (Bacteroides, Peptostreptococcus), Streptococci, Staphylococci. Risk factors: diabetes, post-surgical, perineal location (Fournier's), peripheral vascular disease. Polymicrobial coverage is essential until cultures clarify." },
          { organism: "Clostridium perfringens (gas gangrene/myonecrosis)", preferred: "Penicillin G + Clindamycin (for alpha-toxin suppression)", alternative: "Meropenem + Clindamycin", notes: "Clostridial myonecrosis is the most rapidly fatal soft tissue infection. Produces alpha-toxin (phospholipase C) that causes massive tissue destruction and hemolysis. Gas in tissues is characteristic. Penicillin for bactericidal activity, clindamycin for toxin suppression (same rationale as for Strep). EMERGENT wide surgical debridement/amputation may be required. Hyperbaric oxygen is controversial but used at some centers." },
          { organism: "Vibrio vulnificus (saltwater exposure NSTI)", preferred: "Doxycycline 100mg IV BID + Ceftriaxone 2g IV daily (or cefotaxime)", alternative: "FQ + doxycycline", notes: "Occurs after saltwater/shellfish exposure, particularly in patients with liver disease, hemochromatosis, or immunosuppression. Fulminant course — can progress from cellulitis to necrotizing infection within hours. Characteristic hemorrhagic bullae. Doxycycline + 3rd-gen cephalosporin is the recommended combination. Mortality 50%+ in necrotizing presentations. Maintain high suspicion in any patient with rapidly progressive SSTI and water exposure history." },
        ],
        pearls: [
          "TIME TO SURGERY IS EVERYTHING: Every hour of delay in surgical debridement increases mortality. A meta-analysis showed that patients taken to the OR within 12 hours of presentation had significantly lower mortality than those delayed >24 hours. If you suspect NSTI, call surgery IMMEDIATELY. Do not wait for CT confirmation, culture results, or antibiotic effect.",
          "Pain out of proportion is the most sensitive early sign: The patient screams when you touch the skin gently. The pain extends far beyond the visible area of erythema. This disconnect between minimal skin findings and severe pain should trigger NSTI concern. By the time bullae, crepitus, and necrosis are visible, the infection is far advanced.",
          "Clindamycin for toxin suppression is NOT optional: The evidence for clindamycin in NSTI is based on the Eagle effect and toxin suppression. At high bacterial inocula (characteristic of NSTI), beta-lactams lose efficacy because bacteria are in stationary phase. Clindamycin works regardless of growth phase. Additionally, cell-wall-active agents cause bacterial lysis → toxin release. Clindamycin prevents new toxin synthesis. Omitting clindamycin from NSTI therapy is a treatment error.",
          "LRINEC score limitations: While the LRINEC score (>=6 = concern for NSTI) is a useful screening tool, it has important limitations: sensitivity is only 60-80% in validation studies, meaning 20-40% of true NSTI cases will be missed. A negative LRINEC score should NEVER be used to rule out NSTI if clinical suspicion is present. The score was designed to raise suspicion, not to exclude the diagnosis. When in doubt, explore surgically.",
          "Fournier's gangrene is a true emergency: Necrotizing fasciitis of the perineum and genitalia. Often occurs in diabetics. Polymicrobial (Type I). Mortality 20-40%. Requires emergent wide debridement that may include orchiectomy, penectomy, or colostomy for source control. Broad-spectrum coverage from the start. Delay = death.",
          "Post-NSTI recovery: Patients who survive often require extensive reconstruction (skin grafts, flaps), prolonged rehabilitation, and psychological support. Wound VAC therapy is commonly used between debridements. Pharmacists contribute to long-term antibiotic management, pain control (often chronic), and metabolic optimization (nutrition, glucose control).",
        ],
      },
      {
        id: "diabetic-foot",
        name: "Diabetic Foot Infections (DFI)",
        definition: "Infection of soft tissue and/or bone in the diabetic foot, typically arising from a neuropathic ulcer. Classified by IDSA/IWGDF severity: Grade 1 (uninfected ulcer), Grade 2 (mild — superficial, <2cm cellulitis), Grade 3 (moderate — deeper than dermis OR >2cm cellulitis OR lymphangitis OR involving muscle/tendon/joint/bone), Grade 4 (severe — systemic toxicity, metabolic instability). Polymicrobial infections are the norm in moderate-severe DFI. Osteomyelitis complicates 20-60% of moderate-severe DFIs.",
        clinicalPresentation: "Ulcer with surrounding erythema, warmth, tenderness, or purulent drainage. Hallmarks of neuropathic ulcers: painless (neuropathy), plantar location (pressure points), callus formation. Signs of infection: purulence, erythema >0.5cm from wound edge, warmth, tenderness, induration. Fetid odor suggests anaerobic involvement. Probe-to-bone test: if a sterile metal probe inserted through the ulcer contacts bone (gritty sensation), positive predictive value for osteomyelitis is ~89% in high-risk populations. Sausage toe (dactylitis) suggests osteomyelitis.",
        diagnostics: "Wound culture: Obtain from DEEP tissue (curettage of ulcer base after debridement, NOT superficial swab — superficial swabs grow colonizers). Probe-to-bone test (PTB): positive PTB + compatible imaging = presumed osteomyelitis. Imaging: plain radiographs first (cortical erosion, periosteal reaction, but 30-50% sensitivity early); MRI is the gold standard for osteomyelitis (sensitivity 90%, specificity 80%). ESR/CRP: ESR >70 has high specificity for osteomyelitis. Bone biopsy: gold standard for osteomyelitis diagnosis — culture + histology. Obtain whenever possible before starting antibiotics for osteomyelitis. Blood cultures: obtain for moderate-severe infections.",
        empiricTherapy: [
          {
            line: "First-Line — Mild DFI (Grade 2, Outpatient)",
            options: [
              { drug: "cephalexin-dfi", regimen: "Cephalexin 500mg PO QID", notes: "For mild DFI, acute (<2 weeks), in antibiotic-naive patient. Targets gram-positive cocci (Streptococci, MSSA). Mild DFIs are predominantly gram-positive monomicrobial. NO MRSA coverage — add TMP-SMX or doxycycline if MRSA risk. Duration: 1-2 weeks." },
              { drug: "amox-clav-dfi", regimen: "Amoxicillin-clavulanate 875/125mg PO BID", notes: "Broader option covering gram-positives + anaerobes + some gram-negatives. Useful for mild DFIs with wound features suggesting polymicrobial etiology (chronic ulcers, fetid discharge, deeper wounds). Duration: 1-2 weeks." },
              { drug: "clindamycin-dfi", regimen: "Clindamycin 300mg PO TID + Ciprofloxacin 500mg PO BID", notes: "If MRSA risk + need for gram-negative coverage. Clindamycin covers MRSA + Streptococci + anaerobes; ciprofloxacin adds gram-negative coverage. Check local clindamycin susceptibility patterns." },
            ],
          },
          {
            line: "First-Line — Moderate-Severe DFI (Grade 3-4, Inpatient)",
            options: [
              { drug: "pip-tazo-dfi", regimen: "Pip-tazo 4.5g IV q6h (extended infusion) + Vancomycin IV", notes: "Standard empiric regimen for moderate-severe DFI. Pip-tazo covers Streptococci, MSSA, Enterobacterales, Pseudomonas, and anaerobes. Vancomycin adds MRSA coverage. De-escalate based on deep wound cultures. This covers the typical polymicrobial flora of chronic DFIs." },
              { drug: "ertapenem-dfi", regimen: "Ertapenem 1g IV daily + Vancomycin IV", notes: "Alternative backbone. Ertapenem covers Streptococci, MSSA, Enterobacterales, and anaerobes with convenient once-daily dosing (excellent for OPAT). Does NOT cover Pseudomonas — use pip-tazo or meropenem if Pseudomonas suspected (chronic wounds, prior Pseudomonas). Add vancomycin for MRSA." },
              { drug: "meropenem-dfi", regimen: "Meropenem 1g IV q8h + Vancomycin IV", notes: "Reserve for severe DFI with risk for ESBL or MDR gram-negatives (prior antibiotics, prior resistant cultures, prolonged hospitalization). De-escalate aggressively based on cultures." },
            ],
          },
          {
            line: "Duration — Soft Tissue vs Osteomyelitis",
            options: [
              { drug: "duration-dfi-soft", regimen: "Soft tissue DFI: 1-2 weeks (mild), 2-3 weeks (moderate-severe)", notes: "IDSA 2023: shorter courses preferred for soft tissue DFI. Treat the INFECTION, not the wound — antibiotics do not heal wounds, they clear infection. A clean ulcer base without signs of infection does not require antibiotics regardless of appearance. Continuing antibiotics beyond the infectious period drives resistance and C. diff." },
              { drug: "duration-dfi-osteo", regimen: "Osteomyelitis: 4-6 weeks (no surgery), 1-3 weeks (after complete resection)", notes: "If osteomyelitis is present: 4-6 weeks of antibiotic therapy if treated medically (no bone resection). If infected bone is completely resected (amputation, debridement with clean margins): 1-3 weeks of antibiotics may suffice (some experts use 5-7 days post-resection if clean margins confirmed). Bone culture guides targeted therapy. Oral step-down is supported by the OVIVA trial for osteomyelitis." },
            ],
          },
        ],
        organismSpecific: [
          { organism: "Gram-positive cocci (Streptococci, MSSA) — acute, mild DFI", preferred: "Cephalexin, amoxicillin-clavulanate, cefazolin", alternative: "Clindamycin, dicloxacillin", notes: "Acute, previously untreated DFIs are often monomicrobial gram-positive. Don't over-treat mild DFI with broad-spectrum IV antibiotics. Target gram-positives and reassess." },
          { organism: "Polymicrobial (chronic/moderate-severe DFI)", preferred: "Pip-tazo, amp-sulbactam, ertapenem (each + vancomycin)", alternative: "Meropenem + vancomycin", notes: "Chronic, deep, previously treated DFIs are typically polymicrobial: Streptococci, Staphylococci, Enterobacterales, Pseudomonas (if chronic/macerated), anaerobes (especially in necrotic/ischemic wounds). Deep tissue culture is essential — treat what grows, not what you imagine." },
          { organism: "MRSA in DFI", preferred: "Vancomycin IV, linezolid, daptomycin (soft tissue); vancomycin IV or linezolid (osteomyelitis)", alternative: "TMP-SMX, doxycycline (mild DFI, oral step-down)", notes: "MRSA in DFI: use vancomycin or linezolid for serious infections. For osteomyelitis, linezolid has good bone penetration but limit to 6 weeks due to myelosuppression. Daptomycin has limited bone penetration data but is used. Oral step-down: TMP-SMX or doxycycline for MRSA soft tissue DFI." },
          { organism: "Pseudomonas aeruginosa", preferred: "Pip-tazo, cefepime, ciprofloxacin", alternative: "Meropenem (if resistant)", notes: "Pseudomonas is overdiagnosed in DFI — often a colonizer. True Pseudomonas infection is more common in chronic macerated wounds, patients with prior Pseudomonas antibiotics, and water-exposed wounds. Don't treat Pseudomonas empirically in all DFIs — treat based on culture results. If present and pathogenic, pip-tazo or ciprofloxacin are first-line." },
        ],
        pearls: [
          "TREAT THE INFECTION, NOT THE WOUND: The most common antibiotic stewardship error in DFI is continuing antibiotics for a 'bad-looking' ulcer that has no signs of infection. Chronic ulcers are colonized by bacteria — this is NOT infection. Signs of infection require at least 2 of: erythema, warmth, tenderness/pain, purulence, induration. If absent, no antibiotics needed regardless of wound appearance.",
          "Probe-to-bone test: Simple, free, and highly informative. Insert a sterile blunt metal probe through the ulcer. If it contacts hard, gritty bone: osteomyelitis until proven otherwise (PPV ~89% in high-pretest-probability populations). If negative: lower probability but doesn't exclude it (sensitivity ~60%). Every clinician seeing DFI should perform this test.",
          "Superficial swabs are USELESS: Culturing the surface of a chronic wound grows colonizers (Pseudomonas, Corynebacterium, mixed skin flora) that are NOT causing the deep infection. ALWAYS obtain deep tissue cultures — curettage of the ulcer base after debridement, or tissue biopsy. This is the culture that should guide your antibiotic choices.",
          "OVIVA trial impact: The Oral vs IV Antibiotics for Bone and Joint Infection (OVIVA, 2019 NEJM) trial showed oral step-down was non-inferior to continued IV therapy for bone/joint infections including some osteomyelitis cases. This supports oral step-down in DFI osteomyelitis using agents with good oral bioavailability and bone penetration (FQs, TMP-SMX, doxycycline, linezolid). Not all patients are candidates, but it reduces PICC lines, hospital days, and complications.",
          "Vascular assessment is NON-NEGOTIABLE: No amount of antibiotics will cure a DFI in an ischemic limb. Check ABI (ankle-brachial index), toe pressures, or transcutaneous oxygen. If vascular disease is present, revascularization is essential for healing. The multidisciplinary team (vascular surgery, podiatry, wound care) is as important as the antibiotic selection.",
          "Osteomyelitis bone biopsy: When feasible, obtain before starting antibiotics. Bone culture + histology is the gold standard for diagnosing osteomyelitis and guiding targeted therapy. Empiric therapy without a pathogen-directed approach leads to unnecessarily broad 6-week courses. A bone biopsy that identifies MSSA means 6 weeks of cefazolin, not 6 weeks of vancomycin + meropenem.",
          "Ertapenem for OPAT: Ertapenem 1g IV once daily is an excellent OPAT option for moderate DFI (after initial inpatient stabilization). Covers Streptococci, MSSA, Enterobacterales, and anaerobes. The once-daily dosing makes home infusion practical. Does NOT cover Pseudomonas or MRSA — ensure cultures don't show these before switching.",
        ],
      },
    ],
    drugMonographs: [
      {
        id: "cefazolin",
        name: "Cefazolin",
        brandNames: "Ancef, Kefzol",
        drugClass: "First-generation cephalosporin",
        mechanismOfAction: "Binds PBPs (primarily PBP-1 and PBP-3), inhibiting cell wall synthesis. Bactericidal, time-dependent killing. First-generation cephalosporins have the BEST gram-positive activity within the cephalosporin class. Narrow spectrum compared to later generations — this is an ADVANTAGE (less collateral damage, less resistance selection, less C. diff).",
        spectrum: "Gram-positive: Excellent MSSA (drug of choice for MSSA infections), Streptococci (S. pyogenes, S. agalactiae). Gram-negative: Limited but useful — E. coli, Klebsiella (non-ESBL), Proteus mirabilis. GAPS: MRSA (no activity), Enterococcus, ESBL producers, AmpC producers (Enterobacter, Citrobacter, Serratia), Pseudomonas, anaerobes (variable, poor for B. fragilis), atypicals.",
        dosing: {
          standard: "1-2g IV q8h",
          ssti: "2g IV q8h",
          surgical_prophylaxis: "2g IV within 60 min before incision (3g if >=120kg); redose q4h intra-op",
          uti: "1g IV q8h",
          endocarditis_mssa: "2g IV q8h (native valve), 6 weeks",
          bone_joint: "2g IV q8h",
          weight_based: "Standard adult: 2g IV q8h. Severe infections or obesity: can increase to 2g q6h",
        },
        renalAdjustment: "CrCl 35-54: 1g q8h. CrCl 11-34: 1g q12h. CrCl <=10: 1g q24h. Hemodialysis: 1g after each HD session. CRRT: 2g q12h (institution-dependent). One advantage over nafcillin/oxacillin — cefazolin is renally cleared and easier to dose-adjust.",
        hepaticAdjustment: "No adjustment needed — renally eliminated. This is another advantage over nafcillin (which has hepatotoxicity concerns).",
        adverseEffects: {
          common: "Diarrhea, nausea, injection site reactions, rash (~1-2%)",
          serious: "Hypersensitivity/anaphylaxis (0.01-0.05%), C. difficile (lower risk than broader cephalosporins), hemolytic anemia (Coombs-positive, usually not clinically significant), leukopenia (rare, prolonged courses)",
          rare: "Seizures (very rare, unlike cefepime — minimal neurotoxicity), interstitial nephritis, Stevens-Johnson Syndrome",
        },
        drugInteractions: [
          "Probenecid — blocks renal tubular secretion of cefazolin, increasing levels. Can be used intentionally to prolong half-life for outpatient use (probenecid + cefazolin allows less frequent dosing).",
          "Warfarin — cephalosporins may enhance anticoagulant effect through vitamin K-related mechanism. Monitor INR, especially in malnourished or critically ill patients.",
          "Aminoglycosides — potential additive nephrotoxicity. Administer separately (physical incompatibility in some IV solutions).",
        ],
        monitoring: "Renal function (BMP) — for dose adjustment. CBC if prolonged course (>14 days). Clinical response. Unlike vancomycin, cefazolin does NOT require drug level monitoring — a major practical advantage.",
        pregnancyLactation: "Category B. Widely used in pregnancy — standard for cesarean section prophylaxis (2g IV before incision). Safe for GBS prophylaxis in penicillin-allergic patients without anaphylaxis history. Compatible with breastfeeding.",
        pharmacistPearls: [
          "CEFAZOLIN IS THE GOLD STANDARD FOR MSSA: Multiple studies demonstrate cefazolin is equivalent or SUPERIOR to nafcillin/oxacillin for MSSA bacteremia and endocarditis, with FEWER adverse effects (less nephrotoxicity, less hepatotoxicity, easier dosing). The CEFAB trial and subsequent meta-analyses cemented this. If your institution still defaults to nafcillin for MSSA, advocate for the cefazolin switch. This is one of the most impactful antimicrobial stewardship initiatives.",
          "Cefazolin for surgical prophylaxis: THE most commonly used antibiotic in the world for surgical prophylaxis. Weight-based dosing matters: 2g for patients <120kg, 3g for patients >=120kg. Timing: within 60 minutes of incision (unlike vancomycin which needs 120 min). Redose every 4 hours intra-operatively for long surgeries or major blood loss (>1.5L).",
          "Cross-reactivity with penicillin: Cefazolin has a unique R1 side chain that differs from most penicillins. Cross-reactivity risk is ~1%. Even patients with documented penicillin allergy (non-anaphylactic) can safely receive cefazolin in most cases. For patients with penicillin anaphylaxis: skin testing or graded dose challenge under allergist supervision. Don't let a vague 'penicillin allergy' deprive a patient of the best MSSA drug available.",
          "Probenecid trick for OPAT: Adding probenecid 1g PO BID to cefazolin extends the effective half-life, potentially allowing q12h dosing for less serious infections. This is used at some OPAT programs to reduce nursing visits. Evidence is limited to PK studies — discuss with your ID team before implementing.",
          "Cefazolin vs. nafcillin/oxacillin comparison: Cefazolin advantages — q8h dosing (vs q4h), less phlebitis, no hepatotoxicity (vs oxacillin), less interstitial nephritis, easier dose adjustment in renal impairment, suitable for OPAT. Nafcillin advantages — does not require renal adjustment (hepatically cleared), potentially faster bactericidal activity (debated). For nearly all MSSA infections, cefazolin is the preferred agent.",
          "Low C. diff risk: Among parenteral antibiotics, cefazolin has one of the LOWEST rates of C. difficile infection. Narrower spectrum = less disruption of colonic flora. This is clinically meaningful compared to broad-spectrum alternatives like pip-tazo or meropenem.",
        ],
      },
      {
        id: "clindamycin",
        name: "Clindamycin",
        brandNames: "Cleocin",
        drugClass: "Lincosamide antibiotic",
        mechanismOfAction: "Binds to the 50S ribosomal subunit (23S rRNA at the peptidyl transferase center), inhibiting bacterial protein synthesis. Bacteriostatic at standard doses (bactericidal at high concentrations against some organisms). The CRITICAL clinical property: as a ribosomal inhibitor, clindamycin SUPPRESSES BACTERIAL TOXIN PRODUCTION. This makes it essential in toxin-mediated diseases (necrotizing fasciitis, toxic shock syndrome, PVL-positive MRSA). Also concentrates in bone, abscesses, and neutrophils (excellent intracellular penetration).",
        spectrum: "Gram-positive: Streptococci (excellent), MSSA, most CA-MRSA (but rising resistance — check local rates). Anaerobes: good above-the-diaphragm activity (Peptostreptococcus, Prevotella, Fusobacterium). VARIABLE for B. fragilis (30-40% resistance). GAPS: Enterococcus (no activity), gram-negatives (no activity), MRSA in areas with >15-20% clindamycin resistance, some B. fragilis.",
        dosing: {
          oral: "300-450mg PO TID (or QID for serious infections)",
          iv_standard: "600mg IV q8h",
          iv_severe: "900mg IV q8h (necrotizing fasciitis, severe SSTI)",
          bone_joint: "600mg IV q8h or 300-450mg PO TID",
          toxin_suppression: "900mg IV q8h (always as combination with cell-wall-active agent)",
        },
        renalAdjustment: "No dose adjustment needed — hepatically metabolized. This is an advantage in renal impairment.",
        hepaticAdjustment: "Use with caution in severe hepatic impairment. Half-life is prolonged in liver disease. No specific dose reduction established, but monitor closely and consider reduced dosing if severe hepatic dysfunction.",
        adverseEffects: {
          common: "Diarrhea (10-20% — among the highest rates of any antibiotic), nausea, metallic taste, rash",
          serious: "C. difficile colitis (historically the drug MOST associated with C. diff — though FQs and 3rd-gen cephalosporins have surpassed it in some studies), maculopapular rash, hepatotoxicity, neutropenia",
          rare: "Anaphylaxis, Stevens-Johnson Syndrome, esophageal ulceration (take capsules with full glass of water), pseudomembranous colitis (severe C. diff presentation)",
        },
        drugInteractions: [
          "Erythromycin/azithromycin — antagonistic interaction. Erythromycin and clindamycin bind to overlapping sites on the 50S ribosome. Do NOT combine.",
          "Neuromuscular blocking agents (vecuronium, pancuronium) — clindamycin potentiates neuromuscular blockade. Monitor closely in OR/ICU settings. Can cause prolonged paralysis.",
          "Cyclosporine — clindamycin may decrease cyclosporine levels. Monitor in transplant patients.",
          "Kaolin-pectin antidiarrheals — reduce clindamycin absorption if taken simultaneously. Separate by 2 hours.",
          "Warfarin — possible enhanced anticoagulation. Monitor INR.",
        ],
        monitoring: "Liver function tests (baseline and periodic in prolonged courses). CBC (for neutropenia in courses >14 days). Stool frequency and character (C. diff surveillance). Clinical response. No drug level monitoring needed.",
        pregnancyLactation: "Category B. Generally considered safe in pregnancy. Used for GBS prophylaxis in patients with high-risk penicillin allergy (ONLY if isolate is clindamycin-susceptible). Enters breast milk — AAP considers compatible with breastfeeding but monitor infant for diarrhea.",
        pharmacistPearls: [
          "TOXIN SUPPRESSION IS CLINDAMYCIN'S SUPERPOWER: In necrotizing fasciitis (GAS), toxic shock syndrome, and PVL-positive MRSA infections, clindamycin shuts down toxin production. Beta-lactams and vancomycin (cell wall agents) cause bacterial lysis, which RELEASES preformed toxins. Clindamycin prevents NEW toxin synthesis. This is the pharmacological rationale for triple therapy in NSTI. Never omit clindamycin from NSTI regimens.",
          "The D-test is YOUR responsibility: When an isolate is erythromycin-resistant and clindamycin-susceptible, inducible clindamycin resistance (erm gene) may be present. The D-zone test (placing erythromycin and clindamycin disks near each other — flattening of the clindamycin zone creates a 'D' shape) detects this. If D-test positive: clindamycin will FAIL clinically. If D-test negative: safe to use. Many labs report this automatically, but verify. If the report says 'clindamycin susceptible' without mention of D-test, call the lab.",
          "Bone and abscess penetration: Clindamycin achieves bone concentrations that are 40-75% of serum levels — among the highest of any antibiotic. Also concentrates well in abscesses (unlike aminoglycosides, which are inactivated in acidic, anaerobic abscess environments). This makes clindamycin valuable for osteomyelitis and deep abscess treatment.",
          "Rising MRSA resistance: CA-MRSA clindamycin susceptibility has been declining. In some US communities, 15-25% of MRSA is now clindamycin-resistant. This limits clindamycin's utility as an empiric MRSA agent. Always check local antibiogram data. TMP-SMX and doxycycline have more consistently maintained MRSA activity (>95% susceptibility in most areas).",
          "C. diff risk is real but contextual: Clindamycin carries one of the highest C. diff risks among oral antibiotics. However, this must be balanced against its unique toxin-suppressing properties. For life-threatening NSTI or toxic shock, the benefit of clindamycin far outweighs the C. diff risk. For routine uncomplicated SSTI where TMP-SMX or doxycycline would work, prefer those lower-risk agents.",
          "Oral bioavailability is ~90%: Clindamycin PO achieves serum levels approaching IV. For step-down therapy, the oral route is highly effective. This makes clindamycin an excellent OPAT-avoidance option for bone/joint infections and deep SSTIs.",
        ],
      },
      {
        id: "daptomycin",
        name: "Daptomycin",
        brandNames: "Cubicin",
        drugClass: "Cyclic lipopeptide (first-in-class)",
        mechanismOfAction: "Inserts into the gram-positive cell membrane in a calcium-dependent manner, forming ion channels that cause rapid membrane depolarization. This leads to loss of membrane potential, cessation of DNA/RNA/protein synthesis, and cell death. Rapidly bactericidal — concentration-dependent killing (Cmax/MIC drives efficacy). Unique mechanism: no other antibiotic class works this way. CRITICAL LIMITATION: inactivated by pulmonary surfactant — NEVER use for pneumonia.",
        spectrum: "GRAM-POSITIVE ONLY. Excellent: MRSA (including hVISA/VISA strains with vancomycin MIC creep), MSSA, VRE (E. faecium and E. faecalis — one of few bactericidal options), Streptococci, CoNS. GAPS: ALL gram-negatives (no activity), ALL anaerobes, pneumonia (inactivated by surfactant — this is a CONTRAINDICATION, not just a gap).",
        dosing: {
          ssti: "4 mg/kg IV once daily (FDA-approved dose for SSTI)",
          bacteremia_endocarditis: "6 mg/kg IV once daily (some experts use 8-10 mg/kg for high MIC, endocarditis, or osteomyelitis)",
          vre: "8-12 mg/kg IV once daily (higher doses for serious VRE infections)",
          high_dose: "8-12 mg/kg IV daily for: endocarditis, osteomyelitis, persistent bacteremia, prosthetic joint infections, or MIC >=1",
        },
        renalAdjustment: "CrCl >=30: no adjustment. CrCl <30 (including HD): 4-6 mg/kg IV q48h (or dose after HD on dialysis days). Some experts maintain daily dosing with standard doses even in renal impairment for serious infections (PK data supports this) — consult ID/pharmacy. CRRT: 8 mg/kg q48h (limited data, institution-dependent).",
        hepaticAdjustment: "No adjustment for mild-moderate hepatic impairment. Limited data in severe hepatic disease.",
        adverseEffects: {
          common: "CPK elevation (2-7%), diarrhea, headache, injection site reactions, insomnia",
          serious: "Rhabdomyolysis/myopathy (dose-related — monitor CPK weekly; hold if CPK >5-10× ULN with symptoms), eosinophilic pneumonia (rare but important — presents as new infiltrates, fever, dyspnea on daptomycin; discontinue immediately), peripheral neuropathy",
          rare: "Anaphylaxis, renal failure secondary to rhabdomyolysis, hepatitis",
        },
        drugInteractions: [
          "Statins (HMG-CoA reductase inhibitors) — both daptomycin and statins can cause myopathy/rhabdomyolysis. HOLD STATINS during daptomycin therapy. Restart after daptomycin course is complete. This is a pharmacist-driven intervention that prevents serious harm.",
          "Tobramycin — daptomycin trough levels may increase when co-administered. Clinical significance uncertain but monitor CPK more closely.",
          "Warfarin — no significant interaction, but monitor INR as with any antibiotic course.",
        ],
        monitoring: "CPK: obtain baseline and at least WEEKLY during therapy (more frequently if symptoms of myalgia, weakness). HOLD daptomycin if CPK >5× ULN with symptoms or >10× ULN regardless of symptoms. Renal function (BMP) — for dose adjustment. Clinical response. Watch for respiratory symptoms (eosinophilic pneumonia — rare but requires discontinuation).",
        pregnancyLactation: "Category B. Limited human data. Animal studies showed no harm. Use only if clearly needed. Breastfeeding: unknown whether excreted in milk — use with caution.",
        pharmacistPearls: [
          "NEVER USE FOR PNEUMONIA: Daptomycin is inactivated by pulmonary surfactant. The pivotal MRSA pneumonia trial was stopped because daptomycin FAILED in pneumonia. This is not a dosing issue — it is a pharmacological incompatibility. If a patient on daptomycin develops pneumonia, switch to vancomycin or linezolid. This is a HARD STOP — no exceptions.",
          "HOLD STATINS: This is one of the most important pharmacist interventions for daptomycin. Both agents cause myopathy through different mechanisms, and the combination dramatically increases rhabdomyolysis risk. Temporarily discontinue all statins when daptomycin is initiated. Set a reminder to restart them after daptomycin is completed. Document this in the chart.",
          "High-dose daptomycin (8-12 mg/kg): The FDA-approved doses (4 mg/kg SSTI, 6 mg/kg bacteremia) are increasingly considered suboptimal for serious infections. Many ID experts now routinely use 8-10 mg/kg for MRSA bacteremia, endocarditis, and osteomyelitis. Higher doses improve the Cmax/MIC ratio (concentration-dependent killing). The evidence is from observational studies and PK modeling — no RCTs, but the trend is clear. Higher doses increase CPK monitoring importance.",
          "Daptomycin for MRSA with vancomycin MIC creep: When MRSA has vancomycin MIC = 2, achieving AUC 400-600 requires dangerously high vancomycin doses with significant nephrotoxicity risk. Daptomycin is the preferred alternative for non-pulmonary MRSA infections with elevated vancomycin MICs. This is an increasingly common clinical scenario.",
          "Eosinophilic pneumonia: Rare (<1%) but can mimic treatment failure or new infection. Patient on daptomycin develops fever, dyspnea, new infiltrates — instinct is to broaden antibiotics. CHECK eosinophil count on CBC differential. If elevated eosinophils + new infiltrates on daptomycin = eosinophilic pneumonia until proven otherwise. Treatment: stop daptomycin, consider steroids. Symptoms resolve rapidly.",
          "Daptomycin is one of few BACTERICIDAL options for VRE: Unlike linezolid (bacteriostatic for enterococci), daptomycin is bactericidal against VRE. For VRE endocarditis or bacteremia where bactericidal activity matters, daptomycin at 8-12 mg/kg is preferred. Often combined with ampicillin or ceftaroline for synergy in difficult VRE infections.",
        ],
      },
    ],
  },
  {
    id: "iai",
    name: "Intra-Abdominal Infections",
    icon: "🫁",
    category: "Infectious Disease",
    overview: {
      definition: "Intra-abdominal infections (IAI) encompass peritonitis and intra-abdominal abscesses resulting from disruption of the GI tract. The 2010 IDSA/SIS guidelines (Solomkin et al.) classify IAIs as UNCOMPLICATED (infection confined to a single organ without peritoneal extension — e.g., uncomplicated appendicitis, cholecystitis) vs COMPLICATED (cIAI — infection extends beyond the source organ into the peritoneal space, causing localized/diffuse peritonitis or abscess formation). This distinction drives the need for source control and breadth of antimicrobial therapy. Community-acquired vs healthcare-associated IAI is the second key distinction driving empiric choices.",
      epidemiology: "IAIs are the second most common cause of sepsis in ICU patients. Appendicitis is the most common surgical cause (~300,000 cases/year in US). Secondary peritonitis (perforated viscus, anastomotic leak) carries 20-60% mortality depending on severity and timing of intervention. Intra-abdominal abscesses develop in 10-30% of patients after GI perforation or surgery. Healthcare-associated IAI (post-operative leaks, tertiary peritonitis) involve MDR organisms in up to 30-50% of cases.",
      keyGuidelines: [
        { name: "IDSA/SIS 2010 — Guidelines for Diagnosis and Management of cIAI (Solomkin et al.)", detail: "Current definitive US guideline. Key principles: source control within 24h, empiric antibiotics covering enteric gram-negatives + anaerobes ± Enterococcus based on severity. Stratifies by community-acquired (mild-moderate vs high-risk/severe) and healthcare-associated. Recommends AGAINST routine anti-enterococcal or anti-Candidal empiric therapy in community-acquired IAI. Duration: 4-7 days with adequate source control." },
        { name: "STOP-IT Trial (Sawyer et al., 2015 NEJM)", detail: "Landmark RCT that changed IAI duration paradigm. 4 days of antibiotics after source control was non-inferior to conventional longer courses (mean ~8 days) for cIAI. Outcome-based stopping (treat until clinical resolution) was NOT superior to fixed 4-day courses. This trial established short-course therapy as the standard. Pharmacist impact: advocate for 4-day courses and antibiotic time-outs." },
        { name: "SIS/IDSA 2017 Revised Guidelines (Mazuski et al.)", detail: "Updated guidance emphasizing source control adequacy, short antibiotic courses (4 days), de-escalation based on cultures, and limiting empiric breadth in community-acquired IAI. Reinforced that anti-enterococcal coverage is NOT needed in most community-acquired IAI. Defined risk factors for healthcare-associated IAI requiring broader coverage." },
        { name: "Tokyo Guidelines 2018 (TG18) — Acute Cholangitis and Cholecystitis", detail: "International evidence-based guidelines for biliary infections. Severity grading: Grade I (mild — responds to antibiotics), Grade II (moderate — biliary drainage needed), Grade III (severe — organ dysfunction). Guides timing of intervention (cholecystectomy for cholecystitis, ERCP for cholangitis) and antibiotic selection. Key biliary pathogen: E. coli, Klebsiella, Enterococcus." },
      ],
      landmarkTrials: [
        { name: "STOP-IT (Sawyer et al., 2015 NEJM)", detail: "518 patients with cIAI and adequate source control randomized to 4 days fixed-duration antibiotics vs outcome-based continuation (stop 2 days after resolution of fever/leukocytosis/ileus). No difference in SSI, recurrent IAI, or death. Fixed 4-day course used 1.5 fewer antibiotic days. Practice-changing: 4 days is sufficient with adequate source control." },
        { name: "CIAOW Study (Sartelli et al., 2013)", detail: "Largest worldwide observational study of cIAI management (68 countries, >4,500 patients). Key finding: inadequate source control was the strongest independent predictor of mortality and treatment failure. Reinforced that NO antibiotic regimen can compensate for inadequate source control — source control is primary, antibiotics are adjunctive." },
        { name: "Montravers et al. (2009) — De-escalation in IAI", detail: "Showed de-escalation of empiric broad-spectrum therapy in cIAI (based on culture results at 48-72h) was safe and did not increase treatment failure. Supports aggressive culture-directed narrowing." },
        { name: "DURAPOP (Montravers et al., 2018)", detail: "Randomized trial in postoperative peritonitis: 8 days vs 15 days of antibiotics. No difference in treatment failure. Shorter courses were safe for complicated postoperative IAI with adequate source control. Extended the STOP-IT principle to healthcare-associated IAI." },
        { name: "Solomkin et al. (2010) Ertapenem vs Pip-Tazo", detail: "Multiple trials established ertapenem as non-inferior to pip-tazo for community-acquired cIAI. Advantage: once-daily dosing ideal for OPAT. Limitation: no Pseudomonas or Enterococcus coverage. Cemented ertapenem as a first-line option for mild-moderate community-acquired IAI." },
      ],
      riskFactors: "Healthcare-associated risk factors (post-operative IAI, prior antibiotics, prior hospitalization, immunosuppression) drive the need for broader empiric therapy. Severity indicators: APACHE II >=15, organ dysfunction, delayed source control (>24h), inability to achieve adequate source control, diffuse peritonitis, malnutrition, advanced age. Risk factors for resistant organisms: prior antibiotics (within 90 days), prior MDR culture, prolonged hospitalization, tertiary peritonitis, healthcare-associated origin.",
    },
    subcategories: [
      {
        id: "ca-iai-uncomplicated",
        name: "Uncomplicated IAI (Appendicitis, Cholecystitis)",
        definition: "Infection confined to a single organ without peritoneal extension. Includes: uncomplicated (non-perforated) appendicitis, uncomplicated (non-gangrenous) acute cholecystitis, uncomplicated diverticulitis (Hinchey I — confined pericolic phlegmon). Source control (appendectomy, cholecystectomy) is definitive; antibiotics are peri-operative prophylactic or very short-course. These infections do NOT require the broad, prolonged courses used for complicated IAI.",
        clinicalPresentation: "Acute appendicitis: periumbilical pain migrating to RLQ (McBurney's point), anorexia, nausea/vomiting, low-grade fever. Acute cholecystitis: RUQ pain (Murphy's sign positive), fever, nausea, post-prandial exacerbation. Uncomplicated diverticulitis: LLQ pain, low-grade fever, mild leukocytosis, CT showing pericolic fat stranding without abscess or free perforation.",
        diagnostics: "Appendicitis: CT abdomen/pelvis with IV contrast (sensitivity >95%), ultrasound (preferred in pediatric and pregnant patients). Cholecystitis: RUQ ultrasound (gallstones + gallbladder wall thickening + pericholecystic fluid + sonographic Murphy's sign), HIDA scan if ultrasound equivocal. Diverticulitis: CT abdomen/pelvis with IV contrast (confirms diagnosis, classifies Hinchey stage, identifies abscess/perforation). Blood cultures NOT routinely needed for uncomplicated IAI. WBC, CRP for trending.",
        empiricTherapy: [
          {
            line: "Uncomplicated Appendicitis — Peri-Operative",
            options: [
              { drug: "cefazolin-appx", regimen: "Cefazolin 2g IV + Metronidazole 500mg IV (single pre-op dose)", notes: "Standard peri-operative prophylaxis for appendectomy. Cefazolin covers enteric gram-positives and common Enterobacterales; metronidazole covers anaerobes (Bacteroides). SINGLE pre-operative dose is sufficient if appendix is non-perforated and no spillage. No post-operative antibiotics needed for uncomplicated appendicitis." },
              { drug: "ceftriaxone-appx", regimen: "Ceftriaxone 2g IV + Metronidazole 500mg IV (single pre-op dose)", notes: "Alternative prophylaxis. Broader gram-negative coverage than cefazolin. Some institutions use this for appendectomy, but cefazolin + metronidazole is equally effective and narrower. Single dose; no post-op continuation." },
            ],
          },
          {
            line: "Uncomplicated Cholecystitis — Peri-Operative",
            options: [
              { drug: "cefazolin-chole", regimen: "Cefazolin 2g IV (single pre-op dose for early cholecystectomy)", notes: "TG18: for mild (Grade I) acute cholecystitis with early cholecystectomy (<72h), a single pre-operative dose is sufficient. No post-operative antibiotics unless gangrenous or perforated. Biliary pathogens: E. coli, Klebsiella, Enterococcus — cefazolin covers the first two." },
              { drug: "ctx-metro-chole", regimen: "Ceftriaxone 2g IV daily + Metronidazole 500mg IV q8h", notes: "For moderate (Grade II) cholecystitis or delayed surgery. Continue until cholecystectomy or clinical resolution. Ceftriaxone has excellent biliary excretion (40% excreted in bile). Anaerobic coverage with metronidazole added for complicated biliary-enteric connections." },
            ],
          },
          {
            line: "Uncomplicated Diverticulitis — Outpatient",
            options: [
              { drug: "cipro-metro-div", regimen: "Ciprofloxacin 500mg PO BID + Metronidazole 500mg PO TID", notes: "Traditional outpatient regimen. Covers enteric gram-negatives + anaerobes. HOWEVER: Recent evidence (DIABOLO trial 2017, AVOD trial) showed antibiotics provide NO benefit for uncomplicated diverticulitis (Hinchey Ia — phlegmon only). AGA 2021 guidelines conditionally recommend AGAINST routine antibiotics for uncomplicated diverticulitis in immunocompetent patients. Discuss with the team." },
              { drug: "amox-clav-div", regimen: "Amoxicillin-clavulanate 875/125mg PO BID", notes: "Alternative single-agent oral option covering gram-negatives + anaerobes. Simpler regimen than cipro + metronidazole. Same caveat: may not be needed at all for uncomplicated diverticulitis per current evidence." },
            ],
          },
          {
            line: "Duration — Uncomplicated IAI",
            options: [
              { drug: "duration-uncomplicated", regimen: "Single pre-op dose (appendectomy/cholecystectomy), or ≤24h post-op, or NO antibiotics (uncomplicated diverticulitis)", notes: "Uncomplicated appendicitis: Pre-op dose only. Uncomplicated cholecystitis: Pre-op dose to 24h max. Uncomplicated diverticulitis: Increasingly treated without antibiotics (bowel rest, observation). The era of 7-14 day antibiotic courses for uncomplicated IAI is over. Source control (surgery) is the definitive treatment." },
            ],
          },
        ],
        organismSpecific: [
          { organism: "E. coli (most common aerobic IAI pathogen)", preferred: "Ceftriaxone, cefazolin, ciprofloxacin", alternative: "Pip-tazo, ertapenem", notes: "E. coli causes 50-60% of community-acquired IAI. Usually susceptible to ceftriaxone, FQs, and pip-tazo. ESBL-producing E. coli is emerging in community-acquired IAI — consider if prior FQ/cephalosporin use." },
          { organism: "Bacteroides fragilis (most common anaerobe)", preferred: "Metronidazole, pip-tazo, meropenem, ampicillin-sulbactam", alternative: "Ertapenem", notes: "Bacteroides fragilis is universally resistant to cephalosporins and most penicillins. ALWAYS add anaerobic coverage to any cephalosporin-based IAI regimen. Metronidazole is the most targeted agent. Clindamycin has rising B. fragilis resistance (30-40%) — unreliable for IAI." },
          { organism: "Enterococcus (biliary tract emphasis)", preferred: "Ampicillin, amoxicillin, pip-tazo (inherent activity)", alternative: "Vancomycin (if ampicillin-resistant)", notes: "Enterococcus is commonly cultured from biliary tract infections but is a PATHOGENIC DEBATE in non-biliary IAI. IDSA 2010: routine empiric Enterococcal coverage NOT recommended for community-acquired IAI. Coverage recommended for: biliary-origin IAI, healthcare-associated IAI, immunocompromised, prosthetic material infections, Enterococcal bacteremia." },
        ],
        pearls: [
          "UNCOMPLICATED DIVERTICULITIS MAY NOT NEED ANTIBIOTICS AT ALL: DIABOLO (2017, Lancet) and AVOD trials showed no difference in outcomes for uncomplicated diverticulitis treated with vs. without antibiotics. AGA 2021 conditionally recommends against routine antibiotics for immunocompetent patients with uncomplicated diverticulitis. This is a major paradigm shift — discuss with the surgical team and advocate for guideline-concordant care.",
          "Single-dose prophylaxis for appendectomy/cholecystectomy: If the organ is not perforated and there's no spillage, a single pre-operative antibiotic dose is all that's needed. Post-operative antibiotics for uncomplicated appendectomy or cholecystectomy are unnecessary and represent antibiotic overuse. Stewardship opportunity: review post-op orders and discontinue if not indicated.",
          "Ceftriaxone biliary excretion: Ceftriaxone is unique among cephalosporins — ~40% is excreted unchanged in bile, achieving biliary concentrations 20-150× serum levels. This makes it particularly effective for biliary infections. Caveat: ceftriaxone can form biliary sludge/pseudolithiasis (calcium-ceftriaxone precipitate) — usually reversible but avoid in patients with active biliary obstruction.",
        ],
      },
      {
        id: "ca-iai-complicated",
        name: "Community-Acquired Complicated IAI (cIAI)",
        definition: "Infection that extends beyond the source organ into the peritoneal space. Includes: perforated appendicitis with peritonitis, perforated diverticulitis (Hinchey II-IV), perforated peptic ulcer, small bowel perforation, intra-abdominal abscess, secondary peritonitis from any GI perforation. Requires BOTH source control (surgical or percutaneous drainage) AND antimicrobial therapy covering enteric gram-negatives and anaerobes. IDSA 2010 further stratifies into mild-moderate (APACHE <15, healthy host) vs high-risk/severe (APACHE >=15, immunosuppression, healthcare exposure).",
        clinicalPresentation: "Diffuse or localized abdominal pain, guarding, rigidity (peritoneal signs). Fever, tachycardia, leukocytosis. Diffuse peritonitis: board-like abdomen, absent bowel sounds, hemodynamic instability. Localized abscess: focal tenderness, fever, persistent leukocytosis after initial intervention. Free air on imaging indicates perforation. Sepsis/septic shock may be the presenting picture — IAI is the 2nd most common cause of abdominal sepsis.",
        diagnostics: "CT abdomen/pelvis with IV contrast: imaging modality of choice (free air, abscess, bowel wall thickening, mesenteric fat stranding, extraluminal contrast extravasation). Blood cultures: obtain before antibiotics in moderate-severe. Peritoneal fluid cultures: obtain at time of surgery or percutaneous drainage — aerobic + anaerobic cultures. Gram stain helpful for rapid pathogen identification. Lactate (prognostic, indicates tissue hypoperfusion). Procalcitonin: can guide duration (trending down supports discontinuation).",
        empiricTherapy: [
          {
            line: "First-Line — Mild-Moderate cIAI (APACHE <15, No MDR Risk)",
            options: [
              { drug: "ctx-metro-ciai", regimen: "Ceftriaxone 2g IV daily + Metronidazole 500mg IV q8h", notes: "IDSA 2010 recommended combination. Ceftriaxone covers enteric gram-negatives; metronidazole covers anaerobes (particularly B. fragilis). Simple, well-tolerated, once-daily ceftriaxone component. NO Pseudomonal or Enterococcal coverage — appropriate for community-acquired, mild-moderate cIAI. Duration: 4 days post source control (STOP-IT)." },
              { drug: "ertapenem-ciai", regimen: "Ertapenem 1g IV once daily", notes: "IDSA 2010 first-line single-agent option for mild-moderate cIAI. Covers Enterobacterales + anaerobes + Streptococci + MSSA in one drug. Once-daily = excellent for OPAT. Equivalent to pip-tazo in multiple RCTs. GAPS: no Pseudomonas, no Enterococcus, no MRSA. The narrowest carbapenem — minimal Pseudomonal selection pressure compared to meropenem." },
              { drug: "amp-sulb-ciai", regimen: "Ampicillin-sulbactam 3g IV q6h", notes: "IDSA 2010 recommended for mild-moderate cIAI. Covers Enterobacterales + anaerobes + Enterococcus + Streptococci. UNIQUE ADVANTAGE: the only first-line cIAI regimen with intrinsic Enterococcal coverage. Good choice for biliary-origin cIAI. LIMITATION: rising E. coli resistance (20-30% in many regions) — check local antibiogram. Not reliable for Pseudomonas." },
            ],
          },
          {
            line: "First-Line — High-Risk/Severe cIAI (APACHE >=15 or MDR Risk Factors)",
            options: [
              { drug: "pip-tazo-ciai", regimen: "Pip-tazo 4.5g IV q6h (extended infusion over 4h)", notes: "IDSA 2010 first-line for high-risk/severe community-acquired cIAI. Broadest non-carbapenem single-agent option: covers Enterobacterales, Pseudomonas, anaerobes, Enterococcus (faecalis), Streptococci, MSSA. Extended infusion optimizes PK for sicker patients. Duration: 4 days post source control (STOP-IT)." },
              { drug: "meropenem-ciai", regimen: "Meropenem 1g IV q8h (extended infusion over 3h)", notes: "Reserve for: APACHE >=15, ESBL risk, prior resistant organisms, failed initial therapy. Broadest coverage. Always de-escalate based on cultures (within 48-72h). Meropenem should NOT be first-line for mild-moderate community-acquired IAI — this is carbapenem overuse and drives CRE." },
              { drug: "cefepime-metro-ciai", regimen: "Cefepime 2g IV q8h + Metronidazole 500mg IV q8h", notes: "Alternative for severe cIAI with Pseudomonal concern. Cefepime provides anti-pseudomonal and AmpC-stable gram-negative coverage; metronidazole adds anaerobes. No inherent Enterococcal coverage. Consider adding ampicillin if biliary source or Enterococcal risk." },
            ],
          },
          {
            line: "Duration — STOP-IT Standard",
            options: [
              { drug: "duration-ciai", regimen: "4 days after adequate source control (STOP-IT trial standard)", notes: "STOP-IT trial (2015 NEJM): 4 fixed days of antibiotics after source control was equivalent to outcome-based longer courses. This is the new standard. KEY CAVEAT: adequate source control MUST be achieved. If source control is inadequate (persistent abscess, ongoing leak, unable to operate), longer courses may be needed — but the answer is better source control, not more antibiotics. Pharmacist role: antibiotic time-out at day 4, advocate for discontinuation if source controlled and clinically improving." },
            ],
          },
        ],
        organismSpecific: [
          { organism: "E. coli + Klebsiella (dominant aerobic gram-negatives)", preferred: "Ceftriaxone, ertapenem, pip-tazo", alternative: "Ciprofloxacin, meropenem (ESBL)", notes: "Together cause 60-70% of aerobic IAI isolates. Community-acquired strains usually susceptible to cephalosporins and pip-tazo. ESBL prevalence rising — risk factors: prior cephalosporins/FQs, recent hospitalization, travel to endemic areas (South/Southeast Asia). If ESBL confirmed: meropenem is the gold standard (MERINO trial). Ertapenem also effective for non-Pseudomonal ESBL." },
          { organism: "Bacteroides fragilis group", preferred: "Metronidazole, pip-tazo, meropenem, ertapenem", alternative: "Ampicillin-sulbactam", notes: "Present in virtually all IAI from colonic sources. ALWAYS include anaerobic coverage in IAI regimens. Metronidazole is the most targeted agent and maintains >99% B. fragilis susceptibility despite decades of use. Clindamycin is NOT reliable for B. fragilis in IAI (30-40% resistance). Cephalosporins (ceftriaxone, cefepime) have NO B. fragilis activity — never use them alone for IAI." },
          { organism: "Enterococcus faecalis", preferred: "Ampicillin, pip-tazo (inherent activity), vancomycin (if resistant)", alternative: "Linezolid (for VRE)", notes: "THE ENTEROCOCCAL CONTROVERSY: Enterococcus is frequently cultured from IAI but its pathogenic role is debated. IDSA 2010: empiric Enterococcal coverage NOT recommended for community-acquired IAI. Cover Enterococcus empirically ONLY when: biliary source, healthcare-associated IAI, post-operative peritonitis, immunocompromised, Enterococcus in blood cultures, or failure with non-Enterococcal regimen." },
          { organism: "Pseudomonas aeruginosa", preferred: "Pip-tazo, cefepime, meropenem", alternative: "Ciprofloxacin + metronidazole", notes: "Uncommon in community-acquired IAI (<5% of isolates). More common in healthcare-associated IAI. IDSA 2010: empiric anti-pseudomonal coverage NOT needed for community-acquired IAI unless severe or healthcare-associated risk factors. Overtreatment of Pseudomonas in community IAI is common stewardship target." },
        ],
        pearls: [
          "STOP-IT = 4 DAYS: This is the single most important trial in IAI management. With adequate source control, 4 days of antibiotics is sufficient for cIAI. Every additional day beyond 4 days increases C. diff risk, resistance selection, and cost without improving outcomes. Pharmacist intervention: flag patients on day 4 who are improving and advocate for discontinuation.",
          "SOURCE CONTROL IS PRIMARY, ANTIBIOTICS ARE ADJUNCTIVE: The CIAOW study showed inadequate source control is the #1 predictor of mortality in cIAI. No antibiotic regimen — no matter how broad — can substitute for proper surgical/percutaneous drainage. If a patient is failing antibiotics for IAI, the question is 'Is source control adequate?' not 'Should we escalate antibiotics?'",
          "The Enterococcal trap: Enterococcus grows frequently in IAI cultures, tempting clinicians to add ampicillin or vancomycin. IDSA 2010 says DON'T routinely cover Enterococcus in community-acquired IAI — outcomes are the same with or without specific Enterococcal coverage. The exception: biliary infections, healthcare-associated IAI, Enterococcal bacteremia, or immunocompromised patients. This is a high-value stewardship intervention.",
          "Ertapenem is NOT meropenem: Ertapenem is the narrowest carbapenem. It does NOT cover Pseudomonas or Acinetobacter (unlike meropenem/imipenem/doripenem). This is an ADVANTAGE for community-acquired IAI: carbapenem-level anaerobic + Enterobacterales coverage without the Pseudomonal selection pressure. Using meropenem when ertapenem would suffice is carbapenem misuse.",
          "Ceftriaxone has NO anaerobic coverage: This is the most common empiric error in IAI management. A surgeon orders 'ceftriaxone for peritonitis' — this leaves Bacteroides completely uncovered. ALWAYS pair ceftriaxone with metronidazole for any IAI. If you see ceftriaxone monotherapy for IAI, intervene immediately.",
          "FQ resistance in E. coli is rising: Ciprofloxacin/levofloxacin resistance in E. coli has reached 20-30% in many communities. The cipro + metronidazole regimen for IAI is becoming less reliable. Ceftriaxone + metronidazole or amoxicillin-clavulanate are more reliable empiric oral/IV options. Check local antibiogram before prescribing FQ-based IAI regimens.",
        ],
      },
      {
        id: "ha-iai",
        name: "Healthcare-Associated & Post-Operative IAI",
        definition: "IAI occurring after recent healthcare exposure: post-operative peritonitis (anastomotic leak, surgical site infection), tertiary peritonitis (persistent/recurrent peritonitis after adequate treatment of secondary peritonitis), IAI in patients with recent hospitalization (>48h in past 90 days), recent IV antibiotics, or immunosuppression. MDR organisms are significantly more common (20-50%): ESBL Enterobacterales, Pseudomonas, VRE, Candida. Requires broader empiric coverage and aggressive culture-directed de-escalation.",
        clinicalPresentation: "Post-operative: fever, increasing WBC, ileus persisting beyond expected, new abdominal pain, wound drainage (purulent or enteric content), hemodynamic instability. Often subtle in ICU patients — may manifest as only unexplained clinical deterioration. Tertiary peritonitis: persistent fever and organ dysfunction despite adequate initial treatment — carries the worst prognosis (mortality 30-60%). CT findings: new or enlarging fluid collections, abscess, free air (anastomotic leak), bowel wall thickening.",
        diagnostics: "CT abdomen/pelvis with IV and oral contrast (oral contrast particularly helpful for identifying leak). Peritoneal/abscess fluid cultures (aerobic + anaerobic + fungal — Candida is an important pathogen in this setting). Blood cultures. Procalcitonin trending. Gram stain of peritoneal fluid (yeast forms may indicate Candida peritonitis). Consider beta-D-glucan if Candida suspected.",
        empiricTherapy: [
          {
            line: "Empiric — Post-Operative / Healthcare-Associated cIAI",
            options: [
              { drug: "pip-tazo-ha-iai", regimen: "Pip-tazo 4.5g IV q6h (extended infusion) + Vancomycin IV", notes: "Standard empiric regimen for healthcare-associated IAI. Pip-tazo covers Pseudomonas, Enterobacterales, anaerobes, Enterococcus faecalis. Add vancomycin for VRE (E. faecium) and MRSA coverage in high-risk patients. De-escalate aggressively at 48-72h based on cultures." },
              { drug: "meropenem-ha-iai", regimen: "Meropenem 1g IV q8h (extended infusion) + Vancomycin IV", notes: "For patients with ESBL risk, prior resistant organisms, or severe sepsis/septic shock. Meropenem covers ESBL, AmpC, Pseudomonas, anaerobes. Vancomycin for VRE/MRSA. THIS is the appropriate use of meropenem — healthcare-associated cIAI with MDR risk, not routine community-acquired IAI." },
              { drug: "cefepime-metro-ha", regimen: "Cefepime 2g IV q8h (extended infusion) + Metronidazole 500mg IV q8h + Vancomycin IV", notes: "Alternative triple therapy. Cefepime for anti-pseudomonal + AmpC stability; metronidazole for anaerobes; vancomycin for VRE/MRSA. More components but allows carbapenem-sparing approach when ESBL risk is not high." },
            ],
          },
          {
            line: "ADD Antifungal If Candida Risk Factors",
            options: [
              { drug: "fluconazole-iai", regimen: "Fluconazole 400mg IV/PO daily (loading 800mg day 1) — or — Micafungin 100mg IV daily", notes: "Candida peritonitis risk factors: upper GI perforation (especially with acid suppression), recurrent GI surgery, anastomotic leak, immunosuppression, prolonged antibiotics, TPN, Candida in peritoneal cultures. IDSA 2010: empiric antifungal NOT routine — add when risk factors present or yeast seen on Gram stain. Fluconazole for susceptible Candida albicans; echinocandin (micafungin, caspofungin) for C. glabrata/C. krusei or critically ill. Source control is critical for Candida peritonitis." },
            ],
          },
          {
            line: "Duration — Healthcare-Associated IAI",
            options: [
              { drug: "duration-ha-iai", regimen: "4-7 days after adequate source control; longer if source control inadequate or tertiary peritonitis", notes: "DURAPOP trial: 8 days was safe for postoperative peritonitis (vs 15 days). Apply STOP-IT principles: fixed short-course with adequate source control. Tertiary peritonitis is the exception — may require prolonged courses (2-4 weeks) due to ongoing infection with resistant organisms and often inadequate source control. Focus on optimizing source control rather than extending antibiotics." },
            ],
          },
        ],
        organismSpecific: [
          { organism: "ESBL-producing Enterobacterales", preferred: "Meropenem, ertapenem (non-Pseudomonal)", alternative: "Pip-tazo (controversial — MERINO trial showed inferiority for bacteremia)", notes: "ESBL prevalence in healthcare-associated IAI: 15-30%. MERINO trial caution: pip-tazo was inferior to meropenem for ESBL bacteremia. For serious ESBL IAI, carbapenems remain preferred. Ertapenem appropriate for non-critical, non-Pseudomonal ESBL IAI." },
          { organism: "Pseudomonas aeruginosa", preferred: "Pip-tazo, cefepime, meropenem", alternative: "Ciprofloxacin (check susceptibility)", notes: "Present in 10-20% of healthcare-associated IAI. Risk factors: prior broad-spectrum antibiotics, chronic illness, prolonged hospitalization. Double-cover empirically in septic shock; de-escalate to monotherapy when susceptibility known." },
          { organism: "Enterococcus faecium (including VRE)", preferred: "Linezolid, daptomycin", alternative: "Ampicillin (if susceptible — rare for E. faecium)", notes: "VRE is a real pathogen in healthcare-associated IAI (unlike the debate over Enterococcus in community-acquired IAI). E. faecium is intrinsically resistant to cephalosporins and often resistant to ampicillin. If VRE in peritoneal cultures with clinical infection: linezolid 600mg IV/PO BID (excellent peritoneal penetration) or daptomycin." },
          { organism: "Candida species", preferred: "Fluconazole (C. albicans), echinocandin (C. glabrata, C. krusei, critically ill)", alternative: "Amphotericin B (resistant Candida)", notes: "Candida in peritoneal fluid is a true pathogen requiring treatment (unlike Candida in sputum/urine which is often colonization). Source control (drainage) is essential. Species identification guides therapy: C. albicans is usually fluconazole-susceptible; C. glabrata requires echinocandin; C. auris is an emerging MDR threat requiring ID consultation." },
        ],
        pearls: [
          "Healthcare-associated IAI is a completely different disease than community-acquired IAI: MDR organisms, polymicrobial with resistant gram-negatives and VRE, Candida risk, higher mortality. The empiric regimen should be broader, the source control more aggressive, and the culture-directed de-escalation more diligent. Don't apply community-acquired IAI regimens to post-operative peritonitis.",
          "Tertiary peritonitis is the most challenging IAI scenario: Defined as persistent/recurrent peritonitis after adequate treatment of secondary peritonitis. Organisms shift to low-virulence, highly resistant pathogens (VRE, Pseudomonas, Candida, CoNS). Mortality 30-60%. Often reflects persistent source control failure rather than antibiotic failure. Surgical re-exploration and optimized source control are more important than escalating antibiotics.",
          "Candida in peritoneal cultures matters: Unlike Candida in urine or respiratory cultures (usually colonization), Candida isolated from peritoneal fluid obtained surgically or via drain IS pathogenic and requires treatment. Risk factors: upper GI perforation, recurrent surgery, TPN, broad-spectrum antibiotics. Always speciate Candida — treatment differs significantly by species.",
          "De-escalation is a pharmacist responsibility: Healthcare-associated IAI requires broad empiric therapy, but MUST be narrowed at 48-72h based on cultures. This is where pharmacists add the most value: reviewing culture results, recommending targeted narrowing (meropenem → ertapenem if no Pseudomonas; vancomycin → discontinue if no MRSA/VRE), and ensuring the STOP-IT 4-day timeline is followed.",
        ],
      },
      {
        id: "biliary-iai",
        name: "Biliary Infections (Cholangitis & Complicated Cholecystitis)",
        definition: "Infections of the biliary system, primarily acute cholangitis (infection of the bile duct, usually from obstruction — choledocholithiasis, stricture, or stent occlusion) and complicated cholecystitis (gangrenous, emphysematous, or perforated gallbladder). Tokyo Guidelines 2018 (TG18) classification: Grade I (mild — responds to antibiotics), Grade II (moderate — requires biliary drainage), Grade III (severe — organ dysfunction). Charcot's triad (fever, RUQ pain, jaundice) is present in only 50-70% of cholangitis. Reynolds' pentad adds hypotension and mental status changes (severe cholangitis).",
        clinicalPresentation: "Cholangitis: Charcot's triad (fever + RUQ pain + jaundice) — classic but often incomplete. Reynolds' pentad (adds hypotension + AMS) indicates severe cholangitis with sepsis. Labs: elevated WBC, conjugated bilirubin, ALP, GGT, often elevated lipase. Complicated cholecystitis: RUQ pain, high fever, marked tenderness, peritoneal signs if perforated. Emphysematous cholecystitis (gas in gallbladder wall on imaging) — higher risk of perforation, more common in diabetics.",
        diagnostics: "RUQ ultrasound: first-line for cholecystitis (stones, wall thickening, pericholecystic fluid). Common bile duct dilation (>6mm) suggests choledocholithiasis. MRCP (magnetic resonance cholangiopancreatography): non-invasive cholangiography to visualize CBD stones/strictures. ERCP: both diagnostic and therapeutic — sphincterotomy, stone extraction, stent placement. Blood cultures: ESSENTIAL in cholangitis (bacteremia rate 30-50%). Bile cultures: obtain at ERCP or surgery. Liver function panel: bilirubin, ALP, GGT trending.",
        empiricTherapy: [
          {
            line: "First-Line — Acute Cholangitis (Grade I-II)",
            options: [
              { drug: "ctx-metro-bil", regimen: "Ceftriaxone 2g IV daily + Metronidazole 500mg IV q8h", notes: "TG18 first-line. Ceftriaxone excellent biliary penetration (40% biliary excretion). Metronidazole for anaerobes (important in biliary-enteric anastomosis or instrumented ducts). Add ampicillin 2g IV q4h if Enterococcal coverage desired (biliary infections have higher Enterococcal prevalence). Duration: 4-7 days post drainage (shorter if adequately drained)." },
              { drug: "pip-tazo-bil", regimen: "Pip-tazo 4.5g IV q6h (extended infusion)", notes: "Single-agent alternative covering gram-negatives, anaerobes, and Enterococcus. Good biliary penetration. Particularly useful when Enterococcal coverage desired without adding a separate agent. For Grade II-III cholangitis with sepsis." },
              { drug: "amp-sulb-bil", regimen: "Ampicillin-sulbactam 3g IV q6h", notes: "TG18 recommended. Covers Enterobacterales, anaerobes, and Enterococcus. The Enterococcal coverage is particularly relevant for biliary infections. Limitation: E. coli resistance (check local rates). Excellent option when local susceptibility supports it." },
            ],
          },
          {
            line: "First-Line — Severe Cholangitis (Grade III) or Healthcare-Associated Biliary",
            options: [
              { drug: "meropenem-bil", regimen: "Meropenem 1g IV q8h + Vancomycin IV (if VRE risk)", notes: "For severe (Grade III) cholangitis with organ dysfunction, healthcare-associated biliary infection, or prior resistant organisms. Broadest coverage. De-escalate based on bile and blood cultures at 48-72h." },
              { drug: "pip-tazo-vanco-bil", regimen: "Pip-tazo 4.5g IV q6h (extended infusion) + Vancomycin IV", notes: "Alternative for severe cholangitis when carbapenem-sparing desired. Pip-tazo covers most gram-negatives + anaerobes + E. faecalis. Add vancomycin for E. faecium/VRE/MRSA coverage." },
            ],
          },
          {
            line: "Duration — Biliary Infections",
            options: [
              { drug: "duration-biliary", regimen: "4-7 days after adequate biliary drainage; shorter if uncomplicated with good source control", notes: "TG18 + STOP-IT principles: once biliary obstruction is relieved (ERCP with sphincterotomy/stent, cholecystectomy, percutaneous drainage), 4-7 days is sufficient. Bacteremia: treat for minimum 7-14 days per bloodstream infection standards. Without adequate drainage: antibiotics alone are usually insufficient — biliary decompression is the source control equivalent for cholangitis." },
            ],
          },
        ],
        organismSpecific: [
          { organism: "E. coli (50-60% of biliary infections)", preferred: "Ceftriaxone, pip-tazo, ertapenem", alternative: "Ciprofloxacin (if susceptible), meropenem (ESBL)", notes: "Dominant biliary pathogen. Usually susceptible to cephalosporins. ESBL risk higher in patients with prior instrumentation, stents, or recent antibiotics." },
          { organism: "Klebsiella species (15-20%)", preferred: "Ceftriaxone, pip-tazo", alternative: "Meropenem (ESBL/KPC)", notes: "Second most common biliary aerobe. Same resistance concerns as E. coli." },
          { organism: "Enterococcus species (10-20%)", preferred: "Ampicillin, pip-tazo", alternative: "Vancomycin, linezolid (VRE)", notes: "Enterococcal coverage IS recommended for biliary infections (unlike non-biliary community-acquired IAI). The biliary tract is a niche where Enterococcus is a true pathogen. Ampicillin-sulbactam and pip-tazo have inherent E. faecalis activity. For E. faecium (often ampicillin-resistant): vancomycin or linezolid." },
          { organism: "Anaerobes (Bacteroides, Clostridium)", preferred: "Metronidazole, pip-tazo, meropenem", alternative: "Ampicillin-sulbactam", notes: "More common in complicated biliary disease: biliary-enteric anastomosis (prior surgery), elderly patients, recurrent cholangitis, emphysematous cholecystitis. Always cover when these risk factors present." },
        ],
        pearls: [
          "BILIARY DRAINAGE IS THE SOURCE CONTROL: In cholangitis, ERCP with biliary decompression is the equivalent of surgical source control. Antibiotics alone without drainage have high failure rates for moderate-severe cholangitis. Timing: Grade II should have drainage within 24-48h; Grade III is emergent within 12h (after initial resuscitation).",
          "Enterococcal coverage matters here: Unlike non-biliary community-acquired IAI, biliary infections have a higher prevalence of Enterococcus as a true pathogen (10-20% of biliary cultures). Ampicillin-sulbactam and pip-tazo provide intrinsic E. faecalis coverage. Ceftriaxone-based regimens leave an Enterococcal gap — consider adding ampicillin if biliary source confirmed.",
          "Ceftriaxone biliary sludge: Ceftriaxone forms calcium-ceftriaxone precipitate in bile (biliary pseudolithiasis). Usually asymptomatic and reversible after stopping the drug. However, avoid ceftriaxone in patients with complete biliary obstruction or patients on high-calcium infusions (neonates on calcium-containing IV solutions — CONTRAINDICATED). In adults with biliary stents and adequate flow, ceftriaxone is generally safe.",
          "Blood culture yield in cholangitis is HIGH: Unlike cellulitis (2-5%), cholangitis has bacteremia rates of 30-50%. Always obtain blood cultures before antibiotics. Positive blood cultures guide duration (minimum 7-14 days for Enterobacterales bacteremia) and may reveal organisms not seen in bile cultures.",
          "Percutaneous cholecystostomy tube: For patients too ill for cholecystectomy (Grade III cholecystitis, poor surgical candidates), IR-guided percutaneous cholecystostomy provides biliary decompression. Antibiotics + percutaneous drainage is the bridge strategy. Pharmacists should anticipate prolonged antibiotic courses in these patients since definitive source control is delayed.",
        ],
      },
    ],
    drugMonographs: [
      {
        id: "metronidazole",
        name: "Metronidazole",
        brandNames: "Flagyl",
        drugClass: "Nitroimidazole antibiotic",
        mechanismOfAction: "Prodrug that is reduced intracellularly in anaerobic organisms to form reactive intermediates (nitroso free radicals and hydroxylamine). These intermediates damage DNA through strand breakage, inhibiting nucleic acid synthesis and causing cell death. Bactericidal with concentration-dependent killing. Requires LOW oxygen environment for activation — this is why it ONLY works against anaerobes and certain microaerophilic organisms. Has no activity against aerobes (the prodrug is never activated).",
        spectrum: "ANAEROBES ONLY (with few exceptions). Gram-negative anaerobes: Bacteroides fragilis group (>99% susceptibility — the GOLD STANDARD anti-Bacteroides agent), Prevotella, Fusobacterium. Gram-positive anaerobes: Clostridium species (including C. difficile — oral metronidazole is a treatment option), Peptostreptococcus. Protozoa: Giardia, Entamoeba histolytica, Trichomonas vaginalis. GAPS: ALL aerobes (no activity against Enterobacterales, Staphylococci, Streptococci, Pseudomonas), Propionibacterium (Cutibacterium) acnes, Actinomyces, Lactobacillus.",
        dosing: {
          iai: "500mg IV/PO q8h (or 1g IV q12h loading for severe infections)",
          c_diff: "500mg PO TID × 10-14 days (now second-line per IDSA 2021 — vancomycin PO preferred)",
          brain_abscess: "500mg IV q8h (excellent CNS penetration)",
          h_pylori: "500mg PO BID (in combination regimens)",
          surgical_prophylaxis: "500mg IV within 60 min before incision (combined with cefazolin for colorectal procedures)",
          bv_trichomoniasis: "500mg PO BID × 7 days (BV), 2g PO single dose (trichomoniasis)",
        },
        renalAdjustment: "No dose adjustment for standard renal impairment. Hemodialysis: metronidazole is dialyzable — dose after HD. Supplemental dose after HD recommended.",
        hepaticAdjustment: "SIGNIFICANT: Metronidazole is hepatically metabolized. In severe hepatic impairment (Child-Pugh C), clearance is reduced by 50% — reduce dose to q12h or use alternative. Monitor for neurotoxicity in liver disease.",
        adverseEffects: {
          common: "Metallic taste (very common — warn patients), nausea/vomiting (10-15%), anorexia, headache, dark urine (harmless — warn patients to expect this)",
          serious: "Peripheral neuropathy (dose-related and duration-related — usually after >4 weeks of cumulative therapy; presents as numbness/tingling in extremities; may be irreversible if not caught early), seizures (rare), optic neuropathy",
          rare: "CNS toxicity (cerebellar toxicity — ataxia, dysarthria, particularly in high-dose or prolonged courses), pancreatitis, neutropenia (reversible), Stevens-Johnson Syndrome",
        },
        drugInteractions: [
          "DISULFIRAM-LIKE REACTION WITH ALCOHOL: Metronidazole inhibits aldehyde dehydrogenase. Consuming alcohol during therapy (or within 48-72h after completing) causes severe nausea, vomiting, flushing, headache, and abdominal cramps. COUNSEL EVERY PATIENT about alcohol avoidance. This includes alcohol-containing medications, mouthwashes, and hand sanitizers (theoretical concern with heavy exposure).",
          "Warfarin — metronidazole is a potent CYP2C9 inhibitor. INCREASES warfarin effect significantly (INR can double or triple). Monitor INR closely and reduce warfarin dose proactively. This is one of the most clinically significant antibiotic-warfarin interactions.",
          "Lithium — metronidazole reduces lithium renal clearance, increasing lithium levels. Monitor lithium levels if co-administered.",
          "Phenytoin/fosphenytoin — metronidazole inhibits phenytoin metabolism. Monitor phenytoin levels.",
          "Disulfiram — avoid combination. Psychotic reactions have been reported.",
          "Busulfan — metronidazole may increase busulfan levels. Avoid combination if possible.",
        ],
        monitoring: "Neurological assessment: monitor for peripheral neuropathy symptoms (numbness, tingling, paresthesias) — especially in courses >2 weeks. If symptoms develop, STOP metronidazole immediately. Liver function (baseline if hepatic impairment). INR if on warfarin (within 3-5 days of starting metronidazole). No drug level monitoring needed.",
        pregnancyLactation: "Category B. Historically avoided in first trimester due to theoretical mutagenicity concerns, but large meta-analyses have NOT shown increased birth defect risk. Acceptable for use in pregnancy when benefits outweigh risks (e.g., trichomoniasis, severe anaerobic infections). Enters breast milk — AAP considers compatible but some recommend pump-and-dump for 12-24h after single high-dose treatment.",
        pharmacistPearls: [
          "ORAL BIOAVAILABILITY IS ~100%: Metronidazole IV and PO are essentially interchangeable. If a patient is tolerating oral medications, there is ZERO reason to continue IV metronidazole. IV-to-PO conversion is one of the easiest stewardship wins. The PO formulation achieves identical serum levels, identical tissue penetration, and costs a fraction of IV.",
          "Warfarin interaction is SEVERE and predictable: Every patient on warfarin who starts metronidazole will have a rising INR. This is not a 'possible' interaction — it is pharmacologically inevitable (CYP2C9 inhibition). Proactively reduce warfarin dose by 25-50% when starting metronidazole and check INR within 3-5 days. Setting up monitoring at the time of metronidazole initiation prevents bleeding events.",
          "Peripheral neuropathy is the dose-limiting toxicity: Unlike most antibiotic adverse effects that resolve upon discontinuation, metronidazole-induced peripheral neuropathy can be IRREVERSIBLE if not caught early. The risk increases with cumulative dose and duration (typically >4 weeks). Monitor for numbness/tingling and discontinue immediately if symptoms develop. For IAI courses (4-7 days), this is not a concern — it becomes relevant for prolonged courses (brain abscess, C. diff retreatment).",
          "Metronidazole has EXCELLENT CNS penetration: It crosses the blood-brain barrier effectively, achieving CSF levels 40-100% of serum. This makes it the drug of choice for the anaerobic component of brain abscess therapy (usually combined with ceftriaxone for the aerobic component). Very few antibiotics penetrate the CNS this well.",
          "C. diff treatment hierarchy: Metronidazole has been DEMOTED from first-line C. diff treatment. IDSA/SHEA 2021 guidelines: vancomycin PO or fidaxomicin PO are preferred over metronidazole for all C. diff episodes. Metronidazole is now reserved for initial non-severe C. diff when vancomycin/fidaxomicin are not accessible. Oral vancomycin 125mg QID is the standard.",
          "The alcohol interaction is real but the risk window is debated: The traditional teaching is to avoid alcohol for 48-72h after metronidazole. Some pharmacology references suggest the disulfiram-like reaction may be less consistent than previously thought. Regardless, it's best practice to counsel patients to avoid alcohol during treatment and for at least 48h after. The consequences of the reaction (severe vomiting, cardiovascular effects) are significant enough that the counsel is justified.",
        ],
      },
      {
        id: "ampicillin-sulbactam-iai",
        name: "Ampicillin-Sulbactam",
        brandNames: "Unasyn",
        drugClass: "Aminopenicillin + beta-lactamase inhibitor",
        mechanismOfAction: "Ampicillin binds PBPs, inhibiting cell wall synthesis (bactericidal, time-dependent). Sulbactam is a beta-lactamase inhibitor that irreversibly binds and inactivates many Class A beta-lactamases (TEM, SHV), protecting ampicillin from enzymatic degradation. Sulbactam also has INTRINSIC antimicrobial activity against Acinetobacter species — this is pharmacologically unique and clinically relevant for MDR Acinetobacter infections where sulbactam itself is the active agent.",
        spectrum: "Gram-positive: Streptococci (excellent), MSSA, Enterococcus faecalis (ampicillin is drug of choice for susceptible Enterococcus). Gram-negative: E. coli, Klebsiella, Proteus, H. influenzae (including beta-lactamase producers). Acinetobacter (sulbactam component). Anaerobes: good — Bacteroides fragilis (70-80% susceptibility), Peptostreptococcus, Clostridium. GAPS: MRSA, ESBL producers (sulbactam does not inhibit ESBLs effectively), AmpC producers (Enterobacter, Citrobacter, Serratia), Pseudomonas (no activity), VRE (E. faecium usually ampicillin-resistant).",
        dosing: {
          standard: "3g (2g ampicillin + 1g sulbactam) IV q6h",
          iai: "3g IV q6h",
          aspiration_pneumonia: "3g IV q6h (one of few agents covering oral anaerobes + aerobes for aspiration)",
          acinetobacter: "9g IV q8h (high-dose sulbactam — 3g sulbactam per dose, given as 9g amp-sulb q8h or using sulbactam separately)",
          pelvic_infections: "3g IV q6h",
          max_daily: "12g/day (8g ampicillin + 4g sulbactam)",
        },
        renalAdjustment: "CrCl 15-29: 3g IV q12h. CrCl 5-14: 3g IV q24h. Hemodialysis: 3g IV q24h (dose after HD on dialysis days). Both ampicillin and sulbactam are renally eliminated.",
        hepaticAdjustment: "No adjustment needed — renally eliminated.",
        adverseEffects: {
          common: "Diarrhea (9%), rash (2-5%), injection site pain/phlebitis, nausea",
          serious: "C. difficile colitis, hypersensitivity reactions (cross-reactive with penicillin — same beta-lactam ring), seizures (high doses or renal impairment), interstitial nephritis, hemolytic anemia",
          rare: "Anaphylaxis (0.01-0.05%), Stevens-Johnson Syndrome, acute generalized exanthematous pustulosis (AGEP)",
          contraindications: "History of serious penicillin allergy (anaphylaxis, angioedema, severe urticaria). Infectious mononucleosis (ampicillin causes characteristic maculopapular rash in 70-100% of mono patients).",
        },
        drugInteractions: [
          "Allopurinol — increases incidence of ampicillin rash (not a true allergy — mechanism unclear but well-documented).",
          "Warfarin — ampicillin may enhance anticoagulant effect through vitamin K-related mechanism. Monitor INR.",
          "Methotrexate — ampicillin reduces renal clearance of methotrexate, increasing levels and toxicity. Monitor methotrexate levels and renal function.",
          "Oral contraceptives — theoretical reduction in efficacy (disruption of enterohepatic circulation of estrogen). Clinical significance debated but counsel patients about backup contraception.",
        ],
        monitoring: "Renal function (for dose adjustment). CBC (prolonged courses — leukopenia risk). Clinical response. Hepatic function (rare hepatotoxicity). Rash assessment (distinguish allergic rash from ampicillin-associated rash in EBV infection).",
        pregnancyLactation: "Category B. Widely used in pregnancy — particularly for IAI and pelvic infections. Compatible with breastfeeding.",
        pharmacistPearls: [
          "RISING E. COLI RESISTANCE LIMITS UTILITY: E. coli susceptibility to ampicillin-sulbactam has declined to 60-80% in many US institutions. Before using as empiric therapy, CHECK YOUR LOCAL ANTIBIOGRAM. If E. coli susceptibility is <80%, consider ceftriaxone + metronidazole or ertapenem as more reliable empiric choices for IAI.",
          "Aspiration pneumonia coverage: Amp-sulbactam is one of the few single agents that covers the mixed flora of aspiration pneumonia (oral anaerobes + aerobic streptococci + enteric gram-negatives). IDSA CAP guidelines: for aspiration pneumonia with risk of anaerobic infection, amp-sulbactam is a reasonable monotherapy option.",
          "Sulbactam for Acinetobacter: Sulbactam has intrinsic activity against Acinetobacter baumannii independent of ampicillin. For MDR/XDR Acinetobacter, high-dose sulbactam (total 4g/day or more, achieved through high-dose amp-sulb or IV sulbactam where available) is a treatment option, usually combined with other agents (polymyxins, tigecycline, meropenem). The new agent durlobactam-sulbactam (Xacduro, FDA approved 2023) specifically leverages sulbactam's Acinetobacter activity.",
          "Q6h dosing is a compliance barrier: The q6h IV dosing schedule makes amp-sulbactam less convenient than alternatives like ertapenem (daily) or ceftriaxone (daily). For OPAT, this is a significant disadvantage. If transitioning to outpatient therapy, consider switching to an agent with less frequent dosing rather than continuing amp-sulb via home infusion q6h.",
          "The Enterococcal advantage: Amp-sulb is one of the few first-line IAI agents with intrinsic Enterococcus faecalis coverage (via the ampicillin component). For biliary IAI or situations where Enterococcal coverage is specifically desired, amp-sulb provides this without adding a separate agent. Pip-tazo also covers E. faecalis but through a different mechanism.",
          "Do NOT use for ESBL infections: Sulbactam does NOT effectively inhibit ESBLs (CTX-M, TEM variants, SHV variants). Isolates reported as 'ampicillin-sulbactam resistant' but 'pip-tazo susceptible' reflect the different beta-lactamase inhibitor profiles. For suspected or confirmed ESBL: use carbapenems.",
        ],
      },
      {
        id: "ertapenem",
        name: "Ertapenem",
        brandNames: "Invanz",
        drugClass: "Group 1 Carbapenem (narrow-spectrum carbapenem)",
        mechanismOfAction: "Binds PBPs (PBP-2, PBP-3, PBP-4), inhibiting cell wall synthesis. Bactericidal, time-dependent killing (T>MIC drives efficacy). Unlike broader carbapenems (meropenem, imipenem), ertapenem does NOT effectively bind PBP-2 of Pseudomonas aeruginosa or PBPs of Acinetobacter/Enterococcus — this is why it lacks activity against these organisms. Highly stable against most beta-lactamases including ESBLs and AmpC enzymes. NOT hydrolyzed by most metallo-beta-lactamases or KPC carbapenemases (resistance pattern differs from meropenem).",
        spectrum: "Broad but with defined gaps. Gram-positive: Streptococci (excellent), MSSA. Gram-negative: E. coli (including ESBL), Klebsiella (including ESBL), Proteus, Citrobacter, Serratia, H. influenzae, M. catarrhalis. Anaerobes: excellent — B. fragilis (>95%), Peptostreptococcus, Clostridium, Prevotella, Fusobacterium. DEFINED GAPS: Pseudomonas (NO activity), Acinetobacter (NO activity), Enterococcus (NO activity), MRSA (NO activity). These gaps are FEATURES, not bugs — they mean ertapenem exerts less selection pressure for Pseudomonas/Acinetobacter resistance compared to meropenem.",
        dosing: {
          standard: "1g IV/IM once daily",
          iai: "1g IV once daily",
          uti: "1g IV once daily",
          cap: "1g IV once daily",
          diabetic_foot: "1g IV once daily",
          surgical_prophylaxis: "1g IV within 60 min before incision (colorectal procedures)",
        },
        renalAdjustment: "CrCl >30: no adjustment. CrCl <=30 (including HD): 500mg IV once daily. Give supplemental 150mg after hemodialysis if daily dose was given >6h before HD. One of the simplest renal adjustments among carbapenems.",
        hepaticAdjustment: "No dose adjustment needed. Ertapenem undergoes minimal hepatic metabolism.",
        adverseEffects: {
          common: "Diarrhea (10%), nausea (8%), headache, infusion site reactions (5-7%)",
          serious: "C. difficile colitis, seizures (0.5% — lower than imipenem, comparable to meropenem), hypersensitivity/anaphylaxis",
          rare: "Hallucinations (reported, mechanism unclear), hepatitis, thrombocytopenia, neutropenia",
        },
        drugInteractions: [
          "Valproic acid — ALL carbapenems (including ertapenem) reduce VPA levels by 60-100% within 24h. HARD STOP: switch VPA to levetiracetam before starting any carbapenem.",
          "Probenecid — inhibits renal tubular secretion of ertapenem, increasing levels by ~25%. Generally not clinically significant but be aware.",
          "Warfarin — carbapenems may enhance anticoagulant effect. Monitor INR.",
        ],
        monitoring: "Renal function (for dose adjustment). Clinical response. Seizure monitoring (lower risk than imipenem but still present, especially in renal impairment or CNS disease). No drug level monitoring needed.",
        pregnancyLactation: "Category B. Limited human pregnancy data. Animal studies showed no harm. Use only if clearly needed. Excreted in breast milk — use with caution.",
        pharmacistPearls: [
          "ERTAPENEM IS NOT MEROPENEM — AND THAT'S THE POINT: Ertapenem deliberately lacks Pseudomonas and Acinetobacter activity. This means: (1) less selection pressure for MDR Pseudomonas and Acinetobacter, (2) appropriate for community-acquired IAI where these organisms are rare, (3) preserves the ecological niche that broader carbapenems disrupt. Using meropenem when ertapenem would suffice is antibiotic misuse — it provides no additional benefit while increasing resistance selection.",
          "OPAT SUPERSTAR: Once-daily IV dosing makes ertapenem the ideal OPAT carbapenem. For community-acquired IAI, diabetic foot infections, or complicated UTI being treated with home infusion, ertapenem reduces nursing visits to once daily. Compare: meropenem q8h (3 infusions/day) vs ertapenem q24h (1 infusion/day). Cost and convenience difference is dramatic.",
          "IM administration is an option: Ertapenem can be given intramuscularly (1g IM once daily, reconstituted with lidocaine). This is unique among carbapenems and useful for patients without IV access or for OPAT when port/PICC is not feasible. Absorbed well from IM site with bioavailability approaching IV.",
          "ESBL coverage WITHOUT Pseudomonal selection: For confirmed ESBL infections where Pseudomonas is not a concern (community-acquired IAI, UTI), ertapenem is the preferred carbapenem. It achieves the same ESBL killing as meropenem without the ecological cost. This is a cornerstone of carbapenem stewardship: use ertapenem for non-Pseudomonal ESBL, reserve meropenem for when you NEED Pseudomonal coverage.",
          "Colorectal surgical prophylaxis: Ertapenem 1g IV is FDA-approved for colorectal surgical prophylaxis. Studies showed superior SSI prevention compared to cefotetan. The once-daily dosing eliminates the need for intra-operative redosing. However, some stewardship programs discourage routine carbapenem prophylaxis due to resistance concerns — institutional guidelines vary.",
          "Valproic acid interaction applies to ALL carbapenems: The VPA-carbapenem interaction is pharmacological, not just a meropenem issue. Ertapenem reduces VPA levels just as dramatically (60-100% reduction). Even short courses of ertapenem with VPA risk breakthrough seizures. The solution is always the same: switch VPA to levetiracetam before starting the carbapenem.",
        ],
      },
    ],
  },
  {
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
  },
];

// ============================================================
// CONSTANTS & STYLES (outside component — no re-creation)
// ============================================================
const NAV_STATES = {
  HOME: "home",
  DISEASE_OVERVIEW: "disease_overview",
  SUBCATEGORY: "subcategory",
  MONOGRAPH: "monograph",
};

const S = {
  app: {
    minHeight: "100vh",
    background: "#0a0f1a",
    color: "#e2e8f0",
    fontFamily: "'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  header: {
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    borderBottom: "1px solid #1e3a5f",
    padding: "16px 24px",
    position: "sticky",
    top: 0,
    zIndex: 100,
    backdropFilter: "blur(10px)",
  },
  headerTop: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    marginBottom: "12px", gap: "16px", flexWrap: "wrap",
  },
  logo: {
    fontSize: "22px", fontWeight: 700, letterSpacing: "-0.5px", color: "#38bdf8",
    cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", flexShrink: 0,
  },
  logoPill: {
    fontSize: "10px", fontWeight: 600, background: "#0ea5e9", color: "#0a0f1a",
    padding: "2px 8px", borderRadius: "9999px", letterSpacing: "0.5px",
  },
  searchWrap: { position: "relative", flex: 1, maxWidth: "500px", minWidth: "180px" },
  searchBox: {
    width: "100%", padding: "10px 36px 10px 40px", background: "#0f172a",
    border: "1px solid #1e3a5f", borderRadius: "8px", color: "#e2e8f0",
    fontSize: "14px", outline: "none", boxSizing: "border-box",
  },
  searchIcon: { position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#64748b", fontSize: "14px", pointerEvents: "none" },
  clearBtn: {
    position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)",
    background: "none", border: "none", color: "#64748b", fontSize: "16px",
    cursor: "pointer", padding: "2px 6px", lineHeight: 1, borderRadius: "4px",
  },
  kbdHint: {
    position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)",
    color: "#475569", fontSize: "11px", fontFamily: "monospace",
    border: "1px solid #334155", borderRadius: "4px", padding: "1px 6px",
    pointerEvents: "none", lineHeight: "18px",
  },
  breadcrumbs: { display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#64748b", flexWrap: "wrap" },
  breadcrumbLink: { color: "#38bdf8", cursor: "pointer", textDecoration: "none", background: "none", border: "none", font: "inherit", padding: 0 },
  main: { maxWidth: "900px", margin: "0 auto", padding: "24px 20px 80px" },
  card: {
    background: "#111827", border: "1px solid #1e293b", borderRadius: "10px",
    padding: "20px", marginBottom: "12px", cursor: "pointer", transition: "border-color 0.15s ease",
  },
  sectionHeader: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    cursor: "pointer", padding: "14px 18px", background: "#111827",
    border: "1px solid #1e293b", borderRadius: "8px", marginBottom: "2px", userSelect: "none",
  },
  sectionContent: {
    padding: "16px 18px", background: "#0d1117", border: "1px solid #1e293b",
    borderTop: "none", borderRadius: "0 0 8px 8px", marginBottom: "10px",
  },
  tag: { display: "inline-block", padding: "3px 10px", borderRadius: "9999px", fontSize: "11px", fontWeight: 600, letterSpacing: "0.3px" },
  drugLink: {
    color: "#38bdf8", cursor: "pointer", textDecoration: "underline",
    textUnderlineOffset: "3px", background: "none", border: "none", font: "inherit", padding: 0,
  },
  pearlBox: {
    background: "#fef3c720", border: "1px solid #fef3c740", borderRadius: "8px",
    padding: "12px 16px", marginBottom: "8px", fontSize: "13px", lineHeight: 1.65, color: "#fde68a",
  },
  monographLabel: { fontSize: "11px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "#64748b", marginBottom: "8px" },
  monographValue: { fontSize: "14px", lineHeight: 1.7, color: "#cbd5e1" },
  interactionItem: {
    padding: "10px 14px", background: "#0a0f1a", borderLeft: "3px solid #f59e0b",
    marginBottom: "6px", borderRadius: "0 6px 6px 0", fontSize: "13px", lineHeight: 1.6,
  },
  aeGrid: { display: "grid", gap: "10px" },
  backBtn: {
    display: "inline-flex", alignItems: "center", gap: "6px", color: "#38bdf8",
    background: "none", border: "none", fontSize: "13px", cursor: "pointer",
    padding: "8px 0", marginBottom: "16px", fontFamily: "inherit",
  },
  expandAllBtn: {
    background: "none", border: "1px solid #1e3a5f", borderRadius: "6px",
    color: "#64748b", fontSize: "11px", padding: "4px 10px", cursor: "pointer",
    fontFamily: "inherit", marginBottom: "12px", marginRight: "8px",
  },
  topBtn: {
    position: "fixed", bottom: "24px", right: "24px", width: "40px", height: "40px",
    borderRadius: "50%", background: "#1e293b", border: "1px solid #334155",
    color: "#94a3b8", fontSize: "18px", cursor: "pointer", display: "flex",
    alignItems: "center", justifyContent: "center", zIndex: 50,
    boxShadow: "0 2px 8px #0008",
  },
  crossRefPill: {
    display: "inline-block", fontSize: "10px", fontWeight: 600, padding: "2px 8px",
    borderRadius: "9999px", background: "#1e293b", color: "#94a3b8",
    border: "1px solid #334155", cursor: "pointer", marginRight: "4px", marginBottom: "4px",
  },
};

const TAG_COLORS = {
  green: { background: "#065f4620", color: "#34d399", border: "1px solid #065f4640" },
  yellow: { background: "#92400e20", color: "#fbbf24", border: "1px solid #92400e40" },
  red: { background: "#7f1d1d20", color: "#f87171", border: "1px solid #7f1d1d40" },
  blue: { background: "#1e3a5f20", color: "#60a5fa", border: "1px solid #1e3a5f40" },
  purple: { background: "#4a1d7520", color: "#c084fc", border: "1px solid #4a1d7540" },
  cyan: { background: "#0e4a5f20", color: "#22d3ee", border: "1px solid #0e4a5f40" },
  pink: { background: "#7f1d4e20", color: "#f472b6", border: "1px solid #7f1d4e40" },
};

const getLineStyle = (lineName) => {
  const l = lineName.toLowerCase();
  if (l.includes("avoid")) return TAG_COLORS.red;
  if (l.includes("newer agent") || l.includes("reserve")) return TAG_COLORS.red;
  if (l.includes("first") || l.includes("preferred")) return TAG_COLORS.green;
  if (l.includes("second") || l.includes("alternative")) return TAG_COLORS.yellow;
  if (l.includes("duration")) return TAG_COLORS.purple;
  if (l.includes("adjunct") || l.includes("adjunctive")) return TAG_COLORS.purple;
  if (l.includes("iv") && l.includes("po")) return TAG_COLORS.cyan;
  if (l.includes("add") && (l.includes("mrsa") || l.includes("pseudo"))) return TAG_COLORS.pink;
  if (l.includes("idsa") || l.includes("four-step") || l.includes("step")) return TAG_COLORS.cyan;
  if (l.includes("prevention") || l.includes("bundle") || l.includes("stewardship")) return TAG_COLORS.cyan;
  if (l.includes("vap") && l.includes("mdr")) return TAG_COLORS.pink;
  if (l.includes("vap") || l.includes("hap")) return TAG_COLORS.blue;
  if (l.includes("empiric")) return TAG_COLORS.blue;
  if (l.includes("inpatient") || l.includes("iv")) return TAG_COLORS.blue;
  if (l.includes("outpatient") || l.includes("oral")) return TAG_COLORS.green;
  if (l.includes("lung abscess") || l.includes("abscess")) return TAG_COLORS.red;
  return TAG_COLORS.blue;
};

const aeCard = (color) => ({
  padding: "12px 16px", background: `${color}10`,
  border: `1px solid ${color}30`, borderRadius: "8px",
});
const aeLabel = (color) => ({
  fontSize: "11px", fontWeight: 700, letterSpacing: "0.5px",
  textTransform: "uppercase", color, marginBottom: "6px",
});

const cardHover = (e, on) => { e.currentTarget.style.borderColor = on ? "#0ea5e9" : "#1e293b"; };

// Aggregate stats (computed once at module level)
const ALL_MONOGRAPHS = (() => {
  const seen = new Set();
  const list = [];
  DISEASE_STATES.forEach(ds => {
    ds.drugMonographs?.forEach(dm => {
      if (!seen.has(dm.id)) { seen.add(dm.id); list.push({ ...dm, parentDisease: ds }); }
    });
  });
  return list.sort((a, b) => a.name.localeCompare(b.name));
})();
const TOTAL_SUBCATEGORIES = DISEASE_STATES.reduce((n, ds) => n + (ds.subcategories?.length || 0), 0);

// Cross-disease monograph map: drugId -> [disease states that contain it]
const MONOGRAPH_XREF = (() => {
  const map = {};
  DISEASE_STATES.forEach(ds => {
    ds.drugMonographs?.forEach(dm => {
      if (!map[dm.id]) map[dm.id] = [];
      map[dm.id].push(ds);
    });
  });
  return map;
})();

// Find a monograph by drug ID across all disease states
const findMonograph = (drugId) => {
  for (const ds of DISEASE_STATES) {
    const m = ds.drugMonographs?.find(dm => dm.id === drugId);
    if (m) return { monograph: m, disease: ds };
  }
  return null;
};

// ============================================================
// APP COMPONENT
// ============================================================
export default function PharmRef() {
  const [navState, setNavState] = useState(NAV_STATES.HOME);
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [selectedMonograph, setSelectedMonograph] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSections, setExpandedSections] = useState({});
  const [showTopBtn, setShowTopBtn] = useState(false);
  const searchRef = React.useRef(null);

  // Keyboard shortcut: "/" to focus search, Escape to clear
  React.useEffect(() => {
    const handler = (e) => {
      if (e.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === "Escape" && document.activeElement === searchRef.current) {
        searchRef.current?.blur();
        if (searchQuery) setSearchQuery("");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [searchQuery]);

  // Scroll listener for back-to-top button
  React.useEffect(() => {
    const handler = () => setShowTopBtn(window.scrollY > 400);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const toggleSection = useCallback((id) => {
    setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const navigateTo = useCallback((state, data = {}) => {
    setNavState(state);
    if (data.disease !== undefined) setSelectedDisease(data.disease);
    if (data.subcategory !== undefined) setSelectedSubcategory(data.subcategory);
    if (data.monograph !== undefined) setSelectedMonograph(data.monograph);
    setExpandedSections({});
    window.scrollTo?.(0, 0);
  }, []);

  // Deep search: drugs, organisms, subcategories, diseases, pearls, empiric notes, interactions
  const searchResults = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) return null;
    const q = searchQuery.toLowerCase();
    const results = { drugs: [], organisms: [], subcategories: [], diseases: [] };
    const seen = { drugs: new Set(), subcats: new Set(), organisms: new Set() };

    DISEASE_STATES.forEach(ds => {
      if (ds.name.toLowerCase().includes(q) || ds.overview?.definition?.toLowerCase().includes(q))
        results.diseases.push(ds);

      ds.subcategories?.forEach(sc => {
        const scKey = ds.id + "-" + sc.id;
        const directMatch = sc.name.toLowerCase().includes(q) || sc.definition?.toLowerCase().includes(q);
        const pearlMatch = sc.pearls?.some(p => p.toLowerCase().includes(q));
        const empiricMatch = sc.empiricTherapy?.some(t =>
          t.line.toLowerCase().includes(q) || t.options.some(o => (o.notes || "").toLowerCase().includes(q) || (o.regimen || "").toLowerCase().includes(q))
        );
        if ((directMatch || pearlMatch || empiricMatch) && !seen.subcats.has(scKey)) {
          seen.subcats.add(scKey);
          results.subcategories.push({ ...sc, parentDisease: ds, matchType: directMatch ? "name" : pearlMatch ? "pearl" : "empiric" });
        }
        sc.organismSpecific?.forEach(org => {
          const orgKey = ds.id + "-" + sc.id + "-" + org.organism;
          if ((org.organism.toLowerCase().includes(q) || (org.notes || "").toLowerCase().includes(q) || (org.preferred || "").toLowerCase().includes(q)) && !seen.organisms.has(orgKey)) {
            seen.organisms.add(orgKey);
            results.organisms.push({ ...org, parentSubcategory: sc, parentDisease: ds });
          }
        });
      });

      ds.drugMonographs?.forEach(dm => {
        if (seen.drugs.has(dm.id)) return;
        const match = dm.name.toLowerCase().includes(q) ||
          (dm.brandNames || "").toLowerCase().includes(q) ||
          (dm.drugClass || "").toLowerCase().includes(q) ||
          (dm.spectrum || "").toLowerCase().includes(q) ||
          dm.pharmacistPearls?.some(p => p.toLowerCase().includes(q)) ||
          dm.drugInteractions?.some(di => di.toLowerCase().includes(q)) ||
          (dm.mechanismOfAction || "").toLowerCase().includes(q);
        if (match) {
          seen.drugs.add(dm.id);
          results.drugs.push({ ...dm, parentDisease: ds });
        }
      });
    });
    return results;
  }, [searchQuery]);

  const breadcrumbs = useMemo(() => {
    const crumbs = [{ label: "PharmRef", action: () => navigateTo(NAV_STATES.HOME) }];
    if (selectedDisease && navState !== NAV_STATES.HOME) {
      crumbs.push({
        label: selectedDisease.name,
        action: () => navigateTo(NAV_STATES.DISEASE_OVERVIEW, { disease: selectedDisease }),
      });
    }
    if (selectedSubcategory && navState === NAV_STATES.SUBCATEGORY) crumbs.push({ label: selectedSubcategory.name, action: null });
    if (selectedMonograph && navState === NAV_STATES.MONOGRAPH) crumbs.push({ label: selectedMonograph.name, action: null });
    return crumbs;
  }, [navState, selectedDisease, selectedSubcategory, selectedMonograph, navigateTo]);

  const getCurrentSectionIds = useCallback(() => {
    if (navState === NAV_STATES.SUBCATEGORY) return ["presentation", "diagnostics", "empiric", "organism", "pearls"];
    if (navState === NAV_STATES.MONOGRAPH) return ["moa", "spectrum", "dosing", "renal", "hepatic", "ae", "interactions", "monitoring", "pregnancy", "pharm-pearls"];
    if (navState === NAV_STATES.DISEASE_OVERVIEW) return ["overview", "guidelines", "trials"];
    return [];
  }, [navState]);

  const expandAll = useCallback(() => {
    const ids = getCurrentSectionIds();
    setExpandedSections(prev => { const n = { ...prev }; ids.forEach(id => { n[id] = true; }); return n; });
  }, [getCurrentSectionIds]);

  const collapseAll = useCallback(() => {
    const ids = getCurrentSectionIds();
    setExpandedSections(prev => { const n = { ...prev }; ids.forEach(id => { n[id] = false; }); return n; });
  }, [getCurrentSectionIds]);

  // ============================================================
  // SHARED SUB-COMPONENTS
  // ============================================================
  const Section = ({ id, title, icon, children, defaultOpen, accentColor }) => {
    const isOpen = expandedSections[id] ?? defaultOpen ?? false;
    return (
      <div style={{ marginBottom: "4px" }}>
        <div style={{ ...S.sectionHeader, ...(isOpen ? { borderBottom: "none", borderRadius: "8px 8px 0 0" } : {}), borderLeftColor: accentColor || "#1e293b", borderLeftWidth: accentColor ? "3px" : "1px" }} onClick={() => toggleSection(id)}>
          <span style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", fontWeight: 600 }}>
            {icon && <span style={{ fontSize: "16px" }}>{icon}</span>}
            {title}
          </span>
          <span style={{ color: "#64748b", fontSize: "18px", transform: isOpen ? "rotate(90deg)" : "none", transition: "transform 0.15s" }}>›</span>
        </div>
        {isOpen && <div style={S.sectionContent}>{children}</div>}
      </div>
    );
  };

  const ExpandCollapseBar = () => (
    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "8px" }}>
      <button style={S.expandAllBtn} onClick={expandAll}>Expand All</button>
      <button style={S.expandAllBtn} onClick={collapseAll}>Collapse All</button>
    </div>
  );

  const EmpiricTierView = ({ tier }) => (
    <div style={{ marginBottom: "20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
        <span style={{ ...S.tag, ...getLineStyle(tier.line) }}>{tier.line}</span>
      </div>
      {tier.options.map((opt, oi) => {
        const found = findMonograph(opt.drug);
        const lineColor = getLineStyle(tier.line).color || "#1e3a5f";
        return (
          <div key={oi} style={{ padding: "12px 16px", background: "#0a0f1a", borderRadius: "8px", marginBottom: "8px", borderLeft: "3px solid " + lineColor }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              {found ? (
                <button style={{ ...S.drugLink, fontSize: "14px", fontWeight: 600 }} onClick={() => navigateTo(NAV_STATES.MONOGRAPH, { disease: found.disease, monograph: found.monograph })}>
                  {opt.regimen.split(" ")[0]}
                </button>
              ) : (
                <span style={{ fontSize: "14px", fontWeight: 600, color: "#e2e8f0" }}>{opt.regimen.split(" ")[0]}</span>
              )}
            </div>
            <div style={{ fontSize: "13px", color: "#94a3b8", fontFamily: "'IBM Plex Mono', monospace", marginBottom: "6px" }}>{opt.regimen}</div>
            <div style={{ fontSize: "12px", color: "#cbd5e1", lineHeight: 1.6 }}>{opt.notes}</div>
          </div>
        );
      })}
    </div>
  );

  const CrossRefBadges = ({ drugId, currentDiseaseId }) => {
    const refs = MONOGRAPH_XREF[drugId];
    if (!refs || refs.length <= 1) return null;
    const others = refs.filter(ds => ds.id !== currentDiseaseId);
    if (others.length === 0) return null;
    return (
      <div style={{ marginTop: "8px" }}>
        <span style={{ fontSize: "11px", color: "#64748b", marginRight: "6px" }}>Also in:</span>
        {others.map(ds => (
          <span key={ds.id} style={S.crossRefPill} onClick={() => navigateTo(NAV_STATES.DISEASE_OVERVIEW, { disease: ds })}>
            {ds.icon} {ds.name}
          </span>
        ))}
      </div>
    );
  };

  const BackToTop = () => showTopBtn ? (
    <button style={S.topBtn} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} title="Back to top">↑</button>
  ) : null;

  // ============================================================
  // LAYOUT WRAPPER
  // ============================================================
  const Layout = ({ children, compact }) => (
    <div style={S.app}>
      <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet" />
      <header style={S.header}>
        <div style={S.headerTop}>
          <div style={S.logo} onClick={() => { setSearchQuery(""); navigateTo(NAV_STATES.HOME); }}>
            <span>⚕</span> PharmRef <span style={S.logoPill}>Rx</span>
          </div>
          <div style={S.searchWrap}>
            <span style={S.searchIcon}>⌕</span>
            <input ref={searchRef} style={{ ...S.searchBox, ...(compact ? { maxWidth: "300px" } : {}) }} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search drugs, organisms, pearls..." />
            {searchQuery ? (
              <button style={S.clearBtn} onClick={() => setSearchQuery("")} title="Clear search">✕</button>
            ) : (
              <span style={S.kbdHint}>/</span>
            )}
          </div>
        </div>
        {navState !== NAV_STATES.HOME && (
          <div style={S.breadcrumbs}>
            {breadcrumbs.map((c, i) => (
              <span key={i} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                {i > 0 && <span>›</span>}
                {c.action ? <button style={S.breadcrumbLink} onClick={c.action}>{c.label}</button> : <span style={{ color: "#e2e8f0" }}>{c.label}</span>}
              </span>
            ))}
          </div>
        )}
      </header>
      <main style={S.main}>{children}</main>
      <BackToTop />
    </div>
  );

  // ============================================================
  // SEARCH RESULTS VIEW
  // ============================================================
  if (searchResults) {
    const total = searchResults.diseases.length + searchResults.subcategories.length + searchResults.drugs.length + searchResults.organisms.length;
    return (
      <Layout>
        <p style={{ color: "#64748b", fontSize: "13px", marginBottom: "20px" }}>
          {total} result{total !== 1 ? "s" : ""} for "{searchQuery}"
        </p>
        {searchResults.drugs.map(d => (
          <div key={d.id} style={S.card} onClick={() => { setSearchQuery(""); navigateTo(NAV_STATES.MONOGRAPH, { disease: d.parentDisease, monograph: d }); }} onMouseEnter={e => cardHover(e, true)} onMouseLeave={e => cardHover(e, false)}>
            <div style={{ fontSize: "11px", color: "#64748b", marginBottom: "4px" }}>💊 DRUG MONOGRAPH</div>
            <div style={{ fontSize: "16px", fontWeight: 600 }}>{d.name}</div>
            <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>{d.brandNames} — {d.drugClass}</div>
          </div>
        ))}
        {searchResults.organisms.map((org, i) => (
          <div key={"org-" + i} style={S.card} onClick={() => { setSearchQuery(""); navigateTo(NAV_STATES.SUBCATEGORY, { disease: org.parentDisease, subcategory: org.parentSubcategory }); }} onMouseEnter={e => cardHover(e, true)} onMouseLeave={e => cardHover(e, false)}>
            <div style={{ fontSize: "11px", color: "#64748b", marginBottom: "4px" }}>🦠 ORGANISM</div>
            <div style={{ fontSize: "16px", fontWeight: 600 }}>{org.organism}</div>
            <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>{org.parentSubcategory.name} → {org.parentDisease.name}</div>
            <div style={{ fontSize: "11px", color: "#64748b", marginTop: "6px" }}>
              <span style={{ color: "#34d399" }}>Preferred: </span>{(org.preferred || "").slice(0, 80)}{(org.preferred || "").length > 80 ? "..." : ""}
            </div>
          </div>
        ))}
        {searchResults.subcategories.map(sc => (
          <div key={sc.parentDisease.id + "-" + sc.id} style={S.card} onClick={() => { setSearchQuery(""); navigateTo(NAV_STATES.SUBCATEGORY, { disease: sc.parentDisease, subcategory: sc }); }} onMouseEnter={e => cardHover(e, true)} onMouseLeave={e => cardHover(e, false)}>
            <div style={{ fontSize: "11px", color: "#64748b", marginBottom: "4px" }}>
              📋 {sc.matchType === "pearl" ? "MATCHED IN PEARLS" : sc.matchType === "empiric" ? "MATCHED IN THERAPY" : "DISEASE STATE"}
            </div>
            <div style={{ fontSize: "16px", fontWeight: 600 }}>{sc.name}</div>
            <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>{sc.parentDisease.name}</div>
          </div>
        ))}
        {searchResults.diseases.map(ds => (
          <div key={ds.id} style={S.card} onClick={() => { setSearchQuery(""); navigateTo(NAV_STATES.DISEASE_OVERVIEW, { disease: ds }); }} onMouseEnter={e => cardHover(e, true)} onMouseLeave={e => cardHover(e, false)}>
            <div style={{ fontSize: "11px", color: "#64748b", marginBottom: "4px" }}>🔬 CATEGORY</div>
            <div style={{ fontSize: "16px", fontWeight: 600 }}>{ds.name}</div>
          </div>
        ))}
        {total === 0 && <p style={{ color: "#64748b", textAlign: "center", padding: "40px 0" }}>No results found. Try a different search term.</p>}
      </Layout>
    );
  }

  // ============================================================
  // HOME VIEW
  // ============================================================
  if (navState === NAV_STATES.HOME) {
    return (
      <Layout>
        <div style={{ textAlign: "center", padding: "30px 0 20px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#f1f5f9", marginBottom: "10px" }}>Clinical Antibiotic Reference</h1>
          <p style={{ color: "#64748b", fontSize: "14px", maxWidth: "500px", margin: "0 auto", lineHeight: 1.6 }}>
            Evidence-based, pharmacist-grade reference built on landmark trials and rigorous data.
          </p>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: "24px", padding: "16px 0 32px", flexWrap: "wrap" }}>
          {[
            { n: DISEASE_STATES.length, label: "Disease States" },
            { n: TOTAL_SUBCATEGORIES, label: "Subcategories" },
            { n: ALL_MONOGRAPHS.length, label: "Drug Monographs" },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "24px", fontWeight: 700, color: "#38bdf8" }}>{s.n}</div>
              <div style={{ fontSize: "11px", color: "#64748b", letterSpacing: "0.5px", textTransform: "uppercase" }}>{s.label}</div>
            </div>
          ))}
        </div>
        <div style={{ ...S.monographLabel, marginBottom: "12px", fontSize: "13px" }}>DISEASE STATES</div>
        {DISEASE_STATES.map(ds => (
          <div key={ds.id} style={{ ...S.card, display: "flex", alignItems: "center", gap: "16px" }} onClick={() => navigateTo(NAV_STATES.DISEASE_OVERVIEW, { disease: ds })} onMouseEnter={e => cardHover(e, true)} onMouseLeave={e => cardHover(e, false)}>
            <div style={{ fontSize: "32px", width: "50px", height: "50px", display: "flex", alignItems: "center", justifyContent: "center", background: "#0ea5e910", borderRadius: "10px", flexShrink: 0 }}>{ds.icon}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: "17px", fontWeight: 600 }}>{ds.name}</div>
              <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>{ds.category} · {ds.subcategories?.length || 0} subcategories · {ds.drugMonographs?.length || 0} monographs</div>
            </div>
            <div style={{ color: "#64748b", fontSize: "20px", flexShrink: 0 }}>›</div>
          </div>
        ))}
        <div style={{ ...S.monographLabel, marginTop: "30px", marginBottom: "12px", fontSize: "13px" }}>QUICK ACCESS — ALL DRUG MONOGRAPHS ({ALL_MONOGRAPHS.length})</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "24px" }}>
          {ALL_MONOGRAPHS.map(dm => (
            <button key={dm.id} style={{ background: "#111827", border: "1px solid #1e293b", borderRadius: "6px", padding: "6px 12px", color: "#38bdf8", fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "border-color 0.15s" }} onMouseEnter={e => { e.currentTarget.style.borderColor = "#0ea5e9"; }} onMouseLeave={e => { e.currentTarget.style.borderColor = "#1e293b"; }} onClick={() => { const f = findMonograph(dm.id); if (f) navigateTo(NAV_STATES.MONOGRAPH, { disease: f.disease, monograph: f.monograph }); }}>
              {dm.name}
            </button>
          ))}
        </div>
        <div style={{ padding: "16px 20px", background: "#111827", borderRadius: "10px", border: "1px solid #1e293b" }}>
          <div style={{ fontSize: "13px", color: "#94a3b8", lineHeight: 1.6 }}>
            <strong style={{ color: "#fbbf24" }}>⚠ Clinical Disclaimer:</strong> This reference is a personal study and practice tool. Always verify against primary sources (IDSA, package inserts, UpToDate, local antibiograms) before making clinical decisions.
          </div>
        </div>
      </Layout>
    );
  }

  // ============================================================
  // DISEASE OVERVIEW VIEW
  // ============================================================
  if (navState === NAV_STATES.DISEASE_OVERVIEW && selectedDisease) {
    const ds = selectedDisease;
    const ov = ds.overview;
    return (
      <Layout compact>
        <button style={S.backBtn} onClick={() => navigateTo(NAV_STATES.HOME)}>← All Disease States</button>
        <h1 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "6px" }}>{ds.icon} {ds.name}</h1>
        <div style={{ color: "#64748b", fontSize: "13px", marginBottom: "20px" }}>{ds.category}</div>
        <ExpandCollapseBar />
        <Section id="overview" title="Overview & Epidemiology" icon="📖" accentColor="#38bdf8">
          <p style={{ ...S.monographValue, marginBottom: "12px" }}>{ov.definition}</p>
          <p style={{ ...S.monographValue, marginBottom: "12px" }}>{ov.epidemiology}</p>
          <div style={{ ...S.monographLabel, marginTop: "16px" }}>Risk Factors</div>
          <p style={S.monographValue}>{ov.riskFactors}</p>
        </Section>
        <Section id="guidelines" title="Key Guidelines" icon="📋" accentColor="#34d399">
          {ov.keyGuidelines.map((g, i) => (
            <div key={i} style={{ padding: "10px 0", borderBottom: i < ov.keyGuidelines.length - 1 ? "1px solid #1e293b" : "none" }}>
              <div style={{ fontWeight: 600, fontSize: "14px", color: "#34d399" }}>{g.name}</div>
              <div style={{ fontSize: "13px", color: "#94a3b8", marginTop: "4px", lineHeight: 1.5 }}>{g.detail}</div>
            </div>
          ))}
        </Section>
        <Section id="trials" title="Landmark Trials" icon="🧪" accentColor="#fbbf24">
          {ov.landmarkTrials.map((t, i) => (
            <div key={i} style={{ padding: "10px 0", borderBottom: i < ov.landmarkTrials.length - 1 ? "1px solid #1e293b" : "none" }}>
              <div style={{ fontWeight: 600, fontSize: "14px", color: "#fbbf24" }}>{t.name}</div>
              <div style={{ fontSize: "13px", color: "#94a3b8", marginTop: "4px", lineHeight: 1.5 }}>{t.detail}</div>
            </div>
          ))}
        </Section>
        <div style={{ ...S.monographLabel, marginTop: "30px", marginBottom: "12px", fontSize: "13px" }}>DISEASE SUBCATEGORIES</div>
        {ds.subcategories.map(sc => (
          <div key={sc.id} style={{ ...S.card, display: "flex", alignItems: "center", justifyContent: "space-between" }} onClick={() => navigateTo(NAV_STATES.SUBCATEGORY, { subcategory: sc })} onMouseEnter={e => cardHover(e, true)} onMouseLeave={e => cardHover(e, false)}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: "15px", fontWeight: 600 }}>{sc.name}</div>
              <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px", lineHeight: 1.5 }}>{(sc.definition || "").slice(0, 140)}{(sc.definition || "").length > 140 ? "..." : ""}</div>
            </div>
            <span style={{ color: "#64748b", fontSize: "20px", flexShrink: 0, marginLeft: "12px" }}>›</span>
          </div>
        ))}
        <div style={{ ...S.monographLabel, marginTop: "30px", marginBottom: "12px", fontSize: "13px" }}>DRUG MONOGRAPHS ({ds.drugMonographs?.length})</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "10px" }}>
          {ds.drugMonographs.map(dm => (
            <div key={dm.id} style={{ ...S.card, cursor: "pointer", marginBottom: 0 }} onClick={() => navigateTo(NAV_STATES.MONOGRAPH, { monograph: dm })} onMouseEnter={e => cardHover(e, true)} onMouseLeave={e => cardHover(e, false)}>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "#38bdf8" }}>{dm.name}</div>
              <div style={{ fontSize: "11px", color: "#64748b", marginTop: "4px" }}>{dm.drugClass}</div>
            </div>
          ))}
        </div>
      </Layout>
    );
  }

  // ============================================================
  // SUBCATEGORY VIEW
  // ============================================================
  if (navState === NAV_STATES.SUBCATEGORY && selectedSubcategory) {
    const sc = selectedSubcategory;
    const hasOrganisms = sc.organismSpecific && sc.organismSpecific.length > 0;
    return (
      <Layout compact>
        <button style={S.backBtn} onClick={() => navigateTo(NAV_STATES.DISEASE_OVERVIEW, { disease: selectedDisease })}>← {selectedDisease.name}</button>
        <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "6px" }}>{sc.name}</h1>
        <div style={{ color: "#94a3b8", fontSize: "13px", lineHeight: 1.6, marginBottom: "20px" }}>{sc.definition}</div>
        <ExpandCollapseBar />
        {sc.clinicalPresentation && !sc.clinicalPresentation.startsWith("N/A") && (
          <Section id="presentation" title="Clinical Presentation" icon="🩺" accentColor="#38bdf8">
            <p style={S.monographValue}>{sc.clinicalPresentation}</p>
          </Section>
        )}
        {sc.diagnostics && !sc.diagnostics.startsWith("N/A") && (
          <Section id="diagnostics" title="Diagnostics" icon="🔎" accentColor="#a78bfa">
            <p style={S.monographValue}>{sc.diagnostics}</p>
          </Section>
        )}
        <Section id="empiric" title={sc.empiricTherapy?.some(t => t.line.toLowerCase().includes("prevention") || t.line.toLowerCase().includes("stewardship")) ? "Interventions & Protocols" : "Empiric Therapy"} icon="💊" accentColor="#34d399">
          {sc.empiricTherapy?.map((tier, ti) => (
            <EmpiricTierView key={ti} tier={tier} />
          ))}
        </Section>
        {hasOrganisms && (
          <Section id="organism" title="Organism-Specific Therapy" icon="🦠" accentColor="#f59e0b">
            {sc.organismSpecific.map((org, oi) => (
              <div key={oi} style={{ padding: "14px 0", borderBottom: oi < sc.organismSpecific.length - 1 ? "1px solid #1e293b" : "none" }}>
                <div style={{ fontWeight: 600, fontSize: "14px", color: "#f59e0b", marginBottom: "8px" }}>{org.organism}</div>
                <div style={{ display: "grid", gap: "6px" }}>
                  <div style={{ fontSize: "12px" }}>
                    <span style={{ color: "#64748b", fontWeight: 600 }}>Preferred: </span>
                    <span style={{ color: "#34d399" }}>{org.preferred}</span>
                  </div>
                  {org.alternative && (
                    <div style={{ fontSize: "12px" }}>
                      <span style={{ color: "#64748b", fontWeight: 600 }}>Alternative: </span>
                      <span style={{ color: "#fbbf24" }}>{org.alternative}</span>
                    </div>
                  )}
                  <div style={{ fontSize: "12px", color: "#94a3b8", lineHeight: 1.5, marginTop: "4px" }}>{org.notes}</div>
                </div>
              </div>
            ))}
          </Section>
        )}
        {sc.pearls && sc.pearls.length > 0 && (
          <Section id="pearls" title="Pharmacist Pearls & Clinical Tips" icon="💡" accentColor="#fbbf24">
            {sc.pearls.map((p, pi) => (
              <div key={pi} style={S.pearlBox}>💡 {p}</div>
            ))}
          </Section>
        )}
      </Layout>
    );
  }

  // ============================================================
  // MONOGRAPH VIEW
  // ============================================================
  if (navState === NAV_STATES.MONOGRAPH && selectedMonograph) {
    const dm = selectedMonograph;
    return (
      <Layout compact>
        <button style={S.backBtn} onClick={() => navigateTo(NAV_STATES.DISEASE_OVERVIEW, { disease: selectedDisease })}>← {selectedDisease?.name || "Back"}</button>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", marginBottom: "20px" }}>
          <div style={{ width: "56px", height: "56px", background: "linear-gradient(135deg, #0ea5e920, #38bdf820)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", flexShrink: 0 }}>💊</div>
          <div style={{ minWidth: 0 }}>
            <h1 style={{ fontSize: "24px", fontWeight: 700, margin: 0 }}>{dm.name}</h1>
            <div style={{ fontSize: "13px", color: "#94a3b8", marginTop: "4px" }}>{dm.brandNames}</div>
            <div style={{ marginTop: "6px" }}>
              <span style={{ ...S.tag, background: "#0ea5e920", color: "#38bdf8", border: "1px solid #0ea5e940" }}>{dm.drugClass}</span>
            </div>
            <CrossRefBadges drugId={dm.id} currentDiseaseId={selectedDisease?.id} />
          </div>
        </div>
        <ExpandCollapseBar />
        <Section id="moa" title="Mechanism of Action" icon="⚙" accentColor="#38bdf8">
          <p style={S.monographValue}>{dm.mechanismOfAction}</p>
        </Section>
        <Section id="spectrum" title="Spectrum of Activity" icon="🎯" accentColor="#34d399">
          <p style={S.monographValue}>{dm.spectrum}</p>
        </Section>
        <Section id="dosing" title="Dosing" icon="📐" accentColor="#a78bfa">
          {dm.dosing && Object.entries(dm.dosing).map(([key, val]) => (
            <div key={key} style={{ padding: "8px 0", borderBottom: "1px solid #1e293b20" }}>
              <span style={{ fontSize: "12px", fontWeight: 600, color: "#a78bfa", textTransform: "capitalize" }}>{key.replace(/_/g, " ")}: </span>
              <span style={{ fontSize: "13px", color: "#cbd5e1", fontFamily: "'IBM Plex Mono', monospace" }}>{val}</span>
            </div>
          ))}
        </Section>
        <Section id="renal" title="Renal Dose Adjustment" icon="🫘" accentColor="#f59e0b">
          <p style={S.monographValue}>{dm.renalAdjustment}</p>
        </Section>
        <Section id="hepatic" title="Hepatic Dose Adjustment" icon="🫁" accentColor="#f59e0b">
          <p style={S.monographValue}>{dm.hepaticAdjustment}</p>
        </Section>
        <Section id="ae" title="Adverse Effects" icon="⚠" accentColor="#ef4444">
          {dm.adverseEffects && (
            <div style={S.aeGrid}>
              <div style={aeCard("#fbbf24")}><div style={aeLabel("#fbbf24")}>Common</div><p style={{ fontSize: "13px", color: "#cbd5e1", lineHeight: 1.6, margin: 0 }}>{dm.adverseEffects.common}</p></div>
              <div style={aeCard("#ef4444")}><div style={aeLabel("#ef4444")}>Serious</div><p style={{ fontSize: "13px", color: "#cbd5e1", lineHeight: 1.6, margin: 0 }}>{dm.adverseEffects.serious}</p></div>
              <div style={aeCard("#64748b")}><div style={aeLabel("#94a3b8")}>Rare</div><p style={{ fontSize: "13px", color: "#cbd5e1", lineHeight: 1.6, margin: 0 }}>{dm.adverseEffects.rare}</p></div>
              {dm.adverseEffects.fdaBoxedWarnings && (
                <div style={{ ...aeCard("#ef4444"), background: "#7f1d1d20", border: "2px solid #ef444480" }}><div style={aeLabel("#ef4444")}>⬛ FDA BOXED WARNINGS</div><p style={{ fontSize: "13px", color: "#fca5a5", lineHeight: 1.6, margin: 0 }}>{dm.adverseEffects.fdaBoxedWarnings}</p></div>
              )}
              {dm.adverseEffects.contraindications && (
                <div style={aeCard("#ef4444")}><div style={aeLabel("#ef4444")}>Contraindications</div><p style={{ fontSize: "13px", color: "#cbd5e1", lineHeight: 1.6, margin: 0 }}>{dm.adverseEffects.contraindications}</p></div>
              )}
            </div>
          )}
        </Section>
        <Section id="interactions" title="Drug Interactions" icon="🔗" accentColor="#f59e0b">
          {dm.drugInteractions?.map((di, i) => (
            <div key={i} style={S.interactionItem}>{di}</div>
          ))}
        </Section>
        <Section id="monitoring" title="Monitoring Parameters" icon="📊" accentColor="#38bdf8">
          <p style={S.monographValue}>{dm.monitoring}</p>
        </Section>
        <Section id="pregnancy" title="Pregnancy & Lactation" icon="🤰" accentColor="#ec4899">
          <p style={S.monographValue}>{dm.pregnancyLactation}</p>
        </Section>
        <Section id="pharm-pearls" title="Pharmacist Pearls" icon="💡" accentColor="#fbbf24">
          {dm.pharmacistPearls?.map((p, pi) => (
            <div key={pi} style={S.pearlBox}>💡 {p}</div>
          ))}
        </Section>
      </Layout>
    );
  }

  return null;
}