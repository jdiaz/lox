const LoxCallable = require('./LoxCallable')

class NativeFunction extends LoxCallable {

  constructor(arity, func) {
    super(arity, func)
    this._arity = arity
    this._func = func
  }

  call(interpreter, args) {
    return this._func.apply(null, args)
  }
}

module.exports = NativeFunction