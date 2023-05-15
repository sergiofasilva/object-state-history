'use strict'

const OPERATIONS = Object.freeze({
  delete: 'delete',
  replace: 'replace',
  merge: 'merge'
})

class ObjectStateHistory {
  #list = []
  #options = {}
  constructor (object, options) {
    const isValidArgument = arguments.length === 0 || object?.constructor === Object

    if (!isValidArgument) {
      throw new Error('Should be provided an argument of type object.')
    }

    this.#getValidOptions(options)
    const obj = structuredClone(object || {})

    this.#merge(obj)

    return new Proxy(this, {
      set (object, key, value) {
        const obj = {}
        obj[key] = value
        object.#merge(obj)
        return true
      },
      get: (target, prop) => {
        const value = target[prop]

        if (value instanceof Function) {
          return function (...args) {
            return value.apply(target, args)
          }
        }
        return value
      },
      deleteProperty (target, prop) {
        target.#merge(prop, OPERATIONS.delete)
        return true
      }
    })
  }

  get value () {
    return this.at()
  }

  valueOf () {
    return this.value
  }

  at (index = -1) {
    const idx = index < 0 ? this.#list.length + index : index
    const itemAtIndex = this.#list[idx]

    return ObjectStateHistory.#getFreezedClonedObject(itemAtIndex?.value)
  }

  merge (data) {
    return this.#merge(data)
  }

  replace (data) {
    return this.#merge(data, OPERATIONS.replace)
  }

  list () {
    return ObjectStateHistory.#getFreezedClonedObject(this.#list)
  }

  info () {
    return {
      options: { ...this.#options },
      list: this.list()
    }
  }

  toString () {
    return JSON.stringify(this.value)
  }

  #getValidOptions (options) {
    if (options === undefined || options === null) {
      return
    }

    if (options.constructor !== Object) {
      throw new Error('When provided, the options parameter must be of type object.')
    }

    const schemaOptions = {
      limit: value => isNaturalNumber(value)
    }
    schemaOptions.limit.required = true

    const validate = (object, schema) => Object
      .entries(schema)
      .filter(key => key in object)
      .map(([key, validate]) => [
        key,
        !validate.required || (key in object),
        validate(object[key])
      ])
      .filter(([_, ...tests]) => !tests.every(Boolean))
      .map(([key, invalid]) => new Error(`Option ${key} is ${invalid ? 'invalid' : 'required'}.`))

    const errors = validate(options, schemaOptions)

    if (errors.length > 0) {
      throw new Error(errors[0])
    } else {
      this.#options = {
        limit: +options.limit || 0
      }
    }
  }

  #addItem (data, operation = OPERATIONS.merge) {
    const newItem = ObjectStateHistory.#buildListItem(data, operation)
    const lastValue = this.#list[this.#list.length - 1]?.value || {}
    const lastItem = mergeItemToObject(lastValue, newItem)

    newItem.value = lastItem
    this.#list.push(newItem)
    if (this.#options?.limit) {
      this.#list = this.#list.slice(-this.#options.limit)
    }
    this.#buildObjectRepresentation()
  }

  #merge (data, operation = OPERATIONS.merge) {
    const isMergeOrReplaceOperation = [OPERATIONS.merge, OPERATIONS.replace].includes(operation)
    const isValidData = !isMergeOrReplaceOperation || data.constructor === Object

    if (!isValidData) {
      throw new Error('Should be provided an argument of type object.')
    }

    this.#addItem(data, operation)
    return this.value
  }

  #buildObjectRepresentation () {
    Object.keys(this.value).forEach((key) => (this[key] = this.value[key]))
  }

  static #buildListItem (data, operation = OPERATIONS.merge) {
    return {
      timestamp: Date.now(),
      operation,
      data
    }
  }

  static #getFreezedClonedObject (obj) {
    return Object.freeze(structuredClone(obj))
  }
}

function mergeItemToObject (object, itemToMerge) {
  if (itemToMerge.operation === OPERATIONS.delete) {
    const newPrevious = structuredClone(object)
    delete newPrevious[itemToMerge.data]
    return newPrevious
  }
  if (itemToMerge.operation === OPERATIONS.replace) {
    return structuredClone(itemToMerge.data)
  }
  return { ...object, ...itemToMerge.data }
}

function isNaturalNumber (value) {
  const number = Number(value)
  const isInteger = Number.isInteger(number)
  const isNegative = value < 0
  const isNatural = isInteger && !isNegative
  return isNatural
}

module.exports = ObjectStateHistory
