'use strict'

import { EventEmitter } from 'node:events'
import util from 'node:util'
import { isNaturalNumber } from './utils/validations.js'

type OperationType = 'delete' | 'replace' | 'merge'

interface ListItem {
  timestamp: number
  operation: OperationType
  data: any
  value?: any
}

interface ObjectStateHistoryOptions {
  limit?: number
  lastStatesToKeep?: number
}

const OPERATIONS = Object.freeze({
  delete: 'delete' as OperationType,
  replace: 'replace' as OperationType,
  merge: 'merge' as OperationType
})

class ObjectStateHistory extends EventEmitter {
  #list: ListItem[] = []
  #options: Required<ObjectStateHistoryOptions> = { limit: 0, lastStatesToKeep: 5 }

  constructor(object?: Record<string, any> | null, history?: ListItem[] | null, options?: ObjectStateHistoryOptions) {
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
      set: (target, key: string, value) => {
        const obj: Record<string, any> = {}
        obj[key] = value
        target.#merge(obj)
        return true
      },
      get: (target, prop: string | symbol, receiver) => {
        const value = Reflect.get(target, prop, receiver)
        if (typeof value === 'function' && prop !== 'constructor') {
          return function (...args: any[]) {
            return value.apply(target, args)
          }
        }
        return value
      },
      deleteProperty: (target, prop: string) => {
        target.#merge(prop, OPERATIONS.delete)
        return true
      },
      ownKeys: (target) => {
        return Reflect.ownKeys(target.value)
      }
    })
  }

  get value(): any {
    return this.at()
  }

  get length(): number {
    return Object.keys(this.value).length
  }

  valueOf(): any {
    return this.value
  }

  at(index = -1): any {
    const idx = index < 0 ? this.#list.length + index : index
    const itemAtIndex = this.#list[idx]
    const isItemWithAssignedValue = idx > this.#list.length - this.#options.lastStatesToKeep - 1
    if (isItemWithAssignedValue) {
      return ObjectStateHistory.#getFreezedClonedObject(itemAtIndex?.value)
    }
    return ObjectStateHistory.#getFreezedClonedObject(this.#dat(idx))
  }

  #dat(index = -1): any {
    const idx = index
    let value: any
    for (let i = 0; i <= idx; i++) {
      const item = this.#list[i]
      value = mergeItemToObject(value, item)
    }
    return value
  }

  merge(data: Record<string, any>): any {
    return this.#merge(data)
  }

  replace(data: Record<string, any>): any {
    return this.#merge(data, OPERATIONS.replace)
  }

  list(): ListItem[] {
    return ObjectStateHistory.#getFreezedClonedObject(this.#list)
  }

  info() {
    return {
      options: { ...this.#options },
      list: this.list(),
      value: this.value
    }
  }

  [util.inspect.custom](depth: number, options: any, inspect: any) {
    return `${this.constructor.name}: ${this.toString()}`
  }

  toString(): string {
    return JSON.stringify(this.value)
  }

  #setOptions(options?: ObjectStateHistoryOptions) {
    const defaultOptions = {
      limit: 0,
      lastStatesToKeep: 5
    }
    if (options === undefined || options === null) {
      this.#options = defaultOptions
      return
    }

    if (options.constructor !== Object) {
      throw new Error('When provided, the options parameter must be of type object.')
    }

    const schemaOptions: Record<string, (value: any) => boolean> = {
      limit: (value: any) => isNaturalNumber(value),
      lastStatesToKeep: (value: any) => isNaturalNumber(value)
    }

    const validate = (object: Record<string, any>, schema: Record<string, (value: any) => boolean>) => Object
      .entries(schema)
      .map(([key, validateFn]) => [
        key,
        !(key in object) || validateFn(object[key])
      ])
      .filter(([_, ...tests]) => !tests.every(Boolean))
      .map(([key, _]) => new Error(`Option ${key}: ${object[key as string]} is 'invalid'.`))

    const errors = validate(options, schemaOptions)

    if (errors.length > 0) {
      throw new Error(errors[0].message)
    }

    this.#options.limit = +options.limit! || defaultOptions.limit
    this.#options.lastStatesToKeep = this.#options.limit
      ? 0
      : Number.isInteger(options.lastStatesToKeep)
        ? +options.lastStatesToKeep!
        : defaultOptions.lastStatesToKeep
  }

  #addItem(data: any, operation: OperationType = OPERATIONS.merge) {
    const newItem = ObjectStateHistory.#buildListItem(data, operation)
    const lastIndex = this.#list.length - 1
    const lastValue = this.#list[lastIndex]?.value ?? this.#dat(lastIndex)
    const lastItem = mergeItemToObject(lastValue, newItem)

    const isToClearValueFromlastStatesToKeepItems =
      this.#list.length >= this.#options.lastStatesToKeep && this.#options.lastStatesToKeep > 0
    if (isToClearValueFromlastStatesToKeepItems) {
      // clear the value of the the lastStatesToKeep previous item
      this.#list[this.#list.length - this.#options.lastStatesToKeep].value = null
    }
    newItem.value = lastItem
    this.#list.push(newItem)
    this.emit('change', newItem)
    if (this.#options?.limit) {
      this.#list.splice(0, this.#list.length - this.#options.limit)
    }
    this.#buildObjectRepresentation()
  }

  #merge(data: any, operation: OperationType = OPERATIONS.merge): any {
    const isMergeOrReplaceOperation = [OPERATIONS.merge, OPERATIONS.replace].includes(operation)
    const isValidData = !isMergeOrReplaceOperation || data.constructor === Object

    if (!isValidData) {
      throw new Error('Should be provided an argument of type object.')
    }

    this.#addItem(data, operation)
    return this.value
  }

  #buildObjectRepresentation() {
    Object.keys(this.value).forEach((key) => ((this as any)[key] = this.value[key]))
  }

  static #buildListItem(data: any, operation: OperationType = OPERATIONS.merge): ListItem {
    return {
      timestamp: Date.now(),
      operation,
      data
    }
  }

  static #getFreezedClonedObject<T>(obj: T): T {
    const isObject = (obj as any)?.constructor === Object
    const isArray = Array.isArray(obj)
    const clone = isObject
      ? structuredClone(obj)
      : isArray
        ? JSON.parse(JSON.stringify(obj))
        : obj
    return Object.freeze(clone)
  }
}

function mergeItemToObject(object: any, itemToMerge: ListItem): any {
  if (itemToMerge.value) {
    return itemToMerge.value
  }
  if (itemToMerge.operation === OPERATIONS.delete) {
    const newPrevious = object ? structuredClone(object) : {}
    delete newPrevious[itemToMerge.data]
    return newPrevious
  }
  if (itemToMerge.operation === OPERATIONS.replace) {
    return structuredClone(itemToMerge.data)
  }
  return object ? { ...object, ...itemToMerge.data } : { ...itemToMerge.data }
}

export { ObjectStateHistory };
export default ObjectStateHistory;