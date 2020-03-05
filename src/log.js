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
  // Acceptable values are 
  const processLevel = process.env.LEVEL != null ? process.env.LEVEL : null
  // Print log msg if level matches with process set environment
  // However, still show error msgs and cli prompt
  // TODO: Fix causing no logs to be shown to std out
  // if ((level !== Level.INFO || level !== Level.ERROR) && !levelMatch(processLevel, level))
  //   return

  if (typeof msg !== 'string')
    msg = String(msg)

  if (newline != null) {
    println(color(msg, level))
    return
  }
  print(color(msg, level))
}

function levelMatch(strLevel, numLev) {
  if (strLevel == null || strLevel === '')
    return false

  const labels = Object.keys(Level)
  for (label of labels) {
    if (Level[strLevel.toUpperCase()] === label) 
      return true
  }

  return false
}

function logError(line, where, msg) {
  console.log('l: ' + line + ' where: ' + where + ' msg: '+ msg)
  log(`[line ${line}] Error ${where}: ${msg}`, Level.ERROR, true)
}

module.exports = {
  level: Level,
  log: log,
  logError: logError,
}
