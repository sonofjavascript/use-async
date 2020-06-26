import { METHODS } from '../../static'

const errorPattern = (method, type) => `The method '${method}' ${type} in the client agent`

export const checkFn = (fn, method) => {
  if (fn) return

  throw new Error(errorPattern(method, 'does not exist'))
}

export const checkMethod = (method) => {
  if (METHODS[method]) return
  throw new Error(`Method '${method}' is not allowed`)
}
