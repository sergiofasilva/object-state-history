const ObjectStateHistory = require('object-state-history-develop')

const objHist = new ObjectStateHistory({ a: '1', b: '1' })

console.log(objHist.value)
