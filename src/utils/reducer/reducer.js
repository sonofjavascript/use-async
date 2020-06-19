import AsyncBus from './asyncBus'

const reducer = (id, actions, client) => (state, { type, payload }) => {
  const action = actions[type]

  const effect = action?.(state, payload) || state
  if (effect?.request) {
    AsyncBus(id, client)({ ...effect.request, type })
    delete effect.request
  }

  return effect
}

export default reducer
