# PharmRef

PharmRef is a TypeScript + React + Vite clinical pharmacy reference app. It organizes topic-level guidance, care pathways, pathogen references, and drug monographs into a single PWA-style interface optimized for point-of-care browsing.

## Current state (v2.4.0)

- 16 clinical topics
- 68 care pathways
- 43 unique drug monographs
- 9 pathogen reference pages
- React 18 + Vite 7 + TypeScript 5
- PWA build via `vite-plugin-pwa`
- Authored topic content under `src/data/*.ts`, compiled into generated runtime modules under `src/data/generated/`
- Structured review metadata, source registry, and content-approval fingerprints
- Build-time content validation via `npm run validate:content`

### Content currency

The catalog was last fully reviewed on April 5, 2026. On November 3, 2026, the topics below were updated to newer guidance and signed off by a pharmacist (see [Content pipeline](docs/content-pipeline.md)):

| Topic | Now based on |
| --- | --- |
| Sepsis & Septic Shock | Surviving Sepsis Campaign 2026 |
| Community-Acquired Pneumonia | ATS 2025 CAP guideline update (with ATS/IDSA 2019) |
| AMR Gram-Negative Infections, Advanced Agents | IDSA 2026 AMR guidance |
| Bacteremia & Endocarditis | AHA 2026 IE scientific statement, IDSA/ESCMID 2026 SAB consensus, ESC 2023 |
| Urinary Tract Infections | IDSA 2025 cUTI + 2024–2026 FDA approvals (pivmecillinam, gepotidacin, sulopenem, cefepime-zidebactam, tebipenem) |
| Fungal Infections | ECMM/ISHAM/ASM 2025 global candidiasis guideline (with IDSA 2016) |
| C. difficile Infection | IDSA/SHEA 2021; bezlotoxumab flagged as discontinued |

### Included clinical topics

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
12. Advanced Agents (resistant gram-negative, antifungal, and reserve agents)
13. Febrile Neutropenia
14. Diabetic Foot Infections
15. Type 2 Diabetes Mellitus
16. Sepsis & Septic Shock

## What the app does

- Hash-based navigation for bookmarkable topic, pathway, monograph, pathogen, compare, breakpoint, calculator, and audit views
- Scored, ranked full-text search with relevance tiers, shorthand aliases (e.g. `CAP`, `CAUTI`, `SAB`, `CRE`), filter tabs by content type, and match highlighting
- Command palette for fast keyboard navigation
- Drug class browser and recent-views strip on the home screen
- Pathogen reference pages with rapid-diagnostic interpretation, resistance mechanisms, and breakpoint caveats
- Breakpoint workspace that turns susceptibility results into therapy findings and cautions
- Patient context panel (weight, height, sex, age, SCr, dialysis, pregnancy) with inline CrCl, IBW, and AdjBW, plus patient-aware regimen warnings and transition-readiness guidance
- 11 clinical calculators: CrCl (Cockcroft-Gault), IBW/AdjBW/BSA, CURB-65, PORT/PSI, vancomycin AUC estimator, aminoglycoside (Hartford) dosing, extended-infusion beta-lactam, daptomycin mg/kg, TMP-SMX TMP-based dosing, colistin unit conversion, azole TDM support
- Allergy profile with inline allergy and interaction warnings across therapy views
- Evidence and freshness badges, source pills with direct links, and trust-surface banners for stale or disputed content
- Institution antibiogram cards when institution profile data is available
- Compare view for side-by-side drug monographs, bookmarks, and share links
- Data audit screen for content completeness and cross-reference gaps
- Reading mode, three themes (dark / light / OLED), print-friendly styles, and offline use as an installed PWA

## Project structure

```text
.
├── src/
│   ├── App.tsx, index.tsx, types.ts, version.ts
│   ├── components/          ← UI building blocks (modals, evidence pills, warnings, palette, …)
│   ├── pages/               ← Home, disease overview, pathway, monograph, pathogen, breakpoints, calculators, search
│   ├── hooks/               ← navigation, search, bookmarks, recent views, patient context
│   ├── utils/               ← calculators, decision support, susceptibility workspace, persistence
│   ├── styles/constants.ts  ← makeStyles(), theme tokens
│   └── data/
│       ├── <topic>.ts       ← authored clinical content (one module per topic)
│       ├── editorial/content-meta.ts  ← review metadata source of truth
│       ├── source-registry.ts         ← canonical citations (PMID / DOI / URL)
│       ├── content-approvals.ts       ← generated approval fingerprints
│       ├── catalog-manifest.ts        ← generated home-screen catalog
│       └── generated/       ← generated runtime disease modules and regimen catalog
├── scripts/                 ← generation, validation, approval, release verification
│   └── tests/               ← node:test regression suite
├── docs/                    ← content pipeline, ship checklists, use-at-work guide
└── .github/workflows/deploy-pages.yml
```

## Commands

```bash
npm run dev               # local dev server (also accessible on LAN for phone testing)
npm run typecheck         # tsc --noEmit
npm run test:regression   # regenerate content and run the regression suite
npm run validate:content  # metadata, schema, provenance, and approval checks
npm run approve:content   # refresh approval fingerprints after clinical review
npm run build             # generate catalog, validate content, production build
npm run release:check     # full release gate
npm run preview           # serve the production build
```

## Editing clinical content

See [docs/content-pipeline.md](docs/content-pipeline.md) for the full workflow. In short:

1. Edit topic content in `src/data/<topic>.ts` and review metadata in `src/data/editorial/content-meta.ts`.
2. Cite sources by ID; every ID must exist in `src/data/source-registry.ts` with a PMID, DOI, or direct URL.
3. Review the clinical changes, then run `npm run approve:content` to record the approved body versions.
4. Run `npm run test:regression` and `npm run release:check` before shipping.

Do not hand-edit generated files (`src/data/generated/`, `generated-content-meta.ts`, `catalog-manifest.ts`, `content-approvals.ts`).

## Adding a new clinical topic

1. Create `src/data/<topic>.ts` exporting one `DiseaseState` (annotate `: DiseaseState` to catch schema errors early).
2. Register it in `scripts/disease-module-config.js` so a generated module is produced, then import the generated module in `src/data/index.ts` and add a lazy loader in `src/data/catalog-loader.ts`.
3. Add disease and priority-pathway metadata in `src/data/editorial/content-meta.ts`.
4. Run `npm run approve:content`, then `npm run test:regression` (catalog count assertions in `scripts/tests/catalogIntegrity.test.js` will need updating).

## Verification

```bash
npm run release:check   # typecheck, regression tests, validation, build, release verification
```

Expected: `Content validation: 16 diseases, 0 error(s), 0 warning(s)` and a clean build with per-topic lazy-loaded chunks.
