'use strict'

const OPERATIONS = Object.freeze({
  delete: 'delete',
  replace: 'replace',
  merge: 'merge'
})

class ObjectStateHistory {
  #list = []
  constructor (object) {
    const isValidArgument = arguments.length === 0 || object?.constructor === Object

    if (!isValidArgument) {
      throw new Error('Should be provided an argument of type object.')
    }
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

  valueOf () {
    return this.value
  }

  toString () {
    return JSON.stringify(this.value)
  }

  get value () {
    return ObjectStateHistory.#getFreezedClonedObject(this.#list[this.#list.length - 1]?.value)
  }

  merge (data) {
    return this.#merge(data)
  }

  replace (data) {
    return this.#merge(data, OPERATIONS.replace)
  }

  #addItem (data, operation = OPERATIONS.merge) {
    const newItem = ObjectStateHistory.#buildListItem(data, operation)

    const lastValue = this.#list[this.#list.length - 1]?.value || {}
    const lastItem = mergeItemToObject(lastValue, newItem)
    newItem.value = lastItem
    this.#list.push(newItem)
    this.#buildObjectRepresentation()
  }

  #merge (data, operation = OPERATIONS.merge) {
    const isMergeOrReplaceOperation = [
      OPERATIONS.merge,
      OPERATIONS.replace
    ].includes(operation)

    const isValidData =
      !isMergeOrReplaceOperation || data.constructor === Object

    if (!isValidData) {
      throw new Error('Should be provided an argument of type object.')
    }

    this.#addItem(data, operation)

    return this.value
  }

  list () {
    return ObjectStateHistory.#getFreezedClonedObject(this.#list)
  }

  at (index = -1) {
    const idx = index < 0 ? this.#list.length + index : index
    const itemAtIndex = this.#list[idx]

    return ObjectStateHistory.#getFreezedClonedObject(itemAtIndex?.value)
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

module.exports = ObjectStateHistory
