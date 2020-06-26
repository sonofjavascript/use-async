import AsyncBus from './asyncBus'

import { check } from './validator/validator'
jest.mock('./validator/validator')

afterEach(() => {
  check.mockImplementation(() => {})
})

test('Throw error when id is not defined', () => {
  expect(() => {
    AsyncBus()
  }).toThrowError(new Error('Unique ID identifier is not defined'))
})

test('Throw error when client is not defined', () => {
  expect(() => {
    AsyncBus('::id::')
  }).toThrowError(new Error('Client agent is not defined'))
})

test('Call check method validator', () => {
  const method = 'GET'
  const client = { get: () => Promise.resolve() }

  AsyncBus('::id::', client)({ method })

  expect(check).toHaveBeenCalledTimes(1)
  expect(check).toBeCalledWith(client.get, method)
})

test('Client method should not be executed when is invalid', () => {
  check.mockImplementation(() => {
    throw new Error('::error::')
  })

  const get = jest.fn(() => {})

  expect(() => {
    AsyncBus('::id::', { get })({ method: 'GET' })
  }).toThrowError(new Error('::error::'))

  expect(get).not.toHaveBeenCalled()
})

test('Client "GET" method is executed', () => {
  const get = jest.fn(() => Promise.resolve())
  const url = '::url::'
  const params = '::params::'

  AsyncBus('::id::', { get })({
    method: 'GET',
    url,
    params
  })

  expect(get).toHaveBeenCalledTimes(1)
  expect(get).toBeCalledWith(url, params, params)
})

test('Client "POST" method is executed', () => {
  const post = jest.fn(() => Promise.resolve())
  const url = '::url::'
  const params = '::params::'
  const body = '::body::'

  AsyncBus('::id::', { post })({
    method: 'POST',
    url,
    params,
    body
  })

  expect(post).toHaveBeenCalledTimes(1)
  expect(post).toBeCalledWith(url, body, params)
})

test('Client "PUT" method is executed', () => {
  const put = jest.fn(() => Promise.resolve())
  const url = '::url::'
  const params = '::params::'
  const body = '::body::'

  AsyncBus('::id::', { put })({
    method: 'PUT',
    url,
    params,
    body
  })

  expect(put).toHaveBeenCalledTimes(1)
  expect(put).toBeCalledWith(url, body, params)
})

test('Client "DELETE" method is executed', () => {
  const deleteMethod = jest.fn(() => Promise.resolve())
  const url = '::url::'
  const params = '::params::'
  const body = '::body::'

  AsyncBus('::id::', { delete: deleteMethod })({
    method: 'DELETE',
    url,
    params,
    body
  })

  expect(deleteMethod).toHaveBeenCalledTimes(1)
  expect(deleteMethod).toBeCalledWith(url, body, params)
})

test('Throw SUCCESS dispatch', async () => {
  const id = '::id::'
  const payload = '::payload::'
  const get = jest.fn(() => new Promise(resolve => resolve(payload)))
  const type = '::type::'

  const callbackDispatch = jest.fn(() => {})
  const dispatchs = {
    [id]: callbackDispatch
  }

  await AsyncBus(id, { get, dispatchs })({
    method: 'GET',
    type,
    payload
  })

  expect(callbackDispatch).toHaveBeenCalledTimes(1)
  expect(callbackDispatch).toBeCalledWith({ type: `${type}_SUCCESS`, payload })
})

test('Throw ERROR dispatch', async () => {
  const id = '::id::'
  const payload = '::payload::'
  const get = jest.fn(() => Promise.reject(payload))
  const type = '::type::'

  const callbackDispatch = jest.fn(() => {})
  const dispatchs = {
    [id]: callbackDispatch
  }

  await AsyncBus(id, { get, dispatchs })({
    method: 'GET',
    type,
    payload
  })

  expect(callbackDispatch).toHaveBeenCalledTimes(1)
  expect(callbackDispatch).toBeCalledWith({ type: `${type}_ERROR`, payload })
})
