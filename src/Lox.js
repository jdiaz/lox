const fs = require('fs')
const stdin = process.openStdin()
const {log, level, logError} = require('./log')
const Scanner = require('./Scanner')
const Parser = require('./Parser')
const TokenType = require('./TokenType')
const AstPrinter = require('./AstPrinter')
const Interpreter = require('./Interpreter')

var hadError = false
var hadRuntimeError = false

class Lox {
  
  main() {
    const args = process.argv
    if (args.length > 3) {
      log('Usage: jlox [script]', level.INFO, true);
      process.exit(64)
    } else if (args.length === 3) {
      this.runFile(args[2])
    } else {
      this._runPrompt()
    }
  }

  runFile(path) {
    fs.readFile(path, (err, source) => {
      if (err) 
        log(err, level.ERROR, true)

      this.run(String(source))

      if (hadError)
        process.exit(65)
      if (hadRuntimeError)
        process.exit(70)
    });
  }

  runPrompt() {
    log('>> ')
    stdin.addListener('data', data => {
      this.run(String(data))
      log('>> ')
    })
  }

  run(source) {
    log(source, level.WARNING, true)
    const sc = new Scanner(source)
    const tokens = sc.scanTokens()
    const parser = new Parser(tokens, Lox)                   
    const statements = parser.parse()
    // Stop if there was a syntax error.                
    if (hadError)
      return
    const interpreter = new Interpreter()
    interpreter.interpret(statements, Lox)
  }

  static error(token, message) {
    if (token.tokenType === TokenType.EOF) {                      
      logError(token.line, ' at end', message)
    } else {
      logError(token.line, ` at '${token.lexeme}'`, message)
    }
    
    hadError = true
  }

  static runtimeError(runtimeError) {
    logError(
      runtimeError.token.line, ` at '${runtimeError.token.lexeme}'`,
      runtimeError.message,
    )

    hadRuntimeError = true
  }

}

module.exports = Lox