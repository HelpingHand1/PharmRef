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

**Totals:** 6 disease states · 27 subcategories · 24 unique drug monographs

## File Structure
```
pharmref/
├── src/
│   ├── index.jsx              # Entry point
│   ├── App.jsx                # UI components, state, rendering (~570 lines)
│   │
│   ├── data/
│   │   ├── index.js           # Aggregates all disease states into DISEASE_STATES[]
│   │   ├── uti.js             # Urinary Tract Infections
│   │   ├── cap.js             # Community-Acquired Pneumonia
│   │   ├── hap-vap.js         # Hospital/Ventilator-Acquired Pneumonia
│   │   ├── ssti.js            # Skin & Soft Tissue Infections
│   │   ├── iai.js             # Intra-Abdominal Infections
│   │   └── amr-gram-negative.js  # IDSA 2024 AMR Gram-Negative Guidance
│   │
│   └── styles/
│       └── constants.js       # NAV_STATES, S (style object), TAG_COLORS, helpers
│
├── pharmref.jsx               # Single-file artifact version (paste into Claude UI)
├── package.json
└── README.md
```

## How to Add a Disease State
1. Create `src/data/your-disease.js` — export a single object matching the schema
2. Add one import + one array entry in `src/data/index.js`
3. Done. No other files need to change.

## How to Add a Drug Monograph
Add it to the `drugMonographs` array in the relevant disease state file. Cross-disease badges are computed automatically — if the same `id` appears in multiple disease states, the UI shows badges linking them.

## How to Fact-Check
Open the individual data file (e.g., `amr-gram-negative.js`). All clinical content is isolated from UI code. Each disease state file is self-contained and reviewable independently.

## Single-File Artifact
`pharmref.jsx` in the project root is the combined single-file version for testing in the Claude artifact viewer. It should be regenerated when data or UI changes are made.

## Key Clinical References
- IDSA/ATS CAP Guidelines (2019)
- IDSA HAP/VAP Guidelines (2016)
- IDSA SSTI Guidelines (2014)
- SIS/IDSA IAI Guidelines (2010, updated 2017)
- **IDSA 2024 AMR Gram-Negative Guidance v4.0** (Tamma et al., CID 2024)
- MERINO Trial (Harris et al., JAMA 2018)
- IDSA UTI Guidelines (2011) + AUA Recurrent UTI (2019)