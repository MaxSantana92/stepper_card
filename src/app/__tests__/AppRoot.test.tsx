import ReactTestRenderer from 'react-test-renderer';

import { AppRoot } from '../AppRoot';
import { resources } from '../i18n';

describe('AppRoot entry', () => {
  it('renders the initial app screen using i18n resources', async () => {
    let component: ReactTestRenderer.ReactTestRenderer | undefined;

    await ReactTestRenderer.act(() => {
      component = ReactTestRenderer.create(<AppRoot />);
    });

    const tree = JSON.stringify(component?.toJSON());

    expect(tree).toContain(resources.es.translation.common.appTitle);
    expect(tree).toContain(resources.es.translation.home.readyToStart);
  });
});
