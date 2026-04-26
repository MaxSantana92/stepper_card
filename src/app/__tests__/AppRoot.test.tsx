import ReactTestRenderer from 'react-test-renderer';

import type { FinancialCard } from '../../features/stepperFlow/types';
import mockData from '../../services/mockData.json';
import { AppRoot } from '../AppRoot';
import i18n, { defaultLanguage, resources } from '../i18n';

const cards = mockData.cards as FinancialCard[];

const renderApp = async () => {
  let component: ReactTestRenderer.ReactTestRenderer | undefined;

  await ReactTestRenderer.act(() => {
    component = ReactTestRenderer.create(<AppRoot />);
  });

  return component;
};

const findByTestID = (component: ReactTestRenderer.ReactTestRenderer | undefined, testID: string) =>
  component?.root.findAllByProps({ testID })?.[0];

const findStepView = (component: ReactTestRenderer.ReactTestRenderer | undefined, step: number) =>
  component?.root.findAll(
    (node) =>
      node.props.testID === `step-renderer-step-${step}` && node.props.accessibilityRole === 'none',
  )?.[0];

const findPressable = (
  component: ReactTestRenderer.ReactTestRenderer | undefined,
  testID: string,
) =>
  component?.root.findAll(
    (node) => node.props.accessibilityRole === 'button' && node.props.testID === testID,
  )?.[0];

const findCardPicker = (component: ReactTestRenderer.ReactTestRenderer | undefined) =>
  component?.root.findAll(
    (node) =>
      node.props.testID === 'app-root-card-picker' && node.props.accessibilityRole === 'radiogroup',
  )?.[0];

const findCardCarouselFlatList = (component: ReactTestRenderer.ReactTestRenderer | undefined) =>
  component?.root.findAll(
    (node) =>
      node.props.testID === 'app-root-card-picker' &&
      typeof node.props.onViewableItemsChanged === 'function',
  )?.[0];

// react-test-renderer's `findAll` returns both the React component instance
// (e.g. `Pressable`) and its host `View` descendant. Both expose the same
// `testID` and `accessibilityRole`, but only the component instance carries
// the original `onPress` handler we need to fire from the tests. The extra
// `typeof onPress === 'function'` guard keeps the result list focused on the
// interactive nodes and stable in length (one entry per mock card).
const findCardOptions = (component: ReactTestRenderer.ReactTestRenderer | undefined) =>
  component?.root.findAll(
    (node) =>
      typeof node.props.testID === 'string' &&
      node.props.testID.startsWith('app-root-card-option-') &&
      node.props.accessibilityRole === 'button' &&
      typeof node.props.onPress === 'function',
  ) ?? [];

const findCardDots = (component: ReactTestRenderer.ReactTestRenderer | undefined) => {
  const matches =
    component?.root.findAll(
      (node) =>
        typeof node.props.testID === 'string' && node.props.testID.startsWith('app-root-card-dot-'),
    ) ?? [];
  // Each dot is a single `<View>` but `findAll` returns both the component
  // instance and its host fiber, so we deduplicate by testID.
  const seen = new Set<string>();
  return matches.filter((node) => {
    const id = node.props.testID as string;
    if (seen.has(id)) {
      return false;
    }
    seen.add(id);
    return true;
  });
};

const findCardDotsContainer = (component: ReactTestRenderer.ReactTestRenderer | undefined) =>
  component?.root.findAll((node) => node.props.testID === 'app-root-card-dots')?.[0];

const pressNext = async (component: ReactTestRenderer.ReactTestRenderer | undefined) => {
  await ReactTestRenderer.act(() => {
    findPressable(component, 'navigation-controls-next')?.props.onPress();
  });
};

const pressBack = async (component: ReactTestRenderer.ReactTestRenderer | undefined) => {
  await ReactTestRenderer.act(() => {
    findPressable(component, 'navigation-controls-back')?.props.onPress();
  });
};

describe('AppRoot integration', () => {
  beforeEach(async () => {
    await ReactTestRenderer.act(async () => {
      await i18n.changeLanguage(defaultLanguage);
    });
  });

  it('renders the app header with the i18n title and flow intro copy', async () => {
    const component = await renderApp();
    const tree = JSON.stringify(component?.toJSON());

    expect(tree).toContain(resources.es.translation.common.appTitle);
    expect(tree).toContain(resources.es.translation.home.flowIntro);
  });

  it('toggles the app language from Spanish to English from the header button', async () => {
    const component = await renderApp();

    expect(findPressable(component, 'language-toggle-button')?.props.accessibilityLabel).toBe(
      resources.es.translation.home.languageSwitch.en,
    );
    expect(JSON.stringify(component?.toJSON())).toContain(
      resources.es.translation.stepper.steps.intro,
    );

    await ReactTestRenderer.act(() => {
      findPressable(component, 'language-toggle-button')?.props.onPress();
    });

    const treeAfterToggle = JSON.stringify(component?.toJSON());
    expect(treeAfterToggle).toContain(resources.en.translation.stepper.steps.intro);
    expect(treeAfterToggle).toContain(resources.en.translation.home.flowIntro);
    expect(findPressable(component, 'language-toggle-button')?.props.accessibilityLabel).toBe(
      resources.en.translation.home.languageSwitch.es,
    );
  });

  it('mounts a single StepperProvider exposing the stepper UI on the first step', async () => {
    const component = await renderApp();

    expect(findStepView(component, 1)).toBeDefined();
    expect(findStepView(component, 2)).toBeUndefined();
    expect(findStepView(component, 3)).toBeUndefined();
    expect(findByTestID(component, 'navigation-controls')).toBeDefined();
    expect(findPressable(component, 'navigation-controls-back')?.props.disabled).toBe(true);
  });

  it('renders the StepIndicator reflecting the current step from the context', async () => {
    const component = await renderApp();
    const progressbar = component?.root.findByProps({ accessibilityRole: 'progressbar' });

    expect(progressbar?.props.accessibilityValue).toMatchObject({ now: 1, min: 1, max: 3 });

    await pressNext(component);

    const progressbarAfter = component?.root.findByProps({ accessibilityRole: 'progressbar' });
    expect(progressbarAfter?.props.accessibilityValue.now).toBe(2);
  });

  it('shows the card picker only on step 2 with one selectable item per mock card', async () => {
    const component = await renderApp();

    expect(findCardPicker(component)).toBeUndefined();

    await pressNext(component);

    const picker = findCardPicker(component);
    expect(picker).toBeDefined();
    expect(picker?.props.accessibilityLabel).toBe(
      resources.es.translation.a11y.stepper.cardPickerLabel,
    );

    const options = findCardOptions(component);
    expect(options.length).toBeGreaterThan(0);
  });

  it('auto-selects the first card on entering step 2 and advances to step 3 with a tapped card', async () => {
    const component = await renderApp();

    await pressNext(component);

    const optionsOnEntry = findCardOptions(component);
    expect(optionsOnEntry[0]?.props.accessibilityState).toMatchObject({ selected: true });
    expect(findPressable(component, 'navigation-controls-next')?.props.disabled).toBe(false);

    const thirdOption = findCardOptions(component)[2];

    await ReactTestRenderer.act(() => {
      thirdOption?.props.onPress();
    });

    const optionsAfterTap = findCardOptions(component);
    expect(optionsAfterTap[2]?.props.accessibilityState).toMatchObject({ selected: true });
    expect(optionsAfterTap[0]?.props.accessibilityState).toMatchObject({ selected: false });

    await pressNext(component);

    expect(findStepView(component, 3)).toBeDefined();
    const summary = component?.root.findByProps({ accessibilityRole: 'summary' });
    expect(summary).toBeDefined();
    expect(summary?.props.accessibilityLabel).toContain(
      resources.es.translation.card.types[cards[2]?.type ?? 'VISA_DEBIT'],
    );
  });

  it('syncs selectedCard with the carousel viewport via onViewableItemsChanged', async () => {
    const component = await renderApp();

    await pressNext(component);

    const flatList = findCardCarouselFlatList(component);
    expect(flatList).toBeDefined();

    await ReactTestRenderer.act(() => {
      flatList?.props.onViewableItemsChanged({
        viewableItems: [
          {
            item: cards[2],
            key: cards[2]?.id,
            index: 2,
            isViewable: true,
          },
        ],
        changed: [],
      });
    });

    const optionsAfterScroll = findCardOptions(component);
    expect(optionsAfterScroll[2]?.props.accessibilityState).toMatchObject({ selected: true });
    expect(optionsAfterScroll[0]?.props.accessibilityState).toMatchObject({ selected: false });
  });

  it('preserves the selected card when navigating back and forth between steps', async () => {
    const component = await renderApp();

    await pressNext(component);
    const secondOption = findCardOptions(component)[1];

    await ReactTestRenderer.act(() => {
      secondOption?.props.onPress();
    });
    await pressNext(component);

    expect(findStepView(component, 3)).toBeDefined();

    await pressBack(component);

    expect(findStepView(component, 2)).toBeDefined();
    const reSelectedOption = findCardOptions(component)[1];
    expect(reSelectedOption?.props.accessibilityState).toMatchObject({ selected: true });

    await pressNext(component);
    expect(findStepView(component, 3)).toBeDefined();
  });

  it('renders one pagination dot per card and highlights the one that matches the selection', async () => {
    const component = await renderApp();

    expect(findCardDots(component)).toHaveLength(0);
    expect(findCardDotsContainer(component)).toBeUndefined();

    await pressNext(component);

    const dotsContainer = findCardDotsContainer(component);
    expect(dotsContainer).toBeDefined();
    expect(dotsContainer?.props.accessibilityElementsHidden).toBe(true);
    expect(dotsContainer?.props.importantForAccessibility).toBe('no-hide-descendants');

    const dotsOnEntry = findCardDots(component);
    expect(dotsOnEntry).toHaveLength(cards.length);

    // Auto-selection lands on the first card, so the first dot is the active
    // one. We assert the active dot by checking the highlighted background.
    const activeDotsOnEntry = dotsOnEntry.filter((dot) => {
      const styles = Array.isArray(dot.props.style) ? dot.props.style : [dot.props.style];
      return styles.some(
        (entry: { backgroundColor?: string } | null | undefined) =>
          entry?.backgroundColor !== undefined && entry.backgroundColor !== '#cbd5e1',
      );
    });
    expect(activeDotsOnEntry).toHaveLength(1);

    const flatList = findCardCarouselFlatList(component);
    await ReactTestRenderer.act(() => {
      flatList?.props.onViewableItemsChanged({
        viewableItems: [
          {
            item: cards[2],
            key: cards[2]?.id,
            index: 2,
            isViewable: true,
          },
        ],
        changed: [],
      });
    });

    const dotsAfterScroll = findCardDots(component);
    const expectedActiveTestId = `app-root-card-dot-${cards[2]?.id}`;
    const activeDot = dotsAfterScroll.find((dot) => dot.props.testID === expectedActiveTestId);
    expect(activeDot).toBeDefined();
    const activeStyles = Array.isArray(activeDot?.props.style)
      ? activeDot?.props.style
      : [activeDot?.props.style];
    expect(activeStyles?.some((s: { width?: number } | null | undefined) => s?.width === 10)).toBe(
      true,
    );
  });

  it('does not render any standalone StatusCard outside of the stepper flow', async () => {
    const component = await renderApp();

    const summaries = component?.root.findAllByProps({ accessibilityRole: 'summary' }) ?? [];
    expect(summaries.length).toBe(0);
  });
});
