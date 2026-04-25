# Controlled Development Plan: Stepper & Status Card

## Instructions for AI Agent

1. For each Task:
   - Create the specified branch (`git checkout -b <branch_name>`).
   - Implement the requested code following `.cursorrules`.
   - Run tests (`pnpm test`) and linting (`pnpm check --write`).
   - DO NOT commit. DO NOT merge.
   - Stop and wait for the user to review the code and manually commit.
2. Only update this document by marking tasks as completed [x] AFTER the user gives explicit approval.

---

## Phase 1: Setup & Foundation

- [x] **Task 1.1: Document Initialization**
  - Branch: `chore/docs-init`
  - Action: Ensure `.cursorrules`, `biome.json`, and `mockData.json` are in sync.
- [x] **Task 1.2: Base Architecture**
  - Branch: `feat/architecture-setup`
  - Action: Create FSD folder structure, `mockData.json`, and initial `AppRoot.tsx` entry point.

## Phase 2: Logic & State (TDD)

- [ ] **Task 2.1: Stepper Reducer & Context**
  - Branch: `feat/stepper-logic`
  - Action: Implement `stepperReducer.test.ts`, `types.ts`, and `StepperContext.tsx` using React 19 standards (`use()`, no Provider wrapper). Run checks and stop.
- [ ] **Task 2.2: i18n Integration**
  - Branch: `feat/i18n-setup`
  - Action: Configure `react-i18next` with ES/EN dictionaries in `src/app/i18n.ts`. Run checks and stop.

## Phase 3: UI Components (Shadcn Style)

- [ ] **Task 3.1: Atomic Components**
  - Branch: `feat/ui-atoms`
  - Action: Implement `Typography.tsx`, `Button.tsx`, and `Badge.tsx` in `src/components/ui/`. Run checks and stop.
- [ ] **Task 3.2: Status Card & Stepper UI**
  - Branch: `feat/ui-features`
  - Action: Implement `StatusCard.tsx` (consuming mockData) and `StepIndicator.tsx`. Run checks and stop.

## Phase 4: Final Integration & Cleanup

- [x] **Task 4.1: Feature Orchestration (`StepRenderer`)**
  - Branch: `feat/step-renderer`
  - Action: Create `StepRenderer.tsx` to handle dynamic views based on `currentStep`. Run checks and stop.
- [x] **Task 4.2: Navigation Controls**
  - Branch: `feat/navigation-controls`
  - Action: Implement `NavigationControls.tsx` with edge-case logic (disabled states). Run checks and stop.
- [ ] **Task 4.3: Accessibility (a11y) Audit**
  - Branch: `feat/a11y-audit`
  - Action: Add `accessibilityRole`, `accessibilityLabel` (i18n), and states to all interactive elements. Run checks and stop.

## Phase 4: Final Integration & Cleanup

- [x] **Task 4.1: Feature Orchestration (`StepRenderer`)**
  - Branch: `feat/step-renderer`
  - Action: Create `src/features/stepperFlow/components/StepRenderer.tsx`. This component must consume `useStepper()` (React 19 style) and dynamically render Step 1, Step 2, or the `StatusCard` (Step 3) based on `currentStep`.
- [x] **Task 4.2: Navigation Controls & Edge Cases**
  - Branch: `feat/navigation-controls`
  - Action: Implement `NavigationControls.tsx` (Next/Back buttons).
  - Rules: Disable "Next" if loading or if no card is selected in Step 2. Handle the final state gracefully.
- [ ] **Task 4.3: Accessibility (a11y) & UX Polish**
  - Branch: `feat/a11y-audit`
  - Action: Ensure all interactive elements have `accessibilityRole`, `accessibilityLabel` (using i18n), and `accessibilityState={ { disabled: true } }` where applicable. Screen readers must logically announce step transitions.
- [ ] **Task 4.4: Main Injection & Code Quality**
  - Branch: `feat/final-cleanup`
  - Action: Inject the completed `stepperFlow` into `src/app/AppRoot.tsx`. Run a final `pnpm check --write` and `pnpm test` to ensure 100% integration. Remove any unused imports or mock leftovers.
