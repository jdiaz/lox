const RuntimeError = require('./RuntimeError')

class Return extends RuntimeError {

  constructor(value) {
    super(value, "Returning")
    this.value = value
  }

}

module.exports = Return