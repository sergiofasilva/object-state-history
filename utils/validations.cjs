'use strict'

function isNaturalNumber (value) {
  const isValidType = [Number, String].includes(value.constructor)
  const number = isValidType && Number(value)
  const isInteger = Number.isInteger(number)
  const isNegative = value < 0
  const isNatural = isInteger && !isNegative
  return isNatural
}

module.exports = { isNaturalNumber }
