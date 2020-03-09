const RuntimeError = require('./RuntimeError')

class Environment {

	constructor() {
		this.values = {}
	}

	define(name, value) {
		this.values[name] = value
	}

	get(token) {
		if (this.values[token.lexeme] != null)
			return this.values[token.lexeme]

		throw new RuntimeError(token, `Undefined variable '${token.lexeme}'.`)
	}
}

module.exports = Environment