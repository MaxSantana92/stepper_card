import { stepperReducer } from '../context/StepperContext';
import {
  type FinancialCard,
  initialStepperState,
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
});
