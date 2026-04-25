import { createContext, type Dispatch, type ReactNode, use, useMemo, useReducer } from 'react';

import {
  initialStepperState,
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
