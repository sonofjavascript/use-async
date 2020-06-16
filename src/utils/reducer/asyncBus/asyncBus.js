import { METHODS, DISPATCH_MODES } from './static'
import { check } from './validator'

const { GET, POST, PUT, DELETE } = METHODS
const { SUCCESS, ERROR } = DISPATCH_MODES

const AsyncBus = (id, client) => {
  if (!client) throw new Error('Client agent is not defined')

  const methods = {
    [GET]: client.get,
    [POST]: client.post,
    [PUT]: client.put,
    [DELETE]: client.delete
  }

  const throwDispatch = (actionType, mode) => (payload) => {
    const dispatch = client.dispatchs[id]
    const type = `${actionType}_${mode}`

    dispatch({ type, payload })
  }

  const execute = ({ method, params, body, url, type }) => {
    const fn = methods[method]
    check(fn, method)

    console.log(fn)

    fn(url, params, body)
      .then(throwDispatch(type, SUCCESS))
      .catch(throwDispatch(type, ERROR))
  }

  return execute
}

export default AsyncBus
