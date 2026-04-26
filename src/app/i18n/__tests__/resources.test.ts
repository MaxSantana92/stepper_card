import en from '../resources/en.json';
import es from '../resources/es.json';

type TranslationTree = string | { [key: string]: TranslationTree };

const collectTranslationKeys = (tree: TranslationTree, prefix = ''): string[] => {
  if (typeof tree === 'string') {
    return [prefix];
  }

  return Object.entries(tree).flatMap(([key, value]) => {
    const nextPrefix = prefix ? `${prefix}.${key}` : key;

    return collectTranslationKeys(value, nextPrefix);
  });
};

describe('i18n resources contract', () => {
  it('keeps Spanish and English translation keys in sync', () => {
    expect(collectTranslationKeys(en).sort()).toEqual(collectTranslationKeys(es).sort());
  });
});
