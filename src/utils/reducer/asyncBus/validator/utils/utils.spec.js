import { checkMethod, checkFn } from './utils'

test('checkMethod - Throw error when method is not defined', () => {
  expect(() => {
    checkMethod()
  }).toThrowError(new Error('Method \'undefined\' is not allowed'))
})

test('checkMethod - Throw error when method is null', () => {
  expect(() => {
    checkMethod(null)
  }).toThrowError(new Error('Method \'null\' is not allowed'))
})

test('checkMethod - Throw error when method is unknown', () => {
  expect(() => {
    checkMethod('::method::')
  }).toThrowError(new Error('Method \'::method::\' is not allowed'))
})

test('checkMethod - Return undefined when method is known', () => {
  const result = checkMethod('GET')
  expect(result).not.toBeDefined()
})

test('checkFn - Throw error when fn is not defined', () => {
  expect(() => {
    checkFn()
  }).toThrowError(new Error('The method \'undefined\' does not exist in the client agent'))
})

test('checkFn - Return undefined when fn is valid', () => {
  const result = checkFn(() => Promise.resolve(), '::method::')
  expect(result).not.toBeDefined()
})
