'use strict';
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _ObjectStateHistory_instances, _a, _ObjectStateHistory_list, _ObjectStateHistory_options, _ObjectStateHistory_dat, _ObjectStateHistory_setOptions, _ObjectStateHistory_addItem, _ObjectStateHistory_merge, _ObjectStateHistory_buildObjectRepresentation, _ObjectStateHistory_buildListItem, _ObjectStateHistory_getFreezedClonedObject;
import { EventEmitter } from 'node:events';
import util from 'node:util';
import { isNaturalNumber } from './utils/validations.js';
const OPERATIONS = Object.freeze({
    delete: 'delete',
    replace: 'replace',
    merge: 'merge'
});
class ObjectStateHistory extends EventEmitter {
    constructor(object, history, options) {
        super();
        _ObjectStateHistory_instances.add(this);
        _ObjectStateHistory_list.set(this, []);
        _ObjectStateHistory_options.set(this, { limit: 0, lastStatesToKeep: 5 });
        const isValidArgument = object === undefined || object === null || (object === null || object === void 0 ? void 0 : object.constructor) === Object;
        if (!isValidArgument) {
            throw new Error('Should be provided an argument of type object.');
        }
        __classPrivateFieldGet(this, _ObjectStateHistory_instances, "m", _ObjectStateHistory_setOptions).call(this, options);
        const obj = structuredClone(object || {});
        const hasHistory = history && Array.isArray(history) && history.length > 0;
        if (hasHistory) {
            __classPrivateFieldSet(this, _ObjectStateHistory_list, Array.from(history), "f");
        }
        __classPrivateFieldGet(this, _ObjectStateHistory_instances, "m", _ObjectStateHistory_merge).call(this, obj);
        return new Proxy(this, {
            set: (target, key, value) => {
                const obj = {};
                obj[key] = value;
                __classPrivateFieldGet(target, _ObjectStateHistory_instances, "m", _ObjectStateHistory_merge).call(target, obj);
                return true;
            },
            get: (target, prop, receiver) => {
                const value = Reflect.get(target, prop, receiver);
                if (typeof value === 'function' && prop !== 'constructor') {
                    return function (...args) {
                        return value.apply(target, args);
                    };
                }
                return value;
            },
            deleteProperty: (target, prop) => {
                __classPrivateFieldGet(target, _ObjectStateHistory_instances, "m", _ObjectStateHistory_merge).call(target, prop, OPERATIONS.delete);
                return true;
            },
            ownKeys: (target) => {
                return Reflect.ownKeys(target.value);
            }
        });
    }
    get value() {
        return this.at();
    }
    get length() {
        return Object.keys(this.value).length;
    }
    valueOf() {
        return this.value;
    }
    at(index = -1) {
        const idx = index < 0 ? __classPrivateFieldGet(this, _ObjectStateHistory_list, "f").length + index : index;
        const itemAtIndex = __classPrivateFieldGet(this, _ObjectStateHistory_list, "f")[idx];
        const isItemWithAssignedValue = idx > __classPrivateFieldGet(this, _ObjectStateHistory_list, "f").length - __classPrivateFieldGet(this, _ObjectStateHistory_options, "f").lastStatesToKeep - 1;
        if (isItemWithAssignedValue) {
            return __classPrivateFieldGet(_a, _a, "m", _ObjectStateHistory_getFreezedClonedObject).call(_a, itemAtIndex === null || itemAtIndex === void 0 ? void 0 : itemAtIndex.value);
        }
        return __classPrivateFieldGet(_a, _a, "m", _ObjectStateHistory_getFreezedClonedObject).call(_a, __classPrivateFieldGet(this, _ObjectStateHistory_instances, "m", _ObjectStateHistory_dat).call(this, idx));
    }
    merge(data) {
        return __classPrivateFieldGet(this, _ObjectStateHistory_instances, "m", _ObjectStateHistory_merge).call(this, data);
    }
    replace(data) {
        return __classPrivateFieldGet(this, _ObjectStateHistory_instances, "m", _ObjectStateHistory_merge).call(this, data, OPERATIONS.replace);
    }
    list() {
        return __classPrivateFieldGet(_a, _a, "m", _ObjectStateHistory_getFreezedClonedObject).call(_a, __classPrivateFieldGet(this, _ObjectStateHistory_list, "f"));
    }
    info() {
        return {
            options: Object.assign({}, __classPrivateFieldGet(this, _ObjectStateHistory_options, "f")),
            list: this.list(),
            value: this.value
        };
    }
    [(_ObjectStateHistory_list = new WeakMap(), _ObjectStateHistory_options = new WeakMap(), _ObjectStateHistory_instances = new WeakSet(), _ObjectStateHistory_dat = function _ObjectStateHistory_dat(index = -1) {
        const idx = index;
        let value;
        for (let i = 0; i <= idx; i++) {
            const item = __classPrivateFieldGet(this, _ObjectStateHistory_list, "f")[i];
            value = mergeItemToObject(value, item);
        }
        return value;
    }, util.inspect.custom)](depth, options, inspect) {
        return `${this.constructor.name}: ${this.toString()}`;
    }
    toString() {
        return JSON.stringify(this.value);
    }
}
_a = ObjectStateHistory, _ObjectStateHistory_setOptions = function _ObjectStateHistory_setOptions(options) {
    const defaultOptions = {
        limit: 0,
        lastStatesToKeep: 5
    };
    if (options === undefined || options === null) {
        __classPrivateFieldSet(this, _ObjectStateHistory_options, defaultOptions, "f");
        return;
    }
    if (options.constructor !== Object) {
        throw new Error('When provided, the options parameter must be of type object.');
    }
    const schemaOptions = {
        limit: (value) => isNaturalNumber(value),
        lastStatesToKeep: (value) => isNaturalNumber(value)
    };
    const validate = (object, schema) => Object
        .entries(schema)
        .map(([key, validateFn]) => [
        key,
        !(key in object) || validateFn(object[key])
    ])
        .filter(([_, ...tests]) => !tests.every(Boolean))
        .map(([key, _]) => new Error(`Option ${key}: ${object[key]} is 'invalid'.`));
    const errors = validate(options, schemaOptions);
    if (errors.length > 0) {
        throw new Error(errors[0].message);
    }
    __classPrivateFieldGet(this, _ObjectStateHistory_options, "f").limit = +options.limit || defaultOptions.limit;
    __classPrivateFieldGet(this, _ObjectStateHistory_options, "f").lastStatesToKeep = __classPrivateFieldGet(this, _ObjectStateHistory_options, "f").limit
        ? 0
        : Number.isInteger(options.lastStatesToKeep)
            ? +options.lastStatesToKeep
            : defaultOptions.lastStatesToKeep;
}, _ObjectStateHistory_addItem = function _ObjectStateHistory_addItem(data, operation = OPERATIONS.merge) {
    var _b, _c, _d;
    const newItem = __classPrivateFieldGet(_a, _a, "m", _ObjectStateHistory_buildListItem).call(_a, data, operation);
    const lastIndex = __classPrivateFieldGet(this, _ObjectStateHistory_list, "f").length - 1;
    const lastValue = (_c = (_b = __classPrivateFieldGet(this, _ObjectStateHistory_list, "f")[lastIndex]) === null || _b === void 0 ? void 0 : _b.value) !== null && _c !== void 0 ? _c : __classPrivateFieldGet(this, _ObjectStateHistory_instances, "m", _ObjectStateHistory_dat).call(this, lastIndex);
    const lastItem = mergeItemToObject(lastValue, newItem);
    const isToClearValueFromlastStatesToKeepItems = __classPrivateFieldGet(this, _ObjectStateHistory_list, "f").length >= __classPrivateFieldGet(this, _ObjectStateHistory_options, "f").lastStatesToKeep && __classPrivateFieldGet(this, _ObjectStateHistory_options, "f").lastStatesToKeep > 0;
    if (isToClearValueFromlastStatesToKeepItems) {
        // clear the value of the the lastStatesToKeep previous item
        __classPrivateFieldGet(this, _ObjectStateHistory_list, "f")[__classPrivateFieldGet(this, _ObjectStateHistory_list, "f").length - __classPrivateFieldGet(this, _ObjectStateHistory_options, "f").lastStatesToKeep].value = null;
    }
    newItem.value = lastItem;
    __classPrivateFieldGet(this, _ObjectStateHistory_list, "f").push(newItem);
    this.emit('change', newItem);
    if ((_d = __classPrivateFieldGet(this, _ObjectStateHistory_options, "f")) === null || _d === void 0 ? void 0 : _d.limit) {
        __classPrivateFieldGet(this, _ObjectStateHistory_list, "f").splice(0, __classPrivateFieldGet(this, _ObjectStateHistory_list, "f").length - __classPrivateFieldGet(this, _ObjectStateHistory_options, "f").limit);
    }
    __classPrivateFieldGet(this, _ObjectStateHistory_instances, "m", _ObjectStateHistory_buildObjectRepresentation).call(this);
}, _ObjectStateHistory_merge = function _ObjectStateHistory_merge(data, operation = OPERATIONS.merge) {
    const isMergeOrReplaceOperation = [OPERATIONS.merge, OPERATIONS.replace].includes(operation);
    const isValidData = !isMergeOrReplaceOperation || data.constructor === Object;
    if (!isValidData) {
        throw new Error('Should be provided an argument of type object.');
    }
    __classPrivateFieldGet(this, _ObjectStateHistory_instances, "m", _ObjectStateHistory_addItem).call(this, data, operation);
    return this.value;
}, _ObjectStateHistory_buildObjectRepresentation = function _ObjectStateHistory_buildObjectRepresentation() {
    Object.keys(this.value).forEach((key) => (this[key] = this.value[key]));
}, _ObjectStateHistory_buildListItem = function _ObjectStateHistory_buildListItem(data, operation = OPERATIONS.merge) {
    return {
        timestamp: Date.now(),
        operation,
        data
    };
}, _ObjectStateHistory_getFreezedClonedObject = function _ObjectStateHistory_getFreezedClonedObject(obj) {
    const isObject = (obj === null || obj === void 0 ? void 0 : obj.constructor) === Object;
    const isArray = Array.isArray(obj);
    const clone = isObject
        ? structuredClone(obj)
        : isArray
            ? JSON.parse(JSON.stringify(obj))
            : obj;
    return Object.freeze(clone);
};
function mergeItemToObject(object, itemToMerge) {
    if (itemToMerge.value) {
        return itemToMerge.value;
    }
    if (itemToMerge.operation === OPERATIONS.delete) {
        const newPrevious = object ? structuredClone(object) : {};
        delete newPrevious[itemToMerge.data];
        return newPrevious;
    }
    if (itemToMerge.operation === OPERATIONS.replace) {
        return structuredClone(itemToMerge.data);
    }
    return object ? Object.assign(Object.assign({}, object), itemToMerge.data) : Object.assign({}, itemToMerge.data);
}
export { ObjectStateHistory };
export default ObjectStateHistory;
