import ReactTestRenderer from 'react-test-renderer'
import App from '../App'
import { resources } from '../src/app/i18n'

describe('App entry', () => {
  it('renders the initial app screen', async () => {
    let component: ReactTestRenderer.ReactTestRenderer | undefined

    await ReactTestRenderer.act(() => {
      component = ReactTestRenderer.create(<App />)
    })

    const tree = JSON.stringify(component?.toJSON())

    expect(tree).toContain('Stepper Card')
    expect(tree).toContain('Listo para empezar a desarrollar.')
  })

  const tree = JSON.stringify(component?.toJSON())

  expect(tree).toContain(resources.es.translation.common.appTitle)
  expect(tree).toContain(resources.es.translation.home.readyToStart)
})
