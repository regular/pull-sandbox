const test = require('tape')
const sandbox = require('..')
const pull = require('pull-stream')

test('pull some numbers through the sandbox', t=>{
  pull(
    pull.values([1,2,3,4]),
    sandbox(`
      module.exports = function(a) {
        return {n: a * 10}
      }
    `),
    pull.collect( (err, values) =>{
      t.error(err)
      t.deepEqual(values, [{n:10},{n:20},{n:30},{n:40}])
      t.end()
    })
  )
})
