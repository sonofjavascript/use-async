import { METHODS } from '../static'

const errorPattern = (method, type) => `The method '${method}' ${type} in the client agent`

export const checkFn = (fn, method) => {
  if (!fn) {
    throw new Error(errorPattern(method, 'does not exist'))
  }

  if (fn() instanceof Promise) return

  throw new Error(errorPattern(method, 'is not an async function'))
}

const checkMethod = (method) => {
  if (METHODS[method]) return
  throw new Error(`Method '${method}' is not allowed`)
}

export const check = (fn, method) => {
  checkMethod(method)
  checkFn(fn, method)
}
