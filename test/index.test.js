'use strict';
import ObjectStateHistory from '../index.js';
import { describe, it, before } from 'node:test';
import assert, { deepStrictEqual, strictEqual } from 'node:assert/strict';

describe('ObjectStateHistory constructor', function () {
  it('Should return an error when no object is passed to it.', () => {
    assert.throws(() => {
      new ObjectStateHistory([]);
    }, Error);
    assert.throws(() => {
      new ObjectStateHistory('string');
    }, Error);
    assert.throws(() => {
      new ObjectStateHistory(123);
    }, Error);
    assert.throws(() => {
      new ObjectStateHistory(new Set());
    }, Error);
  });

  it('Should return an empty object when no parameter is passed to it.', () => {
    const emptyObjHist = new ObjectStateHistory();
    deepStrictEqual(emptyObjHist.value, {});
  });

  it('Should return the object provided.', () => {
    const objHistoryData = { a: '1', b: '2' };
    const objHist = new ObjectStateHistory(objHistoryData);

    deepStrictEqual(objHist.value, objHistoryData);
    deepStrictEqual(objHist.value, objHist.valueOf());
  });

  it('Should return the value as JSON stringify when call toString method.', () => {
    const objHistoryData = { a: '1', b: '2' };
    const objHist = new ObjectStateHistory(objHistoryData);

    deepStrictEqual(objHist.value, objHistoryData);
    deepStrictEqual(objHist.toString(), JSON.stringify(objHist.value));
  });

  it('Should not change the original object.', () => {
    const objData = { a: '1', b: '2' };
    const objDataCopy = { ...objData };
    new ObjectStateHistory(objData);
    deepStrictEqual(objData, objDataCopy);
  });

  it('Should not change the value when change the original object.', () => {
    const objData = { a: '1', b: '2' };
    const objDataCopy = { ...objData };
    const objHist = new ObjectStateHistory(objData);
    objData.b = '3';
    assert.notEqual(objData, objDataCopy);
    deepStrictEqual(objHist.value, objDataCopy);
  });
});

describe('ObjectStateHistory merge method', function () {
  it('Should return an error when no parameter is passed to it.', () => {
    const originalObjectData = { a: '1', b: '2' };
    const objHist = new ObjectStateHistory(originalObjectData);

    assert.throws(() => {
      objHist.merge();
    }, Error);
  });

  it('Should not change the value when an empty object is passed.', () => {
    const originalObjectData = { a: '1', b: '2', c: { c1: '11', c2: '22' } };
    const objHist = new ObjectStateHistory(originalObjectData);
    const mergeEmptyObjHist = objHist.merge({});

    deepStrictEqual(mergeEmptyObjHist, originalObjectData);
    deepStrictEqual(objHist.value, originalObjectData);
  });

  it('Should merge the object passed.', () => {
    const originalObjectData = { a: '1', b: '2' };
    const mergeObjectData = { c: '3' };
    const lastObjectData = { a: '1', b: '2', c: '3' };

    const objHist = new ObjectStateHistory(originalObjectData);
    const mergeObjHist = objHist.merge(mergeObjectData);
    deepStrictEqual(mergeObjHist, lastObjectData);
    deepStrictEqual(objHist.value, lastObjectData);
  });

  it('Should merge the property changed.', () => {
    const originalObjectData = { a: '1', b: '2' };

    const objHist = new ObjectStateHistory(originalObjectData);
    objHist.a = '11';
    deepStrictEqual(objHist.value, { a: '11', b: '2' });
  });

  it('Should add the property changed.', () => {
    const originalObjectData = { a: '1', b: '2' };

    const objHist = new ObjectStateHistory(originalObjectData);
    objHist.c = '3';
    deepStrictEqual(objHist.value, { a: '1', b: '2', c: '3' });
  });

  // it('Should return an error when no parameter is passed to it.', () => {
  //   const objHistoryData = { a: '1', b: '2', c: { c1: '11', c2: '22' } };
  //   let objHist = new ObjectStateHistory(objHistoryData);
  //   //console.log('GET:', objHist.last());
  //   console.log('GET1:', objHist);
  //   const updateObjHist = objHist.merge({ c: { k: '33' } });
  //   console.log('UPDATE:', updateObjHist);
  //   objHist.a = 'aa';
  //   console.log('GET2:', objHist.a);
  //   console.log('VALUE OF:', objHist.valueOf());
  //   console.log('LIST:', objHist.list());
  //   console.log('LIST_ALL:', objHist.listAll());
  //   console.log('AT 0', objHist.at(0));
  //   console.log('AT 1', objHist.at(1));
  //   console.log('AT -1', objHist.at(-1));
  //   console.log('AT 10', objHist.at(10));
  //   objHist.a = '11';
  //   console.log('GET3:', objHist.value);

  //   console.log('DELETE BEFORE:', objHist);
  //   delete objHist.c.k;
  //   console.log('DELETE AFTER:', objHist);
  //   console.log('DELETE LIST ALL:', objHist.listAll());
  //   console.log('LAST VALUE:', objHist.value);
  // });
});

describe('ObjectStateHistory delete operation', function () {
  it('Should not change the value when delete an inexistent proprety.', () => {
    const originalObjectData = { a: '1', b: '2' };
    const objHist = new ObjectStateHistory(originalObjectData);
    delete objHist.c;
    deepStrictEqual(objHist.value, originalObjectData);
  });

  it('Should delete the property if exists.', () => {
    const originalObjectData = { a: '1', b: '2' };
    const objHist = new ObjectStateHistory(originalObjectData);
    delete objHist.b;
    deepStrictEqual(objHist.value, { a: '1' });
  });
});

describe('ObjectStateHistory list method', function () {
  it('Should have the keys "timestamp", "operation" and "data".', () => {
    const originalObjectData = { a: '1', b: '2' };
    const objHist = new ObjectStateHistory(originalObjectData);
    const list = objHist.list();

    console.log('Object.keys(list[0]): ', Object.keys(list[0]));
    assert.ok(
      ['timestamp', 'operation', 'data'].every((el) =>
        Object.keys(list[0]).includes(el)
      )
    );
  });

  it('Should have a lenght of 1 after call the constructor.', () => {
    const originalObjectData = { a: '1', b: '2' };
    const objHist = new ObjectStateHistory(originalObjectData);
    const list = objHist.list();
    strictEqual(list.length, 1);
  });

  it('Should increment the lenght after call the merge method.', () => {
    const originalObjectData = { a: '1', b: '2', c: { c1: '11', c2: '22' } };
    const objHist = new ObjectStateHistory(originalObjectData);
    objHist.merge({});
    const list = objHist.list();
    strictEqual(list.length, 2);
  });

  it('Should increment the lenght after change an existent property.', () => {
    const originalObjectData = { a: '1', b: '2' };

    const objHist = new ObjectStateHistory(originalObjectData);
    objHist.a = '11';
    const list = objHist.list();
    strictEqual(list.length, 2);
  });

  it('Should increment the lenght after change an inexistent property.', () => {
    const originalObjectData = { a: '1', b: '2' };

    const objHist = new ObjectStateHistory(originalObjectData);
    objHist.z = '11';
    const list = objHist.list();
    strictEqual(list.length, 2);
  });

  it('Should increment the lenght after delete an existent property.', () => {
    const originalObjectData = { a: '1', b: '2' };

    const objHist = new ObjectStateHistory(originalObjectData);
    delete objHist.b;
    const list = objHist.list();
    strictEqual(list.length, 2);
  });

  it('Should keep the lenght after delete an inexistent property.', () => {
    const originalObjectData = { a: '1', b: '2' };

    const objHist = new ObjectStateHistory(originalObjectData);
    delete objHist.z;
    const list = objHist.list();
    strictEqual(list.length, 1);
  });
});

describe('ObjectStateHistory listAll method', function () {
  it('Should have the keys "timestamp", "operation", "data" and "value".', () => {
    const originalObjectData = { a: '1', b: '2' };
    const objHist = new ObjectStateHistory(originalObjectData);
    const listAll = objHist.listAll();

    assert.ok(
      ['timestamp', 'operation', 'data', 'value'].every((el) =>
        Object.keys(listAll[0]).includes(el)
      )
    );
  });

  it('Should have a lenght of 1 after call the constructor.', () => {
    const originalObjectData = { a: '1', b: '2' };
    const objHist = new ObjectStateHistory(originalObjectData);
    const listAll = objHist.listAll();
    strictEqual(listAll.length, 1);
  });

  it('Should increment the lenght after call the merge method.', () => {
    const originalObjectData = { a: '1', b: '2', c: { c1: '11', c2: '22' } };
    const objHist = new ObjectStateHistory(originalObjectData);
    objHist.merge({});
    const listAll = objHist.listAll();
    strictEqual(listAll.length, 2);
  });

  it('Should increment the lenght after change an existent property.', () => {
    const originalObjectData = { a: '1', b: '2' };

    const objHist = new ObjectStateHistory(originalObjectData);
    objHist.a = '11';
    const listAll = objHist.listAll();
    strictEqual(listAll.length, 2);
  });

  it('Should increment the lenght after change an inexistent property.', () => {
    const originalObjectData = { a: '1', b: '2' };

    const objHist = new ObjectStateHistory(originalObjectData);
    objHist.z = '11';
    const listAll = objHist.listAll();
    strictEqual(listAll.length, 2);
  });

  it('Should increment the lenght after delete an existent property.', () => {
    const originalObjectData = { a: '1', b: '2' };

    const objHist = new ObjectStateHistory(originalObjectData);
    delete objHist.b;
    const listAll = objHist.listAll();
    strictEqual(listAll.length, 2);
  });

  it('Should keep the lenght after delete an inexistent property.', () => {
    const originalObjectData = { a: '1', b: '2' };

    const objHist = new ObjectStateHistory(originalObjectData);
    delete objHist.z;
    const listAll = objHist.listAll();
    strictEqual(listAll.length, 1);
  });

  it('Should return an empty array if "list" method throws an error.', async (ctx) => {
    const originalObjectData = { a: '1', b: '2' };
    const objHist = new ObjectStateHistory(originalObjectData);

    ctx.mock.method(objHist, 'list', () => {
      throw new Error('Test error.');
    });

    const emptyList = await objHist.listAll();
    deepStrictEqual(emptyList, []);
  });
});

describe('ObjectStateHistory at method', function () {
  it('Should return undefined when called with invalid index.', () => {
    const originalObjectData = { a: '1', b: '2' };
    const objHist = new ObjectStateHistory(originalObjectData);
    objHist.c = '3';
    const value1 = objHist.at(7);
    strictEqual(value1, undefined);

    const value2 = objHist.at('text');
    strictEqual(value2, undefined);
  });

  it('Should return the object value when called without arguments.', () => {
    const originalObjectData = { a: '1', b: '2' };
    const objHist = new ObjectStateHistory(originalObjectData);
    objHist.c = '3';
    const value = objHist.at();
    deepStrictEqual(value, objHist.value);
    deepStrictEqual(value, { a: '1', b: '2', c: '3' });
  });

  it('Should return the object value when called with -1.', () => {
    const originalObjectData = { a: '1', b: '2' };
    const objHist = new ObjectStateHistory(originalObjectData);
    objHist.c = '3';
    const valueMinusOne = objHist.at(-1);
    deepStrictEqual(valueMinusOne, objHist.value);
    deepStrictEqual(valueMinusOne, { a: '1', b: '2', c: '3' });
  });

  it('Should return the object value corresponding to argument index.', () => {
    const originalObjectData = { a: '1', b: '2' };
    const objHist = new ObjectStateHistory(originalObjectData);
    objHist.c = '3';
    objHist.d = '4';

    const valueZero = objHist.at(0);
    deepStrictEqual(valueZero, originalObjectData);

    const valueOne = objHist.at(1);
    deepStrictEqual(valueOne, { a: '1', b: '2', c: '3' });

    const valueTwo = objHist.at(2);
    deepStrictEqual(valueTwo, { a: '1', b: '2', c: '3', d: '4' });

    const valueMinusOne = objHist.at(-1);
    const valueNoarguments = objHist.at();
    deepStrictEqual(valueMinusOne, { a: '1', b: '2', c: '3', d: '4' });
    deepStrictEqual(valueNoarguments, { a: '1', b: '2', c: '3', d: '4' });
    deepStrictEqual(valueMinusOne, valueNoarguments);
    deepStrictEqual(valueMinusOne, objHist.value);
  });

  it('testes', () => {
    const originalObjectData = { a: '1', b: '2' };
    const objHist = new ObjectStateHistory(originalObjectData);
    objHist.merge({});
    console.log('LAST:', objHist);
  });
});
