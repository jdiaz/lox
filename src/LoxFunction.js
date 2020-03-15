const LoxCallable = require('./LoxCallable')
const Return = require('./Return')
const Environment = require('./Environment')

class LoxFunction extends LoxCallable {

  constructor(/*Stmt.Function*/declaration) {
    super()
    this.declaration = declaration
  }

  call(interpreter, args) {
    const environment = new Environment(interpreter.globals)
    for (let i = 0; i < this.declaration.params.length; i++) {
      environment.define(
        this.declaration.params[i].lexeme,
        args[i],
      )
    }

    //try {
    interpreter.executeBlock(this.declaration.body, environment)  
    // } catch (err) {
    //   if (err instanceof Return) {
    //     return err.value
    //   } else {
    //     throw err
    //   }
    // }

    return null
  }

  arity() {
    return this.declaration.params.length
  }

  toString() {
    return `<fn ${this.declaration.name.lexeme}>`
  }
}

module.exports = LoxFunction