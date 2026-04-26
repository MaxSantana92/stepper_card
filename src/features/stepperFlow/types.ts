export const STEPPER_MIN_STEP = 1;
export const STEPPER_MAX_STEP = 3;

export type CardStatusKind = 'enabled' | 'disabled' | 'paused' | 'unpaused';

export type CardStatus =
  | { kind: 'enabled' }
  | { kind: 'disabled'; reason?: string }
  | { kind: 'paused'; pausedAt?: string }
  | { kind: 'unpaused'; resumedAt?: string };

/**
 * Allowed transitions for the card lifecycle. The map is the single source of
 * truth used by the reducer, the UI (to enable/disable action buttons) and the
 * tests, so any UX rule change happens in exactly one place.
 *
 * - `enabled`   → can be paused or disabled.
 * - `disabled`  → can only be re-enabled (terminal-like state).
 * - `paused`    → can be unpaused or disabled.
 * - `unpaused`  → can be paused again or disabled.
 */
export const CARD_STATUS_TRANSITIONS: Record<CardStatusKind, readonly CardStatusKind[]> = {
  enabled: ['paused', 'disabled'],
  disabled: ['enabled'],
  paused: ['unpaused', 'disabled'],
  unpaused: ['paused', 'disabled'],
} as const;

export const isValidCardStatusTransition = (from: CardStatusKind, to: CardStatusKind): boolean =>
  CARD_STATUS_TRANSITIONS[from].includes(to);

export type CardType = 'VISA_DEBIT' | 'MASTERCARD_CREDIT' | 'VISA_PLATINUM' | 'VISA_SIGNATURE';

export interface FinancialCard {
  id: string;
  type: CardType;
  lastFour: string;
  holderName: string;
  status: CardStatus;
  balance: number;
  expiryDate: string;
}

export interface StepperState {
  currentStep: number;
  selectedCard: FinancialCard | null;
  isLoading: boolean;
  error: string | null;
}

export type StepperAction =
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'SET_CARD'; payload: FinancialCard }
  | { type: 'UPDATE_CARD_STATUS'; payload: CardStatus }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

export const initialStepperState: StepperState = {
  currentStep: STEPPER_MIN_STEP,
  selectedCard: null,
  isLoading: false,
  error: null,
};
