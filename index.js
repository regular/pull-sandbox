const sandbox = require('sandbox-worker')
const pull = require('pull-stream')

module.exports = function(code, opts) {
  opts = opts || {}

  const {end, addTask} = sandbox(onEnd)
  let _err = null
  const task = addTask(code)

  function onEnd(err) {
    _err = err
  }

  return pull(
    pull.through(null, abort => {
      if (!_err) { 
        _eff = abort
        task.remove(()=>{
          end(err=>{})
        })
      }
    }),
    pull.asyncMap(function(x, cb) {
      const json = JSON.stringify(x)
      task(json, (err, result) =>{
        if (err) return cb(err)
        try {
          const x = JSON.parse(result)
          return cb(null, x)
        } catch(e) { cb(e) }
      })
    })
  )
}
