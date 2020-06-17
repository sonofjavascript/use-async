import { check } from './validator'

import { checkMethod, checkFn } from './utils/utils'
jest.mock('./utils/utils')

afterEach(() => {
  jest.clearAllMocks()
  checkMethod.mockImplementation(() => {})
  checkFn.mockImplementation(() => {})
})

test('Throws error when \'checkMethod\' throws error', () => {
  checkMethod.mockImplementation(() => {
    throw new Error('::error::')
  })

  expect(() => {
    check()
  }).toThrowError(new Error('::error::'))

  expect(checkMethod).toHaveBeenCalledTimes(1)
  expect(checkFn).not.toHaveBeenCalled()
})

test('Throws error when \'checkFn\' throws error', () => {
  checkFn.mockImplementation(() => {
    throw new Error('::error::')
  })

  expect(() => {
    check()
  }).toThrowError(new Error('::error::'))

  expect(checkMethod).toHaveBeenCalledTimes(1)
  expect(checkFn).toHaveBeenCalledTimes(1)
})

test('Returns \'undefined\' when fn is valid', () => {
  const result = check()

  expect(checkMethod).toHaveBeenCalledTimes(1)
  expect(checkFn).toHaveBeenCalledTimes(1)
  expect(result).not.toBeDefined()
})
