import ReactTestRenderer from 'react-test-renderer';

import '../../../../app/i18n';

import { resources } from '../../../../app/i18n';
import { StepperProvider } from '../../context';
import {
  type FinancialCard,
  initialStepperState,
  STEPPER_MAX_STEP,
  STEPPER_MIN_STEP,
  type StepperState,
} from '../../types';
import { NavigationControls } from '../NavigationControls';

const sampleCard: FinancialCard = {
  id: 'v-1234',
  type: 'VISA_DEBIT',
  lastFour: '4582',
  holderName: 'MAX SANTANA',
  status: { kind: 'enabled' },
  balance: 150500.25,
  expiryDate: '12/28',
};

const renderControls = async (
  overrides: Partial<StepperState> = {},
  props: { onFinish?: () => void } = {},
) => {
  let component: ReactTestRenderer.ReactTestRenderer | undefined;
  const initialState: StepperState = { ...initialStepperState, ...overrides };

  await ReactTestRenderer.act(() => {
    component = ReactTestRenderer.create(
      <StepperProvider initialState={initialState}>
        <NavigationControls onFinish={props.onFinish} />
      </StepperProvider>,
    );
  });

  return component;
};

const findPressableByTestID = (
  component: ReactTestRenderer.ReactTestRenderer | undefined,
  testID: string,
) =>
  component?.root.findAll(
    (node) => node.props.accessibilityRole === 'button' && node.props.testID === testID,
  );

const findBackButton = (component: ReactTestRenderer.ReactTestRenderer | undefined) =>
  findPressableByTestID(component, 'navigation-controls-back')?.[0];

const findNextButton = (component: ReactTestRenderer.ReactTestRenderer | undefined) =>
  findPressableByTestID(component, 'navigation-controls-next')?.[0];

const findContainer = (component: ReactTestRenderer.ReactTestRenderer | undefined) =>
  component?.root.findAll(
    (node) =>
      node.props.accessibilityRole === 'toolbar' && node.props.testID === 'navigation-controls',
  )?.[0];

describe('NavigationControls', () => {
  it('renders translated back and next buttons inside an a11y-labelled container', async () => {
    const component = await renderControls({ currentStep: STEPPER_MIN_STEP });

    const back = findBackButton(component);
    const next = findNextButton(component);

    expect(back?.props.accessibilityLabel).toBe(resources.es.translation.stepper.navigation.back);
    expect(next?.props.accessibilityLabel).toBe(resources.es.translation.stepper.navigation.next);

    const container = findContainer(component);
    expect(container?.props.accessibilityLabel).toBe(
      resources.es.translation.a11y.stepper.controlsLabel,
    );
  });

  it('disables the back button on the first step', async () => {
    const component = await renderControls({ currentStep: STEPPER_MIN_STEP });
    const back = findBackButton(component);

    expect(back?.props.disabled).toBe(true);
    expect(back?.props.accessibilityState).toMatchObject({ disabled: true });
  });

  it('enables the back button after the first step', async () => {
    const component = await renderControls({ currentStep: 2 });
    const back = findBackButton(component);

    expect(back?.props.disabled).toBe(false);
  });

  it('moves to the next step when next is pressed and updates the rendered controls', async () => {
    const component = await renderControls({
      currentStep: STEPPER_MIN_STEP,
      selectedCard: sampleCard,
    });

    await ReactTestRenderer.act(() => {
      findNextButton(component)?.props.onPress();
    });

    const next = findNextButton(component);
    expect(next?.props.accessibilityLabel).toBe(resources.es.translation.stepper.navigation.next);
    expect(findBackButton(component)?.props.disabled).toBe(false);
  });

  it('goes back when the back button is pressed', async () => {
    const component = await renderControls({ currentStep: 2 });

    await ReactTestRenderer.act(() => {
      findBackButton(component)?.props.onPress();
    });

    expect(findBackButton(component)?.props.disabled).toBe(true);
  });

  it('disables the next button while loading', async () => {
    const component = await renderControls({
      currentStep: STEPPER_MIN_STEP,
      isLoading: true,
    });
    const next = findNextButton(component);

    expect(next?.props.disabled).toBe(true);
    expect(next?.props.accessibilityState).toMatchObject({ disabled: true });
  });

  it('disables the next button on step 2 when no card has been selected', async () => {
    const component = await renderControls({ currentStep: 2, selectedCard: null });
    const next = findNextButton(component);

    expect(next?.props.disabled).toBe(true);
    expect(next?.props.accessibilityHint).toBe(
      resources.es.translation.a11y.stepper.nextDisabledHint,
    );
  });

  it('enables the next button on step 2 once a card has been selected', async () => {
    const component = await renderControls({ currentStep: 2, selectedCard: sampleCard });
    const next = findNextButton(component);

    expect(next?.props.disabled).toBe(false);
    expect(next?.props.accessibilityHint).toBe(resources.es.translation.a11y.stepper.nextHint);
  });

  it('renders the finish label and disables the next button on the final step by default', async () => {
    const component = await renderControls({
      currentStep: STEPPER_MAX_STEP,
      selectedCard: sampleCard,
    });
    const next = findNextButton(component);

    expect(next?.props.accessibilityLabel).toBe(resources.es.translation.stepper.navigation.finish);
    expect(next?.props.accessibilityHint).toBe(resources.es.translation.a11y.stepper.finishHint);
    expect(next?.props.disabled).toBe(true);
  });

  it('invokes onFinish on the final step when next is pressed and the callback is provided', async () => {
    const onFinish = jest.fn();
    const component = await renderControls(
      { currentStep: STEPPER_MAX_STEP, selectedCard: sampleCard },
      { onFinish },
    );
    const next = findNextButton(component);

    expect(next?.props.disabled).toBe(false);

    await ReactTestRenderer.act(() => {
      next?.props.onPress();
    });

    expect(onFinish).toHaveBeenCalledTimes(1);
  });

  it('does not throw when next is pressed in a disabled state', async () => {
    const component = await renderControls({ currentStep: 2, selectedCard: null });
    const next = findNextButton(component);

    expect(next?.props.disabled).toBe(true);

    expect(() => {
      ReactTestRenderer.act(() => {
        next?.props.onPress?.();
      });
    }).not.toThrow();
  });

  it('keeps both buttons available after step transitions', async () => {
    const component = await renderControls({
      currentStep: STEPPER_MIN_STEP,
      selectedCard: sampleCard,
    });

    expect(findContainer(component)).toBeDefined();
    expect(findBackButton(component)).toBeDefined();
    expect(findNextButton(component)).toBeDefined();

    await ReactTestRenderer.act(() => {
      findNextButton(component)?.props.onPress();
    });

    expect(findContainer(component)).toBeDefined();
    expect(findBackButton(component)).toBeDefined();
    expect(findNextButton(component)).toBeDefined();
    expect(findBackButton(component)?.props.disabled).toBe(false);
  });
});
