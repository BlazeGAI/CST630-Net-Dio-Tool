# Scenario Loading Analysis

This note explains how scenario files are loaded and filtered in the Scenario Library.

- Loader implementation: `lib/scenarios.ts`
- Library page and week filter UI: `app/scenarios/page.tsx`
- Example invalid scenario: `scenarios-data/W2-S1.json`

Key observations:

1. Scenario files are loaded dynamically from `scenarios-data/` using `fs.readdir(...)` and then filtered to `*.json`.
2. There is no hard-coded scenario ID list.
3. Loaded JSON objects are type-guard validated by `isScenario(...)`.
4. Week filtering is a direct equality check (`scenario.weekTag === week`) for `Week 2` / `Week 3` search params.
5. `W2-S1.json` is excluded because it does not satisfy required schema fields (`summary` missing and `context` is object instead of string).
