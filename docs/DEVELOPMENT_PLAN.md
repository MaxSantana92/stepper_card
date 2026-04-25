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

---

## Phase 1: Setup & Foundation

- [x] **Task 1.1: Document Initialization**
  - Branch: `feat/docs-init`
  - Action: Ensure `.cursorrules`, `biome.json`, and `mockData.json` are in sync.
- [x] **Task 1.2: Base Architecture**
  - Branch: `feat/architecture-setup`
  - Action: Create FSD folder structure and initial `App.tsx` cleanup.

## Phase 2: Logic & State (TDD)

- [ ] **Task 2.1: Stepper Reducer & Context**
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
