import React from 'react'

import '@testing-library/jest-dom'
import { render, fireEvent } from '@testing-library/react'

import useAsync from './useAsync'

import * as ClientStore from './stores/ClientStore/ClientStore'

const initialState = '::initialState::'

const action = '::ACTION::'
const payload = '::payload::'
const dispatch = jest.fn()
const actions = { [action]: dispatch }
const agent = {}

const TestComponent = () => {
  const [state, dispatch] = useAsync(actions, initialState)

  const onDispatch = () => dispatch({ type: action, payload })

  return (
    <>
      <h1>State: {state}</h1>
      <button onClick={onDispatch}>::button::</button>
    </>
  )
}

const TestGlobal = () => (
  <ClientStore.Provider {...{ agent }}>
    <TestComponent />
  </ClientStore.Provider>
)

afterEach(() => {
  jest.clearAllMocks()
})

test('Should keep state', () => {
  const { getByText } = render(<TestGlobal />)
  expect(getByText(/^State:/)).toHaveTextContent(`State: ${initialState}`)
})

test('Should use dispatchs', () => {
  const { getByRole } = render(<TestGlobal />)

  fireEvent.click(getByRole('button'))
  expect(dispatch).toHaveBeenCalledTimes(1)
  expect(dispatch).toHaveBeenCalledWith(initialState, payload)
})
