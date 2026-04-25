# Autonomous Development Plan: Stepper & Status Card

## Instructions for AI Agent

1. Follow the branching strategy: `feat/feature-name`.
2. For each Task:
   - Create the branch.
   - Implement code following `.cursorrules`.
   - Run tests (`pnpm test`) and linting (`pnpm check`).
   - If successful, commit, push, and open a PR to `develop`.
   - Wait for review/approval before merge. Direct merge to `develop` is not allowed.
3. Update this document by marking tasks as completed [x].
4. **Commits:** The maintainer may prefer to review locally before committing. The agent should leave a clean working tree description (staged vs unstaged) when handing off; do not assume an automatic commit unless explicitly requested.

---

## Pre-push review (maintainer)

Use this checklist **before** `git commit`, `git push`, or opening a PR to `develop`. It is safe to run on every branch.

| Step | Command / action | Pass criteria |
|------|------------------|---------------|
| 1 | `git status` | Only the files you expect are modified or staged. |
| 2 | `git diff` and `git diff --staged` | Logic, types, and copy match the task; no accidental secrets or debug noise. |
| 3 | `pnpm check` | Biome reports no errors (format + lint). |
| 4 | `pnpm test` | All Jest suites green. |
| 5 | Skim **task-specific files** (see Phase notes below) | Reducer bounds, context API, and i18n keys align with `.cursorrules`. |

**Task 2.1 — files to skim on `feat/stepper-logic`:**

- `src/features/stepperFlow/__tests__/stepperReducer.test.ts` — `NEXT_STEP` must not pass step 3; `SET_CARD` persists payload; immutability.
- `src/features/stepperFlow/types.ts` — `CardStatus` as a discriminated union (discriminator `kind`).
- `src/features/stepperFlow/context/StepperContext.tsx` — React 19: render `<StepperContext value={...}>` (not `Context.Provider`); consume with `use()` via `useStepperContext`.
- `src/services/mockData.json` and `src/services/__tests__/mockData.test.ts` — card `status` objects match the new `CardStatus` shape.

**Task 2.2 — note:** i18n is already integrated on `develop` (`src/app/i18n`, ES/EN resources, parity test in `src/app/i18n/__tests__/resources.test.ts`). Closing the task is mainly marking this plan and, if you use a dedicated branch, a small docs-only or plan-only commit on `feat/i18n-setup` after re-running `pnpm check` and `pnpm test`.

---

## Phase 1: Setup & Foundation

- [x] **Task 1.1: Document Initialization**
  - Branch: `feat/docs-init`
  - Action: Ensure `.cursorrules`, `biome.json`, and `mockData.json` are in sync.
- [x] **Task 1.2: Base Architecture**
  - Branch: `feat/architecture-setup`
  - Action: Create FSD folder structure and initial `App.tsx` cleanup.

## Phase 2: Logic & State (TDD)

- [x] **Task 2.1: Stepper Reducer & Context**
  - Branch: `feat/stepper-logic`
  - Action: Implement `stepperReducer` and `StepperProvider` with unit tests.
- [ ] **Task 2.2: i18n Integration**
  - Branch: `feat/i18n-setup`
  - Action: Configure `react-i18next` with ES/EN dictionaries.
  - Requirements:
    - Initialize i18n from `src/app/i18n`.
    - Keep Spanish (`es`) as the default and fallback language.
    - Store visible text and accessibility copy in translation resources.
    - Use domain-based keys: `common.*`, `home.*`, `stepper.*`, `card.*`, and `a11y.*`.
    - Add every new key to both `es` and `en`.
    - Add a contract test to keep translation keys synchronized.
  - Validation: `pnpm check` and `pnpm test` must pass before closing the task.

## Phase 3: UI Components (Shadcn Style)

- [ ] **Task 3.1: Atomic Components**
  - Branch: `feat/ui-atoms`
  - Action: `Button`, `Typography`, `Badge` with NativeWind.
- [ ] **Task 3.2: Status Card & Stepper UI**
  - Branch: `feat/ui-features`
  - Action: Implement `StatusCard` and `StepIndicator`.

## Phase 4: Final Integration & Cleanup

- [ ] **Task 4.1: End-to-End Flow**
  - Branch: `feat/final-integration`
  - Action: Connect all steps and verify accessibility (a11y).
