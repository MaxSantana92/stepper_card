jest.mock('react-native-safe-area-context', () => {
  const React = require('react');

  return {
    SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
  };
});

// `FlatList` virtualises its items, so under react-test-renderer only the
// initial window is rendered and any test that needs to interact with
// off-screen rows fails non-deterministically. We swap it for a non-virtual
// implementation that renders every item synchronously and forwards the
// props the production code relies on (testID, accessibility metadata,
// `onViewableItemsChanged`). This keeps the tests focused on behaviour
// instead of on virtualization timers.
//
// The mock is wired through the public `react-native` entry point because
// RN 0.85 exposes `FlatList` via a getter and Jest cannot intercept the
// internal `Libraries/Lists/FlatList` path consistently across versions.
// jest.mock factories cannot reference types from the outer scope, so the
// mock falls back to dynamic typing for the public RN module and the
// FlatList props.
// biome-ignore lint/suspicious/noExplicitAny: see comment above.
type AnyRecord = Record<string, any>;

jest.mock('react-native', () => {
  const ActualRN = jest.requireActual<AnyRecord>('react-native');
  const React = require('react') as AnyRecord;
  const { View } = ActualRN;

  const noop = () => {};

  const MockFlatList = (props: AnyRecord) => {
    const {
      data,
      renderItem,
      keyExtractor,
      ListEmptyComponent,
      accessibilityLabel,
      accessibilityRole,
      accessible,
      testID,
      style,
      contentContainerStyle,
      onViewableItemsChanged,
    } = props;

    const items = Array.isArray(data) ? data : [];

    if (items.length === 0 && ListEmptyComponent) {
      return React.createElement(
        View,
        { accessibilityLabel, accessibilityRole, accessible, testID, style },
        ListEmptyComponent,
      );
    }

    return React.createElement(
      View,
      {
        accessibilityLabel,
        accessibilityRole,
        accessible,
        testID,
        style: [style, contentContainerStyle],
        onViewableItemsChanged,
      },
      items.map((item: unknown, index: number) => {
        const key = keyExtractor ? keyExtractor(item, index) : String(index);
        const node = renderItem
          ? renderItem({
              item,
              index,
              separators: {
                highlight: noop,
                unhighlight: noop,
                updateProps: noop,
              },
            })
          : null;
        return React.createElement(View, { key }, node);
      }),
    );
  };

  MockFlatList.displayName = 'MockFlatList';

  return new Proxy(ActualRN, {
    get(target, property) {
      if (property === 'FlatList') {
        return MockFlatList;
      }
      return target[property];
    },
  });
});
