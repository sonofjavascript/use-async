import { useCallback, useReducer, useEffect, useContext, useState } from 'react'

import { ClientStore } from './stores'
import { uuid, reducer } from './utils'

const useAsync = (actions, initialState = {}) => {
  const [id] = useState(uuid())
  const client = useContext(ClientStore.Context)

  const memoizedReducer = useCallback(reducer(id, actions, client), [])
  const [state, dispatch] = useReducer(memoizedReducer, initialState)

  useEffect(() => {
    client.dispatchs = {
      ...client.dispatchs,
      [id]: dispatch
    }

    if (!client.connect) return
    client.connect({ state, dispatch })
  }, [state])

  return [state, dispatch]
}

export default useAsync
