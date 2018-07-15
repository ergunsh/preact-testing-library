import 'jest-dom/extend-expect'
import React from 'preact'
import {render, cleanup} from '../'

afterEach(cleanup)

test('renders div into document', () => {
  const refs = {}
  const {container} = render(
    <div
      ref={el => {
        refs.el = el
      }}
    />,
  )
  expect(container.firstChild).toBe(refs.el)
})

test('returns baseElement which defaults to document.documentElement', () => {
  const {baseElement} = render(<div />)
  expect(baseElement).toBe(document.documentElement)
})

it('cleansup document', () => {
  const spy = jest.fn()

  class Test extends React.Component {
    componentWillUnmount() {
      spy()
    }

    render() {
      return <div />
    }
  }

  render(<Test />)
  cleanup()
  expect(document.body.innerHTML).toBe('')
  expect(spy).toHaveBeenCalledTimes(1)
})
