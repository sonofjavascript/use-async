import { METHODS, DISPATCH_MODES } from './static'
import { check } from './validator'

const { GET, POST, PUT, DELETE } = METHODS
const { SUCCESS, ERROR } = DISPATCH_MODES

const AsyncBus = (id, client) => {
  if (!id) throw new Error('Unique ID identifier is not defined')
  if (!client) throw new Error('Client agent is not defined')

  const methods = {
    [GET]: client.get,
    [POST]: client.post,
    [PUT]: client.put,
    [DELETE]: client.delete
  }

  const throwDispatch = (actionType, mode) => (payload) => {
    const dispatch = client.dispatchs?.[id]
    if (!dispatch) return

    const type = `${actionType}_${mode}`
    dispatch({ type, payload })
  }

  const execute = ({ method, params, body, url, type }) => {
    const fn = methods[method]
    check(fn, method)

    return fn(url, params, body)
      .then(throwDispatch(type, SUCCESS))
      .catch(throwDispatch(type, ERROR))
  }

  return execute
}

export default AsyncBus
