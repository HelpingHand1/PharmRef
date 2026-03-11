# Content Pipeline

PharmRef now separates editorial metadata from runtime assembly.

## Source of truth

- Editorial metadata lives in `src/data/editorial/content-meta.ts`.
- This file is where disease, pathway, and monograph review metadata should be edited.
- Structured source IDs in editorial metadata must exist in `src/data/source-registry.ts`.

## Generated artifact

- `src/data/generated-content-meta.ts` is build output.
- The app runtime imports generated metadata, not the editorial source file directly.
- Do not hand-edit the generated file.

## Commands

- `npm run generate:content-meta`
  - Compiles the editorial source and regenerates `src/data/generated-content-meta.ts`.
- `npm run prepare:content`
  - Regenerates content metadata, then recompiles validation artifacts.
- `npm run test:regression`
  - Verifies calculators, warnings, catalog integrity, persistence behavior, and editorial/generated metadata parity.
- `npm run release:check`
  - Runs the full release path, including generated metadata checks.

## Expected workflow

1. Edit `src/data/editorial/content-meta.ts`.
2. Run `npm run test:regression`.
3. Run `npm run release:check` before shipping.
