import ReactTestRenderer from 'react-test-renderer';

import { Badge } from '../Badge';
import { colors } from '../theme';

describe('Badge', () => {
  it('renders the label and uses the text accessibility role', async () => {
    let component: ReactTestRenderer.ReactTestRenderer | undefined;

    await ReactTestRenderer.act(() => {
      component = ReactTestRenderer.create(<Badge label="Habilitada" status="enabled" />);
    });

    const text = component?.root.findByProps({ children: 'Habilitada' });

    expect(text).toBeDefined();
    expect(text?.props.accessibilityRole).toBe('text');
  });

  it.each([
    ['enabled', colors.success, colors.successSurface],
    ['disabled', colors.danger, colors.dangerSurface],
    ['paused', colors.warning, colors.warningSurface],
    ['unpaused', colors.info, colors.infoSurface],
  ] as const)('maps status %s to its expected color tokens', async (status, foreground, background) => {
    let component: ReactTestRenderer.ReactTestRenderer | undefined;

    await ReactTestRenderer.act(() => {
      component = ReactTestRenderer.create(<Badge label={status} status={status} />);
    });

    const container = component?.root.findByProps({ accessibilityRole: 'text' }).parent;
    const containerStyle = container?.props.style as { backgroundColor?: string };
    const textStyle = component?.root.findByProps({ accessibilityRole: 'text' }).props.style as {
      color?: string;
    };

    expect(containerStyle?.backgroundColor).toBe(background);
    expect(textStyle?.color).toBe(foreground);
  });
});
