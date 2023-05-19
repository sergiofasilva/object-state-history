const ObjectStateHistory = require('./index')
const cacheClient = new Map()

const originalObjectData = { a: '1', b: '2' }
const options = {
  limit: 100,
  cache: {
    client: cacheClient,
    key: 'uniqueKey'
  }
}
const objHist = new ObjectStateHistory(originalObjectData, options)

// console.log('MAP VALUE0:', cacheClient.get('uniqueKey'))
objHist.c = '3'
// console.log('MAP VALUE1:', cacheClient.get('uniqueKey'))
objHist.merge({ d: '4' })
// console.log('MAP VALUE2:', cacheClient.get('uniqueKey'))
delete objHist.d
// console.log('MAP VALUE3:', cacheClient.get('uniqueKey'))
objHist.replace({ e: '5' })
// console.log('MAP VALUE4:', cacheClient.get('uniqueKey'))

// const info = objHist.info()
const list = objHist.list()
// const value = objHist.value
// const valueOf = objHist.valueOf()
const valueAt = objHist.at()

// console.log('INFO:', info)
console.log('LIST:', list)
// console.log('VALUE:', value)
// console.log('VALUE_OF:', valueOf)
console.log('VALUE_AT:', valueAt)
console.log('MAP KEYS', Array.from(cacheClient.keys()))
console.log('MAP VALUE:', cacheClient.get('uniqueKey'))
