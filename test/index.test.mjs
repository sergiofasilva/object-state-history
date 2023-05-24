'use strict'
import ObjectStateHistory from '../index.mjs'
import { describe, it } from 'node:test'
import assert, { deepStrictEqual, strictEqual } from 'node:assert/strict'

describe('ObjectStateHistory constructor.', function () {
  it('Should return an error when no object, not undefined or not null is passed to it.', () => {
    assert.throws(() => {
      const objHist = new ObjectStateHistory([])
      console.error('This should not print: ', objHist)
    }, Error)
    assert.throws(() => {
      const objHist = new ObjectStateHistory('string')
      console.error('This should not print: ', objHist)
    }, Error)
    assert.throws(() => {
      const objHist = new ObjectStateHistory(123)
      console.error('This should not print: ', objHist)
    }, Error)
    assert.throws(() => {
      const objHist = new ObjectStateHistory(new Set())
      console.error('This should not print: ', objHist)
    }, Error)
  })

  it('Should return ObjectStateHistory as constructor name.', () => {
    const objHist = new ObjectStateHistory()
    assert.strictEqual(objHist.constructor.name, 'ObjectStateHistory')
  })

  it('Should not return an error when empty, undefined ou null is passed to it.', () => {
    assert.ok(new ObjectStateHistory())
    assert.ok(new ObjectStateHistory(undefined))
    assert.ok(new ObjectStateHistory(null))
  })

  it('Should return an empty object when empty, undefined ou null is passed to it.', () => {
    deepStrictEqual(new ObjectStateHistory().value, {})
    deepStrictEqual(new ObjectStateHistory(undefined).value, {})
    deepStrictEqual(new ObjectStateHistory(null).value, {})
  })

  it('Should return an error when try change the imuttable value.', () => {
    const objHistoryData = { a: '1', b: '2' }
    const objHist = new ObjectStateHistory(objHistoryData)

    assert.throws(() => {
      objHist.value = { c: '3' }
    }, Error)
    assert.throws(() => {
      objHist.value.b = '3'
    }, Error)
  })

  it('Should return an empty object when no parameter is passed to it.', () => {
    const emptyObjHist = new ObjectStateHistory()
    deepStrictEqual(emptyObjHist.value, {})
  })

  it('Should return the object provided.', () => {
    const objHistoryData = { a: '1', b: '2' }
    const objHist = new ObjectStateHistory(objHistoryData)

    deepStrictEqual(objHist.value, objHistoryData)
    deepStrictEqual(objHist.value, objHist.valueOf())
  })

  it('Should return the value as JSON stringify when call toString method.', () => {
    const objHistoryData = { a: '1', b: '2' }
    const objHist = new ObjectStateHistory(objHistoryData)

    deepStrictEqual(objHist.value, objHistoryData)
    deepStrictEqual(objHist.toString(), JSON.stringify(objHist.value))
  })

  it('Should not change the original object.', () => {
    const objData = { a: '1', b: '2' }
    const objDataCopy = { ...objData }
    const objHist = new ObjectStateHistory(objData)
    deepStrictEqual(objData, objDataCopy)
    deepStrictEqual(objData, objHist.value)
  })

  it('Should not change the original argument when undefined.', () => {
    let undefinedVar
    const objHist = new ObjectStateHistory(undefinedVar)
    deepStrictEqual(objHist.value, {})
    strictEqual(undefinedVar, undefined)
  })

  it('Should not change the value when change the original object.', () => {
    const objData = { a: '1', b: '2' }
    const objDataCopy = { ...objData }
    const objHist = new ObjectStateHistory(objData)
    objData.b = '3'
    assert.notEqual(objData, objDataCopy)
    deepStrictEqual(objHist.value, objDataCopy)
  })
})

describe('ObjectStateHistory options.', function () {
  it('Should return an error when provided options argument is not object, undefined or null.', () => {
    assert.throws(() => {
      const objHist = new ObjectStateHistory({ a: '1', b: '2' }, 'text')
      console.error('This should not print: ', objHist)
    }, Error)
    assert.throws(() => {
      const objHist = new ObjectStateHistory({ a: '1', b: '2' }, 3)
      console.error('This should not print: ', objHist)
    }, Error)
    assert.throws(() => {
      const objHist = new ObjectStateHistory({ a: '1', b: '2' }, [])
      console.error('This should not print: ', objHist)
    }, Error)
  })

  it('Should not return an error when provided options argument is empty, undefined, null, or object.', () => {
    assert.ok(new ObjectStateHistory({ a: '1', b: '2' }))
    assert.ok(new ObjectStateHistory({ a: '1', b: '2' }, undefined))
    assert.ok(new ObjectStateHistory({ a: '1', b: '2' }, null))
    assert.ok(new ObjectStateHistory({ a: '1', b: '2' }, {}))
  })

  it('Should return an empty object when the options are not provided.', () => {
    const objHistoryData = { a: '1', b: '2' }
    const objHist = new ObjectStateHistory(objHistoryData)
    const info = objHist.info()
    deepStrictEqual(info.options, {})
  })
})

describe('ObjectStateHistory limit option.', function () {
  it('Should return an error when provided limit options is not an integer not negative.', () => {
    assert.throws(() => {
      const objHist = new ObjectStateHistory({ a: '1', b: '2' }, { limit: 'text' })
      console.error('This should not print: ', objHist)
    }, Error)
    assert.throws(() => {
      const objHist = new ObjectStateHistory({ a: '1', b: '2' }, { limit: -5 })
      console.error('This should not print: ', objHist)
    }, Error)
    assert.throws(() => {
      const objHist = new ObjectStateHistory({ a: '1', b: '2' }, { limit: 5.4 })
      console.error('This should not print: ', objHist)
    }, Error)
    assert.throws(() => {
      const objHist = new ObjectStateHistory({ a: '1', b: '2' }, { limit: {} })
      console.error('This should not print: ', objHist)
    }, Error)
    assert.throws(() => {
      const objHist = new ObjectStateHistory({ a: '1', b: '2' }, { limit: [] })
      console.error('This should not print: ', objHist)
    }, Error)
  })

  it('Should not return an error when the options provided do not include the limit property.', () => {
    assert.ok(new ObjectStateHistory({ a: '1', b: '2' }, { noLimitProperty: 2 }))
  })

  it('Should have a limit option equal to zero (0) when the options provided not include the limit property.', () => {
    const objHistoryData = { a: '1', b: '2' }
    const objHist = new ObjectStateHistory(objHistoryData, { noLimitProperty: 2 })
    const info = objHist.info()
    strictEqual(info.options.limit, 0)
  })

  it('Should have a limit option equal to the options limit property.', () => {
    const objHistoryData = { a: '1', b: '2' }
    const limit = 3
    const objHist = new ObjectStateHistory(objHistoryData, { limit })
    const info = objHist.info()
    strictEqual(info.options.limit, limit)
  })
})

describe('ObjectStateHistory merge method', function () {
  it('Should return an error when no parameter is passed to it.', () => {
    const originalObjectData = { a: '1', b: '2' }
    const objHist = new ObjectStateHistory(originalObjectData)

    assert.throws(() => {
      objHist.merge()
    }, Error)
  })

  it('Should return an error when no object is passed to it.', () => {
    const originalObjectData = { a: '1', b: '2' }
    const objHist = new ObjectStateHistory(originalObjectData)

    assert.throws(() => {
      objHist.merge('test')
    }, Error)
  })

  it('Should return an error when try change the imuttable value.', () => {
    const objHistoryData = { a: '1', b: '2' }
    const objHist = new ObjectStateHistory(objHistoryData)
    const mergeObjHist = objHist.merge({ c: '3' })

    assert.throws(() => {
      objHist.value = { d: '4' }
    }, Error)
    assert.throws(() => {
      objHist.value.b = '3'
    }, Error)
    assert.throws(() => {
      mergeObjHist.value = { d: '4' }
    }, Error)
    assert.throws(() => {
      mergeObjHist.value.b = '3'
    }, Error)
  })

  it('Should not change the value when an empty object is passed.', () => {
    const originalObjectData = { a: '1', b: '2', c: { c1: '11', c2: '22' } }
    const objHist = new ObjectStateHistory(originalObjectData)
    const mergeEmptyObjHist = objHist.merge({})

    deepStrictEqual(mergeEmptyObjHist, originalObjectData)
    deepStrictEqual(objHist.value, originalObjectData)
  })

  it('Should merge the object passed.', () => {
    const originalObjectData = { a: '1', b: '2' }
    const mergeObjectData = { c: '3' }
    const lastObjectData = { a: '1', b: '2', c: '3' }

    const objHist = new ObjectStateHistory(originalObjectData)
    const mergeObjHist = objHist.merge(mergeObjectData)
    deepStrictEqual(mergeObjHist, lastObjectData)
    deepStrictEqual(objHist.value, lastObjectData)
  })

  it('Should keep the value unchanged when merge properties to its current values, and increment the history.', () => {
    const originalObjectData = { a: '1', b: '2' }
    const objHist = new ObjectStateHistory(originalObjectData)
    objHist.merge({ a: '1', b: '2' })
    deepStrictEqual(objHist.value, { a: '1', b: '2' })
    strictEqual(objHist.list().length, 2)
  })

  it('Should merge the property changed.', () => {
    const originalObjectData = { a: '1', b: '2' }

    const objHist = new ObjectStateHistory(originalObjectData)
    objHist.a = '11'
    deepStrictEqual(objHist.value, { a: '11', b: '2' })
  })

  it('Should keep the value unchanged when changing a property to its current value, and increment the history.', () => {
    const originalObjectData = { a: '1', b: '2' }
    const objHist = new ObjectStateHistory(originalObjectData)
    objHist.b = '2'
    deepStrictEqual(objHist.value, { a: '1', b: '2' })
    strictEqual(objHist.list().length, 2)
  })

  it('Should add the property changed.', () => {
    const originalObjectData = { a: '1', b: '2' }

    const objHist = new ObjectStateHistory(originalObjectData)
    objHist.c = '3'
    deepStrictEqual(objHist.value, { a: '1', b: '2', c: '3' })
  })

  it('Should the destructured object be equal to value,', () => {
    const originalObjectData = { a: '1', b: '2' }

    const objHist = new ObjectStateHistory(originalObjectData)
    objHist.c = '3'
    deepStrictEqual({ ...objHist }, objHist.value)
  })
})

describe('ObjectStateHistory delete operation', function () {
  it('Should not change the value when delete an inexistent proprety.', () => {
    const originalObjectData = { a: '1', b: '2' }
    const objHist = new ObjectStateHistory(originalObjectData)
    delete objHist.c
    deepStrictEqual(objHist.value, originalObjectData)
  })

  it('Should delete the property if exists.', () => {
    const originalObjectData = { a: '1', b: '2' }
    const objHist = new ObjectStateHistory(originalObjectData)
    delete objHist.b
    deepStrictEqual(objHist.value, { a: '1' })
  })

  it('Should keep the value unchanged when deleting a property that does not exist, and increment the history.', () => {
    const originalObjectData = { a: '1', b: '2' }
    const objHist = new ObjectStateHistory(originalObjectData)
    delete objHist.c
    deepStrictEqual(objHist.value, { a: '1', b: '2' })
    strictEqual(objHist.list().length, 2)
  })
})

describe('ObjectStateHistory list method', function () {
  it('Should return an error when try change the imuttable list.', () => {
    const objHistoryData = { a: '1', b: '2' }
    const objHist = new ObjectStateHistory(objHistoryData)
    const list = objHist.list()

    assert.throws(() => {
      list[0] = 'test'
    }, Error)
    assert.throws(() => {
      list.push('test')
    }, Error)
  })

  it('Should have the keys "timestamp", "operation", "data" and "value".', () => {
    const originalObjectData = { a: '1', b: '2' }
    const objHist = new ObjectStateHistory(originalObjectData)
    const list = objHist.list()

    assert.ok(
      ['timestamp', 'operation', 'data', 'value'].every((el) =>
        Object.keys(list[0]).includes(el)
      )
    )
  })

  it('Should have a lenght of 1 after call the constructor.', () => {
    const originalObjectData = { a: '1', b: '2' }
    const objHist = new ObjectStateHistory(originalObjectData)
    const list = objHist.list()
    strictEqual(list.length, 1)
  })

  it('Should increment the lenght after call the merge method.', () => {
    const originalObjectData = { a: '1', b: '2', c: { c1: '11', c2: '22' } }
    const objHist = new ObjectStateHistory(originalObjectData)
    objHist.merge({})
    const list = objHist.list()
    strictEqual(list.length, 2)
  })

  it('Should increment the lenght after call the replace method.', () => {
    const originalObjectData = { a: '1', b: '2', c: { c1: '11', c2: '22' } }
    const objHist = new ObjectStateHistory(originalObjectData)
    objHist.replace({ c: '3' })
    const list = objHist.list()
    strictEqual(list.length, 2)
  })

  it('Should increment the lenght after change an existent property.', () => {
    const originalObjectData = { a: '1', b: '2' }

    const objHist = new ObjectStateHistory(originalObjectData)
    objHist.a = '11'
    const list = objHist.list()
    strictEqual(list.length, 2)
  })

  it('Should increment the lenght after change an inexistent property.', () => {
    const originalObjectData = { a: '1', b: '2' }

    const objHist = new ObjectStateHistory(originalObjectData)
    objHist.z = '11'
    const list = objHist.list()
    strictEqual(list.length, 2)
  })

  it('Should increment the lenght after delete an existent property.', () => {
    const originalObjectData = { a: '1', b: '2' }
    const objHist = new ObjectStateHistory(originalObjectData)
    delete objHist.b
    const list = objHist.list()
    strictEqual(list.length, 2)
  })

  it('Should the last item value be equal to the object value property.', () => {
    const originalObjectData = { a: '1', b: '2' }
    const objHist = new ObjectStateHistory(originalObjectData)
    objHist.c = '3'
    objHist.d = '4'
    const list = objHist.list()
    deepStrictEqual(list.at(-1).value, objHist.value)
  })

  it('Should increment the lenght after delete an inexistent property.', () => {
    const originalObjectData = { a: '1', b: '2' }
    const objHist = new ObjectStateHistory(originalObjectData)
    delete objHist.z
    const list = objHist.list()
    strictEqual(list.length, 2)
  })

  it('Should limit the list size to limit option and last value should reflect last change.', () => {
    const limit = 3
    const nrChanges = limit + 5
    const originalObjectData = { a: '1', b: '2' }
    const options = { limit }
    const objHist = new ObjectStateHistory(originalObjectData, options)
    for (let i = 0; i <= nrChanges; i++) {
      objHist.c = i
    }
    const list = objHist.list()
    strictEqual(list.length, limit)
    deepStrictEqual(objHist.value, { ...originalObjectData, c: nrChanges })
    deepStrictEqual(objHist.value, { ...originalObjectData, c: nrChanges })
  })

  it('Should not limit the list size when limit option is zero (0).', () => {
    const limit = 0
    const nrChanges = limit + 5
    const originalObjectData = { a: '1', b: '2' }
    const options = { limit }
    const objHist = new ObjectStateHistory(originalObjectData, options)
    for (let i = 0; i < nrChanges; i++) {
      objHist.c = i
    }
    const list = objHist.list()
    strictEqual(list.length, nrChanges + 1)
  })
})

describe('ObjectStatHistory info method.', () => {
  it('Should have the keys "options", "list" and "value".', () => {
    const originalObjectData = { a: '1', b: '2' }
    const objHist = new ObjectStateHistory(originalObjectData)
    const info = objHist.info()

    assert.ok(
      ['options', 'list', 'value'].every((el) =>
        Object.keys(info).includes(el)
      )
    )
  })

  it('Shoul return an object where the options porperty is an object.', () => {
    const originalObjectData = { a: '1', b: '2' }
    const objHist = new ObjectStateHistory(originalObjectData)
    const info = objHist.info()
    assert.ok(info.options.constructor === Object)
  })

  it('Should return an object where the value property is equal to the value of the Object.', () => {
    const limit = 3
    const nrChanges = limit + 5
    const originalObjectData = { a: '1', b: '2' }
    const options = { limit }
    const objHist = new ObjectStateHistory(originalObjectData, options)
    for (let i = 0; i < nrChanges; i++) {
      objHist.c = i
    }
    const info = objHist.info()
    deepStrictEqual(objHist.value, info.value)
  })

  it('Should return an object where the list property is equal to the list returned by list method.', () => {
    const limit = 3
    const nrChanges = limit + 5
    const originalObjectData = { a: '1', b: '2' }
    const options = { limit }
    const objHist = new ObjectStateHistory(originalObjectData, options)
    for (let i = 0; i < nrChanges; i++) {
      objHist.c = i
    }
    const info = objHist.info()
    deepStrictEqual(objHist.list(), info.list)
  })
})

describe('ObjectStateHistory at method.', function () {
  it('Should return an error when try change the imuttable value.', () => {
    const objHistoryData = { a: '1', b: '2' }
    const objHist = new ObjectStateHistory(objHistoryData)
    const atObjHist = objHist.at()

    assert.throws(() => {
      objHist.value = { d: '4' }
    }, Error)
    assert.throws(() => {
      objHist.value.b = '3'
    }, Error)
    assert.throws(() => {
      atObjHist.value = { d: '4' }
    }, Error)
    assert.throws(() => {
      atObjHist.value.b = '3'
    }, Error)
  })
  it('Should return undefined when called with invalid index.', () => {
    const originalObjectData = { a: '1', b: '2' }
    const objHist = new ObjectStateHistory(originalObjectData)
    objHist.c = '3'
    const value1 = objHist.at(7)
    strictEqual(value1, undefined)

    const value2 = objHist.at('text')
    strictEqual(value2, undefined)
  })

  it('Should return the object value (last value) when called without arguments.', () => {
    const originalObjectData = { a: '1', b: '2' }
    const objHist = new ObjectStateHistory(originalObjectData)
    objHist.c = '3'
    const value = objHist.at()
    deepStrictEqual(value, objHist.value)
    deepStrictEqual(value, { a: '1', b: '2', c: '3' })
    deepStrictEqual(value, objHist.list().at(-1).value)
  })

  it('Should return the object value (last value) when called with -1.', () => {
    const originalObjectData = { a: '1', b: '2' }
    const objHist = new ObjectStateHistory(originalObjectData)
    objHist.c = '3'
    const valueMinusOne = objHist.at(-1)
    deepStrictEqual(valueMinusOne, objHist.value)
    deepStrictEqual(valueMinusOne, { a: '1', b: '2', c: '3' })
    deepStrictEqual(valueMinusOne, objHist.list().at(-1).value)
  })

  it('Should return the object value corresponding to argument index.', () => {
    const originalObjectData = { a: '1', b: '2' }
    const objHist = new ObjectStateHistory(originalObjectData)
    objHist.c = '3'
    objHist.d = '4'

    const valueZero = objHist.at(0)
    deepStrictEqual(valueZero, originalObjectData)

    const valueOne = objHist.at(1)
    deepStrictEqual(valueOne, { a: '1', b: '2', c: '3' })

    const valueTwo = objHist.at(2)
    deepStrictEqual(valueTwo, { a: '1', b: '2', c: '3', d: '4' })

    const valueMinusTwo = objHist.at(-2)
    deepStrictEqual(valueMinusTwo, objHist.list().at(-2).value)

    const valueMinusOne = objHist.at(-1)
    const valueNoarguments = objHist.at()
    deepStrictEqual(valueMinusOne, { a: '1', b: '2', c: '3', d: '4' })
    deepStrictEqual(valueNoarguments, { a: '1', b: '2', c: '3', d: '4' })
    deepStrictEqual(valueMinusOne, valueNoarguments)
    deepStrictEqual(valueMinusOne, objHist.value)
  })
})

describe('ObjectStateHistory replace method.', function () {
  it('Should return an error when no parameter is passed to it.', () => {
    const originalObjectData = { a: '1', b: '2' }
    const objHist = new ObjectStateHistory(originalObjectData)

    assert.throws(() => {
      objHist.replace()
    }, Error)
  })

  it('Should return an error when no object is passed to it.', () => {
    const originalObjectData = { a: '1', b: '2' }
    const objHist = new ObjectStateHistory(originalObjectData)

    assert.throws(() => {
      objHist.replace(123)
    }, Error)
  })

  it('Should return an error when try change the imuttable value.', () => {
    const objHistoryData = { a: '1', b: '2' }
    const objHist = new ObjectStateHistory(objHistoryData)
    const mergeObjHist = objHist.replace({ c: '3' })

    assert.throws(() => {
      objHist.value = { d: '4' }
    }, Error)
    assert.throws(() => {
      objHist.value.c = '3'
    }, Error)
    assert.throws(() => {
      mergeObjHist.value = { d: '4' }
    }, Error)
    assert.throws(() => {
      mergeObjHist.value.c = '3'
    }, Error)
  })

  it('Should return as value the object passed as argument.', () => {
    const originalObjectData = { a: '1', b: '2' }
    const replaceObjectData = { c: '3' }
    const objHist = new ObjectStateHistory(originalObjectData)
    const replaceObject = objHist.replace(replaceObjectData)
    deepStrictEqual(objHist.value, replaceObjectData)
    deepStrictEqual(replaceObject, replaceObjectData)
  })
})

describe('ObjectStateHistory external cache.', function () {
  it('Should return an error when cache is provided but is not Object constructor.', () => {
    assert.throws(() => {
      const options = {
        cache: undefined
      }
      const objHist = new ObjectStateHistory({ a: '1', b: '2' }, options)
      console.error('This should not print: ', objHist)
    }, Error)
    assert.throws(() => {
      const options = {
        cache: 'text'
      }
      const objHist = new ObjectStateHistory({ a: '1', b: '2' }, options)
      console.error('This should not print: ', objHist)
    }, Error)
    assert.throws(() => {
      const options = {
        cache: 123
      }
      const objHist = new ObjectStateHistory({ a: '1', b: '2' }, options)
      console.error('This should not print: ', objHist)
    }, Error)
    assert.throws(() => {
      const options = {
        cache: []
      }
      const objHist = new ObjectStateHistory({ a: '1', b: '2' }, options)
      console.error('This should not print: ', objHist)
    }, Error)
  })

  it('Should return an error when client cache is provided but the the get property is not a function.', () => {
    assert.throws(() => {
      const options = {
        cache: { client: { get: 'text' }, key: 'uniqueKey' }
      }
      const objHist = new ObjectStateHistory({ a: '1', b: '2' }, options)
      console.error('This should not print: ', objHist)
    }, Error)
    assert.throws(() => {
      const options = {
        cache: { client: { get: 123 }, key: 'uniqueKey' }
      }
      const objHist = new ObjectStateHistory({ a: '1', b: '2' }, options)
      console.error('This should not print: ', objHist)
    }, Error)
  })

  it('Should return an error when client cache is provided but the the set property is not a function.', () => {
    assert.throws(() => {
      const options = {
        cache: { client: { set: 'text' }, key: 'uniqueKey' }
      }
      const objHist = new ObjectStateHistory({ a: '1', b: '2' }, options)
      console.error('This should not print: ', objHist)
    }, Error)
    assert.throws(() => {
      const options = {
        cache: { client: { set: 123 }, key: 'uniqueKey' }
      }
      const objHist = new ObjectStateHistory({ a: '1', b: '2' }, options)
      console.error('This should not print: ', objHist)
    }, Error)
  })

  it('Should return an error when cache is provided but does not have client property.', () => {
    assert.throws(() => {
      const options = {
        cache: { key: 'uniqueKey' }
      }
      const objHist = new ObjectStateHistory({ a: '1', b: '2' }, options)
      console.error('This should not print: ', objHist)
    }, Error)
  })

  it('Should return an error when cache is provided but does not have key property.', () => {
    assert.throws(() => {
      const options = {
        cache: { client: new Map() }
      }
      const objHist = new ObjectStateHistory({ a: '1', b: '2' }, options)
      console.error('This should not print: ', objHist)
    }, Error)
  })

  it('Should return an error when cache is provided and the key property is an empty string, undefined or null.', () => {
    assert.throws(() => {
      const options = {
        cache: { client: new Map(), key: '' }
      }
      const objHist = new ObjectStateHistory({ a: '1', b: '2' }, options)
      console.error('This should not print: ', objHist)
    }, Error)
    assert.throws(() => {
      const options = {
        cache: { client: new Map(), key: undefined }
      }
      const objHist = new ObjectStateHistory({ a: '1', b: '2' }, options)
      console.error('This should not print: ', objHist)
    }, Error)
    assert.throws(() => {
      const options = {
        cache: { client: new Map(), key: null }
      }
      const objHist = new ObjectStateHistory({ a: '1', b: '2' }, options)
      console.error('This should not print: ', objHist)
    }, Error)
  })

  it('Should return the same value for list method and the value in external cache for the given key.', () => {
    const cacheClient = new Map()
    const originalObjectData = { a: '1', b: '2' }
    const options = {
      cache: {
        client: cacheClient,
        key: 'uniqueKey'
      }
    }
    const objHist = new ObjectStateHistory(originalObjectData, options)
    objHist.c = '3'
    const cacheGet = cacheClient.get(options.cache.key)
    assert.deepStrictEqual(cacheGet, objHist.list())
  })

  it('Should the changes made to a cached object be reflected in another object created with the same cache key', () => {
    const cacheClient = new Map()
    const originalObjectData = { a: '1', b: '2' }
    const options = {
      cache: {
        client: cacheClient,
        key: 'uniqueKey'
      }
    }
    const objHist = new ObjectStateHistory(originalObjectData, options)
    objHist.c = '3'

    const objCache = new ObjectStateHistory(null, options)
    objCache.d = '4'
    deepStrictEqual(objCache.value, objHist.value)
    deepStrictEqual(objCache.value, { a: '1', b: '2', c: '3', d: '4' })
    deepStrictEqual(objHist.value, { a: '1', b: '2', c: '3', d: '4' })
    strictEqual(objCache.list().length, objHist.list().length)
  })

  it('Should merge object sent int the constructor, when use cache from of a previously created object', () => {
    const cacheClient = new Map()
    const originalObjectData = { a: '1', b: '2' }
    const options = {
      cache: {
        client: cacheClient,
        key: 'uniqueKey'
      }
    }
    const objHist = new ObjectStateHistory(originalObjectData, options)
    const objCache = new ObjectStateHistory({ c: '3', d: '4' }, options)

    deepStrictEqual(objCache.value, objHist.value)
    deepStrictEqual(objCache.value, { a: '1', b: '2', c: '3', d: '4' })
    deepStrictEqual(objHist.value, { a: '1', b: '2', c: '3', d: '4' })
    strictEqual(objCache.list().length, objHist.list().length)
  })
})
