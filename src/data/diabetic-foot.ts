import type { DiseaseState } from "../types";

export const DIABETIC_FOOT: DiseaseState = {
  id: "diabetic-foot",
  name: "Diabetic Foot Infections",
  icon: "🦶",
  category: "Infectious Disease",
  overview: {
    definition: "Diabetic foot infections (DFI) are infections of soft tissue and/or bone in the foot of a patient with diabetes mellitus, typically arising from a neuropathic, ischemic, or neuroischemic ulcer. The IDSA/IWGDF 2023 guidelines classify DFI by severity: uninfected (Grade 1 — wound without clinical infection), mild (Grade 2 — superficial skin/subcutaneous tissue infection, ≤2cm perilesional erythema), moderate (Grade 3 — deeper soft tissue infection OR >2cm erythema OR systemic/metabolic stability preserved despite deep involvement), and severe (Grade 4 — DFI with ≥2 SIRS criteria: fever >38°C or <36°C, HR >90, RR >20, WBC >12,000 or <4,000 or >10% bands). DFI is distinct from other SSTIs because of the critical interplay between infection, peripheral neuropathy, peripheral arterial disease (PAD), and poor wound healing intrinsic to diabetes. Antibiotics treat infection — they do not heal wounds or improve vascular supply. Multidisciplinary care is mandatory.",
    epidemiology: "Diabetic foot complications are the leading cause of non-traumatic lower extremity amputation worldwide. Approximately 15-25% of people with diabetes will develop a foot ulcer during their lifetime. Of diabetic foot ulcers (DFUs), 50-60% become infected at some point. Infected DFUs account for up to 20% of diabetes-related hospitalizations in the US. DFI-related amputations carry a 5-year mortality of 50-70%, rivaling many malignancies. Osteomyelitis complicates 20-60% of moderate-severe DFIs and is the primary driver of amputation decisions. Healthcare costs for DFI exceed $9 billion annually in the US. Prevalence is increasing with the global diabetes epidemic.",
    keyGuidelines: [
      { name: "IDSA/IWGDF 2023 Diabetic Foot Infection Guidelines", detail: "The most current and comprehensive guideline for DFI management, jointly published by the Infectious Diseases Society of America and the International Working Group on the Diabetic Foot. Key updates from prior versions: (1) Endorsement of shorter antibiotic courses for soft tissue DFI (1-2 weeks mild, 2-3 weeks moderate-severe); (2) Post-resection osteomyelitis antibiotic courses as short as 5 days if clean bone margins confirmed; (3) Strong emphasis on bone biopsy for osteomyelitis diagnosis and culture-directed therapy; (4) MRI as gold-standard imaging for suspected osteomyelitis; (5) Multidisciplinary foot care team recommended as standard of care; (6) OPAT and oral step-down (OVIVA principles) explicitly endorsed for appropriate candidates. Evidence graded A-I through C-III." },
      { name: "IWGDF 2023 Wound Classification Guidelines", detail: "The IWGDF provides the foundational wound classification system used to stratify DFI severity. The SINBAD score (Site, Ischemia, Neuropathy, Bacterial infection, Area, Depth) and the WIFi classification (Wound, Ischemia, Foot Infection) are recommended for systematic wound assessment. These classifications predict amputation risk, guide surgical decision-making, and inform antibiotic duration. The Wound, Ischemia, and Foot Infection (WIFi) threat level (very low, low, moderate, high) drives the vascular and surgical intervention pathway." },
      { name: "Wagner Wound Classification (1981, widely used)", detail: "The Wagner grading system classifies diabetic foot wounds by depth and tissue involvement: Grade 0 (intact skin, but at risk), Grade 1 (superficial ulcer — dermis only), Grade 2 (deep ulcer — to tendon/capsule/bone without abscess), Grade 3 (deep ulcer with abscess, osteomyelitis, or joint sepsis), Grade 4 (gangrene of part of foot), Grade 5 (gangrene of whole foot). Wagner Grade 3 and above have the highest amputation risk and require aggressive surgical and antibiotic management." },
      { name: "University of Texas (UT) Wound Classification System", detail: "A 2-dimensional classification system combining wound depth (Grades 0-III) with presence/absence of infection (stage A — no infection/ischemia, B — infection only, C — ischemia only, D — infection + ischemia). UT Grade IIID (full-thickness wound + osteomyelitis/joint infection + ischemia) has the highest amputation risk (~90%). The UT system is more predictive of outcomes than the Wagner system and is recommended by IWGDF 2023." },
      { name: "OVIVA Trial (Li et al., NEJM 2019)", detail: "Landmark RCT demonstrating oral antibiotics are non-inferior to IV antibiotics for bone and joint infections including osteomyelitis. Treatment failure: 14.6% (oral) vs 14.8% (IV). Established the principle of early oral step-down as acceptable for osteomyelitis when appropriate high-bioavailability agents are used. Directly applicable to DFI osteomyelitis management per IDSA/IWGDF 2023." },
    ],
    landmarkTrials: [
      { name: "OVIVA Trial (Li et al., NEJM 2019)", detail: "1,054 patients with bone and joint infections randomized to oral vs. continued IV antibiotics after ≤7 days of IV therapy. Primary outcome (treatment failure at 1 year): 14.6% oral vs 14.8% IV — non-inferior. Oral step-down included fluoroquinolones, linezolid, TMP-SMX, rifampin combinations, and clindamycin. NOT amoxicillin or cephalexin alone. This trial changed the landscape: routine 6-week IV therapy via PICC is no longer required for osteomyelitis, including DFI-related osteomyelitis. Key caveats: the RIGHT oral agents must be selected (high bioavailability + bone penetration)." },
      { name: "Ertapenem vs Pip-Tazo for DFI — Lipsky et al. (2005, Clin Infect Dis)", detail: "Multicenter RCT of ertapenem (1g IV once daily) vs. piperacillin-tazobactam (3.375g IV q6h) for moderate-severe DFI. Clinical success rates were equivalent (~75% per arm). Ertapenem's once-daily dosing was associated with fewer complications and was deemed more convenient for OPAT. Established ertapenem as a first-line option for moderate DFI and OPAT step-down (with caveats — no Pseudomonas or MRSA coverage)." },
      { name: "IDSA Post-Op Osteomyelitis Duration Study — Ha Van et al. (2003)", detail: "Prospective cohort showing that for DFI osteomyelitis with complete surgical resection of all infected bone (confirmed histologically), a median antibiotic course of only 5-7 days post-operatively was associated with >90% remission at 1 year. This landmark observation shifted practice dramatically — adequate surgical resection substantially reduces antibiotic duration requirements. Endorsed by IDSA/IWGDF 2023." },
      { name: "Probe-to-Bone Test — Lavery et al. Validation Cohort", detail: "In patients with high pre-test probability (clinic population with DFI), the probe-to-bone (PTB) test has PPV of 89% for osteomyelitis. In patients with lower pre-test probability (ED population), PPV drops to ~53%. Sensitivity 66%, specificity 85% overall. The PTB test is recommended by IDSA/IWGDF 2023 as the primary bedside screening tool for DFI osteomyelitis. Takes 30 seconds. Positive PTB in a patient with a chronic DFU should prompt MRI and bone biopsy." },
      { name: "Conservative vs Surgical Management of DFI Osteomyelitis — Lazaro-Martinez et al. (2014)", detail: "RCT comparing primary surgical resection vs. medical-only antibiotic treatment for DFI forefoot osteomyelitis. Surgical group: 78% remission at 1 year. Medical group: 68% remission. Both acceptable; surgical group had shorter antibiotic duration (4 vs. 15 weeks). The study validated the medical-only approach as legitimate for selected patients — not every DFI osteomyelitis requires amputation. Patient selection (adequate vascularity, non-MDR organism, compliant patient) is critical." },
      { name: "IDSA 2023 Duration Analysis — Soft Tissue DFI", detail: "IDSA/IWGDF 2023 conducted systematic review of antibiotic duration for soft tissue DFI. Conclusion: 1-2 weeks for mild DFI (5-7 days often sufficient) and 2-3 weeks for moderate-severe soft tissue DFI are adequate when infection has clinically resolved. Longer courses do not improve outcomes and increase adverse events. The key concept: treat the INFECTION, not the WOUND — antibiotics should stop when infection signs resolve, not when the ulcer heals." },
    ],
    riskFactors: "HOST FACTORS: Diabetes mellitus (particularly poorly controlled, HbA1c >9%), peripheral neuropathy (loss of protective sensation — the ulcer goes unfelt), peripheral arterial disease (ABI <0.9 — ischemia impairs healing and antibiotic delivery), retinopathy and nephropathy (markers of microvascular disease), obesity (BMI >30), immunosuppression (steroids, transplant medications, HIV), ESRD/dialysis (impaired immune response + altered drug pharmacokinetics), prior foot ulcer or amputation (scar tissue, altered biomechanics). INFECTION RISK FACTORS: Wound chronicity (>30 days — increased biofilm, polymicrobial flora), wound depth (penetrating to fascia/tendon/bone), wound size (>2cm), prior antibiotic exposure (predisposes to MDR organisms), prior hospitalization (healthcare-associated flora — MRSA, MDR gram-negatives), prior MRSA colonization or infection, living in a nursing facility, prior osteomyelitis. MRSA-SPECIFIC RISK FACTORS: Prior MRSA infection/colonization, hospitalization or nursing home residence within 90 days, local MRSA prevalence >30%, injection drug use, contact with MRSA-colonized individual, prior MRSA-positive wound culture. PSEUDOMONAS-SPECIFIC RISK FACTORS: Macerated or water-exposed wounds (swimming, soaking, hydrotherapy), warm/tropical climates, prior fluoroquinolone exposure, prior Pseudomonas infection, recent hospitalization (particularly ICU), immunocompromised state. ANAEROBIC/POLYMICROBIAL RISK FACTORS: Necrotic tissue, fetid odor, gas in soft tissue on imaging, chronic deep wound, prior broad-spectrum antibiotic exposure.",
  },
  subcategories: [
    {
      id: "mild-dfi",
      name: "Mild Diabetic Foot Infection",
      definition: "IDSA/IWGDF 2023 Grade 2 (Mild): Infection involving only the skin and subcutaneous tissue, with perilesional erythema ≤2cm from the wound edge. No deeper tissue involvement (fascia, muscle, tendon, joint, or bone). No systemic signs of infection (afebrile, hemodynamically stable, no leukocytosis, no metabolic derangement). Primarily caused by gram-positive cocci — Staphylococcus aureus and beta-hemolytic Streptococci. MRSA is less common in mild, antibiotic-naive DFI but should be considered if risk factors present. Gram-negative and anaerobic coverage generally NOT required for mild DFI.",
      clinicalPresentation: "Superficial ulcer (typically neuropathic, plantar location, callus surrounding) with surrounding erythema ≤2cm, warmth, tenderness (may be muted due to peripheral neuropathy), or induration. Purulent drainage may be present. NO fever, NO tachycardia, NO hypotension. Patient ambulatory and not systemically ill. Erythema confined to within 2cm of wound margins. No lymphangitis, no fluctuance suggesting deeper abscess, no crepitus. Key examination: probe the wound with a sterile blunt probe to assess depth and assess for probe-to-bone positivity (PTB positive in mild DFI is unusual but should trigger upgraded classification if confirmed). Check for surrounding skin breakdown, interdigital maceration (entry point for organisms), and tinea pedis.",
      diagnostics: "CLINICAL DIAGNOSIS — mild DFI is primarily diagnosed by clinical criteria. Deep wound culture: obtain by curettage of the ulcer base or punch biopsy AFTER debridement of overlying necrotic/callus tissue (superficial swabs grow colonizers, not pathogens — avoid). Imaging: plain radiographs of the foot (baseline — rule out cortical erosion suggesting osteomyelitis, gas in soft tissue, foreign body). If PTB test is positive or if concern for deeper involvement exists despite 'mild' clinical presentation: obtain MRI. Labs: CBC (WBC typically normal in mild DFI — leukocytosis should prompt reclassification to moderate-severe), CRP, ESR (baseline for tracking), blood glucose (poor glycemic control impairs healing). Blood cultures NOT routinely needed for mild DFI. If osteomyelitis is suspected, do NOT be reassured by normal plain radiographs — bone changes take 2-3 weeks to appear radiographically.",
      durationGuidance: {
        standard: "5–7 days (mild, antibiotic-naive, resolving infection)",
        severe: "Up to 14 days if slow clinical response or broader wound involvement",
        stewardshipNote: "IDSA/IWGDF 2023: Mild DFI often requires only 5-7 days of antibiotics. The goal is to treat the INFECTION — antibiotics should stop when clinical signs of infection resolve (erythema receding, purulence resolving, wound improving), NOT when the ulcer heals. Prolonging antibiotics beyond infection resolution to 'help healing' is a common stewardship target. Wounds heal through local wound care, offloading, and vascular optimization — not prolonged antibiotics.",
      },
      empiricTherapy: [
        {
          line: "First-Line — Mild DFI, No MRSA Risk, Outpatient Oral",
          options: [
            {
              drug: "amox-clav-mild-dfi",
              regimen: "Amoxicillin-clavulanate 875/125mg PO BID × 5-7 days",
              notes: "IDSA/IWGDF 2023 first-line for mild DFI. Covers gram-positive cocci (Streptococci, MSSA), some gram-negatives (E. coli, Klebsiella — less relevant in mild DFI), and anaerobes. The beta-lactamase inhibitor component (clavulanate) extends coverage to MSSA and anaerobes. BID dosing improves adherence over TID regimens. Avoid if penicillin allergy. GI tolerability: take with food to reduce nausea/diarrhea from clavulanate. Do NOT use if MRSA risk factors present.",
              evidence: "A-I",
              evidenceSource: "IDSA/IWGDF 2023",
            },
            {
              drug: "cephalexin-mild-dfi",
              regimen: "Cephalexin 500mg PO QID (or 1000mg PO BID) × 5-7 days",
              notes: "Reasonable first-line alternative for mild, acute DFI in antibiotic-naive patients. Covers Streptococci and MSSA. No anaerobic or MRSA coverage. BID high-dose regimen (1g BID) achieves comparable T>MIC to QID dosing and dramatically improves adherence — many ID pharmacists now prefer 1g BID. Use when the wound is acute, superficial, and likely monomicrobial gram-positive etiology. De-escalation target if cultures confirm MSSA.",
              evidence: "A-II",
              evidenceSource: "IDSA/IWGDF 2023",
            },
            {
              drug: "clindamycin-mild-dfi",
              regimen: "Clindamycin 300-450mg PO TID × 5-7 days",
              notes: "Alternative for penicillin-allergic patients. Covers Streptococci, MSSA, and most CA-MRSA (check local susceptibility — clindamycin resistance rising to 15-25% in some areas). D-test required if erythromycin-resistant isolate is clindamycin-susceptible (inducible resistance via erm gene — will fail clinically despite in vitro susceptibility). Also covers anaerobes — useful for wounds with any necrotic component. Higher C. diff risk than beta-lactams.",
              evidence: "B-II",
              evidenceSource: "IDSA/IWGDF 2023",
            },
          ],
        },
        {
          line: "First-Line — Mild DFI WITH MRSA Risk Factors, Outpatient Oral",
          options: [
            {
              drug: "tmp-smx-mild-dfi",
              regimen: "TMP-SMX DS (160/800mg) 1-2 tablets PO BID × 5-7 days",
              notes: "Add to mild DFI regimen when MRSA risk factors present (prior MRSA, nursing home resident, prior hospitalization, known MRSA contact, local MRSA prevalence >30%). Excellent CA-MRSA activity (>95% susceptible). IMPORTANT LIMITATION: TMP-SMX has poor Streptococcal coverage — for mild DFI with surrounding cellulitis, consider adding amoxicillin or cephalexin to address the Streptococcal gap. Renally adjust for CrCl <30 mL/min (avoid or reduce dose). Monitor potassium (amiloride-like potassium-sparing effect — risk of hyperkalemia with ACE/ARB, common in diabetics).",
              evidence: "A-II",
              evidenceSource: "IDSA/IWGDF 2023",
            },
            {
              drug: "doxycycline-mild-dfi",
              regimen: "Doxycycline 100mg PO BID × 5-7 days",
              notes: "Alternative for MRSA-risk mild DFI, especially when TMP-SMX is not tolerated or contraindicated. CA-MRSA susceptibility >95%. BID dosing. Same Streptococcal gap as TMP-SMX — pair with amoxicillin if significant surrounding cellulitis. Photosensitivity risk (counsel patient to use sunscreen). Take with full glass of water upright to prevent esophageal ulceration. No renal dose adjustment required (unlike TMP-SMX).",
              evidence: "B-II",
              evidenceSource: "IDSA/IWGDF 2023",
            },
          ],
        },
        {
          line: "Penicillin Allergy Alternatives (Non-Anaphylactic History)",
          options: [
            {
              drug: "clindamycin-pen-allergy-mild",
              regimen: "Clindamycin 300mg PO TID × 5-7 days",
              notes: "For mild DFI with non-severe penicillin allergy. Covers gram-positives + anaerobes. Check D-test. For confirmed anaphylactic penicillin allergy, cross-reactivity with cephalosporins is <2% for dissimilar side chains — many ID pharmacists advocate for cephalosporins even in documented penicillin allergy (discuss with prescriber/patient). Azithromycin is NOT recommended for DFI — poor Staphylococcal activity.",
              evidence: "B-II",
              evidenceSource: "IDSA/IWGDF 2023",
            },
          ],
        },
      ],
      organismSpecific: [
        {
          organism: "S. aureus (MSSA) — most common in mild DFI",
          preferred: "Cephalexin 500-1000mg PO BID-QID, dicloxacillin 500mg PO QID, amoxicillin-clavulanate 875/125mg PO BID",
          alternative: "Clindamycin 300mg PO TID (if susceptible, D-test negative); TMP-SMX DS BID (limited Streptococcal coverage)",
          notes: "MSSA is the dominant pathogen in mild, acute DFI in antibiotic-naive patients. Definitive therapy with a narrow anti-staphylococcal agent (cephalexin, dicloxacillin) is preferred over broad-spectrum when MSSA is confirmed. De-escalate from amoxicillin-clavulanate to cephalexin when MSSA confirmed on culture. Dicloxacillin requires empty stomach (1h before or 2h after meals) — poor adherence in practice.",
        },
        {
          organism: "Beta-Hemolytic Streptococci (Group A, B, C, G)",
          preferred: "Amoxicillin 500mg PO TID, cephalexin 500mg PO QID, amoxicillin-clavulanate 875/125mg PO BID",
          alternative: "Clindamycin 300mg PO TID; penicillin VK 500mg PO QID",
          notes: "Group A Strep (S. pyogenes) and Group B Strep (S. agalactiae) are common in DFI cellulitis, particularly in older diabetics. ALL beta-hemolytic streptococci are universally penicillin-susceptible — narrow to penicillin or amoxicillin when confirmed. TMP-SMX has POOR Streptococcal coverage — do NOT use as sole agent if Streptococci suspected.",
        },
        {
          organism: "MRSA — mild DFI with risk factors",
          preferred: "TMP-SMX DS 1-2 tabs PO BID, doxycycline 100mg PO BID",
          alternative: "Clindamycin 300-450mg PO TID (if susceptible and D-test negative)",
          notes: "MRSA is NOT the expected pathogen in mild, antibiotic-naive DFI. However, when risk factors are present (prior MRSA, recent hospitalization, nursing home residence), empiric MRSA coverage is warranted. CA-MRSA (USA300) susceptibility: TMP-SMX >95%, doxycycline >95%, clindamycin variable (15-25% resistance in some US cities). For mild DFI, IV vancomycin is NOT needed — oral agents are equivalent.",
        },
      ],
      pearls: [
        "The 2cm erythema boundary is a clinical anchor, not an absolute rule: The IDSA/IWGDF definition of mild DFI uses ≤2cm perilesional erythema as the boundary between mild and moderate. However, this is a guideline — erythema that is clearly superficial, non-spreading, and in an otherwise well patient can still be treated as mild even if marginally >2cm. Clinical context (is the patient sick? is the infection spreading?) matters more than measuring with a ruler.",
        "Mark the borders immediately with a skin marker: Border marking with a pen and timestamp (and ideally a photo in the medical record) is the single most useful tool for tracking DFI progression. Erythema that expands beyond the border despite 24-48 hours of antibiotics means the infection is worsening or the organism is resistant — do NOT wait for 72 hours to reassess in mild DFI. Reassess at 48h and upgrade classification if not improving.",
        "Wound cultures in mild DFI: obtain DEEP cultures from the wound base by curettage — do NOT swab the surface. Surface swabs in chronic DFI grow colonizers (Pseudomonas, Corynebacterium, mixed flora) that do not represent the infecting pathogen. Deep curettage or punch biopsy after debridement cultures the true pathogen. This distinction is critical for guiding targeted therapy.",
        "The Streptococcal gap of TMP-SMX and doxycycline: Both excellent oral MRSA agents have unreliable Streptococcal coverage. For mild DFI with significant surrounding cellulitis (which is predominantly Streptococcal in etiology), using TMP-SMX or doxycycline alone leaves a real gap. Consider adding amoxicillin 500mg TID or cephalexin 500mg QID to address the Streptococcal component. This combination covers both MRSA and Streptococci.",
        "Glycemic control is a therapeutic intervention: Hyperglycemia (glucose >200 mg/dL chronically) impairs neutrophil chemotaxis, phagocytosis, and reactive oxygen species generation. Optimizing blood glucose is a legitimate adjunct to antibiotic therapy and improves outcomes. A pharmacist rounding with the ID team should flag persistently elevated glucoses and communicate with the endocrinology team.",
        "Offloading is non-negotiable: No antibiotic can heal a neuropathic ulcer that continues to receive repetitive pressure loading. Total contact casting (TCC) is the gold standard for offloading plantar neuropathic ulcers. If the patient refuses or is non-compliant with offloading, antibiotic therapy will fail regardless of agent selection. This is a wound care intervention, not an antibiotic failure.",
        "Probe-to-bone test in mild DFI: A positive PTB in a patient classified as mild DFI should trigger immediate reconsideration and MRI imaging. If PTB is positive, the infection is almost certainly deeper than mild — reclassify and obtain imaging. The PTB test takes 30 seconds and should be performed on every DFI evaluation.",
      ],
    },
    {
      id: "moderate-dfi",
      name: "Moderate Diabetic Foot Infection",
      definition: "IDSA/IWGDF 2023 Grade 3 (Moderate): Infection extending deeper than the skin/subcutaneous tissue — involving fascia, muscle, tendon, joint, or bone — OR perilesional erythema >2cm from wound edge, OR lymphangitis, in a patient WITHOUT systemic signs of infection (no fever, hemodynamically stable, no metabolic derangement). This category encompasses a broad clinical spectrum: from cellulitis >2cm (no deep tissue involvement) to frank osteomyelitis without systemic compromise. Microbiology is more complex than mild DFI — polymicrobial infections are the norm in chronic wounds. Gram-positive cocci (S. aureus, Streptococci) remain important, but gram-negative rods (E. coli, Klebsiella, Proteus) and anaerobes are frequently co-pathogens in chronic, deep moderate DFI.",
      clinicalPresentation: "Ulcer with erythema extending >2cm from wound edge, OR lymphangitis (linear red streaking proximal to wound), OR clinical evidence of deeper tissue involvement (fascia, tendon, muscle palpable or visible in wound, joint capsule visible). Positive probe-to-bone test suggests osteomyelitis (upgrade classification and obtain MRI). Sausage toe (diffuse fusiform swelling of a digit) is pathognomonic for phalangeal osteomyelitis. Patient is ambulatory and not systemically ill — no fever, HR <90, hemodynamically stable. Purulent drainage, fetid odor (suggests anaerobic involvement), or necrotic tissue in wound base are common. Wagner Grade 2-3 correlates with moderate DFI.",
      diagnostics: "Deep wound culture (curettage or biopsy of wound base, NOT swab): essential for culture-directed de-escalation. Probe-to-bone test: perform on every moderate DFI — positive PTB warrants MRI. Plain radiographs of foot: obtain as baseline (cortical erosion, periosteal reaction, gas in soft tissue). MRI foot with and without gadolinium: gold standard if osteomyelitis suspected (sensitivity 90%, specificity 80%). Do NOT delay MRI — bone destruction is not reversible. ESR (>70 mm/h has high specificity for osteomyelitis in DFI context) and CRP (excellent for trending treatment response — check at baseline and every 1-2 weeks). CBC with differential (WBC should be normal or mildly elevated in moderate DFI without systemic signs — leukocytosis >12,000 should trigger reclassification). BMP (renal function for antibiotic dosing, electrolytes, glucose — poor glycemic control impairs healing). Blood cultures: obtain for moderate DFI requiring IV therapy, particularly if fever or hemodynamic instability develops. Bone biopsy: the gold standard for definitive osteomyelitis diagnosis and culture — pursue whenever feasible, ideally before starting antibiotics. Vascular assessment: ABI and toe pressures if PAD suspected — critical before attributing treatment failure to antibiotic inadequacy.",
      durationGuidance: {
        standard: "2–3 weeks (soft tissue only, clinically resolving)",
        severe: "4–6 weeks (with confirmed osteomyelitis, medical management)",
        opatNote: "OPAT is frequently used for moderate DFI requiring IV therapy. Once-daily ertapenem is the preferred OPAT agent (no Pseudomonas or MRSA coverage — ensure cultures don't require those). Add daptomycin or vancomycin via OPAT if MRSA confirmed. IV-to-PO switch should be pursued as soon as clinically feasible using high-bioavailability agents (fluoroquinolones, TMP-SMX, linezolid, clindamycin).",
        stewardshipNote: "OVIVA trial 2019: Oral antibiotics non-inferior to IV for bone/joint infections including osteomyelitis. Consider early oral step-down with: ciprofloxacin or levofloxacin (gram-negatives, moderate Pseudomonas activity), TMP-SMX DS (MRSA, gram-positives), clindamycin (gram-positives, anaerobes), or linezolid (MRSA, gram-positives with excellent bone penetration). Fluoroquinolones have the best bioavailability (~100%) and bone penetration — preferred for gram-negative osteomyelitis step-down. The key question before oral step-down: is the gut absorbing? If patient has gastroparesis (common in long-standing diabetes), oral absorption may be unreliable.",
      },
      empiricTherapy: [
        {
          line: "First-Line — Moderate DFI, Oral Candidate (No IV Required)",
          options: [
            {
              drug: "amox-clav-moderate-oral",
              regimen: "Amoxicillin-clavulanate 875/125mg PO BID × 2-3 weeks",
              notes: "Appropriate for moderate DFI with erythema >2cm but no deep tissue involvement, ambulatory patient, reliable GI absorption, no MRSA risk, no Pseudomonas risk. Covers MSSA, Streptococci, most Enterobacterales, and anaerobes. Add TMP-SMX or doxycycline if MRSA risk present. Duration: 2 weeks for soft tissue only; extend to 3 weeks if slow response. Reassess clinically at 72 hours.",
              evidence: "A-II",
              evidenceSource: "IDSA/IWGDF 2023",
            },
            {
              drug: "clinda-cipro-moderate-oral",
              regimen: "Clindamycin 300-450mg PO TID + Ciprofloxacin 500mg PO BID × 2-3 weeks",
              notes: "Alternative oral combination for moderate DFI with MRSA risk or deeper wound features. Clindamycin: covers MSSA, most CA-MRSA, Streptococci, and anaerobes. Ciprofloxacin: covers gram-negatives including moderate Pseudomonas activity. Together: comprehensive polymicrobial coverage without IV therapy. Check D-test for clindamycin if erythromycin-resistant isolate. This combination is especially useful for chronic wounds where gram-negatives are likely co-pathogens.",
              evidence: "B-II",
              evidenceSource: "IDSA/IWGDF 2023",
            },
          ],
        },
        {
          line: "First-Line — Moderate DFI, IV Required (Hospitalized or OPAT)",
          options: [
            {
              drug: "ertapenem-moderate-iv",
              regimen: "Ertapenem 1g IV q24h ± Vancomycin IV (AUC/MIC 400-600) if MRSA risk",
              notes: "IDSA/IWGDF preferred IV regimen for moderate DFI requiring hospitalization. Ertapenem provides: MSSA, Streptococci, Enterobacterales (including most ESBL producers), and anaerobic coverage. Once-daily dosing is ideal for OPAT. CRITICAL GAPS: NO Pseudomonas aeruginosa coverage, NO MRSA coverage. Add vancomycin if MRSA risk factors present. Substitute pip-tazo or meropenem if Pseudomonas risk exists (macerated wound, hydrotherapy, prior Pseudomonas, tropical exposure). Ertapenem is renally eliminated — dose-adjust for CrCl <30 mL/min (500mg q24h).",
              evidence: "A-I",
              evidenceSource: "IDSA/IWGDF 2023",
            },
            {
              drug: "pip-tazo-moderate-iv",
              regimen: "Piperacillin-tazobactam 4.5g IV q6h (extended infusion over 4h) ± Vancomycin IV",
              notes: "Alternative to ertapenem for moderate DFI when Pseudomonas coverage is needed (macerated wound, water exposure, prior Pseudomonas cultures). Pip-tazo covers MSSA, Streptococci, Enterobacterales, Pseudomonas aeruginosa, and anaerobes. Extended infusion (4-hour infusion q6h) optimizes T>MIC PK/PD target and is strongly preferred by ID pharmacists. Add vancomycin for MRSA coverage. De-escalate based on cultures — if Pseudomonas not recovered, step down to ertapenem or oral agents.",
              evidence: "A-II",
              evidenceSource: "IDSA/IWGDF 2023",
            },
            {
              drug: "cefazolin-moderate-iv",
              regimen: "Cefazolin 2g IV q8h (soft tissue, low-risk, no deep involvement) ± add anaerobic coverage (metronidazole 500mg IV q8h) if necrotic wound",
              notes: "Acceptable for moderate DFI with primarily gram-positive etiology (early infection, no chronic wound features, no gram-negative risk). Cefazolin covers MSSA and Streptococci. No MRSA, no Pseudomonas, limited anaerobic coverage. Add metronidazole 500mg IV/PO q8h if necrotic wound or fetid discharge. Add vancomycin if MRSA risk. This narrow regimen is appropriate only for selected moderate DFI — do NOT use for chronic deep wounds without culture data.",
              evidence: "B-II",
              evidenceSource: "IDSA/IWGDF 2023",
            },
          ],
        },
        {
          line: "MRSA Coverage — Add When Risk Factors Present",
          options: [
            {
              drug: "vancomycin-moderate-mrsa",
              regimen: "Vancomycin IV (AUC/MIC-guided, target AUC/MIC 400-600) — add to gram-negative backbone",
              notes: "Add vancomycin to ertapenem or pip-tazo backbone when MRSA risk factors are present: prior MRSA, recent hospitalization/nursing home, local MRSA prevalence >30%, prior wound culture showing MRSA, IV drug use. AUC-guided dosing is the 2020 ASHP/IDSA/SIDP consensus standard — Bayesian dosing software strongly preferred over trough-only monitoring. De-escalate to targeted oral agent (TMP-SMX, doxycycline, linezolid) as soon as patient is clinically stable and GI absorption reliable.",
              evidence: "A-I",
              evidenceSource: "IDSA/IWGDF 2023",
            },
            {
              drug: "daptomycin-moderate-mrsa",
              regimen: "Daptomycin 6 mg/kg IV q24h — alternative to vancomycin for MRSA, particularly in renal impairment or vancomycin intolerance",
              notes: "Alternative MRSA coverage agent. Once-daily dosing (OPAT-friendly). Rapidly bactericidal. Do NOT use for pulmonary infections (inactivated by surfactant). Monitor CPK weekly — myopathy risk, especially with concurrent statin use. Daptomycin may be preferred over vancomycin for DFI when: vancomycin AUC-guided dosing not available, prior vancomycin-associated nephrotoxicity, vancomycin MIC creep (vancomycin MIC ≥2 µg/mL), or in patients with baseline renal impairment where vancomycin toxicity risk is elevated.",
              evidence: "B-II",
              evidenceSource: "IDSA/IWGDF 2023",
            },
          ],
        },
        {
          line: "Oral Step-Down (IV to PO) — After Clinical Stabilization",
          options: [
            {
              drug: "cipro-moderate-step-down",
              regimen: "Ciprofloxacin 500-750mg PO BID (gram-negative coverage, Pseudomonas if susceptible)",
              notes: "Excellent PO bioavailability (~80%). Best oral option for gram-negative osteomyelitis step-down (OVIVA data). Does NOT cover MRSA or anaerobes. Pair with TMP-SMX or doxycycline if MRSA step-down needed. Fluoroquinolone cautions: FDA boxed warning (tendinopathy, peripheral neuropathy, CNS effects — particularly relevant in diabetics who already have peripheral neuropathy). Avoid if prior fluoroquinolone exposure within 90 days (resistance risk). Check fluoroquinolone susceptibility on culture before using for step-down.",
              evidence: "A-II",
              evidenceSource: "IDSA/IWGDF 2023",
            },
            {
              drug: "tmp-smx-moderate-step-down",
              regimen: "TMP-SMX DS 1-2 tablets PO BID (MRSA, gram-positive step-down)",
              notes: "Excellent oral MRSA agent with good soft tissue and bone penetration. Renally eliminated — adjust for CrCl <30 mL/min (avoid or reduce dose to 1 DS tab BID). Hyperkalemia risk — monitor K at day 3-5, especially in patients on ACE/ARBs (nearly universal in diabetic patients with nephropathy). False creatinine rise: TMP blocks tubular creatinine secretion — creatinine will rise without true GFR decline; monitor cystatin C or clinical assessment rather than stopping TMP-SMX for this reason.",
              evidence: "B-II",
              evidenceSource: "IDSA/IWGDF 2023",
            },
            {
              drug: "linezolid-moderate-step-down",
              regimen: "Linezolid 600mg PO/IV BID (MRSA, gram-positive, excellent bone penetration)",
              notes: "100% oral bioavailability — oral equals IV in bone/tissue concentrations. Excellent for MRSA step-down with bone penetration superior to most alternatives. Limitations: cost (expensive, especially without PA approval), myelosuppression (CBC weekly — thrombocytopenia and anemia risk if >14 days, more common in renal impairment), serotonin syndrome risk (avoid with serotonergic drugs: SSRIs, SNRIs, MAOIs, tramadol), lactic acidosis with prolonged use (mitochondrial toxicity). Reserve for confirmed MRSA soft tissue/bone infection when TMP-SMX not tolerated or contraindicated. Limit duration <6 weeks when possible.",
              evidence: "B-II",
              evidenceSource: "IDSA/IWGDF 2023",
            },
          ],
        },
      ],
      organismSpecific: [
        {
          organism: "S. aureus (MSSA) — common in moderate DFI",
          preferred: "Cefazolin 2g IV q8h (IV); cephalexin 1000mg PO BID or dicloxacillin 500mg PO QID (oral step-down); amoxicillin-clavulanate 875/125mg PO BID (outpatient)",
          alternative: "Nafcillin or oxacillin 2g IV q4h (superior bactericidal activity vs. cefazolin — use if concurrent bacteremia); clindamycin PO/IV if susceptible",
          notes: "De-escalate from vancomycin to cefazolin (or nafcillin for bacteremia) as soon as MSSA is confirmed — this is one of the highest-yield stewardship interventions. Cefazolin is preferred over nafcillin in most DFI cases due to simplified dosing (q8h vs q4h), less phlebitis, and equivalent outcomes for non-bacteremic infections. For MSSA bacteremia from DFI, obtain echocardiogram and consult ID.",
        },
        {
          organism: "S. aureus (MRSA) — moderate DFI with risk factors",
          preferred: "Vancomycin IV (AUC/MIC-guided) [inpatient]; TMP-SMX DS 1-2 tabs PO BID [outpatient or step-down]; daptomycin 6 mg/kg IV q24h [OPAT alternative]",
          alternative: "Linezolid 600mg IV/PO BID; clindamycin PO (if susceptible, D-test negative); doxycycline 100mg PO BID (if susceptible)",
          notes: "MRSA osteomyelitis from DFI: IV vancomycin preferred initial therapy; oral step-down per OVIVA to TMP-SMX DS or linezolid after initial IV stabilization. Vancomycin MIC ≥2 µg/mL (vancomycin-intermediate S. aureus — VISA): use daptomycin or ceftaroline as alternatives — consult ID.",
        },
        {
          organism: "Beta-Hemolytic Streptococci (Group B — S. agalactiae most common in diabetics)",
          preferred: "Ceftriaxone 2g IV q24h (IV); amoxicillin 1g PO TID or cephalexin 500mg PO QID (oral)",
          alternative: "Penicillin G 3-4 MU IV q4h (bacteremia); clindamycin (if penicillin allergy and susceptible)",
          notes: "Group B Strep (S. agalactiae) is particularly prevalent in moderate DFI in elderly diabetic patients, often originating from urinary tract colonization. All beta-hemolytic streptococci are universally penicillin-susceptible. Narrow to penicillin or amoxicillin when Streptococcus is the sole or dominant pathogen on bone/deep tissue culture.",
        },
        {
          organism: "Enterobacterales (E. coli, Klebsiella, Proteus, Morganella) — moderate DFI, chronic wounds",
          preferred: "Ertapenem 1g IV q24h (ESBL or broad coverage); ceftriaxone 2g IV q24h (if susceptible, non-ESBL); ciprofloxacin 500mg PO BID (oral, if susceptible)",
          alternative: "Cefepime 2g IV q8h (non-ESBL, Pseudomonas coverage not needed); pip-tazo 4.5g IV q6h",
          notes: "Gram-negatives are co-pathogens in moderate-severe DFI, particularly in chronic wounds >4 weeks or those with prior antibiotic exposure. Check ESBL status (E. coli and Klebsiella ESBL is increasingly prevalent — 15-30% in some US centers). ESBL producers: treat with ertapenem (preferred OPAT agent) or meropenem (severe). Fluoroquinolone oral step-down for gram-negative bone/soft tissue infections — verify susceptibility. Proteus mirabilis is intrinsically resistant to nitrofurantoin and is a common co-pathogen — confirm resistance patterns.",
        },
        {
          organism: "ESBL-Producing Enterobacterales — moderate DFI with prior antibiotics or healthcare exposure",
          preferred: "Ertapenem 1g IV q24h (OPAT-friendly, definitive ESBL therapy); meropenem 1g IV q8h (severe or if ertapenem MIC borderline)",
          alternative: "Ceftolozane-tazobactam (ESBL + Pseudomonas); ceftazidime-avibactam (ESBL + KPC); fosfomycin IV (not available in US); temocillin (not available in US)",
          notes: "ESBL-producing E. coli or Klebsiella: carbapenems are the definitive treatment. Ertapenem is preferred for OPAT. Do NOT use cephalosporins even if susceptible by disk diffusion — ESBL inoculum effect causes in vivo failure despite in vitro susceptibility (a critical laboratory-clinical discordance). Oral step-down for ESBL is challenging — ciprofloxacin only if confirmed susceptible and not used empirically. Consult ID for non-carbapenem options.",
        },
        {
          organism: "Pseudomonas aeruginosa — macerated wounds, water/hydrotherapy exposure, prior fluoroquinolone use",
          preferred: "Piperacillin-tazobactam 4.5g IV q6h (extended infusion); cefepime 2g IV q8h; ciprofloxacin 750mg PO BID or 400mg IV q8h (if susceptible, oral step-down)",
          alternative: "Meropenem 1g IV q8h (carbapenem-susceptible); ceftazidime-avibactam (MDR Pseudomonas); ceftolozane-tazobactam (MDR Pseudomonas)",
          notes: "Pseudomonas in DFI is associated with: macerated wounds (patient soaking feet in water), warm climates, hydrotherapy, prior fluoroquinolone exposure, and healthcare-associated infections. Do NOT assume Pseudomonas is a clinically relevant pathogen based on surface swab alone — it may be a colonizer. If deep tissue culture or bone biopsy grows Pseudomonas, treat definitively. Ciprofloxacin 750mg PO BID is one of the few oral antipseudomonal options (OVIVA-style step-down viable if susceptible).",
        },
        {
          organism: "Anaerobes (Bacteroides, Peptostreptococcus, Prevotella) — deep/necrotic wounds, gas on imaging",
          preferred: "Amoxicillin-clavulanate PO (outpatient), pip-tazo IV or ertapenem IV (inpatient), metronidazole 500mg PO/IV TID (if adding to beta-lactam backbone)",
          alternative: "Clindamycin (if resistant to beta-lactams; note rising Bacteroides resistance to clindamycin >30% in some areas)",
          notes: "Anaerobes are important co-pathogens in: deep/necrotic DFI wounds, wounds with fetid odor, gas on soft tissue imaging (gas gangrene warning — emergent surgery), and chronic wounds with poor blood supply (ischemic tissue favors anaerobic growth). Metronidazole is the most reliable anaerobic agent and can be added to any regimen lacking anaerobic coverage. Bacteroides fragilis is increasingly clindamycin-resistant — metronidazole is preferred for definitive Bacteroides coverage.",
        },
      ],
      pearls: [
        "Polymicrobial infection is the rule in moderate DFI: Unlike mild DFI (predominantly monomicrobial gram-positive), moderate DFI with chronic wounds harbors polymicrobial flora. A single surface swab growing 4-5 organisms does NOT mean you need to cover all 4-5 — you need BONE biopsy or DEEP tissue culture to identify the true pathogen(s). Treating every colonizer from a surface swab leads to unjustified broad-spectrum 6-week courses and drives resistance.",
        "Vascular assessment before blaming antibiotics for failure: If a moderate DFI is not responding to appropriate antibiotics, ALWAYS check vascular status before escalating therapy. ABI <0.9 suggests PAD — antibiotic delivery to ischemic tissue is severely compromised. No antibiotic achieves therapeutic concentrations in ischemic tissue. Revascularization (angioplasty, bypass) is often the intervention that allows wound healing, not broader antibiotics. Refer to vascular surgery proactively.",
        "IV-to-PO switch timing: The OVIVA trial showed that switching to oral antibiotics after as few as 7 days of IV therapy was non-inferior for bone/joint infections. For soft tissue DFI, the threshold is even lower — switch to oral as soon as the patient can tolerate PO with reliable GI absorption and there are appropriate oral agents available. Diabetic gastroparesis is a real consideration: if blood glucoses are very high (>300 mg/dL) and the patient has slow gastric emptying, oral absorption may be unreliable until glycemia is controlled.",
        "Fluoroquinolone pearls for DFI bone/tissue penetration: Ciprofloxacin and levofloxacin achieve bone concentrations at 30-50% of plasma levels — higher than most other oral agents. Levofloxacin 750mg once daily is simpler than ciprofloxacin 750mg BID and has better gram-positive coverage. However: fluoroquinolone resistance in Pseudomonas (and Enterobacterales) is escalating rapidly (20-40% in many US centers). ALWAYS check susceptibility before using for step-down in culture-confirmed gram-negative infection. The FDA boxed warning (tendinopathy, peripheral neuropathy) is particularly relevant in diabetics who already have neuropathy — use judicious informed consent.",
        "ESR as an osteomyelitis monitoring tool: ESR >70 mm/h is highly specific (but not sensitive) for osteomyelitis in DFI. CRP is more useful for monitoring treatment response — it falls faster (within days of appropriate therapy) vs. ESR (weeks to months). Use CRP weekly to track response. A CRP failing to fall after 2-3 weeks of appropriate therapy should trigger: re-evaluation of source control, bone biopsy if not yet obtained, MRI reassessment, and ID consultation.",
        "Wound care team integration is essential: The pharmacist's role extends beyond antibiotic selection. Advocate for formal wound care team consultation (podiatry, wound care nursing, vascular surgery) on every moderate DFI. The healing endpoint is determined by the wound care team (ulcer closure), not by the ID service. Antibiotics stop when the INFECTION resolves, not when the WOUND closes — these are different endpoints.",
      ],
    },
    {
      id: "severe-dfi",
      name: "Severe Diabetic Foot Infection",
      definition: "IDSA/IWGDF 2023 Grade 4 (Severe): Any diabetic foot infection with ≥2 systemic inflammatory response syndrome (SIRS) criteria: temperature >38°C or <36°C, heart rate >90 bpm, respiratory rate >20 breaths/min (or PaCO2 <32 mmHg), WBC >12,000/µL or <4,000/µL or >10% band forms. Alternatively, any DFI causing metabolic instability (severe hyperglycemia/acidosis, uremia, electrolyte abnormalities). Severe DFI represents a systemic infection — hospitalization, IV antibiotics, and emergent surgical consultation are mandatory. Empiric therapy must cover all likely pathogens: gram-positive cocci (MRSA coverage essential), gram-negative rods (including Pseudomonas), and anaerobes. Source control (surgical debridement, drainage, or amputation) is the cornerstone of treatment — prolonged antibiotics cannot substitute for inadequate surgical management.",
      clinicalPresentation: "Acutely ill, systemically toxic patient with a diabetic foot wound. Fever (or hypothermia in severe sepsis), tachycardia, tachypnea, altered mental status. Locally: purulent, malodorous wound with surrounding necrosis, extensive erythema, bullae or blisters (ischemic component), crepitus on palpation (gas — emergent surgery), pain out of proportion (suggestive of necrotizing fasciitis — surgical emergency), skin color changes (dusky, violaceous, or frank gangrene). Laboratory: leukocytosis (or leukopenia), elevated CRP/procalcitonin, hyperglycemia (often severe, >400 mg/dL), metabolic acidosis (high-gap in severe cases — lactic acidosis from ischemia or DKA). Wagner Grade 3-5 correlates with severe DFI. URGENT: assess for necrotizing fasciitis (pain out of proportion, crepitus, rapid spread) — this is a surgical emergency requiring OR within hours.",
      diagnostics: "Blood cultures: MANDATORY — obtain 2 sets before starting antibiotics. Deep wound cultures (intraoperative if going to OR — most reliable). Plain radiographs STAT: gas in soft tissue (fascial planes — emergency), cortical destruction (osteomyelitis), extent of bony involvement. CT soft tissue: rapid assessment of tissue gas, extent of infection, fluid collections requiring drainage. MRI foot: gold standard for osteomyelitis characterization (may be obtained after initial stabilization if not emergent OR). Procalcitonin: elevated procalcitonin (>0.5 ng/mL) in DFI correlates with bacteremia risk and guides IV vs. oral decision. Lactate: obtain if hemodynamic instability (rules out lactic acidosis, guides fluid resuscitation). CBC, CMP, coagulation panel, HbA1c. Vascular surgery consultation for ABI/toe pressures — ischemia assessment is critical for amputation planning.",
      durationGuidance: {
        standard: "2–4 weeks (soft tissue only, after adequate source control)",
        severe: "4–6 weeks (osteomyelitis with medical-only management or incomplete bone resection)",
        opatNote: "OPAT after initial inpatient stabilization is appropriate for severe DFI that has been surgically debrided and is clinically improving. Once-daily regimens preferred for OPAT: ertapenem 1g q24h (if no MRSA/Pseudomonas), daptomycin 6-8 mg/kg q24h (MRSA), ceftriaxone 2g q24h (gram-positive/gram-negative susceptible organisms). Ensure OPAT infrastructure with twice-weekly labs (CBC, BMP, vancomycin AUC if applicable).",
        stewardshipNote: "Source control (debridement, incision/drainage, amputation if needed) is the cornerstone of severe DFI treatment. Prolonged antibiotics do NOT compensate for inadequate surgical management — if the patient is not improving on IV antibiotics, the question is almost never 'wrong antibiotic' but rather 'inadequate source control.' Surgically re-assess non-responders. After adequate source control, antibiotic duration for soft tissue severe DFI is 2-4 weeks — NOT indefinite.",
      },
      empiricTherapy: [
        {
          line: "First-Line — Severe DFI, Empiric Broad-Spectrum, IV",
          options: [
            {
              drug: "pip-tazo-vanc-severe",
              regimen: "Piperacillin-tazobactam 4.5g IV q6h (extended infusion over 4h) + Vancomycin IV (AUC/MIC 400-600)",
              notes: "Standard empiric regimen for severe DFI. Pip-tazo covers: MSSA, Streptococci, Enterobacterales, Pseudomonas aeruginosa, and anaerobes. Vancomycin adds MRSA coverage. Extended infusion pip-tazo (4h over 30 min q6h) significantly improves T>MIC target attainment for susceptible and intermediate Pseudomonas — pharmacist-driven intervention with high impact. AUC-guided vancomycin dosing (Bayesian software) reduces nephrotoxicity while ensuring efficacy. De-escalate based on blood cultures and deep wound cultures within 48-72h.",
              evidence: "A-I",
              evidenceSource: "IDSA/IWGDF 2023",
            },
            {
              drug: "meropenem-vanc-severe",
              regimen: "Meropenem 1g IV q8h + Vancomycin IV (AUC/MIC 400-600)",
              notes: "Reserve for severe DFI with: prior MDR gram-negative cultures, recent hospitalization, prior broad-spectrum antibiotic exposure within 90 days, or failed pip-tazo therapy. Meropenem covers Enterobacterales (including ESBL), Pseudomonas, and anaerobes — broader than pip-tazo for resistant gram-negatives. Add vancomycin for MRSA. This is not first-line empiric — reserve to prevent unnecessary carbapenem use and emergence of carbapenem-resistant organisms (CRO). Consult antimicrobial stewardship.",
              evidence: "B-II",
              evidenceSource: "IDSA/IWGDF 2023",
            },
          ],
        },
        {
          line: "MRSA Coverage Options — IV",
          options: [
            {
              drug: "vancomycin-severe-mrsa",
              regimen: "Vancomycin IV — AUC/MIC target 400-600 mg·h/L (Bayesian dosing strongly preferred)",
              notes: "Standard MRSA coverage for severe DFI. Initiate with loading dose (25-35 mg/kg IV once for severe infection) followed by maintenance dosing guided by Bayesian pharmacokinetic software. Monitor AUC daily for first 2-3 days, then every 2-3 days when stable. Nephrotoxicity risk is real, particularly with concurrent nephrotoxins (NSAIDs — common in diabetics), contrast agents, or baseline CKD. Transition to oral MRSA agent (TMP-SMX, linezolid) when clinically stable and GI function adequate.",
              evidence: "A-I",
              evidenceSource: "IDSA/IWGDF 2023",
            },
            {
              drug: "daptomycin-severe-mrsa",
              regimen: "Daptomycin 6-8 mg/kg IV q24h — alternative or adjunct to vancomycin for MRSA",
              notes: "Daptomycin 6 mg/kg for serious MRSA soft tissue infection; consider 8-10 mg/kg for DFI osteomyelitis (higher doses improve bone penetration and maintain activity against biofilm-embedded organisms per pharmacodynamic data). Once-daily dosing. Monitor CPK weekly — suspend statins during daptomycin therapy (myopathy risk). Preferred over vancomycin when: vancomycin MIC ≥2 µg/mL, prior vancomycin nephrotoxicity, or OPAT (once-daily vs. intermittent vancomycin infusions). Do NOT use for pneumonia.",
              evidence: "B-II",
              evidenceSource: "IDSA/IWGDF 2023",
            },
          ],
        },
        {
          line: "Necrotizing Fasciitis — Emergent Regimen (If NSTI Suspected)",
          options: [
            {
              drug: "nsti-dfi-regimen",
              regimen: "Vancomycin IV + Piperacillin-tazobactam 4.5g IV q6h + Clindamycin 900mg IV q8h (toxin suppression)",
              notes: "If necrotizing fasciitis is suspected in addition to DFI (pain out of proportion, crepitus, rapidly spreading necrosis, skin blistering, hemodynamic instability): EMERGENT surgery consultation + triple therapy. Add clindamycin 900mg IV q8h for toxin suppression (Eagle effect — at high bacterial inocula, cell-wall agents are less effective; clindamycin inhibits toxin synthesis regardless of growth phase). TIME TO SURGERY IS THE DOMINANT PROGNOSTIC VARIABLE — do not delay OR for further imaging if clinical picture strongly suggests necrotizing fasciitis.",
              evidence: "A-I",
              evidenceSource: "IDSA 2014 SSTI Guidelines (NF component)",
            },
          ],
        },
        {
          line: "ESBL or MDR Gram-Negative Suspected/Confirmed",
          options: [
            {
              drug: "meropenem-esbl-severe",
              regimen: "Meropenem 1g IV q8h (ESBL confirmed or high-risk severe DFI)",
              notes: "When deep tissue or blood culture grows ESBL-producing E. coli or Klebsiella in severe DFI: meropenem is the definitive therapy. Ertapenem is also acceptable for ESBL if not critically ill (lacks Pseudomonas coverage — avoid if Pseudomonas co-pathogen suspected). Cefepime is NOT reliable for ESBL (inoculum effect causes in vivo failure despite in vitro susceptibility in some patients). Do NOT use extended-spectrum cephalosporins for ESBL-confirmed infections.",
              evidence: "A-I",
              evidenceSource: "IDSA/IWGDF 2023",
            },
            {
              drug: "caz-avi-cre-severe",
              regimen: "Ceftazidime-avibactam 2.5g IV q8h (extended infusion) — for KPC-producing Klebsiella or MDR Pseudomonas",
              notes: "Reserve for carbapenem-resistant Enterobacterales (CRE) — specifically KPC producers. Ceftazidime-avibactam covers KPC, OXA-48, and extended-spectrum beta-lactamases but NOT metallo-beta-lactamases (NDM, VIM, IMP — which require aztreonam-avibactam or colistin-based regimens). Always confirm mechanism of carbapenem resistance before choosing therapy. Consult ID and antimicrobial stewardship. This is a high-cost, restricted antibiotic — appropriate use critical.",
              evidence: "B-III",
              evidenceSource: "IDSA AMR Guidance 2023",
            },
          ],
        },
      ],
      organismSpecific: [
        {
          organism: "S. aureus (MSSA) — severe DFI (bacteremia common)",
          preferred: "Cefazolin 2g IV q8h (first-line for MSSA, superior to vancomycin); nafcillin 2g IV q4h (if bacteremia — slightly superior bactericidal kinetics)",
          alternative: "Vancomycin IV (empiric, until MSSA confirmed — de-escalate immediately upon MSSA confirmation)",
          notes: "DE-ESCALATION from vancomycin to cefazolin upon MSSA confirmation is one of the most high-impact stewardship interventions. Multiple studies show cefazolin is equivalent or superior to nafcillin/oxacillin for MSSA bacteremia with fewer adverse effects. For MSSA bacteremia from DFI: mandatory echocardiogram + ID consultation to rule out endocarditis — treat bacteremia as SAB (Staphylococcal aureus bacteremia), not just DFI source.",
        },
        {
          organism: "S. aureus (MRSA) — severe DFI",
          preferred: "Vancomycin IV (AUC/MIC 400-600); daptomycin 8-10 mg/kg IV q24h (especially for osteomyelitis, OPAT, or vancomycin-intolerant)",
          alternative: "Ceftaroline 600mg IV q8h (MRSA with vancomycin failure or MIC ≥2 µg/mL); linezolid 600mg IV/PO BID (soft tissue — excellent penetration, but bacteriostatic not bactericidal)",
          notes: "For MRSA osteomyelitis: vancomycin is standard IV; daptomycin at high doses (8-10 mg/kg) has superior bone penetration and activity against biofilm-embedded MRSA. Oral step-down for MRSA osteomyelitis: TMP-SMX DS 2 tabs BID or linezolid 600mg BID — both supported by OVIVA data for osteomyelitis setting. Vancomycin MIC ≥2 µg/mL (VISA/hVISA): associated with treatment failure — switch to daptomycin or ceftaroline.",
        },
        {
          organism: "Pseudomonas aeruginosa — severe DFI",
          preferred: "Piperacillin-tazobactam 4.5g IV q6h extended infusion; cefepime 2g IV q8h (if pip-tazo resistance); ciprofloxacin 750mg PO BID or 400mg IV q8h (oral step-down if susceptible)",
          alternative: "Meropenem 1g IV q8h (carbapenem-susceptible Pseudomonas); ceftolozane-tazobactam (MDR Pseudomonas); ceftazidime-avibactam (XDR Pseudomonas with OprD mutation)",
          notes: "Pseudomonas bacteremia from DFI is uncommon but carries high mortality. Extended infusion pip-tazo or cefepime is strongly preferred for PK/PD optimization. Dual anti-pseudomonal therapy (e.g., pip-tazo + ciprofloxacin) was historically used for severe Pseudomonas infections but is no longer recommended by most guidelines — monotherapy with adequate PK/PD optimization is preferred. Check susceptibility to ALL anti-pseudomonal agents including polymyxins for MDR strains.",
        },
        {
          organism: "Polymicrobial severe DFI (mixed gram-positives + gram-negatives + anaerobes)",
          preferred: "Pip-tazo 4.5g IV q6h (extended infusion) + vancomycin IV — covers entire polymicrobial spectrum",
          alternative: "Meropenem + vancomycin (higher ESBL/MDR risk); ertapenem + vancomycin (no Pseudomonas risk)",
          notes: "Polymicrobial bacteremia from severe DFI requires coverage of all bacteremic organisms until clinical improvement and culture-directed de-escalation. The most important concept: do NOT routinely cover all wound-swab organisms — target only organisms from blood cultures or deep tissue cultures. Surface swabs in severe DFI commonly grow 4-6 organisms; treating all of them empirically IV is not evidence-based.",
        },
        {
          organism: "Enterococcus — severe DFI (rare primary pathogen; frequently a co-colonizer)",
          preferred: "Ampicillin 2g IV q4h (E. faecalis, ampicillin-susceptible); vancomycin IV (E. faecalis — second-line); linezolid or daptomycin (VRE — E. faecium)",
          alternative: "Ceftaroline (limited Enterococcal activity); consultation with ID for VRE bacteremia",
          notes: "Enterococcus is commonly isolated from DFI wounds but is rarely a primary pathogen — it is usually a colonizer. IDSA/IWGDF 2023: routine empiric anti-enterococcal coverage is NOT recommended for most DFIs (analogous to IAI guidance). However, if Enterococcus is isolated from blood culture in severe DFI: treat definitively. E. faecalis (ampicillin-susceptible): ampicillin is bactericidal and superior to vancomycin. E. faecium (often ampicillin-resistant): vancomycin or linezolid for VSE; daptomycin or linezolid for VRE.",
        },
      ],
      pearls: [
        "Source control is the cornerstone — antibiotics are adjunctive: A severe DFI that is not responding to appropriate IV antibiotics at 48-72 hours almost always has inadequate source control as the explanation, NOT the wrong antibiotic. The 'wrong antibiotic' explanation should only be considered after confirming: (1) surgical debridement was complete, (2) all abscesses were drained, (3) necrotic tissue was removed, (4) the organism on culture matches the empiric regimen. If source control is incomplete, escalating antibiotics is ineffective — the patient needs to return to the OR.",
        "Extended infusion piperacillin-tazobactam is a high-impact pharmacist intervention: Pip-tazo is a time-dependent antibiotic (pharmacodynamic driver: T>MIC). Traditional q6h 30-minute infusions achieve T>MIC of 50-60% for susceptible organisms. Extended infusion (4h infusion q6h) increases T>MIC to 80-100% — clinically significant improvement in target attainment for intermediate-susceptibility Pseudomonas and other organisms. Multiple studies show clinical outcome improvement with extended infusion. This is a straightforward pharmacist-driven intervention that requires no additional cost.",
        "Procalcitonin for antibiotic duration guidance: Procalcitonin-guided antibiotic cessation is validated in respiratory infections but emerging data support use in severe DFI/bacteremia. Procalcitonin >0.25 ng/mL at 48h suggests ongoing bacterial infection — consider continuing IV antibiotics. Procalcitonin declining by >80% from peak, in conjunction with clinical improvement, supports transition to oral step-down or stopping antibiotics in soft tissue DFI. This is not a substitute for clinical judgment but is a useful objective marker.",
        "Daptomycin dose escalation for osteomyelitis: Standard daptomycin dosing is 4 mg/kg (FDA-approved for SSTI) and 6 mg/kg (bacteremia). For DFI osteomyelitis, many ID physicians and pharmacists use 8-10 mg/kg based on pharmacodynamic modeling showing improved AUC/MIC target attainment in bone tissue and against biofilm-embedded MRSA. Clinical evidence supporting 8-10 mg/kg for osteomyelitis is observational, not RCT-based, but the practice is widely adopted. Monitor CPK weekly at any daptomycin dose.",
        "Amputation is sometimes the best antimicrobial therapy: For severe DFI with gangrene, extensive osteomyelitis, or MDR organisms in non-viable tissue, amputation provides the most definitive source control. After amputation with clean stump margins, antibiotic duration can be dramatically shortened (days to 1-2 weeks for soft tissue infection surrounding the amputation site). A DFI patient declining indicated amputation who is then treated indefinitely with antibiotics is a major stewardship concern — antibiotics cannot cure gangrenous or non-perfused tissue.",
        "Glycemic emergency management: Severe DFI commonly precipitates hyperglycemic crises (DKA or HHS). Insulin infusion protocols for BG >300 mg/dL in severe DFI are an important pharmacist-managed intervention. Resolving the metabolic emergency restores neutrophil function and improves antibiotic efficacy. The pharmacist bridges the DFI management (antibiotics) with the acute care management (insulin, electrolytes) — a unique value-added role in severe DFI.",
      ],
    },
    {
      id: "dfi-osteomyelitis",
      name: "Diabetic Foot Osteomyelitis",
      definition: "Osteomyelitis complicating diabetic foot infection — contiguous spread of infection from an overlying infected ulcer into the underlying bone cortex and marrow. Occurs in 20-60% of moderate-severe DFIs. The diagnostic challenge: distinguishing osteomyelitis from Charcot neuroarthropathy (which mimics osteomyelitis on imaging) and from colonized but non-infected bone. The therapeutic challenge: achieving adequate antibiotic concentrations in avascular, biofilm-colonized bone and deciding between medical-only management vs. surgical resection. The management paradigm has shifted dramatically with OVIVA (oral non-inferior to IV) and post-resection data (5-day post-op course if clean margins). Bone biopsy is the gold standard for diagnosis and for culture-directed therapy — surface wound cultures do NOT reflect bone pathogens.",
      clinicalPresentation: "Chronic non-healing diabetic foot ulcer — particularly plantar, overlying a bony prominence — that has failed to close despite appropriate wound care. Probe-to-bone (PTB) test: positive when sterile metal probe inserted through ulcer contacts bone with gritty sensation (PPV ~89% in clinic populations with high pre-test probability; PPV lower in ED populations). Sausage toe (dactylitis): diffuse fusiform swelling of an entire digit — highly suggestive of phalangeal osteomyelitis. Bare bone visible in wound base. Minimally tender or painless (peripheral neuropathy). Often NO fever, NO leukocytosis — systemic signs are frequently absent in DFI osteomyelitis. Fetid odor suggests polymicrobial involvement with anaerobes. Imaging showing cortical erosion or periosteal reaction overlying an ulcer is virtually diagnostic.",
      diagnostics: "PROBE-TO-BONE TEST (PTB): First-line bedside assessment. Insert a sterile blunt metal probe through the ulcer. Positive = gritty sensation of contacting bone. PPV ~89% in high pre-test probability population (clinic DFI patients). NPV ~56% (does NOT rule out osteomyelitis). Sensitivity 66%, specificity 85%. Positive PTB in moderate-severe DFI = presumptive osteomyelitis until proven otherwise. PLAIN RADIOGRAPHS: Obtain immediately — cortical erosion, periosteal reaction, bone destruction, gas in soft tissue. Sensitivity only 30-50% in early osteomyelitis (bone changes take 2-3 weeks to appear). Normal XR does NOT rule out osteomyelitis. MRI WITH AND WITHOUT GADOLINIUM: Gold standard for DFI osteomyelitis. Sensitivity 90%, specificity 80%. Shows marrow edema (T2 hyperintensity), cortical destruction, soft tissue extent, and concurrent joint involvement. MRI is essential before committing to bone resection. Cannot distinguish Charcot from osteomyelitis definitively in some cases — clinical and microbiologic correlation required. BONE BIOPSY: Gold standard for definitive diagnosis (histology + culture). Obtain BEFORE starting antibiotics whenever possible — antibiotics reduce bone culture yield from 70-80% to 30-50%. Two approaches: (1) Percutaneous CT-guided biopsy (best for deep bones, minimal contamination risk — preferred when the overlying skin is intact or when there is concern for contamination via the ulcer), (2) Intraoperative bone biopsy (gold standard if patient goes to OR — send bone to both pathology and microbiology). Surface wound swabs DO NOT predict bone culture results — they grow colonizers, not the bone pathogen. ESR AND CRP: ESR >70 mm/h = high specificity for osteomyelitis in DFI setting (sensitivity only 72%). CRP: excellent for monitoring treatment response — trend every 1-2 weeks. A CRP failing to decline after 2-3 weeks should trigger re-evaluation. NUCLEAR MEDICINE IMAGING: MRI-labeled WBC scan or PET-CT: used when MRI is contraindicated (hardware, claustrophobia) or when Charcot vs. osteomyelitis distinction is critical. Less readily available; interpret with ID guidance. VASCULAR ASSESSMENT: ABI, toe pressures, or transcutaneous oxygen tension (TcPO2 <30 mmHg = severe ischemia, poor healing regardless of antibiotic adequacy). This step is mandatory — no antibiotic heals osteomyelitis in an ischemic limb.",
      durationGuidance: {
        standard: "6 weeks total (IV or IV→oral per OVIVA) — medical management without bone resection",
        severe: "3 months (non-surgical, conservative management for extensive osteomyelitis or patient refusing surgery)",
        opatNote: "OPAT is strongly preferred after initial inpatient stabilization. Once-daily options: ertapenem 1g IV q24h (MSSA, Enterobacterales, anaerobes — no MRSA/Pseudomonas), daptomycin 6-10 mg/kg IV q24h (MRSA, gram-positives), ceftriaxone 2g IV q24h (Streptococci, susceptible gram-negatives). Ensure OPAT monitoring protocol: weekly CBC, BMP, drug levels if applicable. OPAT pharmacist follow-up every 48-72h for first 2 weeks, then weekly.",
        stewardshipNote: "PARADIGM SHIFT — If complete surgical resection of infected bone is achieved with confirmed clean margins on histopathology, post-operative antibiotic duration can be as short as 5-7 days (IDSA/IWGDF 2023; Ha Van et al. 2003). The surgery does the therapeutic work — antibiotics are only required to treat residual soft tissue infection. This represents a dramatic reduction from the historical dogma of 6 weeks post-amputation antibiotics. OVIVA 2019: For medically managed osteomyelitis, oral non-inferior to IV for bone/joint infections — use fluoroquinolones, TMP-SMX, linezolid, or clindamycin (NOT amoxicillin or cephalexin monotherapy) for oral step-down. Early oral step-down after 7-10 days of IV is now standard of care when appropriate agents are available.",
      },
      empiricTherapy: [
        {
          line: "Medical Management — Empiric, Pending Bone Culture",
          options: [
            {
              drug: "vanc-erta-osteo-empiric",
              regimen: "Vancomycin IV (AUC 400-600) + Ertapenem 1g IV q24h (empiric, pending bone biopsy results)",
              notes: "Broad empiric coverage pending bone culture: vancomycin for MRSA/gram-positives, ertapenem for Enterobacterales/anaerobes/MSSA. HOLD antibiotics for 48-72 hours (if clinically stable) to allow bone biopsy — culture yield plummets after antibiotics started. If bone biopsy cannot be obtained or must be delayed, start empiric therapy and accept empiric limitations. Narrow aggressively within 48-72h of culture results. Do NOT continue broad empiric coverage for 6 weeks without organism identification — this drives resistance and increases toxicity.",
              evidence: "B-III",
              evidenceSource: "IDSA/IWGDF 2023",
            },
          ],
        },
        {
          line: "Medical Management — Pathogen-Directed, MSSA Osteomyelitis",
          options: [
            {
              drug: "cefazolin-mssa-osteo",
              regimen: "Cefazolin 2g IV q8h × 2-6 weeks → oral step-down (levofloxacin 750mg PO q24h + rifampin 300mg PO q12h, OR TMP-SMX DS 2 tabs PO BID) to complete 6 weeks total",
              notes: "Gold standard for MSSA osteomyelitis. Initial IV cefazolin for 1-2 weeks achieves rapid bactericidal activity in bone. OVIVA-supported oral step-down after initial IV period: levofloxacin 750mg daily (excellent bone penetration ~30-50% of serum concentrations) ± rifampin 300mg BID (biofilm penetration — see pearl below). Rifampin combination for osteomyelitis: data is strongest for Staphylococcal PJI (Zimmerli trial), but extrapolated to DFI osteomyelitis by many ID specialists — use with companion drug only (resistance develops rapidly with rifampin monotherapy). CRP trending every 2 weeks confirms treatment response.",
              evidence: "A-I",
              evidenceSource: "IDSA/IWGDF 2023",
            },
            {
              drug: "diclox-mssa-osteo-oral",
              regimen: "Dicloxacillin 500mg PO QID × 6 weeks (mild-moderate MSSA osteomyelitis, OVIVA-eligible patients)",
              notes: "For selected MSSA DFI osteomyelitis in OVIVA-eligible patients: oral from the start or after ≤7 days IV. Dicloxacillin achieves adequate serum concentrations for MSSA osteomyelitis but bone penetration is lower than fluoroquinolones. Must be taken on empty stomach. Most ID experts prefer fluoroquinolone or TMP-SMX oral step-down over dicloxacillin for bone infections — better bone concentration data. Discuss with ID.",
              evidence: "B-II",
              evidenceSource: "IDSA/IWGDF 2023",
            },
          ],
        },
        {
          line: "Medical Management — Pathogen-Directed, MRSA Osteomyelitis",
          options: [
            {
              drug: "vanc-mrsa-osteo",
              regimen: "Vancomycin IV (AUC/MIC 400-600) × 2-6 weeks → oral TMP-SMX DS 2 tabs PO BID to complete 6 weeks total",
              notes: "Standard IV therapy for MRSA DFI osteomyelitis. AUC-guided Bayesian dosing is mandatory — trough-only monitoring is no longer standard (2020 consensus). Target AUC/MIC 400-600 mg·h/L. Oral step-down: TMP-SMX DS 2 tabs BID (workhorse for MRSA osteomyelitis — excellent bone penetration, generally tolerated long-term). Monitor: creatinine (false rise from tubular creatinine secretion block — educate team this is not true AKI), potassium (hyperkalemia risk — check weekly), CBC. Linezolid 600mg BID is alternative oral step-down if TMP-SMX not tolerated.",
              evidence: "A-I",
              evidenceSource: "IDSA/IWGDF 2023",
            },
            {
              drug: "dapto-mrsa-osteo-opat",
              regimen: "Daptomycin 8-10 mg/kg IV q24h × 6 weeks (MRSA osteomyelitis, OPAT-preferred regimen)",
              notes: "Daptomycin at 8-10 mg/kg is preferred over vancomycin by many ID specialists for MRSA DFI osteomyelitis in the OPAT setting: (1) Once-daily dosing (easier for home infusion), (2) No AUC monitoring required (CPK monitoring suffices), (3) Higher tissue concentrations at 8-10 mg/kg (superior bone penetration), (4) Activity against biofilm-embedded MRSA. Clinical evidence for high-dose daptomycin in osteomyelitis is observational. CPK monitoring weekly — myopathy risk increases above 6 mg/kg. Suspend concurrent statins.",
              evidence: "B-II",
              evidenceSource: "IDSA/IWGDF 2023",
            },
          ],
        },
        {
          line: "Medical Management — Pathogen-Directed, Gram-Negative Osteomyelitis",
          options: [
            {
              drug: "cipro-gn-osteo",
              regimen: "Ciprofloxacin 750mg PO BID × 6 weeks (gram-negative osteomyelitis, susceptible organism)",
              notes: "Fluoroquinolones are the BEST oral agents for gram-negative osteomyelitis — highest oral bioavailability (~80%) and highest bone penetration ratio of any oral class. Ciprofloxacin 750mg BID achieves bone concentrations at 30-50% of peak serum concentration. OVIVA strongly supports oral fluoroquinolones for gram-negative bone infections. Check susceptibility before using — resistance in E. coli is 15-25%, Pseudomonas 20-40% in many US centers. Levofloxacin 750mg once daily is an alternative with better gram-positive coverage and simpler dosing.",
              evidence: "A-I",
              evidenceSource: "IDSA/IWGDF 2023",
            },
            {
              drug: "ertapenem-esbl-osteo",
              regimen: "Ertapenem 1g IV q24h × 6 weeks (ESBL-producing Enterobacterales osteomyelitis, OPAT setting)",
              notes: "For ESBL-producing gram-negative DFI osteomyelitis: ertapenem 1g IV once daily is the preferred OPAT agent. Does NOT cover Pseudomonas — ensure Pseudomonas is not a co-pathogen. Once-daily dosing compatible with home infusion nurse visits every other day. Renally eliminated — adjust for CrCl <30 mL/min. Oral step-down for ESBL osteomyelitis is challenging — fluoroquinolone only if confirmed susceptible.",
              evidence: "A-II",
              evidenceSource: "IDSA/IWGDF 2023",
            },
          ],
        },
        {
          line: "Surgical Resection — Post-Operative Antibiotic Duration",
          options: [
            {
              drug: "post-resection-clean-margins",
              regimen: "Antibiotics for 5-7 days post-operatively (complete bone resection with histologically confirmed clean margins)",
              notes: "PARADIGM SHIFT (IDSA/IWGDF 2023; Ha Van 2003): If ALL infected bone is resected with pathologically confirmed clean margins, only 5-7 days of post-operative antibiotics are needed — to treat residual soft tissue infection, not residual bone infection. The surgery has eliminated the bone infection. Antibiotics post-resection address any surrounding soft tissue component. This dramatically reduces treatment burden vs. historical 6-week post-op courses. CRITICAL: 'clean margins' must be confirmed by pathology (absence of osteomyelitis on histology at resection edge) — not just clinical or surgical judgment.",
              evidence: "B-II",
              evidenceSource: "IDSA/IWGDF 2023",
            },
            {
              drug: "post-resection-dirty-margins",
              regimen: "Antibiotics for 2-4 weeks post-operatively (incomplete resection or positive margins on histology)",
              notes: "When intraoperative cultures are positive and/or histology shows residual osteomyelitis at the resection margin: treat as ongoing osteomyelitis. Duration: 2-4 weeks from the date of resection (not from initial diagnosis). The goal is pathogen-directed therapy guided by intraoperative bone culture. Surface wound cultures from the amputation stump do NOT guide this therapy — intraoperative bone cultures are the essential data point.",
              evidence: "B-III",
              evidenceSource: "IDSA/IWGDF 2023",
            },
          ],
        },
      ],
      organismSpecific: [
        {
          organism: "S. aureus (MSSA) — most common single organism in DFI osteomyelitis",
          preferred: "Cefazolin 2g IV q8h (IV phase); levofloxacin 750mg PO q24h ± rifampin 300mg PO q12h (oral step-down for bone); TMP-SMX DS 2 tabs PO BID (alternative oral step-down)",
          alternative: "Nafcillin 2g IV q4h (bacteremia — superior bactericidal activity); dicloxacillin 500mg PO QID (oral — adequate but lower bone penetration than fluoroquinolones)",
          notes: "MSSA is the most common single organism when bone biopsy is performed. However, 20-30% of DFI osteomyelitis is truly polymicrobial even on bone culture. OVIVA-supported oral step-down: levofloxacin for gram-positive osteomyelitis has good evidence. Rifampin combination for MSSA osteomyelitis is used by many ID physicians for biofilm penetration — always pair with levofloxacin or TMP-SMX (never rifampin monotherapy).",
        },
        {
          organism: "S. aureus (MRSA) — DFI osteomyelitis",
          preferred: "Vancomycin IV (AUC/MIC 400-600) [IV phase]; TMP-SMX DS 2 tabs PO BID [oral step-down]; linezolid 600mg PO BID [oral step-down alternative]",
          alternative: "Daptomycin 8-10 mg/kg IV q24h (OPAT-preferred); doxycycline 100mg PO BID (if susceptible, less data for osteomyelitis vs. SSTI)",
          notes: "MRSA osteomyelitis is the most challenging DFI scenario. Biofilm-embedded MRSA is resistant to killing by vancomycin (poor biofilm penetration). Daptomycin at high doses (8-10 mg/kg) has superior biofilm activity. TMP-SMX as oral step-down for MRSA osteomyelitis: well-established by OVIVA and retrospective data. Linezolid achieves excellent bone concentrations (105% of serum — one of the best bone penetrators). Rifampin for MRSA osteomyelitis: used by some ID experts but less data than for MSSA/PJI — use with caution and always with companion drug.",
        },
        {
          organism: "Streptococcus agalactiae (Group B Strep) — DFI osteomyelitis in elderly diabetics",
          preferred: "Ceftriaxone 2g IV q24h (OPAT-convenient); amoxicillin 1g PO TID (oral step-down)",
          alternative: "Penicillin G 3-4 MU IV q4h (bactericidal osteomyelitis treatment); cephalexin 500mg PO QID (oral)",
          notes: "Group B Strep is particularly prevalent in osteomyelitis of the elderly diabetic patient, often due to urinary tract source. Penicillin-susceptible universally — narrow to penicillin or amoxicillin when confirmed. Ceftriaxone once-daily is ideal for OPAT. 6-week course for medical management; shorter if complete resection achieved.",
        },
        {
          organism: "Enterobacterales (E. coli, Klebsiella, Proteus) — DFI osteomyelitis, chronic wounds",
          preferred: "Ertapenem 1g IV q24h (ESBL or initial IV therapy); ciprofloxacin 750mg PO BID or levofloxacin 750mg PO q24h (oral step-down if susceptible)",
          alternative: "Ceftriaxone 2g IV q24h (susceptible, non-ESBL); meropenem 1g IV q8h (severe/resistant)",
          notes: "Gram-negative osteomyelitis in DFI: fluoroquinolone step-down is the best oral option (highest bone penetration of any oral class). Check susceptibilities carefully — fluoroquinolone resistance in Enterobacterales is increasing. For ESBL: ertapenem IV for duration, or consider fluoroquinolone oral step-down only if confirmed susceptible. For osteomyelitis Proteus species: susceptible to ampicillin (if non-ESBL), cephalosporins, fluoroquinolones — avoid nitrofurantoin (intrinsic resistance).",
        },
        {
          organism: "Culture-Negative DFI Osteomyelitis (after adequate bone biopsy, held pre-antibiotic)",
          preferred: "Empiric coverage of most likely pathogens based on clinical context: vancomycin + ertapenem (moderate-severe, polymicrobial risk); amoxicillin-clavulanate PO (mild, outpatient)",
          alternative: "Consult ID for atypical organisms if culture-negative despite holding antibiotics before biopsy",
          notes: "True culture-negative osteomyelitis after proper technique (percutaneous or intraoperative bone biopsy, held before antibiotics, adequate lab processing) occurs in 20-30% of cases. Consider: prior antibiotics suppressing growth (most common cause), slow-growing organisms (Cutibacterium acnes — hold cultures 14 days), Mycobacteria (AFB stain and culture), fungi (endemic mycoses in high-risk regions). 16S rRNA PCR from bone tissue can identify organisms not growing on standard culture — request when unexplained culture negativity. Empiric broad-spectrum for 6 weeks is less ideal than pathogen-directed therapy but may be necessary.",
        },
      ],
      pearls: [
        "Biofilm is why short antibiotic courses fail in untreated osteomyelitis: Bone-infecting organisms (particularly S. aureus) form biofilm on necrotic bone and sequestra. Within a biofilm, bacteria exist in a sessile, metabolically quiescent state with dramatically altered gene expression — they become 100-1000x more tolerant to antibiotics than planktonic organisms. This is the fundamental reason osteomyelitis requires weeks of therapy rather than days. The only way to definitively overcome biofilm is: (1) surgical removal of all infected/necrotic bone (sequestrum, debridement), or (2) prolonged antibiotic exposure exceeding the biofilm tolerance threshold. Incomplete surgery + short antibiotics = relapse. This is why the post-resection clean margin data (5-7 days) is so powerful — the surgery eliminates the biofilm substrate.",
        "OVIVA changed the IV-oral debate for osteomyelitis permanently: Before OVIVA (2019), 6 weeks of IV antibiotics via PICC was the near-universal standard for osteomyelitis. OVIVA demonstrated oral non-inferiority in 1,054 bone/joint infection patients. The key message is NOT 'oral is always fine' — it is 'the RIGHT oral agents are equivalent.' Right oral agents: fluoroquinolones (best bone penetration), TMP-SMX (MRSA), linezolid (MRSA, gram-positives), rifampin combinations (Staphylococci with biofilm — never monotherapy), clindamycin (gram-positives, anaerobes). WRONG oral agents for osteomyelitis: amoxicillin monotherapy, cephalexin — these have inadequate bone penetration for osteomyelitis. Knowing this distinction is a core pharmacist competency in DFI management.",
        "Surface wound swabs are misleading and should not guide osteomyelitis therapy: This point cannot be overstated. Multiple studies demonstrate that surface swab cultures in chronic DFIs grow organisms that DO NOT match bone biopsy cultures in 50-70% of cases. A 6-week course of IV antibiotics directed at Pseudomonas aeruginosa grown on a surface swab — when the bone culture actually grows MSSA — is a patient safety event. Advocate for bone biopsy before starting any prolonged antibiotic course for osteomyelitis. If bone biopsy is truly not obtainable, explicitly document the reason and acknowledge the uncertainty driving empiric coverage.",
        "Vascular assessment before attributing treatment failure to antibiotic inadequacy: ABI <0.5 or toe pressure <30 mmHg represents severe ischemia. In ischemic limbs, tissue antibiotic concentrations are severely reduced — the antibiotic cannot reach the infection. A patient with DFI osteomyelitis and PAD who is failing appropriate antibiotics almost certainly needs revascularization first, before changing antibiotics. ABI and toe pressures (or TcPO2) should be obtained at initial evaluation and before any major antibiotic change in a non-responding DFI. Vascular surgery consultation is mandatory for ABI <0.6.",
        "Fluoroquinolone bone penetration vs. resistance risk balance: Fluoroquinolones achieve the highest bone-to-serum concentration ratios of any oral antibiotic class (30-50% bone penetration). They are the most studied and most effective oral agents for gram-negative osteomyelitis. However: (1) FDA boxed warning for peripheral neuropathy, tendinopathy, and CNS effects — particularly concerning in diabetics with pre-existing peripheral neuropathy, (2) Rapidly increasing resistance (E. coli resistance to ciprofloxacin is now 15-25% in many US centers — always check susceptibility before prescribing for culture-directed gram-negative osteomyelitis), (3) Prior fluoroquinolone use within 90 days should deter empiric fluoroquinolone use. In MRSA DFI osteomyelitis, fluoroquinolones have no role as monotherapy — pair with rifampin or use TMP-SMX/linezolid.",
        "Linezolid for gram-positive bone and tissue concentrations — practical pearls: Linezolid achieves bone concentrations of 105% of simultaneous plasma concentrations — one of the very highest bone penetrators of any antibiotic. It is effective for MRSA osteomyelitis in OVIVA-eligible patients and is FDA-approved for gram-positive infections. PRACTICAL LIMITATIONS: (1) Cost — linezolid is expensive and often requires prior authorization; (2) Myelosuppression — CBC weekly; thrombocytopenia occurs in 2-3% at 14 days, up to 20-30% at 28+ days — particularly in renal impairment where the drug accumulates; (3) Serotonin syndrome — review the patient's full medication list (SSRIs, SNRIs, tramadol, triptans, MAOIs — very common drug interactions in the diabetic elderly population); (4) Lactic acidosis — rare but potentially fatal with prolonged use (mitochondrial toxicity affecting lactate metabolism); limit to <6 weeks when possible.",
        "The multidisciplinary team is not optional: DFI osteomyelitis management requires: ID physician (antibiotic selection, duration, step-down decisions), infectious disease pharmacist (OPAT coordination, PK/PD optimization, drug interactions, monitoring), podiatry/orthopedic surgery (bone debridement, amputation decision), vascular surgery (revascularization assessment), wound care nursing (dressing management, offloading education), endocrinology (glycemic optimization), and social work (OPAT feasibility, housing, adherence support). No single service can optimize all these variables simultaneously. The pharmacist in this team plays a coordination and advocacy role that directly impacts antibiotic stewardship, patient safety, and clinical outcomes.",
      ],
    },
  ],
  drugMonographs: [],
} as const;
