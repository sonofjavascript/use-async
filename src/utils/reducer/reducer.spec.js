import reducer from './reducer'

import AsyncBus from './asyncBus/asyncBus'

jest.mock('./asyncBus/asyncBus', () => jest.fn(() => {}).mockReturnValue(jest.fn(() => {})))

test('Return state when action type is not found', () => {
  const actionCallback = jest.fn(() => {})
  const actions = { '::action1::': actionCallback }
  const state = { data: '::data::' }
  const action = { type: '::unknown_action::' }

  const result = reducer('::id::', actions)(state, action)
  expect(result).toEqual(state)
  expect(actionCallback).not.toHaveBeenCalled()
})

test('Call action and return its effect', () => {
  const actionType = '::action1::'
  const actionCallback = jest.fn((state, payload) => ({
    ...state,
    payload
  }))
  const actions = { [actionType]: actionCallback }
  const state = { data: '::data::' }
  const payload = '::payload::'
  const action = { type: actionType, payload }

  const result = reducer('::id::', actions)(state, action)
  expect(result).toEqual({ ...state, payload })
  expect(actionCallback).toHaveBeenCalledTimes(1)
  expect(actionCallback).toBeCalledWith(state, payload)
})

test('Execute "AsyncBus" when request is on action effect', () => {
  const id = '::id::'
  const method = '::method::'
  const url = '::url::'
  const actionType = '::action1::'
  const client = '::client::'
  const actions = {
    [actionType]: () => ({
      request: {
        method,
        url
      }
    })
  }

  reducer(id, actions, client)(null, { type: actionType })
  expect(AsyncBus).toHaveBeenCalledTimes(1)
  expect(AsyncBus).toBeCalledWith(id, client)
  expect(AsyncBus(id, client)).toHaveBeenCalledTimes(1)
  expect(AsyncBus(id, client)).toBeCalledWith({ method, url, type: actionType })
})
