# PharmRef — Pharmacist Clinical Reference Application

## Overview
Single-page React application for rapid clinical decision support at the point of care. Organized by disease state with deep-linked drug monographs, cross-disease badges, and full-text search.

## Current Content
| Disease State | Subcategories | Drug Monographs |
|---|---|---|
| Urinary Tract Infections | 5 | Nitrofurantoin, TMP-SMX, Ciprofloxacin, Ceftriaxone, Pip-Tazo, Meropenem |
| Community-Acquired Pneumonia | 4 | Amoxicillin, Azithromycin, Doxycycline, Levofloxacin |
| HAP/VAP | 4 | Cefepime, Vancomycin, Linezolid |
| Skin & Soft Tissue Infections | 4 | Cefazolin, Clindamycin, Daptomycin |
| Intra-Abdominal Infections | 4 | Metronidazole, Ampicillin-Sulbactam, Ertapenem |
| AMR Gram-Negative (IDSA 2024) | 6 | Ceftazidime-Avibactam, Meropenem-Vaborbactam, Cefiderocol |
| Bacteremia & Endocarditis | 5 | Nafcillin, Vancomycin, Daptomycin, Ceftriaxone, Cefazolin |
| C. difficile Infection | 6 | Fidaxomicin, Vancomycin (Oral), Bezlotoxumab, Metronidazole |
| Bone & Joint Infections | 4 | Rifampin, Linezolid |
| CNS Infections | 3 | Ampicillin, Meropenem |

**Totals:** 10 disease states · 45 subcategories · 37 unique drug monographs

## File Structure
```
pharmref/
├── src/
│   ├── index.jsx              # Entry point
│   ├── App.jsx                # UI components, state, navigation, rendering
│   │
│   ├── data/
│   │   ├── index.js           # Aggregates all disease states into DISEASE_STATES[]
│   │   ├── uti.js
│   │   ├── cap.js
│   │   ├── hap-vap.js
│   │   ├── ssti.js
│   │   ├── iai.js
│   │   ├── amr-gram-negative.js
│   │   ├── bacteremia-endocarditis.js
│   │   ├── c-difficile.js
│   │   ├── bone-joint.js
│   │   └── cns-infections.js
│   │
│   └── styles/
│       └── constants.js       # NAV_STATES, S (style object), TAG_COLORS, helpers
│
├── pharmref.jsx               # Single-file artifact version (paste into Claude UI)
├── package.json
└── README.md
```

## UI Features
- **URL hash navigation** — browser back/forward buttons work, bookmarkable views
- **Deep search** — indexes drug names, organisms, pearls, empiric therapy, interactions, MOA
- **Search debouncing** — 150ms debounce for smooth performance across 10 disease states
- **Pre-built search index** — module-level index for instant results
- **Keyboard shortcuts** — `/` focuses search, `Esc` clears/blurs
- **Section quick-nav bar** — clickable section jump pills on subcategory/monograph views
- **Cross-disease monograph badges** — click to navigate between disease states
- **Smooth expand/collapse** — CSS transitions for section animations
- **Expand/collapse all** toggle per view
- **Back-to-top button** (appears >400px scroll)
- **Empty section suppression** (detects "N/A" prefix)
- **Adaptive section titles** (prevention/stewardship → "Interventions & Protocols")
- **Mobile responsive** — grid/padding/font adjustments for phone-at-bedside use
- **Print-friendly styles** — `@media print` hides nav, expands all sections
- **CSS hover/focus states** — custom scrollbar, focus-visible rings, card interactions
- **Home page grid layout** — 2-column responsive grid for disease state cards

## Cross-Disease Drug Badges
These drugs appear in multiple disease states and auto-link:
- Vancomycin: HAP-VAP ↔ Bacteremia
- Cefazolin: SSTI ↔ Bacteremia
- Daptomycin: SSTI ↔ Bacteremia
- Ceftriaxone: UTI ↔ Bacteremia
- Metronidazole: IAI ↔ CDI ↔ CNS
- Linezolid: HAP-VAP ↔ Bone/Joint
- Meropenem: HAP-VAP ↔ CNS

## How to Add a Disease State
1. Create `src/data/your-disease.js` — export a single object matching the schema
2. Add one import + one array entry in `src/data/index.js`
3. Done. No other files need to change.

## Key Clinical References
- IDSA/ATS CAP Guidelines (2019)
- IDSA HAP/VAP Guidelines (2016)
- IDSA SSTI Guidelines (2014)
- SIS/IDSA IAI Guidelines (2010, updated 2017)
- IDSA 2024 AMR Gram-Negative Guidance v4.0
- AHA/ACC 2023 IE Guideline Update
- IDSA/SHEA 2021 CDI Guidelines
- IDSA 2015 Vertebral Osteomyelitis Guidelines
- IDSA 2013 Prosthetic Joint Infection Guidelines
- IDSA 2004 Bacterial Meningitis Guidelines
- OVIVA Trial (Li et al., NEJM 2019)
- POET Trial (Iversen et al., NEJM 2019)
- MERINO Trial (Harris et al., JAMA 2018)