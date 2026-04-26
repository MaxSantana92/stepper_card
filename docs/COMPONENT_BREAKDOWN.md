# Technical Specification: Stepper & Status Card Flow

## User Story

**As a** user of the banking app,
**I want** to navigate through an informative multi-step process,
**So that** I can view the final status of my financial product (Card) with clear visual indicators.

---

## Acceptance Criteria (AC)

- [ ] **AC 1: Navigation.** Must have at least 3 steps. Navigation must be bidirectional (Next/Back).
- [ ] **AC 2: Final State.** The last step must render a Card reflecting one of 4 states: `enabled`, `disabled`, `paused`, `unpaused`.
- [ ] **AC 3: Context Persistence.** Stepper progress and Card data must persist if the user navigates between steps.
- [ ] **AC 4: i18n.** All visible labels and accessibility strings must support Spanish and English through `react-i18next`.
- [ ] **AC 5: A11y.** Interactive elements must be accessible via screen readers.

---

## Component Breakdown (Architecture: FSD)

### 1. Atoms (Shared UI)

- `Button.tsx`: shadcn-style button with variants (default, outline, ghost).
- `Typography.tsx`: Standardized text components (Heading, Subtitle, Body).
- `Badge.tsx`: Small status indicator for the Card.

### 2. Molecules (Feature UI)

- `StepIndicator.tsx`: Visual progress bar showing active/completed steps.
- `NavigationControls.tsx`: The Next/Back button group.

### 3. Organisms (Core Features)

- `StatusCard.tsx`: The final component.
  - **Logic:** Receives data from `mockData.json`.
  - **Styles:** Slate-200 borders, Indigo-600 highlights, dynamic colors for status.
- `StepRenderer.tsx`: High-order component that switches between Step 1, Step 2, and the Final Card.

---

## Technical Tasks

1. Initialize `StepperContext` using `useReducer` to manage `currentStep` and `cardData`.
2. Create `useStepper` hook to encapsulate navigation logic.
3. Implement `i18n` config and JSON files.
4. Setup Jest tests for `stepperReducer`.

---

## i18n Development Rules

- Components must use `useTranslation()` or receive already translated copy through props.
- Hardcoded user-facing strings are forbidden in components, hooks, and accessibility props.
- Translation keys must be grouped by domain:
  - `common.*` for shared application copy.
  - `home.*` for the initial screen.
  - `stepper.*` for steps and navigation controls.
  - `card.*` for card labels and status values.
  - `a11y.*` for `accessibilityLabel` and `accessibilityHint`.
- Every new translation key must be added to both `src/app/i18n/resources/es.json` and `src/app/i18n/resources/en.json`.
- UI work is not complete unless translation key parity tests pass.
