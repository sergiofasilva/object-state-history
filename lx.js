const ObjectStateHistory = require('./index')

const options = {
  limit: '0'
}

const obj = { a: 1, b: 2 }
const objHistory = new ObjectStateHistory(obj, options)

objHistory.c = '3'

objHistory.d = '4'
objHistory.e = '5'
objHistory.f = '6'

console.log('info:', objHistory.info())

const list = objHistory.list()
for (const el of list) {
  console.log('value:', el.value)
}

// function setOptions (options) {
//   if (arguments.length === 0) {
//     return
//   }

//   if (options?.constructor !== Object) {
//     throw new Error('When provided, the options parameter must be of type object.')
//   }

//   const schemaOptions = {
//     limit: value => isNaturalNumber(value)
//   }
//   schemaOptions.limit.required = true

//   const validate = (object, schema) => Object
//     .entries(schema)
//     .filter(key => key in object)
//     .map(([key, validate]) => [
//       key,
//       !validate.required || (key in object),
//       validate(object[key])
//     ])
//     .filter(([_, ...tests]) => !tests.every(Boolean))
//     .map(([key, invalid]) => new Error(`Option ${key} is ${invalid ? 'invalid' : 'required'}.`))

//   const errors = validate(options, schemaOptions)

//   if (errors.length > 0) {
//     throw new Error(errors[0])
//   } else {
//     return {
//       limit: +options.limit || 0
//     }
//   }
// }

// function isNaturalNumber (value) {
//   const number = Number(value)
//   const isInteger = Number.isInteger(number)
//   const isNegative = value < 0
//   const isNatural = isInteger && !isNegative
//   return isNatural
// }

// const options = {
//   limitx: 3
// }
// const myOptions = setOptions(options)
// console.log(myOptions)
