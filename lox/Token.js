const TokenType = require('./TokenType')

class Token {

  constructor(type, lexeme, literal, line) {
    this.tokenType = type
    this.lexeme = lexeme
    this.literal = literal
    this.line = line
  }

  toString() {
    let tokenName = null
    for (const [key, value] of Object.entries(TokenType)) {
      if (this.tokenType === value) {
        tokenName = key
        break
      }
    }
    return `${tokenName} ${this.tokenType} ${this.lexeme} ${this.literal || ''}`
  }
}

module.exports = Token