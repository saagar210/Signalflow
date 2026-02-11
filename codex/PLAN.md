# Delta Plan

## A) Executive Summary
- The repository is a Tauri desktop application with a React/TypeScript frontend (`src/`) and Rust backend (`src-tauri/src/`).
- Flow graph validation is centralized in `src/lib/flowValidator.ts`.
- Node metadata and configurable fields are centralized in `src/lib/nodeRegistry.ts`.
- Current empty-config validation in `flowValidator.ts` is hard-coded to only three keys (`path`, `url`, `pattern`), creating drift risk as node catalog evolves.
- Existing tests in `src/lib/flowValidator.test.ts` cover required input, specific empty fields, and orphan-node behavior.

### Key risks
- Validation logic can silently miss new required fields if developers forget to modify hard-coded checks.
- UX quality degrades when critical node expressions are left empty and not flagged pre-run.
- Hard-coded logic increases maintenance friction as node library grows.

### Improvement themes (prioritized)
1. Make config-field requiredness declarative in node metadata.
2. Refactor flow validation to rely on schema metadata, not hard-coded keys.
3. Expand test coverage for newly required expression-based fields.

## B) Constraints & Invariants (Repo-derived)
### Explicit invariants
- Required input-port connectivity warnings must remain intact.
- Existing warning shape (`ValidationWarning`) must remain unchanged.
- No backend contract changes.

### Implicit invariants (inferred)
- Validation should be static and fast (pure function over nodes+edges).
- Warnings should remain non-fatal (`severity: "warning"`) for pre-run guidance.

### Non-goals
- No rewrite of node execution behavior.
- No Rust backend changes.
- No UI redesign.

## C) Proposed Changes by Theme (Prioritized)
### Theme 1: Declarative required config fields
- Current: `ConfigFieldSchema` has no required flag.
- Proposed: add optional `required?: boolean` property and annotate critical fields in node definitions.
- Why: keeps validation aligned with node metadata.
- Tradeoff: one-time metadata updates now; lower future drift.
- Scope: `src/lib/nodeRegistry.ts` only for schema metadata.

### Theme 2: Generic required-field validation
- Current: flow validator checks only `path`, `url`, `pattern` by key-name.
- Proposed: iterate schema fields with `required: true` and validate emptiness.
- Why: removes key-name coupling and future-proofs validation.
- Scope: `src/lib/flowValidator.ts`.

### Theme 3: Test hardening
- Current: no tests for empty expression/code validation.
- Proposed: add focused tests for map/filter/conditional/code nodes with empty required fields.
- Why: lock behavior and prevent regressions.
- Scope: `src/lib/flowValidator.test.ts`.

## D) File/Module Delta (Exact)
### ADD
- `codex/SESSION_LOG.md` (execution trace)
- `codex/DECISIONS.md` (judgment calls)
- `codex/CHECKPOINTS.md` (resume checkpoints)
- `codex/CHANGELOG_DRAFT.md` (delivery draft)

### MODIFY
- `src/lib/nodeRegistry.ts` (add `required` config metadata)
- `src/lib/flowValidator.ts` (generic required-field validation)
- `src/lib/flowValidator.test.ts` (new regression tests)
- `codex/PLAN.md`, `codex/VERIFICATION.md` (live updates)

### REMOVE/DEPRECATE
- None.

### Boundary rules
- Keep validation logic in `src/lib/flowValidator.ts`; avoid moving responsibilities into components/stores.

## E) Data Models & API Contracts (Delta)
- Current schema type: `ConfigFieldSchema` in `src/lib/nodeRegistry.ts`.
- Proposed contract delta: optional `required?: boolean` property.
- Compatibility: backward compatible; missing `required` treated as false.
- Persisted data: no migration required (runtime metadata only).

## F) Implementation Sequence (Dependency-Explicit)
1. Add `required` property to schema type and annotate critical fields.
   - Verify: `pnpm test src/lib/flowValidator.test.ts`
   - Rollback: revert `src/lib/nodeRegistry.ts`
2. Refactor validator to use `required` metadata.
   - Verify: `pnpm test src/lib/flowValidator.test.ts`
   - Rollback: revert `src/lib/flowValidator.ts`
3. Add/adjust tests for expression/code required field warnings.
   - Verify: `pnpm test src/lib/flowValidator.test.ts`
   - Rollback: revert test file
4. Run full feasible suite.
   - Verify: `pnpm test`, `pnpm build`, `cd src-tauri && cargo test`

## G) Error Handling & Edge Cases
- Current pattern: pre-run warnings only, no exceptions in validator.
- Improvement: validate empty strings and missing values for required config fields consistently.
- Edge cases to cover:
  - required field absent from node data but present in defaults
  - required field present but whitespace-only string
  - required expression/code fields empty

## H) Integration & Testing Strategy
- Integration point: `useExecution` calls `validateFlow` before run.
- Unit tests: extend `flowValidator.test.ts` for declarative required fields.
- Definition of Done:
  - targeted tests pass
  - full frontend suite passes
  - build passes
  - backend limitation documented

## I) Assumptions & Judgment Calls
- Assumption: expression/code fields should be treated as required for meaningful execution.
- Judgment call: keep warnings (not errors) to preserve UX consistency.
