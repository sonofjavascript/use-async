import { useCallback, useReducer, useEffect, useContext, useState } from 'react'

import { ClientStore } from '@shared/stores'

import AsyncBus from './asyncBus'

const uuid = () => Math.random().toString(36).substr(2, 9)

const reducer = (id, client, actions) => (state, { type, payload }) => {
  const action = actions[type]

  const { request, ...effect } = action?.(state, payload) || state
  if (request) AsyncBus(id, client)({ ...request, type })

  return effect
}

const useActions = (actions, initialState = {}) => {
  const [id] = useState(uuid())
  const client = useContext(ClientStore.Context)

  const memoizedReducer = useCallback(reducer(id, client, actions), [])
  const [state, dispatch] = useReducer(memoizedReducer, initialState)

  useEffect(() => {
    client.dispatchs = {
      ...client.dispatchs,
      [id]: dispatch
    }
  }, [state])

  return [state, dispatch]
}

export default useActions
