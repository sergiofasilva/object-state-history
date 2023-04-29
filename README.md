# ObjectHistory

The ObjectHistory is a JavaScript implementation that allows you to keep track of changes in an object over time, creating a history of the modifications.

&nbsp;

## Installation

To use **ObjectHistory**, simply install it via **npm**:

```bash
npm i object-history
```

&nbsp;
... _or via **yarn**_:

```bash
yarn add object-history
```

&nbsp;

## Usage

The ObjectHistory can be used by importing it into your module using the import statement, like so:

```javascript
import ObjectHistory from 'object-history';
```

&nbsp;
... _or with **require** (CommonJS)_:

```javascript
const ObjectHistory = require('object-history');
```

&nbsp;

Once imported, create a new instance of ObjectHistory by passing an object to the constructor like:

```javascript
const objHistory = new ObjectHistory({ prop1: 'value1', prop2: 'value2' });
```

Once created, you can make changes to the object directly as usual, but they will be tracked automatically by ObjectHistory:

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

And you can retrieve a merged version of the object that reflects all changes up to a specific index in the history by calling the at() method with an index parameter:

```javascript
console.log(objHistory.at(0));
```

&nbsp;

&nbsp;

---

# API

The ObjectHistory provides the following methods:

## constructor(object)

The constructor takes an object as an optional parameter. If no object is provided, an empty object is assumed.

&nbsp;

## merge(data)

The merge() method takes an object with the changes you want to make to the object.

&nbsp;

## list()

The list() method returns an array of all the changes made to the object up to the current moment.

## listAll()

The listAll() method returns an array of all the changes made to the object, including all intermediate states.

&nbsp;

## at(index = -1)

The at() method returns a snapshot of the object at the specified index in the history. If no index is specified, it returns the current state of the object. If the specified index is out of bounds, undefined is returned.

&nbsp;

## toString()

The toString() method returns a JSON string representation of the current state of the object.

&nbsp;

## valueOf()

The valueOf() method returns the same as the property **value**.

&nbsp;

## value

The value getter returns a snapshot of the current state of the object.

&nbsp;

&nbsp;

---

## Authors

- [@sergiofasilva](https://github.com/sergiofasilva)

&nbsp;

## License

The ObjectHistory class is open source software licensed under the MIT License.

[MIT](https://choosealicense.com/licenses/mit/)
