import { Text } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';

import { Body, Heading, Subtitle } from '../Typography';
import { typography } from '../theme';

const renderText = async (node: React.ReactElement) => {
  let component: ReactTestRenderer.ReactTestRenderer | undefined;

  await ReactTestRenderer.act(() => {
    component = ReactTestRenderer.create(node);
  });

  return component?.root.findAllByType(Text)[0];
};

describe('Typography', () => {
  it('Heading renders the provided text and applies header role', async () => {
    const text = await renderText(<Heading>Welcome</Heading>);

    expect(text).toBeDefined();
    expect(text?.props.children).toBe('Welcome');
    expect(text?.props.accessibilityRole).toBe('header');
    expect(text?.props.style).toMatchObject({ fontSize: typography.heading.fontSize });
  });

  it('Subtitle renders text with subtitle styles', async () => {
    const text = await renderText(<Subtitle>Subtitle copy</Subtitle>);

    expect(text?.props.children).toBe('Subtitle copy');
    expect(text?.props.style).toMatchObject({ fontSize: typography.subtitle.fontSize });
  });

  it('Body renders text with body styles', async () => {
    const text = await renderText(<Body>Body copy</Body>);

    expect(text?.props.children).toBe('Body copy');
    expect(text?.props.style).toMatchObject({ fontSize: typography.body.fontSize });
  });
});
