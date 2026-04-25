export const STEPPER_MIN_STEP = 1;
export const STEPPER_MAX_STEP = 3;

export type CardStatusKind = 'enabled' | 'disabled' | 'paused' | 'unpaused';

export type CardStatus =
  | { kind: 'enabled' }
  | { kind: 'disabled'; reason?: string }
  | { kind: 'paused'; pausedAt?: string }
  | { kind: 'unpaused'; resumedAt?: string };

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
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

export const initialStepperState: StepperState = {
  currentStep: STEPPER_MIN_STEP,
  selectedCard: null,
  isLoading: false,
  error: null,
};
