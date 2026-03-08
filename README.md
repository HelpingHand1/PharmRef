# PharmRef

PharmRef is a TypeScript + React + Vite clinical reference app for antimicrobial decision support. It organizes syndrome-level guidance, organism-specific therapy, and drug monographs into a single PWA-style interface optimized for point-of-care browsing.

## Current state

- 11 disease states
- 49 subcategories
- 35 unique drug monographs
- React 18 + Vite 7 + TypeScript 5
- PWA build via `vite-plugin-pwa`
- Static disease-content modules under `src/data/*.ts`

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

## What the app does

- Hash-based navigation for bookmarkable disease, subcategory, monograph, compare, and audit views
- Full-text search across disease names, definitions, empiric therapy, organism notes, interactions, and pharmacist pearls
- Compare view for side-by-side drug monographs
- Allergy profile with inline allergy/interaction warnings
- Data audit screen for content completeness and cross-reference gaps
- Reading mode, theme toggle, toast feedback, copy buttons, and back-to-top behavior
- Recent-views strip on the home screen for faster return navigation
- Cross-disease monograph badges when the same drug appears in multiple disease states
- Responsive layout and print-friendly styles

## Recent QoL and optimization work

- Added package scripts: `dev`, `build`, `preview`, `typecheck`
- Switched search rendering to deferred input handling so typing stays responsive as the dataset grows
- Added capped search previews to avoid rendering huge result sets at once
- Added O(1) disease, subcategory, and monograph lookup maps instead of repeated linear scans
- Added persisted recent views to reduce navigation friction in a larger catalog
- Split Vite output into `vendor` and `disease-data` chunks for better caching as content grows

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
│   │   ├── Section.tsx
│   │   ├── Toast.tsx
│   │   └── index.ts
│   ├── data/
│   │   ├── index.ts
│   │   ├── amr-gram-negative.ts
│   │   ├── bacteremia-endocarditis.ts
│   │   ├── bone-joint.ts
│   │   ├── c-difficile.ts
│   │   ├── cap.ts
│   │   ├── cns-infections.ts
│   │   ├── fungal-infections.ts
│   │   ├── hap-vap.ts
│   │   ├── iai.ts
│   │   ├── ssti.ts
│   │   └── uti.ts
│   ├── styles/
│   │   └── constants.ts
│   └── utils/
│       └── persistence.ts
├── pharmref.jsx
├── vite.config.js
├── tsconfig.json
└── package.json
```

## Commands

```bash
npm run dev
npm run build
npm run preview
npm run typecheck
```

## Adding a new disease state

1. Create a new `src/data/<disease>.ts` file that exports one `DiseaseState`.
2. Import it in `src/data/index.ts`.
3. Add it to the `DISEASE_STATES` array.
4. Confirm `npm run typecheck` and `npm run build` still pass.

### Content expectations

Each disease module is expected to include:

- Overview definition, epidemiology, risk factors
- Key guidelines and landmark trials
- Subcategories with diagnostics and clinical presentation where relevant
- Empiric therapy tiers with regimen-level detail
- Organism-specific therapy where applicable
- Pharmacist pearls
- Drug monographs with dosing, renal/hepatic notes, adverse effects, monitoring, pregnancy/lactation, and interactions

## Scaling notes for 30+ disease states

The current structure will support 30+ disease states, but the pressure points are content volume and bundle size, not React component complexity.

What is already in place:

- Centralized schema in `src/types.ts`
- Data modules isolated by disease state
- Precomputed lookup/search structures in `src/App.tsx`
- Separate build chunks for app code and disease data

Likely next steps when the catalog grows further:

1. Split disease metadata from full disease content so the home screen can load without eagerly loading every monograph.
2. Move search indexing into a background worker or prebuilt JSON index if search latency becomes noticeable.
3. Introduce content validation scripts for duplicate IDs, missing required sections, and cross-link integrity outside the UI audit screen.
4. Consider route-level or disease-level lazy loading if the data chunk becomes too large for initial load.

## Verification

Current expected checks:

- `npm run typecheck`
- `npm run build`
