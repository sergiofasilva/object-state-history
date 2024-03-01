'use strict'
import ObjectStateHistory from '../index.js'
import { describe, it } from 'node:test'
import assert, { deepStrictEqual, strictEqual } from 'node:assert/strict'
import { inspect } from 'node:util'

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

  it('Should return an error when try change the immutable value.', () => {
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

  it('Should return the value as JSON stringify when call the object with template literal.', () => {
    const objHistoryData = { a: '1', b: '2' }
    const objHist = new ObjectStateHistory(objHistoryData)

    deepStrictEqual(objHist.value, objHistoryData)
    deepStrictEqual(`${objHist}`, JSON.stringify(objHist.value))
  })

  it('Should return the value as JSON stringify when call the object with JSON.stringify.', () => {
    const objHistoryData = { a: '1', b: '2' }
    const objHist = new ObjectStateHistory(objHistoryData)

    deepStrictEqual(objHist.value, objHistoryData)
    deepStrictEqual(JSON.stringify(objHist), JSON.stringify(objHist.value))
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

describe('ObjectStateHistory instance representation', function () {
  it('Should return an array with all the keys of ObjectStateHistory value object when call Object.keys.', () => {
    const objHist = new ObjectStateHistory({ a: '1', b: '2' })
    objHist.c = '3'
    deepStrictEqual(Object.keys(objHist), ['a', 'b', 'c'])
  })

  it('Should return an array with all the values of ObjectStateHistory value object when call Object.values.', () => {
    const objHist = new ObjectStateHistory({ a: '1', b: '2' })
    objHist.c = '3'
    deepStrictEqual(Object.values(objHist), ['1', '2', '3'])
  })

  it('Should return an array with all the entries of ObjectStateHistory value object when call Object.entries.', () => {
    const objHist = new ObjectStateHistory({ a: '1', b: '2' })
    objHist.c = '3'
    deepStrictEqual(Object.entries(objHist), [['a', '1'], ['b', '2'], ['c', '3']])
  })

  it('Should print the class name followed by last value when printing the object instance.', () => {
    const objHist = new ObjectStateHistory({ a: '1', b: '2' })
    objHist.c = '3'
    deepStrictEqual(inspect(objHist), 'ObjectStateHistory: {"a":"1","b":"2","c":"3"}')
  })
})

describe('ObjectStateHistory options.', function () {
  it('Should return an error when provided options argument is not object, undefined or null.', () => {
    assert.throws(() => {
      const objHist = new ObjectStateHistory({ a: '1', b: '2' }, null, 'text')
      console.error('This should not print: ', objHist)
    }, Error)
    assert.throws(() => {
      const objHist = new ObjectStateHistory({ a: '1', b: '2' }, null, 3)
      console.error('This should not print: ', objHist)
    }, Error)
    assert.throws(() => {
      const objHist = new ObjectStateHistory({ a: '1', b: '2' }, null, [])
      console.error('This should not print: ', objHist)
    }, Error)
  })

  it('Should not return an error when provided options argument is empty, undefined, null, or object.', () => {
    assert.ok(new ObjectStateHistory({ a: '1', b: '2' }))
    assert.ok(new ObjectStateHistory({ a: '1', b: '2' }, null, undefined))
    assert.ok(new ObjectStateHistory({ a: '1', b: '2' }, null, null))
    assert.ok(new ObjectStateHistory({ a: '1', b: '2' }, null, {}))
  })

  it('Should return an limit=0 and skipDelta=1 object when the options are not provided.', () => {
    const objHistoryData = { a: '1', b: '2' }
    const objHist = new ObjectStateHistory(objHistoryData)
    const info = objHist.info()
    deepStrictEqual(info.options, { limit: 0, skipDelta: 1 })
  })
})

describe('ObjectStateHistory limit option.', function () {
  it('Should return an error when provided limit options is not an integer not negative.', () => {
    assert.throws(() => {
      const objHist = new ObjectStateHistory({ a: '1', b: '2' }, null, { limit: 'text' })
      console.error('This should not print: ', objHist)
    }, Error)
    assert.throws(() => {
      const objHist = new ObjectStateHistory({ a: '1', b: '2' }, null, { limit: -5 })
      console.error('This should not print: ', objHist)
    }, Error)
    assert.throws(() => {
      const objHist = new ObjectStateHistory({ a: '1', b: '2' }, null, { limit: 5.4 })
      console.error('This should not print: ', objHist)
    }, Error)
    assert.throws(() => {
      const objHist = new ObjectStateHistory({ a: '1', b: '2' }, null, { limit: {} })
      console.error('This should not print: ', objHist)
    }, Error)
    assert.throws(() => {
      const objHist = new ObjectStateHistory({ a: '1', b: '2' }, null, { limit: [] })
      console.error('This should not print: ', objHist)
    }, Error)
  })

  it('Should not return an error when the options provided do not include the limit property.', () => {
    assert.ok(new ObjectStateHistory({ a: '1', b: '2' }, null, { noLimitProperty: 2 }))
  })

  it('Should have a limit option equal to zero (0) when the options provided not include the limit property.', () => {
    const objHistoryData = { a: '1', b: '2' }
    const objHist = new ObjectStateHistory(objHistoryData, null, { noLimitProperty: 2 })
    const info = objHist.info()
    strictEqual(info.options.limit, 0)
  })

  it('Should have a limit option equal to the options limit property.', () => {
    const objHistoryData = { a: '1', b: '2' }
    const limit = 3
    const objHist = new ObjectStateHistory(objHistoryData, null, { limit })
    const info = objHist.info()
    strictEqual(info.options.limit, limit)
  })

  it('Should have a skipDelta = 0 when limit is greater than 0.', () => {
    const objHistoryData = { a: '1', b: '2' }
    const limit = 3
    const skipDelta = 5
    const objHist = new ObjectStateHistory(objHistoryData, null, { limit, skipDelta })
    const info = objHist.info()
    strictEqual(info.options.skipDelta, 0)
  })

  it('Should have a skipDelta option equal to the options skipDelta property, if limit = 0.', () => {
    const objHistoryData = { a: '1', b: '2' }
    const limit = 0
    const skipDelta = 5
    const objHist = new ObjectStateHistory(objHistoryData, null, { limit, skipDelta })
    const info = objHist.info()
    strictEqual(info.options.skipDelta, skipDelta)
  })

  it('Should have a skipDelta option equal to the options skipDelta property, if limit is not assigned.', () => {
    const objHistoryData = { a: '1', b: '2' }
    const skipDelta = 5
    const objHist = new ObjectStateHistory(objHistoryData, null, { skipDelta })
    const info = objHist.info()
    strictEqual(info.options.skipDelta, skipDelta)
  })

  it('Should have a skipDelta option equal to one (1) when the options provided not include the limit and skipDelta properties.', () => {
    const objHistoryData = { a: '1', b: '2' }
    const objHist = new ObjectStateHistory(objHistoryData, null, { otherOption: 2 })
    const info = objHist.info()
    strictEqual(info.options.skipDelta, 1)
  })

  it('Should all value properties from list have a valid value if skipDelta = 0.', () => {
    const objHistoryData = { a: '1', b: '2' }
    const objHist = new ObjectStateHistory(objHistoryData, null, { limit: 0, skipDelta: 0 })
    objHist.c = '3'
    objHist.d = '4'
    objHist.e = '5'

    const info = objHist.info()
    strictEqual(info.options.skipDelta, 0)

    strictEqual(objHist.list().length, 4)
    deepStrictEqual(info.list[0].value, { a: '1', b: '2' })
    deepStrictEqual(info.list[1].value, { a: '1', b: '2', c: '3' })
    deepStrictEqual(info.list[2].value, { a: '1', b: '2', c: '3', d: '4' })
    deepStrictEqual(info.list[3].value, { a: '1', b: '2', c: '3', d: '4', e: '5' })
  })

  it('Should only the n skipDelta value properties from list have a valid value if skipDelta > 0.', () => {
    const objHistoryData = { a: '1', b: '2' }
    const objHist = new ObjectStateHistory(objHistoryData, null, { limit: 0, skipDelta: 2 })
    objHist.c = '3'
    objHist.d = '4'
    objHist.e = '5'

    const info = objHist.info()
    strictEqual(info.options.skipDelta, 2)

    strictEqual(objHist.list().length, 4)
    strictEqual(info.list[0].value, null)
    strictEqual(info.list[1].value, null)
    deepStrictEqual(info.list[2].value, { a: '1', b: '2', c: '3', d: '4' })
    deepStrictEqual(info.list[3].value, { a: '1', b: '2', c: '3', d: '4', e: '5' })
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

  it('Should return an error when try change the immutable value.', () => {
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
  it('Should return an error when try change the immutable list.', () => {
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
    const objHist = new ObjectStateHistory(originalObjectData, null, options)
    for (let i = 0; i <= nrChanges; i++) {
      objHist.c = i
    }
    const list = objHist.list()
    strictEqual(list.length, limit)
    console.log('LIST:', objHist.list())
    console.log('VALUE:', objHist.value)

    deepStrictEqual(objHist.value, { ...originalObjectData, c: nrChanges })
  })

  it('Should not limit the list size when limit option is zero (0).', () => {
    const limit = 0
    const nrChanges = limit + 5
    const originalObjectData = { a: '1', b: '2' }
    const options = { limit }
    const objHist = new ObjectStateHistory(originalObjectData, null, options)
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
    const objHist = new ObjectStateHistory(originalObjectData, null, options)
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
    const objHist = new ObjectStateHistory(originalObjectData, null, options)
    for (let i = 0; i < nrChanges; i++) {
      objHist.c = i
    }
    const info = objHist.info()
    deepStrictEqual(objHist.list(), info.list)
  })
})

describe('ObjectStateHistory at method.', function () {
  it('Should return an error when try change the immutable value.', () => {
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
    const objHist = new ObjectStateHistory(originalObjectData, null, { skipDelta: 0 })
    objHist.c = '3'
    objHist.d = '4'

    const valueZero = objHist.at(0)
    deepStrictEqual(valueZero, originalObjectData)

    const valueOne = objHist.at(1)
    deepStrictEqual(valueOne, { a: '1', b: '2', c: '3' })

    const valueTwo = objHist.at(2)
    deepStrictEqual(valueTwo, { a: '1', b: '2', c: '3', d: '4' })

    const valueMinusTwo = objHist.at(-2)
    deepStrictEqual(valueMinusTwo, objHist.list().at(-2).value) // only when skipDelta = 0, otherwise should be null

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

  it('Should return an error when try change the immutable value.', () => {
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

describe('ObjectStateHistory with history.', function () {
  it('Should the the history data be aplied. Test with empty data.', () => {
    const originalObjectData = { a: '1', b: '2' }

    const objInitial = new ObjectStateHistory(originalObjectData)
    objInitial.c = '3'

    const history = objInitial.list()
    const objWithHist = new ObjectStateHistory(null, history, null)
    objWithHist.d = '4'
    deepStrictEqual(objInitial.value, { a: '1', b: '2', c: '3' })
    deepStrictEqual(objWithHist.value, { a: '1', b: '2', c: '3', d: '4' })
    deepStrictEqual(objWithHist.list().length, 4)
  })
  it('Should the the history data be aplied. Test with an object to merge with history.', () => {
    const originalObjectData = { a: '1', b: '2' }

    const objInitial = new ObjectStateHistory(originalObjectData)
    objInitial.c = '3'

    const history = objInitial.list()
    const objWithHist = new ObjectStateHistory({ d: '4' }, history, null)
    objWithHist.e = '5'
    deepStrictEqual(objInitial.value, { a: '1', b: '2', c: '3' })
    deepStrictEqual(objWithHist.value, { a: '1', b: '2', c: '3', d: '4', e: '5' })
    deepStrictEqual(objWithHist.list().length, 4)
  })
})

describe('ObjectStateHistory properties.', function () {
  it('Should return the number of value keys when call the length property.', () => {
    const objHist = new ObjectStateHistory({ a: '1', b: '2' })
    deepStrictEqual(objHist.length, 2)
    objHist.c = '3'
    deepStrictEqual(objHist.length, 3)
    objHist.d = '4'
    deepStrictEqual(objHist.length, 4)
    delete objHist.d
    deepStrictEqual(objHist.length, 3)
  })
})

describe('ObjectStateHistory instance events.', function () {
  it('Should return changed data when on change event occurs.', () => {
    const objHist = new ObjectStateHistory({ a: '1', b: '2' })
    objHist.on('change', function (item) {
      deepStrictEqual(item.data, { c: '3' })
      deepStrictEqual(this.value, { a: '1', b: '2', c: '3' })
      deepStrictEqual(this.at(0), { a: '1', b: '2' })
      deepStrictEqual(this.list().length, 2)
    })
    objHist.c = '3'
  })
})
