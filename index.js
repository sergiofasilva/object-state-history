'use strict'

const OPERATIONS = Object.freeze({
  delete: 'delete',
  replace: 'replace',
  merge: 'merge'
})

class ObjectStateHistory {
  #list// = []
  #options = {}
  constructor (object, options) {
    const isValidArgument = arguments.length === 0 || object?.constructor === Object

    if (!isValidArgument) {
      throw new Error('Should be provided an argument of type object.')
    }

    this.#setOptions(options)
    const obj = structuredClone(object || {})

    console.log('OPTIONS:', this.#options)
    if (this.#options.cache) {
      const client = this.#options.cache.client
      const key = this.#options.cache.key
      client.set(key, [])
      console.log('PROXY LIST .......')
      this.#list = new Proxy(client.get(key), {
        get: (target, prop) => {
          // console.log('get', target, prop)
          // target = client.get(key)
          // console.log('TARGET:', target)
          const value = target[prop]
          console.log('VALUE:', value, prop)
          if (value instanceof Function) {
            return function (...args) {
              const res = value.apply(target, args)
              if (prop === 'push') {
                console.log('TARGET.....', target)
              }
              client.set(key, target)
              return res
            }
          }
          return prop
        }
      })
    }
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
      list: this.list(),
      value: this.value
    }
  }

  toString () {
    return JSON.stringify(this.value)
  }

  #setOptions (options) {
    if (options === undefined || options === null) {
      return
    }

    if (options.constructor !== Object) {
      throw new Error('When provided, the options parameter must be of type object.')
    }

    const schemaOptions = {
      limit: value => isNaturalNumber(value),
      cache: value => isValidCache(value)
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
      .map(key => new Error(`Option ${key} is 'invalid'.`))

    const errors = validate(options, schemaOptions)

    if (errors.length > 0) {
      throw new Error(errors[0])
    } else {
      this.#options = {
        limit: +options.limit || 0
      }
      if (options.cache) {
        this.#options.cache = options.cache
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
    !cache.client.get ||
    !cache.client.set ||
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

module.exports = ObjectStateHistory
