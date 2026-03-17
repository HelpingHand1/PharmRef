// Editorial source for the generated Sepsis disease module.
// Runtime catalog imports use src/data/generated/diseases/sepsis.ts.

// ============================================================
// SEPSIS & SEPTIC SHOCK
// ============================================================
// Sources: Surviving Sepsis Campaign 2021 International Guidelines,
// Sepsis-3 Definitions (Singer et al. JAMA 2016), IDSA 2024 AMR Guidance,
// BALANCE Trial 2024, MERINO Trial 2018, SMART Trial 2018
// ============================================================

import type { DiseaseState, Subcategory } from "../types";
import { getEmpiricOptionEnhancementsForDisease } from "./regimen-plan-content";
import { enhanceDisease, enhanceDiseaseEmpiricOptions, mergeEnhancementMaps, ready } from "./stewardship-content";

const SEPSIS_BASE: DiseaseState = {
  id: "sepsis",
  name: "Sepsis & Septic Shock",
  icon: "🔴",
  category: "Critical Care / Infectious Disease",
  overview: {
    definition:
      "Sepsis-3 (Singer et al., JAMA 2016): Sepsis is life-threatening organ dysfunction caused by a dysregulated host response to infection. Organ dysfunction is defined by a SOFA score increase ≥2 points (associated with in-hospital mortality >10%). Septic shock: vasopressor requirement to maintain MAP ≥65 mmHg AND serum lactate >2 mmol/L despite adequate fluid resuscitation — in-hospital mortality >40%. Quick-SOFA (qSOFA ≥2): altered mentation + RR ≥22 + SBP ≤100 is a rapid bedside screen outside the ICU. The terms 'severe sepsis' and SIRS criteria for sepsis diagnosis have been retired. Key principle: time-to-antibiotics is the primary modifiable determinant of mortality — every hour of delay in antibiotic administration associated with ~7% increase in mortality for septic shock.",
    epidemiology:
      "Sepsis affects ~1.7 million adults annually in the US with ~270,000 deaths per year — exceeding prostate cancer, breast cancer, and AIDS combined. It is the most expensive condition treated in US hospitals (>$24 billion/year). Worldwide, sepsis causes ~11 million deaths annually (20% of all global deaths). In-hospital mortality: 10–30% for sepsis, 40–60% for septic shock. ICU survivors face Post-Intensive Care Syndrome (PICS): long-term cognitive impairment, physical disability, PTSD, and depression. Source distribution: pulmonary 35–40%, urinary 20–25%, intra-abdominal/biliary 15–20%, skin/soft tissue 10%, primary bacteremia/catheter-related 10%. Gram-positive organisms account for ~50% of bacteremias; gram-negatives ~40%; fungi ~5–10%. MRSA causes ~20% of all S. aureus bacteremia. Gram-negative bacteremia carries disproportionately high immediate mortality — Pseudomonas aeruginosa bacteremia in ICU patients has 30-day mortality of 30–50%.",
    keyGuidelines: [
      {
        name: "Surviving Sepsis Campaign (SSC) 2021 International Guidelines",
        detail:
          "The SSC 2021 is the global standard of care for sepsis/septic shock. Key antimicrobial recommendations: (1) Administer broad-spectrum antibiotics within 1 hour of septic shock or sepsis with organ dysfunction; within 3 hours of sepsis without shock. (2) Obtain blood cultures (≥2 sets) BEFORE antibiotics if possible without delaying >45 minutes. (3) Empiric combination gram-positive (MRSA) coverage for septic shock without clear source. (4) Procalcitonin-guided de-escalation — target PCT decline >80% from peak or PCT <0.5 ng/mL for antibiotic discontinuation. (5) Do NOT use dual gram-negative coverage once organism identified (no synergy benefit for bacteremia, adds toxicity). (6) Source control within 6–12 hours (drainage, debridement, catheter removal). (7) Fluid resuscitation: 30 mL/kg IV balanced crystalloid for MAP <65 or lactate ≥4 mmol/L within 3 hours. (8) Norepinephrine first-line vasopressor (MAP target ≥65 mmHg). (9) Hydrocortisone 200 mg/day IV for vasopressor-refractory septic shock. (10) Balanced crystalloids (LR, Plasma-Lyte) preferred over 0.9% NS.",
        sourceIds: ["ssc-2021"],
      },
      {
        name: "Sepsis-3 Task Force (Singer et al., JAMA 2016)",
        detail:
          "Landmark consensus paper retiring SIRS criteria for sepsis diagnosis (SIRS is too non-specific — occurs in surgery, burns, pancreatitis). Introduced SOFA score as the operational criterion for organ dysfunction (≥2 point increase). Validated qSOFA (RR ≥22, altered mentation, SBP ≤100 — 2/3 = screen positive) as a rapid bedside tool outside the ICU. Established Septic Shock as requiring BOTH vasopressors for MAP ≥65 mmHg AND lactate >2 mmol/L (mortality >40%). Retired 'severe sepsis' as a separate category. This paradigm shift changed ICU admission criteria and antibiotic initiation thresholds globally.",
        sourceIds: ["sepsis-3"],
      },
      {
        name: "IDSA 2024 AMR Guidance",
        detail:
          "Not a sepsis guideline, but directly relevant when septic patients have resistant-pathogen risk. Provides mechanism-aware treatment direction for ESBL-E, CRE, DTR Pseudomonas, and resistant Acinetobacter, and reinforces culture-driven de-escalation once the organism is defined.",
        sourceIds: ["idsa-2024-amr"],
      },
      {
        name: "BALANCE Trial 2024 — 7 vs. 14 Days for Non-Endocarditis Bacteremia",
        detail:
          "Landmark RCT (n=3,608 patients) comparing 7-day vs. 14-day antibiotic courses for bacteremia (excluding endocarditis). 90-day mortality was non-inferior in the 7-day group (14.5% vs. 16.1%). The 7-day course was associated with fewer adverse events, lower C. difficile incidence, and reduced costs. Exceptions where longer therapy may be warranted: S. aureus bacteremia with metastatic foci, endocarditis, immunocompromised patients. This trial strongly supports 7-day antibiotic courses for most bacteremia-associated sepsis when source is controlled and clinical improvement is evident.",
        sourceIds: ["balance"],
      },
    ],
    landmarkTrials: [
      {
        name: "MERINO Trial (Paul et al., JAMA 2018) — Pip-Tazo vs. Meropenem for ESBL Bacteremia",
        detail:
          "391 patients with E. coli or Klebsiella bacteremia (predominantly ESBL-producing) treated with piperacillin-tazobactam vs. meropenem. 30-day mortality: 12.3% (pip-tazo) vs. 3.7% (meropenem) — pip-tazo FAILED non-inferiority. The 'Eagle/inoculum effect' causes pip-tazo MIC to rise dramatically at high bacterial densities. MERINO definitively established: carbapenems (meropenem/ertapenem) — NOT pip-tazo — are the definitive treatment for ESBL-producing Enterobacterales bacteremia, regardless of in vitro susceptibility.",
        sourceIds: ["merino"],
      },
      {
        name: "ARISE, ProCESS, ProMISe Trials (2014–2015) — EGDT vs. Standard Care",
        detail:
          "Three RCTs (ARISE n=1,600, ProCESS n=1,341, ProMISe n=1,260) failed to show benefit of the Rivers EGDT protocol (targeting CVP 8-12, ScvO2 ≥70%, MAP ≥65, UO ≥0.5 mL/kg/hr) over standard care. 90-day mortality was similar (~18–24% across all arms). EGDT required more blood transfusions, dobutamine, and resources without benefit. These trials validated protocolized standard care — early antibiotics + fluid resuscitation + vasopressors — as sufficient, and effectively retired the Rivers protocol.",
        sourceIds: ["arise", "process", "promise"],
      },
      {
        name: "SMART Trial (Semler et al., NEJM 2018) — Balanced Crystalloids vs. Normal Saline",
        detail:
          "15,802 ICU patients randomized to balanced crystalloids (LR or Plasma-Lyte) vs. 0.9% NS. Primary outcome MAKE-30 (death, new RRT, or persistent creatinine elevation): 14.3% balanced vs. 15.4% NS (OR 0.90, p=0.04). Sepsis patients had greater benefit. Excess NS causes hyperchloremic metabolic acidosis and may worsen renal outcomes. SSC 2021 recommends balanced crystalloids over NS; NS remains acceptable when balanced crystalloids unavailable.",
        sourceIds: ["smart-trial"],
      },
      {
        name: "ANDROMEDA-SHOCK Trial (Hernandez et al., JAMA 2019) — CRT vs. Lactate-Guided Resuscitation",
        detail:
          "424 septic shock patients randomized to capillary refill time (CRT)-guided vs. serum lactate-guided resuscitation. CRT-guided group trended toward lower 28-day mortality (34.9% vs. 43.4%, p=0.06), received less fluid, shorter vasopressor duration. Established peripheral perfusion assessment (CRT ≤3 seconds) as a valid complementary resuscitation endpoint to lactate clearance.",
        sourceIds: ["andromeda-shock"],
      },
      {
        name: "ADRENAL Trial (Venkatesh et al., NEJM 2018) — Hydrocortisone in Septic Shock",
        detail:
          "3,800 ventilated patients with septic shock randomized to hydrocortisone 200mg/day vs. placebo. 90-day mortality: 27.9% hydrocortisone vs. 28.8% placebo (p=0.50 — no significant difference). BUT: hydrocortisone significantly reduced vasopressor duration, ICU LOS, and time to shock resolution. SSC 2021 still recommends low-dose corticosteroids for vasopressor-refractory septic shock based on physiological rationale and shock-resolution benefit.",
        sourceIds: ["adrenal"],
      },
    ],
    riskFactors:
      "HOST FACTORS: Age extremes (neonates, elderly >65 — impaired immune response); functional immunosuppression (chemotherapy, high-dose corticosteroids ≥20 mg prednisone/day, biologic agents, calcineurin inhibitors); solid organ transplant (first year highest risk); HIV/AIDS (CD4 <200); hematologic malignancies (leukemia, lymphoma, myeloma); diabetes mellitus (impaired neutrophil function, vascular disease, autonomic neuropathy); chronic organ failure (cirrhosis Child-Pugh B/C, ESRD/dialysis, CHF NYHA III-IV, COPD GOLD 3-4); malnutrition; chronic alcohol use disorder; pregnancy (group B Streptococcus, E. coli, UTI-related). HEALTHCARE-ASSOCIATED RISK FACTORS: Indwelling vascular catheters (CVL, PICC, HD catheter — primary gram-positive bacteremia risk); urinary catheters (Candida, gram-negative UTI); mechanical ventilation (VAP); recent surgery (especially GI/biliary/urologic); recent broad-spectrum antibiotics (C. diff, Candida, MDR selection); prolonged hospitalization ≥5 days; nursing home/LTAC residence; prior MRSA or VRE colonization. MDR RISK FLAGS: MRSA — prior MRSA, HD, IVDU, healthcare contact within 90 days. ESBL — prior ESBL isolation, prior fluoroquinolone/cephalosporin exposure, travel to endemic region. Candida — TPN ≥5 days + broad-spectrum abx, abdominal surgery with GI perforation, transplant, Candida colonization ≥2 sites. Pseudomonas — structural lung disease (bronchiectasis, cystic fibrosis), prior Pseudomonas, prolonged ICU, immunocompromised.",
  },
  subcategories: [
    {
      id: "sepsis-community",
      name: "Community-Acquired Sepsis",
      definition:
        "Sepsis arising outside the hospital or within <48 hours of admission without recent healthcare contact (no hospitalization, no outpatient IV therapy, no HD, no nursing home residence within 90 days). Common sources: pneumonia (S. pneumoniae, atypicals, gram-negatives), urinary tract (E. coli, Klebsiella), intra-abdominal (polymicrobial), skin/soft tissue (S. aureus, Streptococcus). MDR coverage generally NOT required without specific risk factors. De-escalate aggressively once culture results available.",
      clinicalPresentation:
        "Temperature >38.3°C or <36°C (fever or hypothermia — hypothermia is an ominous sign); HR >90 bpm; RR >20 or PaCO2 <32 mmHg; altered mentation (early sign — do not dismiss); hypotension (SBP <90 or MAP <65 mmHg); oliguria (UO <0.5 mL/kg/hr for ≥2h); elevated lactate (>2 mmol/L = tissue hypoperfusion). Septic shock: hypotension requiring vasopressors + lactate >2 mmol/L despite adequate fluids. Source-specific: pneumonia — cough, dyspnea, pleuritic chest pain, infiltrate on CXR; UTI — dysuria, flank pain, CVA tenderness (though may be absent in elderly); IAI — abdominal pain, guarding/rigidity, rebound, absent bowel sounds; SSTI — warmth, erythema, fluctuance, skin breakdown.",
      diagnostics:
        "CULTURES (before antibiotics, do not delay >45 min): Blood cultures ×2 (different sites, 10 mL per bottle) — essential even with clear source. Urine culture and UA. Source-specific: CXR (pneumonia), CT abdomen/pelvis with IV contrast (IAI — abscess, perforation, biliary obstruction), wound culture (SSTI). LABS: CBC with differential, BMP (creatinine, BUN, glucose, electrolytes), LFTs (total bilirubin — SOFA component), lactate (repeat if >2 mmol/L to monitor clearance), coagulation (PT, aPTT, fibrinogen — DIC screen in severe sepsis), blood gas (pH, PaO2, bicarbonate — acid-base status). BIOMARKERS: Procalcitonin (PCT) at baseline — elevated in bacterial sepsis (>2 ng/mL supports bacterial etiology); use serial PCT to guide de-escalation. CRP (less specific than PCT). IMAGING: CXR for all patients; CT or ultrasound for undifferentiated source. SOFA score: calculate and reassess every 12–24h for organ dysfunction tracking.",
      durationGuidance: {
        standard: "7–10 days total for most community-acquired sepsis when source controlled and clinical improvement confirmed",
        severe: "14 days for S. aureus bacteremia; extend individualized for endocarditis (4–6 weeks); 7 days for most UTI-related sepsis",
        opatNote:
          "OPAT appropriate after 3–5 days of IV therapy when hemodynamically stable and source controlled. Oral step-down preferred when high-bioavailability agents available (fluoroquinolones, TMP-SMX, amoxicillin-clavulanate). Use PCT-guided therapy.",
        stewardshipNote:
          "Use PCT to guide de-escalation: PCT decline >80% from peak OR absolute PCT <0.5 ng/mL supports antibiotic discontinuation. Avoid extending empiric broad-spectrum therapy beyond 72h without clear clinical indication. BALANCE trial (2024): 7-day courses non-inferior to 14-day for bacteremia.",
      },
      empiricTherapy: [
        {
          line: "First-Line Empiric — No MDR/MRSA Risk Factors",
          options: [
            {
              drug: "ceftriaxone",
              regimen: "Ceftriaxone 2g IV q24h ± Azithromycin 500mg IV/PO q24h (if CAP)",
              notes:
                "Preferred for urinary, biliary, and community pneumonia sources. Add azithromycin if atypical pneumonia suspected (CAP). Not reliable for ESBL, AmpC, or Pseudomonas. Excellent CNS penetration for meningitis (2g IV q12h for meningitis dosing).",
              evidence: "A-I",
              evidenceSource: "SSC 2021, IDSA CAP 2019",
            },
            {
              drug: "piperacillin-tazobactam",
              regimen: "Piperacillin-Tazobactam 4.5g IV q8h over 4h (extended infusion preferred) OR 3.375g IV q6h",
              notes:
                "Broader empiric coverage including anaerobes, Enterococcus faecalis, and most Pseudomonas. Preferred when abdominal/biliary source suspected or polymicrobial coverage needed. CRITICAL: Do NOT use as definitive therapy for ESBL bacteremia (MERINO trial — 3.3× higher mortality vs. meropenem). Extended 4h infusion optimizes T>MIC target attainment.",
              evidence: "A-I",
              evidenceSource: "SSC 2021; MERINO Trial JAMA 2018",
            },
            {
              drug: "cefepime",
              regimen: "Cefepime 2g IV q8h",
              notes:
                "Good gram-negative coverage including Pseudomonas aeruginosa. Appropriate when Pseudomonas risk present (structural lung disease, known colonization). No anaerobic coverage — add metronidazole 500mg IV q8h for abdominal source. Monitor for cefepime-induced neurotoxicity (encephalopathy, myoclonus) in renal impairment.",
              evidence: "A-I",
              evidenceSource: "SSC 2021",
            },
          ],
        },
        {
          line: "Add-On for MRSA Coverage (When Risk Factors Present)",
          options: [
            {
              drug: "vancomycin",
              regimen: "Vancomycin IV — AUC-guided dosing (target AUC/MIC 400–600 per ASHP/IDSA 2020)",
              notes:
                "Add empirically when: prior MRSA infection/colonization, HD patient, IVDU, recent hospitalization within 90 days, suspected catheter-related BSI, skin/soft tissue source with MRSA risk, septic shock without clear source. De-escalate at 48–72h if blood cultures negative for MRSA and gram-positive not identified. AUC-guided dosing with pharmacy consult required.",
              evidence: "A-I",
              evidenceSource: "SSC 2021; ASHP/IDSA Vancomycin Guidelines 2020",
            },
            {
              drug: "daptomycin",
              regimen: "Daptomycin 8–10mg/kg IV q24h (high-dose for bacteremia/endocarditis)",
              notes:
                "Alternative to vancomycin for MRSA bacteremia — non-inferior to vancomycin in RCTs. Preferred if: vancomycin MIC ≥2, VRE enterococcal bacteremia, or prior vancomycin nephrotoxicity. Do NOT use for pneumonia (inactivated by pulmonary surfactant). Monitor CPK weekly for myopathy.",
              evidence: "A-I",
              evidenceSource: "Fowler et al., NEJM 2006",
            },
          ],
        },
        {
          line: "Empiric Antifungal — Only if Specific Candida Risk Factors",
          options: [
            {
              drug: "micafungin",
              regimen: "Micafungin 100mg IV q24h OR Caspofungin 70mg IV ×1 then 50mg IV q24h",
              notes:
                "Do NOT add empiric antifungals routinely — SSC 2021 recommends against empiric antifungal for sepsis without specific risk factors. Reserve for: TPN-dependent + broad-spectrum abx ≥5 days + septic shock without source; abdominal surgery with GI perforation + Candida colonization; immunocompromised + persistent fever. Echinocandins are first-line for candidemia per IDSA 2016. Obtain ophthalmology fundoscopic exam if Candida in blood (endophthalmitis changes management).",
              evidence: "B-II",
              evidenceSource: "SSC 2021; IDSA Candidiasis 2016",
            },
          ],
        },
      ],
      pearls: [
        "TIME IS TISSUE: For septic shock, each hour of antibiotic delay associated with ~7% mortality increase. Do NOT delay antibiotics to obtain imaging or await culture results.",
        "Blood cultures before antibiotics — but do not delay antibiotics >45 minutes to get cultures. Two sets from different sites (peripheral + central or bilateral peripheral), 10 mL per bottle. Only 1-3 sets reduces sensitivity — always get ≥2 sets.",
        "Empiric antibiotic breadth should match the likely source and local MDR epidemiology. Avoid over-treating community-acquired sepsis with carbapenem-level empiric therapy unless ESBL/MDR risk factors are present.",
        "De-escalation is not optional — it is a patient safety and stewardship obligation. At 48–72h, review cultures, narrow to narrowest effective agent. 'I'll continue broad spectrum just to be safe' thinking leads to CDI, MDR selection, and adverse drug effects.",
        "MERINO rule: Never use piperacillin-tazobactam as definitive therapy for ESBL bacteremia, regardless of in vitro susceptibility. The inoculum effect causes treatment failure. Use meropenem or ertapenem.",
        "Lactate is not just a severity marker — it is an actionable resuscitation target. Lactate >2 mmol/L = cryptic shock (requires treatment even with normal BP). Reassess lactate at 2–4h. Lactate clearance ≥10% at 2h associated with improved outcomes.",
      ],
    },
    {
      id: "sepsis-hcap",
      name: "Healthcare-Associated Sepsis",
      definition:
        "Sepsis arising ≥48–72h after hospital admission OR in patients with significant healthcare exposure within the prior 90 days: hospitalization ≥2 days, hemodialysis, home IV therapy, nursing home/LTAC residence, outpatient wound care, or prior surgery. Risk for MRSA, ESBL-producing Enterobacterales, Pseudomonas aeruginosa, Acinetobacter baumannii, VRE, and Candida spp. is substantially elevated vs. community-acquired sepsis. Empiric therapy must be broader, with rapid de-escalation upon culture results.",
      clinicalPresentation:
        "Clinical presentation similar to community-acquired sepsis but often more subtle in elderly or immunocompromised patients. Key clues for healthcare-associated sources: patient with indwelling catheter (CLABSI, CAUTI), recent ventilation (VAP — new fever + purulent secretions + infiltrate in ventilated patient), post-operative fever (SSI — wound erythema, drainage), or C. diff (watery diarrhea in a patient on broad-spectrum antibiotics). CLABSI features: fever or rigors temporally related to catheter flush, erythema at catheter insertion site, multiple positive blood cultures (peripheral + central), and quantitative blood cultures with colony count 3x higher from central vs peripheral. Consider catheter removal for S. aureus bacteremia because of high risk for metastatic seeding (osteomyelitis, endocarditis).",
      diagnostics:
        "CULTURES: Blood cultures ×2 (peripheral + from each vascular access device if CLABSI suspected — quantitative if available). Catheter tip culture if removed. Urine culture (UA + C&S). Wound culture (deep swab or aspirate, not superficial swab). Tracheal aspirate or BAL for VAP. LABS: Same as community-acquired + procalcitonin. MDR SCREENING: If MDR risk, obtain rectal swab for CRE PCR (KPC, NDM) and MRSA nasal swab — results in 24–48 hours can guide modification. IMAGING: CT chest, abdomen, or pelvis with IV contrast for an undifferentiated healthcare-associated source. ECHOCARDIOGRAM: Transthoracic (or TEE) for S. aureus bacteremia to rule out endocarditis, which changes duration (4–6 weeks) and management.",
      durationGuidance: {
        standard: "7–14 days based on source, organism, and clinical response",
        severe:
          "14–28 days for S. aureus bacteremia with metastatic foci or endocarditis; 14–21 days for Pseudomonas or Acinetobacter bacteremia",
        opatNote:
          "OPAT feasible after clinical stabilization and source control — IV-only agents (vancomycin, carbapenems) require PICC/port. Prefer oral step-down (linezolid, TMP-SMX, fluoroquinolones) when susceptibility allows per OVIVA trial.",
        stewardshipNote:
          "Avoid empiric carbapenem continuation without ESBL or MDR confirmation. Use PCT-guided therapy. Consult Infectious Diseases for MDR organisms. BALANCE trial supports 7-day courses for most non-endocarditis bacteremia.",
      },
      empiricTherapy: [
        {
          line: "First-Line Empiric Healthcare-Associated Sepsis Coverage (MRSA + Gram-Negative)",
          options: [
            {
              drug: "vancomycin-piptazo",
              regimen: "Vancomycin IV (AUC-guided) + Piperacillin-Tazobactam 4.5g IV q8h extended infusion",
              notes:
                "Standard empiric combination for healthcare-associated sepsis without prior MDR isolates. Covers MRSA (vancomycin) plus gram-negative pathogens including Pseudomonas (pip-tazo). De-escalate vancomycin if MRSA is not identified at 48–72 hours. Switch from pip-tazo to meropenem if ESBL is found in blood cultures (MERINO trial).",
              evidence: "B-II",
              evidenceSource: "SSC 2021; ATS/IDSA 2016 HAP/VAP",
            },
            {
              drug: "vancomycin-meropenem",
              regimen: "Vancomycin IV (AUC-guided) + Meropenem 2g IV q8h over 3h (extended infusion)",
              notes:
                "Preferred over pip-tazo combination when: prior ESBL isolate from patient, recent hospitalization in high-ESBL facility, abdominal source with high inoculum risk, immunocompromised, or local ESBL prevalence >20% in healthcare settings. Extended 3h infusion maximizes T>MIC for higher-MIC organisms (MIC 2–8 mg/L range).",
              evidence: "A-I",
              evidenceSource: "SSC 2021; MERINO Trial",
            },
          ],
        },
        {
          line: "Suspected Carbapenem-Resistant Organism (CRO) — Immediately Consult ID",
          options: [
            {
              drug: "ceftazidime-avibactam",
              regimen: "Ceftazidime-Avibactam 2.5g IV q8h (for KPC-CRE) ± Aztreonam (for MBL-CRE/NDM)",
              notes:
                "For suspected KPC-producing CRE: ceftazidime-avibactam is first-line. For MBL-producing CRE (NDM, VIM, IMP): ceftazidime-avibactam does NOT cover MBLs — must add aztreonam (see Advanced & Resistant Pathogen Agents section for detailed management). Consult Infectious Diseases immediately. Obtain carbapenem resistance testing (CRE PCR panel, carbapenem MIC). Ceftazidime-avibactam + aztreonam combination covers all CRE classes.",
              evidence: "B-II",
              evidenceSource: "IDSA CRE Guidance 2023",
            },
          ],
        },
        {
          line: "Suspected Candida Sepsis — High-Risk Patients",
          options: [
            {
              drug: "micafungin-hcap",
              regimen: "Micafungin 100mg IV q24h (first-line) OR Caspofungin 70mg IV ×1 then 50mg IV q24h",
              notes:
                "Add empiric antifungal when multiple Candida risk factors are present in healthcare-associated sepsis: TPN dependence, broad-spectrum antibiotics for at least 5 days, septic shock without source, multi-site Candida colonization (at least 2 non-contiguous sites), recent abdominal surgery with GI perforation, or solid organ transplant. Fluconazole is acceptable only for hemodynamically stable patients with no prior azole exposure and low risk for resistant Candida.",
              evidence: "B-II",
              evidenceSource: "SSC 2021; IDSA Candidiasis Guidelines 2016",
            },
          ],
        },
      ],
      pearls: [
        "S. aureus bacteremia rule: ALL S. aureus bacteremias require echocardiography (TEE preferred over TTE for endocarditis sensitivity), follow-up blood cultures every 24–48h until clearance documented, ophthalmology consultation (endophthalmitis risk), and minimum 14 days IV antibiotics — even if source seems clear. Metastatic seeding is common.",
        "CLABSI management: Remove the catheter when possible — catheter salvage for S. aureus or Candida bacteremia is associated with treatment failure. For coagulase-negative Staphylococci, catheter salvage may be attempted with antibiotic lock therapy in select patients with limited access.",
        "Vancomycin AUC/MIC monitoring (ASHP/IDSA 2020): Target AUC/MIC 400–600 for MRSA sepsis. Use Bayesian dosing programs (not trough-only). Nephrotoxicity risk correlates with duration and concurrent nephrotoxins. Check baseline SCr and reassess daily in critically ill.",
        "ESBL detection: Routine susceptibility testing may not identify ESBL-producing organisms. If E. coli or Klebsiella bacteremia is present with prior ESBL history, fluoroquinolone exposure, or healthcare contact — empirically escalate to meropenem/ertapenem regardless of in vitro pip-tazo susceptibility.",
        "Rapid molecular diagnostics (BioFire FilmArray, VERIGENE, Accelerate Pheno): Pathogen and resistance gene identification from positive blood cultures in 1–5 hours. Can direct antibiotic stewardship intervention 24–48h before final susceptibility results. Consult ID or pharmacy to optimize rapid diagnostics use.",
      ],
    },
    {
      id: "septic-shock",
      name: "Septic Shock",
      definition:
        "Sepsis-3: Septic shock = sepsis + vasopressor requirement to maintain MAP ≥65 mmHg + serum lactate >2 mmol/L despite adequate fluid resuscitation. In-hospital mortality >40%. Requires immediate, aggressive resuscitation: (1) Blood cultures ×2, (2) broad-spectrum antibiotics within 1 hour, (3) 30 mL/kg IV balanced crystalloid within 3 hours, (4) norepinephrine for MAP <65 mmHg. Source identification and control within 6–12 hours. Empiric antibiotic selection must be maximally broad with de-escalation at 48–72h.",
      clinicalPresentation:
        "Presenting signs: High fever OR hypothermia (hypothermia is ominous), rigors/shaking chills (especially with bacteremia), profound hypotension (SBP <90 mmHg) unresponsive to 1–2L IV fluid challenge, altered mentation (confusion, agitation, somnolence), mottled skin/delayed capillary refill (peripheral vasoconstriction), oliguria (<0.5 mL/kg/hr), tachycardia >100 bpm, tachypnea >22 breaths/min, elevated lactate (>4 mmol/L = severe shock). SOFA ≥2 with organ dysfunction: elevated creatinine (renal), elevated bilirubin (hepatic), low PaO2/FiO2 (respiratory), elevated INR/bilirubin (hepatic), GCS <15 (neurological), vasopressor requirement (cardiovascular). Distributive shock physiology: high CO/CI, low SVR — warm extremities initially (warm shock) progressing to cold extremities as cardiac function depresses.",
      diagnostics:
        "Same as community-acquired sepsis diagnostics + SOFA score calculation at presentation and q12–24h. Bedside POCUS: cardiac (assess LV/RV function, pericardial effusion — sepsis cardiomyopathy), IVC (volume responsiveness assessment), pulmonary (B-lines = pulmonary edema vs. A-lines = hypovolemia). Consider PA catheter or PiCCO hemodynamic monitoring in refractory shock. ScvO2 (central venous O2 saturation) via central line: target >70% — persistently low suggests inadequate resuscitation or high O2 extraction. BIOMARKERS: lactate q2–4h until trending down; PCT at baseline and q48h for de-escalation guidance; BNP/proBNP for cardiac dysfunction assessment.",
      durationGuidance: {
        standard:
          "7–10 days for most sources with source control and clinical improvement; use PCT decline to guide shorter courses",
        severe:
          "14–21+ days for endocarditis, S. aureus bacteremia with seeding, bone/joint involvement, or persistent bacteremia",
        stewardshipNote:
          "Septic shock does NOT justify 14-day empiric antibiotics. Daily antibiotic time-out: assess de-escalation at every clinical review. Once organism and susceptibilities known — narrow immediately. Continuing broad-spectrum therapy drives resistance.",
      },
      empiricTherapy: [
        {
          line: "Immediate Broad-Spectrum Empiric — Septic Shock (Within 1 Hour)",
          options: [
            {
              drug: "vanco-meropenem",
              regimen:
                "Vancomycin IV (AUC-guided, 25–30 mg/kg loading dose) + Meropenem 2g IV q8h over 3h ± Micafungin 100mg IV q24h if Candida risk",
              notes:
                "SSC 2021 recommended combination for septic shock of unclear source or healthcare-associated. Covers MRSA (vanco), ESBL (mero), Pseudomonas (mero), anaerobes (mero). Add micafungin if Candida risk factors present (see criteria above). Administer vancomycin loading dose first (25–30 mg/kg IV over 1–2h) to achieve rapid therapeutic levels. De-escalate within 48–72h based on culture data.",
              evidence: "A-I",
              evidenceSource: "SSC 2021",
            },
          ],
        },
        {
          line: "Vasopressor and Adjunctive Therapy (Non-Antimicrobial — For Reference)",
          options: [
            {
              drug: "norepinephrine",
              regimen: "Norepinephrine 0.01–3 mcg/kg/min IV (first-line vasopressor; MAP target ≥65 mmHg)",
              notes:
                "SSC 2021 first-line vasopressor. Add vasopressin 0.03 units/min IV as vasopressor-sparing agent when NE >0.25 mcg/kg/min. Epinephrine as rescue third vasopressor. For refractory vasoplegic shock: hydrocortisone 200mg/day IV continuous infusion (ADRENAL trial: reduces vasopressor duration without clear 90-day mortality benefit). Angiotensin II (Giapreza) as salvage option for catecholamine-refractory shock. Target MAP ≥65 mmHg — higher targets (MAP 80–85) not beneficial except in chronic hypertension (SEPSISPAM trial).",
              evidence: "A-I",
              evidenceSource: "SSC 2021; SEPSISPAM Trial NEJM 2014",
            },
          ],
        },
      ],
      pearls: [
        "Hour-1 bundle: (1) Blood cultures ×2 before antibiotics. (2) Lactate — repeat if >2 mmol/L. (3) Broad-spectrum antibiotics within 1 hour. (4) 30 mL/kg IV balanced crystalloid for MAP <65 or lactate ≥4 mmol/L. (5) Vasopressors for MAP <65 mmHg unresponsive to fluids. EVERY HOUR OF DELAY IN ANTIBIOTICS = higher mortality.",
        "Vancomycin in septic shock — loading dose matters: Give 25–30 mg/kg IV over 1–2 hours to rapidly achieve therapeutic concentrations. Standard maintenance dosing without a loading dose takes 12–24h to reach target AUC — unacceptable in septic shock.",
        "Extended infusion antibiotics for septic shock: PIP-TAZO 4.5g IV over 4h q8h and MEROPENEM 2g IV over 3h q8h dramatically improve PD target attainment (T>MIC). Hemodynamically unstable patients have altered Vd and clearance — extended infusion compensates for pharmacokinetic variability.",
        "Source control is the antimicrobial adjuvant that works: Drainage of abscess, removal of infected catheter, debridement of necrotic tissue, resection of gangrenous bowel — these interventions reduce bacterial inoculum dramatically and improve antimicrobial efficacy. Source control within 6–12h of septic shock identification.",
        "Valproic acid interaction with carbapenems: Meropenem, imipenem, ertapenem, and doripenem reduce valproic acid levels by 60–100% within 24–48 hours. A patient with epilepsy on VPA who receives a carbapenem is at high risk for breakthrough seizures. Always check the full medication list before ordering carbapenems — switch VPA to levetiracetam or lacosamide if carbapenem is needed.",
        "Procalcitonin-guided de-escalation: PCT decline >80% from peak OR absolute PCT <0.5 ng/mL correlates with successful infection control. Use serial PCT to guide antibiotic discontinuation and prevent unnecessarily prolonged courses. PCT is less reliable for specific organisms (Legionella, viral infections, fungal infections — PCT may not rise).",
      ],
    },
  ],
  drugMonographs: [],
};

const SEPSIS_WORKFLOW_ENHANCEMENTS: Record<string, Partial<Subcategory>> = {
  "sepsis-community": {
    diagnosticWorkup: ready("Obtain cultures before antibiotics when feasible, identify the likely source fast, and pair the first-dose plan with lactate, organ dysfunction, and bedside source clues."),
    severitySignals: ready("Hypotension, rising lactate, altered mentation, oliguria, or rapidly worsening respiratory failure move this pathway toward shock-level urgency immediately."),
    mdroRiskFactors: ready("Recent hospitalization, prior resistant isolates, recent IV antibiotics, immunocompromise, and chronic devices are the main gates that justify broader-than-standard community coverage."),
    sourceControl: ready("Line removal, drainage, debridement, urinary decompression, and biliary or abdominal intervention are often the antimicrobial multiplier in sepsis care."),
    deEscalation: ready("At 48-72 hours, document the source, culture result, and active narrowing plan; broad empiric therapy without a timeout should be treated as a defect, not a default."),
    ivToPoPlan: ready("Switch to PO only after hemodynamic recovery, source control, improving organ function, and confirmation of a highly reliable oral option for the confirmed source."),
    failureEscalation: ready("Persistent instability should trigger re-search for source, resistant organism, or underdosed extended-infusion beta-lactam exposure before simply adding more drugs."),
    consultTriggers: ready("Escalate to source-specific specialists early and involve ID when bacteremia, resistant pathogens, or unclear source threatens appropriate narrowing."),
    durationAnchor: ready("Count from the first active regimen after source control is underway; bacteremia or ICU location alone should not dictate unnecessarily long courses."),
  },
  "sepsis-hcap": {
    diagnosticWorkup: ready("Review prior microbiology, recent antibiotics, devices, and healthcare exposures immediately because these drive empiric coverage more than syndrome labels."),
    severitySignals: ready("Shock, escalating vasopressor need, severe hypoxemia, or rapidly worsening organ dysfunction requires maximal PK/PD optimization from the first dose."),
    mdroRiskFactors: ready("This pathway exists for recent healthcare exposure, resistant-organism history, and device-heavy patients; use those factors to justify each additional empiric agent."),
    sourceControl: ready("Catheters, urinary obstruction, pressure injuries, post-operative collections, and ventilator-associated sources all need active source-control planning alongside antibiotics."),
    deEscalation: ready("Use cultures, MRSA screening, and source clarification at 48-72 hours to drop redundant MRSA or anti-pseudomonal therapy quickly."),
    ivToPoPlan: ready("PO completion is reasonable only once organ dysfunction is recovering, source control is stable, and an oral agent truly fits the confirmed pathogen/site."),
    failureEscalation: ready("Failure should prompt resistant-phenotype review, repeat cultures, dose/exposure review, and a fresh source-control search."),
    consultTriggers: ready("ID involvement is high yield whenever resistant gram-negatives, fungemia concern, or unresolved source-control questions remain."),
    durationAnchor: ready("Tie duration to the confirmed source plus timing of source control rather than the initial intensity of shock alone."),
  },
  "septic-shock": {
    diagnosticWorkup: ready("Culture first if it does not delay therapy, but antibiotic administration within the first hour and simultaneous source identification are the dominant priorities."),
    severitySignals: ready("This pathway is already the highest-severity state: vasopressors, lactate elevation despite fluids, and progressive organ failure should trigger full shock-dose thinking and ICU coordination."),
    mdroRiskFactors: ready("Prior resistant isolates, recent broad-spectrum exposure, prolonged healthcare contact, and source-specific MDR risk should shape the initial regimen before the second dose is due."),
    sourceControl: ready("The first day shock question is always: what needs to be drained, removed, debrided, or decompressed in the next 6-12 hours?"),
    deEscalation: ready("Even in shock, broad therapy needs a hard 48-hour timeout with culture review, source confirmation, and carbapenem/MRSA exit criteria documented."),
    ivToPoPlan: ready("Do not force early PO in ongoing shock; transition only after vasopressor liberation, organ recovery, and a clearly suitable oral agent for the proven source."),
    failureEscalation: ready("Persisting shock should trigger repeat cultures, source re-imaging, PK/PD review, and resistant-pathogen escalation only when the source and exposures justify it."),
    consultTriggers: ready("ID plus source-specific procedural teams are early partners here, not late rescue calls."),
    durationAnchor: ready("Once shock is controlled and source control is achieved, return to source-specific shortest-effective durations rather than automatically extending therapy because the presentation was dramatic."),
  },
};

const SEPSIS_MICROBIOLOGY_ENHANCEMENTS: Record<string, Partial<Subcategory>> = {
  "septic-shock": {
    rapidDiagnostics: [
      {
        trigger: "Rapid blood culture identification or source culture reveals ESBL, KPC, NDM, or another resistant gram-negative signal",
        action: "Narrow or escalate to the mechanism-appropriate beta-lactam immediately rather than waiting for the final susceptibility panel.",
        rationale: "In shock, the biggest microbiology win is shortening time spent on the wrong broad-spectrum regimen.",
      },
      {
        trigger: "MRSA screening and early culture data are negative for MRSA",
        action: "Remove empiric vancomycin promptly once the shock source and cultures point elsewhere.",
        rationale: "Septic shock often leads teams to keep anti-MRSA therapy simply because the patient was initially unstable.",
      },
    ],
    breakpointNotes: [
      {
        marker: "Beta-lactam susceptibility in shock",
        interpretation: "A susceptible report still depends on full septic-shock exposure, especially high-dose extended infusion for borderline gram-negative isolates.",
        action: "Correct infusion strategy and dosing before concluding that broader combination therapy is required.",
      },
      {
        marker: "Colonization or screening data",
        interpretation: "Positive surveillance cultures alone do not prove the current septic source or justify indefinite broad-spectrum continuation.",
        action: "Re-anchor the regimen to source cultures and the evolving bedside picture during the 48-hour timeout.",
      },
    ],
    intrinsicResistance: [
      {
        organism: "Enterococcus species",
        resistance: "Cephalosporins are intrinsically inactive against Enterococcus.",
        implication: "If the likely source is biliary, abdominal, or urinary with Enterococcal concern, do not assume ceftriaxone-based therapy is adequate.",
      },
      {
        organism: "Pseudomonas aeruginosa",
        resistance: "Ceftriaxone and ertapenem are not dependable antipseudomonal options in septic shock.",
        implication: "Use cefepime, pip-tazo, or meropenem only when the source and exposure history justify that level of gram-negative breadth.",
      },
    ],
    coverageMatrix: [
      {
        label: "Usual community urinary or abdominal gram-negatives",
        status: "active",
        detail: "Ceftriaxone-based or pip-tazo-based shock regimens remain appropriate when resistance risk is low and the source is clear.",
      },
      {
        label: "MRSA risk",
        status: "conditional",
        detail: "Use vancomycin only while skin, line, pneumonia, or prior-culture data make MRSA credible.",
      },
      {
        label: "ESBL or major healthcare resistance risk",
        status: "conditional",
        detail: "Meropenem becomes the cleaner anchor when resistant Enterobacterales are plausible.",
      },
      {
        label: "Empiric Candida coverage",
        status: "avoid",
        detail: "Do not add antifungals routinely unless the source, TPN, prior colonization burden, or host factors make invasive candidiasis credible.",
      },
    ],
  },
};

export const SEPSIS: DiseaseState = enhanceDiseaseEmpiricOptions(
  enhanceDisease(
    SEPSIS_BASE,
    mergeEnhancementMaps(SEPSIS_WORKFLOW_ENHANCEMENTS, SEPSIS_MICROBIOLOGY_ENHANCEMENTS),
  ),
  getEmpiricOptionEnhancementsForDisease("sepsis"),
);
