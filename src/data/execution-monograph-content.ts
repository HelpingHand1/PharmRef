import type { DrugMonograph } from "../types";

export const NITROFURANTOIN_EXECUTION_ENHANCEMENTS: Partial<DrugMonograph> = {
  dosingByIndication: [
    {
      label: "Uncomplicated cystitis",
      regimen: "100 mg PO BID for 5 days",
      notes: "Use only for lower-tract disease; do not stretch it into pyelonephritis or bacteremic UTI because the serum and kidney levels are inadequate.",
    },
    {
      label: "Recurrent cystitis prophylaxis",
      regimen: "50-100 mg PO at bedtime",
      notes: "Reserve for carefully selected recurrent cystitis after behavioral and non-antibiotic options are reviewed.",
    },
  ],
  renalReplacement: [
    {
      modality: "HD",
      guidance: "Avoid for active infection in hemodialysis patients because urinary exposure is unreliable and toxicity risk rises as renal function falls.",
    },
    {
      modality: "CRRT",
      guidance: "Generally avoid in CRRT because the drug is still a bladder-only agent and does not provide dependable systemic or renal-parenchymal treatment.",
    },
  ],
  specialPopulations: [
    {
      population: "Borderline renal function or frail older adults",
      guidance: "Short cystitis courses may still be reasonable around CrCl 20-30 mL/min when alternatives are poor, but reassess quickly if the syndrome looks deeper than cystitis.",
    },
    {
      population: "Pregnancy near term or G6PD deficiency",
      guidance: "Avoid near delivery and use extra caution in G6PD deficiency because hemolysis risk matters more than the usual low-resistance appeal.",
    },
  ],
  therapeuticDrugMonitoring: {
    target: "No routine serum target; success depends on getting the right syndrome, not chasing plasma levels.",
    sampling: "No therapeutic drug levels are used. Reassess symptoms and renal function instead.",
    adjustment: "If fever, flank pain, bacteremia, or poor renal function make bladder-only therapy implausible, switch agents rather than extending nitrofurantoin.",
  },
  administration: {
    oralAbsorption: "Take with food and use the macrocrystal-monohydrate product when possible to improve absorption and reduce nausea.",
    note: "Brown or rust-colored urine is expected and should be part of routine counseling.",
  },
  ivToPoSwitch: {
    poBioavailability: "PO-only agent; there is no IV formulation to convert from.",
    switchCriteria: "Use as oral-first therapy only when the syndrome is clearly uncomplicated cystitis and the patient can absorb oral medication.",
    note: "If a patient required IV therapy, they usually need a different oral exit drug rather than nitrofurantoin.",
  },
  opatEligibility: {
    eligible: "no",
    administration: "Nitrofurantoin is an oral discharge drug, not an OPAT drug.",
    monitoring: "If symptoms or cultures suggest upper-tract disease, abandon nitrofurantoin instead of trying to manage it as outpatient parenteral therapy avoidance.",
    considerations: [
      "Best framed as an oral stewardship option for cystitis, not as a substitute for IV therapy in systemic infection.",
    ],
  },
  interactionActions: [
    {
      interactingAgent: "Magnesium-containing antacids",
      effect: "Reduce nitrofurantoin absorption and can undermine cystitis treatment.",
      management: "Avoid co-administration or separate clearly if the patient insists on using antacids.",
      severity: "monitor",
    },
    {
      interactingAgent: "Probenecid",
      effect: "Reduces urinary secretion while increasing systemic exposure and toxicity risk.",
      management: "Avoid the combination rather than trying to rescue it with dose changes.",
      severity: "major",
    },
  ],
  stewardshipUseCases: [
    {
      scenario: "First-line oral treatment for uncomplicated cystitis",
      role: "Low collateral damage and persistently low E. coli resistance make nitrofurantoin a stewardship-friendly bladder agent.",
      notes: "Its value disappears once the infection leaves the bladder.",
    },
    {
      scenario: "Escalation pressure toward fluoroquinolones",
      role: "Use nitrofurantoin to avoid unnecessary fluoroquinolone exposure when cystitis is truly uncomplicated.",
      notes: "Do not use it just to avoid admission when pyelonephritis signs are present.",
    },
  ],
};

export const TMP_SMX_EXECUTION_ENHANCEMENTS: Partial<DrugMonograph> = {
  dosingByIndication: [
    {
      label: "Uncomplicated cystitis",
      regimen: "1 DS tablet PO BID for 3 days",
      notes: "Only use empirically when local resistance remains acceptable; otherwise wait for susceptibility data.",
    },
    {
      label: "Pyelonephritis or complicated UTI",
      regimen: "1 DS tablet PO BID for 7-14 days",
      notes: "High oral bioavailability makes it a strong step-down option when Enterobacterales susceptibility is confirmed.",
    },
    {
      label: "Bacterial prostatitis",
      regimen: "1 DS tablet PO BID for 4-6 weeks",
      notes: "Excellent prostatic penetration is one of TMP-SMX's biggest differentiators in urinary stewardship.",
    },
  ],
  renalReplacement: [
    {
      modality: "HD",
      guidance: "Give the adjusted daily regimen after hemodialysis and monitor potassium and CBC closely because HD does not eliminate the hyperkalemia or marrow risk.",
    },
    {
      modality: "CRRT",
      guidance: "Many CRRT patients still need near-standard q12h dosing, but the potassium, creatinine, and CBC trend should drive interval adjustments more than the nominal filter setting alone.",
    },
  ],
  specialPopulations: [
    {
      population: "Patients on ACE inhibitors, ARBs, or spironolactone",
      guidance: "The ENaC-blocking trimethoprim effect can produce clinically significant hyperkalemia within 3-5 days, so choose another oral option if the potassium reserve is already narrow.",
    },
    {
      population: "Pregnancy or G6PD deficiency",
      guidance: "Avoid in the first trimester and near term when possible, and use extra caution in G6PD deficiency because sulfonamide toxicity matters more than convenience.",
    },
  ],
  therapeuticDrugMonitoring: {
    target: "No routine serum concentration target; the practical targets are stable potassium, acceptable CBC trends, and clinical response.",
    sampling: "No drug levels are standard. Recheck BMP and CBC early in longer courses, especially with RAAS blockade or renal dysfunction.",
    adjustment: "If creatinine rises, distinguish true AKI from trimethoprim's creatinine-secretion effect before abandoning an otherwise active oral regimen.",
  },
  administration: {
    oralAbsorption: "High oral bioavailability makes PO therapy clinically equivalent to IV in most stable patients.",
    note: "Double-strength tablets simplify outpatient use; use IV only when the gut or swallowing is the barrier.",
  },
  ivToPoSwitch: {
    poBioavailability: "High oral bioavailability with near-IV systemic exposure.",
    switchCriteria: "Switch from IV to PO once the patient is hemodynamically improving, can absorb, and the organism is confirmed susceptible.",
    note: "This is one of the cleaner oral exits for ESBL-susceptible urinary infection when resistance and hyperkalemia risk are acceptable.",
  },
  opatEligibility: {
    eligible: "conditional",
    administration: "IV TMP-SMX is possible, but oral therapy is preferred whenever the GI tract works.",
    monitoring: "BMP and CBC should be checked early because outpatient toxicity is more likely to stop therapy than loss of efficacy.",
    considerations: [
      "Prefer oral completion over OPAT for susceptible urinary-source infection.",
      "Be explicit about potassium and creatinine follow-up before discharge.",
    ],
  },
  interactionActions: [
    {
      interactingAgent: "Warfarin",
      effect: "Marked INR elevation can occur quickly through CYP2C9 inhibition and gut-flora effects.",
      management: "Choose another agent when feasible or reduce warfarin and check INR within a few days.",
      severity: "major",
    },
    {
      interactingAgent: "ACE inhibitors, ARBs, or spironolactone",
      effect: "Combines with TMP's amiloride-like effect to amplify hyperkalemia risk.",
      management: "Check potassium at day 3-5 and reconsider TMP-SMX entirely if the baseline potassium reserve is poor.",
      severity: "major",
    },
    {
      interactingAgent: "Methotrexate",
      effect: "Additive folate antagonism can precipitate severe marrow toxicity.",
      management: "Avoid the combination whenever possible.",
      severity: "major",
    },
  ],
  stewardshipUseCases: [
    {
      scenario: "Oral step-down for susceptible Enterobacterales UTI or pyelonephritis",
      role: "TMP-SMX is a high-value oral exit when the isolate is susceptible and the patient can tolerate the metabolic tradeoffs.",
      notes: "It is especially useful when a carbapenem bridge needs a non-fluoroquinolone oral landing zone.",
    },
    {
      scenario: "Avoiding unnecessary fluoroquinolone use",
      role: "When susceptibilities allow, TMP-SMX preserves fluoroquinolone exposure for future higher-risk needs.",
      notes: "Do not use it blindly when local resistance is too high for empiric therapy.",
    },
  ],
};

export const CIPROFLOXACIN_EXECUTION_ENHANCEMENTS: Partial<DrugMonograph> = {
  dosingByIndication: [
    {
      label: "Pyelonephritis or complicated UTI",
      regimen: "500 mg PO BID or 400 mg IV q12h",
      notes: "Favor culture-confirmed use because fluoroquinolone resistance is too common for blind continuation in many centers.",
    },
    {
      label: "Serious Pseudomonas infection",
      regimen: "750 mg PO BID or 400 mg IV q8h",
      notes: "Use the upper-end exposure when oral anti-pseudomonal therapy is the reason you chose ciprofloxacin.",
    },
  ],
  renalReplacement: [
    {
      modality: "HD",
      guidance: "Dose after hemodialysis because some removal occurs and the missed post-HD dose is a common reason urinary-source step-down underperforms.",
    },
    {
      modality: "CRRT",
      guidance: "CRRT often supports near-standard IV or PO dosing, but persistent high-effluent clearance or resistant Pseudomonas should prompt dose review rather than casual q24h underdosing.",
    },
  ],
  specialPopulations: [
    {
      population: "Older adults, steroid exposure, or aortic aneurysm risk",
      guidance: "Tendon, CNS, and vascular toxicity risks are more important than oral convenience in these patients, so use ciprofloxacin only when the microbiology win is real.",
    },
    {
      population: "Enteral feeding or heavy supplement use",
      guidance: "Tube feeds, calcium, iron, and antacids can erase the oral exposure advantage unless the timing is managed tightly.",
    },
  ],
  therapeuticDrugMonitoring: {
    target: "No routine serum target is used in standard practice; efficacy depends on adequate dose, oral absorption, and susceptibility.",
    sampling: "No drug levels are standard. Review QTc, symptom response, and renal function instead.",
    adjustment: "If the oral regimen fails, first rule out cation binding, poor absorption, or rising resistance before declaring the class ineffective.",
  },
  administration: {
    infusion: "IV ciprofloxacin is usually infused over 60 minutes.",
    oralAbsorption: "Oral exposure is strong but not foolproof; cation chelation and continuous tube feeds can sharply reduce absorption.",
    note: "Separate calcium, iron, magnesium, antacids, and tube feeds aggressively or the oral step-down plan can fail silently.",
  },
  ivToPoSwitch: {
    poBioavailability: "High oral bioavailability, though lower and more interaction-sensitive than levofloxacin.",
    switchCriteria: "Switch once the patient is improving, can absorb reliably, and the team can control cation/tube-feed timing.",
    note: "One of the few oral anti-pseudomonal exits, so protect it for the right susceptible infections.",
  },
  opatEligibility: {
    eligible: "conditional",
    administration: "IV therapy is possible, but oral completion is preferred in most stable patients because the oral formulation is the main stewardship advantage.",
    monitoring: "Monitor QTc risk, CNS symptoms, tendon complaints, and whether the patient can actually separate cations and feeds at home.",
    considerations: [
      "Use OPAT only when oral absorption is not dependable.",
      "Do not use ciprofloxacin as a routine discharge reflex for uncomplicated cystitis.",
    ],
  },
  interactionActions: [
    {
      interactingAgent: "Calcium, iron, magnesium, antacids, or enteral feeds",
      effect: "Chelation can reduce ciprofloxacin absorption enough to create clinical failure.",
      management: "Separate oral ciprofloxacin from cations and hold tube feeds around each dose when needed.",
      severity: "major",
    },
    {
      interactingAgent: "Tizanidine",
      effect: "Ciprofloxacin can cause severe hypotension and sedation by raising tizanidine exposure dramatically.",
      management: "Treat the combination as contraindicated and pick another antibiotic if tizanidine cannot be stopped.",
      severity: "major",
    },
    {
      interactingAgent: "Other QT-prolonging agents",
      effect: "Additive QT risk matters more in older, renally impaired, and electrolyte-depleted patients.",
      management: "Review ECG and electrolyte context before signing off on oral continuation.",
      severity: "monitor",
    },
  ],
  stewardshipUseCases: [
    {
      scenario: "Oral anti-pseudomonal step-down",
      role: "Ciprofloxacin is still one of the few true oral anti-pseudomonal exits when the isolate is susceptible.",
      notes: "Preserve it for infections where that property changes disposition or line use.",
    },
    {
      scenario: "Complicated UTI discharge planning",
      role: "High bioavailability lets ciprofloxacin shorten IV days and avoid PICC placement when resistance, toxicity, and interaction risks are acceptable.",
      notes: "Do not repurpose that convenience for pneumonia or low-value cystitis prescribing.",
    },
  ],
};

export const CEFTRIAXONE_EXECUTION_ENHANCEMENTS: Partial<DrugMonograph> = {
  dosingByIndication: [
    {
      label: "Complicated UTI or uncomplicated gram-negative bacteremia bridge",
      regimen: "1-2 g IV q24h",
      notes: "Once-daily dosing is ideal while cultures mature or while arranging a narrower oral exit.",
    },
    {
      label: "Streptococcal or HACEK endovascular infection",
      regimen: "2 g IV q24h",
      notes: "Use higher-end once-daily exposure for endovascular syndromes where long half-life is a practical advantage.",
    },
    {
      label: "Meningitis",
      regimen: "2 g IV q12h",
      notes: "Use the q12h meningitis schedule when CNS penetration, not convenience, is the primary goal.",
    },
  ],
  renalReplacement: [
    {
      modality: "HD",
      guidance: "No routine post-HD supplement is needed because ceftriaxone is not meaningfully removed by conventional dialysis.",
    },
    {
      modality: "CRRT",
      guidance: "Many CRRT patients can stay on standard 1-2 g daily dosing, but severe infection or high-effluent settings may justify the full 2 g daily regimen.",
    },
  ],
  specialPopulations: [
    {
      population: "Neonates or patients receiving calcium-rich infusions",
      guidance: "Avoid co-administration with calcium-containing solutions in neonates and keep adult line practice disciplined to prevent precipitation events.",
    },
    {
      population: "Patients with prolonged fasting, TPN, or long OPAT courses",
      guidance: "Biliary sludge and pseudolithiasis become more clinically relevant as duration and dose increase, so unexplained RUQ symptoms deserve attention.",
    },
  ],
  therapeuticDrugMonitoring: {
    target: "No routine serum target is used; success depends on syndrome-appropriate dosing and not asking ceftriaxone to cover AmpC, ESBL, or Pseudomonas phenotypes it does not own.",
    sampling: "Drug levels are not standard. Reassess cultures, syndrome depth, and bilirubin/LFT trends instead.",
    adjustment: "If a patient remains bacteremic or the isolate suggests AmpC, ESBL, or Pseudomonas, change agents rather than trying to rescue ceftriaxone exposure.",
  },
  administration: {
    infusion: "Usually infused over about 30 minutes; avoid sharing a line with calcium-containing solutions.",
    compatibility: "Use normal saline rather than calcium-containing fluids when line compatibility is in question.",
    note: "Once-daily dosing is one of ceftriaxone's biggest operational advantages for ED bridge therapy and OPAT.",
  },
  ivToPoSwitch: {
    poBioavailability: "No oral ceftriaxone formulation exists, so step-down means switching to a different active oral agent rather than converting the same drug.",
    switchCriteria: "Move off ceftriaxone once the patient is stable, source control is handled, and a high-bioavailability susceptible oral option is identified.",
    note: "Think of ceftriaxone as a bridge, not as the final answer for every susceptible isolate.",
  },
  opatEligibility: {
    eligible: "yes",
    administration: "Once-daily IV administration makes ceftriaxone one of the easiest OPAT agents to operationalize.",
    monitoring: "CBC and liver tests are reasonable on longer courses, with extra attention to biliary symptoms during extended therapy.",
    considerations: [
      "Excellent for susceptible urinary-source bacteremia and streptococcal/HACEK endovascular therapy.",
      "Not the right OPAT drug for AmpC, ESBL, or Pseudomonas phenotypes.",
    ],
  },
  interactionActions: [
    {
      interactingAgent: "Calcium-containing IV solutions",
      effect: "Physical precipitation can occur, with the highest-risk signal in neonates.",
      management: "Never co-infuse in neonates and flush lines carefully in adults.",
      severity: "major",
    },
    {
      interactingAgent: "Warfarin",
      effect: "INR can drift upward through gut-flora and vitamin K effects during longer courses.",
      management: "Monitor INR more closely when starting or stopping ceftriaxone in anticoagulated patients.",
      severity: "monitor",
    },
  ],
  stewardshipUseCases: [
    {
      scenario: "Daily IV bridge for susceptible Enterobacterales infection",
      role: "Ceftriaxone is a high-value bridge while culture data finalize or while arranging an oral discharge option.",
      notes: "Its convenience should not be mistaken for resistance breadth.",
    },
    {
      scenario: "Once-daily OPAT for streptococcal or HACEK disease",
      role: "Long half-life and reliable bloodstream exposure make ceftriaxone an operational workhorse when the organism truly fits the drug.",
      notes: "Avoid leaving it in place for AmpC-risk organisms just because the schedule is easy.",
    },
  ],
};

export const LEVOFLOXACIN_EXECUTION_ENHANCEMENTS: Partial<DrugMonograph> = {
  dosingByIndication: [
    {
      label: "Pyelonephritis or complicated UTI",
      regimen: "750 mg PO/IV daily for 5-7 days",
      notes: "Use the high-dose short-course strategy when the isolate is susceptible and the syndrome truly fits fluoroquinolone therapy.",
    },
    {
      label: "CAP or mixed respiratory-urinary coverage",
      regimen: "750 mg PO/IV daily",
      notes: "Respiratory coverage is the main advantage levofloxacin has over ciprofloxacin when syndromes overlap.",
    },
  ],
  renalReplacement: [
    {
      modality: "HD",
      guidance: "Use the adjusted dose after hemodialysis because although levofloxacin is not fully removed, missed post-HD timing can still undercut exposure.",
    },
    {
      modality: "CRRT",
      guidance: "CRRT often supports q24h dosing, but severe infection and high-effluent clearance may require closer review than the package insert suggests.",
    },
  ],
  specialPopulations: [
    {
      population: "Older adults, diabetics, or patients on QT-prolonging drugs",
      guidance: "Levofloxacin carries meaningful dysglycemia, QT, tendon, and CNS risk, so the oral convenience should be balanced against those host factors before discharge.",
    },
    {
      population: "Enteral feeding or supplement-heavy regimens",
      guidance: "Cation timing still matters even though levofloxacin absorption is excellent on paper.",
    },
  ],
  therapeuticDrugMonitoring: {
    target: "No routine serum target is used; clinical success depends on susceptibility, adequate dose, and avoiding preventable absorption failures.",
    sampling: "No drug levels are standard. Recheck ECG, glucose trend, renal function, and symptom response instead.",
    adjustment: "When toxicity risk starts to outweigh benefit, switch classes rather than trying to finesse prolonged fluoroquinolone use in a poor host.",
  },
  administration: {
    infusion: "IV levofloxacin is usually infused over at least 60 minutes.",
    oralAbsorption: "Near-complete oral absorption makes IV therapy operationally unnecessary once the patient can swallow reliably.",
    note: "Separate cations and review QT-active co-medications before signing off on oral discharge plans.",
  },
  ivToPoSwitch: {
    poBioavailability: "Near-complete oral bioavailability; PO and IV exposure are effectively equivalent.",
    switchCriteria: "Switch to PO as soon as hemodynamics and absorption are reliable because keeping IV levofloxacin rarely adds clinical value.",
    note: "Levofloxacin is one of the simplest high-bioavailability discharge exits when the microbiology and safety profile fit.",
  },
  opatEligibility: {
    eligible: "conditional",
    administration: "IV therapy is possible, but oral completion should be the default whenever the GI tract works.",
    monitoring: "Review QTc, glucose, tendon symptoms, CNS effects, and cation timing before discharge.",
    considerations: [
      "Prefer oral completion over OPAT in most stable patients.",
      "Reserve the class for syndromes where its respiratory plus urinary profile truly matters.",
    ],
  },
  interactionActions: [
    {
      interactingAgent: "Calcium, iron, magnesium, antacids, or enteral feeds",
      effect: "Chelation can erase the expected oral equivalence.",
      management: "Separate from cations and hold feeds around dosing when needed.",
      severity: "major",
    },
    {
      interactingAgent: "Other QT-prolonging drugs",
      effect: "Levofloxacin has a stronger QT signal than ciprofloxacin.",
      management: "Check ECG context and electrolyte status before approving discharge therapy.",
      severity: "major",
    },
    {
      interactingAgent: "Insulin or sulfonylureas",
      effect: "Class-related dysglycemia can become clinically significant during outpatient therapy.",
      management: "Warn the team and patient to monitor glucose more closely early in the course.",
      severity: "monitor",
    },
  ],
  stewardshipUseCases: [
    {
      scenario: "High-bioavailability oral exit for susceptible pyelonephritis",
      role: "Levofloxacin can shorten IV exposure and avoid PICC placement when resistance and toxicity tradeoffs are acceptable.",
      notes: "Use it deliberately, not automatically, because the ecological and boxed-warning costs are real.",
    },
    {
      scenario: "Single-drug coverage when respiratory and urinary sources overlap",
      role: "Its combined respiratory and urinary profile can simplify early transitions when the isolate and patient factors fit.",
      notes: "That convenience should not override QT, tendon, or dysglycemia risk.",
    },
  ],
};

export const CEFAZOLIN_EXECUTION_ENHANCEMENTS: Partial<DrugMonograph> = {
  dosingByIndication: [
    {
      label: "MSSA bacteremia or endocarditis",
      regimen: "2 g IV q8h",
      notes: "Definitive MSSA therapy should stay at full-dose q8h exposure unless renal replacement or obesity demands something more individualized.",
    },
    {
      label: "Serious SSTI or osteoarticular infection",
      regimen: "2 g IV q8h",
      notes: "Use the same full-dose regimen for deep MSSA skin, bone, and joint disease because once-daily convenience is not worth underexposure.",
    },
  ],
  renalReplacement: [
    {
      modality: "HD",
      guidance: "Post-hemodialysis high-dose scheduling is common because cefazolin's dialysis removal is clinically meaningful and missed redosing is a frequent OPAT failure point.",
    },
    {
      modality: "CRRT",
      guidance: "Many CRRT patients still need aggressive 2 g q12h-style dosing for deep MSSA infection, especially when bacteremia or bone infection is active.",
    },
  ],
  specialPopulations: [
    {
      population: "Obesity",
      guidance: "Severe obesity may need 2 g q6h-style exposure or higher surgical-prophylaxis doses to preserve MSSA target attainment.",
    },
    {
      population: "Reported penicillin allergy",
      guidance: "Because cefazolin's side chain is distinct, many patients with a penicillin allergy label can still receive it safely and should not be pushed to vancomycin by default.",
    },
  ],
  therapeuticDrugMonitoring: {
    target: "No routine serum target is used; success depends on maintaining aggressive scheduled dosing and not defaulting to vancomycin for MSSA.",
    sampling: "No drug levels are standard. Follow renal function and clinical clearance instead.",
    adjustment: "If bacteremia persists, look for source-control issues, inoculum effect concerns, or the wrong organism before blaming cefazolin exposure alone.",
  },
  administration: {
    infusion: "Usually infused over about 30 minutes; some programs use IV push or elastomeric workflows once compatibility and concentration are standardized.",
    stability: "Cefazolin is OPAT-friendly in many compounding programs, which is part of why it outperforms nafcillin operationally.",
    note: "Use the MSSA-first mindset: cefazolin is a definitive drug, not just a temporary bridge.",
  },
  ivToPoSwitch: {
    poBioavailability: "No oral cefazolin formulation exists, so oral completion requires switching to a different active agent rather than converting the same drug.",
    switchCriteria: "Consider oral exit only when the syndrome supports it, source control is complete, and another high-bioavailability active oral option exists.",
    note: "Many MSSA bacteremia and endocarditis cases remain IV for the full definitive course.",
  },
  opatEligibility: {
    eligible: "yes",
    administration: "Q8h dosing or structured post-HD regimens make cefazolin a common and highly effective OPAT agent for MSSA.",
    monitoring: "Weekly CBC and renal function are typical in prolonged courses, with extra review if a probenecid-assisted schedule is being attempted.",
    considerations: [
      "Excellent OPAT option for MSSA bacteremia, osteomyelitis, and endocarditis when home infusion logistics can handle the schedule.",
      "Prefer cefazolin over vancomycin for MSSA whenever allergy history does not truly exclude it.",
    ],
  },
  interactionActions: [
    {
      interactingAgent: "Probenecid",
      effect: "Can prolong cefazolin exposure and is sometimes used intentionally in OPAT programs.",
      management: "Only use the combination intentionally with a documented plan rather than incidentally.",
      severity: "monitor",
    },
    {
      interactingAgent: "Warfarin",
      effect: "INR can drift upward during longer courses.",
      management: "Monitor INR more closely when cefazolin is added or stopped in anticoagulated patients.",
      severity: "monitor",
    },
  ],
  stewardshipUseCases: [
    {
      scenario: "Definitive MSSA therapy",
      role: "Cefazolin should replace vancomycin promptly once MSSA is confirmed unless a true allergy or CNS edge case blocks it.",
      notes: "That de-escalation is one of the highest-value stewardship moves on inpatient ID rounds.",
    },
    {
      scenario: "OPAT for MSSA bone, skin, or bloodstream infection",
      role: "Operational simplicity and low collateral damage make cefazolin a workhorse outpatient IV agent.",
      notes: "Its convenience should not tempt use against AmpC or other cefazolin-resistant phenotypes.",
    },
  ],
};

export const DAPTOMYCIN_EXECUTION_ENHANCEMENTS: Partial<DrugMonograph> = {
  dosingByIndication: [
    {
      label: "Complicated SSTI",
      regimen: "4 mg/kg IV q24h",
      notes: "Use the labeled dose only for true skin/soft-tissue infection; it is usually too low for endovascular or bone disease.",
    },
    {
      label: "MRSA bacteremia, endocarditis, or osteomyelitis",
      regimen: "8-10 mg/kg IV q24h",
      notes: "Higher-dose therapy is the modern inpatient standard for serious MRSA disease and many OPAT programs.",
    },
    {
      label: "Serious VRE infection",
      regimen: "10-12 mg/kg IV q24h",
      notes: "Use the upper end when bactericidal activity matters and susceptibility is not generous.",
    },
  ],
  renalReplacement: [
    {
      modality: "HD",
      guidance: "Post-HD dosing is standard because dialysis meaningfully changes exposure and the missed supplemental dose can derail bacteremia therapy.",
    },
    {
      modality: "CRRT",
      guidance: "CRRT often needs high-dose daily or near-daily scheduling rather than the labeled q48h approach when serious bloodstream infection is active.",
    },
  ],
  specialPopulations: [
    {
      population: "Obesity",
      guidance: "Use actual body weight for initial dosing, then reassess CK trend and clinical response rather than arbitrarily capping serious-infection doses.",
    },
    {
      population: "Concurrent statin therapy or baseline myopathy risk",
      guidance: "Hold statins whenever possible and treat rising CK or new muscle symptoms as a real toxicity signal, not a lab nuisance.",
    },
  ],
  therapeuticDrugMonitoring: {
    target: "No routine serum concentration target is used; weekly CK surveillance is the practical monitoring anchor.",
    sampling: "Obtain baseline CK and repeat at least weekly, with earlier checks if symptoms, renal shifts, or statin exposure increase risk.",
    adjustment: "If CK climbs or bacteremia persists, adjust the regimen based on toxicity or microbiology rather than using trough-like serum levels.",
  },
  administration: {
    infusion: "Many programs infuse over 30 minutes; selected lower doses can also be delivered as IV push when local standards allow.",
    note: "Once-daily dosing is one of daptomycin's biggest OPAT strengths, but it does not rescue the drug from its hard lung contraindication.",
  },
  ivToPoSwitch: {
    poBioavailability: "No oral formulation exists.",
    switchCriteria: "Daptomycin is not an IV-to-PO conversion drug; transition means switching to a different active oral agent only when the syndrome allows it.",
    note: "Do not keep daptomycin solely because the home schedule is easy if an effective oral alternative exists.",
  },
  opatEligibility: {
    eligible: "yes",
    administration: "Once-daily IV dosing makes daptomycin one of the most practical OPAT agents for serious gram-positive infection.",
    monitoring: "Weekly CK and renal function are the minimum outpatient monitoring set, with faster follow-up if statins or symptoms complicate the course.",
    considerations: [
      "Excellent OPAT option for MRSA bacteremia, osteomyelitis, and selected VRE infection.",
      "Never use it when pneumonia is the unresolved source question.",
    ],
  },
  interactionActions: [
    {
      interactingAgent: "Statins",
      effect: "Additive myopathy risk can drive CK elevation and rhabdomyolysis.",
      management: "Hold the statin for the daptomycin course whenever feasible.",
      severity: "major",
    },
  ],
  stewardshipUseCases: [
    {
      scenario: "MRSA bacteremia or osteomyelitis with kidney injury risk",
      role: "Daptomycin is a strong vancomycin alternative when bactericidal gram-positive therapy is needed outside the lung.",
      notes: "Its once-daily schedule also simplifies OPAT planning.",
    },
    {
      scenario: "Need for a bactericidal VRE regimen",
      role: "High-dose daptomycin is one of the few bactericidal options when linezolid's bacteriostatic profile is a limitation.",
      notes: "Dose intensity matters more than convenience in these infections.",
    },
  ],
};

export const METRONIDAZOLE_EXECUTION_ENHANCEMENTS: Partial<DrugMonograph> = {
  dosingByIndication: [
    {
      label: "Intra-abdominal or pelvic anaerobic infection",
      regimen: "500 mg IV/PO q8h",
      notes: "Use it as the anaerobic partner rather than as monotherapy for mixed infections.",
    },
    {
      label: "Brain abscess anaerobic coverage",
      regimen: "500 mg IV/PO q8h",
      notes: "Strong CNS penetration is the reason it remains a brain-abscess staple when anaerobes matter.",
    },
    {
      label: "Fulminant CDI adjunct",
      regimen: "500 mg IV q8h",
      notes: "Its remaining CDI role is adjunctive systemic therapy when ileus limits luminal drug delivery.",
    },
  ],
  renalReplacement: [
    {
      modality: "HD",
      guidance: "Standard dosing usually works, but give the next dose after dialysis if sessions are long or daily because metronidazole and metabolites are dialyzable.",
    },
    {
      modality: "CRRT",
      guidance: "Most CRRT patients can remain on standard q8h therapy, with neurotoxicity vigilance taking priority over aggressive dose escalation.",
    },
  ],
  specialPopulations: [
    {
      population: "Severe hepatic impairment",
      guidance: "Accumulation and neurotoxicity become more likely, so longer courses need slower dosing or closer symptom review.",
    },
    {
      population: "Alcohol use disorder or prolonged therapy",
      guidance: "Counsel hard on alcohol avoidance and monitor for cumulative neuropathy rather than treating metronidazole as a benign long-course drug.",
    },
  ],
  therapeuticDrugMonitoring: {
    target: "No routine serum target is used; the clinical target is effective anaerobe control without cumulative neuropathy.",
    sampling: "No drug levels are standard. Use neurologic review and hepatic function instead.",
    adjustment: "If prolonged therapy causes numbness, ataxia, or encephalopathy, stop or switch rather than trying to salvage the course.",
  },
  administration: {
    infusion: "IV doses are typically infused over 30-60 minutes.",
    oralAbsorption: "Oral bioavailability is essentially complete, so PO and IV systemic exposure are effectively interchangeable.",
    note: "Metronidazole is one of the easiest stewardship wins for early IV-to-PO conversion.",
  },
  ivToPoSwitch: {
    poBioavailability: "Near-complete oral bioavailability with IV-equivalent systemic exposure.",
    switchCriteria: "Convert to PO as soon as the gut works because IV metronidazole rarely adds value once absorption is reliable.",
    note: "The common mistake is leaving it IV out of habit instead of because the patient needs it.",
  },
  opatEligibility: {
    eligible: "no",
    administration: "Prefer oral continuation over OPAT because IV metronidazole offers little advantage once enteral absorption is intact.",
    monitoring: "If prolonged therapy is needed, follow neurologic symptoms and hepatic function rather than arranging unnecessary infusion logistics.",
    considerations: [
      "One of the highest-yield avoidable OPAT drugs because oral absorption is so strong.",
    ],
  },
  interactionActions: [
    {
      interactingAgent: "Warfarin",
      effect: "INR can climb quickly through CYP2C9 inhibition.",
      management: "Reduce warfarin or monitor INR closely rather than discovering the interaction through bleeding.",
      severity: "major",
    },
    {
      interactingAgent: "Alcohol or disulfiram",
      effect: "Can cause severe nausea, flushing, and neuropsychiatric toxicity.",
      management: "Counsel patients to avoid alcohol during therapy and for 48-72 hours after the last dose.",
      severity: "major",
    },
  ],
  stewardshipUseCases: [
    {
      scenario: "Anaerobic partner in mixed intra-abdominal infection",
      role: "Metronidazole lets the partner beta-lactam focus on gram-negatives while preserving explicit anaerobe coverage.",
      notes: "It should not be mistaken for broad monotherapy.",
    },
    {
      scenario: "IV-to-PO conversion opportunity",
      role: "Because oral absorption is so strong, continuing IV metronidazole after GI recovery is usually a pure stewardship miss.",
      notes: "Use this as a standard rounds checkpoint.",
    },
  ],
};

export const RIFAMPIN_EXECUTION_ENHANCEMENTS: Partial<DrugMonograph> = {
  dosingByIndication: [
    {
      label: "Prosthetic joint infection with retained hardware",
      regimen: "300-450 mg PO q12h",
      notes: "Always combine with an active companion drug and start after debridement plus bloodstream control.",
    },
    {
      label: "Prosthetic valve endocarditis or higher-burden biofilm disease",
      regimen: "300-450 mg PO q8h",
      notes: "Use only when the implant or biofilm context truly justifies the interaction burden.",
    },
  ],
  renalReplacement: [
    {
      modality: "HD",
      guidance: "No dose adjustment or post-HD supplementation is usually needed because rifampin is not meaningfully removed by dialysis.",
    },
    {
      modality: "CRRT",
      guidance: "Standard dosing is usually maintained in CRRT; the practical dose-limiting issue is hepatic toxicity and drug interaction management, not filter clearance.",
    },
  ],
  specialPopulations: [
    {
      population: "Hepatic disease",
      guidance: "Baseline and interval liver tests matter more than usual because rifampin can tip a marginal liver into a real toxicity problem.",
    },
    {
      population: "Methadone, oral contraception, transplant, or complex polypharmacy",
      guidance: "This is the classic 'interaction-heavy' host where rifampin should only be used when its biofilm value clearly outweighs the collateral medication disruption.",
    },
  ],
  therapeuticDrugMonitoring: {
    target: "No routine serum target is used in routine bone and joint care; the real target is effective combination therapy without hepatic or interaction-related failure.",
    sampling: "No drug levels are standard outside specialist TB or malabsorption scenarios. Monitor LFTs and the companion-drug plan instead.",
    adjustment: "If toxicity or interaction fallout becomes unmanageable, change the rifampin plan rather than pretending the biofilm upside is automatic.",
  },
  administration: {
    oralAbsorption: "Oral therapy is the usual route and is best absorbed on an empty stomach, though tolerability may justify food when needed.",
    note: "Orange body fluids and permanent contact-lens staining should be part of routine counseling.",
  },
  ivToPoSwitch: {
    poBioavailability: "Oral therapy is the standard route; IV rifampin is rarely needed in routine hardware infection care.",
    switchCriteria: "If rifampin is started IV in a special case, convert to PO as soon as the patient can absorb reliably.",
    note: "The bigger timing question is not IV vs PO but whether bacteremia and source control are ready for rifampin at all.",
  },
  opatEligibility: {
    eligible: "no",
    administration: "Rifampin is usually an oral adjunct rather than an OPAT anchor.",
    monitoring: "Outpatient care should focus on liver tests and companion-drug interaction management rather than infusion logistics.",
    considerations: [
      "Never use rifampin as monotherapy.",
      "Review the entire medication list before discharge because interaction failures often happen after the patient leaves.",
    ],
  },
  interactionActions: [
    {
      interactingAgent: "Warfarin",
      effect: "Potent enzyme induction can dramatically lower INR control and then rebound when rifampin is stopped.",
      management: "Expect major dose changes and monitor INR closely at both the start and the stop.",
      severity: "major",
    },
    {
      interactingAgent: "Methadone, oral contraceptives, calcineurin inhibitors, or azoles",
      effect: "Rifampin can collapse exposure to these drugs and destabilize the rest of the treatment plan.",
      management: "Use rifampin only with an explicit medication-management plan for each high-risk interacting drug.",
      severity: "major",
    },
  ],
  stewardshipUseCases: [
    {
      scenario: "Staphylococcal prosthetic infection with retained material",
      role: "Rifampin earns its place when biofilm activity materially changes the chance of cure.",
      notes: "That benefit does not extend automatically to native-valve or native-tissue disease.",
    },
    {
      scenario: "Temptation to add rifampin to any tough Staph infection",
      role: "Use restraint; the drug is worth its interaction burden mainly in true hardware or biofilm syndromes.",
      notes: "Native-valve SAB is not the same biologic problem.",
    },
  ],
};

export const FLUCONAZOLE_EXECUTION_ENHANCEMENTS: Partial<DrugMonograph> = {
  dosingByIndication: [
    {
      label: "Candidemia step-down",
      regimen: "800 mg IV/PO load, then 400 mg IV/PO daily",
      notes: "Use after blood-culture clearance and susceptibility confirmation, not as blind first-line therapy for unstable candidemia.",
    },
    {
      label: "Candiduria",
      regimen: "200-400 mg IV/PO daily",
      notes: "Use only when urinary Candida truly warrants treatment because fluconazole is one of the few antifungals that actually reaches the urine well.",
    },
    {
      label: "Cryptococcal consolidation",
      regimen: "400-800 mg PO daily",
      notes: "Long-course use makes adherence and drug interaction review as important as the initial prescription.",
    },
  ],
  renalReplacement: [
    {
      modality: "HD",
      guidance: "Give the full scheduled dose after hemodialysis because a substantial fraction is removed during the run.",
    },
    {
      modality: "CRRT",
      guidance: "CRRT often approximates normal renal clearance, so moderate-to-high daily dosing is frequently still needed.",
    },
  ],
  specialPopulations: [
    {
      population: "Pregnancy or prolonged high-dose therapy",
      guidance: "Avoid chronic high-dose fluconazole in pregnancy when possible and be explicit about fetal risk rather than treating it like a benign all-comers azole.",
    },
    {
      population: "Obesity, CRRT, or unexpectedly resistant Candida",
      guidance: "Upper-end dosing and occasional specialist review matter when standard exposure may be too light for the host or MIC.",
    },
  ],
  therapeuticDrugMonitoring: {
    target: "Routine serum targets are not usually required because fluconazole PK is predictable.",
    sampling: "Consider levels only in unusual high-dose, obesity, or renal replacement scenarios when exposure is uncertain.",
    adjustment: "Fix loading doses and renal-replacement dosing before assuming clinical failure is microbiologic.",
  },
  administration: {
    infusion: "IV and PO doses are generally interchangeable; the IV formulation is usually infused over 1-2 hours depending on dose and concentration.",
    oralAbsorption: "High oral bioavailability makes PO therapy clinically equivalent for most stable patients.",
    note: "For many patients, the biggest stewardship win is simply remembering the loading dose and converting to PO early.",
  },
  ivToPoSwitch: {
    poBioavailability: "High oral bioavailability with near-1:1 IV-to-PO conversion.",
    switchCriteria: "Switch to PO once the patient can absorb reliably because IV therapy rarely adds value after stabilization.",
    note: "Loading-dose omission hurts more often than delayed PO conversion.",
  },
  opatEligibility: {
    eligible: "conditional",
    administration: "IV fluconazole is feasible in OPAT, but oral continuation should be preferred whenever the gut works.",
    monitoring: "Follow liver tests, renal function, and the interaction list rather than defaulting to an infusion plan.",
    considerations: [
      "Excellent oral step-down option for susceptible Candida syndromes.",
      "One of the few antifungals that reaches the urine well.",
    ],
  },
  interactionActions: [
    {
      interactingAgent: "Warfarin",
      effect: "CYP2C9 inhibition can raise INR quickly and meaningfully.",
      management: "Reduce warfarin or arrange close INR follow-up when starting fluconazole.",
      severity: "major",
    },
    {
      interactingAgent: "Tacrolimus, cyclosporine, or CYP3A4-sensitive statins",
      effect: "Exposure to these drugs can rise enough to cause nephrotoxicity or rhabdomyolysis.",
      management: "Adjust doses and monitor levels or switch the interacting medication when feasible.",
      severity: "major",
    },
  ],
  stewardshipUseCases: [
    {
      scenario: "Susceptibility-confirmed Candida step-down",
      role: "Fluconazole is the cleanest oral exit for susceptible candidemia once cultures clear and the patient stabilizes.",
      notes: "Do not let its convenience trick the team into using it against intrinsically resistant species.",
    },
    {
      scenario: "Candida urinary tract infection",
      role: "Because it reaches the urine well, fluconazole solves a niche that echinocandins do not.",
      notes: "Treat candiduria only when the syndrome truly warrants therapy.",
    },
  ],
};

export const VORICONAZOLE_EXECUTION_ENHANCEMENTS: Partial<DrugMonograph> = {
  dosingByIndication: [
    {
      label: "Invasive aspergillosis",
      regimen: "6 mg/kg IV q12h for 2 doses, then 4 mg/kg IV q12h or 200 mg PO q12h after loading",
      notes: "Loading matters because delayed steady state in severe mold disease is not acceptable.",
    },
    {
      label: "CNS or ocular mold infection",
      regimen: "Use the same loaded regimen with mandatory trough-guided adjustment",
      notes: "These sites are where voriconazole's penetration advantage matters most and where subtherapeutic levels matter quickly.",
    },
  ],
  renalReplacement: [
    {
      modality: "HD",
      guidance: "Prefer PO therapy because the IV vehicle accumulates when renal function is poor; if IV is unavoidable, treat it as a short bridge and convert early.",
    },
    {
      modality: "CRRT",
      guidance: "PO therapy is still preferred when possible; CRRT can clear some IV vehicle, but it does not remove the need for TDM or early oral conversion.",
    },
  ],
  specialPopulations: [
    {
      population: "Hepatic impairment",
      guidance: "Keep the loading dose but reduce maintenance exposure and follow levels closely because hepatotoxicity is exposure-related.",
    },
    {
      population: "Transplant patients or CYP2C19 outliers",
      guidance: "Expect interaction-heavy care and unpredictable concentrations, especially in poor or ultra-rapid metabolizers.",
    },
  ],
  therapeuticDrugMonitoring: {
    target: "Voriconazole trough roughly 1-5.5 mcg/mL, balancing mold efficacy against neurotoxicity and hepatotoxicity.",
    sampling: "Check the first trough around day 5 and repeat with dose changes, interacting-drug changes, organ failure shifts, or unexplained toxicity/failure.",
    adjustment: "Adjust the maintenance dose, not the loading dose, and do not ignore level trends when liver tests or visual symptoms worsen.",
    pearls: [
      "This is true pharmacist-owned antifungal TDM work, not optional fine-tuning.",
    ],
  },
  administration: {
    infusion: "IV dosing usually runs over 1-2 hours.",
    oralAbsorption: "Oral bioavailability is excellent, but absorption is best on an empty stomach and PO is preferred over IV when renal function is poor.",
    note: "IV voriconazole is often just a bridge until the patient can swallow and the level plan is in place.",
  },
  ivToPoSwitch: {
    poBioavailability: "Excellent oral bioavailability with clinically reliable IV-to-PO conversion.",
    switchCriteria: "Switch to PO once the patient can absorb and the team can keep up with trough monitoring and interaction management.",
    note: "PO is often safer than IV because it avoids the cyclodextrin vehicle burden in renal dysfunction.",
  },
  opatEligibility: {
    eligible: "conditional",
    administration: "OPAT is feasible, but oral therapy with level monitoring is usually the preferred outpatient path.",
    monitoring: "Needs a real outpatient plan for troughs, LFTs, visual symptoms, QT context, and interacting drugs.",
    considerations: [
      "Best suited for programs that can support antifungal TDM.",
      "If mucormycosis remains on the table, voriconazole is the wrong outpatient drug no matter how convenient it is.",
    ],
  },
  interactionActions: [
    {
      interactingAgent: "Tacrolimus, cyclosporine, or sirolimus",
      effect: "Exposure can rise dramatically, with sirolimus representing a near-hard-stop interaction.",
      management: "Reduce calcineurin inhibitor doses proactively and avoid sirolimus unless the transplant plan changes first.",
      severity: "major",
    },
    {
      interactingAgent: "Rifampin or other strong enzyme inducers",
      effect: "Voriconazole exposure can collapse and make mold therapy fail.",
      management: "Treat rifampin as contraindicated and redesign the regimen rather than trying to out-dose the interaction casually.",
      severity: "major",
    },
    {
      interactingAgent: "QT-prolonging drugs",
      effect: "Additive QT risk becomes more relevant once levels run high.",
      management: "Review the ECG context and interacting list every time the dose or level changes.",
      severity: "monitor",
    },
  ],
  stewardshipUseCases: [
    {
      scenario: "First-line invasive aspergillosis",
      role: "Voriconazole remains the reference oral-capable mold agent when Aspergillus is the target and outpatient continuation is likely.",
      notes: "That role depends on real TDM support and interaction management.",
    },
    {
      scenario: "Empiric mold coverage when Mucorales are plausible",
      role: "Do not use voriconazole just because it is familiar if mucormycosis is still in the differential.",
      notes: "Its convenience does not cover that spectrum gap.",
    },
  ],
};

export const PIP_TAZO_EXECUTION_ENHANCEMENTS: Partial<DrugMonograph> = {
  dosingByIndication: [
    {
      label: "HAP / VAP or severe sepsis",
      regimen: "4.5 g IV q8h as 4-hour extended infusion",
      notes: "Extended infusion is the preferred default for serious inpatient infection because susceptibility at the breakpoint is otherwise shaky.",
    },
    {
      label: "Febrile neutropenia or high-inoculum intra-abdominal infection",
      regimen: "4.5 g IV q6h or aggressive extended-infusion equivalent",
      notes: "Use the more aggressive schedule when host factors or inoculum burden make target attainment less forgiving.",
    },
  ],
  renalReplacement: [
    {
      modality: "HD",
      guidance: "Use renally adjusted dosing with a post-hemodialysis supplement because both missed redosing and accidental full-dose continuation can cause avoidable harm.",
    },
    {
      modality: "CRRT",
      guidance: "CRRT often still needs 3.375-4.5 g q6-8h-style exposure, especially when Pseudomonas or abdominal sepsis is driving the case.",
    },
  ],
  specialPopulations: [
    {
      population: "Augmented renal clearance",
      guidance: "ARC is the classic reason pip-tazo underperforms in ICU patients; default to aggressive extended infusion and reassess quickly.",
    },
    {
      population: "Patients receiving concurrent vancomycin or prolonged courses",
      guidance: "The AKI and neutropenia signals become more relevant as duration lengthens, so use cefepime or narrower therapy once the syndrome allows it.",
    },
  ],
  therapeuticDrugMonitoring: {
    target: "No routine serum target is used, but the practical goal is full interval coverage above the organism MIC in severe infection.",
    sampling: "Use beta-lactam TDM if your program offers it for CRRT, ARC, persistent bacteremia, or borderline Pseudomonas MICs.",
    adjustment: "Fix infusion time, dose, and interval before reflexively layering on more gram-negative agents.",
  },
  administration: {
    infusion: "Extended infusion over 4 hours is preferred for serious infection.",
    compatibility: "Avoid sharing lines with aminoglycosides or vancomycin without verified compatibility and disciplined flushing.",
    stability: "Extended-infusion and continuous-infusion workflows depend on local stability rules being followed consistently.",
    note: "Pip-tazo is operationally safest when extended infusion is the default order-set behavior, not a special request.",
  },
  ivToPoSwitch: {
    poBioavailability: "No oral formulation exists, so step-down requires switching to a different active oral drug.",
    switchCriteria: "Leave pip-tazo once the patient is stable, cultures define the pathogen, and a narrower IV or active oral agent is available.",
    note: "Do not keep it just because it covers everything early on.",
  },
  opatEligibility: {
    eligible: "conditional",
    administration: "OPAT is feasible through extended- or continuous-infusion programs, but it is more logistically demanding than once-daily alternatives.",
    monitoring: "Weekly CBC and renal function are baseline expectations, with tighter follow-up when vancomycin or prolonged therapy is involved.",
    considerations: [
      "Good OPAT choice only when its Enterococcus and anaerobe profile truly matters and logistics can support frequent dosing or continuous infusion.",
      "Poor definitive choice once ESBL disease is proven.",
    ],
  },
  interactionActions: [
    {
      interactingAgent: "Vancomycin",
      effect: "The combined AKI signal is substantially worse than vancomycin plus cefepime in many cohorts.",
      management: "Use the combination only when its specific spectrum is needed and shorten the overlap aggressively.",
      severity: "major",
    },
    {
      interactingAgent: "Aminoglycosides",
      effect: "Physical incompatibility and additive renal toxicity complicate combination use.",
      management: "Run through separate lines when possible and reassess quickly whether dual therapy is still justified.",
      severity: "monitor",
    },
  ],
  stewardshipUseCases: [
    {
      scenario: "Empiric abdominal, aspiration, or enterococcal-prone sepsis",
      role: "Pip-tazo is valuable when anaerobes and Enterococcus faecalis really belong in the initial frame.",
      notes: "That spectrum should be defended by syndrome, not just habit.",
    },
    {
      scenario: "De-escalation after early broad empiric coverage",
      role: "Once cultures define a narrower active option, pip-tazo should usually leave the regimen quickly.",
      notes: "Its convenience as a one-bag broad agent is not a reason to keep it as definitive therapy.",
    },
  ],
};

export const AMPICILLIN_SULBACTAM_EXECUTION_ENHANCEMENTS: Partial<DrugMonograph> = {
  dosingByIndication: [
    {
      label: "Aspiration pneumonia or mixed oral-flora infection",
      regimen: "3 g IV q6h",
      notes: "Best used when oral anaerobes, streptococci, and MSSA are the real drivers rather than resistant hospital gram-negatives.",
    },
    {
      label: "Biliary infection or lower-risk community intra-abdominal infection",
      regimen: "3 g IV q6h",
      notes: "Only keep it definitive when local Enterobacterales susceptibility still supports the choice.",
    },
  ],
  renalReplacement: [
    {
      modality: "HD",
      guidance: "Use renally adjusted dosing with post-hemodialysis redosing because both accumulation and missed supplements can cause avoidable harm.",
    },
    {
      modality: "CRRT",
      guidance: "Many CRRT patients still need q6-8h exposure, especially when the syndrome is severe and source control is still evolving.",
    },
  ],
  specialPopulations: [
    {
      population: "High Enterobacterales burden or prior ESBL history",
      guidance: "Do not stretch ampicillin-sulbactam into definitive therapy when the patient or prior cultures point toward resistant gram-negatives.",
    },
    {
      population: "Fluid-sensitive patients",
      guidance: "The q6h sodium and line-access burden matters more during prolonged therapy, so move to a simpler definitive regimen once cultures allow it.",
    },
  ],
  therapeuticDrugMonitoring: {
    target: "No routine serum target; success depends on source selection, interval optimization, and prompt narrowing once cultures return.",
    sampling: "No drug levels are standard. Follow renal function, WBC trend, and whether the clinical syndrome still justifies this spectrum.",
    adjustment: "If the patient is not improving, reassess source control and resistance risk before reflexively adding more anaerobic or gram-positive coverage.",
  },
  administration: {
    infusion: "Intermittent infusion over 30 minutes is standard, though extended infusion can be used in selected critically ill patients.",
    compatibility: "Separate from aminoglycosides when feasible because beta-lactam and aminoglycoside co-mingling in lines can be problematic.",
    note: "There is no oral equivalent; discharge planning should focus on amoxicillin-clavulanate or another targeted oral option when appropriate.",
  },
  ivToPoSwitch: {
    poBioavailability: "No oral ampicillin-sulbactam formulation exists.",
    switchCriteria: "Leave IV ampicillin-sulbactam once the patient is clinically improving and an active oral option such as amoxicillin-clavulanate or a culture-directed alternative is available.",
    note: "Do not keep q6h IV therapy on the discharge plan just because aspiration coverage was useful on day 1.",
  },
  opatEligibility: {
    eligible: "conditional",
    administration: "OPAT is possible, but q6h dosing or continuous-infusion logistics are more cumbersome than ceftriaxone- or ertapenem-based plans.",
    monitoring: "Weekly CBC and renal function are the minimum; confirm that the syndrome still needs this mixed-flora spectrum before building home infusion around it.",
    considerations: [
      "Reasonable when aspiration, oral flora, or biliary infection truly remain the ongoing target.",
      "Poor OPAT anchor once resistant Enterobacterales become the dominant concern.",
    ],
  },
  interactionActions: [
    {
      interactingAgent: "Probenecid",
      effect: "Raises ampicillin and sulbactam exposure by reducing renal tubular secretion.",
      management: "Avoid the combination rather than trying to use probenecid to rescue underdosing.",
      severity: "monitor",
    },
    {
      interactingAgent: "Allopurinol",
      effect: "May increase the frequency of aminopenicillin-associated rash and confuse whether the patient has a true allergy.",
      management: "If a rash appears, document the context carefully before labeling the patient penicillin-allergic.",
      severity: "monitor",
    },
  ],
  stewardshipUseCases: [
    {
      scenario: "Aspiration and oral-flora driven infection",
      role: "Ampicillin-sulbactam is a focused alternative to broader antipseudomonal therapy when aspiration biology is the real story.",
      notes: "Its value falls quickly when resistant hospital gram-negatives take over the differential.",
    },
    {
      scenario: "De-escalation away from pip-tazo or carbapenems",
      role: "A strong narrowing option when cultures and syndrome confirm it still covers the true pathogens.",
      notes: "Do not use it as a comfort blanket when ESBL or AmpC risk remains unresolved.",
    },
  ],
};

export const ERTAPENEM_EXECUTION_ENHANCEMENTS: Partial<DrugMonograph> = {
  dosingByIndication: [
    {
      label: "ESBL complicated UTI or intra-abdominal infection",
      regimen: "1 g IV q24h",
      notes: "Use once Pseudomonas and Acinetobacter no longer need to be in the frame.",
    },
    {
      label: "Stable ESBL bloodstream infection step-down bridge",
      regimen: "1 g IV q24h",
      notes: "High-value carbapenem option when cultures define Enterobacterales and the patient no longer needs a broader ICU carbapenem.",
    },
  ],
  renalReplacement: [
    {
      modality: "HD",
      guidance: "Give the renally adjusted regimen after hemodialysis because the once-daily convenience disappears quickly if HD timing is ignored.",
    },
    {
      modality: "CRRT",
      guidance: "CRRT may still require 500 mg to 1 g daily depending on effluent and residual renal function; do not assume standard ESRD dosing fits CRRT.",
    },
  ],
  specialPopulations: [
    {
      population: "Hypoalbuminemia or critical illness",
      guidance: "Low albumin increases free ertapenem clearance and can erode once-daily exposure, so critically ill hypoalbuminemic patients may still need a different carbapenem.",
    },
    {
      population: "Obesity",
      guidance: "Severe obesity can justify closer review of exposure or alternative carbapenem selection when the MIC is not comfortably low.",
    },
  ],
  therapeuticDrugMonitoring: {
    target: "No routine serum target, but the practical goal is reliable once-daily exposure above the MIC for the full interval.",
    sampling: "No drug levels are standard. Review albumin, renal trajectory, and clinical response when once-daily dosing seems too optimistic.",
    adjustment: "If bacteremia or source control is lagging in a hypoalbuminemic ICU patient, switch agents rather than pretending ertapenem is interchangeable with meropenem.",
  },
  administration: {
    infusion: "Typically infused over 30 minutes once daily.",
    stability: "Its once-daily schedule is one reason it performs well in OPAT and skilled-nursing workflows.",
    note: "Ertapenem is the operationally simple carbapenem, not the broadest carbapenem.",
  },
  ivToPoSwitch: {
    poBioavailability: "No oral formulation exists, so step-down means switching to a different active oral drug.",
    switchCriteria: "Transition off ertapenem when the patient is stable and susceptibilities support an oral agent such as TMP-SMX or a fluoroquinolone.",
    note: "If no active oral option exists, ertapenem often remains the discharge bridge because of its once-daily schedule.",
  },
  opatEligibility: {
    eligible: "yes",
    administration: "Once-daily IV dosing makes ertapenem one of the most OPAT-friendly broad beta-lactams.",
    monitoring: "Weekly CBC and renal function are standard, with closer review if seizures, severe renal dysfunction, or prolonged therapy are concerns.",
    considerations: [
      "Excellent option for stable ESBL infection when Pseudomonas coverage is no longer needed.",
      "Do not use it if the definitive pathogen still requires antipseudomonal coverage.",
    ],
  },
  interactionActions: [
    {
      interactingAgent: "Valproic acid",
      effect: "Carbapenems can rapidly lower valproate exposure and precipitate breakthrough seizures.",
      management: "Use a non-interacting antiepileptic for the full carbapenem course rather than trying to out-dose the interaction.",
      severity: "major",
    },
    {
      interactingAgent: "Probenecid",
      effect: "Raises ertapenem levels by reducing renal secretion without creating a meaningful stewardship advantage.",
      management: "Avoid routine combination use.",
      severity: "monitor",
    },
  ],
  stewardshipUseCases: [
    {
      scenario: "Definitive ESBL therapy with low Pseudomonas risk",
      role: "Ertapenem is a practical carbapenem de-escalation target once cultures define susceptible Enterobacterales.",
      notes: "That is especially valuable when the patient is nearing discharge.",
    },
    {
      scenario: "Once-daily outpatient bridge",
      role: "One of the highest-yield OPAT carbapenems because it preserves reliable ESBL coverage without q8h logistics.",
      notes: "It should leave the regimen if an active oral option becomes available.",
    },
  ],
};

export const NAFCILLIN_EXECUTION_ENHANCEMENTS: Partial<DrugMonograph> = {
  dosingByIndication: [
    {
      label: "MSSA bacteremia or endocarditis",
      regimen: "2 g IV q4h",
      notes: "Use when MSSA is confirmed and frequent dosing is operationally feasible.",
    },
    {
      label: "MSSA CNS infection",
      regimen: "2 g IV q4h",
      notes: "One of the scenarios where nafcillin still has a practical edge over cefazolin.",
    },
  ],
  renalReplacement: [
    {
      modality: "HD",
      guidance: "Renal failure alone does not usually drive dose reduction, but dialysis patients still need close sodium, volume, and hepatotoxicity review during prolonged courses.",
    },
    {
      modality: "CRRT",
      guidance: "Standard aggressive MSSA dosing is often still used because hepatic clearance dominates, but clinical response and line burden should be reviewed frequently.",
    },
  ],
  specialPopulations: [
    {
      population: "Heart failure, cirrhosis, or volume-sensitive patients",
      guidance: "The sodium load and q4h administration burden can become the reason cefazolin is operationally safer.",
    },
    {
      population: "Prolonged therapy",
      guidance: "Neutropenia, hepatitis, and phlebitis become more relevant after the first week, so lab surveillance matters even when the infection is clearly improving.",
    },
  ],
  therapeuticDrugMonitoring: {
    target: "No routine serum target; the important endpoints are bacteremia clearance, hepatic safety, and whether the syndrome truly requires nafcillin over cefazolin.",
    sampling: "No drug levels are standard. Follow CBC, LFTs, potassium, and culture clearance.",
    adjustment: "If toxicity or logistics are getting in the way and the syndrome is not CNS MSSA or an equivalent edge case, move to cefazolin.",
  },
  administration: {
    infusion: "Often given as intermittent q4h infusions; continuous infusion can be used in selected OPAT programs.",
    compatibility: "Dedicated access is often helpful because frequent doses and line irritation complicate shared-line workflows.",
    note: "Nafcillin wins on microbiology in some MSSA scenarios, but it rarely wins on operational simplicity.",
  },
  ivToPoSwitch: {
    poBioavailability: "No oral equivalent for serious invasive MSSA infection; oral dicloxacillin is not a substitute for endovascular therapy.",
    switchCriteria: "Reserve oral step-down for carefully selected non-endovascular syndromes after bacteremia has cleared and source control is complete.",
    note: "For MSSA bacteremia or endocarditis, the usual decision is nafcillin versus cefazolin, not IV versus PO.",
  },
  opatEligibility: {
    eligible: "conditional",
    administration: "OPAT is possible through continuous infusion or frequent-dose pump programs, but it is usually less convenient than cefazolin.",
    monitoring: "At least weekly CBC, LFTs, BMP, and line review are needed because toxicity and line burden accumulate with longer courses.",
    considerations: [
      "Reasonable only when a real MSSA-specific advantage over cefazolin remains.",
      "Poor choice when the patient or program cannot reliably support q4h or continuous-infusion logistics.",
    ],
  },
  interactionActions: [
    {
      interactingAgent: "Warfarin",
      effect: "Enzyme induction can lower INR and reduce anticoagulant effect during prolonged courses.",
      management: "Increase INR monitoring frequency and expect warfarin dose adjustments during and after nafcillin therapy.",
      severity: "major",
    },
    {
      interactingAgent: "Cyclosporine or tacrolimus",
      effect: "Nafcillin can lower calcineurin-inhibitor exposure through enzyme induction.",
      management: "Monitor troughs closely and coordinate dose changes with the transplant team.",
      severity: "major",
    },
  ],
  stewardshipUseCases: [
    {
      scenario: "Definitive MSSA bacteremia or endocarditis",
      role: "A high-value anti-staphylococcal beta-lactam once MSSA is proven and vancomycin can leave.",
      notes: "The main stewardship win is stopping vancomycin quickly, not proving nafcillin is mandatory in every case.",
    },
    {
      scenario: "MSSA CNS infection or other cefazolin-edge cases",
      role: "Use when the syndrome truly rewards nafcillin's penetration or historical evidence base.",
      notes: "Otherwise cefazolin is often the cleaner definitive option.",
    },
  ],
};

export const MICAFUNGIN_EXECUTION_ENHANCEMENTS: Partial<DrugMonograph> = {
  dosingByIndication: [
    {
      label: "Candidemia or invasive candidiasis",
      regimen: "100 mg IV q24h",
      notes: "Daily echinocandin default while species identification and source control are developing.",
    },
    {
      label: "Empiric antifungal in high-risk febrile neutropenia or higher-burden infection",
      regimen: "100-150 mg IV q24h",
      notes: "Use the higher end when obesity, critical illness, or deep-seated disease makes standard exposure less reassuring.",
    },
  ],
  renalReplacement: [
    {
      modality: "HD",
      guidance: "No dose adjustment is required because micafungin is not meaningfully removed by hemodialysis.",
    },
    {
      modality: "CRRT",
      guidance: "Standard daily dosing usually remains appropriate in CRRT, though severe critical illness may justify the higher end of dosing.",
    },
  ],
  specialPopulations: [
    {
      population: "Obesity or deep-seated candidiasis",
      guidance: "Many clinicians favor 150 mg daily when body size or infection burden makes the standard 100 mg feel marginal.",
    },
    {
      population: "Urinary, CNS, or ocular Candida infection",
      guidance: "Micafungin is a poor fit for these sites because exposure, not in vitro susceptibility, is the limiting issue.",
    },
  ],
  therapeuticDrugMonitoring: {
    target: "No routine serum target; the right site and timely step-down matter more than drug levels.",
    sampling: "No drug levels are standard. Reassess species identification, blood-culture clearance, and whether the infection site still fits an echinocandin.",
    adjustment: "If candidemia clears and the organism is azole-susceptible, switch to oral fluconazole rather than carrying IV micafungin through the full course.",
  },
  administration: {
    infusion: "Usually infused once daily over about 1 hour.",
    compatibility: "Do not mix in the same bag with other agents unless compatibility is confirmed.",
    note: "There is no oral formulation, so discharge planning usually depends on whether step-down to an azole is possible.",
  },
  ivToPoSwitch: {
    poBioavailability: "No oral micafungin formulation exists.",
    switchCriteria: "Transition to an active oral azole once the patient is clinically stable, blood cultures are clearing, and species/site support step-down.",
    note: "If the infection site is urine, eye, or CNS, the step-down agent often needs to change sooner rather than later.",
  },
  opatEligibility: {
    eligible: "yes",
    administration: "Once-daily IV dosing is straightforward for OPAT when oral step-down is not yet possible.",
    monitoring: "Weekly CBC and hepatic panel are reasonable, with closer review if candidemia clearance or line access remains uncertain.",
    considerations: [
      "A good short OPAT bridge while awaiting susceptibility-driven azole conversion.",
      "Poor fit for Candida cystitis, endophthalmitis, or CNS infection.",
    ],
  },
  interactionActions: [
    {
      interactingAgent: "Sirolimus",
      effect: "Micafungin can raise sirolimus exposure and amplify toxicity risk.",
      management: "Monitor sirolimus concentrations and adverse effects when starting or stopping micafungin.",
      severity: "monitor",
    },
    {
      interactingAgent: "Nifedipine",
      effect: "Exposure can rise and worsen hypotension or edema.",
      management: "Monitor blood pressure and consider dose reduction if symptoms emerge.",
      severity: "monitor",
    },
  ],
  stewardshipUseCases: [
    {
      scenario: "Frontline candidemia anchor while species are pending",
      role: "A clean default echinocandin that buys time for culture clearance and source control.",
      notes: "Its stewardship value is highest when it is stepped down promptly once fluconazole susceptibility is known.",
    },
    {
      scenario: "Avoiding unnecessary broad mold-active azoles",
      role: "Micafungin limits CYP burden and drug interactions when candidemia, not mold infection, is the problem.",
      notes: "Do not overextend it into urine, eye, or CNS disease.",
    },
  ],
};

export const LIPOSOMAL_AMPHOTERICIN_B_EXECUTION_ENHANCEMENTS: Partial<DrugMonograph> = {
  dosingByIndication: [
    {
      label: "Cryptococcal, mold, or resistant Candida CNS/deep infection",
      regimen: "3-5 mg/kg IV q24h",
      notes: "Use the higher end when CNS disease, severe mold infection, or salvage therapy is the reason you chose amphotericin.",
    },
    {
      label: "Mucormycosis",
      regimen: "5-10 mg/kg IV q24h",
      notes: "High-dose therapy is the rule for mucormycosis, not an exception.",
    },
  ],
  renalReplacement: [
    {
      modality: "HD",
      guidance: "No supplemental dosing is needed because the drug is not meaningfully removed by hemodialysis, but HD does not protect the kidneys from amphotericin toxicity.",
    },
    {
      modality: "CRRT",
      guidance: "Dose is usually unchanged in CRRT; daily renal and electrolyte review matters more than the machine settings.",
    },
  ],
  specialPopulations: [
    {
      population: "Pregnancy",
      guidance: "Liposomal amphotericin B remains the preferred systemic antifungal for many serious infections in pregnancy.",
    },
    {
      population: "Concurrent nephrotoxins or baseline CKD",
      guidance: "Pre-hydration, electrolyte replacement, and daily renal review matter more than nominal dose adjustment because toxicity is exposure-limiting.",
    },
  ],
  therapeuticDrugMonitoring: {
    target: "No routine serum target; the actionable endpoints are renal stability, potassium and magnesium replacement, and clinical response.",
    sampling: "No drug levels are standard. Follow BMP daily, especially creatinine, potassium, magnesium, and bicarbonate.",
    adjustment: "If nephrotoxicity becomes limiting, decide whether the pathogen/site allows step-down to a safer azole rather than just stretching the interval.",
  },
  administration: {
    infusion: "Usually infused over about 2 hours; do not give as IV push.",
    compatibility: "Use a dedicated line when possible and avoid mixing with saline-containing solutions in the same bag.",
    note: "Pre-hydration and standing electrolyte replacement should be part of the regimen, not optional add-ons.",
  },
  ivToPoSwitch: {
    poBioavailability: "No oral amphotericin formulation provides systemic treatment.",
    switchCriteria: "Transition only when the pathogen, site, and susceptibility profile support a safer oral azole or other active step-down agent.",
    note: "For cryptococcal and mucormycosis pathways, the step-down clock is determined by induction milestones and source control, not by simple clinical improvement.",
  },
  opatEligibility: {
    eligible: "conditional",
    administration: "Outpatient infusion is possible in carefully selected stable patients, but the lab and electrolyte burden is much heavier than with most OPAT drugs.",
    monitoring: "At least twice-weekly renal and electrolyte review is often needed even after inpatient stabilization.",
    considerations: [
      "Reasonable only when the patient is clinically stable and the outpatient program can handle frequent lab-driven supplementation.",
      "Poor fit when ongoing AKI, recurrent rigors, or rapid electrolyte replacement is still occurring.",
    ],
  },
  interactionActions: [
    {
      interactingAgent: "Other nephrotoxins such as tacrolimus, vancomycin, aminoglycosides, or IV contrast",
      effect: "Additive kidney injury can make amphotericin toxicity arrive earlier and more severely.",
      management: "Remove avoidable nephrotoxins and increase lab frequency when combination exposure is unavoidable.",
      severity: "major",
    },
    {
      interactingAgent: "Digoxin",
      effect: "Amphotericin-driven hypokalemia can potentiate digoxin toxicity.",
      management: "Replace potassium aggressively and monitor digoxin effect closely.",
      severity: "major",
    },
  ],
  stewardshipUseCases: [
    {
      scenario: "Bridge for severe mold, cryptococcal, or resistant Candida infection",
      role: "The broad fungicidal fallback when site, resistance, or pregnancy makes azoles or echinocandins inadequate.",
      notes: "The stewardship goal is to leave amphotericin as soon as a safer active option becomes appropriate.",
    },
    {
      scenario: "Suspected mucormycosis",
      role: "High-dose liposomal amphotericin B is the default anchor while diagnosis and surgical plans are still forming.",
      notes: "Do not substitute voriconazole when Mucorales remains on the table.",
    },
  ],
};

export const GENTAMICIN_EXECUTION_ENHANCEMENTS: Partial<DrugMonograph> = {
  dosingByIndication: [
    {
      label: "Serious gram-negative infection",
      regimen: "5-7 mg/kg IV q24h using extended-interval dosing",
      notes: "Reserve monotherapy for carefully selected urinary syndromes or when susceptibilities truly support it.",
    },
    {
      label: "Synergy for endocarditis or enterococcal infection",
      regimen: "1 mg/kg IV q8h or institution-specific synergy protocol",
      notes: "Short-course synergy is a niche use case, not a routine add-on.",
    },
  ],
  renalReplacement: [
    {
      modality: "HD",
      guidance: "Use post-hemodialysis dosing with level-guided redosing because missing the post-HD level or dose creates both toxicity and failure risk.",
    },
    {
      modality: "CRRT",
      guidance: "CRRT aminoglycoside dosing is level-driven; use larger loading doses but let measured levels determine the interval.",
    },
  ],
  specialPopulations: [
    {
      population: "Obesity",
      guidance: "Use adjusted body weight for dosing rather than actual body weight unless your local protocol says otherwise.",
    },
    {
      population: "Pre-existing renal dysfunction or vestibular injury risk",
      guidance: "The toxicity margin is narrow enough that alternative agents should be preferred whenever they remain active.",
    },
  ],
  therapeuticDrugMonitoring: {
    target: "Extended-interval peaks should be high enough for concentration-dependent killing while troughs fall low enough to limit toxicity; synergy regimens target low troughs and modest peaks.",
    sampling: "Use institution-specific nomograms or measured peaks and troughs; timing accuracy matters as much as the result.",
    adjustment: "If kidney function is worsening or levels stay prolonged, stop gentamicin rather than forcing the interval when another active drug exists.",
  },
  administration: {
    infusion: "Usually infused over about 30 minutes with careful level timing documentation.",
    compatibility: "Do not co-infuse in the same line or bag with beta-lactams because inactivation can occur.",
    note: "The loading dose is important even in renal dysfunction because underloading is a common stewardship failure.",
  },
  ivToPoSwitch: {
    poBioavailability: "No oral systemic formulation exists.",
    switchCriteria: "Transition to an active oral or safer IV agent as soon as susceptibilities allow because gentamicin is rarely the ideal full-course drug.",
    note: "If the only reason gentamicin is present is synergy, set a stop date early.",
  },
  opatEligibility: {
    eligible: "conditional",
    administration: "Once-daily extended-interval dosing can work in OPAT when reliable drug-level follow-up is available.",
    monitoring: "Levels plus renal function are mandatory, often more than once weekly early in therapy.",
    considerations: [
      "Appropriate only when the microbiology gain is real and home monitoring can keep up.",
      "Poor OPAT choice when kidney function is unstable or synergy duration is already nearly complete.",
    ],
  },
  interactionActions: [
    {
      interactingAgent: "Loop diuretics",
      effect: "Can amplify ototoxicity and complicate renal toxicity assessment.",
      management: "Avoid the combination when possible and monitor hearing and kidney function closely if it cannot be avoided.",
      severity: "major",
    },
    {
      interactingAgent: "Vancomycin, amphotericin B, or other nephrotoxins",
      effect: "Additive kidney injury is common and often avoidable.",
      management: "Keep overlap as short as possible and increase lab and level surveillance.",
      severity: "major",
    },
  ],
  stewardshipUseCases: [
    {
      scenario: "Short targeted gram-negative therapy or salvage regimen component",
      role: "Aminoglycosides earn their place when concentration-dependent killing or limited susceptibility leaves few better options.",
      notes: "They should not be routine double-coverage decorations on top of an active beta-lactam.",
    },
    {
      scenario: "Synergy in selected endocarditis pathways",
      role: "Useful only in specific guideline-backed circumstances and for defined durations.",
      notes: "Write the planned stop date at the time the drug is started.",
    },
  ],
};

export const CEFTAZIDIME_AVIBACTAM_EXECUTION_ENHANCEMENTS: Partial<DrugMonograph> = {
  dosingByIndication: [
    {
      label: "KPC or OXA-48 CRE cUTI, bacteremia, or pneumonia",
      regimen: "2.5 g IV q8h over 2 hours",
      notes: "Use full-dose therapy for serious infection and confirm the resistance mechanism early.",
    },
    {
      label: "MBL producer only when paired with aztreonam",
      regimen: "2.5 g IV q8h over 2 hours plus aztreonam on a matched schedule",
      notes: "Avibactam protects aztreonam from the co-produced enzymes that otherwise inactivate it.",
    },
  ],
  renalReplacement: [
    {
      modality: "HD",
      guidance: "Use the renally adjusted regimen after hemodialysis because the margin for underexposure is slim in CRE disease.",
    },
    {
      modality: "CRRT",
      guidance: "Many CRRT patients still need aggressive q8h exposure; review effluent rate and downtime before accepting low-dose defaults.",
    },
  ],
  specialPopulations: [
    {
      population: "Augmented renal clearance",
      guidance: "ARC can erode q8h exposure in younger ICU patients, so full-dose prolonged infusion is especially important.",
    },
    {
      population: "Unknown carbapenemase mechanism",
      guidance: "Do not assume ceftazidime-avibactam covers all CRE; mechanism matters more than the generic CRE label.",
    },
  ],
  therapeuticDrugMonitoring: {
    target: "No routine serum target; the practical target is uninterrupted exposure above the MIC with the right resistance mechanism in view.",
    sampling: "Drug levels are not standard. Review microbiology, infusion timing, renal trajectory, and whether aztreonam pairing is needed.",
    adjustment: "Before declaring failure, confirm that the organism is not an MBL and that dosing has not been eroded by renal adjustment or missed infusions.",
  },
  administration: {
    infusion: "Infuse over 2 hours for serious infection.",
    compatibility: "When paired with aztreonam for MBL organisms, schedule both deliberately and verify line compatibility rather than improvising.",
    note: "Mechanism-directed use is more important than the drug's novelty.",
  },
  ivToPoSwitch: {
    poBioavailability: "No oral formulation exists, so step-down usually requires switching drug classes entirely.",
    switchCriteria: "Only leave IV therapy if cultures reveal a reliably active oral option, which is uncommon in the resistant syndromes that justify ceftazidime-avibactam.",
    note: "Most discharge planning revolves around OPAT or SNF infusion rather than true PO conversion.",
  },
  opatEligibility: {
    eligible: "conditional",
    administration: "Home or facility infusion is possible, but q8h dosing and reserve-agent stewardship oversight make it more complex than routine OPAT.",
    monitoring: "Weekly CBC and renal function are baseline; resistant-pathogen follow-up and susceptibility review are equally important.",
    considerations: [
      "Reasonable for stable KPC or OXA-48 infection when no oral option exists.",
      "If the mechanism is MBL, OPAT planning must include the aztreonam partner, not ceftazidime-avibactam alone.",
    ],
  },
  interactionActions: [
    {
      interactingAgent: "Aztreonam",
      effect: "For NDM, VIM, or IMP producers, omission of aztreonam leaves the regimen functionally inactive despite ceftazidime-avibactam susceptibility assumptions.",
      management: "Pair with aztreonam when an MBL is present or strongly suspected, and renally adjust both drugs together.",
      severity: "major",
    },
    {
      interactingAgent: "Warfarin",
      effect: "Broad-spectrum therapy can increase INR through microbiome and vitamin K effects.",
      management: "Increase INR monitoring during initiation and after discontinuation.",
      severity: "monitor",
    },
  ],
  stewardshipUseCases: [
    {
      scenario: "Targeted KPC or OXA-48 CRE therapy",
      role: "A preferred reserve beta-lactam when the mechanism matches the drug.",
      notes: "Use it to displace polymyxin-based salvage, not to delay narrowing decisions.",
    },
    {
      scenario: "MBL strategy only when paired with aztreonam",
      role: "A critical protector drug rather than a stand-alone MBL treatment.",
      notes: "Document the mechanism in the note so the next team does not accidentally drop aztreonam.",
    },
  ],
  monitoringActions: [
    {
      trigger: "Renal recovery, CRRT downtime, or missed q8h prolonged infusions during active therapy",
      action: "Recalculate dosing the same shift and confirm the infusion schedule before assuming microbiologic failure.",
      rationale: "Reserve-agent exposure can erode quickly when renal function or ICU support changes.",
      sourceIds: ["idsa-2024-amr", "kpc-observational-outcomes"],
    },
    {
      trigger: "Rapid diagnostic or carbapenemase testing suggests NDM, VIM, or IMP production",
      action: "Add or continue aztreonam immediately and do not rely on ceftazidime-avibactam alone even if a panel appears favorable.",
      sourceIds: ["idsa-2024-amr", "aztreonam-avibactam-evidence", "clsi-breakpoint-updates"],
    },
  ],
  misuseTraps: [
    {
      scenario: "Using ceftazidime-avibactam alone for an MBL producer because the isolate is labeled CRE or a panel prints susceptible",
      risk: "Avibactam does not inhibit MBLs, so stand-alone use can leave the regimen functionally inactive.",
      saferApproach: "Pair with aztreonam or switch to another mechanism-appropriate regimen once the phenotype is clarified.",
      sourceIds: ["idsa-2024-amr", "aztreonam-avibactam-evidence", "clsi-breakpoint-updates"],
    },
    {
      scenario: "Continuing reserve therapy for a generic CRE label without documenting the carbapenemase mechanism",
      risk: "KPC and some OXA-48 pathways fit ceftazidime-avibactam, but MBL disease does not; the label alone creates false reassurance.",
      saferApproach: "Tie continuation to mechanism results, site fit, and a written backup plan if the phenotype changes.",
      sourceIds: ["idsa-2024-amr", "kpc-observational-outcomes"],
    },
  ],
  administrationConstraints: [
    {
      title: "MBL workflows require paired aztreonam execution",
      detail: "When this drug is being used to protect aztreonam, both agents need synchronized renal adjustment, infusion timing, and handoff instructions.",
      action: "Build the pair into order sets and MAR language so the partner drug is not delayed or dropped on transfer.",
      sourceIds: ["idsa-2024-amr", "aztreonam-avibactam-evidence", "clsi-breakpoint-updates"],
    },
    {
      title: "Q8h reserve-agent delivery needs an explicit infusion plan",
      detail: "SNF or OPAT transitions can fail operationally if the receiving program cannot reliably deliver repeated 2-hour infusions and partner therapy.",
      action: "Verify infusion capability before discharge and keep inpatient therapy if the delivery model is not dependable.",
      sourceIds: ["idsa-2024-amr", "kpc-observational-outcomes"],
    },
  ],
  siteSpecificAvoidances: [
    {
      site: "MBL-producing infection managed without aztreonam support",
      reason: "Ceftazidime-avibactam alone is not a reliable definitive regimen for NDM, VIM, or IMP producers.",
      preferredApproach: "Use the ceftazidime-avibactam plus aztreonam strategy or another mechanism-directed alternative.",
      sourceIds: ["idsa-2024-amr", "aztreonam-avibactam-evidence"],
    },
  ],
};

export const MEROPENEM_VABORBACTAM_EXECUTION_ENHANCEMENTS: Partial<DrugMonograph> = {
  dosingByIndication: [
    {
      label: "KPC-producing CRE infection",
      regimen: "4 g IV q8h over 3 hours",
      notes: "Use the full pneumonia-style regimen for serious bacteremia, cUTI, and deep infection.",
    },
  ],
  renalReplacement: [
    {
      modality: "HD",
      guidance: "Use the renally adjusted regimen after hemodialysis because both meropenem and vaborbactam are renally cleared.",
    },
    {
      modality: "CRRT",
      guidance: "CRRT often still needs robust q8h exposure; do not let low-dose defaults undermine a KPC regimen.",
    },
  ],
  specialPopulations: [
    {
      population: "Augmented renal clearance",
      guidance: "ARC can make underexposure more likely, so keep the prolonged infusion and full interval schedule when renal function looks brisk.",
    },
    {
      population: "Unknown carbapenemase or non-KPC CRE",
      guidance: "Do not assume activity for MBL or many OXA-48 organisms; this is a mechanism-specific drug, not a universal CRE answer.",
    },
  ],
  therapeuticDrugMonitoring: {
    target: "No routine serum target; the main goal is sustained exposure above the MIC with the correct resistance mechanism confirmed.",
    sampling: "Drug levels are not standard. Review carbapenemase results, infusion adherence, and renal function closely.",
    adjustment: "If the phenotype is not clearly KPC-mediated, reassess the agent before escalating supportive rhetoric around it.",
  },
  administration: {
    infusion: "Administer as a 3-hour infusion to protect PK/PD against higher-MIC organisms.",
    stability: "Use program-specific stability guidance when preparing home or extended-infusion doses.",
    note: "This drug wins by matching mechanism and infusion strategy, not by using carbapenem language more aggressively.",
  },
  ivToPoSwitch: {
    poBioavailability: "No oral formulation exists.",
    switchCriteria: "Discharge transition usually means OPAT or a switch to another active class if a reliable oral option unexpectedly exists.",
    note: "True oral step-down is uncommon in the infections that justify meropenem-vaborbactam.",
  },
  opatEligibility: {
    eligible: "conditional",
    administration: "OPAT is feasible through q8h prolonged-infusion programs, but logistics are heavier than once-daily carbapenems.",
    monitoring: "Weekly renal function and CBC are minimum expectations, with tighter follow-up for resistant-pathogen treatment plans.",
    considerations: [
      "Best used when KPC is established and the patient is otherwise clinically stable.",
      "Do not build an OPAT plan around it if the mechanism remains uncertain or an oral option is emerging.",
    ],
  },
  interactionActions: [
    {
      interactingAgent: "Valproic acid",
      effect: "Meropenem rapidly lowers valproate exposure and can precipitate breakthrough seizures.",
      management: "Use an alternative antiepileptic for the duration of carbapenem therapy.",
      severity: "major",
    },
    {
      interactingAgent: "Warfarin",
      effect: "INR can drift upward during broad-spectrum therapy and then fall again after it is stopped.",
      management: "Increase INR monitoring during transitions of care.",
      severity: "monitor",
    },
  ],
  stewardshipUseCases: [
    {
      scenario: "Definitive KPC CRE therapy",
      role: "A preferred targeted beta-lactam when KPC is the confirmed driver.",
      notes: "Use it to avoid colistin and other higher-toxicity salvage regimens.",
    },
    {
      scenario: "Mechanism-specific reserve use",
      role: "Should be deployed because KPC is present, not because the organism simply looks scary on the AST.",
      notes: "Switch away if the mechanism turns out to be MBL or a different non-KPC phenotype.",
    },
  ],
  monitoringActions: [
    {
      trigger: "Renal function changes or the 3-hour infusion is shortened in a serious KPC infection",
      action: "Rebuild the regimen immediately instead of accepting cUTI-style underexposure in deep-seated disease.",
      rationale: "This agent depends on full prolonged-infusion exposure for the infections where it adds the most value.",
      sourceIds: ["idsa-2024-amr", "tango-ii"],
    },
    {
      trigger: "Carbapenemase testing no longer supports KPC as the dominant mechanism",
      action: "Stop treating meropenem-vaborbactam as the definitive answer and reselect therapy based on the updated phenotype.",
      sourceIds: ["idsa-2024-amr", "kpc-observational-outcomes"],
    },
  ],
  misuseTraps: [
    {
      scenario: "Using meropenem-vaborbactam for MBL or many OXA-48 phenotypes because the organism is simply labeled CRE",
      risk: "The drug is not a universal CRE solution and mechanism mismatch can leave the patient on a high-confidence but inactive regimen.",
      saferApproach: "Restrict definitive use to KPC-driven disease or other explicitly supported phenotypes.",
      sourceIds: ["idsa-2024-amr", "tango-ii", "kpc-observational-outcomes"],
    },
    {
      scenario: "Dropping to a shorter infusion or lighter dose for pneumonia, bacteremia, or undrained deep infection",
      risk: "Operational convenience can quietly trade away the exposure advantage that made the drug worth choosing.",
      saferApproach: "Keep the 4 g q8h prolonged-infusion strategy unless renal function truly requires adjustment.",
      sourceIds: ["idsa-2024-amr", "tango-ii"],
    },
  ],
  administrationConstraints: [
    {
      title: "The 3-hour infusion is part of the regimen, not an optional optimization",
      detail: "Shortening the infusion undermines PK/PD against KPC isolates with limited exposure margin.",
      action: "Treat every missed or shortened infusion as a same-day stewardship and pharmacy follow-up issue.",
      sourceIds: ["idsa-2024-amr", "tango-ii"],
    },
    {
      title: "Q8h OPAT requires a real delivery model",
      detail: "Meropenem-vaborbactam often looks easier on paper than it is in post-acute settings because repeated prolonged infusions stress staffing and line access.",
      action: "Confirm the receiving program can execute the schedule before discharge rather than hoping it will be improvised later.",
      sourceIds: ["idsa-2024-amr", "kpc-observational-outcomes"],
    },
  ],
  siteSpecificAvoidances: [
    {
      site: "MBL-producing infection regardless of anatomic source",
      reason: "Vaborbactam does not solve MBL biology, so apparent carbapenem activity should not be trusted as a stand-alone answer.",
      preferredApproach: "Move to an MBL-active strategy instead of escalating meropenem-vaborbactam intensity.",
      sourceIds: ["idsa-2024-amr"],
    },
  ],
};

export const CEFIDEROCOL_EXECUTION_ENHANCEMENTS: Partial<DrugMonograph> = {
  dosingByIndication: [
    {
      label: "DTR Pseudomonas, CRAB, or MBL-producing gram-negative infection",
      regimen: "2 g IV q8h over 3 hours",
      notes: "Reserve for mechanism-driven use when better-established agents are inactive or inappropriate.",
    },
  ],
  renalReplacement: [
    {
      modality: "HD",
      guidance: "Use the renally adjusted regimen after hemodialysis because cefiderocol is substantially renally cleared.",
    },
    {
      modality: "CRRT",
      guidance: "CRRT often still needs aggressive q8h dosing; underdosing is easy if the effluent rate is ignored.",
    },
  ],
  specialPopulations: [
    {
      population: "Augmented renal clearance",
      guidance: "ARC can erode prolonged-infusion exposure quickly in ICU patients, so full-dose q8h therapy is usually the safer starting point.",
    },
    {
      population: "Pathogens with mixed susceptibility reports",
      guidance: "Clinical use should be tied to credible susceptibility data and site fit, not simply to exhaustion or novelty pressure.",
    },
  ],
  therapeuticDrugMonitoring: {
    target: "No routine serum target; success depends on full prolonged-infusion dosing, the right susceptibility result, and good source control.",
    sampling: "Drug levels are not standard. Reassess renal function, AST method reliability, and the evolving organism ID.",
    adjustment: "If cefiderocol is failing, review source control and susceptibility confidence before reflexively adding more nephrotoxic salvage agents.",
  },
  administration: {
    infusion: "Infuse over 3 hours for serious infection.",
    compatibility: "Use disciplined line management in complex ICU regimens because prolonged infusions increase scheduling collisions.",
    note: "This is a reserve agent whose administration details matter because the patients are usually sick and the pathogens are unforgiving.",
  },
  ivToPoSwitch: {
    poBioavailability: "No oral formulation exists.",
    switchCriteria: "Most patients remain on IV therapy until cure or transition to a different active class; true oral step-down is uncommon.",
    note: "Do not promise oral discharge planning until susceptibility and syndrome really support it.",
  },
  opatEligibility: {
    eligible: "conditional",
    administration: "OPAT is possible through q8h prolonged-infusion programs, but reserve-agent oversight and logistics are substantial.",
    monitoring: "Weekly renal function and CBC are baseline; clinical follow-up for toxicity and microbiologic response should be tighter than standard OPAT.",
    considerations: [
      "Reasonable only for stable patients with few or no oral alternatives.",
      "Should stay under ID or stewardship oversight because failure rescue options are limited.",
    ],
  },
  interactionActions: [
    {
      interactingAgent: "Warfarin",
      effect: "INR changes can emerge during prolonged broad-spectrum treatment.",
      management: "Increase INR monitoring rather than assuming the interaction is clinically trivial.",
      severity: "monitor",
    },
    {
      interactingAgent: "Other nephrotoxins",
      effect: "While cefiderocol itself is not a classic nephrotoxin, concurrent kidney injury complicates dosing and disposition decisions in already fragile patients.",
      management: "Review renal trends often and remove avoidable nephrotoxins where possible.",
      severity: "monitor",
    },
  ],
  stewardshipUseCases: [
    {
      scenario: "MBL or DTR gram-negative infection with limited alternatives",
      role: "A reserve option when the phenotype fits and more established agents are inactive.",
      notes: "Use deliberately, not as a reflex for every resistant gram-negative label.",
    },
    {
      scenario: "Avoiding polymyxin-centered salvage",
      role: "Often the cleaner alternative when susceptibility and site both support cefiderocol.",
      notes: "Keep the stewardship note explicit about why it was chosen over other reserve agents.",
    },
  ],
  monitoringActions: [
    {
      trigger: "Susceptibility support is method-limited, discordant, or drifting during therapy",
      action: "Reconfirm how the AST was generated and whether the organism-site pair still fits cefiderocol before stacking on salvage agents.",
      rationale: "Execution failure with cefiderocol often starts with overconfidence in a fragile susceptibility call.",
      sourceIds: ["idsa-2024-amr", "credible-cr"],
    },
    {
      trigger: "CRAB infection remains clinically uncontrolled despite in vitro activity",
      action: "Escalate source-control review and reassess whether adjunctive therapy or an alternative strategy is needed rather than assuming the MIC settled the case.",
      sourceIds: ["idsa-2024-amr", "credible-cr"],
    },
  ],
  misuseTraps: [
    {
      scenario: "Using cefiderocol as casual monotherapy for CRAB with poor source control or uncertain susceptibility support",
      risk: "The mortality signal in CRAB literature makes mechanically correct but clinically thin monotherapy a risky default.",
      saferApproach: "Use it only with a documented CRAB plan that addresses source control, susceptibility confidence, and whether a partner agent is justified.",
      sourceIds: ["idsa-2024-amr", "credible-cr"],
    },
    {
      scenario: "Escalating to cefiderocol for colonization or a resistant label without proving invasive disease",
      risk: "Reserve-agent use can outpace the clinical syndrome and create unnecessary complexity without benefit.",
      saferApproach: "Make the invasive site, organism significance, and fallback options explicit before committing.",
      sourceIds: ["idsa-2024-amr", "credible-cr"],
    },
  ],
  administrationConstraints: [
    {
      title: "Cefiderocol requires credible susceptibility and source-control handoff",
      detail: "The drug is most defensible when the lab method, infection site, and source-control plan are all documented clearly for the next team.",
      action: "Put the AST method or stewardship interpretation in the note when cefiderocol is continued beyond empiric salvage.",
      sourceIds: ["idsa-2024-amr", "credible-cr"],
    },
    {
      title: "Repeated 3-hour infusions create line and nursing collisions",
      detail: "Critically ill patients often receive multiple concurrent prolonged infusions, so cefiderocol can fail operationally even before it fails microbiologically.",
      action: "Map line access and competing infusions before finalizing q8h delivery plans.",
      sourceIds: ["idsa-2024-amr"],
    },
  ],
  siteSpecificAvoidances: [
    {
      site: "CRAB pneumonia or deep-seated infection without source control or a documented rescue plan",
      reason: "Cefiderocol can look attractive on the report, but unresolved source burden and CRAB outcome concerns make unsupported monotherapy a weak strategy.",
      preferredApproach: "Address source control first and document whether a companion or alternative regimen is preferred.",
      sourceIds: ["idsa-2024-amr", "credible-cr"],
    },
  ],
};

export const CEFTOLOZANE_TAZOBACTAM_EXECUTION_ENHANCEMENTS: Partial<DrugMonograph> = {
  dosingByIndication: [
    {
      label: "MDR or DTR Pseudomonas pneumonia",
      regimen: "3 g IV q8h over 3 hours",
      notes: "Use the pneumonia dose when lung infection or severe bacteremia is the reason you chose it.",
    },
    {
      label: "Complicated UTI or intra-abdominal infection",
      regimen: "1.5-3 g IV q8h over 1-3 hours depending on syndrome and site",
      notes: "The lung dose is still favored when there is any question about severity or borderline susceptibility.",
    },
  ],
  renalReplacement: [
    {
      modality: "HD",
      guidance: "Use the renally adjusted regimen after hemodialysis; underdosing after dialysis is a common avoidable problem.",
    },
    {
      modality: "CRRT",
      guidance: "CRRT often still supports aggressive q8h exposure, particularly when resistant Pseudomonas pneumonia is the target.",
    },
  ],
  specialPopulations: [
    {
      population: "Augmented renal clearance",
      guidance: "ARC is common in ICU pneumonia and can meaningfully lower exposure, so keep the prolonged infusion and full q8h schedule when renal function is brisk.",
    },
    {
      population: "Metallo-beta-lactamase producers",
      guidance: "Do not use ceftolozane-tazobactam when MBL biology is established because the tazobactam partner does not solve that mechanism.",
    },
  ],
  therapeuticDrugMonitoring: {
    target: "No routine serum target; the main goal is full q8h prolonged-infusion exposure against the confirmed susceptible phenotype.",
    sampling: "Drug levels are not standard. Review susceptibility mechanism, infusion timing, and renal trajectory.",
    adjustment: "If it appears to be failing, re-check whether the organism truly fits the drug before escalating to more toxic salvage.",
  },
  administration: {
    infusion: "Extended infusion over 3 hours is preferred for severe infection and resistant Pseudomonas.",
    stability: "OPAT and elastomeric use depend on local stability confirmation.",
    note: "This drug is at its best when it is used specifically for the Pseudomonas problem it was built to solve.",
  },
  ivToPoSwitch: {
    poBioavailability: "No oral formulation exists.",
    switchCriteria: "Transition off IV therapy only if cultures later reveal an active oral option, which is uncommon in the resistant syndromes that justify use.",
    note: "Most discharge planning is infusion-based rather than PO conversion.",
  },
  opatEligibility: {
    eligible: "conditional",
    administration: "Home or facility q8h prolonged infusion is feasible but operationally heavier than standard OPAT drugs.",
    monitoring: "Weekly CBC and renal function are minimum expectations, with closer review for prolonged therapy or unstable renal function.",
    considerations: [
      "Best for stable patients with confirmed susceptible resistant Pseudomonas and no oral exit.",
      "Avoid if stewardship follow-up cannot support a reserve-agent OPAT plan.",
    ],
  },
  interactionActions: [
    {
      interactingAgent: "Warfarin",
      effect: "INR can shift during prolonged broad-spectrum treatment.",
      management: "Increase INR monitoring during therapy transitions.",
      severity: "monitor",
    },
    {
      interactingAgent: "Aminoglycosides",
      effect: "Combination may be intentional in salvage therapy, but line compatibility and additive kidney injury can become the operational problem.",
      management: "Use separate lines when possible and justify the duration of overlap explicitly.",
      severity: "monitor",
    },
  ],
  stewardshipUseCases: [
    {
      scenario: "Definitive MDR Pseudomonas therapy",
      role: "A high-value reserve antipseudomonal when the phenotype matches and older beta-lactams do not.",
      notes: "It should not be used as a generic \"big gun\" for Enterobacterales.",
    },
    {
      scenario: "Avoiding colistin for susceptible resistant Pseudomonas",
      role: "Often the cleaner definitive option when susceptibility supports it.",
      notes: "Leave it on the shelf when standard cefepime or meropenem still works.",
    },
  ],
  monitoringActions: [
    {
      trigger: "Renal function shifts or a 3 g pneumonia regimen is not being maintained in lung infection",
      action: "Correct the dose and infusion strategy the same day rather than accepting lower-exposure carryover from non-pneumonia workflows.",
      rationale: "The main preventable failure mode is underdelivering the lung-focused regimen when resistant Pseudomonas is the target.",
      sourceIds: ["idsa-2024-amr", "aspect-np"],
    },
    {
      trigger: "Rapid diagnostics or phenotyping suggests MBL or non-Pseudomonas carbapenemase biology",
      action: "Reassess immediately because ceftolozane-tazobactam is not meant to rescue mechanism mismatches.",
      sourceIds: ["idsa-2024-amr", "aspect-np"],
    },
  ],
  misuseTraps: [
    {
      scenario: "Using ceftolozane-tazobactam as a generic broad agent for ESBL or CRE when other preferred drugs are available",
      risk: "That burns a valuable Pseudomonas-focused reserve option without solving the actual resistance mechanism problem better.",
      saferApproach: "Save it for resistant Pseudomonas or other explicitly supported phenotypes where it offers a clear advantage.",
      sourceIds: ["idsa-2024-amr"],
    },
    {
      scenario: "Continuing the lower cUTI-style regimen into pneumonia or severe bacteremia",
      risk: "The wrong dose can turn a microbiologically reasonable choice into an exposure failure.",
      saferApproach: "Use the 3 g q8h prolonged-infusion regimen when lung infection or high-inoculum disease is the reason it was selected.",
      sourceIds: ["aspect-np", "aspect-cuti-ciai"],
    },
  ],
  administrationConstraints: [
    {
      title: "Pneumonia workflows should default to 3 g q8h over 3 hours",
      detail: "The lung dose and prolonged infusion are part of the intended resistant-Pseudomonas strategy, not optional escalations to add later.",
      action: "Hard-wire the pneumonia build into order sets for HAP/VAP and severe DTR Pseudomonas pathways.",
      sourceIds: ["aspect-np", "idsa-2024-amr"],
    },
    {
      title: "Elastomeric and post-acute delivery need local stability confirmation",
      detail: "Reserve-agent q8h infusion plans can fail after discharge if the receiving program cannot match the intended infusion model.",
      action: "Confirm the exact post-acute preparation workflow before promising OPAT or SNF continuation.",
      sourceIds: ["idsa-2024-amr", "aspect-cuti-ciai"],
    },
  ],
  siteSpecificAvoidances: [
    {
      site: "Pneumonia treated with the lower cUTI/cIAI dosing strategy",
      reason: "The lower regimen can underdeliver exposure for lung infection and severe resistant Pseudomonas disease.",
      preferredApproach: "Use the 3 g q8h extended-infusion pneumonia regimen or choose another active agent.",
      sourceIds: ["aspect-np", "idsa-2024-amr"],
    },
  ],
};

export const IMIPENEM_CILASTATIN_RELEBACTAM_EXECUTION_ENHANCEMENTS: Partial<DrugMonograph> = {
  dosingByIndication: [
    {
      label: "DTR Pseudomonas or selected KPC infection",
      regimen: "1.25 g IV q6h",
      notes: "Use as a mechanism-directed reserve option rather than a default carbapenem escalation.",
    },
  ],
  renalReplacement: [
    {
      modality: "HD",
      guidance: "Use the renally adjusted regimen after hemodialysis because the q6h schedule is already easy to underdeliver.",
    },
    {
      modality: "CRRT",
      guidance: "CRRT often still requires aggressive q6h coverage; seizure risk and effluent rate both matter when adjusting.",
    },
  ],
  specialPopulations: [
    {
      population: "Seizure risk or advanced CNS disease",
      guidance: "Imipenem still carries more seizure concern than meropenem, so choose carefully when the brain is already vulnerable.",
    },
    {
      population: "Unknown carbapenemase mechanism",
      guidance: "Do not assume activity for all resistant gram-negatives; the phenotype still has to fit relebactam's mechanism.",
    },
  ],
  therapeuticDrugMonitoring: {
    target: "No routine serum target; the real target is correct mechanism coverage with dependable q6h exposure.",
    sampling: "Drug levels are not standard. Review seizure history, renal function, and susceptibility mechanism closely.",
    adjustment: "If neurotoxicity or mechanism mismatch is emerging, pivot early rather than treating it as a generic carbapenem failure.",
  },
  administration: {
    infusion: "Administer on the scheduled q6h interval with disciplined timing because missed doses rapidly erode coverage.",
    compatibility: "Frequent dosing increases line-scheduling conflicts, so compatibility planning matters in ICU patients.",
    note: "Operational burden is one reason it is usually a targeted reserve choice rather than a discharge favorite.",
  },
  ivToPoSwitch: {
    poBioavailability: "No oral formulation exists.",
    switchCriteria: "Most patients remain on IV therapy until cure or change to another active class because true oral exits are uncommon.",
    note: "If a reliable oral option appears, that usually means the resistant phenotype was narrower than first feared.",
  },
  opatEligibility: {
    eligible: "conditional",
    administration: "OPAT is possible but q6h dosing is burdensome and usually less attractive than other definitive options.",
    monitoring: "Weekly renal function and CBC are minimum expectations, with closer review for any neurologic symptoms.",
    considerations: [
      "Consider only when the susceptibility pattern truly favors it and the infusion program can handle q6h dosing.",
      "Poor OPAT choice if seizure risk or adherence concerns are present.",
    ],
  },
  interactionActions: [
    {
      interactingAgent: "Valproic acid",
      effect: "Imipenem-class carbapenems can markedly lower valproate exposure and trigger seizures.",
      management: "Use an alternative antiepileptic for the full carbapenem course.",
      severity: "major",
    },
    {
      interactingAgent: "Ganciclovir or other seizure-threshold-lowering drugs",
      effect: "Can amplify CNS toxicity in already vulnerable patients.",
      management: "Review neurotoxicity risk before committing to prolonged therapy.",
      severity: "monitor",
    },
  ],
  stewardshipUseCases: [
    {
      scenario: "Targeted DTR Pseudomonas therapy",
      role: "A reserve anti-pseudomonal option when susceptibility and mechanism support it.",
      notes: "Do not use it just because cefepime feels emotionally too small.",
    },
    {
      scenario: "Selected KPC infection when other preferred agents are unavailable or recently used",
      role: "A reasonable mechanism-directed backup rather than a universal first choice.",
      notes: "Keep the reason for choosing it explicit in the stewardship note.",
    },
  ],
  monitoringActions: [
    {
      trigger: "New encephalopathy, seizure activity, or renal decline while on q6h therapy",
      action: "Reassess dosing and drug choice immediately instead of treating the neurotoxicity signal as nonspecific ICU delirium.",
      rationale: "Imipenem exposure and CNS vulnerability can become the dominant execution risk quickly.",
      sourceIds: ["idsa-2024-amr", "restore-imi-1"],
    },
    {
      trigger: "Updated microbiology suggests MBL or another relebactam-mismatched phenotype",
      action: "Stop treating the regimen as definitive and switch to a mechanism-appropriate option.",
      sourceIds: ["idsa-2024-amr", "restore-imi-1"],
    },
  ],
  misuseTraps: [
    {
      scenario: "Escalating to imipenem-cilastatin-relebactam as a generic carbapenem upgrade without documenting the mechanism",
      risk: "This turns a targeted reserve drug into broad emotional escalation and can miss the actual resistant phenotype.",
      saferApproach: "Use it only when the organism, site, and susceptibility pattern fit relebactam's role.",
      sourceIds: ["idsa-2024-amr", "restore-imi-1"],
    },
    {
      scenario: "Keeping valproate or other seizure-threshold stressors in place without a neurotoxicity plan",
      risk: "Operationally convenient continuation can precipitate breakthrough seizures or force abrupt therapy changes.",
      saferApproach: "Coordinate antiepileptic substitution and neurologic monitoring before prolonged therapy.",
      sourceIds: ["idsa-2024-amr", "restore-imi-1"],
    },
  ],
  administrationConstraints: [
    {
      title: "Q6h timing discipline is part of the drug's value",
      detail: "Missed or delayed doses erode exposure quickly, especially in ICU patients with changing clearance.",
      action: "Treat schedule drift as a pharmacy-nursing workflow issue to fix, not a minor delay to tolerate.",
      sourceIds: ["idsa-2024-amr", "restore-imi-1"],
    },
    {
      title: "Neurotoxicity handoff belongs in transfer and discharge planning",
      detail: "This regimen is operationally fragile when neurologic risk, renal instability, and q6h delivery all travel with the patient.",
      action: "Document seizure history, renal plan, and why a q6h reserve regimen remains necessary before transfer.",
      sourceIds: ["idsa-2024-amr"],
    },
  ],
  siteSpecificAvoidances: [
    {
      site: "MBL-producing infection regardless of anatomic source",
      reason: "Relebactam does not overcome MBL-mediated resistance, so apparent carbapenem escalation does not fix the biology.",
      preferredApproach: "Switch to an MBL-active regimen instead of intensifying imipenem-cilastatin-relebactam.",
      sourceIds: ["idsa-2024-amr"],
    },
  ],
};

export const COLISTIN_EXECUTION_ENHANCEMENTS: Partial<DrugMonograph> = {
  dosingByIndication: [
    {
      label: "Salvage therapy for DTR gram-negative infection",
      regimen: "Load with 9 MIU colistimethate, then maintenance per renal function and product-specific units",
      notes: "Consult a PK-savvy pharmacist or institutional nomogram because unit confusion is a patient-safety issue.",
    },
  ],
  renalReplacement: [
    {
      modality: "HD",
      guidance: "Use level- or protocol-driven post-hemodialysis dosing because both the prodrug and active form create dosing confusion in dialysis patients.",
    },
    {
      modality: "CRRT",
      guidance: "CRRT dosing is highly individualized and should follow an experienced protocol because both underexposure and toxicity are easy to create.",
    },
  ],
  specialPopulations: [
    {
      population: "Baseline CKD or concurrent nephrotoxins",
      guidance: "If any safer active agent exists, use it instead because kidney injury risk is often the reason colistin cannot be completed.",
    },
    {
      population: "Neuromuscular disease",
      guidance: "Colistin can worsen weakness and respiratory compromise, so use only when the microbiology gain is worth that neurologic risk.",
    },
  ],
  therapeuticDrugMonitoring: {
    target: "No widely available bedside target, but PK-guided dosing is ideal when the service offers it because therapeutic and toxic exposures overlap.",
    sampling: "If levels are available, use them. Otherwise monitor renal function, urine output, neurologic symptoms, and whether the regimen still needs colistin at all.",
    adjustment: "Do not respond to toxicity by casually stretching the interval without re-evaluating whether a safer active option has become available.",
  },
  administration: {
    infusion: "A loading dose is mandatory; maintenance infusions then follow the institution's unit-specific protocol.",
    compatibility: "Verify units and product formulation every time because CMS and colistin base activity are easy to confuse.",
    note: "This is a drug where operational precision is as important as microbiology.",
  },
  ivToPoSwitch: {
    poBioavailability: "No oral systemic formulation exists.",
    switchCriteria: "True oral step-down is not expected; the transition question is usually whether colistin can be stopped for a safer IV or oral alternative.",
    note: "If the patient improves and susceptibilities open another door, take it.",
  },
  opatEligibility: {
    eligible: "no",
    administration: "The toxicity burden and dosing complexity make routine OPAT a poor fit.",
    monitoring: "Daily or near-daily renal and neurologic review is usually needed early in therapy.",
    considerations: [
      "Use inpatient or highly supervised subacute settings rather than standard home OPAT.",
      "Reserve for situations where better tolerated active agents are unavailable.",
    ],
  },
  interactionActions: [
    {
      interactingAgent: "Vancomycin, amphotericin B, aminoglycosides, or other nephrotoxins",
      effect: "Additive kidney injury is common and can force premature discontinuation.",
      management: "Strip out avoidable nephrotoxins and shorten overlap aggressively.",
      severity: "major",
    },
    {
      interactingAgent: "Neuromuscular blocking agents",
      effect: "Can worsen neuromuscular weakness and respiratory failure risk.",
      management: "Use extreme caution in ventilated or perioperative patients and monitor closely.",
      severity: "major",
    },
  ],
  stewardshipUseCases: [
    {
      scenario: "Last-line salvage for highly resistant gram-negative infection",
      role: "A fallback only when newer beta-lactam options are inactive, unavailable, or inappropriate.",
      notes: "Always document why safer reserve agents cannot be used.",
    },
    {
      scenario: "Prompt de-escalation once a safer active option appears",
      role: "The stewardship goal with colistin is usually to get off colistin as soon as microbiology permits.",
      notes: "Do not keep it just because the patient is already tolerating it today.",
    },
  ],
  monitoringActions: [
    {
      trigger: "Serum creatinine rises, urine output falls, or dialysis needs change after the loading dose",
      action: "Recalculate dosing and reassess whether colistin is still necessary instead of simply stretching intervals and hoping toxicity stabilizes.",
      rationale: "Nephrotoxicity is the dominant operational failure mode and can evolve before the microbiology plan changes.",
      sourceIds: ["idsa-2024-amr", "credible-cr"],
    },
    {
      trigger: "New paresthesias, weakness, apnea risk, or escalating neuromuscular blocker exposure",
      action: "Treat neurotoxicity as a reason to stop or replace colistin, not just a side effect to monitor passively.",
      sourceIds: ["idsa-2024-amr"],
    },
  ],
  misuseTraps: [
    {
      scenario: "Starting or continuing colistin when a newer beta-lactam or sulbactam-based option is active",
      risk: "The toxicity burden is rarely justified once a safer active alternative exists.",
      saferApproach: "Use colistin only when better tolerated mechanism-appropriate options are truly unavailable or inactive.",
      sourceIds: ["idsa-2024-amr", "attack", "credible-cr"],
    },
    {
      scenario: "Skipping the loading dose or mixing CMS and colistin-base units loosely across handoffs",
      risk: "Unit confusion and underloading can produce both early failure and preventable toxicity.",
      saferApproach: "Use a protocolized loading strategy with explicit unit language at every order and transfer step.",
      sourceIds: ["idsa-2024-amr"],
    },
  ],
  administrationConstraints: [
    {
      title: "Unit language must be standardized every time",
      detail: "Confusion between colistimethate sodium and colistin-base activity remains a serious medication-safety risk.",
      action: "Spell out units, formulation, and maintenance strategy in the order and transfer documentation.",
      sourceIds: ["idsa-2024-amr"],
    },
    {
      title: "Colistin needs a predeclared exit strategy",
      detail: "Because toxicity accumulates quickly, teams should know what result or clinical milestone would let them stop it.",
      action: "Document the stop trigger at initiation and revisit it with each culture update.",
      sourceIds: ["idsa-2024-amr", "credible-cr"],
    },
  ],
  siteSpecificAvoidances: [
    {
      site: "Pneumonia, bloodstream infection, or other deep-seated disease when a safer active reserve agent exists",
      reason: "Colistin's narrow therapeutic window and inferior tolerability make it a poor definitive anchor once another active option is available.",
      preferredApproach: "Move to the mechanism-directed beta-lactam or sulbactam-based regimen as soon as susceptibilities allow.",
      sourceIds: ["idsa-2024-amr", "attack", "credible-cr"],
    },
  ],
};

export const FOSFOMYCIN_EXECUTION_ENHANCEMENTS: Partial<DrugMonograph> = {
  dosingByIndication: [
    {
      label: "Uncomplicated cystitis",
      regimen: "3 g PO x 1 dose",
      notes: "Best used as a bladder-only drug for uncomplicated lower-tract infection.",
    },
    {
      label: "Complicated or MDR cystitis off-label",
      regimen: "3 g PO every 48-72 hours for 3 doses",
      notes: "Use only when susceptibility, site, and local practice support multidose therapy.",
    },
  ],
  renalReplacement: [
    {
      modality: "HD",
      guidance: "Oral fosfomycin can still be used for bladder-only infection in dialysis patients, but do not stretch it into pyelonephritis or bacteremia.",
    },
    {
      modality: "CRRT",
      guidance: "CRRT does not change the fact that oral fosfomycin remains a lower-tract agent rather than a dependable systemic therapy.",
    },
  ],
  specialPopulations: [
    {
      population: "ESBL or highly drug-resistant cystitis",
      guidance: "Fosfomycin is valuable when resistance narrows oral options, but only if the syndrome is still truly confined to the bladder.",
    },
    {
      population: "Older adults with vague urinary symptoms",
      guidance: "Do not let its convenience turn asymptomatic bacteriuria or non-infectious urinary symptoms into treatment.",
    },
  ],
  therapeuticDrugMonitoring: {
    target: "No routine serum target; the key question is whether the syndrome still fits a bladder-only drug.",
    sampling: "No drug levels are used. Follow symptom response and culture data instead.",
    adjustment: "If fever, flank pain, bacteremia, or obstruction enters the picture, move to a different agent rather than adding more fosfomycin doses.",
  },
  administration: {
    oralAbsorption: "Dissolve the sachet fully in water and take as directed; food can delay absorption modestly but does not change its bladder-focused role.",
    note: "There is no IV product in this catalog, so oral use is the entire strategy.",
  },
  ivToPoSwitch: {
    poBioavailability: "PO-only agent; there is no IV formulation to convert from.",
    switchCriteria: "Use as oral-first therapy only when the syndrome is clearly cystitis and the patient can take oral medication.",
    note: "If the patient required IV therapy for systemic infection, fosfomycin is usually not the right oral landing zone.",
  },
  opatEligibility: {
    eligible: "no",
    administration: "Fosfomycin is an outpatient oral cystitis drug, not an OPAT drug.",
    monitoring: "Reassess quickly if symptoms suggest upper-tract disease or if the culture reveals a site where fosfomycin is unreliable.",
    considerations: [
      "Best framed as an oral stewardship option for cystitis rather than a way to avoid appropriate IV therapy.",
    ],
  },
  interactionActions: [
    {
      interactingAgent: "Metoclopramide",
      effect: "Can lower oral fosfomycin exposure by speeding GI transit.",
      management: "Avoid the combination when possible or separate administration and monitor for treatment failure.",
      severity: "monitor",
    },
    {
      interactingAgent: "Other laxative-heavy bowel regimens",
      effect: "Rapid transit may reduce absorption and weaken already site-limited therapy.",
      management: "Review bowel-regimen intensity if the cystitis plan depends on fosfomycin.",
      severity: "monitor",
    },
  ],
  stewardshipUseCases: [
    {
      scenario: "Oral treatment of uncomplicated or resistant cystitis",
      role: "A bladder-focused oral option that can preserve fluoroquinolones and carbapenems when the infection is truly lower tract.",
      notes: "Its value drops sharply once the infection is no longer confined to the bladder.",
    },
    {
      scenario: "Avoiding unnecessary broad IV therapy for cystitis",
      role: "Useful when the microbiology supports it and oral therapy can safely replace an overly aggressive inpatient plan.",
      notes: "Do not use it to talk yourself out of treating pyelonephritis correctly.",
    },
  ],
};

export const AMOXICILLIN_EXECUTION_ENHANCEMENTS: Partial<DrugMonograph> = {
  dosingByIndication: [
    {
      label: "Susceptible CAP oral therapy or step-down",
      regimen: "1 g PO TID",
      notes: "Best used for pneumococcal-predominant CAP once atypical coverage and beta-lactamase concerns are out of the way.",
    },
    {
      label: "Streptococcal respiratory infection",
      regimen: "500 mg to 1 g PO TID depending on syndrome",
      notes: "High-frequency dosing matters more than convenience when you want reliable time above MIC.",
    },
  ],
  renalReplacement: [
    {
      modality: "HD",
      guidance: "Use renally adjusted dosing and give post-hemodialysis when needed; oral use still works well for susceptible respiratory infection if the gut works.",
    },
    {
      modality: "CRRT",
      guidance: "CRRT often supports near-standard oral dosing, but severe infection usually needs an IV beta-lactam until the patient is clearly improving.",
    },
  ],
  specialPopulations: [
    {
      population: "History of EBV-associated aminopenicillin rash",
      guidance: "Do not document the classic mononucleosis rash as a lifelong penicillin allergy without better evidence.",
    },
    {
      population: "Aspiration or beta-lactamase-heavy syndromes",
      guidance: "Amoxicillin alone is a poor fit when oral anaerobes, H. influenzae beta-lactamase production, or mixed flora are central concerns.",
    },
  ],
  therapeuticDrugMonitoring: {
    target: "No routine serum target; the meaningful endpoints are correct syndrome selection, adherence, and clinical improvement.",
    sampling: "No drug levels are standard. Follow symptoms and renal function instead.",
    adjustment: "If oral step-down fails, first ask whether the syndrome needed amoxicillin-clavulanate or a different class rather than just a bigger amoxicillin dose.",
  },
  administration: {
    oralAbsorption: "Absorption is good and generally reliable, making it a practical oral beta-lactam step-down drug when the pathogen fits.",
    note: "TID dosing is operationally less convenient than once-daily options but often worth it when narrow pneumococcal coverage is the goal.",
  },
  ivToPoSwitch: {
    poBioavailability: "Good oral bioavailability suitable for IV-to-PO transition in stable patients.",
    switchCriteria: "Switch from IV ampicillin or ceftriaxone when the patient is improving, can absorb, and cultures or syndrome support narrow oral therapy.",
    note: "This is a narrowing drug, not a rescue drug.",
  },
  opatEligibility: {
    eligible: "no",
    administration: "Amoxicillin is an oral completion drug rather than an OPAT drug.",
    monitoring: "No infusion monitoring is needed; focus on adherence, tolerance, and whether the narrow oral spectrum still fits.",
    considerations: [
      "A stewardship-friendly oral exit when susceptible pneumococcus or streptococci are the real targets.",
    ],
  },
  interactionActions: [
    {
      interactingAgent: "Warfarin",
      effect: "INR can rise through gut-flora disruption and illness effects.",
      management: "Increase INR monitoring during therapy transitions.",
      severity: "monitor",
    },
    {
      interactingAgent: "Allopurinol",
      effect: "Can increase the frequency of aminopenicillin-associated rash.",
      management: "Document the rash context carefully before labeling the patient penicillin-allergic.",
      severity: "monitor",
    },
  ],
  stewardshipUseCases: [
    {
      scenario: "Narrow oral CAP step-down",
      role: "A high-value oral beta-lactam when pneumococcus or streptococci are the dominant organisms and broad inpatient therapy can be retired.",
      notes: "Its stewardship win is narrowing, not convenience dosing.",
    },
    {
      scenario: "Avoiding unnecessary fluoroquinolone exposure in respiratory infection",
      role: "A safer narrow oral alternative when the pathogen does not require atypical or resistant gram-negative coverage.",
      notes: "Do not use it if the syndrome still needs beta-lactamase protection.",
    },
  ],
};

export const AZITHROMYCIN_EXECUTION_ENHANCEMENTS: Partial<DrugMonograph> = {
  dosingByIndication: [
    {
      label: "Atypical CAP coverage",
      regimen: "500 mg IV/PO daily",
      notes: "Often used as the atypical companion rather than the lone severe CAP agent.",
    },
    {
      label: "Legionella-focused combination therapy",
      regimen: "500 mg IV/PO daily",
      notes: "Use within a broader regimen when severe Legionella or CAP is the concern.",
    },
  ],
  renalReplacement: [
    {
      modality: "HD",
      guidance: "No meaningful dose adjustment is typically needed, which is part of its operational simplicity.",
    },
    {
      modality: "CRRT",
      guidance: "Standard daily dosing usually remains appropriate because renal clearance is not the main determinant.",
    },
  ],
  specialPopulations: [
    {
      population: "QTc prolongation or interacting cardiac drugs",
      guidance: "Use more cautiously when baseline QT risk is already high because macrolide convenience is not worth malignant rhythm risk.",
    },
    {
      population: "Liver disease",
      guidance: "Hepatic injury is uncommon but relevant enough to reconsider prolonged courses in patients with active cholestatic or hepatic disease.",
    },
  ],
  therapeuticDrugMonitoring: {
    target: "No routine serum target; tissue penetration and the right syndrome matter more than levels.",
    sampling: "No therapeutic drug levels are used. Follow ECG context, symptoms, and liver tests when clinically indicated.",
    adjustment: "If the patient is not improving, ask whether the regimen needs a better typical-pathogen backbone rather than more azithromycin exposure.",
  },
  administration: {
    infusion: "IV azithromycin is commonly infused over about 1 hour.",
    oralAbsorption: "Oral therapy is usually reliable enough for continuation once the patient can absorb and no rapid IV-only support is needed.",
    note: "Its long tissue half-life makes duration decisions more important than dose stacking.",
  },
  ivToPoSwitch: {
    poBioavailability: "Moderate oral bioavailability but reliable clinical oral continuation for respiratory infection.",
    switchCriteria: "Switch to PO once the patient can take oral medication and no absorption barrier remains.",
    note: "A straightforward IV-to-PO conversion in stable CAP patients.",
  },
  opatEligibility: {
    eligible: "no",
    administration: "Azithromycin is usually finished orally rather than through OPAT.",
    monitoring: "Focus on ECG risk and overall regimen fit, not infusion logistics.",
    considerations: [
      "An oral completion drug in most respiratory pathways.",
    ],
  },
  interactionActions: [
    {
      interactingAgent: "Other QT-prolonging agents",
      effect: "Additive QT risk can become clinically important in older or electrolyte-depleted patients.",
      management: "Review ECG and electrolyte context before continuing combination therapy.",
      severity: "major",
    },
    {
      interactingAgent: "Warfarin",
      effect: "INR can rise during macrolide therapy.",
      management: "Increase INR monitoring if the combination is unavoidable.",
      severity: "monitor",
    },
  ],
  stewardshipUseCases: [
    {
      scenario: "Short-course atypical CAP coverage",
      role: "Useful when atypical pathogens or Legionella remain credible and broad fluoroquinolone exposure is unnecessary.",
      notes: "Avoid carrying it longer than the syndrome requires.",
    },
    {
      scenario: "Early CAP oral continuation",
      role: "Easy oral continuation can shorten IV days when the patient is stabilizing.",
      notes: "Do not let macrolide familiarity obscure QT risk or weak stand-alone pneumococcal coverage in severe disease.",
    },
  ],
};

export const DOXYCYCLINE_EXECUTION_ENHANCEMENTS: Partial<DrugMonograph> = {
  dosingByIndication: [
    {
      label: "CAP oral therapy or step-down",
      regimen: "100 mg IV/PO q12h",
      notes: "A useful non-fluoroquinolone oral option for atypical and some typical community pathogens.",
    },
    {
      label: "Skin or MRSA-suspect outpatient infection",
      regimen: "100 mg PO q12h",
      notes: "Clinical fit depends on the organism and whether streptococcal coverage is also needed.",
    },
  ],
  renalReplacement: [
    {
      modality: "HD",
      guidance: "No dose adjustment is usually needed, which makes doxycycline an attractive oral option in renal dysfunction.",
    },
    {
      modality: "CRRT",
      guidance: "Standard dosing usually remains appropriate because renal elimination is limited.",
    },
  ],
  specialPopulations: [
    {
      population: "Pregnancy or young children",
      guidance: "Avoid in pregnancy and use carefully in young children unless the syndrome truly warrants it.",
    },
    {
      population: "Patients with pill esophagitis risk",
      guidance: "Counsel on taking it with water and remaining upright because adherence fails quickly when esophagitis develops.",
    },
  ],
  therapeuticDrugMonitoring: {
    target: "No routine serum target; correct organism fit and oral adherence drive success.",
    sampling: "No therapeutic drug levels are used. Follow clinical response and tolerability.",
    adjustment: "If it fails in CAP, reassess pathogen fit and beta-lactam support rather than chasing higher doxycycline exposure.",
  },
  administration: {
    infusion: "IV dosing is available, but oral therapy is usually preferred once the gut works.",
    oralAbsorption: "High oral bioavailability makes IV-to-PO transition easy if cation interference is avoided.",
    note: "Separate from calcium, iron, magnesium, and other polyvalent cations.",
  },
  ivToPoSwitch: {
    poBioavailability: "High oral bioavailability with reliable IV-to-PO conversion.",
    switchCriteria: "Switch to PO once the patient can absorb and cation timing can be managed.",
    note: "One of the easier oral continuation options when renal dysfunction makes other drugs less attractive.",
  },
  opatEligibility: {
    eligible: "no",
    administration: "Doxycycline is usually completed orally rather than through OPAT.",
    monitoring: "Focus on adherence, GI tolerance, and cation separation instead of infusion logistics.",
    considerations: [
      "A useful oral off-ramp when the pathogen and syndrome fit.",
    ],
  },
  interactionActions: [
    {
      interactingAgent: "Calcium, iron, magnesium, antacids, or tube feeds",
      effect: "Chelation can lower doxycycline absorption enough to weaken oral therapy.",
      management: "Separate from cations and feeds when oral success matters.",
      severity: "major",
    },
    {
      interactingAgent: "Warfarin",
      effect: "May enhance anticoagulant effect in some patients.",
      management: "Increase INR monitoring during therapy changes.",
      severity: "monitor",
    },
  ],
  stewardshipUseCases: [
    {
      scenario: "Oral CAP continuation without fluoroquinolones",
      role: "A useful oral alternative when atypical coverage still matters and a fluoroquinolone is not desirable.",
      notes: "Pair with a beta-lactam when pneumococcal reliability matters.",
    },
    {
      scenario: "Renal-friendly oral therapy",
      role: "Helpful when other oral options become awkward in renal dysfunction.",
      notes: "Do not ignore cation interactions or pregnancy restrictions.",
    },
  ],
};

export const MOXIFLOXACIN_EXECUTION_ENHANCEMENTS: Partial<DrugMonograph> = {
  dosingByIndication: [
    {
      label: "CAP monotherapy or step-down",
      regimen: "400 mg IV/PO daily",
      notes: "Use when a respiratory fluoroquinolone is truly warranted and urinary activity is not the deciding issue.",
    },
    {
      label: "Mixed respiratory infection with anaerobic signal",
      regimen: "400 mg IV/PO daily",
      notes: "Useful when respiratory fit matters more than urinary reach, but do not treat it as your UTI fluoroquinolone.",
    },
  ],
  renalReplacement: [
    {
      modality: "HD",
      guidance: "No renal dose adjustment is generally needed, which simplifies use in patients with reduced kidney function.",
    },
    {
      modality: "CRRT",
      guidance: "Standard daily dosing usually remains appropriate because renal clearance is limited.",
    },
  ],
  specialPopulations: [
    {
      population: "QTc prolongation, aneurysm risk, or significant steroid exposure",
      guidance: "Use only when the respiratory benefit is real because fluoroquinolone toxicity risk may outweigh convenience.",
    },
    {
      population: "Patients with a urinary source question",
      guidance: "Do not choose moxifloxacin when urinary exposure matters because it is the least urinary-useful fluoroquinolone in this catalog.",
    },
  ],
  therapeuticDrugMonitoring: {
    target: "No routine serum target; appropriate syndrome selection and toxicity review matter more than levels.",
    sampling: "No drug levels are standard. Follow ECG context and adverse-effect burden instead.",
    adjustment: "If therapy is failing, ask whether the pathogen or site actually needed a different respiratory backbone rather than more fluoroquinolone exposure.",
  },
  administration: {
    infusion: "IV moxifloxacin is typically infused over about 1 hour.",
    oralAbsorption: "High oral bioavailability makes IV-to-PO conversion straightforward if cation timing is managed.",
    note: "The once-daily schedule is convenient, but that is not a reason to ignore fluoroquinolone toxicity tradeoffs.",
  },
  ivToPoSwitch: {
    poBioavailability: "High oral bioavailability with easy once-daily oral continuation.",
    switchCriteria: "Switch to PO once the patient can absorb and no major cation barrier exists.",
    note: "A convenient respiratory step-down drug, but not an all-purpose fluoroquinolone.",
  },
  opatEligibility: {
    eligible: "conditional",
    administration: "IV OPAT is possible, but oral completion is usually preferred because the oral formulation is strong and convenient.",
    monitoring: "Monitor QT risk, CNS effects, tendon symptoms, and whether cation separation is realistic at home.",
    considerations: [
      "Prefer oral continuation over home IV infusion whenever the gut works.",
    ],
  },
  interactionActions: [
    {
      interactingAgent: "Other QT-prolonging agents",
      effect: "Additive QT risk can turn a convenient once-daily drug into a high-risk option.",
      management: "Review ECG and electrolyte context before continuing combination therapy.",
      severity: "major",
    },
    {
      interactingAgent: "Calcium, iron, magnesium, antacids, or tube feeds",
      effect: "Chelation can lower oral exposure.",
      management: "Separate oral doses from cations and feeds.",
      severity: "major",
    },
  ],
  stewardshipUseCases: [
    {
      scenario: "Respiratory fluoroquinolone step-down",
      role: "Useful when a once-daily oral respiratory agent is genuinely the best fit.",
      notes: "Keep it away from urinary pathways where its site exposure is weaker.",
    },
    {
      scenario: "Avoiding unnecessarily broad IV respiratory therapy",
      role: "Can shorten IV days when oral continuation is appropriate.",
      notes: "Use selectively because fluoroquinolone collateral damage remains real.",
    },
  ],
};

export const CLINDAMYCIN_EXECUTION_ENHANCEMENTS: Partial<DrugMonograph> = {
  dosingByIndication: [
    {
      label: "Skin and soft tissue infection",
      regimen: "300-450 mg PO q6-8h or 600-900 mg IV q8h",
      notes: "Use only when organism fit and local resistance support clindamycin as a real option.",
    },
    {
      label: "Toxin suppression adjunct",
      regimen: "600-900 mg IV q8h",
      notes: "Keep the adjunctive course short and syndrome-specific when used for toxin suppression.",
    },
  ],
  renalReplacement: [
    {
      modality: "HD",
      guidance: "No renal dose adjustment is generally needed, which helps when renal dysfunction narrows other options.",
    },
    {
      modality: "CRRT",
      guidance: "Standard dosing usually remains appropriate because renal elimination is not the main driver.",
    },
  ],
  specialPopulations: [
    {
      population: "High CDI risk or recent C. difficile history",
      guidance: "Be more selective because clindamycin is one of the classic high-collateral-damage antibiotics.",
    },
    {
      population: "MRSA isolates with inducible resistance risk",
      guidance: "Require D-test confirmation before trusting clindamycin for staphylococcal infection.",
    },
  ],
  therapeuticDrugMonitoring: {
    target: "No routine serum target; susceptibility fit and collateral-damage awareness matter more than levels.",
    sampling: "No drug levels are standard. Follow GI tolerance, stool pattern, and clinical response.",
    adjustment: "If the patient develops diarrhea or the microbiology becomes less convincing, switch rather than forcing clindamycin through the whole course.",
  },
  administration: {
    infusion: "IV clindamycin is commonly infused over 30-60 minutes depending on dose.",
    oralAbsorption: "Oral bioavailability is good enough that IV-to-PO transition is usually simple once the patient can swallow and absorb.",
    note: "The main barrier is not bioavailability; it is whether clindamycin is still the right drug.",
  },
  ivToPoSwitch: {
    poBioavailability: "Good oral bioavailability with a reliable IV-to-PO transition.",
    switchCriteria: "Switch to PO once the patient is improving, can absorb, and the organism remains a credible clindamycin target.",
    note: "Do not continue it just because oral absorption is easy if a lower-CDI-risk option is available.",
  },
  opatEligibility: {
    eligible: "conditional",
    administration: "IV OPAT is possible, but oral completion is usually preferred because the oral route works well.",
    monitoring: "Monitor for diarrhea, rash, and whether susceptibility still supports therapy.",
    considerations: [
      "Prefer oral continuation over home IV infusion whenever possible.",
      "Keep courses as short as the syndrome allows because CDI risk accumulates with exposure.",
    ],
  },
  interactionActions: [
    {
      interactingAgent: "Neuromuscular blocking agents",
      effect: "Can enhance neuromuscular blockade and complicate critical-care management.",
      management: "Use caution in ventilated or perioperative patients.",
      severity: "major",
    },
    {
      interactingAgent: "Warfarin",
      effect: "INR can rise during therapy through gut-flora disruption and illness effects.",
      management: "Increase INR monitoring if the combination is used.",
      severity: "monitor",
    },
  ],
  stewardshipUseCases: [
    {
      scenario: "Short-course toxin suppression or organism-directed SSTI treatment",
      role: "Useful in selected cases where ribosomal inhibition or oral step-down matters.",
      notes: "Its stewardship downside is the CDI signal, so use it deliberately and briefly.",
    },
    {
      scenario: "Avoiding unnecessary prolonged broad-spectrum IV therapy",
      role: "Can help shorten line days when the organism and syndrome clearly fit oral clindamycin.",
      notes: "Do not use it reflexively when beta-lactams remain better options.",
    },
  ],
};

export const FIDAXOMICIN_EXECUTION_ENHANCEMENTS: Partial<DrugMonograph> = {
  dosingByIndication: [
    {
      label: "Initial or recurrent CDI",
      regimen: "200 mg PO BID for 10 days",
      notes: "Preferred when recurrence reduction and microbiome preservation are priorities.",
    },
    {
      label: "Extended-pulsed recurrence-reduction strategy",
      regimen: "200 mg PO BID for 5 days, then 200 mg every other day for 20 days",
      notes: "Use in selected recurrence-prone patients when the longer schedule is operationally feasible.",
    },
  ],
  renalReplacement: [
    {
      modality: "HD",
      guidance: "No dose adjustment is needed because systemic absorption is minimal.",
    },
    {
      modality: "CRRT",
      guidance: "No dose adjustment is needed because the drug acts locally in the gut rather than systemically.",
    },
  ],
  specialPopulations: [
    {
      population: "High recurrence risk",
      guidance: "This is where fidaxomicin creates the biggest stewardship value by preserving microbiome recovery better than oral vancomycin.",
    },
    {
      population: "Fulminant CDI with ileus",
      guidance: "Do not rely on fidaxomicin when drug delivery to the colon is impaired; fulminant protocols still center on oral or rectal vancomycin plus IV metronidazole.",
    },
  ],
  therapeuticDrugMonitoring: {
    target: "No routine serum target; success is measured by diarrhea improvement and recurrence prevention, not plasma levels.",
    sampling: "No drug levels are used. Follow stool frequency and recurrence over the subsequent weeks.",
    adjustment: "If the patient worsens, reassess whether the syndrome has progressed to fulminant CDI rather than adding more fidaxomicin.",
  },
  administration: {
    oralAbsorption: "Minimal systemic absorption is intentional because the drug works locally in the colon.",
    note: "There is no IV formulation; if the patient cannot take or deliver enteral therapy, switch to the fulminant CDI pathway.",
  },
  ivToPoSwitch: {
    poBioavailability: "PO-only local therapy; there is no IV equivalent.",
    switchCriteria: "Use as oral-first CDI therapy when enteral delivery is reliable.",
    note: "This is not a systemic IV-to-PO conversion drug.",
  },
  opatEligibility: {
    eligible: "no",
    administration: "Fidaxomicin is an oral outpatient drug, not an OPAT drug.",
    monitoring: "No infusion monitoring is required; focus on symptom response and recurrence prevention.",
    considerations: [
      "Use it as an oral microbiome-sparing CDI strategy rather than a line-based treatment plan.",
    ],
  },
  interactionActions: [
    {
      interactingAgent: "Strong P-glycoprotein inhibitors such as cyclosporine",
      effect: "Systemic exposure can increase modestly even though absorption is usually minimal.",
      management: "Use with awareness, but the local GI mechanism still dominates.",
      severity: "monitor",
    },
    {
      interactingAgent: "Concurrent CDI antibiotics",
      effect: "There is no reason to combine it routinely with oral vancomycin for standard CDI therapy.",
      management: "Choose the CDI strategy intentionally rather than layering agents without a fulminant indication.",
      severity: "monitor",
    },
  ],
  stewardshipUseCases: [
    {
      scenario: "Microbiome-sparing CDI therapy",
      role: "A preferred option when preventing recurrence is as important as curing the current episode.",
      notes: "Its stewardship value is biggest in older, immunocompromised, or recurrence-prone patients.",
    },
    {
      scenario: "Avoiding broad collateral damage from oral vancomycin",
      role: "Helps preserve colonization resistance better than oral vancomycin in selected patients.",
      notes: "Do not use it where enteral delivery is failing.",
    },
  ],
};

export const VANCOMYCIN_ORAL_EXECUTION_ENHANCEMENTS: Partial<DrugMonograph> = {
  dosingByIndication: [
    {
      label: "Non-fulminant CDI",
      regimen: "125 mg PO QID for 10 days",
      notes: "A standard local CDI treatment option when fidaxomicin is not used.",
    },
    {
      label: "Fulminant CDI",
      regimen: "500 mg PO or NG QID, plus rectal vancomycin if ileus and IV metronidazole",
      notes: "Higher dosing is reserved for fulminant disease with delivery concerns.",
    },
  ],
  renalReplacement: [
    {
      modality: "HD",
      guidance: "No dose adjustment is usually needed because oral vancomycin is not intended to create systemic exposure.",
    },
    {
      modality: "CRRT",
      guidance: "No dose adjustment is usually needed; if severe colitis increases absorption, monitor in context rather than adjusting preemptively.",
    },
  ],
  specialPopulations: [
    {
      population: "Fulminant CDI with ileus",
      guidance: "Drug delivery matters more than microbiology here, so add rectal vancomycin and IV metronidazole when oral or NG delivery is inadequate.",
    },
    {
      population: "Concurrent IV vancomycin use or severe colitis",
      guidance: "Systemic absorption is still usually low, but severe colitis can make combined vancomycin exposure more relevant than usual.",
    },
  ],
  therapeuticDrugMonitoring: {
    target: "No routine serum target for oral CDI therapy; it is intended as a local colonic drug.",
    sampling: "No vancomycin levels are routinely needed for standard oral CDI treatment.",
    adjustment: "If the patient is worsening, escalate the CDI approach rather than chasing systemic levels of oral vancomycin.",
  },
  administration: {
    oralAbsorption: "Minimal systemic absorption is expected; the goal is very high colonic lumen concentrations.",
    note: "Capsules, solution, NG administration, and rectal enemas each have different operational considerations in fulminant disease.",
  },
  ivToPoSwitch: {
    poBioavailability: "Oral vancomycin is not a systemic PO equivalent of IV vancomycin.",
    switchCriteria: "Use only for CDI; do not convert systemic MRSA therapy from IV vancomycin to oral vancomycin.",
    note: "The route determines the indication here more than the molecule does.",
  },
  opatEligibility: {
    eligible: "no",
    administration: "This is an oral CDI drug rather than an OPAT drug.",
    monitoring: "Monitor diarrhea improvement and the discharge plan for recurrence prevention instead of infusion logistics.",
    considerations: [
      "Outpatient oral therapy is common, but it is not OPAT.",
    ],
  },
  interactionActions: [
    {
      interactingAgent: "Cholestyramine or colestipol",
      effect: "Can bind oral vancomycin in the gut and reduce its local effect.",
      management: "Avoid co-administration or separate clearly if both are used.",
      severity: "major",
    },
    {
      interactingAgent: "Concurrent IV vancomycin",
      effect: "There is no therapeutic substitution; they treat different problems and may occasionally be needed together.",
      management: "Prescribe each route intentionally and monitor total clinical context in severe colitis.",
      severity: "monitor",
    },
  ],
  stewardshipUseCases: [
    {
      scenario: "Standard oral CDI treatment when fidaxomicin is not chosen",
      role: "A dependable local therapy with broad clinical familiarity.",
      notes: "Its main stewardship downside is collateral microbiome injury relative to fidaxomicin.",
    },
    {
      scenario: "Fulminant CDI drug-delivery strategy",
      role: "Still central when ileus or shock makes lumen drug delivery the urgent problem.",
      notes: "Do not confuse this with systemic anti-MRSA therapy.",
    },
  ],
};

export const BEZLOTOXUMAB_EXECUTION_ENHANCEMENTS: Partial<DrugMonograph> = {
  dosingByIndication: [
    {
      label: "Adjunctive recurrence prevention during CDI treatment",
      regimen: "10 mg/kg IV x 1 dose during active CDI antibiotic therapy",
      notes: "Use as a recurrence-prevention adjunct, not as treatment for the current infection by itself.",
    },
  ],
  renalReplacement: [
    {
      modality: "HD",
      guidance: "No dose adjustment is needed because monoclonal-antibody clearance is not dialysis dependent.",
    },
    {
      modality: "CRRT",
      guidance: "No dose adjustment is needed because clearance is not meaningfully altered by CRRT.",
    },
  ],
  specialPopulations: [
    {
      population: "High-risk recurrence groups",
      guidance: "Greatest value is in older adults, immunocompromised patients, and those with prior CDI recurrence or concurrent systemic antibiotics.",
    },
    {
      population: "Heart failure",
      guidance: "Use more cautiously in patients with underlying or decompensated heart failure because recurrence-prevention benefit has to be weighed against HF risk.",
    },
  ],
  therapeuticDrugMonitoring: {
    target: "No routine serum target; success is lower CDI recurrence over the next 12 weeks rather than short-term symptom change.",
    sampling: "No drug levels are used. Monitor infusion tolerance and recurrence outcomes.",
    adjustment: "If the patient is clinically worsening during the active episode, intensify CDI treatment rather than assuming bezlotoxumab will rescue the course.",
  },
  administration: {
    infusion: "Single IV infusion over about 60 minutes.",
    note: "Give during the active CDI antibiotic course rather than after all therapy is complete whenever possible.",
  },
  ivToPoSwitch: {
    poBioavailability: "No oral formulation exists, and there is no oral equivalent to toxin-neutralizing monoclonal therapy.",
    switchCriteria: "Not an IV-to-PO conversion drug; the question is whether the patient needs the one-time infusion at all.",
    note: "Use as an adjunct to CDI antibiotics, not as a route-conversion strategy.",
  },
  opatEligibility: {
    eligible: "conditional",
    administration: "A one-time outpatient infusion-center or monitored ambulatory infusion is feasible for selected patients.",
    monitoring: "Monitor during and shortly after infusion, with extra attention to heart-failure symptoms in at-risk patients.",
    considerations: [
      "Best for recurrence-prone patients who can access a monitored infusion setting.",
      "Not a substitute for choosing the right CDI antibiotic plan.",
    ],
  },
  interactionActions: [
    {
      interactingAgent: "Concurrent CDI antibiotics",
      effect: "Bezlotoxumab does not replace vancomycin or fidaxomicin and adds no direct antibacterial effect.",
      management: "Administer it during an active CDI antibiotic course rather than in place of one.",
      severity: "major",
    },
    {
      interactingAgent: "Heart-failure-sensitive infusion regimens",
      effect: "Volume and infusion exposure may be less well tolerated in patients with unstable CHF.",
      management: "Review HF status before infusion and monitor more closely if used.",
      severity: "monitor",
    },
  ],
  stewardshipUseCases: [
    {
      scenario: "Preventing recurrent CDI in high-risk patients",
      role: "A stewardship adjunct that can reduce re-hospitalization and repeated antibiotic exposure.",
      notes: "Most valuable when recurrence risk is clearly elevated.",
    },
    {
      scenario: "Avoiding repeat CDI treatment cycles",
      role: "Can lower the chance that the patient re-enters the cycle of recurrent CDI and repeated microbiome injury.",
      notes: "Choose it selectively because not every patient needs an expensive infusion adjunct.",
    },
  ],
};

export const AMPICILLIN_EXECUTION_ENHANCEMENTS: Partial<DrugMonograph> = {
  dosingByIndication: [
    {
      label: "Listeria meningitis",
      regimen: "2 g IV q4h",
      notes: "Include whenever Listeria is credible because cephalosporins do not solve that gap.",
    },
    {
      label: "Enterococcal endocarditis backbone",
      regimen: "2 g IV q4h, often with ceftriaxone",
      notes: "Use within a targeted regimen rather than as a generic broad-spectrum beta-lactam.",
    },
  ],
  renalReplacement: [
    {
      modality: "HD",
      guidance: "Use renally adjusted dosing and give after hemodialysis; high-dose meningitis schedules still need careful post-HD planning.",
    },
    {
      modality: "CRRT",
      guidance: "CRRT often still needs aggressive dosing in CNS or endocarditis syndromes because underexposure can be clinically costly.",
    },
  ],
  specialPopulations: [
    {
      population: "Older adults, pregnancy, alcoholism, or immunocompromise",
      guidance: "These are the classic scenarios where empiric Listeria coverage belongs in the meningitis regimen.",
    },
    {
      population: "History of EBV-associated aminopenicillin rash",
      guidance: "Do not convert the classic mononucleosis rash into a permanent beta-lactam allergy label.",
    },
  ],
  therapeuticDrugMonitoring: {
    target: "No routine serum target; the clinical target is reliable syndrome-specific exposure in CNS or enterococcal disease.",
    sampling: "No standard therapeutic drug levels are used. Follow renal function, neurologic status, and culture response.",
    adjustment: "If Listeria or Enterococcus remains in the differential, do not de-escalate ampicillin until that specific microbiology question is settled.",
  },
  administration: {
    infusion: "Frequent IV dosing is standard for serious CNS and endovascular infection.",
    note: "The operational burden is high, but the microbiologic niche is irreplaceable in the right syndromes.",
  },
  ivToPoSwitch: {
    poBioavailability: "There is no direct oral equivalent for serious CNS or endovascular ampicillin use; oral amoxicillin is only a substitute in selected non-CNS situations.",
    switchCriteria: "Reserve oral transition for carefully selected non-CNS syndromes once invasive infection has resolved and the patient can absorb reliably.",
    note: "For Listeria meningitis and enterococcal endocarditis, the main decision is duration and partner drug, not IV-to-PO conversion.",
  },
  opatEligibility: {
    eligible: "conditional",
    administration: "Continuous-infusion or frequent-dose OPAT is possible, but line logistics are substantial.",
    monitoring: "Weekly CBC and renal function are minimum, with closer follow-up for prolonged CNS or endovascular therapy.",
    considerations: [
      "Reasonable only when the syndrome genuinely still requires ampicillin and the infusion program can support the frequency.",
      "If amoxicillin can safely replace it, do that instead of building a difficult OPAT plan.",
    ],
  },
  interactionActions: [
    {
      interactingAgent: "Methotrexate",
      effect: "Can reduce methotrexate clearance and increase toxicity risk.",
      management: "Avoid when possible or monitor closely for methotrexate toxicity.",
      severity: "major",
    },
    {
      interactingAgent: "Warfarin",
      effect: "INR may rise through gut-flora disruption and illness effects.",
      management: "Increase INR monitoring during therapy transitions.",
      severity: "monitor",
    },
  ],
  stewardshipUseCases: [
    {
      scenario: "Empiric or definitive Listeria coverage",
      role: "A niche but non-substitutable beta-lactam when the meningitis differential includes Listeria.",
      notes: "Its stewardship value is precision, not breadth.",
    },
    {
      scenario: "Targeted Enterococcus therapy",
      role: "Useful when Enterococcus is the true pathogen and broader empiric therapy can be retired.",
      notes: "Do not keep broader gram-negative therapy on board once ampicillin is the right definitive agent.",
    },
  ],
};

export const AZTREONAM_EXECUTION_ENHANCEMENTS: Partial<DrugMonograph> = {
  dosingByIndication: [
    {
      label: "Aerobic gram-negative infection with severe beta-lactam allergy",
      regimen: "1-2 g IV q8h",
      notes: "Use higher-end dosing for severe infection or Pseudomonas risk, but remember the gram-positive and anaerobic gaps.",
    },
    {
      label: "Serious gram-negative or Pseudomonas infection",
      regimen: "2 g IV q6-8h",
      notes: "Only trust monotherapy when the organism and syndrome truly fit aztreonam's narrow spectrum.",
    },
  ],
  renalReplacement: [
    {
      modality: "HD",
      guidance: "Use renally adjusted dosing with a post-hemodialysis supplement because aztreonam is primarily renally cleared.",
    },
    {
      modality: "CRRT",
      guidance: "CRRT often still supports q8h or more aggressive exposure, particularly when resistant gram-negative infection is being treated.",
    },
  ],
  specialPopulations: [
    {
      population: "Immediate ceftazidime allergy",
      guidance: "Do not assume aztreonam is automatically safe because the shared side chain with ceftazidime still matters.",
    },
    {
      population: "MBL-producing CRE or polymicrobial infection",
      guidance: "Its narrow allergy-friendly profile is useful, but only if you explicitly solve the co-produced beta-lactamase or companion-coverage gap.",
    },
  ],
  therapeuticDrugMonitoring: {
    target: "No routine serum target; the important target is dependable gram-negative coverage without forgetting the obvious spectrum gaps.",
    sampling: "No drug levels are standard. Review renal function, organism phenotype, and partner-drug adequacy.",
    adjustment: "If the organism is an MBL producer, fix the partner strategy rather than just pushing aztreonam harder.",
  },
  administration: {
    infusion: "Typically infused intermittently on a q6-8h schedule depending on syndrome severity.",
    note: "Operational simplicity should not hide the need for additional gram-positive or anaerobic coverage when required.",
  },
  ivToPoSwitch: {
    poBioavailability: "No oral formulation exists, so step-down requires switching to another active oral class.",
    switchCriteria: "Leave aztreonam once allergy clarification or susceptibilities reveal a better IV or oral option.",
    note: "Its main value is often as a bridge while allergy and microbiology are clarified.",
  },
  opatEligibility: {
    eligible: "conditional",
    administration: "OPAT is feasible, but q8h dosing and the need for partner agents can make it more complex than it first appears.",
    monitoring: "Weekly CBC and renal function are minimum expectations, with closer review if combination therapy is being used for resistant pathogens.",
    considerations: [
      "Most useful when a severe beta-lactam allergy truly prevents easier options.",
      "Do not build OPAT around aztreonam monotherapy for MBL organisms.",
    ],
  },
  interactionActions: [
    {
      interactingAgent: "Ceftazidime-avibactam",
      effect: "The combination can restore clinical usefulness against MBL organisms where aztreonam alone is unreliable.",
      management: "Pair intentionally for NDM, VIM, or IMP producers when the mechanism demands it.",
      severity: "major",
    },
    {
      interactingAgent: "Probenecid",
      effect: "Can raise aztreonam levels by reducing renal tubular secretion.",
      management: "Avoid using probenecid as a pseudo-boosting strategy.",
      severity: "monitor",
    },
  ],
  stewardshipUseCases: [
    {
      scenario: "Serious gram-negative therapy in true beta-lactam allergy",
      role: "A valuable narrow-spectrum bridge when allergy limits other beta-lactams.",
      notes: "Always reassess whether the allergy history still justifies it.",
    },
    {
      scenario: "Mechanism-aware partner in MBL regimens",
      role: "Useful when paired correctly rather than used alone against a resistant phenotype it cannot reliably solve.",
      notes: "Document the pairing rationale clearly for the next team.",
    },
  ],
  monitoringActions: [
    {
      trigger: "Rapid diagnostics or carbapenemase testing points to NDM, VIM, or IMP production",
      action: "Make sure the ceftazidime-avibactam partner is active and scheduled correctly rather than assuming aztreonam monotherapy has become adequate.",
      rationale: "The main preventable failure mode is treating the MBL label with aztreonam alone.",
      sourceIds: ["idsa-2024-amr", "aztreonam-avibactam-evidence", "clsi-breakpoint-updates"],
    },
    {
      trigger: "Allergy clarification suggests broader beta-lactams are actually usable",
      action: "Reassess the need for aztreonam the same day and de-escalate if a better-supported beta-lactam can be used safely.",
      sourceIds: ["idsa-2024-amr"],
    },
  ],
  misuseTraps: [
    {
      scenario: "Using aztreonam alone for an MBL-producing isolate because the susceptibility report appears permissive",
      risk: "Co-produced serine beta-lactamases can still inactivate aztreonam and create a false sense of definitive coverage.",
      saferApproach: "Pair with ceftazidime-avibactam or use another mechanism-directed regimen when MBL biology is present.",
      sourceIds: ["idsa-2024-amr", "aztreonam-avibactam-evidence", "clsi-breakpoint-updates"],
    },
    {
      scenario: "Assuming aztreonam is automatically safe in a patient with immediate ceftazidime allergy",
      risk: "The shared side chain can make the allergy workaround unsafe as well as ineffective.",
      saferApproach: "Review the exact allergy history and use supervised testing or an alternative plan when ceftazidime reactivity is plausible.",
      sourceIds: ["idsa-2024-amr"],
    },
  ],
  administrationConstraints: [
    {
      title: "MBL regimens need aztreonam and ceftazidime-avibactam coordinated intentionally",
      detail: "The combination fails operationally when one agent is timed, adjusted, or handed off independently of the other.",
      action: "Link the two drugs in the medication plan and verify combination-testing interpretation in the stewardship note.",
      sourceIds: ["idsa-2024-amr", "aztreonam-avibactam-evidence", "clsi-breakpoint-updates"],
    },
    {
      title: "Spectrum gaps should be named, not assumed covered by momentum",
      detail: "Aztreonam does not solve anaerobic or gram-positive needs in polymicrobial syndromes even when the gram-negative target is clear.",
      action: "Write the companion-coverage plan explicitly at initiation and reassessment.",
      sourceIds: ["idsa-2024-amr"],
    },
  ],
  siteSpecificAvoidances: [
    {
      site: "Polymicrobial intra-abdominal or aspiration infection without explicit companion coverage",
      reason: "Aztreonam leaves important anaerobic and gram-positive gaps that can be missed when allergy concerns dominate the plan.",
      preferredApproach: "Add the needed companion agents or use a broader regimen once allergy clarification allows it.",
      sourceIds: ["idsa-2024-amr"],
    },
  ],
};

export const TEDIZOLID_EXECUTION_ENHANCEMENTS: Partial<DrugMonograph> = {
  dosingByIndication: [
    {
      label: "ABSSSI",
      regimen: "200 mg IV/PO daily for 6 days",
      notes: "Best used when a short-course once-daily gram-positive oral option is the real goal.",
    },
  ],
  renalReplacement: [
    {
      modality: "HD",
      guidance: "No dose adjustment is usually needed, which is part of tedizolid's operational appeal.",
    },
    {
      modality: "CRRT",
      guidance: "Standard daily dosing usually remains appropriate because renal clearance is not the main driver.",
    },
  ],
  specialPopulations: [
    {
      population: "Patients with renal dysfunction or linezolid intolerance risk",
      guidance: "Tedizolid can be attractive when you want oxazolidinone activity with less concern about renal metabolite accumulation.",
    },
    {
      population: "Bacteremia or deep-seated invasive infection",
      guidance: "Do not overextend tedizolid into syndromes where the evidence base is much thinner than for skin infection.",
    },
  ],
  therapeuticDrugMonitoring: {
    target: "No routine serum target; success depends on syndrome fit and toxicity surveillance rather than drug levels.",
    sampling: "No standard drug levels are used. Follow CBC and serotonergic toxicity context when courses extend.",
    adjustment: "If deeper infection is declared later, switch to a better-validated agent rather than forcing tedizolid to cover more than it should.",
  },
  administration: {
    infusion: "IV administration is once daily; switch to PO quickly when possible.",
    oralAbsorption: "High oral bioavailability makes IV-to-PO conversion straightforward.",
    note: "The operational advantage is once-daily oral completion rather than prolonged IV therapy.",
  },
  ivToPoSwitch: {
    poBioavailability: "High oral bioavailability with near-IV exposure.",
    switchCriteria: "Switch to PO as soon as oral intake is reliable because the same daily dose is used.",
    note: "One of the cleanest day-1 or day-2 IV-to-PO conversions for gram-positive skin infection.",
  },
  opatEligibility: {
    eligible: "conditional",
    administration: "IV OPAT is possible, but oral once-daily therapy is usually the better outpatient route.",
    monitoring: "CBC and serotonergic symptom review still matter whether the route is IV or PO.",
    considerations: [
      "Prefer oral completion over home IV infusion whenever feasible.",
      "Use mostly in short-course SSTI pathways rather than prolonged invasive infection plans.",
    ],
  },
  interactionActions: [
    {
      interactingAgent: "Serotonergic drugs",
      effect: "Can increase serotonin-toxicity risk, even if the signal may be somewhat lower than with linezolid.",
      management: "Reconcile serotonergic medications before starting therapy and monitor closely if overlap is unavoidable.",
      severity: "major",
    },
    {
      interactingAgent: "Rifampin",
      effect: "Can lower tedizolid exposure.",
      management: "Avoid the combination or use only with a clear rationale and close follow-up.",
      severity: "monitor",
    },
  ],
  stewardshipUseCases: [
    {
      scenario: "Short-course gram-positive skin infection",
      role: "A once-daily oral-capable option when linezolid-like activity is useful but a shorter course is appealing.",
      notes: "Its best stewardship role is simplifying outpatient management, not covering deep bacteremia.",
    },
    {
      scenario: "Avoiding unnecessary prolonged IV gram-positive therapy",
      role: "High oral bioavailability can shorten line days quickly when the syndrome fits.",
      notes: "Do not confuse convenience with evidence for invasive disease.",
    },
  ],
};

export const POSACONAZOLE_EXECUTION_ENHANCEMENTS: Partial<DrugMonograph> = {
  dosingByIndication: [
    {
      label: "Mold prophylaxis",
      regimen: "300 mg PO BID day 1, then 300 mg PO daily using delayed-release tablets",
      notes: "The tablet formulation is strongly preferred over suspension for reliable outpatient prophylaxis.",
    },
    {
      label: "Treatment of invasive mold infection",
      regimen: "300 mg IV or PO q12h day 1, then 300 mg daily",
      notes: "Use as a treatment or salvage azole when drug levels and interaction management can be supported.",
    },
  ],
  renalReplacement: [
    {
      modality: "HD",
      guidance: "Oral formulations do not require dose adjustment; avoid IV formulation in significant renal dysfunction because of SBECD concerns when possible.",
    },
    {
      modality: "CRRT",
      guidance: "Oral therapy is usually preferred if feasible; if IV is necessary, reassess renal and vehicle exposure frequently.",
    },
  ],
  specialPopulations: [
    {
      population: "Transplant recipients or patients on calcineurin inhibitors",
      guidance: "This is an interaction-heavy drug where immunosuppressant adjustment must be part of the plan before the first dose.",
    },
    {
      population: "Mucositis, GI dysfunction, or unpredictable absorption",
      guidance: "Use delayed-release tablets or IV therapy rather than relying on the older suspension in patients with impaired absorption.",
    },
  ],
  therapeuticDrugMonitoring: {
    target: "Trough at least 0.5-1 mcg/mL for prophylaxis and often at least 1-1.5 mcg/mL for treatment depending on syndrome and local practice.",
    sampling: "Check troughs after steady state and with major formulation, interaction, or GI-status changes.",
    adjustment: "If the level is low, fix the formulation or interaction problem before just escalating the dose.",
  },
  administration: {
    infusion: "IV loading and daily maintenance are available when oral absorption is unreliable.",
    oralAbsorption: "Delayed-release tablets provide far more dependable exposure than the suspension and are preferred for outpatient use.",
    note: "Formulation choice is a core clinical decision with posaconazole, not a dispensing detail.",
  },
  ivToPoSwitch: {
    poBioavailability: "Delayed-release tablets have dependable oral exposure; suspension is less reliable and more food dependent.",
    switchCriteria: "Switch to delayed-release tablets when oral intake is reliable and absorption barriers are manageable.",
    note: "Avoid converting to suspension unless there is a compelling reason and a level-monitoring plan.",
  },
  opatEligibility: {
    eligible: "yes",
    administration: "Once-daily oral delayed-release tablets make outpatient prophylaxis or step-down practical without IV access.",
    monitoring: "Trough levels, LFTs, QT context, and interacting-drug levels all require structured follow-up.",
    considerations: [
      "Excellent outpatient prophylaxis drug when the interaction burden is actively managed.",
      "Do not discharge on posaconazole without reviewing immunosuppressants and formulation.",
    ],
  },
  interactionActions: [
    {
      interactingAgent: "Tacrolimus, cyclosporine, or sirolimus",
      effect: "Posaconazole can dramatically raise calcineurin- or mTOR-inhibitor exposure.",
      management: "Preemptively reduce doses and monitor drug levels closely when starting or stopping posaconazole.",
      severity: "major",
    },
    {
      interactingAgent: "CYP3A4-metabolized statins or QT-prolonging drugs",
      effect: "Can raise toxicity risk or amplify QT prolongation.",
      management: "Hold or switch interacting drugs when possible and review ECG and medication context carefully.",
      severity: "major",
    },
  ],
  stewardshipUseCases: [
    {
      scenario: "Outpatient mold prophylaxis in high-risk hematology or transplant patients",
      role: "A high-value preventive antifungal when Mucorales coverage and once-daily oral dosing matter.",
      notes: "Its stewardship success depends on doing the interaction work well.",
    },
    {
      scenario: "Avoiding amphotericin exposure when an active oral mold-active azole is appropriate",
      role: "Can provide a safer outpatient continuation path in selected patients once levels are therapeutic and site fit is acceptable.",
      notes: "Do not use it casually where CNS or absorption reliability is uncertain without TDM support.",
    },
  ],
};
