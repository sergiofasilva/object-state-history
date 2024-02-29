'use strict'

const EventEmitter = require('node:events')
const util = require('node:util')

const { isNaturalNumber } = require('./utils/validations.cjs')

const OPERATIONS = Object.freeze({
  delete: 'delete',
  replace: 'replace',
  merge: 'merge'
})

class ObjectStateHistory extends EventEmitter {
  #list = []
  #options = {}
  constructor (object, history, options) {
    super()
    const isValidArgument = object === undefined || object === null || object?.constructor === Object

    if (!isValidArgument) {
      throw new Error('Should be provided an argument of type object.')
    }

    this.#setOptions(options)
    const obj = structuredClone(object || {})

    const hasHistory = history && Array.isArray(history) && history.length > 0
    if (hasHistory) {
      this.#list = Array.from(history)
    }
    this.#merge(obj)

    return new Proxy(this, {
      set (object, key, value) {
        const obj = {}
        obj[key] = value
        object.#merge(obj)
        return true
      },
      get (target, prop) {
        const value = target[prop]

        if (value instanceof Function && prop !== 'constructor') {
          return function (...args) {
            return value.apply(target, args)
          }
        }
        return value
      },
      deleteProperty (target, prop) {
        target.#merge(prop, OPERATIONS.delete)
        return true
      },
      ownKeys (target) {
        return Reflect.ownKeys(target.value)
      }
    })
  }

  get value () {
    return this.at()
  }

  get length () {
    return Object.keys(this.value).length
  }

  valueOf () {
    return this.value
  }

  at (index = -1) {
    const idx = index < 0 ? this.#list.length + index : index
    const itemAtIndex = this.#list[idx]
    const isItemWithAssignedValue = idx > this.#list.length - this.#options.skipDelta - 1
    if (isItemWithAssignedValue) {
      return ObjectStateHistory.#getFreezedClonedObject(itemAtIndex?.value)
    }
    return ObjectStateHistory.#getFreezedClonedObject(this.#dat(idx))
  }

  #dat (index = -1) {
    const idx = index
    let value
    for (let i = 0; i <= idx; i++) {
      const item = this.#list[i]
      value = mergeItemToObject(value, item)
    }

    return value
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
      list: this.list(),
      value: this.value
    }
  }

  [util.inspect.custom] (depth, options, inspect) {
    return `${this.constructor.name}: ${this.toString()}`
  }

  toString () {
    return JSON.stringify(this.value)
  }

  #setOptions (options) {
    const defaultOptions = {
      limit: 0,
      skipDelta: 1
    }
    if (options === undefined || options === null) {
      this.#options = defaultOptions
      return
    }

    if (options.constructor !== Object) {
      throw new Error('When provided, the options parameter must be of type object.')
    }

    const schemaOptions = {
      limit: value => isNaturalNumber(value),
      skipDelta: value => isNaturalNumber(value)
    }
    // schemaOptions.limit.required = false

    const validate = (object, schema) => Object
      .entries(schema)
      .map(([key, validate]) => [
        key,
        // Only necessary if we had required options
        //! validate.required || (key in object),
        !(key in object) || validate(object[key])
      ])
      .filter(([_, ...tests]) => !tests.every(Boolean))
      // Only necessary if we had required options
      // .map(([key, invalid]) => new Error(`Option ${key} is ${invalid ? 'invalid' : 'required'}.`))
      .map(([key, _]) => new Error(`Option ${key}: ${object[key]} is 'invalid'.`))

    const errors = validate(options, schemaOptions)

    if (errors.length > 0) {
      throw new Error(errors[0])
    }

    this.#options.limit = +options.limit || defaultOptions.limit
    this.#options.skipDelta = this.#options.limit ? 0 : Number.isInteger(options.skipDelta) ? +options.skipDelta : defaultOptions.skipDelta
  }

  #addItem (data, operation = OPERATIONS.merge) {
    const newItem = ObjectStateHistory.#buildListItem(data, operation)
    const lastValue = this.#list[this.#list.length - 1]?.value || {}
    const lastItem = mergeItemToObject(lastValue, newItem)

    const isToClearValueFromskipDeltaItems = this.#list.length >= this.#options.skipDelta && this.#options.skipDelta > 0
    if (isToClearValueFromskipDeltaItems) {
      // clear the value of the the skipDelta previous item
      this.#list[this.#list.length - this.#options.skipDelta].value = null
    }
    newItem.value = lastItem
    this.#list.push(newItem)
    this.emit('change', newItem)
    if (this.#options?.limit) {
      this.#list.splice(0, this.#list.length - this.#options.limit)
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
    const isObject = obj?.constructor === Object
    const isArray = Array.isArray(obj)
    const clone = isObject
      ? structuredClone(obj)
      : isArray
        ? JSON.parse(JSON.stringify(obj))
        : obj
    return Object.freeze(clone)
  }
}

function mergeItemToObject (object, itemToMerge) {
  if (itemToMerge.value) {
    return itemToMerge.value
  }
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

module.exports = ObjectStateHistory
