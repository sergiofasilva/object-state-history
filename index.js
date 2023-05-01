'use strict';

const OPERATIONS = Object.freeze({
  delete: 'delete',
  replace: 'replace',
  merge: 'merge',
});

class ObjectStateHistory {
  #history = [];
  constructor(object) {
    if (object === undefined) {
      object = {};
    }
    if (object.constructor !== Object) {
      throw new Error('Should be provided an argument of type object.');
    }
    const obj = structuredClone(object);

    this.#history.push(ObjectStateHistory.#buildItem(obj));
    this.#buildObjectRepresentation();

    return new Proxy(this, {
      set(object, key, value, proxy) {
        const obj = {};
        obj[key] = value;
        object.#merge(obj);
        return true;
      },
      get: (target, prop, receiver) => {
        const value = target[prop];

        if (value instanceof Function) {
          return function (...args) {
            return value.apply(this === receiver ? target : this, args);
          };
        }
        return value || target.value[prop];
      },
      deleteProperty(target, prop) {
        const newObj = structuredClone(target.value);
        if (prop in newObj) {
          target.#merge(prop, OPERATIONS.delete);
        }
        return true;
      },
    });
  }

  valueOf() {
    return this.value;
  }

  toString() {
    return JSON.stringify(this.value);
  }

  get value() {
    const lastItem = this.#mergeListOfObjects();
    return ObjectStateHistory.#getFreezedClonedObject(lastItem);
  }

  merge(data) {
    return this.#merge(data);
  }

  replace(data) {
    return this.#merge(data, OPERATIONS.replace);
  }

  #merge(data, operation = OPERATIONS.merge) {
    const isMergeOrReplaceOperation = [
      OPERATIONS.merge,
      OPERATIONS.replace,
    ].includes(operation);

    const isValidData =
      data !== undefined &&
      (!isMergeOrReplaceOperation || data.constructor === Object);

    if (!isValidData) {
      throw new Error('Should be provided an argument of type object.');
    }

    const item = ObjectStateHistory.#buildItem(data, operation);
    this.#history.push(item);
    this.#buildObjectRepresentation(item);

    return this.value;
  }

  list() {
    return ObjectStateHistory.#getFreezedClonedObject(this.#history);
  }

  listAll() {
    let history;
    try {
      const historyList = this.list();
      history = historyList.map((el, idx) => {
        el.value =
          idx === 0
            ? { ...el.data }
            : mergeItems(historyList[idx - 1].value, el);
        return el;
      });
    } catch (error) {
      history = [];
    }

    return ObjectStateHistory.#getFreezedClonedObject(history);
  }

  at(index = -1) {
    if (!Number.isInteger(index)) {
      return undefined;
    }

    index = index < 0 ? this.#history.length + index : index;
    const itemAtIndex = this.#history[index];
    if (itemAtIndex === undefined) {
      return undefined;
    }

    const historyToIndex = this.#history.slice(0, index + 1);
    const item = this.#mergeListOfObjects(historyToIndex);
    return ObjectStateHistory.#getFreezedClonedObject(item);
  }

  #mergeListOfObjects(list) {
    list = list || this.#history;
    const merged = list.reduce((previous, current) => {
      return mergeItems(previous, current);
    }, {});
    return Object.freeze(merged);
  }

  #buildObjectRepresentation(lastItem) {
    if (lastItem && lastItem.operation === OPERATIONS.delete) {
      delete this[lastItem.data];
    }
    if (lastItem && lastItem.operation === OPERATIONS.replace) {
      for (const key of Object.keys(this)) {
        delete this[key];
      }
    }
    Object.keys(this.value).forEach((key) => (this[key] = this.value[key]));
  }

  static #buildItem(item, operation = OPERATIONS.merge) {
    return {
      timestamp: Date.now(),
      operation: operation,
      data: item,
    };
  }

  static #getFreezedClonedObject(obj) {
    return Object.freeze(structuredClone(obj));
  }
}

function mergeItems(previous, current) {
  if (previous?.constructor !== Object) {
    throw new Error('The "previous" argument should be of type object.');
  }
  if (
    !current ||
    (current.operation === OPERATIONS.merge &&
      current?.data?.constructor !== Object)
  ) {
    return { ...previous };
  }

  if (current.operation === OPERATIONS.delete) {
    const newPrevious = structuredClone(previous);
    delete newPrevious[current.data];
    return newPrevious;
  }
  if (current.operation === OPERATIONS.replace) {
    return structuredClone(current.data);
  }
  return { ...previous, ...current.data };
}

module.exports = ObjectStateHistory;
