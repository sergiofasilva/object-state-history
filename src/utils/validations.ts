'use strict'

export function isNaturalNumber(value: number): boolean {
  return Number.isInteger(value) && value >= 0
}
