class Token {

	tokenType
	lexeme
	literal
	line

	construct(type, lexeme, literal, line) {
		this.tokenType = type
		this.lexeme = lexeme
		this.literal = literal
		this.line = line
	}

	toString() {
		return `${this.tokenType} ${this.lexeme} ${this.literal}`
	}
}

module.export = Token