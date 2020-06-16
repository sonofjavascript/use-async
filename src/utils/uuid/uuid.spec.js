import uuid from './uuid'

test('Should return a string', () => {
  const result = uuid()
  expect(typeof result).toBe('string')
})

test('Should return not empty string', () => {
  const result = uuid()
  expect(result).toMatch(/^(?!\s*$).+/)
})

test('Should return random string', () => {
  const result1 = uuid()
  const result2 = uuid()
  expect(result1).not.toEqual(result2)
})
