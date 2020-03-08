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
const Expr = require('./Expr')
const TokenType = require('./TokenType')

class Parser {

  constructor(tokens, lox) {
    this.tokens = tokens
    this.current = 0
    this.Lox = lox
  }

  parse() {
    try {                       
      return this._expression()     
    } catch (parseErr) {
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
      expr = new Expr.Binary(expr, operator, rightExpr)
    }

    return expr
  }

  _comparison() {
    let expr = this._addition()

    while (this._match(
      TokenType.GREATER,
      TokenType.GREATER_EQUAL,
      TokenType.LESS,
      TokenType.LESS_EQUAL,
    )) {
      const operator = this._previous()
      const rightExpr = this._addition()
      expr = new Expr.Binary(expr, operator, rightExpr)
    }

    return expr
  }

  _addition() {
    let expr = this._multiplication()

    while (this._match(TokenType.MINUS, TokenType.PLUS)) {
      const operator = this._previous()
      const rightExpr = this._multiplication()
      expr = new Expr.Binary(expr, operator, rightExpr)
    }

    return expr
  }

  _multiplication() {
    let expr = this._unirary()

    while (this._match(TokenType.SLASH, TokenType.STAR)) {
      const operator = this._previous()
      const rightExpr = this._unirary()
      expr = new Expr.Binary(expr, operator, rightExpr)
    }

    return expr
  }

  _unirary() {
    if (this._match(TokenType.BANG, TokenType.MINUS)) {
      const operator = this._previous()
      const right = this._unirary()
      return new Expr.Unary(operator, right)
    }

    return this._primary()
  }

  _primary() {
    if (this._match(TokenType.FALSE))
      return new Expr.Literal(false);
    if (this._match(TokenType.TRUE))
      return new Expr.Literal(true);
    if (this._match(TokenType.NIL))
      return new Expr.Literal(null);

    if (this._match(TokenType.NUMBER, TokenType.STRING))
      return new Expr.Literal(this._previous().literal)

    if (this._match(TokenType.LEFT_PAREN)) {
      const expr = this._expression()
      this._consume(TokenType.RIGHT_PAREN, "Expect ')' after expression.")
      return new Expr.Grouping(expr)
    }

    throw this._error(this._peek(), "Expected expression.")
  }

  _consume(tokenType, message)/*Token*/{
    if (this._check(tokenType))
      return this._advance()

    throw this._error(this._peek(), message)
  }

   _error(token, message)/*ParseError*/{
    this.Lox.error(token, message)
    return new Error('ParseError')
  }

  synchronize() {                 
    this._advance();

    while (!this._isAtEnd()) {                       
      if (this._previous().tokenType === TokenType.SEMICOLON)
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