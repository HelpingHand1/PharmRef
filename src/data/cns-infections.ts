// Editorial source for the CNS Infections disease module.
// Runtime imports use src/data/generated/diseases/cns-infections.ts.
import type { DiseaseState } from "../types";
import { CNS_INFECTIONS_MONOGRAPH_ENHANCEMENTS } from "./penetration-content";
import { enhanceDisease } from "./stewardship-content";

const CNS_INFECTIONS_BASE: DiseaseState = {
  id: "cns-infections",
  name: "CNS Infections",
  icon: "🧠",
  category: "Infectious Disease — IDSA 2004/2017 + ESCMID 2016",
  overview: {
    definition: "Central nervous system infections encompass bacterial meningitis (infection of the meninges), encephalitis (infection of brain parenchyma), and brain abscess (focal suppurative collection within the brain). These infections represent true medical emergencies where delays in antibiotic therapy of even 1-2 hours measurably increase mortality. The blood-brain barrier (BBB) creates unique pharmacologic challenges — most antibiotics achieve poor CNS penetration, requiring higher doses, specific drug selection, and sometimes intrathecal administration.",
    epidemiology: "Bacterial meningitis: incidence 1-2 per 100,000 in developed countries (dramatically reduced by pneumococcal and meningococcal conjugate vaccines). S. pneumoniae and N. meningitidis account for >80% of community-acquired cases in adults. Listeria monocytogenes risk increases with age >50, immunosuppression, and pregnancy. Neonatal meningitis: GBS and E. coli dominate. Post-neurosurgical meningitis: Staphylococci and gram-negatives. Brain abscess: 1,500-2,500 cases/year in the US. Sources: contiguous spread (sinusitis, otitis, dental infection), hematogenous (endocarditis, lung abscess, IDU), or post-neurosurgical/trauma. Mortality for bacterial meningitis: 15-25% overall (S. pneumoniae ~20-30%, N. meningitidis ~10%, Listeria ~20-30%).",
    keyGuidelines: [
      { name: "IDSA 2004 Bacterial Meningitis Guidelines", detail: "Foundation document for meningitis management. Established empiric regimens by age group, adjunctive dexamethasone for pneumococcal meningitis, and pathogen-specific therapy. Despite age, remains the most cited meningitis guideline. Key updates have been incorporated via expert consensus rather than formal guideline revision.", sourceIds: ["idsa-2004-bacterial-meningitis"] },
      { name: "IDSA 2017 Healthcare-Associated Ventriculitis/Meningitis", detail: "Guidelines for post-neurosurgical, post-traumatic, and device-related CNS infections. Covers external ventricular drain (EVD) infections, VP shunt infections, and post-craniotomy meningitis. Emphasizes intraventricular antibiotic administration for difficult-to-treat pathogens.", sourceIds: ["idsa-2017-ventriculitis-meningitis"] },
      { name: "ESCMID 2016 Community-Acquired Bacterial Meningitis", detail: "European guidelines with updated evidence review. Stronger emphasis on adjunctive dexamethasone, updated duration recommendations, and management of complications (cerebral edema, hydrocephalus, vasculitis).", sourceIds: ["escmid-2016-bacterial-meningitis"] },
      { name: "ESCMID 2017 Bacterial Brain Abscess Update", detail: "Focused review of bacterial brain abscess diagnosis and management in immunocompetent adults. Supports MRI with diffusion-weighted imaging, early aspiration or drainage when feasible, and source-directed empiric regimens based on contiguous, hematogenous, or post-neurosurgical origin.", sourceIds: ["escmid-2017-brain-abscess-update"] },
    ],
    landmarkTrials: [
      { name: "de Gans & van de Beek, NEJM 2002 — Dexamethasone in Meningitis", detail: "Landmark RCT: adjunctive dexamethasone (10mg IV q6h × 4 days) started BEFORE or WITH the first dose of antibiotics reduced mortality and neurologic sequelae in adults with bacterial meningitis, particularly PNEUMOCOCCAL meningitis (mortality 14% vs 34%). This trial established dexamethasone as standard of care. KEY: dexamethasone must be given BEFORE or simultaneous with the first antibiotic dose — giving it hours later provides no benefit.", sourceIds: ["dexamethasone-meningitis"] },
      { name: "van de Beek et al., NEJM 2006 — Meningitis Clinical Features", detail: "Large prospective cohort defining the clinical spectrum of community-acquired bacterial meningitis. The classic triad (fever + neck stiffness + altered mental status) was present in only 44% of patients, but 95% had at least 2 of 4 symptoms (headache, fever, neck stiffness, altered consciousness). Established that absence of ALL classic features essentially rules out bacterial meningitis.", sourceIds: ["van-de-beek-2006-meningitis"] },
      { name: "Brouwer et al., Cochrane 2015 — Dexamethasone Meta-analysis", detail: "Cochrane systematic review confirming dexamethasone benefit in high-income countries for S. pneumoniae meningitis. No significant benefit demonstrated for meningococcal or other etiologies, and no benefit in low-income settings (possibly due to later presentation and HIV co-infection). Reinforced that the dexamethasone benefit is primarily for pneumococcal meningitis.", sourceIds: ["brouwer-2015-dexamethasone"] },
    ],
    riskFactors: "Bacterial meningitis: age extremes (neonates, >50 years), asplenia/complement deficiency (N. meningitidis, S. pneumoniae), CSF leaks (basilar skull fractures, post-neurosurgical), cochlear implants (S. pneumoniae), immunosuppression (HIV, transplant, chronic steroids → Listeria, Cryptococcus), crowded living (military barracks, dormitories → N. meningitidis). Brain abscess: contiguous infection (chronic sinusitis, otitis media, dental abscess), hematogenous spread (endocarditis, pulmonary AVM in hereditary hemorrhagic telangiectasia, IDU), penetrating trauma, recent neurosurgery, immunosuppression (Toxoplasma in HIV, Nocardia in transplant, Aspergillus in neutropenia).",
  },
  subcategories: [
    {
      id: "community-bacterial-meningitis",
      name: "Community-Acquired Bacterial Meningitis",
      definition: "Acute bacterial infection of the leptomeninges (pia and arachnoid mater) and subarachnoid space acquired outside the healthcare setting. This is a MEDICAL EMERGENCY — every hour of delay in antibiotic administration increases mortality by 3-7%. When meningitis is suspected, the first antibiotic dose takes priority over ALL other interventions (LP, CT, cultures). Time to antibiotics is the single most modifiable prognostic factor.",
      clinicalPresentation: "Classic triad: fever + neck stiffness + altered mental status — but present in only 44% of patients. At least 2 of 4 (headache, fever, neck stiffness, altered consciousness) present in 95%. Headache is the most common symptom (~85%). Kernig sign (pain with knee extension while hip flexed) and Brudzinski sign (involuntary hip flexion with passive neck flexion) have poor sensitivity (~5%) but high specificity — their absence does NOT rule out meningitis. Petechial/purpuric rash = MENINGOCOCCEMIA until proven otherwise (medical emergency — empiric antibiotics IMMEDIATELY, even before LP). Seizures in 20-30%. Cranial nerve palsies (VI most common — false localizing sign from increased ICP). Papilledema (late sign of raised ICP).",
      diagnostics: "LUMBAR PUNCTURE IS DIAGNOSTIC — obtain ASAP but DO NOT DELAY ANTIBIOTICS for LP. If LP will be delayed (CT needed first, coagulopathy, etc.), start antibiotics + dexamethasone BEFORE LP. CSF findings in bacterial meningitis: WBC 1,000-5,000/μL (>90% PMNs), protein elevated (>100-500 mg/dL), glucose low (<40 mg/dL or CSF/serum glucose ratio <0.4), Gram stain positive in 60-90% (highest for pneumococcus, lowest for Listeria). CSF culture: positive in 70-85% (reduced if antibiotics given first — but still worth obtaining). CSF latex agglutination/PCR: useful when cultures are negative (especially post-antibiotic). Blood cultures: positive in 50-75% — ALWAYS obtain before antibiotics. CT scan before LP: indicated ONLY when risk of herniation — criteria: immunocompromised, history of CNS disease, new-onset seizure, papilledema, altered consciousness, focal neurologic deficit. Most patients do NOT need CT before LP.",
      durationGuidance: {
        standard: "10–14 days (S. pneumoniae/Listeria)",
        severe: "21 days (Listeria/gram-negative bacilli)",
        stewardshipNote: "IDSA 2004 (updated): Listeria 21d, N. meningitidis 5–7d, S. pneumoniae 10–14d, gram-negatives 21d.",
      },
      empiricTherapy: [
        {
          line: "Empiric — Adults 18-50 years (IMMEDIATE — within minutes)",
          options: [
            { drug: "ceftriaxone-vanco-meningitis", regimen: "Vancomycin 15-20 mg/kg IV + Ceftriaxone 2g IV q12h + Dexamethasone 0.15 mg/kg IV q6h × 4 days", notes: "STANDARD empiric regimen for community-acquired bacterial meningitis in adults 18-50. Vancomycin covers ceftriaxone-resistant S. pneumoniae (ceftriaxone MIC ≥2). Ceftriaxone covers susceptible S. pneumoniae and N. meningitidis. Dexamethasone MUST be given BEFORE or SIMULTANEOUSLY with the first antibiotic dose — reduces mortality and neurologic sequelae (de Gans trial). If given hours later, it provides no benefit. TIMING IS EVERYTHING: do not delay antibiotics for LP, imaging, or any other test.", evidence: "A-I", evidenceSource: "IDSA 2004" },
          ],
        },
        {
          line: "Empiric — Adults >50 years or Immunocompromised (ADD Listeria coverage)",
          options: [
            { drug: "ceftriaxone-vanco-ampicillin", regimen: "Vancomycin IV + Ceftriaxone 2g IV q12h + Ampicillin 2g IV q4h + Dexamethasone", notes: "ADD AMPICILLIN for Listeria coverage in patients >50 years, immunocompromised (HIV, transplant, chronic steroids, pregnancy, alcoholism, malignancy). Ceftriaxone does NOT cover Listeria (inherent resistance to cephalosporins). Ampicillin is the drug of choice for Listeria meningitis. If the patient has no Listeria risk factors AND is <50 years, ampicillin can be omitted.", evidence: "A-I", evidenceSource: "IDSA 2004" },
          ],
        },
        {
          line: "Empiric — Neonates (<1 month)",
          options: [
            { drug: "neonatal-meningitis", regimen: "Ampicillin 75 mg/kg IV q6h + Cefotaxime 50 mg/kg IV q6h (or Gentamicin)", notes: "Covers GBS (S. agalactiae), E. coli (including K1 capsule), and Listeria. Cefotaxime preferred over ceftriaxone in neonates (ceftriaxone causes biliary sludging and displaces bilirubin from albumin → kernicterus risk). Cefotaxime is the only cephalosporin approved for neonatal meningitis in many guidelines. Gentamicin alternative for E. coli synergy if cefotaxime unavailable." },
          ],
        },
        {
          line: "Pathogen-Directed Therapy (After CSF Culture/Gram Stain)",
          options: [
            { drug: "pneumococcal-meningitis", regimen: "Ceftriaxone 2g IV q12h × 10-14 days (if MIC <1) ± vancomycin if MIC ≥1", notes: "S. pneumoniae (gram-positive diplococci): most common adult meningitis. CONTINUE dexamethasone for full 4 days. If ceftriaxone MIC <0.06: can use penicillin G 4 million units IV q4h. If MIC 0.1-1.0: ceftriaxone alone. If MIC ≥2: ceftriaxone + vancomycin (maintain both). Duration: 10-14 days." },
            { drug: "meningococcal-meningitis", regimen: "Ceftriaxone 2g IV q12h × 7 days (or Penicillin G if susceptible)", notes: "N. meningitidis (gram-negative diplococci): PUBLIC HEALTH EMERGENCY — requires immediate health department notification and close contact chemoprophylaxis (rifampin, ciprofloxacin, or ceftriaxone). Dexamethasone: uncertain benefit for meningococcal meningitis — continue if started empirically but the evidence is less clear than for pneumococcal. Duration: 7 days." },
            { drug: "listeria-meningitis", regimen: "Ampicillin 2g IV q4h × 21 days ± Gentamicin (first 7 days for synergy)", notes: "Listeria monocytogenes (gram-positive rods): CEPHALOSPORINS DO NOT COVER LISTERIA. This is why ampicillin is added empirically in patients >50 or immunocompromised. TMP-SMX is the alternative for penicillin-allergic patients (the ONLY reliable alternative). Meropenem has some activity but is not well-studied. Duration: ≥21 days (longer than other meningitis — Listeria has high relapse rate with shorter courses). STOP dexamethasone if Listeria confirmed — dexamethasone may worsen Listeria outcomes (impairs cell-mediated immunity needed for intracellular pathogen clearance)." },
          ],
        },
      ],
      organismSpecific: [
        { organism: "S. pneumoniae", preferred: "Ceftriaxone 2g IV q12h (if MIC <1) + dexamethasone × 4 days", alternative: "Meropenem 2g IV q8h if severe cephalosporin allergy", notes: "Most common and deadliest adult meningitis pathogen (20-30% mortality). Mortality significantly reduced by adjunctive dexamethasone (de Gans trial). Check ceftriaxone MIC — if ≥1, keep vancomycin on board. Penicillin resistance via PBP alterations does NOT preclude ceftriaxone use unless ceftriaxone-specific MIC is also elevated. Duration: 10-14 days." },
        { organism: "N. meningitidis", preferred: "Ceftriaxone 2g IV q12h × 7 days", alternative: "Penicillin G 4 million units IV q4h (if susceptible)", notes: "Excellent prognosis with treatment (~10% mortality). POST-EXPOSURE PROPHYLAXIS for close contacts is MANDATORY: rifampin 600mg PO BID × 2 days, ciprofloxacin 500mg PO × 1 dose, or ceftriaxone 250mg IM × 1 dose. Healthcare workers with close contact (intubation, mouth-to-mouth) also need prophylaxis." },
        { organism: "L. monocytogenes", preferred: "Ampicillin 2g IV q4h ± gentamicin synergy × ≥21 days", alternative: "TMP-SMX 5 mg/kg IV q6h (the ONLY reliable alternative for penicillin allergy)", notes: "Intracellular pathogen — requires cell-mediated immunity for clearance. Cephalosporins, carbapenems, and fluoroquinolones are NOT reliable. STOP dexamethasone if Listeria confirmed. Rhombencephalitis (brainstem involvement) is a classic Listeria presentation." },
        { organism: "H. influenzae (rare in vaccinated populations)", preferred: "Ceftriaxone 2g IV q12h × 7 days", alternative: "Meropenem, chloramphenicol", notes: "Rare since Hib vaccine introduction. Still occurs in unvaccinated or under-vaccinated. Non-typeable H. influenzae can cause meningitis in elderly/immunocompromised. Duration: 7 days." },
      ],
      pearls: [
        "ANTIBIOTICS FIRST — EVERYTHING ELSE SECOND: Do NOT wait for CT, LP, or any other test if bacterial meningitis is suspected. Every hour of delay increases mortality by 3-7%. Draw blood cultures, then start vancomycin + ceftriaxone + dexamethasone IMMEDIATELY. LP can happen after.",
        "DEXAMETHASONE TIMING IS CRITICAL: Must be given BEFORE or WITH the first antibiotic dose. If you've already given antibiotics hours ago, starting dexamethasone now provides no proven benefit. In practice: hang dexamethasone in the IV line, then immediately start antibiotics. STOP dexamethasone if Listeria is confirmed — it impairs the cell-mediated immunity needed to clear this intracellular pathogen.",
        "CT BEFORE LP: MOST PATIENTS DON'T NEED IT: The fear of herniation from LP drives unnecessary CT scans that delay antibiotics. IDSA criteria for CT before LP: immunocompromised, history of CNS disease, new-onset seizure (<1 week), papilledema, altered consciousness, focal neurologic deficit. If NONE of these → proceed directly to LP without CT.",
        "MENINGOCOCCAL PROPHYLAXIS IS A PUBLIC HEALTH OBLIGATION: Close contacts (household members, kissing contacts, daycare, military barracks) need prophylaxis within 24h. Options: rifampin 600mg BID × 2 days, ciprofloxacin 500mg × 1 dose (easiest), or ceftriaxone 250mg IM × 1 (preferred in pregnancy). Healthcare workers only need prophylaxis if direct exposure to respiratory secretions.",
        "LISTERIA GAPS IN CEPHALOSPORINS: Listeria monocytogenes is intrinsically resistant to all cephalosporins. If you omit ampicillin in a patient >50 who has Listeria meningitis, ceftriaxone + vancomycin will NOT cover it. This is a potentially fatal omission. Always add ampicillin for patients >50, immunocompromised, pregnant, or alcoholic.",
      ],
    },
    {
      id: "healthcare-cns",
      name: "Healthcare-Associated Meningitis/Ventriculitis",
      definition: "CNS infection occurring after neurosurgical procedures, penetrating head trauma, or related to CNS devices (VP shunts, external ventricular drains, intrathecal pumps). Organisms differ substantially from community-acquired meningitis: Staphylococci (including MRSA and CoNS), aerobic gram-negatives (Pseudomonas, Acinetobacter, Enterobacterales), and Cutibacterium acnes predominate. Treatment often requires intraventricular antibiotic administration.",
      clinicalPresentation: "Post-neurosurgical: fever, headache, altered consciousness, meningismus, new neurologic deficits, or wound infection (erythema/drainage at surgical site). VP shunt infection: fever, shunt malfunction (headache, nausea, vomiting, altered consciousness), abdominal signs (peritonitis if distal shunt infection). EVD-associated ventriculitis: fever, change in CSF parameters (increasing WBC, decreasing glucose), altered consciousness. Challenge: post-operative inflammation and blood in CSF can mimic infection — clinical correlation essential.",
      diagnostics: "CSF analysis: bacterial meningitis pattern (elevated WBC, elevated protein, decreased glucose) but often less dramatic than community-acquired. CSF culture is gold standard — but contamination risk is higher with hardware. CSF lactate >4 mmol/L suggests infection (helpful to distinguish from post-operative inflammation). Serial CSF sampling: trending WBC and glucose can differentiate infection from chemical/post-operative meningitis. Device-associated: culture the device/CSF simultaneously. CT head: hydrocephalus, abscess, hardware malposition.",
      empiricTherapy: [
        {
          line: "Empiric — Post-Neurosurgical/Post-Trauma",
          options: [
            { drug: "vancomycin-cefepime-meningitis", regimen: "Vancomycin 15-20 mg/kg IV q8-12h + Cefepime 2g IV q8h (or Meropenem 2g IV q8h)", notes: "Covers MRSA + Pseudomonas + Enterobacterales + Staphylococci. Vancomycin for MRSA/CoNS. Cefepime or meropenem for gram-negatives including Pseudomonas. MENINGITIS DOSING: higher than standard — vancomycin target trough 15-20 (or AUC equivalent for CNS penetration), cefepime 2g q8h, meropenem 2g q8h. Note for meropenem: use STANDARD infusion (not extended) for meningitis — need high peak levels for CSF penetration." },
          ],
        },
        {
          line: "Intraventricular Antibiotics (Adjunctive for Refractory Cases)",
          options: [
            { drug: "intrathecal-vanc", regimen: "Intraventricular vancomycin 10-20mg/day (via EVD or Ommaya reservoir)", notes: "For healthcare-associated ventriculitis/meningitis not responding to systemic antibiotics alone. Intraventricular route achieves CSF concentrations far exceeding what systemic dosing can achieve. IDSA 2017 recommends considering intraventricular antibiotics for gram-positive infections not responding to systemic therapy within 48-72h." },
            { drug: "intrathecal-gent", regimen: "Intraventricular gentamicin 4-8mg/day (via EVD or Ommaya reservoir)", notes: "For gram-negative ventriculitis — aminoglycosides achieve poor CSF penetration systemically but excellent concentrations intraventricularly. Alternative: polymyxin B or colistin intraventricularly for MDR gram-negatives (Acinetobacter, CRE). Coordinate dosing with EVD drainage — clamp drain for 15-60 min after instillation." },
          ],
        },
        {
          line: "Device Management",
          options: [
            { drug: "device-removal", regimen: "Remove or externalize infected device whenever possible", notes: "VP shunt infection: removal + external drainage + antibiotics is the gold standard (cure rate >90% vs. 30-40% with antibiotics alone and shunt retention). EVD infection: replace the drain (exchange to contralateral side) + systemic ± intraventricular antibiotics. Treat until CSF is sterile for 48-72h and clinical improvement, then consider re-internalization." },
          ],
        },
      ],
      organismSpecific: [
        { organism: "CoNS (S. epidermidis — most common VP shunt pathogen)", preferred: "Vancomycin IV ± intraventricular vancomycin + device removal", alternative: "Linezolid (excellent CSF penetration)", notes: "Indolent biofilm infection on shunt tubing. Device removal is essential for cure in most cases. Rifampin can be added for biofilm activity if device is retained (similar principle to PJI)." },
        { organism: "S. aureus (MSSA/MRSA)", preferred: "Nafcillin (MSSA — better CSF penetration than cefazolin) or vancomycin (MRSA)", alternative: "TMP-SMX IV (good CSF penetration for MRSA)", notes: "More aggressive than CoNS. Often presents acutely with wound infection/dehiscence. Device removal strongly recommended." },
        { organism: "Gram-negatives (Pseudomonas, Acinetobacter, Enterobacterales)", preferred: "Cefepime or meropenem IV ± intraventricular aminoglycoside", alternative: "For MDR: intraventricular colistin/polymyxin B", notes: "Increasingly common in ICU settings. MDR gram-negative ventriculitis is one of the most challenging infections to treat. Intraventricular antibiotics are often required. Cefiderocol has emerging CNS penetration data. Consult ID." },
      ],
      pearls: [
        "DEVICE REMOVAL IS PARAMOUNT: Trying to sterilize a VP shunt with antibiotics alone has ~30-40% cure rate. Removing the device + antibiotics achieves >90%. Always involve neurosurgery early for device management decisions.",
        "MEROPENEM DOSING FOR MENINGITIS: Use 2g IV q8h via STANDARD infusion (30-minute bolus) — NOT extended infusion. For meningitis, you need high PEAK concentrations to drive drug across the BBB. Extended infusion optimizes time above MIC (good for systemic infections) but produces lower peaks (bad for CNS penetration).",
        "CSF LACTATE HELPS DISTINGUISH INFECTION FROM POST-OP INFLAMMATION: Post-neurosurgical CSF often has elevated WBC and protein from surgical trauma/blood. CSF lactate >4 mmol/L has good specificity for bacterial infection and can help guide antibiotic decisions in ambiguous cases.",
        "NAFCILLIN FOR MSSA CNS INFECTIONS: Cefazolin has poor CNS penetration even with inflamed meninges. For MSSA meningitis or brain abscess, use nafcillin or oxacillin (adequate CSF levels with inflamed meninges). This is one of the few remaining indications where nafcillin is preferred over cefazolin.",
      ],
    },
    {
      id: "brain-abscess",
      name: "Brain Abscess",
      definition: "Focal suppurative infection of the brain parenchyma, progressing from cerebritis (early, ill-defined) to a well-encapsulated abscess. The source determines the likely pathogens: dental/sinus origin → Streptococci (especially S. anginosus group) + anaerobes; otogenic → Pseudomonas + anaerobes + Proteus; hematogenous → S. aureus + Streptococci; post-traumatic/surgical → Staphylococci + gram-negatives. In immunocompromised patients, consider Toxoplasma, Nocardia, Aspergillus, and Mycobacteria.",
      clinicalPresentation: "Classic triad: headache + fever + focal neurologic deficit — present in <50% (similar to endocarditis, the full triad is often absent). Headache is the most common symptom (70-90%), often progressive. Fever in only 50%. Focal deficits depend on location: frontal (personality changes, hemiparesis), temporal (aphasia if dominant hemisphere, visual field deficits), cerebellar (ataxia, nystagmus — otogenic source). Seizures in 25-50%. Papilledema from mass effect. Rupture into ventricles: sudden catastrophic deterioration with meningitis (high mortality).",
      diagnostics: "MRI with gadolinium = GOLD STANDARD: ring-enhancing lesion with central restricted diffusion on DWI (distinguishes abscess from tumor — abscesses show restricted diffusion, tumors typically do not). CT with contrast: ring-enhancing lesion, often with surrounding edema. CT is less sensitive than MRI, especially for early cerebritis and posterior fossa lesions. ASPIRATION/BIOPSY: stereotactic aspiration for diagnosis (culture + Gram stain) AND therapy (decompression). Obtain before antibiotics if possible, but do NOT delay antibiotics if patient is deteriorating. Blood cultures: positive in 10-30% (higher in hematogenous abscesses). Source investigation: dental exam, sinus CT, echocardiography (endocarditis source), chest imaging (lung abscess, AVM).",
      durationGuidance: {
        standard: "4–8 weeks total (6–8 weeks IV for surgical cases)",
        opatNote: "OPAT for IV antibiotics after surgical drainage feasible in stable patients",
      },
      empiricTherapy: [
        {
          line: "Empiric — Unknown Source or Dental/Sinus Origin",
          options: [
            { drug: "ceftriaxone-metro-abscess", regimen: "Ceftriaxone 2g IV q12h + Metronidazole 500mg IV q8h ± Vancomycin", notes: "Covers Streptococci (especially S. anginosus/milleri group — THE classic abscess-forming organism) + anaerobes + gram-negatives. Add vancomycin if: post-surgical, post-traumatic, IDU, or MRSA risk. Metronidazole provides excellent CNS penetration (40-100% of serum levels) and covers anaerobes that ceftriaxone misses. Duration: 4-8 weeks total (longer for larger abscesses or incomplete drainage).", evidence: "A-I", evidenceSource: "IDSA 2004" },
          ],
        },
        {
          line: "Empiric — Post-Neurosurgical/Post-Traumatic",
          options: [
            { drug: "vanc-cefepime-metro", regimen: "Vancomycin IV + Cefepime 2g IV q8h + Metronidazole 500mg IV q8h", notes: "Covers MRSA + Pseudomonas + anaerobes + Enterobacterales. Post-surgical and post-traumatic abscesses have a different microbiologic profile (Staphylococci, gram-negatives) than community-acquired (Streptococci, anaerobes). Meropenem 2g IV q8h can substitute for cefepime + metronidazole (covers both gram-negatives and anaerobes) — but standard infusion for CNS penetration." },
          ],
        },
        {
          line: "Surgical Management",
          options: [
            { drug: "surgical-abscess", regimen: "Stereotactic aspiration (preferred) or craniotomy with excision", notes: "ASPIRATION indications: abscess >2.5cm, accessible location, diagnostic uncertainty, mass effect. Most abscesses are managed with aspiration + antibiotics. May need repeat aspiration if abscess re-accumulates. EXCISION: reserved for multiloculated abscesses, posterior fossa (risk of brainstem compression), failed aspiration, traumatic abscess with foreign material. MEDICAL MANAGEMENT ALONE (no surgery): considered for small abscesses (<2.5cm), multiple small abscesses, early cerebritis stage, deep/eloquent location, and when patient is a poor surgical candidate." },
          ],
        },
        {
          line: "Duration & Monitoring",
          options: [
            { drug: "duration-abscess", regimen: "4-8 weeks of IV/oral antibiotics with serial imaging", notes: "Total duration depends on: size (larger = longer), drainage adequacy, organism, and clinical/radiographic response. Oral step-down is reasonable after 2-4 weeks of IV if clinical improvement and abscess shrinking on imaging. OVIVA principles apply — high-dose oral agents with good CNS penetration (metronidazole, fluoroquinolones, TMP-SMX, linezolid). Serial MRI q2-4 weeks to monitor response. Abscess capsule may persist for months on imaging even after cure — follow size trend, not complete resolution." },
          ],
        },
      ],
      organismSpecific: [
        { organism: "Streptococcus anginosus/milleri group", preferred: "Ceftriaxone 2g IV q12h or penicillin G 4MU IV q4h", alternative: "Meropenem 2g IV q8h", notes: "THE classic brain abscess organism. S. anginosus, S. intermedius, and S. constellatus have unique propensity for abscess formation anywhere in the body (brain, liver, lung). Usually from dental/sinus contiguous spread. Typically penicillin-susceptible. Excellent prognosis with appropriate therapy + drainage." },
        { organism: "Anaerobes (Bacteroides, Fusobacterium, Prevotella)", preferred: "Metronidazole 500mg IV q8h (excellent CNS penetration)", alternative: "Meropenem", notes: "Often mixed with Streptococci in dental/sinus-source abscesses. Metronidazole is the drug of choice for the anaerobic component — 40-100% CSF/serum ratio, one of the best BBB-penetrating antibiotics available." },
        { organism: "S. aureus (hematogenous or post-surgical)", preferred: "Nafcillin 2g IV q4h (MSSA) or vancomycin IV (MRSA)", alternative: "Linezolid or TMP-SMX for MRSA (good CNS penetration)", notes: "Hematogenous S. aureus brain abscess: always evaluate for endocarditis (TEE). IMPORTANT: use nafcillin (NOT cefazolin) for MSSA brain abscess — cefazolin has poor CNS penetration." },
        { organism: "Toxoplasma gondii (HIV/AIDS, CD4 <100)", preferred: "Pyrimethamine + sulfadiazine + leucovorin × 6+ weeks", alternative: "TMP-SMX (high-dose) if sulfadiazine unavailable", notes: "Most common cause of brain abscess in AIDS patients. Multiple ring-enhancing lesions + positive Toxoplasma IgG + CD4 <100 = empiric treatment without biopsy. Improvement expected within 10-14 days — if no response, biopsy to rule out CNS lymphoma. After treatment: lifelong secondary prophylaxis until immune reconstitution on ART." },
        { organism: "Nocardia (transplant, chronic steroids)", preferred: "TMP-SMX (high-dose) ± imipenem or amikacin for severe disease", alternative: "Linezolid (good activity and CNS penetration)", notes: "Think Nocardia in any immunocompromised patient with brain + lung lesions (Nocardia disseminates from pulmonary source). Gram stain shows beaded, branching, weakly acid-fast positive gram-positive rods. Treatment duration: months to years depending on immune status." },
      ],
      pearls: [
        "DWI ON MRI: THE KEY TO DISTINGUISHING ABSCESS FROM TUMOR: Restricted diffusion (bright on DWI, dark on ADC) within a ring-enhancing lesion strongly suggests abscess over tumor. Tumors typically show facilitated diffusion centrally. This MRI finding is the single most useful radiologic tool for diagnosis.",
        "METRONIDAZOLE IS YOUR BEST FRIEND FOR BRAIN ABSCESS: 40-100% CNS penetration is exceptional among antibiotics. Always include metronidazole in empiric brain abscess regimens (unless pure Staphylococcal from hematogenous source). It covers the anaerobic component that other agents miss.",
        "S. ANGINOSUS GROUP = THINK ABSCESS: If the microbiology lab calls with S. anginosus, S. intermedius, or S. constellatus from blood cultures, immediately think about occult abscess formation — brain, liver, lung, or intra-abdominal. These organisms have a unique propensity for suppurative, walled-off infections.",
        "DEXAMETHASONE FOR EDEMA, NOT INFECTION: Unlike meningitis, adjunctive corticosteroids for brain abscess are reserved for significant EDEMA and MASS EFFECT only — steroids may reduce antibiotic penetration into the abscess cavity and impair immune response. Use dexamethasone for herniation risk, then taper quickly.",
        "SEIZURE PROPHYLAXIS: Brain abscess carries high seizure risk (25-50%). Most experts recommend anticonvulsant prophylaxis (levetiracetam preferred — no CYP interactions) for the acute phase, then reassess at 3-6 months. Avoid phenytoin if possible (CYP interactions with multiple antibiotics, especially metronidazole).",
      ],
    },
  ],
  drugMonographs: [
    {
      id: "ampicillin",
      name: "Ampicillin",
      brandNames: "Principen (discontinued), generic",
      drugClass: "Aminopenicillin",
      mechanismOfAction: "Binds PBPs inhibiting cell wall synthesis. Bactericidal, time-dependent killing. Extended spectrum compared to penicillin G — covers some gram-negative organisms (E. coli, H. influenzae — non-beta-lactamase producing, Proteus mirabilis) in addition to gram-positives. CRITICAL CNS ROLE: drug of choice for Listeria monocytogenes (which is inherently resistant to all cephalosporins).",
      spectrum: "Gram-positive: Streptococci (excellent), Enterococcus faecalis (drug of choice — intrinsic activity unlike most cephalosporins), Listeria monocytogenes (drug of choice). Gram-negative: E. coli and Proteus mirabilis (if non-beta-lactamase producing — but resistance is high), H. influenzae (non-beta-lactamase producing). GAPS: MRSA, beta-lactamase producing organisms (most E. coli, H. influenzae now resistant), Pseudomonas, Klebsiella (inherent resistance), anaerobes (poor for B. fragilis).",
      dosing: {
        meningitis_listeria: "2g IV q4h (meningitis dosing — higher than standard)",
        enterococcal_ie: "2g IV q4h + ceftriaxone or gentamicin",
        standard: "1-2g IV q4-6h",
        gu_prophylaxis: "2g IV (GBS prophylaxis in labor)",
      },
      renalAdjustment: "CrCl 10-30: extend interval to q6-8h. CrCl <10: q12h. Hemodialysis: dose after HD.",
      hepaticAdjustment: "No adjustment needed — renally eliminated.",
      adverseEffects: {
        common: "Rash (5-10% — especially in EBV mononucleosis patients: 70-100% get maculopapular rash, NOT true allergy), diarrhea, nausea",
        serious: "Hypersensitivity/anaphylaxis (cross-reactivity with penicillin — same drug class), C. difficile colitis, seizures (high-dose IV, especially with renal impairment), interstitial nephritis",
        rare: "Hemolytic anemia, severe cutaneous reactions (SJS/TEN)",
      },
      drugInteractions: [
        "Allopurinol — increased incidence of rash (mechanism unclear). Monitor but not a contraindication.",
        "Warfarin — may increase INR via disruption of gut flora vitamin K synthesis.",
        "Methotrexate — decreased renal clearance of methotrexate. Monitor for methotrexate toxicity.",
      ],
      monitoring: "Renal function (especially for meningitis dosing). Signs of allergic reaction. Seizure monitoring with high-dose IV therapy. CBC for prolonged courses.",
      pregnancyLactation: "Pregnancy Category B. Widely used in pregnancy — standard for GBS prophylaxis in labor, UTI treatment, and Listeria coverage in meningitis. Excreted in breast milk in low concentrations. Compatible with breastfeeding.",
      pharmacistPearls: [
        "LISTERIA COVERAGE = AMPICILLIN: No cephalosporin covers Listeria. If Listeria meningitis is in the differential (age >50, immunocompromised, pregnant, alcoholic), ampicillin MUST be included in the empiric regimen. Omitting it can be fatal.",
        "EBV RASH IS NOT AN ALLERGY: The classic teaching — 70-100% of patients with EBV mononucleosis develop a maculopapular rash when given ampicillin/amoxicillin. This is NOT an IgE-mediated allergy and does NOT predict future penicillin allergy. Do NOT document this as a penicillin allergy. This incorrect allergy documentation deprives patients of beta-lactams for the rest of their lives.",
        "ENTEROCOCCAL IE: AMPICILLIN IS THE BACKBONE: For E. faecalis endocarditis, ampicillin + ceftriaxone (double beta-lactam synergy) is now PREFERRED over ampicillin + gentamicin (avoids aminoglycoside toxicity). Ampicillin's inherent Enterococcal activity makes it irreplaceable in this regimen.",
      ],
    },
    {
      id: "meropenem",
      name: "Meropenem",
      brandNames: "Merrem",
      drugClass: "Carbapenem antibiotic",
      mechanismOfAction: "Binds PBPs (primarily PBP-2 and PBP-3) inhibiting cell wall synthesis. Bactericidal, time-dependent killing. Carbapenems are the broadest-spectrum beta-lactams — stable against most beta-lactamases including ESBLs and AmpC. UNIQUE to meropenem: lower seizure risk than imipenem (does not antagonize GABA receptors), making it preferred for CNS infections.",
      spectrum: "The broadest-spectrum standard antibiotic. Gram-positive: Streptococci (excellent), MSSA (good), E. faecalis (moderate). Gram-negative: Enterobacterales including ESBL and AmpC producers (excellent), Pseudomonas (good), H. influenzae, Neisseria. Anaerobes: excellent (B. fragilis). GAPS: MRSA (no activity), E. faecium (no activity), Stenotrophomonas (intrinsically resistant), atypicals, CRE (resistant by definition — need novel BL-BLIs).",
      dosing: {
        standard: "1g IV q8h (extended infusion over 3h for non-CNS infections)",
        meningitis: "2g IV q8h — STANDARD INFUSION (30-min bolus, NOT extended — need high peaks for BBB penetration)",
        brain_abscess: "2g IV q8h (standard infusion)",
        febrile_neutropenia: "1g IV q8h (extended infusion)",
        esbl_bacteremia: "1g IV q8h (extended infusion preferred per MERINO trial)",
      },
      renalAdjustment: "CrCl 26-50: 1g q12h. CrCl 10-25: 500mg-1g q12h. CrCl <10: 500mg-1g q24h. HD: dose after HD. CRRT: 1g q8h (institution-dependent). For meningitis dosing: adjust proportionally but maintain q8h frequency.",
      hepaticAdjustment: "No adjustment — renally eliminated.",
      adverseEffects: {
        common: "Diarrhea, nausea, headache, rash",
        serious: "C. difficile colitis (broad-spectrum = high C. diff risk), seizures (LOWER risk than imipenem — preferred for CNS infections), hypersensitivity reactions",
        rare: "Severe cutaneous reactions, hepatotoxicity, neutropenia (prolonged courses), thrombocytopenia",
      },
      drugInteractions: [
        "VALPROIC ACID — HARD STOP interaction. All carbapenems reduce VPA levels by 60-100% within 24h. Increasing VPA dose does NOT compensate. Switch to levetiracetam (or another AED) before starting meropenem. Resume VPA after meropenem is completed.",
        "Probenecid — increases meropenem levels. Avoid combination.",
      ],
      monitoring: "Renal function (BMP q48-72h). Seizure monitoring (lower risk than imipenem but still possible in renal impairment, CNS disease, elderly). CBC for prolonged courses. C. diff surveillance. LFTs periodically.",
      pregnancyLactation: "Pregnancy Category B. Limited human data but no evidence of teratogenicity. Used in pregnancy for serious infections when benefits outweigh risks. Low concentrations in breast milk.",
      pharmacistPearls: [
        "MENINGITIS DOSING = STANDARD INFUSION: This is counterintuitive for pharmacists trained in extended-infusion carbapenems. For meningitis and brain abscess, use 2g IV q8h via 30-minute BOLUS infusion. The BBB is penetrated based on PEAK concentration, not time above MIC. Extended infusion produces lower peaks — wrong strategy for CNS infections.",
        "VALPROIC ACID: THE HARDEST OF HARD STOPS: Every carbapenem (meropenem, ertapenem, imipenem, doripenem) drastically reduces VPA levels. The interaction is NOT manageable by increasing the VPA dose. Switch the antiepileptic to levetiracetam for the duration of carbapenem therapy. This pharmacist intervention prevents breakthrough seizures.",
        "SEIZURE ADVANTAGE OVER IMIPENEM: Meropenem does NOT antagonize GABA receptors (unlike imipenem). This makes it the preferred carbapenem for all CNS infections and for patients with seizure risk factors (renal impairment, elderly, CNS disease). If a patient seizes on imipenem, switching to meropenem may resolve the issue.",
        "CARBAPENEM STEWARDSHIP: Meropenem is the broadest-spectrum standard antibiotic. Every unnecessary day selects for CRE. De-escalate aggressively when culture data allows. For brain abscess, oral step-down to metronidazole + a fluoroquinolone (or TMP-SMX) after initial IV response is reasonable per OVIVA principles.",
      ],
    },
  ],
};

export const CNS_INFECTIONS: DiseaseState = enhanceDisease(
  CNS_INFECTIONS_BASE,
  {},
  CNS_INFECTIONS_MONOGRAPH_ENHANCEMENTS,
);
