import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

describe('App entry', () => {
  it('renders the initial app screen', async () => {
    let component: ReactTestRenderer.ReactTestRenderer | undefined;

    await ReactTestRenderer.act(() => {
      component = ReactTestRenderer.create(<App />);
    });

    const tree = JSON.stringify(component?.toJSON());

    expect(tree).toContain('Stepper Card');
    expect(tree).toContain('Listo para empezar a desarrollar.');
  });
});
