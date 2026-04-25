# Autonomous Development Plan: Stepper & Status Card

## Instructions for AI Agent

1. Follow the branching strategy: `feat/feature-name`.
2. For each Task:
   - Create the branch.
   - Implement code following `.cursorrules`.
   - Run tests (`pnpm test`) and linting (`pnpm check`).
   - If successful, commit and prepare for merge.
3. Update this document by marking tasks as completed [x].

---

## Phase 1: Setup & Foundation

- [ ] **Task 1.1: Document Initialization**
  - Branch: `feat/docs-init`
  - Action: Ensure `.cursorrules`, `biome.json`, and `mockData.json` are in sync.
- [ ] **Task 1.2: Base Architecture**
  - Branch: `feat/architecture-setup`
  - Action: Create FSD folder structure and initial `App.tsx` cleanup.

## Phase 2: Logic & State (TDD)

- [ ] **Task 2.1: Stepper Reducer & Context**
  - Branch: `feat/stepper-logic`
  - Action: Implement `stepperReducer` and `StepperProvider` with unit tests.
- [ ] **Task 2.2: i18n Integration**
  - Branch: `feat/i18n-setup`
  - Action: Configure `react-i18next` with ES/EN dictionaries.

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
