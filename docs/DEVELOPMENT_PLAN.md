# Autonomous Development Plan: Stepper & Status Card

## Instructions for AI Agent

The agent is responsible **only for development and validation**. Git history (commits, push, PRs, merges) is always handled by the maintainer.

1. Follow the branching strategy: `feat/feature-name`.
2. For each Task, the agent must:
   1. Create the feature branch from the latest `develop` (`git checkout develop && git pull && git checkout -b feat/task-name`).
   2. Implement code following `.cursorrules` (TDD: tests first, then implementation).
   3. Run `pnpm check` (Biome) and `pnpm test` (Jest) until both are green.
   4. Update this document marking the task as completed `[x]` and add any relevant notes.
   5. Run `git status` and report a clean handoff: list of staged/unstaged files, validations passed.
   6. **STOP. Do not commit, do not push, do not merge.**
3. The maintainer is responsible for:
   - Reviewing the working tree (`git status`, `git diff`, `pnpm check`, `pnpm test`).
   - Committing with the desired message and Conventional Commits style.
   - Pushing the branch and opening a PR to `develop`.
   - Merging the PR after review.
4. The agent may only resume the next task after the maintainer confirms the previous PR is merged into `develop`.

---

## Pre-push review (maintainer)

Use this checklist **before** `git commit`, `git push`, or opening a PR to `develop`. It is safe to run on every branch.

| Step | Command / action | Pass criteria |
|------|------------------|---------------|
| 1 | `git status` | Only the files you expect are modified or untracked. |
| 2 | `git diff` (and inspect untracked files) | Logic, types, and copy match the task; no accidental secrets or debug noise. |
| 3 | `pnpm check` | Biome reports no errors (format + lint). |
| 4 | `pnpm test` | All Jest suites green. |
| 5 | Skim **task-specific files** (see Phase notes below) | Reducer bounds, context API, and i18n keys align with `.cursorrules`. |
| 6 | `git add . && git commit -m "..."` | Conventional Commits style. |
| 7 | `git push -u origin feat/...` and open PR to `develop` | Squash-friendly description; link the task in this plan. |

**Task 2.1 — files to skim on `feat/stepper-logic`:**

- `src/features/stepperFlow/__tests__/stepperReducer.test.ts` — `NEXT_STEP` must not pass step 3; `SET_CARD` persists payload; immutability.
- `src/features/stepperFlow/types.ts` — `CardStatus` as a discriminated union (discriminator `kind`).
- `src/features/stepperFlow/context/StepperContext.tsx` — React 19: render `<StepperContext value={...}>` (not `Context.Provider`); consume with `use()` via `useStepperContext`.
- `src/services/mockData.json` and `src/services/__tests__/mockData.test.ts` — card `status` objects match the new `CardStatus` shape.

**Task 2.2 — note:** i18n is already integrated on `develop` (`src/app/i18n`, ES/EN resources, parity test in `src/app/i18n/__tests__/resources.test.ts`). Closing the task is mainly marking this plan and, if you use a dedicated branch, a small docs-only or plan-only commit on `feat/i18n-setup` after re-running `pnpm check` and `pnpm test`.

**Task 3.1 — files to skim on `feat/ui-atoms`:**

- `src/components/ui/theme.ts` — Slate/Indigo palette, spacing, radii tokens.
- `src/components/ui/Button.tsx` — verify `ref` is a standard prop (no `forwardRef`); variants `primary` / `outline` / `ghost`; `accessibilityRole="button"` and disabled state honored.
- `src/components/ui/Typography.tsx` — `Heading` defaults to `accessibilityRole="header"`; `Subtitle` and `Body` keep token sizes.
- `src/components/ui/Badge.tsx` — `status` prop maps to a discriminated `CardStatusKind` palette.
- `src/components/ui/__tests__/*.test.tsx` — three suites covering rendering, a11y roles, variants and disabled behavior.

**Task 3.2 — files to skim on `feat/ui-features`:**

- `src/features/stepperFlow/components/StatusCard.tsx` — consumes the discriminated `CardStatus`; visuals must shift between `enabled`, `disabled`, `paused`, `unpaused`.
- `src/features/stepperFlow/components/StepIndicator.tsx` — visual progress bar; keeps within `STEPPER_MIN_STEP`–`STEPPER_MAX_STEP`.
- `src/features/stepperFlow/components/__tests__/*.test.tsx` — render + a11y + variant tests.
- `src/services/mockData.json` — must keep matching the discriminated `CardStatus` schema.

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

- [x] **Task 3.1: Atomic Components**
  - Branch: `feat/ui-atoms`
  - Action: `Button`, `Typography`, `Badge` with NativeWind.
  - Notes: NativeWind not yet installed; implemented with React Native `StyleSheet`
    plus a centralized Slate/Indigo theme token file (`src/components/ui/theme.ts`).
    Button uses `ref` as a standard prop (no `forwardRef`).
- [x] **Task 3.2: Status Card & Stepper UI**
  - Branch: `feat/ui-features`
  - Action: Implement `StatusCard` and `StepIndicator`.
  - Notes: `StatusCard` consumes a `FinancialCard` prop and changes the accent color
    per discriminated `CardStatus.kind`; balance is formatted with a locale-aware
    currency representation. `StepIndicator` exposes `accessibilityRole="progressbar"`
    with `accessibilityValue` and clamps the current step. Added i18n keys under
    `card.types.*`, `stepper.indicator.*` and `a11y.card.*` (ES/EN parity test green).
    `AppRoot` now previews the indicator and the four status variants from `mockData`.

## Phase 4: Final Integration & Cleanup

- [ ] **Task 4.1: End-to-End Flow**
  - Branch: `feat/final-integration`
  - Action: Connect all steps and verify accessibility (a11y).
