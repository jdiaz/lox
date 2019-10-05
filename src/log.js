// Colorful logger

const Level = Object.freeze({
  'INFO': 1,
  'WARNING': 2,
  'ERROR': 3
});

function print(str) {
  process.stdout.write(str)
}

function println(str) {
  process.stdout.write(str + '\n')
}

function color(msg, level) {
  switch (level) {
    case Level.INFO:    return `\x1b[34m${msg}\x1b[0m`
    case Level.WARNING: return `\x1b[33m${msg}\x1b[0m`
    case Level.ERROR:   return `\x1b[31m${msg}\x1b[0m`
    default:            return `\x1b[32m${msg}\x1b[0m`
  }
}

function log(msg, level = Level.INFO, newline = null) {
  if (typeof msg !== 'string')
    msg = String(msg)
  //msg += ' Trace: ' + console.trace()
  if (newline != null) {
    println(color(msg, level))
    return
  }
  print(color(msg, level))
}

function logError(line, where, msg) {
  log(`[line ${line}] Error ${where}: ${msg}`, Level.ERROR, true)
}

module.exports = {
  level: Level,
  log: log,
  logError: logError,
}
