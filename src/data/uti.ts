// Editorial source for the generated UTI disease module.
// Runtime catalog imports use src/data/generated/diseases/uti.ts.

import type { DiseaseState, Subcategory } from "../types";
import { UTI_MONOGRAPH_ENHANCEMENTS } from "./penetration-content";
import { getEmpiricOptionEnhancementsForDisease } from "./regimen-plan-content";
import { enhanceDisease, enhanceDiseaseEmpiricOptions, mergeEnhancementMaps, notApplicable, ready } from "./stewardship-content";

const UTI_BASE: DiseaseState = {
  id: "uti",
  name: "Urinary Tract Infections",
  icon: "🔬",
  category: "Infectious Disease",
  overview: {
    definition: "Infections of the urinary tract encompassing the bladder (cystitis), kidneys (pyelonephritis), and associated structures. Classification depends on anatomical location, severity, and presence of complicating factors.",
    epidemiology: "Among the most common bacterial infections worldwide. ~50-60% of women will experience at least one UTI in their lifetime. Recurrence rate of ~25% within 6 months of initial episode.",
    keyGuidelines: [
      { name: "IDSA 2025 cUTI Guideline (NEW)", detail: "First-ever IDSA guideline on complicated UTI. Introduces a 4-step empiric therapy approach (severity → resistance risk factors → patient factors → antibiogram). Supports shorter durations (FQ 5-7d, non-FQ 7d) and early IV-to-PO switch even in bacteremia. Reclassifies cUTI based on systemic symptoms, not anatomy. Endorsed by AUA, ESCMID, ASM, SAEM, SHM, SIDP, AMMI-CA.", sourceIds: ["idsa-2025-cuti"] },
      { name: "IDSA/ESCMID 2011", detail: "International Clinical Practice Guidelines for uncomplicated cystitis and pyelonephritis in women — remains relevant for uncomplicated UTI management", sourceIds: ["idsa-escmid-2011-uti"] },
      { name: "AUA/CUA/SUFU 2019", detail: "Recurrent UTI guideline — important for prophylaxis strategies", sourceIds: ["aua-cua-sufu-2019-ruti"] },
      { name: "IDSA 2010 CAUTI", detail: "Diagnosis, prevention, and treatment of catheter-associated UTI", sourceIds: ["idsa-2010-cauti"] },
      { name: "EAU 2024", detail: "European Association of Urology guidelines — frequently updated, good for emerging resistance data", sourceIds: ["eau-2024-uti"] },
    ],
    landmarkTrials: [
      { name: "IDSA 2025 cUTI Guideline", detail: "First-ever IDSA guideline on complicated UTI. Paradigm shift: reclassifies UTI by symptoms (systemic signs) not anatomy, introduces 4-step empiric approach, endorses 7-day courses even for bacteremic UTI, formalizes IV-to-PO switch in bacteremia, and restricts novel agents to definitive therapy only.", sourceIds: ["idsa-2025-cuti"] },
      { name: "ALTAR Trial (Harding et al., 2022)", detail: "Methenamine hippurate was non-inferior to daily low-dose antibiotic prophylaxis for recurrent UTI prevention in adult women, offering a credible antibiotic-sparing prevention strategy for selected patients.", sourceIds: ["altar-trial"] },
      { name: "Gupta et al. (2007) — Nitrofurantoin vs TMP-SMX", detail: "Five days of nitrofurantoin achieved similar clinical cure to three days of TMP-SMX for acute uncomplicated cystitis, supporting nitrofurantoin as a first-line option when TMP-SMX resistance is a concern.", sourceIds: ["gupta-2007-nitrofurantoin-tmpsmx"] },
      { name: "Gágyor et al. (2015) — Ibuprofen vs Fosfomycin", detail: "Symptom-targeted ibuprofen reduced antibiotic use in uncomplicated cystitis but came with more symptom burden and pyelonephritis risk. Useful for stewardship context, but it does NOT justify routine NSAID-only treatment.", sourceIds: ["gagyor-2015-ibuprofen-fosfomycin"] },
      { name: "Huttner et al. (2018) — Nitrofurantoin vs Fosfomycin", detail: "Five days of nitrofurantoin produced higher clinical resolution than single-dose fosfomycin for uncomplicated lower UTI, reinforcing nitrofurantoin as the more dependable first-line choice when either agent is available.", sourceIds: ["huttner-2018-nitrofurantoin-fosfomycin"] },
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
      durationGuidance: {
        standard: "3–5 days (nitrofurantoin/fosfomycin)",
        severe: "7 days (TMP-SMX/fluoroquinolone)",
        stewardshipNote: "Shorter courses non-inferior in uncomplicated cystitis. Avoid fluoroquinolones as first-line per IDSA 2011.",
      },
      empiricTherapy: [
        {
          line: "First-Line",
          options: [
            { drug: "nitrofurantoin", regimen: "Nitrofurantoin monohydrate/macrocrystals 100mg PO BID × 5 days", notes: "Preferred agent. COMBINE trial supports potential 3-day course. Avoid if CrCl <30 mL/min (though recent data supports use down to ~20). Not effective for anything beyond the bladder.", evidence: "A-I", evidenceSource: "IDSA 2011" },
            { drug: "tmp-smx", regimen: "TMP-SMX DS (160/800mg) PO BID × 3 days", notes: "Use only if local resistance <20%. Avoid if used in prior 3 months. Check sulfa allergy. 3-day course is well established.", evidence: "A-I", evidenceSource: "IDSA 2011" },
            { drug: "fosfomycin", regimen: "Fosfomycin trometamol 3g PO × 1 dose", notes: "Single-dose convenience. Slightly inferior efficacy vs. multi-day regimens per meta-analyses. Good for adherence-challenged patients. Mix in water, not hot beverages.", evidence: "A-I", evidenceSource: "IDSA 2011" },
          ],
        },
        {
          line: "Second-Line (use when first-line agents cannot be used)",
          options: [
            { drug: "amox-clav", regimen: "Amoxicillin-Clavulanate 500/125mg PO BID × 5-7 days", notes: "Inferior efficacy to first-line agents for uncomplicated cystitis. More collateral damage. Reserve when others unavailable.", evidence: "B-II", evidenceSource: "IDSA 2011" },
            { drug: "cephalexin", regimen: "Cephalexin 500mg PO BID-QID × 5-7 days", notes: "Reasonable alternative. Better tolerated than amox-clav. Limited guideline support as first choice.", evidence: "B-II", evidenceSource: "IDSA 2011" },
            { drug: "cefpodoxime", regimen: "Cefpodoxime 100mg PO BID × 5-7 days", notes: "Third-gen oral cephalosporin option. Broader spectrum than needed for most uncomplicated cases.", evidence: "B-II", evidenceSource: "IDSA 2011" },
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
            { drug: "ceftriaxone", regimen: "Ceftriaxone 1-2g IV daily (or cefepime 2g IV q8h if AmpC/Pseudomonas concern)", notes: "IDSA 2025 preferred: 3rd/4th-gen cephalosporins. Carbapenems are NOT first-line for non-septic cUTI — this is a key stewardship change. Reserve carbapenems for sepsis or confirmed ESBL.", evidence: "A-I", evidenceSource: "IDSA 2011" },
            { drug: "pip-tazo", regimen: "Piperacillin-tazobactam 3.375g IV q6h (or 4.5g q8h extended infusion)", notes: "IDSA 2025 preferred empiric option. Extended infusion (over 4h) optimizes PK/PD. Appropriate when broader coverage desired (Pseudomonas risk).", evidence: "A-I", evidenceSource: "IDSA 2011" },
            { drug: "ciprofloxacin", regimen: "Ciprofloxacin 500mg PO BID or Levofloxacin 750mg PO daily", notes: "IDSA 2025 preferred IF no FQ exposure in past 12 months (Step 2). Advantage: oral administration avoids IV, enables outpatient treatment. AVOID if FQ used in prior 12 months — guideline-specific recommendation.", evidence: "A-I", evidenceSource: "IDSA 2011" },
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
      durationGuidance: {
        standard: "7 days (fluoroquinolone IV→PO)",
        severe: "14 days (complex/bacteremic)",
        opatNote: "IV→PO switch appropriate once afebrile ≥24h and tolerating oral intake",
        stewardshipNote: "IDSA 2011 recommends ciprofloxacin 500mg BID × 7d or TMP-SMX × 14d",
      },
      empiricTherapy: [
        {
          line: "Outpatient (Uncomplicated, Tolerating PO, Not Septic)",
          options: [
            { drug: "ciprofloxacin", regimen: "Ciprofloxacin 500mg PO BID × 7 days", notes: "IDSA first-line for outpatient pyelo IF local FQ resistance <10%. 7-day course is established.", evidence: "A-I", evidenceSource: "IDSA 2011" },
            { drug: "tmp-smx", regimen: "TMP-SMX DS PO BID × 14 days", notes: "Alternative if FQ cannot be used. Requires 14 days (longer than FQ). IDSA recommends a one-time IV dose of ceftriaxone 1g or aminoglycoside with initiation if using TMP-SMX empirically (pending cultures).", evidence: "B-II", evidenceSource: "IDSA 2011" },
            { drug: "ceftriaxone-oral-step", regimen: "Ceftriaxone 1g IV/IM × 1 dose THEN oral step-down (cefpodoxime, TMP-SMX, or FQ per susceptibility)", notes: "Excellent strategy for ED-treat-and-release. The single IV dose provides immediate high tissue levels while you await culture results for definitive oral selection.", evidence: "B-II", evidenceSource: "IDSA 2011" },
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
      durationGuidance: {
        standard: "7–14 days",
        opatNote: "Remove or replace catheter when possible before starting antimicrobials",
      },
      empiricTherapy: [
        {
          line: "Empiric (Pending Cultures — Always De-escalate)",
          options: [
            { drug: "ceftriaxone", regimen: "Ceftriaxone 1-2g IV daily", notes: "Reasonable empiric for non-critically ill. Narrow once cultures return. Always assess for Pseudomonas risk.", evidence: "A-I", evidenceSource: "IDSA 2011" },
            { drug: "pip-tazo", regimen: "Piperacillin-tazobactam 4.5g IV q8h (EI over 4h)", notes: "Use if Pseudomonas or MDR risk (prior cultures, healthcare exposure). Extended infusion recommended.", evidence: "B-II", evidenceSource: "IDSA 2011" },
            { drug: "ciprofloxacin", regimen: "Ciprofloxacin 500mg PO BID (if can take PO and not critically ill)", notes: "Only oral option with Pseudomonal activity. But FQ resistance is high in catheterized populations — empiric use risky without prior culture data.", evidence: "B-II", evidenceSource: "IDSA 2011" },
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
};

const UTI_WORKFLOW_ENHANCEMENTS: Record<string, Partial<Subcategory>> = {
  "uncomplicated-cystitis": {
    diagnosticWorkup: ready("Use symptoms plus urinalysis as the default diagnostic approach; urine culture is reserved for recurrence, recent antibiotics, or diagnostic uncertainty."),
    severitySignals: ready("Fever, flank pain, rigors, nausea/vomiting, or systemic instability means the patient no longer belongs in an uncomplicated cystitis pathway."),
    mdroRiskFactors: ready("Recent antibiotics, prior ESBL history, travel-associated resistance exposure, and recurrent MDR UTI are the main reasons to move away from routine first-line oral options."),
    sourceControl: notApplicable("Source control is not usually the main issue in straightforward uncomplicated cystitis."),
    deEscalation: ready("If culture data later show resistance or no growth, stop or switch the initial oral regimen rather than automatically extending the course."),
    ivToPoPlan: notApplicable("This pathway is already oral-first, so IV-to-PO transition is not the primary stewardship question."),
    failureEscalation: ready("Persistent symptoms beyond 48-72 hours should trigger repeat history, urine culture review, STI/vaginitis reconsideration, and evaluation for early pyelonephritis or resistant pathogens."),
    consultTriggers: ready("Escalate for pregnancy, recurrent MDR infection, structural urinary tract disease, or repeated failure of first-line oral therapy."),
    durationAnchor: ready("Count duration from the first active oral dose; do not restart the clock for mild residual urinary symptoms alone."),
  },
  "complicated-uti": {
    diagnosticWorkup: ready("Get a urine culture before antibiotics, add blood cultures when systemic symptoms are present, and image early when obstruction, stones, or abscess are on the table.", [
      "Complicated UTI management starts with severity + resistance risk + patient factors + local susceptibility, not anatomy alone.",
    ]),
    severitySignals: ready("Sepsis, AKI, hypotension, flank pain with systemic illness, or inability to take PO moves this pathway toward admission and broader empiric coverage."),
    mdroRiskFactors: ready("Prior ESBL or resistant gram-negative isolation, recent hospitalization, recent IV antibiotics, urinary instrumentation, and chronic catheter exposure are the biggest empiric resistance gates."),
    sourceControl: ready("Relieve obstruction, exchange infected hardware when feasible, and drain collections early because antibiotics alone underperform when the urinary tract is not flowing."),
    deEscalation: ready("At 48-72 hours, narrow to the single active regimen that matches the isolate and stop empiric double coverage or anti-pseudomonal therapy when it is no longer justified."),
    ivToPoPlan: ready("Switch to PO as soon as the patient is hemodynamically improved, able to absorb, and has an active high-bioavailability oral option, even when initial bacteremia was present."),
    failureEscalation: ready("If fever or leukocytosis persist, look first for obstruction, abscess, prostatitis, untreated source, or the wrong organism rather than reflexively extending the same drug."),
    consultTriggers: ready("Consult urology or ID for obstruction, emphysematous infection, persistent bacteremia, renal abscess, or recurrent resistant gram-negative disease."),
    durationAnchor: ready("Count duration from the first active agent after source control is addressed; bacteremia alone does not mandate an automatically longer course."),
    diagnosticStewardship: [
      {
        title: "Pre-treatment urine culture is the anchor test",
        detail: "Complicated UTI should not be managed as 'positive UA equals broad antibiotics'; the urine culture drives de-escalation, oral step-down, and resistant-phenotype confirmation.",
        sourceIds: ["idsa-2025-cuti"],
      },
      {
        title: "Mixed flora and candiduria need clinical context",
        detail: "Culture growth alone does not obligate treatment if the syndrome is colonization, asymptomatic bacteriuria, or catheter-associated yeast without invasive disease.",
        sourceIds: ["idsa-2025-cuti", "idsa-2010-cauti"],
      },
    ],
    reassessmentCheckpoints: [
      {
        window: "24h",
        title: "24-hour urine-source timeout",
        trigger: "Confirm that urine culture, blood cultures when indicated, and early imaging/source-control steps are actually in motion.",
        actions: [
          "Verify whether obstruction, stone, or hardware is part of the syndrome.",
          "Check that empiric therapy still matches severity and resistance risk.",
          "Flag whether an oral exit might be possible once susceptibilities return.",
        ],
        sourceIds: ["idsa-2025-cuti"],
      },
      {
        window: "48h",
        title: "48-hour narrowing timeout",
        trigger: "Use finalized or near-final microbiology to stop unnecessary anti-pseudomonal or carbapenem exposure and to reject non-infectious culture noise.",
        actions: [
          "De-escalate to ceftriaxone, TMP-SMX, or fluoroquinolone when the isolate and patient fit.",
          "Stop treating asymptomatic candiduria or colonization patterns masquerading as cUTI.",
          "Escalate source-control workup instead of extending broad therapy when fever persists.",
        ],
        sourceIds: ["idsa-2025-cuti", "idsa-2010-cauti"],
      },
      {
        window: "definitive",
        title: "Definitive therapy and duration lock",
        trigger: "Once the organism, urinary source, and source-control status are clear, lock the shortest effective course and discharge route.",
        actions: [
          "Use high-bioavailability oral step-down when susceptibility and absorption are reliable.",
          "Do not lengthen the course only because early bacteremia was present.",
          "Tie duration to source control for obstructed or instrumented infections.",
        ],
        sourceIds: ["idsa-2025-cuti", "oral-stepdown-bacteremia"],
      },
    ],
    contaminationPitfalls: [
      {
        scenario: "Asymptomatic bacteriuria in a catheterized or chronically colonized patient",
        implication: "Positive urine cultures are common and often do not explain fever or delirium by themselves.",
        action: "Treat symptoms plus a coherent urinary syndrome rather than the culture in isolation.",
        sourceIds: ["idsa-2010-cauti", "idsa-2025-cuti"],
      },
      {
        scenario: "Candiduria or mixed flora without invasive features",
        implication: "Yeast and mixed growth frequently represent colonization or collection problems rather than a pathogen that needs antifungal escalation.",
        action: "Re-collect, change the catheter when needed, and confirm the syndrome before treating.",
        sourceIds: ["idsa-2010-cauti", "idsa-candidiasis"],
      },
    ],
    durationAnchors: [
      {
        event: "Relief of obstruction or exchange of infected hardware",
        anchor: "For obstructed, stented, or hardware-associated urinary infection, count the main treatment course from the first active regimen after drainage or device intervention when feasible.",
        sourceIds: ["idsa-2025-cuti", "idsa-2010-cauti"],
      },
      {
        event: "First active systemic therapy",
        anchor: "For uncomplicated bacteremic cUTI without persistent obstruction, use the first active regimen as the clock start and aim for a 7-day total course when the patient responds.",
        sourceIds: ["idsa-2025-cuti", "oral-stepdown-bacteremia"],
      },
    ],
  },
  pyelonephritis: {
    diagnosticWorkup: ready("Obtain a urine culture up front and add blood cultures when the patient is febrile, toxic, or being admitted.", [
      "Image early if there is concern for obstruction, stones, abscess, or failure to improve.",
    ]),
    severitySignals: ready("Rigors, hypotension, significant nausea/vomiting, pregnancy, or inability to tolerate PO should push this pathway toward inpatient management."),
    mdroRiskFactors: ready("Recent antibiotics, prior ESBL or FQ-resistant isolates, recurrent pyelonephritis, and healthcare exposure should change empiric therapy on day 1."),
    sourceControl: ready("Rule out obstructing stones or collecting-system obstruction quickly because pyelonephritis with a blocked system is a source-control problem."),
    deEscalation: ready("Once susceptibilities return, step down to the narrowest active oral or IV agent and avoid leaving broad-spectrum IV therapy in place just because the patient started very ill."),
    ivToPoPlan: ready("Transition to PO after defervescence, improving flank pain, and reliable oral intake when the oral agent has proven susceptibility and adequate kidney exposure."),
    failureEscalation: ready("Lack of improvement after 48-72 hours should trigger repeat imaging, source-control review, and evaluation for resistant pathogens or non-urinary diagnoses."),
    consultTriggers: ready("Escalate for obstruction, renal abscess, pregnancy, emphysematous infection, or persistent bacteremia."),
    durationAnchor: ready("Count from the first active regimen after any obstructive source is relieved; short-course fluoroquinolone therapy remains appropriate only when the isolate is clearly susceptible."),
  },
  cauti: {
    diagnosticWorkup: ready("Do not culture an old catheter blindly; replace or remove it first when possible, then send the urine culture from the new system before antibiotics."),
    severitySignals: ready("Fever, rigors, hypotension, delirium with bacteremic concern, or upper-tract symptoms move CAUTI into a systemic infection workflow rather than asymptomatic bacteriuria."),
    mdroRiskFactors: ready("Long-term catheterization, recent antibiotics, prior MDR gram-negatives, and frequent healthcare exposure should strongly shape empiric choices."),
    sourceControl: ready("Catheter removal or exchange is the key source-control intervention and should happen as early as possible."),
    deEscalation: ready("At 48-72 hours, narrow to the single active agent and stop therapy entirely if cultures reveal colonization or asymptomatic bacteriuria rather than true CAUTI."),
    ivToPoPlan: ready("Complete treatment with PO therapy whenever the patient is clinically improving, the catheter issue is addressed, and an active oral agent is available."),
    failureEscalation: ready("Persistent fever after catheter exchange should trigger repeat source review, imaging for obstruction/abscess, and reassessment of whether the urinary tract is truly the driver."),
    consultTriggers: ready("Consult urology or ID for recurrent CAUTI with hardware, obstruction, unusual organisms, or repeated mismatch between symptoms and cultures."),
    durationAnchor: ready("Start counting from the first active dose after catheter exchange/removal when feasible; do not keep treating colonization because the catheter remains in place."),
  },
};

const UTI_MICROBIOLOGY_ENHANCEMENTS: Record<string, Partial<Subcategory>> = {
  "complicated-uti": {
    rapidDiagnostics: [
      {
        trigger: "Urine or blood culture shows ceftriaxone-nonsusceptible Enterobacterales or the patient has a recent ESBL history",
        action: "Use a carbapenem up front for severe infection, then de-escalate to TMP-SMX or a fluoroquinolone only if susceptibility confirms an oral exit.",
        rationale: "Early organism and resistance clues matter more than the anatomic label once systemic illness is present.",
      },
      {
        trigger: "Candiduria appears without symptoms or without evidence of invasive infection",
        action: "Avoid starting antifungals just because yeast is reported in the urine.",
        rationale: "Most candiduria in catheterized or recently antibiotic-exposed adults reflects colonization, not a treatable invasive UTI syndrome.",
      },
    ],
    breakpointNotes: [
      {
        marker: "Nitrofurantoin or fosfomycin susceptibility",
        interpretation: "Urinary activity does not translate into reliable renal parenchymal or bloodstream exposure for complicated UTI with systemic features.",
        action: "Do not use these agents for pyelonephritis, bacteremic UTI, or septic obstruction even if the isolate tests susceptible.",
      },
      {
        marker: "Oral step-down susceptibility",
        interpretation: "A culture result only supports discharge or IV-to-PO transition when the oral option has high bioavailability and the patient is clinically improving.",
        action: "Reserve oral beta-lactams for carefully selected lower-tract or step-down scenarios rather than every bacteremic cUTI.",
      },
    ],
    intrinsicResistance: [
      {
        organism: "Proteus, Morganella, and Providencia species",
        resistance: "These organisms are intrinsically unreliable targets for nitrofurantoin.",
        implication: "Avoid using nitrofurantoin as the fallback oral option when one of these genera is identified.",
      },
      {
        organism: "Pseudomonas aeruginosa and Enterococcus species",
        resistance: "Ceftriaxone is not a dependable definitive option for either pathogen.",
        implication: "Move to a source-appropriate agent rather than completing therapy on ceftriaxone because the patient initially improved.",
      },
    ],
    coverageMatrix: [
      {
        label: "Susceptible Enterobacterales cUTI",
        status: "preferred",
        detail: "Ceftriaxone or an active oral TMP-SMX or fluoroquinolone remains the standard path when resistance risk is low.",
      },
      {
        label: "ESBL phenotype",
        status: "conditional",
        detail: "Meropenem or ertapenem is favored initially, with oral step-down only if a high-bioavailability susceptible option exists.",
      },
      {
        label: "Pseudomonas risk",
        status: "conditional",
        detail: "Use cefepime, pip-tazo, or a susceptible fluoroquinolone only when the culture history or healthcare exposure supports it.",
      },
      {
        label: "Asymptomatic candiduria",
        status: "avoid",
        detail: "Do not convert yeast in the urine into a reflex antifungal treatment plan without symptoms or invasive risk.",
      },
    ],
  },
};

export const UTI: DiseaseState = enhanceDiseaseEmpiricOptions(
  enhanceDisease(
    UTI_BASE,
    mergeEnhancementMaps(UTI_WORKFLOW_ENHANCEMENTS, UTI_MICROBIOLOGY_ENHANCEMENTS),
    UTI_MONOGRAPH_ENHANCEMENTS,
  ),
  getEmpiricOptionEnhancementsForDisease("uti"),
);
