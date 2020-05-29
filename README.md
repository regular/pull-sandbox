pull-sandbox
---

A through stream that runs a mapper function in a quickjs sandbox in a worker thread.

```
const test = require('tape')
const sandbox = require('pull-sandbox')
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
````

## API

### `sandbox(code)`
  
  - code: source code of a commonJS module that exports a map function.

See [sandbox-worker](https://github.com/regular/sandbox-worker) for details.

License: MIT
