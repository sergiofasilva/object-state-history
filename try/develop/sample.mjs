import ObjectStateHistory from 'object-state-history-develop'

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
console.log(currentState)

// Get a specific state of the object by index
// Assumes index -1, if no argument is passed, which corresponds to the last item.
const stateAtIndex = objHistory.at(0) // { a: 1, b: 2 }
console.log(stateAtIndex)

// Get a list of all states of the object
const stateList = objHistory.list()
console.log(stateList)
