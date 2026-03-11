# Content Pipeline

PharmRef now separates editorial metadata from runtime assembly.

## Source of truth

- Editorial metadata lives in `src/data/editorial/content-meta.ts`.
- This file is where disease, pathway, and monograph review metadata should be edited.
- Every explicit metadata record must carry structured `reviewHistory`, not just a review date.
- Structured source IDs in editorial metadata must exist in `src/data/source-registry.ts`.
- The current generated disease-content slice covers the full disease catalog.
- Their authored source remains in `src/data/*.ts`, while runtime imports use generated modules under `src/data/generated/diseases/`.
- Empiric options are normalized during generation, not at runtime.
- The generated regimen inventory lives in `src/data/generated/regimen-catalog.ts` and is the canonical runtime source for regimen IDs and monograph cross-references.
- Authored empiric options should use `monographId` for true monograph links; `drug` remains legacy free text and search anchor text.

## Generated artifact

- `src/data/generated-content-meta.ts` is build output.
- `src/data/generated/regimen-catalog.ts` is build output.
- The app runtime imports generated metadata, not the editorial source file directly.
- Do not hand-edit generated files.

## Commands

- `npm run generate:content-meta`
  - Compiles the editorial source and regenerates `src/data/generated-content-meta.ts`.
- `npm run generate:disease-modules`
  - Compiles editorial disease modules in isolation, normalizes empiric options, and regenerates both the disease-content slice and regimen catalog artifact.
- `npm run prepare:content`
  - Regenerates content metadata and generated disease modules, then recompiles validation artifacts.
- `npm run test:regression`
  - Verifies calculators, warnings, catalog integrity, persistence behavior, editorial/generated metadata parity, and generated regimen parity.
- `npm run release:check`
  - Runs the full release path, including generated metadata checks.
- `npm run validate:content`
  - Runs generated metadata checks plus clinical body schema and evidence-provenance validation.

## Expected workflow

1. Edit `src/data/editorial/content-meta.ts`.
2. Run `npm run test:regression`.
3. Run `npm run release:check` before shipping.
