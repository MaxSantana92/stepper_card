import ReactTestRenderer from 'react-test-renderer';

import { Button } from '../Button';
import { colors } from '../theme';

describe('Button', () => {
  it('renders the label and exposes the button accessibility role', async () => {
    let component: ReactTestRenderer.ReactTestRenderer | undefined;

    await ReactTestRenderer.act(() => {
      component = ReactTestRenderer.create(
        <Button accessibilityLabel="Continue" onPress={() => undefined}>
          Continue
        </Button>,
      );
    });

    const text = component?.root.findByProps({ children: 'Continue' });
    const pressable = component?.root.findByProps({ accessibilityRole: 'button' });

    expect(text).toBeDefined();
    expect(pressable).toBeDefined();
    expect(pressable?.props.accessibilityLabel).toBe('Continue');
  });

  it('invokes onPress when pressed', async () => {
    const onPress = jest.fn();
    let component: ReactTestRenderer.ReactTestRenderer | undefined;

    await ReactTestRenderer.act(() => {
      component = ReactTestRenderer.create(
        <Button accessibilityLabel="Tap" onPress={onPress}>
          Tap
        </Button>,
      );
    });

    const pressable = component?.root.findByProps({ accessibilityRole: 'button' });

    await ReactTestRenderer.act(() => {
      pressable?.props.onPress();
    });

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', async () => {
    const onPress = jest.fn();
    let component: ReactTestRenderer.ReactTestRenderer | undefined;

    await ReactTestRenderer.act(() => {
      component = ReactTestRenderer.create(
        <Button accessibilityLabel="Disabled" disabled onPress={onPress}>
          Disabled
        </Button>,
      );
    });

    const pressable = component?.root.findByProps({ accessibilityRole: 'button' });

    expect(pressable?.props.disabled).toBe(true);
    expect(pressable?.props.accessibilityState).toMatchObject({ disabled: true });

    await ReactTestRenderer.act(() => {
      pressable?.props.onPress?.();
    });

    expect(onPress).not.toHaveBeenCalled();
  });

  it('applies primary styles by default (indigo background, white text)', async () => {
    let component: ReactTestRenderer.ReactTestRenderer | undefined;

    await ReactTestRenderer.act(() => {
      component = ReactTestRenderer.create(
        <Button accessibilityLabel="Primary" onPress={() => undefined}>
          Primary
        </Button>,
      );
    });

    const pressable = component?.root.findByProps({ accessibilityRole: 'button' });
    const styles = pressable?.props.style as { backgroundColor?: string };

    expect(styles?.backgroundColor).toBe(colors.primary);
  });

  it('applies outline variant styles', async () => {
    let component: ReactTestRenderer.ReactTestRenderer | undefined;

    await ReactTestRenderer.act(() => {
      component = ReactTestRenderer.create(
        <Button accessibilityLabel="Outline" onPress={() => undefined} variant="outline">
          Outline
        </Button>,
      );
    });

    const pressable = component?.root.findByProps({ accessibilityRole: 'button' });
    const styles = pressable?.props.style as {
      backgroundColor?: string;
      borderColor?: string;
      borderWidth?: number;
    };

    expect(styles?.backgroundColor).toBe(colors.background);
    expect(styles?.borderColor).toBe(colors.borderStrong);
    expect(styles?.borderWidth).toBeGreaterThan(0);
  });

  it('applies ghost variant styles', async () => {
    let component: ReactTestRenderer.ReactTestRenderer | undefined;

    await ReactTestRenderer.act(() => {
      component = ReactTestRenderer.create(
        <Button accessibilityLabel="Ghost" onPress={() => undefined} variant="ghost">
          Ghost
        </Button>,
      );
    });

    const pressable = component?.root.findByProps({ accessibilityRole: 'button' });
    const styles = pressable?.props.style as { backgroundColor?: string };

    expect(styles?.backgroundColor).toBe('transparent');
  });
});
