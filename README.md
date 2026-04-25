# Stepper Card

React Native project for the Stepper & Status Card flow.

## Getting Started

Make sure you have completed the React Native environment setup before running the app.

Start Metro:

```sh
pnpm start
```

Run Android:

```sh
pnpm android
```

Run iOS:

```sh
pnpm ios
```

## Quality Checks

Run Biome:

```sh
pnpm check
```

Run Jest:

```sh
pnpm test
```

## i18n

The project uses `i18next` and `react-i18next`.

Translation resources live in:

- `src/app/i18n/resources/es.json`
- `src/app/i18n/resources/en.json`

Spanish (`es`) is the default and fallback language. All user-facing text and accessibility copy must use translation keys instead of hardcoded strings.

Use domain-based keys:

- `common.*` for shared app copy.
- `home.*` for the initial screen.
- `stepper.*` for navigation and step labels.
- `card.*` for card labels and status values.
- `a11y.*` for `accessibilityLabel` and `accessibilityHint`.

When adding a new key, add it to both `es.json` and `en.json`. The i18n contract test validates that both files expose the same translation keys.
