# ObjectStateHistory

&nbsp;

## ObjectStateHistory - A tool for state management

The ObjectStateHistory is a JavaScript implementation that allows you to keep track of changes in an object over time, creating a history of the modifications.

Maintaining the state of an application in a large software project can be challenging. One advantage of using ObjectStateHistory is that it maintains a history of all the changes to the object's state. This feature is essential when you have lots of data changes to monitor, and you do not want to spend too much time debugging.

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
import ObjectStateHistory from 'object-state-history';
```

&nbsp;

Once imported, create a new instance of ObjectStateHistory by passing an object to the constructor like:

```javascript
const objHistory = new ObjectStateHistory({ prop1: 'value1', prop2: 'value2' });
```

Once created, you can make changes to the object directly as usual, but they will be tracked automatically by ObjectStateHistory:

```javascript
objHistory.prop3 = 'value3';
delete objHistory.prop1;
```

To retrieve a snapshot of the object at any time, simply call the value getter:

```javascript
console.log(objHistory.value);
```

You can also get a list of all the changes made to the object using the list() method:

```javascript
console.log(objHistory.list());
```

Or get a list of all states of the object using the listAll() method:

```javascript
console.log(objHistory.listAll());
```

And you can retrieve a merged version of the object that reflects all changes up to a specific index in the history by calling the at() method with an index parameter:

```javascript
console.log(objHistory.at(0));
```

&nbsp;

&nbsp;

### Sample

```javascript
import ObjectStateHistory from 'object-state-history';

const obj = { a: 1, b: 2 };
const objHistory = new ObjectStateHistory(obj);

// Change the value of a property
objHistory.a = 3;

// Add a new property
objHistory.e = 6;

// Change or add multiple properties
objHistory.merge({ c: 3, d: 4 });

// Replace the entire object
objHistory.replace({ a: 4, b: 5 });

// Delete a property of the object
delete objHistory.a;

// Get the current state of the object
const currentState = objHistory.value;

// Get a specific state of the object by index
const stateAtIndex = objHistory.at(0);

// Get a list of all states of the object
const stateList = objHistory.listAll();
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

**merge(data)**: merges the provided data into the current state of the object.

**replace(data)**: replaces the current state of the object with the provided data.

**list()**: returns a list of all the states of the object.

**listAll()**: returns a list of all the states of the object with the history of changes.

**at(index)**: returns the state of the object at the given index.

**toString()**: returns a JSON string representation of the current state of the object.

**valueOf()**: returns the same as the property **value**.

&nbsp;

---

## Authors

- [@sergiofasilva](https://github.com/sergiofasilva)

&nbsp;

## License

The ObjectStateHistory class is open source software licensed under the MIT License.

[MIT](https://choosealicense.com/licenses/mit/)
