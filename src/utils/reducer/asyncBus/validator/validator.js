import { checkMethod, checkFn } from './utils'

export const check = (fn, method) => {
  checkMethod(method)
  checkFn(fn, method)
}
