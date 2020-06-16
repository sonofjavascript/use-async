import { METHODS, DISPATCH_MODES } from './static'

const { GET, POST, PUT, DELETE } = METHODS
const { SUCCESS, ERROR } = DISPATCH_MODES

const AsyncBus = (id, client) => {
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
    methods[method](url, params, body)
      .then(throwDispatch(type, SUCCESS))
      .catch(throwDispatch(type, ERROR))
  }

  return execute
}

export default AsyncBus
