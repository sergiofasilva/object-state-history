'use strict';

class ObjectHistory {
  #history = [];
  constructor(object) {
    if (object === undefined) {
      object = {};
    }
    if (object.constructor !== Object) {
      throw new Error('Should be provided an argument of type object.');
    }
    const obj = structuredClone(object);

    this.#history.push(ObjectHistory.#buildItem(obj));
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
          target.#merge(prop, 'delete');
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
    return ObjectHistory.#getFreezedClonedObject(lastItem);
  }

  merge(data) {
    return this.#merge(data);
  }

  #merge(data, operation = 'merge') {
    if (
      data === undefined ||
      (operation === 'merge' && data.constructor !== Object)
    ) {
      throw new Error('Should be provided an argument of type object.');
    }
    const item = ObjectHistory.#buildItem(data, operation);
    this.#history.push(item);
    this.#buildObjectRepresentation(item);

    return this.value;
  }

  list() {
    return ObjectHistory.#getFreezedClonedObject(this.#history);
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

    return ObjectHistory.#getFreezedClonedObject(history);
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
    return ObjectHistory.#getFreezedClonedObject(item);
  }

  #mergeListOfObjects(list) {
    list = list || this.#history;
    const merged = list.reduce((previous, current) => {
      return mergeItems(previous, current);
    }, {});
    return Object.freeze(merged);
  }

  #buildObjectRepresentation(lastItem) {
    if (lastItem && lastItem.operation === 'delete') {
      delete this[lastItem.data];
    }
    Object.keys(this.value).forEach((key) => (this[key] = this.value[key]));
  }

  static #buildItem(item, operation = 'merge') {
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
  if (
    !current ||
    (current.operation === 'merge' && current?.data?.constructor !== Object)
  ) {
    return { ...previous };
  }

  if (current.operation === 'delete') {
    const newPrevious = structuredClone(previous);
    delete newPrevious[current.data];
    return newPrevious;
  }
  return { ...previous, ...current.data };
}

export default ObjectHistory;
//export { ObjectHistory };
