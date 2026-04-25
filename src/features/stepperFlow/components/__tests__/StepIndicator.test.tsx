import ReactTestRenderer from 'react-test-renderer';

import '../../../../app/i18n';

import { colors } from '../../../../components/ui/theme';
import { STEPPER_MAX_STEP, STEPPER_MIN_STEP } from '../../types';
import { StepIndicator } from '../StepIndicator';

const renderIndicator = async (currentStep: number, totalSteps = STEPPER_MAX_STEP) => {
  let component: ReactTestRenderer.ReactTestRenderer | undefined;

  await ReactTestRenderer.act(() => {
    component = ReactTestRenderer.create(
      <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />,
    );
  });

  return component;
};

describe('StepIndicator', () => {
  it('exposes the progressbar accessibility role with min/max/now', async () => {
    const component = await renderIndicator(2);
    const progressbar = component?.root.findByProps({ accessibilityRole: 'progressbar' });

    expect(progressbar).toBeDefined();
    expect(progressbar?.props.accessibilityValue).toMatchObject({
      min: STEPPER_MIN_STEP,
      max: STEPPER_MAX_STEP,
      now: 2,
    });
  });

  const findSegment = (component: ReactTestRenderer.ReactTestRenderer | undefined, step: number) =>
    component?.root.findByProps({ testID: `step-indicator-segment-${step}` });

  it('renders one segment per step', async () => {
    const component = await renderIndicator(1, 3);

    expect(findSegment(component, 1)).toBeDefined();
    expect(findSegment(component, 2)).toBeDefined();
    expect(findSegment(component, 3)).toBeDefined();
  });

  it('marks completed and current steps with the primary color', async () => {
    const component = await renderIndicator(2, 3);

    const segment1Style = findSegment(component, 1)?.props.style as { backgroundColor?: string };
    const segment2Style = findSegment(component, 2)?.props.style as { backgroundColor?: string };
    const segment3Style = findSegment(component, 3)?.props.style as { backgroundColor?: string };

    expect(segment1Style?.backgroundColor).toBe(colors.primary);
    expect(segment2Style?.backgroundColor).toBe(colors.primary);
    expect(segment3Style?.backgroundColor).toBe(colors.border);
  });

  it('clamps currentStep to the valid range', async () => {
    const componentLow = await renderIndicator(0);
    const progressbarLow = componentLow?.root.findByProps({ accessibilityRole: 'progressbar' });

    expect(progressbarLow?.props.accessibilityValue.now).toBe(STEPPER_MIN_STEP);

    const componentHigh = await renderIndicator(99);
    const progressbarHigh = componentHigh?.root.findByProps({ accessibilityRole: 'progressbar' });

    expect(progressbarHigh?.props.accessibilityValue.now).toBe(STEPPER_MAX_STEP);
  });

  it('marks the progress region as a polite live region so changes are announced', async () => {
    const component = await renderIndicator(2);
    const progressbar = component?.root.findByProps({ accessibilityRole: 'progressbar' });

    expect(progressbar?.props.accessibilityLiveRegion).toBe('polite');
  });
});
