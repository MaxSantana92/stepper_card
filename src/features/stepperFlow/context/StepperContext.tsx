import { createContext, type Dispatch, type ReactNode, use, useMemo, useReducer } from 'react';

import {
  initialStepperState,
  isValidCardStatusTransition,
  STEPPER_MAX_STEP,
  STEPPER_MIN_STEP,
  type StepperAction,
  type StepperState,
} from '../types';

export const stepperReducer = (state: StepperState, action: StepperAction): StepperState => {
  switch (action.type) {
    case 'NEXT_STEP':
      return {
        ...state,
        currentStep: Math.min(state.currentStep + 1, STEPPER_MAX_STEP),
      };
    case 'PREV_STEP':
      return {
        ...state,
        currentStep: Math.max(state.currentStep - 1, STEPPER_MIN_STEP),
      };
    case 'SET_CARD':
      return {
        ...state,
        selectedCard: action.payload,
      };
    case 'UPDATE_CARD_STATUS': {
      // Guard: ignore the action if there is no selected card or if the
      // requested transition is not allowed by the lifecycle rules.
      if (state.selectedCard === null) {
        return state;
      }
      if (!isValidCardStatusTransition(state.selectedCard.status.kind, action.payload.kind)) {
        return state;
      }
      return {
        ...state,
        selectedCard: {
          ...state.selectedCard,
          status: action.payload,
        },
      };
    }
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

export interface StepperContextValue {
  state: StepperState;
  dispatch: Dispatch<StepperAction>;
}

export const StepperContext = createContext<StepperContextValue | null>(null);

interface StepperProviderProps {
  children: ReactNode;
  initialState?: StepperState;
}

export const StepperProvider = ({
  children,
  initialState = initialStepperState,
}: StepperProviderProps) => {
  const [state, dispatch] = useReducer(stepperReducer, initialState);

  const value = useMemo<StepperContextValue>(() => ({ state, dispatch }), [state]);

  return <StepperContext value={value}>{children}</StepperContext>;
};

export const useStepperContext = (): StepperContextValue => {
  const context = use(StepperContext);

  if (context === null) {
    throw new Error('useStepperContext must be used within a <StepperProvider>.');
  }

  return context;
};
