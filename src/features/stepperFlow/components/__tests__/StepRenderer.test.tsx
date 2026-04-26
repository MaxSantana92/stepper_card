import ReactTestRenderer from 'react-test-renderer';

import '../../../../app/i18n';

import { resources } from '../../../../app/i18n';
import { StepperProvider } from '../../context';
import {
  type FinancialCard,
  initialStepperState,
  STEPPER_MAX_STEP,
  type StepperState,
} from '../../types';
import { StepRenderer } from '../StepRenderer';

const sampleCard: FinancialCard = {
  id: 'v-1234',
  type: 'VISA_DEBIT',
  lastFour: '4582',
  holderName: 'MAX SANTANA',
  status: { kind: 'enabled' },
  balance: 150500.25,
  expiryDate: '12/28',
};

const renderRenderer = async (overrides: Partial<StepperState> = {}) => {
  let component: ReactTestRenderer.ReactTestRenderer | undefined;
  const initialState: StepperState = { ...initialStepperState, ...overrides };

  await ReactTestRenderer.act(() => {
    component = ReactTestRenderer.create(
      <StepperProvider initialState={initialState}>
        <StepRenderer />
      </StepperProvider>,
    );
  });

  return component;
};

describe('StepRenderer', () => {
  it('renders the intro view content when currentStep is the first step', async () => {
    const component = await renderRenderer({ currentStep: 1 });
    const tree = JSON.stringify(component?.toJSON());

    expect(tree).toContain(resources.es.translation.stepper.steps.intro);
    expect(tree).toContain(resources.es.translation.stepper.intro.description);
  });

  it('renders the details view content when currentStep is 2', async () => {
    const component = await renderRenderer({ currentStep: 2 });
    const tree = JSON.stringify(component?.toJSON());

    expect(tree).toContain(resources.es.translation.stepper.steps.details);
    expect(tree).toContain(resources.es.translation.stepper.details.description);
  });

  it('renders the StatusCard for the selected card on the final step', async () => {
    const component = await renderRenderer({
      currentStep: STEPPER_MAX_STEP,
      selectedCard: sampleCard,
    });

    const summary = component?.root.findByProps({ accessibilityRole: 'summary' });

    expect(summary).toBeDefined();
    expect(summary?.props.accessibilityLabel).toContain(sampleCard.lastFour);
    expect(summary?.props.accessibilityLabel).toContain(
      resources.es.translation.card.types.VISA_DEBIT,
    );
  });

  it('mounts the CardStatusActions toolbar alongside the StatusCard on the final step', async () => {
    const component = await renderRenderer({
      currentStep: STEPPER_MAX_STEP,
      selectedCard: sampleCard,
    });

    const toolbar = component?.root.findAll(
      (node) =>
        node.props.testID === 'card-status-actions' && node.props.accessibilityRole === 'toolbar',
    )?.[0];

    expect(toolbar).toBeDefined();
  });

  it('renders a fallback message on the final step when no card has been selected', async () => {
    const component = await renderRenderer({
      currentStep: STEPPER_MAX_STEP,
      selectedCard: null,
    });
    const tree = JSON.stringify(component?.toJSON());

    expect(tree).toContain(resources.es.translation.stepper.status.fallback);
    expect(component?.root.findAllByProps({ accessibilityRole: 'summary' })).toHaveLength(0);
  });

  it('exposes a step-aware testID and an accessibility label that includes the step number and name', async () => {
    const component = await renderRenderer({ currentStep: 2 });

    const stepView = component?.root.findByProps({ testID: 'step-renderer-step-2' });

    expect(stepView).toBeDefined();
    expect(stepView?.props.accessibilityLabel).toContain('2');
    expect(stepView?.props.accessibilityLabel).toContain(STEPPER_MAX_STEP.toString());
    expect(stepView?.props.accessibilityLabel).toContain(
      resources.es.translation.stepper.steps.details,
    );
  });

  it.each([
    [1, resources.es.translation.stepper.steps.intro],
    [2, resources.es.translation.stepper.steps.details],
    [STEPPER_MAX_STEP, resources.es.translation.stepper.steps.status],
  ] as const)('announces step %i with its translated name in the accessibility label', async (step, name) => {
    const component = await renderRenderer({ currentStep: step });
    const stepView = component?.root.findByProps({ testID: `step-renderer-step-${step}` });

    expect(stepView?.props.accessibilityLabel).toContain(name);
  });

  it('marks the step container as a polite live region so transitions are announced', async () => {
    const component = await renderRenderer({ currentStep: 1 });
    const stepView = component?.root.findByProps({ testID: 'step-renderer-step-1' });

    expect(stepView?.props.accessibilityLiveRegion).toBe('polite');
  });

  it('clamps out-of-range steps into the valid range before rendering', async () => {
    const componentLow = await renderRenderer({ currentStep: 0 });
    const componentHigh = await renderRenderer({
      currentStep: 99,
      selectedCard: sampleCard,
    });

    expect(componentLow?.root.findByProps({ testID: 'step-renderer-step-1' })).toBeDefined();
    expect(
      componentHigh?.root.findByProps({ testID: `step-renderer-step-${STEPPER_MAX_STEP}` }),
    ).toBeDefined();
  });

  it('throws a descriptive error when rendered outside of <StepperProvider>', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      ReactTestRenderer.act(() => {
        ReactTestRenderer.create(<StepRenderer />);
      });
    }).toThrow(/StepperProvider/);

    consoleError.mockRestore();
  });
});
