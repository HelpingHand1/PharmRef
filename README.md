# PharmRef

PharmRef is a TypeScript + React + Vite clinical reference app for antimicrobial decision support. It organizes syndrome-level guidance, organism-specific therapy, and drug monographs into a single PWA-style interface optimized for point-of-care browsing.

## Current state (v2.3.0)

- 15 disease states
- 61 subcategories
- 43 unique drug monographs
- React 18 + Vite 7 + TypeScript 5
- PWA build via `vite-plugin-pwa`
- Static disease-content modules under `src/data/*.ts`
- Structured disease-level review metadata and source tracking
- Build-time content validation via `npm run validate:content`

### Included disease states

1. Urinary Tract Infections
2. Community-Acquired Pneumonia
3. Hospital-Acquired & Ventilator-Associated Pneumonia
4. Skin & Soft Tissue Infections
5. Intra-Abdominal Infections
6. AMR Gram-Negative Infections
7. Bacteremia & Endocarditis
8. Clostridioides difficile Infection
9. Bone & Joint Infections
10. CNS Infections
11. Fungal Infections
12. Advanced Agents (Ceftazidime-Avibactam, Ceftolozane-Tazobactam, Imipenem-Cilastatin-Relebactam, Meropenem-Vaborbactam, Cefiderocol)
13. Febrile Neutropenia
14. Diabetic Foot Infections
15. Sepsis & Septic Shock

## What the app does

- Hash-based navigation for bookmarkable disease, subcategory, monograph, compare, and audit views
- Scored, ranked full-text search with relevance tiers (exact name → starts-with → contains → class/brand → spectrum/MOA → pearls → notes), filter tabs by content type, show-more/less per section, and match highlighting
- Drug class browser on the home screen — 14 named class groups + Other, with a filter pill row
- Organism search cards show disease › subcategory breadcrumb and a preferred-treatment preview line
- Share button (🔗) on every monograph and subcategory hero — copies the current URL to clipboard
- Bookmark button (🔖) on monographs and disease states, persisted in localStorage
- Compare view for side-by-side drug monographs
- Patient context panel (weight, sex, age) with inline CrCl, IBW, and AdjBW calculations
- Six clinical calculators: CrCl (Cockcroft-Gault), IBW/AdjBW, CURB-65, PORT/PSI, Vancomycin AUC, Aminoglycoside dosing
- Allergy profile with inline allergy/interaction warnings across all therapy views
- Data audit screen for content completeness and cross-reference gaps
- Reading mode, three themes (dark / light / OLED), toast feedback, copy buttons, and back-to-top
- Recent-views strip on the home screen for faster return navigation
- Cross-disease monograph badges when the same drug appears in multiple disease states
- ESC key closes allergy and patient modals
- Responsive layout and print-friendly styles

## Project structure

```text
.
├── src/
│   ├── App.tsx
│   ├── index.tsx
│   ├── types.ts
│   ├── components/
│   │   ├── AllergyModal.tsx
│   │   ├── AllergyWarning.tsx
│   │   ├── AuditView.tsx
│   │   ├── CompareView.tsx
│   │   ├── CopyBtn.tsx
│   │   ├── CrossRefBadges.tsx
│   │   ├── DisclaimerModal.tsx
│   │   ├── EmpiricTierView.tsx
│   │   ├── ExpandCollapseBar.tsx
│   │   ├── Layout.tsx
│   │   ├── PatientModal.tsx
│   │   ├── Section.tsx
│   │   ├── Toast.tsx
│   │   └── index.ts
│   ├── data/
│   │   ├── index.ts
│   │   ├── metadata.ts              ← review metadata + source tracking
│   │   ├── derived.ts               ← search index, lookup maps, class grouping
│   │   ├── advanced-agents.ts
│   │   ├── amr-gram-negative.ts
│   │   ├── bacteremia-endocarditis.ts
│   │   ├── bone-joint.ts
│   │   ├── c-difficile.ts
│   │   ├── cap.ts
│   │   ├── cns-infections.ts
│   │   ├── diabetic-foot.ts
│   │   ├── febrile-neutropenia.ts
│   │   ├── fungal-infections.ts
│   │   ├── hap-vap.ts
│   │   ├── iai.ts
│   │   ├── sepsis.ts
│   │   ├── ssti.ts
│   │   └── uti.ts
│   ├── hooks/
│   │   ├── useNavigation.ts
│   │   ├── usePersistedState.ts
│   │   └── useSearch.ts
│   ├── pages/
│   │   ├── CalculatorsPage.tsx
│   │   ├── DiseaseOverviewPage.tsx
│   │   ├── HomePage.tsx
│   │   ├── MonographPage.tsx
│   │   ├── SearchResultsPage.tsx
│   │   └── SubcategoryPage.tsx
│   └── styles/
│       └── constants.ts             ← makeStyles(), theme tokens, NAV_STATES
├── scripts/
│   └── validate-content.ts          ← build-time content validation
├── tsconfig.validation.json         ← compile-only config for validation script
├── vite.config.js
├── tsconfig.json
└── package.json
```

## Commands

```bash
npm run dev          # local dev server (also accessible on LAN for phone testing)
npm run build        # production build
npm run preview      # serve production build
npm run typecheck    # tsc --noEmit
npm run validate:content
```

## Adding a new disease state

1. Create `src/data/<disease>.ts` exporting one `DiseaseState` (annotate `: DiseaseState` explicitly to catch schema errors early).
2. Import it in `src/data/index.ts` and add it to `DISEASE_STATES`.
3. Run `npm run typecheck` and `npm run build`.

### Content expectations

Each disease module is expected to include:

- Overview definition, epidemiology, risk factors
- Key guidelines and landmark trials
- Subcategories with diagnostics and clinical presentation where relevant
- Empiric therapy tiers (`empiricTherapy`) with `line` / `options[].regimen` structure
- Organism-specific therapy (`organismSpecific`) where applicable
- Pharmacist pearls
- Drug monographs at the top-level `drugMonographs` array (not nested inside subcategories)

### Data schema notes

- `empiricTherapy[].line` — tier label (e.g. "First-line")
- `empiricTherapy[].options[].regimen` — regimen string
- `spectrum`, `renalAdjustment`, `monitoring`, `pregnancyLactation` — all plain strings
- `drugInteractions`, `pharmacistPearls` — string arrays
- `drugMonographs: []` is valid when a disease has no standalone monographs

## Scaling notes

What is already in place:

- Centralized schema in `src/types.ts`
- Data modules isolated by disease state
- Precomputed lookup/search structures in `src/data/derived.ts`
- Relevance-scored search engine in `src/hooks/useSearch.ts`
- Separate Vite build chunks for app code (`vendor`) and disease data (`disease-data`)

Likely next steps when the catalog grows further:

1. Split disease metadata from full disease content so the home screen loads without eagerly pulling every monograph.
2. Move search indexing into a background worker or prebuilt JSON index if search latency becomes noticeable.
3. Introduce content validation scripts for duplicate IDs, missing required sections, and cross-link integrity outside the UI audit screen.
4. Consider route-level or disease-level lazy loading if the data chunk exceeds ~1.5 MB gzipped.
5. Expand review metadata from disease-level inheritance to subcategory- and monograph-specific provenance where it materially changes recommendations.

## Verification

```bash
npm run typecheck   # zero errors expected
npm run validate:content
npm run build       # clean build, disease-data chunk ~870 KB raw / ~284 KB gzip
```
