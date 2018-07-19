import preact from 'preact'
import {getQueriesForElement, prettyDOM} from 'dom-testing-library'

const mountedContainers = new Set()

function render(ui, {container, baseElement = container, domNode} = {}) {
  if (!container) {
    baseElement = document.documentElement
    container = document.body.appendChild(document.createElement('div'))
  }

  // we'll add it to the mounted containers regardless of whether it's actually
  // added to document.body so the cleanup method works regardless of whether
  // they're passing us a custom container or not.
  mountedContainers.add(container)

  const newDomNode = preact.render(ui, container, domNode)
  return {
    container,
    baseElement,
    // eslint-disable-next-line no-console
    debug: (el = baseElement) => console.log(prettyDOM(el)),
    unmount: () => preact.render(null, container, newDomNode),
    rerender: rerenderUi => {
      render(rerenderUi, {container, baseElement, domNode: newDomNode})
      // Intentionally do not return anything to avoid unnecessarily complicating the API.
      // folks can use all the same utilities we return in the first place that are bound to the container
    },
    ...getQueriesForElement(baseElement),
  }
}

function cleanup() {
  mountedContainers.forEach(cleanupAtContainer)
}

// maybe one day we'll expose this (perhaps even as a utility returned by render).
// but let's wait until someone asks for it.
function cleanupAtContainer(container) {
  if (container.parentNode === document.body) {
    document.body.removeChild(container)
  }
  Array.prototype.forEach.call(container.children, child => {
    preact.render(null, container, child)
  })
  mountedContainers.delete(container)
}

// just re-export everything from dom-testing-library
export * from 'dom-testing-library'
export {render, cleanup}
