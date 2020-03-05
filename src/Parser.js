/*

expression     → equality ;
equality       → comparison ( ( "!=" | "==" ) comparison )* ;
comparison     → addition ( ( ">" | ">=" | "<" | "<=" ) addition )* ;
addition       → multiplication ( ( "-" | "+" ) multiplication )* ;
multiplication → unary ( ( "/" | "*" ) unary )* ;
unary          → ( "!" | "-" ) unary
               | primary ;
primary        → NUMBER | STRING | "false" | "true" | "nil"
               | "(" expression ")" ;

*/
const {log, Level, logError} = require('./log')
const {Binary, Grouping, Literal, Unary} = require('./Expr')
const Token = require('./Token')
const TokenType = require('./TokenType')
const Lox = require('./Lox')

class ParseError extends Error {}

class Parser {

	constructor(tokens) {
		this.tokens = tokens
		this.current = 0
	}

	parse() {       
    try {                       
      return this._expression()     
    } catch (parseError) {
      return null
    }
  }     

	_expression()/*: Expr */{
		return this._equality()
	}

	_equality() {
		let expr = this._comparison()

		while (this._match(TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL)) {
			const operator = this._previous()
			const rightExpr = this._comparison()
			expr = new Binary(expr, operator, rightExpr)
		}

		return expr
	}

	_comparison() {
		let expr = this._addition()

		while (this._match(
			TokenType.GREATER,
			TokenType.GREATER_EQUAL,
			TokenType.LESS,
			TokenType.LESS_EQUAL
		)) {
			const operator = this._previous()
			const rightExpr = this._addition()
			expr = new Binary(expr, operator, rightExpr)
		}

		return expr
	}

	_addition() {
		let expr = this._multiplication()

		while (this._match(TokenType.MINUS, TokenType.PLUS)) {
			const operator = this._previous()
			const rightExpr = this._multiplication()
			expr = new Binary(expr, operator, rightExpr)
		}

		return expr
	}

	_multiplication() {
		let expr = this._unirary()

		while (this._match(TokenType.SLASH, TokenType.STAR)) {
			const operator = this._previous()
			const rightExpr = this._unirary()
			expr = new Binary(expr, operator, rightExpr)
		}

		return expr
	}

	_unirary() {
		if (this._match(TokenType.BANG, TokenType.MINUS)) {
			const operator = this._previous()
			const right = this._unirary()
			return new Unary(operator, right)
		}

		return this._primary()
	}

	_primary() {
		if (this._match(TokenType.FALSE)) return new Literal(false);
		if (this._match(TokenType.TRUE)) return new Literal(true);
		if (this._match(TokenType.NIL)) return new Literal(null);

		if (this._match(TokenType.NUMBER, TokenType.STRING)) {
			return new Literal(this._previous().literal)
		}

		if (this._match(TokenType.LEFT_PAREN)) {
			const expr = this._expression()
			this._consume(TokenType.RIGHT_PAREN, "Expect ')' after expression.")
			return new Grouping(expr)
		}

		throw this._error(this._peek(), "Expected expression.")
	}

	_consume(tokenType, message)/*Token*/{
		if (this._check(tokenType))
			return this._advance()

		throw this._error(this._peek(), message)
	}

	 _error(token, message)/*ParseError*/{
	 	//console.log(message)
		Lox.error(token, message)
		return new ParseError()
	}

	synchronize() {                 
    this._advance();

    while (!this._isAtEnd()) {                       
      if (this._previous().tokenType == TokenType.SEMICOLON)
        return

      switch (this._peek().tokenType) {   
        case TokenType.CLASS:
        case TokenType.FUN:
        case TokenType.VAR:
        case TokenType.FOR:
        case TokenType.IF:
        case TokenType.WHILE:
        case TokenType.PRINT:                  
        case TokenType.RETURN:
          return                 
      }                             

      this._advance();                               
    }
  } 

	_match(...tokenTypes) {
		for (let i = 0; i < tokenTypes.length; i++) {
			if (this._check(tokenTypes[i])) {
				this._advance()
				return true
			}
		}
		return false
	}

	_check(tokenType) {
		if (this._isAtEnd())
			return false
		return this._peek().tokenType === tokenType
	}

	_advance() {
		if (!this._isAtEnd())
			this.current++
		return this._previous()
	}

	_isAtEnd() {
		return this._peek().tokenType === TokenType.EOF
	}

	_peek() {
		return this.tokens[this.current]
	}

	_previous() {
		return this.tokens[this.current - 1]
	}
}

module.exports = Parser