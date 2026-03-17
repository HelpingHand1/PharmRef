// Editorial source for the generated IAI disease module.
// Runtime catalog imports use src/data/generated/diseases/iai.ts.

import type { DiseaseState, Subcategory } from "../types";
import { IAI_MONOGRAPH_ENHANCEMENTS } from "./penetration-content";
import { getEmpiricOptionEnhancementsForDisease } from "./regimen-plan-content";
import { enhanceDisease, enhanceDiseaseEmpiricOptions, mergeEnhancementMaps, ready } from "./stewardship-content";

const IAI_BASE: DiseaseState = {
    id: "iai",
    name: "Intra-Abdominal Infections",
    icon: "🫁",
    category: "Infectious Disease",
    overview: {
      definition: "Intra-abdominal infections (IAI) encompass peritonitis and intra-abdominal abscesses resulting from disruption of the GI tract. The 2010 IDSA/SIS guidelines (Solomkin et al.) classify IAIs as UNCOMPLICATED (infection confined to a single organ without peritoneal extension — e.g., uncomplicated appendicitis, cholecystitis) vs COMPLICATED (cIAI — infection extends beyond the source organ into the peritoneal space, causing localized/diffuse peritonitis or abscess formation). This distinction drives the need for source control and breadth of antimicrobial therapy. Community-acquired vs healthcare-associated IAI is the second key distinction driving empiric choices.",
      epidemiology: "IAIs are the second most common cause of sepsis in ICU patients. Appendicitis is the most common surgical cause (~300,000 cases/year in US). Secondary peritonitis (perforated viscus, anastomotic leak) carries 20-60% mortality depending on severity and timing of intervention. Intra-abdominal abscesses develop in 10-30% of patients after GI perforation or surgery. Healthcare-associated IAI (post-operative leaks, tertiary peritonitis) involve MDR organisms in up to 30-50% of cases.",
      keyGuidelines: [
        { name: "IDSA/SIS 2010 — Guidelines for Diagnosis and Management of cIAI (Solomkin et al.)", detail: "Foundational US cIAI guideline. Established the source-control-first framework, community-vs-healthcare-associated risk stratification, and the core gram-negative plus anaerobic empiric strategy still used today.", sourceIds: ["idsa-sis-2010-ciai"] },
        { name: "STOP-IT Trial (Sawyer et al., 2015 NEJM)", detail: "Landmark RCT that changed IAI duration paradigm. 4 days of antibiotics after source control was non-inferior to conventional longer courses (mean ~8 days) for cIAI. Outcome-based stopping (treat until clinical resolution) was NOT superior to fixed 4-day courses. This trial established short-course therapy as the standard. Pharmacist impact: advocate for 4-day courses and antibiotic time-outs.", sourceIds: ["stop-it"] },
        { name: "SIS 2017 Revised Guidelines (Mazuski et al.)", detail: "Refined the post-source-control era: stronger emphasis on 4-day therapy after adequate control, de-escalation, and avoiding unnecessary Enterococcal or anti-Candidal coverage in community-acquired infection.", sourceIds: ["sis-2017-ciai"] },
        { name: "Tokyo Guidelines 2018 (TG18) — Acute Cholangitis and Cholecystitis", detail: "International biliary-infection guidance for severity grading, timing of ERCP or cholecystectomy, and antimicrobial selection in cholangitis and complicated cholecystitis.", sourceIds: ["tokyo-guidelines"] },
      ],
      landmarkTrials: [
        { name: "STOP-IT (Sawyer et al., 2015 NEJM)", detail: "518 patients with cIAI and adequate source control randomized to 4 days fixed-duration antibiotics vs outcome-based continuation (stop 2 days after resolution of fever/leukocytosis/ileus). No difference in SSI, recurrent IAI, or death. Fixed 4-day course used 1.5 fewer antibiotic days. Practice-changing: 4 days is sufficient with adequate source control.", sourceIds: ["stop-it"] },
        { name: "CIAOW Study (Sartelli et al., 2013)", detail: "Largest worldwide observational study of cIAI management (68 countries, >4,500 patients). Key finding: inadequate source control was the strongest independent predictor of mortality and treatment failure. Reinforced that NO antibiotic regimen can compensate for inadequate source control — source control is primary, antibiotics are adjunctive.", sourceIds: ["ciaow-study"] },
        { name: "Montravers et al. (2016) — De-escalation in cIAI", detail: "Prospective ICU data showed that de-escalation after culture clarification was feasible in complicated intra-abdominal infection without worse outcomes, supporting aggressive narrowing once source control and microbiology are in hand.", sourceIds: ["montravers-2016-deescalation"] },
        { name: "DURAPOP (Montravers et al., 2018)", detail: "Randomized trial in postoperative peritonitis: 8 days vs 15 days of antibiotics. No difference in treatment failure. Shorter courses were safe for complicated postoperative IAI with adequate source control. Extended the STOP-IT principle to healthcare-associated IAI.", sourceIds: ["durapop"] },
        { name: "Solomkin et al. (2003) — Ertapenem vs Pip-Tazo", detail: "Early randomized data showing ertapenem was non-inferior to piperacillin-tazobactam for complicated intra-abdominal infection. Helped establish ertapenem as the once-daily, non-pseudomonal carbapenem option for community-acquired cIAI.", sourceIds: ["solomkin-2003-ertapenem-piptazo"] },
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
        durationGuidance: {
          standard: "4–7 days",
          stewardshipNote: "SIS/IDSA 2017: Limit to 4 days if source control achieved. Extended duration not supported.",
        },
        empiricTherapy: [
          {
            line: "First-Line — Mild-Moderate cIAI (APACHE <15, No MDR Risk)",
            options: [
              { drug: "ctx-metro-ciai", regimen: "Ceftriaxone 2g IV daily + Metronidazole 500mg IV q8h", notes: "IDSA 2010 recommended combination. Ceftriaxone covers enteric gram-negatives; metronidazole covers anaerobes (particularly B. fragilis). Simple, well-tolerated, once-daily ceftriaxone component. NO Pseudomonal or Enterococcal coverage — appropriate for community-acquired, mild-moderate cIAI. Duration: 4 days post source control (STOP-IT).", evidence: "A-I", evidenceSource: "SIS/IDSA 2017" },
              { drug: "ertapenem-ciai", regimen: "Ertapenem 1g IV once daily", notes: "IDSA 2010 first-line single-agent option for mild-moderate cIAI. Covers Enterobacterales + anaerobes + Streptococci + MSSA in one drug. Once-daily = excellent for OPAT. Equivalent to pip-tazo in multiple RCTs. GAPS: no Pseudomonas, no Enterococcus, no MRSA. The narrowest carbapenem — minimal Pseudomonal selection pressure compared to meropenem.", evidence: "A-I", evidenceSource: "SIS/IDSA 2017" },
              { drug: "amp-sulb-ciai", regimen: "Ampicillin-sulbactam 3g IV q6h", notes: "IDSA 2010 recommended for mild-moderate cIAI. Covers Enterobacterales + anaerobes + Enterococcus + Streptococci. UNIQUE ADVANTAGE: the only first-line cIAI regimen with intrinsic Enterococcal coverage. Good choice for biliary-origin cIAI. LIMITATION: rising E. coli resistance (20-30% in many regions) — check local antibiogram. Not reliable for Pseudomonas.", evidence: "B-II", evidenceSource: "SIS/IDSA 2017" },
            ],
          },
          {
            line: "First-Line — High-Risk/Severe cIAI (APACHE >=15 or MDR Risk Factors)",
            options: [
              { drug: "pip-tazo-ciai", regimen: "Pip-tazo 4.5g IV q6h (extended infusion over 4h)", notes: "IDSA 2010 first-line for high-risk/severe community-acquired cIAI. Broadest non-carbapenem single-agent option: covers Enterobacterales, Pseudomonas, anaerobes, Enterococcus (faecalis), Streptococci, MSSA. Extended infusion optimizes PK for sicker patients. Duration: 4 days post source control (STOP-IT).", evidence: "A-I", evidenceSource: "SIS/IDSA 2017" },
              { drug: "meropenem-ciai", regimen: "Meropenem 1g IV q8h (extended infusion over 3h)", notes: "Reserve for: APACHE >=15, ESBL risk, prior resistant organisms, failed initial therapy. Broadest coverage. Always de-escalate based on cultures (within 48-72h). Meropenem should NOT be first-line for mild-moderate community-acquired IAI — this is carbapenem overuse and drives CRE.", evidence: "B-II", evidenceSource: "SIS/IDSA 2017" },
              { drug: "cefepime-metro-ciai", regimen: "Cefepime 2g IV q8h + Metronidazole 500mg IV q8h", notes: "Alternative for severe cIAI with Pseudomonal concern. Cefepime provides anti-pseudomonal and AmpC-stable gram-negative coverage; metronidazole adds anaerobes. No inherent Enterococcal coverage. Consider adding ampicillin if biliary source or Enterococcal risk.", evidence: "B-II", evidenceSource: "SIS/IDSA 2017" },
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
        durationGuidance: {
          standard: "4–7 days after adequate source control",
          severe: "7–14 days (no adequate source control)",
          stewardshipNote: "Duration driven by source control adequacy, not by severity. STOP trial supports 4-day courses.",
        },
        empiricTherapy: [
          {
            line: "Empiric — Post-Operative / Healthcare-Associated cIAI",
            options: [
              { drug: "pip-tazo-ha-iai", regimen: "Pip-tazo 4.5g IV q6h (extended infusion) + Vancomycin IV", notes: "Standard empiric regimen for healthcare-associated IAI. Pip-tazo covers Pseudomonas, Enterobacterales, anaerobes, Enterococcus faecalis. Add vancomycin for VRE (E. faecium) and MRSA coverage in high-risk patients. De-escalate aggressively at 48-72h based on cultures.", evidence: "A-I", evidenceSource: "SIS/IDSA 2017" },
              { drug: "meropenem-ha-iai", regimen: "Meropenem 1g IV q8h (extended infusion) + Vancomycin IV", notes: "For patients with ESBL risk, prior resistant organisms, or severe sepsis/septic shock. Meropenem covers ESBL, AmpC, Pseudomonas, anaerobes. Vancomycin for VRE/MRSA. THIS is the appropriate use of meropenem — healthcare-associated cIAI with MDR risk, not routine community-acquired IAI.", evidence: "A-I", evidenceSource: "SIS/IDSA 2017" },
              { drug: "cefepime-metro-ha", regimen: "Cefepime 2g IV q8h (extended infusion) + Metronidazole 500mg IV q8h + Vancomycin IV", notes: "Alternative triple therapy. Cefepime for anti-pseudomonal + AmpC stability; metronidazole for anaerobes; vancomycin for VRE/MRSA. More components but allows carbapenem-sparing approach when ESBL risk is not high.", evidence: "B-II", evidenceSource: "SIS/IDSA 2017" },
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
};

const IAI_WORKFLOW_ENHANCEMENTS: Record<string, Partial<Subcategory>> = {
  "ca-iai-uncomplicated": {
    diagnosticWorkup: ready("Differentiate confined-organ infection from true complicated IAI and capture any recent antibiotics or resistant-organism history before empiric therapy."),
    severitySignals: ready("Peritonitis, sepsis physiology, hypotension, or inability to control the source quickly means this is no longer an uncomplicated pathway."),
    mdroRiskFactors: ready("Recent healthcare exposure, prior ESBL history, and prolonged pre-hospital antibiotics are the main reasons to broaden beyond routine community regimens."),
    sourceControl: ready("Source control remains the defining intervention even in 'uncomplicated' cases: appendectomy, cholecystectomy, or drainage decisions drive antibiotic success."),
    deEscalation: ready("Once the source is controlled, narrow rapidly and avoid prolonged post-operative antibiotics when contamination never became true cIAI."),
    ivToPoPlan: ready("Use PO completion only after GI function returns, source control is complete, and the clinical course truly supports ongoing antibiotics."),
    failureEscalation: ready("Lack of response should trigger source-control review first, not automatic escalation to a broader carbapenem."),
    consultTriggers: ready("Surgical input is essential whenever the diagnosis or adequacy of source control is uncertain."),
    durationAnchor: ready("Tie duration to the time source control becomes adequate; many uncomplicated sources need very little or no post-control antibiotics."),
  },
  "ca-iai-complicated": {
    diagnosticWorkup: ready("Get cultures when operative or drain specimens will be available, assess severity early, and image for perforation, abscess, or diffuse peritonitis."),
    severitySignals: ready("Shock, diffuse peritonitis, rising lactate, or inability to achieve rapid source control marks a higher-mortality cIAI course."),
    mdroRiskFactors: ready("Recent hospitalization, prior ESBL infection, repeated abdominal procedures, or prolonged antibiotic exposure are the main reasons to broaden empiric coverage."),
    sourceControl: ready("Drainage, resection, or definitive operative control is the main treatment milestone; antibiotics do not rescue uncontrolled contamination."),
    deEscalation: ready("Once source control is achieved and cultures result, narrow aggressively and stop unnecessary enterococcal, anti-pseudomonal, or antifungal coverage."),
    ivToPoPlan: ready("Transition to PO only after source control is secure, ileus is resolving, and the chosen oral regimen clearly covers the recovered organisms."),
    failureEscalation: ready("Persistent fever or ileus should trigger repeat imaging and source-control reassessment before simply extending therapy."),
    consultTriggers: ready("Early surgery plus ID is high-yield when resistant organisms, persistent bacteremia, or tertiary peritonitis features appear."),
    durationAnchor: ready("STOP-IT logic applies: count from adequate source control and avoid continuing therapy simply because labs have not normalized completely."),
  },
  "ha-iai": {
    diagnosticWorkup: ready("Capture operative history, recent antibiotics, drain output, prior resistant organisms, and repeat imaging early because post-operative leaks behave differently from community IAI."),
    severitySignals: ready("Shock, anastomotic leak, fungemia concern, or recurrent abscess after prior source control should trigger ICU-level urgency."),
    mdroRiskFactors: ready("Prior broad-spectrum exposure, prolonged hospitalization, prior ESBL or Pseudomonas, and recent abdominal surgery are the key empiric resistance gates."),
    sourceControl: ready("Leak control, drain revision, washout, or re-operation is often the decisive intervention in healthcare-associated IAI."),
    deEscalation: ready("At 48-72 hours, use culture results to remove redundant anti-pseudomonal, anti-enterococcal, and empiric antifungal therapy whenever the anatomy and microbiology allow."),
    ivToPoPlan: ready("Oral completion is uncommon until the leak is controlled and GI function is reliable; do not force early PO in a still-unstable postoperative abdomen."),
    failureEscalation: ready("Failure means persistent leak, wrong source, drain malfunction, or resistant pathogen until proven otherwise."),
    consultTriggers: ready("Surgery is mandatory, and ID input is strongly favored when MDR gram-negatives, Candida, or prolonged open-abdomen courses are involved."),
    durationAnchor: ready("Count from the moment adequate post-operative source control is re-established, not from the first ineffective empiric dose."),
  },
  "biliary-iai": {
    diagnosticWorkup: ready("Grade severity, obtain cultures when biliary drainage is planned, and define whether cholangitis or complicated cholecystitis is the active syndrome."),
    severitySignals: ready("Hypotension, altered mentation, rising bilirubin/lactate, or organ dysfunction should trigger urgent drainage planning under the Tokyo severity framework."),
    mdroRiskFactors: ready("Prior ERCP/stenting, recent antibiotics, prior biliary isolates, and repeated healthcare exposure are the main reasons to expand empiric breadth."),
    sourceControl: ready("ERCP, cholecystostomy, or surgery is the antibiotic partner that changes outcomes in biliary infection."),
    deEscalation: ready("After drainage and cultures, simplify quickly and avoid leaving anti-pseudomonal or enterococcal coverage in place just because the patient presented sick."),
    ivToPoPlan: ready("Switch to PO once drainage is successful, bilirubin and fever are improving, and a susceptible oral option is available."),
    failureEscalation: ready("Persistent cholestasis or fever should prompt repeat imaging and drain patency review rather than automatic regimen escalation."),
    consultTriggers: ready("GI/interventional and surgery involvement is often the main time-sensitive decision; ID helps when resistant organisms or candidal concerns appear."),
    durationAnchor: ready("Count from successful drainage plus the first active regimen; drainage timing matters more than the calendar day of admission."),
  },
};

const IAI_MICROBIOLOGY_ENHANCEMENTS: Record<string, Partial<Subcategory>> = {
  "ha-iai": {
    rapidDiagnostics: [
      {
        trigger: "Operative or drain cultures show ESBL-producing Enterobacterales or prior cultures suggest them",
        action: "Move from cefepime- or pip-tazo-based therapy to meropenem when the isolate history or current microbiology makes those agents unreliable.",
        rationale: "Postoperative and healthcare-associated IAI fails most often from resistant gram-negatives plus inadequate source control.",
      },
      {
        trigger: "Candida grows from blood or from a normally sterile abdominal specimen in a high-risk postoperative patient",
        action: "Add antifungal therapy while reassessing drainage adequacy and ongoing leak control.",
        rationale: "Yeast in a sterile abdominal context can represent a true intra-abdominal candidiasis signal, unlike routine surface colonization.",
      },
    ],
    breakpointNotes: [
      {
        marker: "Anaerobe coverage",
        interpretation: "Cefepime or ceftriaxone without metronidazole leaves a major gap in intra-abdominal source control regimens.",
        action: "Do not let a gram-negative susceptibility report obscure the anaerobic part of the syndrome.",
      },
      {
        marker: "Culture finalization after source control",
        interpretation: "Once operative cultures are known and source control is adequate, prolonged 'just in case' double coverage is usually not justified.",
        action: "Use the culture set to simplify quickly instead of finishing the original broadest regimen.",
      },
    ],
    intrinsicResistance: [
      {
        organism: "Enterococcus species",
        resistance: "Cephalosporins are intrinsically inactive against Enterococcus.",
        implication: "If biliary infection, postoperative infection, or immunocompromise makes Enterococcus credible, choose a regimen that actually covers it.",
      },
      {
        organism: "Pseudomonas aeruginosa",
        resistance: "Ertapenem is not an antipseudomonal carbapenem.",
        implication: "Reserve ertapenem for community-type IAI patterns rather than hospital-acquired or postoperative leaks with pseudomonal risk.",
      },
    ],
    coverageMatrix: [
      {
        label: "Mixed Enterobacterales plus anaerobes",
        status: "preferred",
        detail: "Pip-tazo or cefepime plus metronidazole remain core empiric options when resistance risk is moderate and source control is in progress.",
      },
      {
        label: "ESBL-heavy healthcare IAI",
        status: "conditional",
        detail: "Meropenem is the cleaner definitive anchor once resistant Enterobacterales are identified or strongly suspected.",
      },
      {
        label: "Enterococcus-prone biliary or postoperative infection",
        status: "conditional",
        detail: "Use amp-sulbactam, pip-tazo, or another enterococcal-active strategy when the syndrome truly warrants it.",
      },
      {
        label: "Empiric Candida coverage in routine community IAI",
        status: "avoid",
        detail: "Do not add antifungals routinely unless the host and microbiology context make invasive candidiasis plausible.",
      },
    ],
  },
};

export const IAI: DiseaseState = enhanceDiseaseEmpiricOptions(
  enhanceDisease(
    IAI_BASE,
    mergeEnhancementMaps(IAI_WORKFLOW_ENHANCEMENTS, IAI_MICROBIOLOGY_ENHANCEMENTS),
    IAI_MONOGRAPH_ENHANCEMENTS,
  ),
  getEmpiricOptionEnhancementsForDisease("iai"),
);
