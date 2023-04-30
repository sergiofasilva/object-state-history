'use strict';
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _history;
var OPERATIONS = Object.freeze({
    "delete": 'delete',
    replace: 'replace',
    merge: 'merge'
});
var ObjectStateHistory = (function () {
    function ObjectStateHistory(object) {
        _history.set(this, []);
        if (object === undefined) {
            object = {};
        }
        if (object.constructor !== Object) {
            throw new Error('Should be provided an argument of type object.');
        }
        var obj = structuredClone(object);
        __classPrivateFieldGet(this, _history).push(ObjectStateHistory..call(ObjectStateHistory, obj));
        this..call(this);
        return new Proxy(this, {
            set: function (object, key, value, proxy) {
                var obj = {};
                obj[key] = value;
                object..call(object, obj);
                return true;
            },
            get: function (target, prop, receiver) {
                var value = target[prop];
                if (value instanceof Function) {
                    return function () {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i] = arguments[_i];
                        }
                        return value.apply(this === receiver ? target : this, args);
                    };
                }
                return value || target.value[prop];
            },
            deleteProperty: function (target, prop) {
                var newObj = structuredClone(target.value);
                if (prop in newObj) {
                    target..call(target, prop, OPERATIONS["delete"]);
                }
                return true;
            }
        });
    }
    ObjectStateHistory.prototype.valueOf = function () {
        return this.value;
    };
    ObjectStateHistory.prototype.toString = function () {
        return JSON.stringify(this.value);
    };
    Object.defineProperty(ObjectStateHistory.prototype, "value", {
        get: function () {
            var lastItem = this..call(this);
            return ObjectStateHistory..call(ObjectStateHistory, lastItem);
        },
        enumerable: true,
        configurable: true
    });
    ObjectStateHistory.prototype.merge = function (data) {
        return this..call(this, data);
    };
    ObjectStateHistory.prototype.replace = function (data) {
        return this..call(this, data, OPERATIONS.replace);
    };
    ObjectStateHistory.prototype. = function (data, operation) {
        if (operation === void 0) { operation = OPERATIONS.merge; }
        var isMergeOrReplaceOperation = [
            OPERATIONS.merge,
            OPERATIONS.replace,
        ].includes(operation);
        var isValidData = data !== undefined &&
            (!isMergeOrReplaceOperation || data.constructor === Object);
        if (!isValidData) {
            throw new Error('Should be provided an argument of type object.');
        }
        var item = ObjectStateHistory..call(ObjectStateHistory, data, operation);
        __classPrivateFieldGet(this, _history).push(item);
        this..call(this, item);
        return this.value;
    };
    ObjectStateHistory.prototype.list = function () {
        return ObjectStateHistory..call(ObjectStateHistory, __classPrivateFieldGet(this, _history));
    };
    ObjectStateHistory.prototype.listAll = function () {
        var history;
        try {
            var historyList_1 = this.list();
            history = historyList_1.map(function (el, idx) {
                el.value =
                    idx === 0
                        ? __assign({}, el.data) : mergeItems(historyList_1[idx - 1].value, el);
                return el;
            });
        }
        catch (error) {
            history = [];
        }
        return ObjectStateHistory..call(ObjectStateHistory, history);
    };
    ObjectStateHistory.prototype.at = function (index) {
        if (index === void 0) { index = -1; }
        if (!Number.isInteger(index)) {
            return undefined;
        }
        index = index < 0 ? __classPrivateFieldGet(this, _history).length + index : index;
        var itemAtIndex = __classPrivateFieldGet(this, _history)[index];
        if (itemAtIndex === undefined) {
            return undefined;
        }
        var historyToIndex = __classPrivateFieldGet(this, _history).slice(0, index + 1);
        var item = this..call(this, historyToIndex);
        return ObjectStateHistory..call(ObjectStateHistory, item);
    };
    ObjectStateHistory.prototype. = function (list) {
        list = list || __classPrivateFieldGet(this, _history);
        var merged = list.reduce(function (previous, current) {
            return mergeItems(previous, current);
        }, {});
        return Object.freeze(merged);
    };
    ObjectStateHistory.prototype. = function (lastItem) {
        var _this = this;
        if (lastItem && lastItem.operation === OPERATIONS["delete"]) {
            delete this[lastItem.data];
        }
        if (lastItem && lastItem.operation === OPERATIONS.replace) {
            for (var _i = 0, _a = Object.keys(this); _i < _a.length; _i++) {
                var key = _a[_i];
                delete this[key];
            }
        }
        Object.keys(this.value).forEach(function (key) { return (_this[key] = _this.value[key]); });
    };
    ObjectStateHistory. = function (item, operation) {
        if (operation === void 0) { operation = OPERATIONS.merge; }
        return {
            timestamp: Date.now(),
            operation: operation,
            data: item
        };
    };
    ObjectStateHistory. = function (obj) {
        return Object.freeze(structuredClone(obj));
    };
    return ObjectStateHistory;
}());
_history = new WeakMap();
function mergeItems(previous, current) {
    var _a;
    if ((previous === null || previous === void 0 ? void 0 : previous.constructor) !== Object) {
        throw new Error('The "previous" argument should be of type object.');
    }
    if (!current ||
        (current.operation === OPERATIONS.merge &&
            ((_a = current === null || current === void 0 ? void 0 : current.data) === null || _a === void 0 ? void 0 : _a.constructor) !== Object)) {
        return __assign({}, previous);
    }
    if (current.operation === OPERATIONS["delete"]) {
        var newPrevious = structuredClone(previous);
        delete newPrevious[current.data];
        return newPrevious;
    }
    if (current.operation === OPERATIONS.replace) {
        return structuredClone(current.data);
    }
    return __assign(__assign({}, previous), current.data);
}
export default ObjectStateHistory;
//# sourceMappingURL=index.js.map