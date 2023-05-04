'use strict'

const OPERATIONS = Object.freeze({
  delete: 'delete',
  replace: 'replace',
  merge: 'merge'
})

class ObjectStateHistory {
  #history = []
  constructor (object) {
    const isValidArgument =
      arguments.length === 0 || object?.constructor === Object

    if (!isValidArgument) {
      throw new Error('Should be provided an argument of type object.')
    }
    const obj = structuredClone(object || {})

    this.#history.push(ObjectStateHistory.#buildListItem(obj))
    this.#buildObjectRepresentation()

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
        return value || target.value[prop]
      },
      deleteProperty (target, prop) {
        const newObj = structuredClone(target.value)
        if (prop in newObj) {
          target.#merge(prop, OPERATIONS.delete)
        }
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
    const lastItem = this.#mergeListOfObjects()
    return ObjectStateHistory.#getFreezedClonedObject(lastItem)
  }

  merge (data) {
    return this.#merge(data)
  }

  replace (data) {
    return this.#merge(data, OPERATIONS.replace)
  }

  #merge (data, operation = OPERATIONS.merge) {
    const isMergeOrReplaceOperation = [
      OPERATIONS.merge,
      OPERATIONS.replace
    ].includes(operation)

    const isValidData = !isMergeOrReplaceOperation || data.constructor === Object

    if (!isValidData) {
      throw new Error('Should be provided an argument of type object.')
    }

    const item = ObjectStateHistory.#buildListItem(data, operation)
    this.#history.push(item)
    this.#buildObjectRepresentation(item)

    return this.value
  }

  list () {
    return ObjectStateHistory.#getFreezedClonedObject(this.#history)
  }

  listAll () {
    let history
    try {
      const historyList = this.list()
      history = historyList.map((el, idx) => {
        el.value =
          idx === 0
            ? { ...el.data }
            : mergeItemToObject(historyList[idx - 1].value, el)
        return el
      })
    } catch (error) {
      history = []
    }

    return ObjectStateHistory.#getFreezedClonedObject(history)
  }

  at (index = -1) {
    if (!Number.isInteger(index)) {
      return undefined
    }

    index = index < 0 ? this.#history.length + index : index
    const itemAtIndex = this.#history[index]
    if (itemAtIndex === undefined) {
      return undefined
    }

    const historyToIndex = this.#history.slice(0, index + 1)
    const item = this.#mergeListOfObjects(historyToIndex)
    return ObjectStateHistory.#getFreezedClonedObject(item)
  }

  #mergeListOfObjects (list) {
    const historyList = list ? [...list] : this.#history
    const merged = historyList.reduce((previous, current) => {
      return mergeItemToObject(previous, current)
    }, {})
    return Object.freeze(merged)
  }

  #buildObjectRepresentation (lastItem) {
    if (lastItem && lastItem.operation === OPERATIONS.delete) {
      delete this[lastItem.data]
    } else if (lastItem && lastItem.operation === OPERATIONS.replace) {
      for (const key of Object.keys(this)) {
        delete this[key]
      }
    }
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

function mergeItemToObject (currentObject, nextItem) {
  if (nextItem.operation === OPERATIONS.delete) {
    const newPrevious = structuredClone(currentObject)
    delete newPrevious[nextItem.data]
    return newPrevious
  }
  if (nextItem.operation === OPERATIONS.replace) {
    return structuredClone(nextItem.data)
  }
  return { ...currentObject, ...nextItem.data }
}

module.exports = ObjectStateHistory
