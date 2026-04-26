import { stepperReducer } from '../context/StepperContext';
import {
  CARD_STATUS_TRANSITIONS,
  type CardStatusKind,
  type FinancialCard,
  initialStepperState,
  isValidCardStatusTransition,
  STEPPER_MAX_STEP,
  STEPPER_MIN_STEP,
} from '../types';

const sampleCard: FinancialCard = {
  id: 'v-1234',
  type: 'VISA_DEBIT',
  lastFour: '4582',
  holderName: 'MAX SANTANA',
  status: { kind: 'enabled' },
  balance: 150500.25,
  expiryDate: '12/28',
};

describe('stepperReducer', () => {
  describe('NEXT_STEP', () => {
    it('increments currentStep by one when below the maximum', () => {
      const next = stepperReducer(initialStepperState, { type: 'NEXT_STEP' });

      expect(next.currentStep).toBe(initialStepperState.currentStep + 1);
    });

    it('does not increment past STEPPER_MAX_STEP (3)', () => {
      let state = initialStepperState;

      for (let i = 0; i < 10; i += 1) {
        state = stepperReducer(state, { type: 'NEXT_STEP' });
      }

      expect(STEPPER_MAX_STEP).toBe(3);
      expect(state.currentStep).toBe(STEPPER_MAX_STEP);
    });

    it('returns a new state object instead of mutating the previous one', () => {
      const next = stepperReducer(initialStepperState, { type: 'NEXT_STEP' });

      expect(next).not.toBe(initialStepperState);
      expect(initialStepperState.currentStep).toBe(STEPPER_MIN_STEP);
    });
  });

  describe('PREV_STEP', () => {
    it('does not decrement below STEPPER_MIN_STEP (1)', () => {
      const next = stepperReducer(initialStepperState, { type: 'PREV_STEP' });

      expect(STEPPER_MIN_STEP).toBe(1);
      expect(next.currentStep).toBe(STEPPER_MIN_STEP);
    });
  });

  describe('SET_CARD', () => {
    it('stores the financial card payload as selectedCard', () => {
      const next = stepperReducer(initialStepperState, {
        type: 'SET_CARD',
        payload: sampleCard,
      });

      expect(next.selectedCard).toEqual(sampleCard);
    });

    it('preserves the rest of the state when setting a card', () => {
      const next = stepperReducer(initialStepperState, {
        type: 'SET_CARD',
        payload: sampleCard,
      });

      expect(next.currentStep).toBe(initialStepperState.currentStep);
      expect(next.isLoading).toBe(initialStepperState.isLoading);
      expect(next.error).toBe(initialStepperState.error);
    });
  });

  describe('SET_LOADING and SET_ERROR', () => {
    it('toggles the loading flag', () => {
      const next = stepperReducer(initialStepperState, {
        type: 'SET_LOADING',
        payload: true,
      });

      expect(next.isLoading).toBe(true);
    });

    it('stores an error message', () => {
      const next = stepperReducer(initialStepperState, {
        type: 'SET_ERROR',
        payload: 'network',
      });

      expect(next.error).toBe('network');
    });
  });

  describe('UPDATE_CARD_STATUS', () => {
    const stateWithCard = {
      ...initialStepperState,
      selectedCard: sampleCard,
    };

    it('updates only the status of the selected card on a valid transition', () => {
      const next = stepperReducer(stateWithCard, {
        type: 'UPDATE_CARD_STATUS',
        payload: { kind: 'paused', pausedAt: '2026-04-26T12:00:00Z' },
      });

      expect(next.selectedCard?.status).toEqual({
        kind: 'paused',
        pausedAt: '2026-04-26T12:00:00Z',
      });
      expect(next.selectedCard?.id).toBe(sampleCard.id);
      expect(next.selectedCard?.balance).toBe(sampleCard.balance);
      expect(next.selectedCard?.holderName).toBe(sampleCard.holderName);
    });

    it('returns the same reference when the transition is invalid', () => {
      const stateDisabled = {
        ...stateWithCard,
        selectedCard: { ...sampleCard, status: { kind: 'disabled' } as const },
      };

      const next = stepperReducer(stateDisabled, {
        type: 'UPDATE_CARD_STATUS',
        payload: { kind: 'paused' },
      });

      expect(next).toBe(stateDisabled);
    });

    it('is a no-op when there is no selected card', () => {
      const next = stepperReducer(initialStepperState, {
        type: 'UPDATE_CARD_STATUS',
        payload: { kind: 'enabled' },
      });

      expect(next).toBe(initialStepperState);
    });

    it.each<[CardStatusKind, CardStatusKind, boolean]>([
      ['enabled', 'paused', true],
      ['enabled', 'disabled', true],
      ['enabled', 'unpaused', false],
      ['disabled', 'enabled', true],
      ['disabled', 'paused', false],
      ['disabled', 'disabled', false],
      ['paused', 'unpaused', true],
      ['paused', 'disabled', true],
      ['paused', 'enabled', false],
      ['unpaused', 'paused', true],
      ['unpaused', 'disabled', true],
      ['unpaused', 'enabled', false],
    ])('validates the transition matrix for %s → %s as %s', (from, to, expected) => {
      expect(isValidCardStatusTransition(from, to)).toBe(expected);
    });

    it('exposes a transition table consistent with the validator helper', () => {
      const kinds: readonly CardStatusKind[] = ['enabled', 'disabled', 'paused', 'unpaused'];

      for (const from of kinds) {
        for (const to of kinds) {
          const expected = CARD_STATUS_TRANSITIONS[from].includes(to);
          expect(isValidCardStatusTransition(from, to)).toBe(expected);
        }
      }
    });
  });
});
