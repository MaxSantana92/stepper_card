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

- [x] **Task 2.1: Stepper Reducer & Context**
  - Branch: `feat/stepper-logic`
  - Action: Implement `stepperReducer.test.ts`, `types.ts`, and `StepperContext.tsx` using React 19 standards (`use()`, no Provider wrapper).
- [x] **Task 2.2: i18n Integration**
  - Branch: `feat/i18n-setup`
  - Action: Configure `react-i18next` with ES/EN dictionaries in `src/app/i18n/index.ts` and resource files. Contract test in place.

## Phase 3: UI Components (Shadcn Style)

- [x] **Task 3.1: Atomic Components**
  - Branch: `feat/ui-atoms`
  - Action: Implement `Typography.tsx`, `Button.tsx`, and `Badge.tsx` in `src/components/ui/` with shared design tokens in `theme.ts`.
- [x] **Task 3.2: Status Card & Stepper UI**
  - Branch: `feat/ui-features`
  - Action: Implement `StatusCard.tsx` (consuming mockData) and `StepIndicator.tsx`.

## Phase 4: Final Integration & Cleanup

- [x] **Task 4.1: Feature Orchestration (`StepRenderer`)**
  - Branch: `feat/step-renderer`
  - Action: `src/features/stepperFlow/components/StepRenderer.tsx` consumes `useStepper()` (React 19 style) and dynamically renders Step 1, Step 2, or the `StatusCard` (Step 3) based on `currentStep`.
- [x] **Task 4.2: Navigation Controls & Edge Cases**
  - Branch: `feat/navigation-controls`
  - Action: `NavigationControls.tsx` with Next/Back buttons. "Next" is disabled while loading, when no card is selected on Step 2, and is replaced by "Finish" on the last step.
- [x] **Task 4.3: Accessibility (a11y) & UX Polish**
  - Branch: `feat/a11y-audit`
  - Action: All interactive elements expose `accessibilityRole`, `accessibilityLabel` (i18n) and `accessibilityState` where applicable. `StepRenderer` is a polite live region so transitions are announced.
- [x] **Task 4.4: Main Injection & Code Quality**
  - Branch: `feat/final-cleanup`
  - Action: Inject `stepperFlow` into `src/app/AppRoot.tsx`. Run `pnpm check --write` and `pnpm test` to ensure full integration. No unused imports or mock leftovers.

## Phase 5: Challenge Closure

- [x] **Task 5.1: Card Status Lifecycle**
  - Branch: `feat/final-cleanup`
  - Action: Add `UPDATE_CARD_STATUS` reducer action with the `CARD_STATUS_TRANSITIONS` matrix and `isValidCardStatusTransition` helper. Expose `updateCardStatus` from `useStepper`. Implement `CardStatusActions.tsx` toolbar in step 3 (one button per non-current state, disabled when the transition is forbidden, with translated `accessibilityHint`s).
  - Coverage: dedicated reducer cases, full transition matrix table-test, component test for selection / disabled buttons / dispatch.
- [x] **Task 5.2: Test Suite Stabilisation**
  - Branch: `feat/final-cleanup`
  - Action: Mock `FlatList` in `jest.setup.ts` via a `Proxy` over the public `react-native` module so virtualisation never strips off-screen items in tests. Refine `findCardOptions` in `AppRoot.test.tsx` to target only the interactive `Pressable` instances (filter by `typeof onPress === 'function'`).
  - Result: `Tests: 97 passed, 13 suites`.
- [x] **Task 5.3: Documentation Refresh**
  - Branch: `feat/final-cleanup`
  - Action: Rewrite `README.md` with stack rationale, FSD structure, flow diagram, status machine, i18n contract, scripts, testing strategy and extension guide. Update this plan to reflect the actual state.

---

## Done state checklist (against the original challenge)

- [x] Multi-step informative stepper (>2 steps) – 3 steps.
- [x] Card component on the final step – `StatusCard`.
- [x] Stepper styling and four card states – `StepIndicator`, `Badge`, `ACCENT_BY_STATUS`.
- [x] Context handles stepper rendering – `StepperContext` + `StepRenderer`.
- [x] Mock JSON for the card data – `src/services/mockData.json`.
- [x] Internationalization – `react-i18next` with ES/EN parity test.
- [x] Stylesheet usage – `StyleSheet.create` everywhere with shared `theme.ts` tokens.
- [x] Logic to switch between card states – `UPDATE_CARD_STATUS` + `CardStatusActions`.
- [x] Step navigation logic – `NavigationControls` with edge cases.
- [x] README with setup and technical decisions.
