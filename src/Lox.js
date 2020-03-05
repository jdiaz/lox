const fs = require('fs')
const stdin = process.openStdin()
const {log, level, logError} = require('./log')
const Scanner = require('./Scanner')
const Parser = require('./Parser')
const AstPrinter = require('./AstPrinter')

class Lox {
  
  static hadError = false

  constructor() {}

  main() {
    const args = process.argv
    if (args.length > 3) {
      log('Usage: jlox [script]', level.INFO, true);
      process.exit(64)
    } else if (args.length == 3) {
      this._runFile(args[2])
    } else {
      this._runPrompt()
    }
  }

  _runFile(path) {
    fs.readFile(path, (err, source) => {
      if (err) 
        log(err, level.ERROR, true)

      this._run(source)

      if (Lox.hadError)
        process.exit(65)
    });
  }

  _runPrompt() {
    log('>> ')
    stdin.addListener('data', data => {
      this._run(String(data))
      log('>> ')
    })
  }

  _run(source) {
    const sc = new Scanner(source)
    const tokens = sc.scanTokens()
    const parser = new Parser(tokens)                   
    const expression = parser.parse()
    // Stop if there was a syntax error.                   
    if (Lox.hadError)
      return

    log(new AstPrinter().print(expression), level.INFO, '\n');
  }

  static error(token, message) {
    if (token.tokenType == TokenType.EOF) {                          
      logError(token.line, " at end", message);                   
    } else {                                               
      logError(token.line, " at '" + token.lexeme + "'", message);
    }

    Lox.hadError = true
  }                                                       

}

module.exports = Lox;