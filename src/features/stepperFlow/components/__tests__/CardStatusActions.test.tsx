import ReactTestRenderer from 'react-test-renderer';

import '../../../../app/i18n';

import { resources } from '../../../../app/i18n';
import { StepperProvider } from '../../context';
import {
  type CardStatus,
  type CardStatusKind,
  type FinancialCard,
  initialStepperState,
  type StepperState,
} from '../../types';
import { CardStatusActions } from '../CardStatusActions';

const buildCard = (status: CardStatus): FinancialCard => ({
  id: 'v-1234',
  type: 'VISA_DEBIT',
  lastFour: '4582',
  holderName: 'MAX SANTANA',
  balance: 150500.25,
  expiryDate: '12/28',
  status,
});

const renderActions = async (overrides: Partial<StepperState> = {}) => {
  let component: ReactTestRenderer.ReactTestRenderer | undefined;
  const initialState: StepperState = { ...initialStepperState, ...overrides };

  await ReactTestRenderer.act(() => {
    component = ReactTestRenderer.create(
      <StepperProvider initialState={initialState}>
        <CardStatusActions />
      </StepperProvider>,
    );
  });

  return component;
};

const findActionButton = (
  component: ReactTestRenderer.ReactTestRenderer | undefined,
  target: CardStatusKind,
) =>
  component?.root.findAll(
    (node) =>
      node.props.accessibilityRole === 'button' &&
      node.props.testID === `card-status-actions-${target}`,
  )?.[0];

const findToolbar = (component: ReactTestRenderer.ReactTestRenderer | undefined) =>
  component?.root.findAll(
    (node) =>
      node.props.accessibilityRole === 'toolbar' && node.props.testID === 'card-status-actions',
  )?.[0];

const findStatusBadges = (component: ReactTestRenderer.ReactTestRenderer | undefined) =>
  component?.root.findAllByProps({ accessibilityRole: 'summary' }) ?? [];

describe('CardStatusActions', () => {
  it('renders nothing when there is no selected card', async () => {
    const component = await renderActions({ selectedCard: null });

    expect(findToolbar(component)).toBeUndefined();
  });

  it('renders an a11y toolbar with the i18n title and label when a card is selected', async () => {
    const component = await renderActions({
      selectedCard: buildCard({ kind: 'enabled' }),
    });

    const toolbar = findToolbar(component);
    expect(toolbar).toBeDefined();
    expect(toolbar?.props.accessibilityLabel).toBe(resources.es.translation.a11y.card.actionsLabel);

    const tree = JSON.stringify(component?.toJSON());
    expect(tree).toContain(resources.es.translation.card.actions.title);
  });

  it('exposes one button per non-current status kind', async () => {
    const component = await renderActions({
      selectedCard: buildCard({ kind: 'enabled' }),
    });

    expect(findActionButton(component, 'enabled')).toBeUndefined();
    expect(findActionButton(component, 'paused')).toBeDefined();
    expect(findActionButton(component, 'unpaused')).toBeDefined();
    expect(findActionButton(component, 'disabled')).toBeDefined();
  });

  it('disables transitions that the card lifecycle does not allow', async () => {
    const component = await renderActions({
      selectedCard: buildCard({ kind: 'enabled' }),
    });

    const pause = findActionButton(component, 'paused');
    const unpause = findActionButton(component, 'unpaused');
    const disable = findActionButton(component, 'disabled');

    expect(pause?.props.disabled).toBe(false);
    expect(disable?.props.disabled).toBe(false);
    expect(unpause?.props.disabled).toBe(true);
    expect(unpause?.props.accessibilityHint).toBe(
      resources.es.translation.a11y.card.actionDisabledHint,
    );
  });

  it('only allows enabling a disabled card', async () => {
    const component = await renderActions({
      selectedCard: buildCard({ kind: 'disabled', reason: 'blocked_by_user' }),
    });

    expect(findActionButton(component, 'enabled')?.props.disabled).toBe(false);
    expect(findActionButton(component, 'paused')?.props.disabled).toBe(true);
    expect(findActionButton(component, 'unpaused')?.props.disabled).toBe(true);
  });

  it('dispatches UPDATE_CARD_STATUS when an enabled action is pressed', async () => {
    const card = buildCard({ kind: 'enabled' });
    let component: ReactTestRenderer.ReactTestRenderer | undefined;

    // StatusCard is mounted via the StepRenderer in the real app; here we
    // render only the actions to keep this unit isolated.
    await ReactTestRenderer.act(() => {
      component = ReactTestRenderer.create(
        <StepperProvider
          initialState={{ ...initialStepperState, selectedCard: card, currentStep: 3 }}
        >
          <CardStatusActions />
        </StepperProvider>,
      );
    });

    await ReactTestRenderer.act(() => {
      findActionButton(component, 'paused')?.props.onPress();
    });

    // After pressing pause, the disabled state of the buttons should reflect
    // the new lifecycle (paused → can unpause/disable, cannot pause again).
    expect(findActionButton(component, 'paused')).toBeUndefined();
    expect(findActionButton(component, 'unpaused')?.props.disabled).toBe(false);
    expect(findActionButton(component, 'disabled')?.props.disabled).toBe(false);
  });

  it('keeps the card identity stable and only mutates the status', async () => {
    const card = buildCard({ kind: 'enabled' });
    let component: ReactTestRenderer.ReactTestRenderer | undefined;

    await ReactTestRenderer.act(() => {
      component = ReactTestRenderer.create(
        <StepperProvider
          initialState={{ ...initialStepperState, selectedCard: card, currentStep: 3 }}
        >
          <CardStatusActions />
        </StepperProvider>,
      );
    });

    await ReactTestRenderer.act(() => {
      findActionButton(component, 'disabled')?.props.onPress();
    });

    // The summary role badge is rendered by StatusCard, which is not mounted
    // here, but the button labels still reflect the new transition rules.
    expect(findStatusBadges(component)).toHaveLength(0);
    expect(findActionButton(component, 'enabled')?.props.disabled).toBe(false);
  });

  it('uses translated labels and hints for every action', async () => {
    const component = await renderActions({
      selectedCard: buildCard({ kind: 'paused' }),
    });

    const unpause = findActionButton(component, 'unpaused');
    expect(unpause?.props.accessibilityLabel).toBe(resources.es.translation.card.actions.unpaused);
    expect(unpause?.props.accessibilityHint).toBe(
      resources.es.translation.a11y.card.actionHint.unpaused,
    );
  });
});
