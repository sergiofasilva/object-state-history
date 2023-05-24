const ObjectStateHistory = require('../index')

const options = {
  limit: '3'
}

const objHist = new ObjectStateHistory({ a: '1', b: '1' }, options)

console.log(objHist.info().options)
console.log('Original options', options)
