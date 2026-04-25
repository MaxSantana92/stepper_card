import { useCallback, useMemo } from 'react';

import { useStepperContext } from '../context';
import type { FinancialCard } from '../types';

export interface UseStepperResult {
  currentStep: number;
  selectedCard: FinancialCard | null;
  isLoading: boolean;
  error: string | null;
  next: () => void;
  back: () => void;
  selectCard: (card: FinancialCard) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useStepper = (): UseStepperResult => {
  const { state, dispatch } = useStepperContext();

  const next = useCallback(() => {
    dispatch({ type: 'NEXT_STEP' });
  }, [dispatch]);

  const back = useCallback(() => {
    dispatch({ type: 'PREV_STEP' });
  }, [dispatch]);

  const selectCard = useCallback(
    (card: FinancialCard) => {
      dispatch({ type: 'SET_CARD', payload: card });
    },
    [dispatch],
  );

  const setLoading = useCallback(
    (loading: boolean) => {
      dispatch({ type: 'SET_LOADING', payload: loading });
    },
    [dispatch],
  );

  const setError = useCallback(
    (error: string | null) => {
      dispatch({ type: 'SET_ERROR', payload: error });
    },
    [dispatch],
  );

  return useMemo<UseStepperResult>(
    () => ({
      currentStep: state.currentStep,
      selectedCard: state.selectedCard,
      isLoading: state.isLoading,
      error: state.error,
      next,
      back,
      selectCard,
      setLoading,
      setError,
    }),
    [state, next, back, selectCard, setLoading, setError],
  );
};
