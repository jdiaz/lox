const RuntimeError = require('./RuntimeError')

class Environment {

  constructor(/*Environment*/enclosing) {
    this.values = {}
    this.enclosing = enclosing != null ? enclosing : null
    
  }

  define(name, value) {
    this.values[name] = value
  }

  get(token) {
    if (this.values[token.lexeme] != null)
      return this.values[token.lexeme]

    if (this.enclosing != null)
      return this.enclosing.get(token)

    throw new RuntimeError(token, `Undefined variable '${token.lexeme}'.`)
  }

  assign(token, value) {
    if (this.values[token.lexeme] != null) {
      this.values[token.lexeme] = value
      return
    }

    if (this.enclosing != null) {
      this.enclosing.assign(token, value)
      return
    }


    throw new RuntimeError(token, `Undefined variable '${token.lexeme}'.`)
  }
}

module.exports = Environment