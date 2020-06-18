
import React, { useContext } from 'react'

import '@testing-library/jest-dom'
import { render } from '@testing-library/react'

import * as ClientStore from './ClientStore'

const TestComponent = () => {
  const agent = useContext(ClientStore.Context)
  return <h1>Agent: {agent}</h1>
}

test('Initial context', () => {
  const result = ClientStore.initial()
  expect(result).toBeUndefined()
})

test('Value of the provider should be the agent prop', () => {
  const agent = '::agent::'
  const { getByText } = render((
    <ClientStore.Provider {...{ agent }}>
      <TestComponent />
    </ClientStore.Provider>
  ))

  expect(getByText(/^Agent:/)).toHaveTextContent(`Agent: ${agent}`)
})
