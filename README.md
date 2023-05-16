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
const objHistory = new ObjectStateHistory({ prop1: 'value1', prop2: 'value2' })
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

You can also get a list of all states and changes made to the object using the list() method:

```javascript
console.log(objHistory.list())
```

And you can retrieve a merged version of the object that reflects all changes up to a specific index in the history by calling the at() method with an index parameter:

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
// Assumes index -1, if no argument is passed, which corresponds to the last item.
const stateAtIndex = objHistory.at(0) // { a: 1, b: 2 }

// Get a list of all states and the changes of the object
const stateList = objHistory.list()
```

&nbsp;

---

&nbsp;

# API

The **ObjectStateHistory** provides the following:

&nbsp;

## Constructor

**new ObjectStateHistory(object)**: creates a new instance of ObjectStateHistory with the initial value of object.

&nbsp;

## Properties

**value**: returns the current state of the object.

&nbsp;

## Methods

**at(index)**: returns the state of the object at the given index, allowing for positive and negative integers. Negative integers count back from the last item in the array. Assumes index -1, if no argument is passed, which corresponds to the last item.

**info()**: returns an object with the properties: options, list and value.

- options: an object with the options assumed by ObjectStateHistory;
- list: same as the **list()** method;
- value: same as the **valueOf()** method or the **value** property.

**list()**: returns a list of all the states of the object with the history of changes.

**merge(data)**: merges the provided data into the current state of the object.

**replace(data)**: replaces the current state of the object with the provided data.

**toString()**: returns a JSON string representation of the current state of the object.

**valueOf()**: returns the same as the property **value**.

&nbsp;

## Options

If you use very **large objects** and / or make **many changes** to objects, this can result in the ObjectStateHistory taking up a **lot of memory**. If this is a problem for you or if you don't need to have a very large history, it is possible to limit the number of changes stored in history.

In the constructor you can send as a second parameter an object with the options:

```javascript
const options = {
  limit: 5
}

const obj = { a: 1, b: 2 }
const objHistory = new ObjectStateHistory(obj, options)
```

At the moment the only option available is **limit**, but in the future there may be more.

The **limit** option accepts non-negative integer values (natural numbers). Where the value zero (0) means that it has no limits (default behavior).

---

## Authors

- [@sergiofasilva](https://github.com/sergiofasilva)

&nbsp;

## License

The ObjectStateHistory is open source software licensed under the MIT License.

[MIT](https://choosealicense.com/licenses/mit/)
