import React from 'react'

import { render } from '@testing-library/react'

import useAsync from './useAsync'

import uuid from './utils/uuid/uuid'
import reducer from './utils/reducer/reducer'
import * as ClientStore from './stores/ClientStore/ClientStore'

const mockUUID = '::uuid::'
const initialState = '::initialState::'

const actions = { ACTION: () => {} }
const agent = { connect: jest.fn() }

jest.mock('./utils/uuid/uuid', () => jest.fn(() => mockUUID))
jest.mock('./utils/reducer/reducer', () => jest.fn(() => {}).mockReturnValue(jest.fn(() => {})))

const TestComponent = ({ actions, initialState }) => {
  useAsync(actions, initialState)
  return <div />
}

const TestGlobal = (config) => (
  <ClientStore.Provider {...{ agent }}>
    <TestComponent {...config} />
  </ClientStore.Provider>
)

afterEach(() => {
  jest.clearAllMocks()
})

test('Should generate new uuid', () => {
  render(<TestGlobal {...{ actions, initialState }} />)

  expect(uuid).toBeCalledTimes(1)
  expect(uuid).toBeCalledWith()
})

test('Should use reducer', () => {
  render(<TestGlobal {...{ actions, initialState }} />)
  expect(reducer).toBeCalledTimes(1)
  expect(reducer).toBeCalledWith(mockUUID, actions, agent)
})

test('Should use client connect', () => {
  render(<TestGlobal {...{ actions, initialState }} />)
  expect(agent.connect).toBeCalledTimes(1)
  expect(agent.connect).toBeCalledWith({ state: initialState })
})

test('Should use client with empty state', () => {
  render(<TestGlobal {...{ actions }} />)
  expect(agent.connect).toBeCalledTimes(1)
  expect(agent.connect).toBeCalledWith({ state: {} })
})

test('Should keep dispatchs', () => {
  render(<TestGlobal {...{ actions, initialState }} />)
  expect(agent.dispatchs).toHaveProperty(mockUUID)
  expect(agent.dispatchs[mockUUID]).toBeInstanceOf(Function)
})
