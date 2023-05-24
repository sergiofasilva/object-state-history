
'use strict'

function isNaturalNumber (value) {
  const isValidType = [Number, String].includes(value.constructor)
  const number = isValidType && Number(value)
  const isInteger = Number.isInteger(number)
  const isNegative = value < 0
  const isNatural = isInteger && !isNegative
  return isNatural
}

function isValidCache (cache) {
  if (cache === undefined || cache === null) {
    return
  }

  if (cache.constructor !== Object) {
    throw new Error('When provided, the cache option parameter must be of type object.')
  }

  if (!Object.keys(cache).includes('client')) {
    throw new Error('When provided, the cache option parameter must include "client" propety.')
  }

  if (!Object.keys(cache).includes('key')) {
    throw new Error('When provided, the cache option parameter must include "key" property.')
  }

  if (
    typeof cache.client.get !== 'function' ||
    typeof cache.client.set !== 'function'
  ) {
    throw new Error('When provided, the cache option parameter must have a valid cache client.')
  }

  if (!cache.key) {
    throw new Error('When provided, the cache option parameter must have a valid key.')
  }
  return true
}

module.exports = {
  isNaturalNumber,
  isValidCache
}
