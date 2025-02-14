# ObjectStateHistory

[![npm version](https://img.shields.io/npm/v/object-state-history)](https://www.npmjs.com/package/object-state-history)
[![Build Status](https://img.shields.io/github/actions/workflow/status/sergiofasilva/object-state-history/ci.yml)](https://github.com/sergiofasilva/object-state-history/actions)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://standardjs.com/)
[![Known Vulnerabilities](https://snyk.io/test/github/sergiofasilva/object-state-history/badge.svg)](https://snyk.io/test/github/sergiofasilva/object-state-history)

&nbsp;

## ObjectStateHistory - A tool for state management

The ObjectStateHistory is a JavaScript implementation that allows you to keep track of changes in an object over time, creating a history of the modifications.

Maintaining the state of an application in a large software project can be challenging. One advantage of using ObjectStateHistory is that it maintains a history of all the changes to the object's state. This feature is essential when you have lots of data changes to monitor, and you do not want to spend too much time debugging.

Since each change creates a new state of the object without changing the previous states, we have, in a sense, an object with immutability characteristics, or a list of immutable objects.

&nbsp;

## Installation

To use **ObjectStateHistory**, simply install it via **npm**:

```bash
npm i object-state-history
```

&nbsp;
... _or via **yarn**_:

```bash
yarn add object-state-history
```

&nbsp;

## Usage

The ObjectStateHistory can be used by importing it into your module using the import statement, like so:

```javascript
import ObjectStateHistory from 'object-state-history'
```

&nbsp;
... _or with **require** (CommonJS)_:

```javascript
const ObjectStateHistory = require('object-state-history')
```

Once imported, create a new instance of ObjectStateHistory by passing an object to the constructor like:

```javascript
const theObject = { prop1: 'value1', prop2: 'value2' }
const objHistory = new ObjectStateHistory(theObject)
```

Once created, you can make changes to the object directly as usual, but they will be tracked automatically by ObjectStateHistory:

```javascript
objHistory.prop3 = 'value3' // { prop1: 'value1', prop2: 'value2', prop3: 'value3' }
delete objHistory.prop1 // { prop2: 'value2', prop3: 'value3' }
```

To retrieve a snapshot of the object at any time, simply call the value getter:

```javascript
console.log(objHistory.value) // { prop2: 'value2', prop3: 'value3' }
```

You can also get a list of all states and changes made to the object using the `list()` method:

```javascript
console.log(objHistory.list())
```

And you can retrieve the state of the object at the given index in the history by calling the `at()` method with an index parameter:

```javascript
console.log(objHistory.at(0))
```

&nbsp;

&nbsp;

### Sample

```javascript
import ObjectStateHistory from 'object-state-history'

const obj = { a: 1, b: 2 }
const objHistory = new ObjectStateHistory(obj)

// Change the value of a property
objHistory.a = 3 // { a: 3, b: 2 }

// Add a new property
objHistory.e = 6 // { a: 3, b: 2, e: 6 }

// Change or add multiple properties
objHistory.merge({ b: 4, c: 3, d: 5 }) // { a: 3, b: 4, e: 6, c: 3, d: 5 }

// Replace the entire object
objHistory.replace({ a: 4, b: 5 }) // { a: 4, b: 5 }

// Delete a property of the object
delete objHistory.a // { b: 5 }

// Get the current state of the object
const currentState = objHistory.value // { b: 5 }

// Get a specific state of the object by index
const stateAtIndex = objHistory.at(0) // { a: 1, b: 2 }

// Get a list of all states and the changes of the object
const stateList = objHistory.list()
```

&nbsp;

# API

The **ObjectStateHistory** provides the following:

&nbsp;

### Constructor

#### new ObjectStateHistory(object, history, options)

Creates a new instance of ObjectStateHistory with the initial value of object.

&nbsp;

#### Parameters

##### object

The inicial object data.

##### history

The `history` parameter is an optional parameter in the `ObjectStateHistory` class that allows you to initialize an object with a list containing the history of previous changes. See <a href="#using-history">Using history</a> chapter.

- The `history` parameter shou`d be an array of history items.
- If the `history` parameter is not set, the object will be initialized without any previous history.

##### options

The options of ObjectStateHistory. See <a href="#options-1">Options</a> chapter.

### Properties

#### value

Returns the current state of the object.

&nbsp;

### Methods

#### at(index)

Returns the state of the object at the given index, allowing for positive and negative integers. Negative integers count back from the last item in the list history. Assumes **index -1**, if no argument is passed, which corresponds to the last item.

#### info()

Returns an object with the properties: **options**, **list** and **value**.

- **options**: an object with the options assumed by ObjectStateHistory;
- **list**: same as the `list()` method;
- **value**: same as the `valueOf()` method or the `value` property.

#### list()

Returns a list of all the states of the object with the history of changes.

#### merge(data)

Merges the provided data into the current state of the object.

#### replace(data)

Replaces the current state of the object with the provided data.

#### toString()

Returns a JSON string representation of the current state of the object.

#### valueOf()

Returns the same as the property `value`.

&nbsp;

### Events

#### change

Event triggered whenever changes are made to the object. The changed information is passed as a callback parameter.
It can be useful, for example, to save the last state of the object in an external cache system whenever there are changes.

```javascript
const objHist = new ObjectStateHistory({ a: '1', b: '2' }) // initial object
// item is an object with the changed data
objHist.on('change', function (item) {
  console.log(item.data) // { c: '3' }), the changed data
  console.log(this.value) // { a: '1', b: '2', c: '3' }), the current state of the object
  console.log(this.at(0)) // { a: '1', b: '2' }), the state of the object at index 0
  console.log(this.list().length) // 2
})

objHist.c = '3' // trigger change event
```

&nbsp;

# Using history

When the `history` parameter is provided, the system will use the provided history to reconstruct the object's state. This is useful in scenarios where you need to share the object across multiple instances or restore the object's state from a previously saved history.

You can save the change history whenever changes are detected in the change event. See <a href="#events">Events</a> chapter.
`
Example of using history:

```javascript
const obj = { a: '1', b: '2' }
const objInitial = new ObjectStateHistory(obj)
objInitial.c = '3'
console.log(objInitial.value) // { a: '1', b: '2', c: '3' }

// get the history of changes from another object
const history = objInitial.list()
// using the history in a new object
const objWithHistory = new ObjectStateHistory(null, history)
console.log(objWithHistory) // { a: '1', b: '2', c: '3' }

objWithHistory.d = '4'
console.log(objWithHistory.value) // { a: '1', b: '2', c: '3', d: '4' }

// using the history in a new object and merge the object from first parameter
const objWithHistoryAndMerge = new ObjectStateHistory({ e: '5' }, history)
console.log(objInitial.value) // { a: '1', b: '2', c: '3' }
console.log(objWithHistory.value) // { a: '1', b: '2', c: '3' }
console.log(objWithHistoryAndMerge.value) // { a: '1', b: '2', c: '3', e: '5' }
console.log(objWithHistory.list().length) // 4, includes the changes received in the history
console.log(objWithHistoryAndMerge.list().length) // 3, includes the changes received in the history
```

&nbsp;

# Options

In the constructor you can send as a third parameter an object with the **options**.

### Limit

The `limit` option is a configuration setting in the `ObjectStateHistory` class that controls the maximum number of changes stored in the object's state history.

When the `limit` option is set, the system will restrict the number of changes stored in the history to the specified limit. This is useful in scenarios where memory usage is a concern, and you do not need to keep an extensive history of changes.

- The `limit` option should be a natural number (non-negative integer).
- If the `limit` option is not set, the default value is 0, meaning there is no limit.
- Setting `limit` to 0 will disable the feature, and the state history will not be limited.

```javascript
const options = {
  limit: 5
}

const obj = { a: 1, b: 2 }
const objHistory = new ObjectStateHistory(obj, null, options)
```

&nbsp;

### lastStatesToKeep

The `lastStatesToKeep` option is a configuration setting in the `ObjectStateHistory` class that controls how the system handles incremental changes in the object's state history.

When the `lastStatesToKeep` option is set, the system will periodically clear the value of the state history items to save memory. This is useful in scenarios where the full history of changes is not needed, and only the most recent state is important.

- The `lastStatesToKeep` option should be a natural number (non-negative integer).
- If the `lastStatesToKeep` option is not set, the default value is 5.
- Setting `lastStatesToKeep` to 0 will disable the feature, and the state value will not be cleared.

```javascript
const options = {
  lastStatesToKeep: 2
}
const objHist = new ObjectStateHistory({ a: 1 }, null, options)

objHist.b = 2
objHist.c = 3
objHist.d = 4
console.log('objHist.list())

/*
[
  {
    timestamp: 1739552210305,
    operation: 'merge',
    data: { a: 1 },
    value: null
  },
  {
    timestamp: 1739552210305,
    operation: 'merge',
    data: { b: 2 },
    value: null
  },
  {
    timestamp: 1739552210305,
    operation: 'merge',
    data: { c: 3 },
    value: { a: 1, b: 2, c: 3 }
  },
  {
    timestamp: 1739552210305,
    operation: 'merge',
    data: { d: 4 },
    value: { a: 1, b: 2, c: 3, d: 4 }
  }
]
  */
```

&nbsp;

# Notes

### Shallow history

Note that the history only works on the first level of the object, it's a **shallow** history, i.e. it doesn't work with multi-level objects. Deep objects work like regular objects, i.e. by reference.

### Version changes

This version is not compatible with the previous one. The use of cache in the previous version had problems, so now it is not possible to use cache, instead it is recommended to use the **history** parameter. Please note that the constructor has changed, the **options** parameter is now the third parameter while in the second we have the **history** parameter.

## Authors

- [@sergiofasilva](https://github.com/sergiofasilva)

&nbsp;

## License

The ObjectStateHistory is open source software licensed under the MIT License.

[MIT](https://choosealicense.com/licenses/mit/)
