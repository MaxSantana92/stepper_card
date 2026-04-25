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

  it('exposes the text accessibility role on the container View as well', async () => {
    let component: ReactTestRenderer.ReactTestRenderer | undefined;

    await ReactTestRenderer.act(() => {
      component = ReactTestRenderer.create(<Badge label="Habilitada" status="enabled" />);
    });

    const innerText = component?.root.findByProps({ children: 'Habilitada' });
    const container = innerText?.parent;

    expect(container?.props.accessible).toBe(true);
    expect(container?.props.accessibilityRole).toBe('text');
    expect(container?.props.accessibilityLabel).toBe('Habilitada');
  });

  it('honors a custom accessibility label without breaking the role', async () => {
    let component: ReactTestRenderer.ReactTestRenderer | undefined;

    await ReactTestRenderer.act(() => {
      component = ReactTestRenderer.create(
        <Badge accessibilityLabel="Estado habilitado" label="Habilitada" status="enabled" />,
      );
    });

    const innerText = component?.root.findByProps({ children: 'Habilitada' });
    const container = innerText?.parent;

    expect(container?.props.accessibilityLabel).toBe('Estado habilitado');
    expect(container?.props.accessibilityRole).toBe('text');
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

    const innerText = component?.root.findByProps({ children: status });
    const container = innerText?.parent;
    const containerStyle = container?.props.style as { backgroundColor?: string };
    const textStyle = innerText?.props.style as { color?: string };

    expect(containerStyle?.backgroundColor).toBe(background);
    expect(textStyle?.color).toBe(foreground);
  });
});
