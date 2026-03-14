// Editorial source for the Bone/Joint disease module.
// Runtime imports use src/data/generated/diseases/bone-joint.ts.
export const BONE_JOINT = {
  id: "bone-joint",
  name: "Bone & Joint Infections",
  icon: "🦴",
  category: "Infectious Disease — IDSA 2015 + OVIVA 2019",
  overview: {
    definition: "Bone and joint infections encompass osteomyelitis (infection of bone), septic arthritis (infection of a joint space), and prosthetic joint infections (PJI). These infections are characterized by difficult-to-eradicate organisms that form biofilms on necrotic bone or prosthetic material, requiring prolonged antibiotic courses (often 4-6+ weeks) and frequently surgical intervention. The key pharmacologic challenge is delivering adequate antibiotic concentrations to avascular bone tissue and biofilm-embedded organisms.",
    epidemiology: "Osteomyelitis incidence: 2-5 per 10,000 person-years. Vertebral osteomyelitis (most common form in adults) incidence rising due to aging population, IDU, and healthcare-associated bacteremia. Septic arthritis: 2-10 per 100,000 person-years; monoarticular (usually knee) in 80-90%. PJI: 1-2% of primary joint replacements, 3-5% of revision arthroplasties — represents a massive burden given >1 million hip/knee replacements annually in the US. S. aureus is the dominant organism across all categories (40-60% of native bone/joint infections).",
    keyGuidelines: [
      { name: "IDSA 2015 Vertebral Osteomyelitis Guidelines", detail: "THE definitive osteomyelitis guideline. Key recommendations: image-guided biopsy before antibiotics when feasible, 6-week parenteral (or oral with OVIVA caveats) therapy for most vertebral osteomyelitis, CRP trending for treatment response, MRI as gold standard imaging. Emphasizes pathogen-directed therapy over empiric prolonged courses.", sourceIds: ["idsa-2015-vertebral-osteomyelitis"] },
      { name: "IDSA 2013 Prosthetic Joint Infection Guidelines", detail: "Comprehensive PJI management guideline. Defines DAIR (debridement, antibiotics, implant retention) vs. one-stage vs. two-stage exchange criteria. Rifampin for Staphylococcal PJI with retained implants. Duration: 3 months (hip) to 6 months (knee) for two-stage exchange after reimplantation.", sourceIds: ["idsa-2013-pji"] },
      { name: "2018 International Consensus Meeting (ICM) on PJI", detail: "Updated PJI diagnostic criteria: major criteria (sinus tract, two positive cultures of same organism) and minor criteria (elevated serum CRP, elevated serum D-dimer, elevated synovial WBC, elevated synovial alpha-defensin, single positive culture, positive histology). Scoring system for PJI diagnosis.", sourceIds: ["icm-2018-pji"] },
      { name: "AAHKS 2023 Chronic PJI Practice Patterns", detail: "Survey-based AAHKS report describing contemporary surgical preferences for chronic knee PJI, including staged exchange dominance and selective use of DAIR. Useful as a real-world orthopedic companion to IDSA and ICM consensus documents rather than a formal evidence-graded guideline.", sourceIds: ["aahks-2023-chronic-pji-practice-patterns"] },
    ],
    landmarkTrials: [
      { name: "OVIVA Trial (Li et al., NEJM 2019)", detail: "PARADIGM-SHIFTING RCT: Oral Versus Intravenous Antibiotics for Bone and Joint Infection. 1,054 patients with bone/joint infections (osteomyelitis, septic arthritis, PJI, fracture-related infections) randomized to continued IV vs. oral step-down after ≤7 days of IV therapy. Oral was NON-INFERIOR (treatment failure 14.6% vs 14.8%). Changed practice: oral step-down is now acceptable for MOST bone/joint infections when using agents with excellent oral bioavailability and bone penetration. Key caveats: must use the RIGHT oral agents (fluoroquinolones, rifampin combinations, linezolid, TMP-SMX — NOT amoxicillin or cephalexin monotherapy for bone infections).", sourceIds: ["oviva"] },
      { name: "DATIPO Trial (Wouthuyzen-Bakker et al., 2021)", detail: "RCT evaluating 6 vs 12 weeks of antibiotics after DAIR for PJI. Results suggest 6 weeks may be sufficient for selected PJI cases treated with DAIR, though practice remains variable. Supports the trend toward shorter courses when surgical source control is adequate.", sourceIds: ["datipo"] },
      { name: "Zimmerli et al., NEJM 1998 — Rifampin for Staphylococcal PJI", detail: "Seminal RCT establishing rifampin + ciprofloxacin for Staphylococcal PJI with retained implants. Rifampin combination had 100% cure vs. 58% without rifampin. Established the principle that rifampin is ESSENTIAL for biofilm infections on prosthetic material. Every Staphylococcal PJI management plan should include rifampin (with an appropriate companion drug).", sourceIds: ["zimmerli-1998-rifampin-pji"] },
      { name: "IDSA POET-like oral step-down extrapolation", detail: "While POET was an endocarditis trial, its principles of oral step-down after initial IV stabilization have been adopted alongside OVIVA for bone/joint infections. The combined message: prolonged IV therapy via PICC is not always necessary, and high-dose oral regimens with bone-penetrating agents are a viable alternative.", sourceIds: ["poet", "oviva", "orthopedic-id-review"] },
    ],
    riskFactors: "Osteomyelitis: hematogenous seeding from bacteremia (vertebral osteomyelitis in adults, long-bone metaphysis in children), contiguous spread from soft tissue infection (diabetic foot, decubitus ulcers, post-surgical), trauma/open fractures, vascular insufficiency (diabetic/PVD). Septic arthritis: pre-existing joint disease (RA, OA, gout — damaged joints are vulnerable), recent joint surgery/injection, prosthetic joints, bacteremia from any source, immunosuppression (diabetes, cirrhosis, ESRD, rheumatologic immunosuppressants), IDU, skin breakdown overlying joints. PJI: revision arthroplasty (3-5x risk vs. primary), prior PJI, obesity (BMI >40), diabetes, RA, immunosuppression, prolonged operative time, superficial surgical site infection.",
  },
  subcategories: [
    {
      id: "vertebral-osteomyelitis",
      name: "Vertebral Osteomyelitis (Native Spine)",
      definition: "Infection of the vertebral body ± intervertebral disc (spondylodiscitis). The most common form of osteomyelitis in adults. Usually hematogenous (bacteremia seeds the vertebral endplate). S. aureus causes 40-60% of cases. Lumbar spine is most commonly affected (50%), followed by thoracic (35%) and cervical (15%). Can be complicated by epidural abscess (15-20%), paravertebral abscess, or spinal cord compression — neurologic emergency.",
      clinicalPresentation: "Insidious onset: weeks to months of progressive back pain (axial, localized, worse at night, not relieved by rest). Fever in 50-60% (often low-grade). Neurologic deficits in 15-30%: radiculopathy (nerve root compression), myelopathy (cord compression — weakness, sensory changes, bowel/bladder dysfunction). CRITICAL: new neurologic deficits = EMERGENT MRI and neurosurgical consultation. Risk factors to seek: recent bacteremia, IDU, spinal procedures, endocarditis, immunosuppression. Physical exam: point tenderness over affected vertebrae, paraspinal muscle spasm, limited range of motion.",
      diagnostics: "MRI spine with gadolinium = GOLD STANDARD (sensitivity 97%, specificity 93%). Look for: vertebral body edema, endplate erosion, disc space enhancement, epidural abscess, paravertebral collection. CT-guided needle biopsy: obtain BEFORE antibiotics whenever possible — culture yield drops from 70-80% to 30-50% after antibiotics. Biopsy is CRITICAL because pathogen-directed therapy for 6 weeks is far better than empiric broad-spectrum therapy for 6 weeks. Blood cultures: positive in 50-70% (S. aureus) — always obtain before antibiotics. Labs: CRP is the best trending marker (follow q1-2 weeks to assess treatment response). ESR also elevated but slower to respond. WBC often normal.",
      empiricTherapy: [
        {
          line: "Pre-Biopsy — Hold Antibiotics if Possible",
          options: [
            { drug: "hold-antibiotics", regimen: "Defer antibiotics until biopsy cultures obtained (if clinically stable)", notes: "THE MOST IMPORTANT DECISION IN VERTEBRAL OSTEOMYELITIS: If the patient is hemodynamically stable without sepsis or progressive neurologic deficits, HOLD antibiotics until CT-guided biopsy is performed. The 24-48h delay to obtain cultures before starting antibiotics is worth it — it changes the entire course of therapy. A biopsy that identifies MSSA means 6 weeks of cefazolin. Without a pathogen, you're stuck guessing with broad-spectrum empiric therapy. Exception: unstable patient, sepsis, or neurologic emergency — start empiric antibiotics immediately." },
          ],
        },
        {
          line: "Empiric — When Antibiotics Cannot Wait",
          options: [
            { drug: "vancomycin", regimen: "Vancomycin IV (AUC-guided) + Ceftriaxone 2g IV daily", notes: "Covers MRSA + MSSA + Streptococci + most Enterobacterales. This is the standard empiric combination when you must start before cultures. Vancomycin for MRSA, ceftriaxone for gram-negatives and Streptococci. If cultures return MSSA, de-escalate to cefazolin immediately. If epidural abscess with concern for Pseudomonas (post-procedural, healthcare-associated): substitute cefepime for ceftriaxone." },
          ],
        },
        {
          line: "Pathogen-Directed Therapy (After Culture Results)",
          options: [
            { drug: "cefazolin", regimen: "Cefazolin 2g IV q8h × 6 weeks (MSSA)", notes: "PREFERRED for MSSA vertebral osteomyelitis. Transition to oral step-down after initial IV period per OVIVA data: high-dose oral agents with bone penetration (e.g., levofloxacin 750mg daily + rifampin 300-450mg BID for Staph, or TMP-SMX DS 2 tabs BID for MSSA). CRP trending guides response." },
            { drug: "vancomycin", regimen: "Vancomycin IV (AUC-guided) × 6 weeks (MRSA)", notes: "Standard for MRSA vertebral osteomyelitis. AUC/MIC 400-600. Monitor renal function closely over 6-week course. Oral step-down options for MRSA: TMP-SMX DS 2 tabs BID, linezolid 600mg BID (monitor for myelosuppression — limit to 4-6 weeks if possible), or doxycycline 100mg BID (if susceptible). Some ID physicians use daptomycin as the initial IV agent then step down." },
            { drug: "ceftriaxone", regimen: "Ceftriaxone 2g IV daily × 6 weeks (Streptococci, susceptible GN)", notes: "Once-daily dosing makes this ideal for OPAT. Excellent for Streptococcal vertebral osteomyelitis and susceptible gram-negative infections. Oral step-down: levofloxacin 750mg daily (if susceptible) or amoxicillin 1g TID (for Streptococci)." },
          ],
        },
        {
          line: "Duration & Monitoring",
          options: [
            { drug: "duration-osteo", regimen: "6 weeks total (parenteral + oral per OVIVA)", notes: "IDSA 2015: 6 weeks of parenteral (or equivalent oral per OVIVA) therapy. Start counting from day 1 of appropriate therapy after surgical debridement (if performed). CRP should be trended q1-2 weeks — a decreasing CRP confirms response. If CRP is not declining by week 2-3: re-evaluate (inadequate source control? wrong pathogen? abscess not drained? wrong antibiotic?). Repeat MRI only if clinical concern for worsening (NOT routine — MRI findings lag behind clinical improvement by weeks to months)." },
          ],
        },
      ],
      organismSpecific: [
        { organism: "S. aureus (MSSA)", preferred: "Cefazolin 2g IV q8h → oral step-down (levofloxacin + rifampin, or TMP-SMX)", alternative: "Nafcillin 2g IV q4h (if cefazolin allergy)", notes: "Most common organism. De-escalate from vancomycin as soon as MSSA confirmed. OVIVA-supported oral step-down with bone-penetrating agents after initial IV stabilization (typically 5-7 days). Rifampin combinations are particularly effective for bone infections but only when used with a companion drug." },
        { organism: "S. aureus (MRSA)", preferred: "Vancomycin IV (AUC-guided) → oral TMP-SMX or linezolid", alternative: "Daptomycin 8-10 mg/kg IV daily", notes: "Oral step-down: TMP-SMX DS 2 tabs BID is the workhorse for MRSA osteomyelitis oral therapy (good bone penetration, tolerable long-term). Linezolid 600mg BID is effective but limit duration due to myelosuppression (CBC weekly). Doxycycline 100mg BID if susceptible." },
        { organism: "Streptococci (viridans, S. pyogenes, S. agalactiae)", preferred: "Ceftriaxone 2g IV daily × 6 weeks → oral amoxicillin 1g TID", alternative: "Penicillin G IV", notes: "Ceftriaxone is ideal — once-daily OPAT. Oral step-down to high-dose amoxicillin works well given excellent Streptococcal susceptibility. S. agalactiae (GBS): common in elderly/diabetic vertebral osteomyelitis — often from urinary source." },
        { organism: "Enterobacterales (E. coli, Klebsiella)", preferred: "Ceftriaxone (if susceptible) → oral ciprofloxacin or levofloxacin", alternative: "Ertapenem 1g IV daily (if ESBL)", notes: "Fluoroquinolones have the best oral bioavailability and bone penetration for gram-negative osteomyelitis. Oral step-down to ciprofloxacin 750mg BID or levofloxacin 750mg daily is well-supported. For ESBL: ertapenem IV for OPAT, with limited oral options (discuss with ID)." },
        { organism: "Pseudomonas aeruginosa", preferred: "Cefepime 2g IV q8h or ciprofloxacin 750mg PO BID (if susceptible)", alternative: "Meropenem if resistant", notes: "Less common in vertebral osteomyelitis except post-procedural or IDU-associated. Ciprofloxacin is one of few oral antipseudomonal agents — makes OVIVA-style oral step-down possible. Duration: 6-8 weeks." },
        { organism: "Culture-negative (biopsy negative despite holding antibiotics)", preferred: "Vancomycin + ceftriaxone empirically × 6 weeks", alternative: "Consultation with ID for atypical organisms (TB, Brucella, fungi)", notes: "20-30% of biopsies are culture-negative. Consider: prior antibiotics suppressing growth, atypical organisms (Mycobacterium TB — especially in endemic areas or immunocompromised; Brucella — travel to endemic regions, livestock exposure; Coccidioides — Southwest US; Blastomyces). If culture-negative, send additional studies: AFB culture/smear, fungal culture, Brucella serologies, 16S rRNA PCR if tissue available." },
      ],
      pearls: [
        "GET THE BIOPSY BEFORE ANTIBIOTICS: This is the #1 principle. Holding antibiotics for 24-48h to obtain a CT-guided biopsy does not meaningfully worsen outcomes in stable patients, but it dramatically improves your ability to target therapy. A 6-week course of cefazolin (guided by MSSA culture) is far better than a 6-week course of vancomycin + cefepime (empiric guessing).",
        "OVIVA CHANGED EVERYTHING: Before OVIVA, bone/joint infections meant 6 weeks of IV antibiotics via PICC = mandatory OPAT. Now, oral step-down after initial IV stabilization is standard for most patients. The key is using the RIGHT oral agents: fluoroquinolones, TMP-SMX, rifampin combinations, linezolid, doxycycline. NOT cephalexin or amoxicillin monotherapy for Staphylococcal osteomyelitis.",
        "CRP IS YOUR BEST FRIEND FOR TRENDING: CRP responds faster than ESR and correlates with treatment response. Trend CRP q1-2 weeks. A falling CRP = things are working. A plateau or rise = re-evaluate everything (source control, pathogen, antibiotic choice). ESR takes weeks to months to normalize — less useful for real-time decisions.",
        "EPIDURAL ABSCESS IS THE FEARED COMPLICATION: 15-20% of vertebral osteomyelitis cases have concurrent epidural abscess. Any new neurologic deficit (weakness, sensory changes, bowel/bladder dysfunction) = emergent MRI and neurosurgical consultation. Delayed diagnosis leads to irreversible paraplegia. ALWAYS ask about neurologic symptoms in SAB patients with back pain.",
        "DO NOT REPEAT MRI ROUTINELY: MRI findings in osteomyelitis lag behind clinical improvement by weeks to months. A patient who is clinically improving with falling CRP does not need a repeat MRI at 6 weeks — it will still look bad and cause unnecessary concern. Repeat MRI only for: clinical worsening, new neurologic deficits, or failure to respond to appropriate therapy.",
      ],
    },
    {
      id: "septic-arthritis",
      name: "Septic Arthritis (Native Joint)",
      definition: "Direct bacterial infection of a joint space, most commonly the knee (50%), followed by hip, shoulder, and ankle. Monoarticular in 80-90% of cases. A medical emergency — purulent joint fluid causes rapid cartilage destruction within hours to days. S. aureus is responsible for 40-60% of cases. N. gonorrhoeae should be considered in sexually active young adults.",
      clinicalPresentation: "Acute onset of monoarticular joint pain, swelling, warmth, and erythema with severely limited range of motion. The joint is usually held in the position of maximum capsular volume (flexion for knee and hip). Fever in 60-80%. Risk factors: pre-existing joint disease (RA, OA, crystal arthropathy — damaged joints are vulnerable), recent joint surgery or injection, prosthetic joint, bacteremia, immunosuppression, IDU, skin infections. CRITICAL: Do NOT assume a hot swollen joint is gout — always aspirate to rule out septic arthritis, especially if fever is present. Crystal arthropathy and septic arthritis can COEXIST.",
      diagnostics: "ARTHROCENTESIS IS MANDATORY — aspirate the joint before antibiotics. Synovial fluid analysis: WBC >50,000/μL with >90% PMNs is highly suggestive (sensitivity ~60-80%), but lower counts do not exclude (especially in immunocompromised, partially treated, or prosthetic joints). Gram stain: positive in 50-75% of Staphylococcal cases, <50% for Streptococci, <25% for GN. Culture: gold standard — positive in 70-90%. Blood cultures: positive in 40-50% (always obtain). Crystal analysis: rule out gout/pseudogout BUT crystals do not exclude concurrent infection. CRP/ESR: elevated but nonspecific. Imaging: plain radiographs (baseline, rule out osteomyelitis), ultrasound (detect effusion, guide aspiration — especially hip), MRI if concern for adjacent osteomyelitis.",
      empiricTherapy: [
        {
          line: "Empiric — Pending Cultures",
          options: [
            { drug: "vancomycin", regimen: "Vancomycin IV (AUC-guided)", notes: "First-line empiric for native joint septic arthritis. Covers MRSA and MSSA (though inferior to beta-lactams for MSSA — will de-escalate once cultures return). Most septic arthritis is gram-positive (S. aureus 40-60%, Streptococci 15-20%). Add gram-negative coverage (ceftriaxone) if: immunocompromised, IDU, healthcare-associated, GI/GU source suspected." },
            { drug: "ceftriaxone", regimen: "Ceftriaxone 2g IV daily (add to vancomycin if GN risk)", notes: "For gram-negative coverage in high-risk patients. Also first-line empiric in suspected gonococcal arthritis (sexually active young adult with migratory polyarthralgia → monoarthritis + skin lesions). NAAT for GC/CT on urogenital, rectal, and pharyngeal sites." },
          ],
        },
        {
          line: "Pathogen-Directed Therapy",
          options: [
            { drug: "cefazolin", regimen: "Cefazolin 2g IV q8h × 3-4 weeks (MSSA)", notes: "De-escalate from vancomycin upon MSSA confirmation. Duration: 3-4 weeks for native joint septic arthritis (shorter than osteomyelitis if no bone involvement). Oral step-down per OVIVA: consider after 1-2 weeks IV if clinically responding, using bone-penetrating oral agents." },
            { drug: "ceftriaxone-gc", regimen: "Ceftriaxone 1g IV/IM daily × 7-14 days (gonococcal)", notes: "Gonococcal arthritis: excellent prognosis. Ceftriaxone 1g IV daily until clinical improvement (usually 24-48h), then oral step-down to cefixime or ciprofloxacin (if susceptible) to complete 7-14 days. Treat concurrent chlamydia empirically (azithromycin 1g or doxycycline 100mg BID × 7d)." },
          ],
        },
        {
          line: "Surgical Drainage",
          options: [
            { drug: "drainage-native", regimen: "Serial arthrocentesis or arthroscopic lavage", notes: "Purulent joints must be drained. Options: (1) Serial bedside arthrocentesis (daily or as needed until effusion resolves — works well for knee), (2) Arthroscopic lavage/debridement (preferred for hip, shoulder, and joints difficult to aspirate adequately), (3) Open arthrotomy (reserved for failed arthroscopic drainage, hip joint in some centers, or when debridement of necrotic tissue is needed). HIP SEPTIC ARTHRITIS: usually requires surgical drainage (deep joint, difficult to aspirate adequately at bedside)." },
          ],
        },
      ],
      organismSpecific: [
        { organism: "S. aureus (MSSA/MRSA)", preferred: "Cefazolin (MSSA) or vancomycin/daptomycin (MRSA) × 3-4 weeks", alternative: "TMP-SMX or linezolid for MRSA oral step-down", notes: "Most common cause. Aggressive joint destruction. Prompt drainage + antibiotics. Duration 3-4 weeks if no adjacent osteomyelitis; extend to 6 weeks if bone involvement confirmed on imaging." },
        { organism: "Streptococci (pyogenes, agalactiae, pneumoniae)", preferred: "Ceftriaxone 2g IV daily → oral amoxicillin 1g TID", alternative: "Penicillin G IV", notes: "S. agalactiae (GBS) increasingly common in elderly/diabetic. Good prognosis with appropriate therapy. Duration: 3-4 weeks." },
        { organism: "N. gonorrhoeae", preferred: "Ceftriaxone 1g IV daily → oral step-down", alternative: "Consult ID for cephalosporin allergy", notes: "Think about this in every sexually active young adult with acute monoarthritis. Two forms: disseminated gonococcal infection (DGI) with migratory polyarthralgia + dermatitis-arthritis syndrome, and purulent monoarthritis. Excellent prognosis. Always test for concurrent chlamydia and treat empirically." },
        { organism: "Gram-negatives (E. coli, Pseudomonas)", preferred: "Ceftriaxone or cefepime (based on susceptibilities)", alternative: "Ciprofloxacin PO for oral step-down", notes: "More common in elderly, immunocompromised, IDU, and GU/GI-source bacteremia. Pseudomonas: consider in IDU (sternoclavicular joint classically). Duration: 3-4 weeks." },
      ],
      pearls: [
        "ASPIRATE FIRST, THEN ANTIBIOTICS: Synovial fluid culture is the gold standard. Once antibiotics are started, culture yield drops significantly. If the joint is hot and swollen, aspirate it — even in the middle of the night. The tap is both diagnostic AND therapeutic (decompresses the joint).",
        "CRYSTALS DON'T EXCLUDE INFECTION: Finding urate or CPPD crystals in synovial fluid does NOT rule out concurrent septic arthritis. Up to 5% of septic joints have concurrent crystal disease. If the clinical picture suggests infection (fever, very high WBC count, immunocompromised), treat for BOTH and let cultures guide final management.",
        "HIP SEPTIC ARTHRITIS = SURGICAL EMERGENCY: The hip joint is deep, difficult to aspirate adequately at bedside, and highly susceptible to avascular necrosis from increased intra-articular pressure. Most orthopedic surgeons prefer operative drainage for hip septic arthritis rather than serial bedside aspiration.",
        "GONOCOCCAL ARTHRITIS HAS EXCELLENT PROGNOSIS: Unlike other forms of septic arthritis, gonococcal arthritis rarely causes permanent joint damage if treated promptly. Short course of ceftriaxone is usually curative. Always screen for concurrent STIs.",
      ],
    },
    {
      id: "prosthetic-joint-infection",
      name: "Prosthetic Joint Infection (PJI)",
      definition: "Infection of a prosthetic joint (hip, knee, shoulder, etc.). Classified by timing: early (<3 months post-op, typically aggressive organisms acquired at surgery — S. aureus, GN), delayed (3-12 months, indolent organisms — CoNS, Cutibacterium acnes), and late (>12 months, usually hematogenous seeding from distant source). PJI management requires close collaboration between orthopedics, ID, and pharmacy. Cure rates depend heavily on surgical approach selection.",
      clinicalPresentation: "Early PJI: acute onset wound drainage, erythema, warmth, pain at surgical site within weeks of surgery. Delayed PJI: progressive joint pain and stiffness without dramatic inflammatory signs — often misdiagnosed as aseptic loosening for months. Late PJI: acute onset joint pain after a period of good function — often preceded by documented bacteremia (dental procedure, UTI, skin infection). Sinus tract communicating with the prosthesis = PJI by definition (IDSA major criterion). Periprosthetic fracture with unexplained loosening should raise concern for occult PJI.",
      diagnostics: "2018 ICM criteria (scoring system): MAJOR CRITERIA (either = definite PJI): (1) Sinus tract communicating with joint, (2) Two positive cultures of same organism from separate samples. MINOR CRITERIA (scored): Elevated serum CRP (>1 mg/dL for chronic, >10 for acute), elevated D-dimer (>860 ng/mL), elevated synovial WBC (>3,000 for chronic PJI, >10,000 for acute), positive synovial alpha-defensin, elevated synovial CRP, positive histology (>5 PMN/HPF), single positive culture, positive leukocyte esterase (++ on strip). CRITICAL: obtain at least 3-5 intraoperative tissue cultures (ideally 5-6) from different areas. Hold antibiotics ≥2 weeks pre-operatively if possible to maximize culture yield. Sonication of explanted prosthesis increases sensitivity for biofilm organisms.",
      empiricTherapy: [
        {
          line: "Surgical Strategy — The Most Important Decision",
          options: [
            { drug: "dair", regimen: "DAIR: Debridement, Antibiotics, and Implant Retention", notes: "Criteria for DAIR: (1) Early PJI (<30 days post-op) OR acute hematogenous PJI with symptoms <3 weeks, (2) Stable, well-fixed implant, (3) Intact soft tissue envelope, (4) Susceptible organism (ideally Staphylococcus amenable to rifampin), (5) NOT a highly virulent or resistant organism. DAIR success: 55-75% (organism-dependent — better for Streptococci, worse for MRSA and resistant GN). If ANY DAIR criterion is not met → exchange arthroplasty." },
            { drug: "two-stage", regimen: "Two-Stage Exchange: Explant → antibiotic spacer → 6-8 weeks antibiotics → reimplantation", notes: "Gold standard for chronic PJI, PJI failing DAIR, resistant organisms, compromised soft tissues. Stage 1: remove all prosthetic components and cement, aggressive debridement, place antibiotic-loaded cement spacer. Pathogen-directed systemic antibiotics × 6-8 weeks (some use 4-6 weeks after spacer). Stage 2: reimplant after antibiotic holiday + negative inflammatory markers ± re-aspiration. Success: 85-95%." },
            { drug: "one-stage", regimen: "One-Stage Exchange: Explant + immediate reimplantation in single surgery", notes: "Gaining popularity in selected cases: healthy patient, susceptible organism (especially Streptococci), no sinus tract, healthy soft tissues. Advantage: single surgery, faster functional recovery. The INFORM trial (2022) showed non-inferiority of one-stage vs. two-stage for selected hip and knee PJI. Success: 85-95% in appropriate candidates." },
          ],
        },
        {
          line: "Antibiotic Therapy for DAIR (Staphylococcal PJI)",
          options: [
            { drug: "cefazolin-rifampin-dair", regimen: "Cefazolin 2g IV q8h + Rifampin 300-450mg PO q12h × 2-6 weeks IV, then oral companion + rifampin to complete 3 months (hip) or 6 months (knee)", notes: "For MSSA PJI treated with DAIR. Rifampin is ESSENTIAL — it penetrates biofilm and kills sessile organisms on prosthetic material. NEVER use rifampin alone (resistance in 1-2 days). Start rifampin only AFTER initial debridement and once bacteremia has cleared (rifampin resistance can emerge if used during active bacteremia). Oral companion drugs for rifampin: levofloxacin 500mg daily (preferred for MSSA), TMP-SMX DS 1 tab BID, or doxycycline 100mg BID." },
            { drug: "vanc-rifampin-dair", regimen: "Vancomycin IV (AUC-guided) + Rifampin 300-450mg PO q12h × 2-6 weeks IV, then oral companion + rifampin to complete 3-6 months", notes: "For MRSA PJI treated with DAIR. Same rifampin principles. Oral companions for MRSA: TMP-SMX DS 1 tab BID + rifampin (most common), linezolid 600mg BID + rifampin (limit linezolid duration — myelosuppression), or doxycycline 100mg BID + rifampin (if susceptible). Total duration: 3 months (hip) or 6 months (knee)." },
          ],
        },
        {
          line: "Antibiotic Therapy for Two-Stage Exchange",
          options: [
            { drug: "two-stage-abx", regimen: "Pathogen-directed IV/oral therapy × 4-6 weeks between stages", notes: "After stage 1 (explant + debridement): pathogen-directed systemic antibiotics for 4-6 weeks. Rifampin is NOT needed during the spacer phase (no retained implant — no biofilm target). After completion of antibiotics: 2-4 week antibiotic-free holiday. Check CRP, aspirate joint if feasible. If markers normalizing and aspirate negative → proceed to stage 2 (reimplant). After stage 2: some protocols use perioperative prophylaxis only; others use 4-6 weeks of pathogen-directed therapy post-reimplantation. Practice varies." },
          ],
        },
      ],
      organismSpecific: [
        { organism: "Staphylococcus aureus (MSSA/MRSA)", preferred: "DAIR + rifampin combination (if DAIR criteria met); two-stage exchange if chronic", alternative: "Daptomycin IV for MRSA if vancomycin intolerant", notes: "Most important principle: RIFAMPIN for any retained prosthetic material. For two-stage exchange, rifampin is used post-reimplantation (stage 2), not during the spacer phase." },
        { organism: "CoNS (S. epidermidis — most common cause of delayed PJI)", preferred: "Vancomycin + rifampin (most CoNS are methicillin-resistant) for DAIR; pathogen-directed for exchange", alternative: "Daptomycin + rifampin", notes: "S. epidermidis is THE biofilm organism. Low virulence but tenacious — forms thick biofilm on prosthetic surfaces. Usually methicillin-resistant (80-90%). Responds well to DAIR + rifampin if detected early. Delayed PJI (3-12 months) with progressive pain and loosening is the classic CoNS PJI presentation." },
        { organism: "Cutibacterium acnes (shoulder PJI)", preferred: "Penicillin G or amoxicillin × 6 weeks", alternative: "Ceftriaxone, clindamycin", notes: "The DOMINANT organism in shoulder PJI (>50% in some series). Extremely slow-growing — cultures must be held for 14 days (standard 5-day incubation misses it). Low virulence, indolent presentation. Responds well to simple penicillin derivatives. Consider this organism in any shoulder PJI with negative standard cultures." },
        { organism: "Streptococci", preferred: "Ceftriaxone 2g IV daily + rifampin for DAIR; ceftriaxone alone for exchange", alternative: "Penicillin G or amoxicillin", notes: "Good prognosis — DAIR cure rates for Streptococcal PJI are higher than Staphylococcal PJI (>80%). Rifampin still recommended for retained implants. One-stage exchange may be particularly appropriate for Streptococcal PJI." },
      ],
      pearls: [
        "RIFAMPIN IS MANDATORY FOR STAPHYLOCOCCAL PJI WITH RETAINED IMPLANTS: The Zimmerli trial showed 100% cure with rifampin vs. 58% without. Rifampin penetrates biofilm and kills sessile bacteria. NEVER use rifampin monotherapy (resistance in 1-2 days). Always pair with an active companion drug. Start rifampin AFTER debridement and bloodstream clearance.",
        "HOLD CULTURES 14 DAYS FOR SHOULDER PJI: Cutibacterium acnes is the dominant shoulder PJI pathogen and takes 10-14 days to grow. Standard 5-day culture incubation misses it. If your microbiology lab discards shoulder PJI cultures at 5 days, you are systematically missing the most common pathogen.",
        "3 MONTHS (HIP) vs 6 MONTHS (KNEE) FOR DAIR: The longer duration for knee PJI reflects poorer soft tissue coverage and higher failure rates compared to hip PJI treated with DAIR. This is IDSA 2013 guidance and remains standard.",
        "ANTIBIOTIC-LOADED CEMENT SPACERS: The spacer delivers high local antibiotic concentrations (vancomycin + tobramycin or gentamicin is the most common combination). This is adjunctive to systemic antibiotics, not a replacement. The spacer also maintains joint space and limb length between stages.",
        "THE RIFAMPIN DRUG INTERACTION LIST IS ENORMOUS: Rifampin is one of the most potent CYP inducer known. It reduces levels of: warfarin, statins, oral contraceptives, calcineurin inhibitors (cyclosporine, tacrolimus), HIV antiretrovirals, azole antifungals, methadone, and dozens more. Review the entire medication list before starting rifampin. This is a critical pharmacist intervention.",
      ],
    },
    {
      id: "diabetic-foot-osteo",
      name: "Diabetic Foot Osteomyelitis",
      definition: "Osteomyelitis complicating diabetic foot infections (DFI), occurring in 20-60% of moderate-severe DFIs. Usually contiguous spread from an overlying infected ulcer (not hematogenous). The diagnostic challenge is distinguishing osteomyelitis from Charcot neuroarthropathy and soft tissue infection. Management decisions include medical-only treatment vs. surgical resection, which fundamentally changes antibiotic duration.",
      clinicalPresentation: "Chronic non-healing diabetic foot ulcer with underlying bone exposure or palpable bone on probing. Probe-to-bone (PTB) test: positive when a sterile metal probe inserted through the ulcer contacts gritty bone (PPV ~89% in high pre-test probability patients). Sausage toe: diffuse swelling of entire digit suggests underlying osteomyelitis. Often minimal systemic symptoms (no fever, normal WBC) due to peripheral neuropathy and vascular insufficiency masking inflammatory response.",
      diagnostics: "Probe-to-bone test (perform on every DFI ulcer). Plain radiographs: cortical erosion, periosteal reaction, but 30-50% sensitivity (changes take 2-3 weeks to appear). MRI: gold standard — sensitivity 90%, specificity 80% for DFI osteomyelitis. ESR >70 mm/h: high specificity for osteomyelitis in DFI setting. BONE BIOPSY: gold standard for definitive diagnosis and pathogen identification. Obtain percutaneous or intraoperative bone biopsy BEFORE starting antibiotics whenever possible. Surface wound cultures DO NOT reflect bone pathogens — they grow colonizers.",
      empiricTherapy: [
        {
          line: "Medical Management (No Bone Resection)",
          options: [
            { drug: "medical-osteo", regimen: "Pathogen-directed therapy × 4-6 weeks (based on BONE culture, not wound swab)", notes: "If treating medically without surgery: 4-6 weeks of antibiotics directed by bone biopsy culture. OVIVA supports oral step-down with appropriate agents. CRP and clinical response guide adequacy. CRITICAL: surface wound swab cultures do NOT guide osteomyelitis therapy — you must have bone culture. If no bone biopsy is obtainable, empiric coverage of the most likely pathogens (S. aureus ± GN based on clinical context)." },
          ],
        },
        {
          line: "Post-Surgical Resection (Complete Bone Removal)",
          options: [
            { drug: "post-resection", regimen: "1-2 weeks of antibiotics post-resection if clean margins", notes: "If infected bone is COMPLETELY resected with confirmed clean margins on histology: antibiotics can be shortened dramatically to 1-2 weeks (some experts use 5-7 days post-resection). This is a paradigm shift from 6-week courses — adequate surgery can substitute for prolonged antibiotics. The pathology report confirming clean margins is essential." },
          ],
        },
      ],
      organismSpecific: [
        { organism: "S. aureus (MSSA/MRSA)", preferred: "Cefazolin or vancomycin (based on susceptibility)", alternative: "TMP-SMX or linezolid for oral step-down", notes: "Most common single organism in DFI osteomyelitis. Bone biopsy culture is the only reliable way to confirm. OVIVA-style oral step-down with appropriate agents is reasonable." },
        { organism: "Polymicrobial (chronic DFI)", preferred: "Broad-spectrum based on deep culture (e.g., pip-tazo + vancomycin)", alternative: "Ertapenem + vancomycin", notes: "Chronic DFI osteomyelitis is often polymicrobial — Staphylococci + Streptococci + Enterobacterales + anaerobes. This is why bone biopsy matters — treating every organism from a wound swab leads to unnecessarily broad 6-week regimens." },
      ],
      pearls: [
        "SURFACE WOUND CULTURES ARE USELESS FOR OSTEOMYELITIS: This cannot be overstated. The organisms colonizing the surface of a chronic diabetic ulcer (Pseudomonas, Corynebacterium, mixed flora) are NOT the organisms infecting the bone. ALWAYS obtain bone cultures (biopsy or intraoperative). A 6-week antibiotic course should never be based on a surface swab.",
        "OVIVA + SURGERY = PARADIGM SHIFT: For DFI osteomyelitis treated with complete bone resection and clean margins, antibiotics can be as short as 5-7 days. This is dramatically different from the traditional 6-week IV dogma. The surgery does the heavy lifting; antibiotics are adjunctive.",
        "VASCULAR ASSESSMENT BEFORE ANTIBIOTICS: No antibiotic can cure osteomyelitis in an ischemic limb. Check ankle-brachial index, toe pressures, or transcutaneous oxygen. If vascular disease is present, revascularization is needed for healing. Multidisciplinary approach (vascular surgery + ID + podiatry + wound care) is essential.",
        "PROBE-TO-BONE: FREE, FAST, AND INFORMATIVE: Every clinician seeing DFI should perform this test. Positive PTB in a high-risk patient has PPV ~89% for osteomyelitis. Negative PTB has NPV ~56% (doesn't rule it out). Takes 30 seconds and requires only a sterile blunt probe.",
      ],
    },
  ],
  drugMonographs: [
    {
      id: "rifampin",
      name: "Rifampin",
      brandNames: "Rifadin, Rimactane",
      drugClass: "Rifamycin antibiotic (RNA polymerase inhibitor)",
      mechanismOfAction: "Inhibits DNA-dependent RNA polymerase, blocking RNA transcription. BACTERICIDAL with rapid, concentration-dependent killing. CRITICAL PROPERTY: rifampin penetrates and is active within BIOFILM — the protective matrix that organisms form on prosthetic material, dead bone, and foreign bodies. This is the only commonly used antibiotic with clinically meaningful biofilm activity. This property makes rifampin ESSENTIAL for prosthetic material infections (PJI, prosthetic valve IE). Rifampin also penetrates intracellularly, killing S. aureus within macrophages and osteoblasts.",
      spectrum: "Gram-positive: Excellent — S. aureus (MSSA and MRSA), CoNS, Streptococci. Gram-negative: moderate activity against some (not clinically used). Mycobacteria: first-line for TB (M. tuberculosis), M. leprae. UNIQUE: biofilm-embedded organisms. GAPS: Enterococcus, most gram-negatives, anaerobes. CRITICAL RULE: NEVER use rifampin as monotherapy — resistance develops in 1-2 days via single-step RNA polymerase mutations. ALWAYS combine with an active companion drug.",
      dosing: {
        pji: "300-450mg PO every 12h (most common for PJI/bone infections)",
        prosthetic_valve_ie: "300-450mg PO every 8h",
        tb: "10 mg/kg/day PO (max 600mg) once daily",
        meningococcal_prophylaxis: "600mg PO q12h × 2 days",
      },
      renalAdjustment: "No dose adjustment — hepatically metabolized, biliary excretion. Not removed by hemodialysis.",
      hepaticAdjustment: "USE WITH CAUTION in hepatic impairment. Rifampin is hepatotoxic — monitor LFTs baseline and periodically. In severe hepatic disease, consider dose reduction or alternative agents.",
      adverseEffects: {
        common: "GI intolerance (nausea, anorexia), orange/red discoloration of body fluids (urine, tears, sweat, saliva — WARN PATIENTS, stains contact lenses), elevated LFTs (transaminases)",
        serious: "Hepatotoxicity (1-3%, dose-dependent — monitor LFTs), thrombocytopenia (immune-mediated, especially with intermittent dosing), acute kidney injury (interstitial nephritis, especially with intermittent dosing), flu-like syndrome (with intermittent/resumed dosing)",
        rare: "Severe hepatic failure, hemolytic anemia, acute renal failure, shock-like syndrome (with intermittent high-dose use)",
      },
      drugInteractions: [
        "WARFARIN — rifampin is one of the most potent CYP inducers known. Dramatically reduces warfarin levels. May need 2-3x the usual warfarin dose. Monitor INR very closely when starting AND stopping (rebound increase when rifampin discontinued).",
        "ORAL CONTRACEPTIVES — rendered ineffective. Must use alternative contraception during rifampin therapy.",
        "CALCINEURIN INHIBITORS (cyclosporine, tacrolimus) — levels drastically reduced. Transplant patients on rifampin need very close monitoring and major dose increases.",
        "STATINS — most statins are CYP3A4 substrates. Levels significantly reduced by rifampin. May need to increase statin dose or switch agents.",
        "HIV ANTIRETROVIRALS (particularly PIs and NNRTIs) — complex interactions. Consult ID/pharmacist for HIV patients needing rifampin.",
        "METHADONE — rifampin reduces methadone levels, can precipitate withdrawal. Critical in IDU patients with PJI or endocarditis.",
        "AZOLE ANTIFUNGALS — voriconazole, itraconazole, posaconazole levels dramatically reduced. Concomitant use often contraindicated.",
        "DAPTOMYCIN — rifampin may reduce daptomycin efficacy (antagonism in some in vitro models). Some experts avoid this combination, though clinical data is limited.",
      ],
      monitoring: "LFTs at baseline, then q2-4 weeks (hepatotoxicity). CBC with platelets (thrombocytopenia). Renal function. Drug interactions — review ENTIRE medication list before starting. Clinical efficacy — CRP trending for bone/joint infections. Warn about orange discoloration of body fluids.",
      pregnancyLactation: "Pregnancy Category C. Teratogenic in animals at high doses. Use only when clearly needed. Crosses placenta. Excreted in breast milk. For TB in pregnancy: rifampin is part of standard treatment despite category C designation — benefits outweigh risks.",
      pharmacistPearls: [
        "THE DRUG INTERACTION LIST IS YOUR JOB: Rifampin interacts with EVERYTHING metabolized by CYP450 (CYP3A4, CYP2C9, CYP2C19, CYP1A2). Before starting rifampin, the pharmacist MUST review the entire medication list. Common catches: warfarin (dose increase needed), oral contraceptives (backup needed), statins (increase dose or switch), methadone (increase dose or withdraw), calcineurin inhibitors (transplant patients — major dose changes). This review is arguably the highest-value pharmacist intervention in PJI management.",
        "NEVER MONOTHERAPY: Resistance to rifampin develops via single-step RNA polymerase mutations at a frequency of 10⁻⁷ to 10⁻⁸. Monotherapy selects resistant mutants in 1-2 days. ALWAYS combine with an active companion drug. The companion should have independent activity against the organism.",
        "START RIFAMPIN AFTER DEBRIDEMENT AND BLOODSTREAM CLEARANCE: Do not start rifampin on day 1 of empiric therapy for a bacteremic patient. The high bacterial load during bacteremia increases the probability of selecting rifampin-resistant mutants. Wait until surgical debridement is complete and blood cultures are clearing, THEN add rifampin.",
        "ORANGE BODY FLUIDS: Warn patients that urine, tears, sweat, and saliva will turn orange/red. This stains contact lenses permanently — switch to glasses. Stains are harmless but alarming if unexpected. This counseling point prevents unnecessary ER visits.",
        "THE ARREST TRIAL DISTINCTION: Rifampin is NOT beneficial for native valve SAB (ARREST trial — no benefit, added toxicity). BUT rifampin IS essential for prosthetic material infections (PJI, prosthetic valve IE — Zimmerli trial showed dramatic benefit). The distinction is BIOFILM: prosthetic material has biofilm, native valves do not.",
      ],
    },
    {
      id: "linezolid",
      name: "Linezolid",
      brandNames: "Zyvox",
      drugClass: "Oxazolidinone antibiotic (first-in-class)",
      mechanismOfAction: "Binds to 23S ribosomal RNA of the 50S subunit, preventing formation of the 70S initiation complex and blocking protein synthesis. BACTERIOSTATIC against most organisms (Staphylococci, Enterococci), but bactericidal against Streptococci. Unique binding site — no cross-resistance with other protein synthesis inhibitors. 100% oral bioavailability — IV and PO are bioequivalent.",
      spectrum: "Gram-positive ONLY. Excellent: MRSA, MSSA, VRE (E. faecium AND E. faecalis — one of few oral VRE-active agents), Streptococci, CoNS, Nocardia. GAPS: ALL gram-negatives, ALL anaerobes (minimal activity). NOTE: bacteriostatic against Staphylococci — this matters for endocarditis and bacteremia where bactericidal agents are preferred (daptomycin, beta-lactams).",
      dosing: {
        standard: "600mg IV or PO q12h",
        bone_joint: "600mg PO BID (OVIVA-supported for oral step-down in bone infections)",
        pneumonia: "600mg IV/PO q12h (MRSA pneumonia — linezolid preferred over vancomycin for lung penetration)",
        ssti: "600mg IV/PO q12h × 10-14 days",
        vre: "600mg IV/PO q12h",
      },
      renalAdjustment: "No dose adjustment — not primarily renally eliminated. HOWEVER: two metabolites accumulate in renal impairment and may contribute to toxicity (myelosuppression). Monitor CBC more closely in renal impairment.",
      hepaticAdjustment: "No adjustment for mild-moderate. Limited data in severe hepatic impairment.",
      adverseEffects: {
        common: "GI (nausea, diarrhea), headache, thrombocytopenia (dose and duration-dependent — most common with courses >2 weeks)",
        serious: "Myelosuppression (thrombocytopenia 2-5%, anemia, neutropenia — reversible, monitor CBC weekly), peripheral neuropathy (cumulative, courses >4 weeks), optic neuritis (rare, reversible if caught early), lactic acidosis (mitochondrial toxicity — rare but potentially fatal)",
        rare: "Serotonin syndrome (weak MAO inhibitor — see drug interactions), severe lactic acidosis, irreversible peripheral neuropathy (if prolonged use unmonitored)",
      },
      drugInteractions: [
        "SEROTONERGIC DRUGS — linezolid is a weak, reversible MAO inhibitor. Risk of serotonin syndrome with SSRIs, SNRIs, trazodone, meperidine, tramadol, buspirone, St. John's wort. MANAGEMENT: for courses <14 days, many experts continue serotonergic agents with close monitoring. For longer courses, consider holding the serotonergic agent or choosing an alternative antibiotic. The risk is real but often overstated for short courses.",
        "Tyramine-containing foods — theoretical risk of hypertensive crisis due to MAO inhibition. Clinical significance is low with reversible MAO inhibition, but counsel patients to avoid large quantities of aged cheeses, fermented meats, and tap beer.",
        "Sympathomimetics (pseudoephedrine, phenylephrine) — potential for hypertension. Avoid or monitor.",
      ],
      monitoring: "CBC with platelets WEEKLY (mandatory — thrombocytopenia is dose-limiting). For courses >4 weeks: visual acuity testing (optic neuritis), neurologic assessment (peripheral neuropathy — numbness/tingling in extremities). Lactate if unexplained acidosis. Serotonin syndrome monitoring if on serotonergic agents.",
      pregnancyLactation: "Pregnancy Category C. Animal studies show decreased fetal viability at high doses. Limited human data. Use only when benefit clearly outweighs risk. Excreted in breast milk in animal studies.",
      pharmacistPearls: [
        "100% ORAL BIOAVAILABILITY = NO REASON FOR IV: Linezolid PO and IV achieve identical serum levels. If the patient can swallow, use oral. IV linezolid costs 10-20x more than oral for no pharmacokinetic benefit. This is one of the most impactful IV-to-PO stewardship interventions.",
        "THROMBOCYTOPENIA IS THE DOSE-LIMITING TOXICITY: Onset typically after 10-14 days. Monitor platelets weekly without exception. Risk factors: renal impairment, baseline low platelets, duration >2 weeks. Usually reversible upon discontinuation. If platelets drop <100K or >50% from baseline, reassess risk-benefit.",
        "BONE PENETRATION MAKES IT VALUABLE FOR OSTEOMYELITIS: Linezolid achieves bone concentrations that are 40-60% of serum — among the highest of any antibiotic. Combined with 100% oral bioavailability, it's an excellent OVIVA-style oral step-down option for MRSA osteomyelitis. Duration limitation (myelosuppression >4-6 weeks) is the main constraint.",
        "THE MAO INHIBITOR INTERACTION IS REAL BUT NUANCED: For short courses (≤14 days), many ID pharmacists and physicians continue SSRIs/SNRIs with monitoring rather than holding them. For bone/joint infections requiring weeks of linezolid, the serotonergic drug should be held or an alternative antibiotic chosen. The key is duration-dependent risk assessment.",
        "MRSA PNEUMONIA: LINEZOLID > VANCOMYCIN: Vancomycin achieves poor lung concentrations (epithelial lining fluid levels are only 10-25% of serum). Linezolid achieves ELF concentrations exceeding serum levels. For MRSA pneumonia, linezolid is preferred. The ZEPHyR trial showed numerical superiority of linezolid over vancomycin for MRSA nosocomial pneumonia (though primary endpoint differences were debated).",
      ],
    },
  ],
};
