import ReactTestRenderer from 'react-test-renderer';

import '../../../../app/i18n';

import { resources } from '../../../../app/i18n';
import { colors } from '../../../../components/ui/theme';
import type { CardStatus, FinancialCard } from '../../types';
import { StatusCard } from '../StatusCard';

const buildCard = (overrides: Partial<FinancialCard> = {}): FinancialCard => ({
  id: 'v-1234',
  type: 'VISA_DEBIT',
  lastFour: '4582',
  holderName: 'MAX SANTANA',
  status: { kind: 'enabled' } as CardStatus,
  balance: 150500.25,
  expiryDate: '12/28',
  ...overrides,
});

const renderCard = async (card: FinancialCard) => {
  let component: ReactTestRenderer.ReactTestRenderer | undefined;

  await ReactTestRenderer.act(() => {
    component = ReactTestRenderer.create(<StatusCard card={card} />);
  });

  return component;
};

describe('StatusCard', () => {
  it('renders the cardholder name, last four digits and expiry date', async () => {
    const component = await renderCard(buildCard());
    const tree = JSON.stringify(component?.toJSON());

    expect(tree).toContain('MAX SANTANA');
    expect(tree).toContain('4582');
    expect(tree).toContain('12/28');
  });

  it('uses translated status copy from the i18n resources (es)', async () => {
    const component = await renderCard(buildCard({ status: { kind: 'enabled' } }));
    const tree = JSON.stringify(component?.toJSON());

    expect(tree).toContain(resources.es.translation.card.statuses.enabled);
    expect(tree).toContain(resources.es.translation.card.labels.balance);
    expect(tree).toContain(resources.es.translation.card.labels.holderName);
  });

  it('exposes the i18n a11y summary on the root element', async () => {
    const component = await renderCard(buildCard());
    const root = component?.root.findByProps({ accessibilityRole: 'summary' });

    expect(root).toBeDefined();
    expect(root?.props.accessibilityLabel).toContain(
      resources.es.translation.card.types.VISA_DEBIT,
    );
    expect(root?.props.accessibilityLabel).toContain('4582');
    expect(root?.props.accessibilityLabel).toContain(
      resources.es.translation.card.statuses.enabled,
    );
  });

  it.each([
    ['enabled', colors.success],
    ['disabled', colors.danger],
    ['paused', colors.warning],
    ['unpaused', colors.info],
  ] as const)('applies the accent color for status %s', async (kind, accent) => {
    const component = await renderCard(buildCard({ status: { kind } as CardStatus }));
    const root = component?.root.findByProps({ accessibilityRole: 'summary' });
    const style = root?.props.style as { borderLeftColor?: string };

    expect(style?.borderLeftColor).toBe(accent);
  });

  it('formats the balance using a locale-aware currency representation', async () => {
    const component = await renderCard(buildCard({ balance: 150500.25 }));
    const tree = JSON.stringify(component?.toJSON());

    expect(tree).toMatch(/150[.,]500/);
    expect(tree).toMatch(/ARS|\$/);
  });
});
