import reducer from './reducer'

import * as AsyncBus from './asyncBus/asyncBus'

test('Should return state when action type is not found', () => {
  const actionCallback = jest.fn(() => {})
  const actions = { '::action1::': actionCallback }
  const state = { data: '::data::' }
  const action = { type: '::unknown_action::' }

  const result = reducer('::id::', actions)(state, action)
  expect(result).toEqual(state)
  expect(actionCallback).not.toHaveBeenCalled()
})

test('Should call action and return its effect', () => {
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

test('When action effect has request and client is not defined should throw error', () => {
  const actionType = '::action1::'
  const actions = {
    [actionType]: () => ({
      request: {
        method: '::method::',
        url: '::url::'
      }
    })
  }

  expect(() => {
    reducer('::id::', actions)(null, { type: actionType })
  }).toThrowError(new Error('Client agent is not defined'))
})

test('When action effect has request and method is unknown should throw error', () => {
  const actionType = '::action1::'
  const method = '::method::'
  const actions = {
    [actionType]: () => ({
      request: {
        method,
        url: '::url::'
      }
    })
  }

  expect(() => {
    reducer('::id::', actions, {})(null, { type: actionType })
  }).toThrowError(new Error(`Method '${method}' is not allowed`))
})

test('When action effect has request and client method is not an async method should throw error', () => {
  const actionType = '::action1::'
  const method = 'GET'
  const actions = {
    [actionType]: () => ({
      request: {
        method,
        url: '::url::'
      }
    })
  }

  const client = {
    [method.toLowerCase()]: () => {}
  }

  expect(() => {
    reducer('::id::', actions, client)(null, { type: actionType })
  }).toThrowError(new Error(`The method '${method}' is not an async function in the client agent`))
})

// test('When action effect has request and client is not defined should throw error', () => {
//   const id = '::id::'
//   const actionType = '::action1::'
//   const actions = {
//     [actionType]: () => ({
//       request: {
//         method: '::method::',
//         url: '::url::'
//       }
//     })
//   }

//   const execute = spyOn(AsyncBus, 'default')
//   const action = { type: actionType }

//   expect(() => {
//     reducer(id, actions)(null, action)
//   }).toThrowError(new Error(`Client agent is not defined`))
// })
