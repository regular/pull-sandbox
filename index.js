const sandbox = require('sandbox-worker')
const pull = require('pull-stream')
const debug = require('debug')('pull-sandbox')

module.exports = function(code, opts) {
  opts = opts || {}

  const {end, addTask} = sandbox(onEnd)
  let _err = null
  const task = addTask(code)

  function onEnd(err) {
    _err = err
  }

  return pull(
    asyncOnEnd( (abort, cb) => {
      debug(`abort: ${abort ? abort.message : abort}`)
      if (!_err) _eff = abort
      task.remove(()=>{
        end(cb)
      })
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

// -- util

function asyncOnEnd(onEnd) {
  var a = false

  function once (abort, cb) {
    if(a || !onEnd) return cb(null)
    a = true
    onEnd(abort === true ? null : abort, cb)
  }

  return function (read) {
    return function (end, cb) {
      if (!end) return read(end, cbRead)
      once(end, ()=>read(end, cbRead))
      
      function cbRead(end, data) {
        if (!end) return cb(end, data)
        once(end, ()=>cb(end, data))
      }
    }
  }
}
