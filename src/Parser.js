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
const Stmt = require('./Stmt')
const TokenType = require('./TokenType')

class Parser {

  constructor(tokens, lox) {
    this.tokens = tokens
    this.current = 0
    this.Lox = lox
  }

  parse() {
    const statements = []
    while (!this.isAtEnd()) {
      statements.push(this.declaration())          
    }
    return statements
  }
  
  declaration() {
    try {

      if (this.match(TokenType.VAR))
        return this.varDeclaration()

      return this.statement()

    } catch (parseError) {
      this.synchronize()
      return null
    }
  }

  varDeclaration() {
    const name = this.consume(TokenType.IDENTIFIER, 'Expect variable name.')
    let initializer = null
    if (this.match(TokenType.EQUAL))
      initializer = this.expression()

    this.consume(TokenType.SEMICOLON, "Expect ';' after variable declaration.")
    return new Stmt.Var(name, initializer)
  }

  statement() {                  
    if (this.match(TokenType.PRINT))
      return this.printStatement()

    if (this.match(TokenType.LEFT_BRACE))
      return new Stmt.Block(this.block())

    return this.expressionStatement()
  }

  block() {
    const statements = []

    while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
      statements.push(this.declaration())
    }

    this.consume(TokenType.RIGHT_BRACE, "Expect '}' after block.")
    return statements
  }

  printStatement() {    
    const value = this.expression()
    this.consume(TokenType.SEMICOLON, "Expect ';' after value.")
    return new Stmt.Print(value)
  }

  expressionStatement() {
    const expr = this.expression()
    this.consume(TokenType.SEMICOLON, "Expect ';' after expression.")
    return new Stmt.Expression(expr)
  }       

  expression()/*: Expr */{
    return this.assignment()
  }

  assignment() {
    const expr = this.equality()

    if (this.match(TokenType.EQUAL)) {
      const equals = this.previous()
      const value = this.assignment()

      if (expr instanceof Expr.Variable) {
        return new Expr.Assign(expr.name, value)
      }

      this.error(equals, 'Invalid assignment target.')
    }
    
    return expr
  }

  equality() {
    let expr = this.comparison()

    while (this.match(TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL)) {
      const operator = this.previous()
      const rightExpr = this.comparison()
      expr = new Expr.Binary(expr, operator, rightExpr)
    }

    return expr
  }

  comparison() {
    let expr = this.addition()

    while (this.match(
      TokenType.GREATER,
      TokenType.GREATER_EQUAL,
      TokenType.LESS,
      TokenType.LESS_EQUAL,
    )) {
      const operator = this.previous()
      const rightExpr = this.addition()
      expr = new Expr.Binary(expr, operator, rightExpr)
    }

    return expr
  }

  addition() {
    let expr = this.multiplication()

    while (this.match(TokenType.MINUS, TokenType.PLUS)) {
      const operator = this.previous()
      const rightExpr = this.multiplication()
      expr = new Expr.Binary(expr, operator, rightExpr)
    }

    return expr
  }

  multiplication() {
    let expr = this.unirary()

    while (this.match(TokenType.SLASH, TokenType.STAR)) {
      const operator = this.previous()
      const rightExpr = this.unirary()
      expr = new Expr.Binary(expr, operator, rightExpr)
    }

    return expr
  }

  unirary() {
    if (this.match(TokenType.BANG, TokenType.MINUS)) {
      const operator = this.previous()
      const right = this.unirary()
      return new Expr.Unary(operator, right)
    }

    return this.primary()
  }

  primary() {
    if (this.match(TokenType.FALSE))
      return new Expr.Literal(false)
    if (this.match(TokenType.TRUE))
      return new Expr.Literal(true)
    if (this.match(TokenType.NIL))
      return new Expr.Literal(null)

    if (this.match(TokenType.NUMBER, TokenType.STRING))
      return new Expr.Literal(this.previous().literal)

    if (this.match(TokenType.IDENTIFIER))
      return new Expr.Variable(this.previous())

    if (this.match(TokenType.LEFT_PAREN)) {
      const expr = this.expression()
      this.consume(TokenType.RIGHT_PAREN, "Expect ')' after expression.")
      return new Expr.Grouping(expr)
    }

    throw this.error(this.peek(), "Expected expression.")
  }

  consume(tokenType, message)/*Token*/{
    if (this.check(tokenType))
      return this.advance()

    throw this.error(this.peek(), message)
  }

  error(token, message)/*ParseError*/{
    this.Lox.error(token, message)
    return new Error('ParseError')
  }

  synchronize() {                 
    this.advance();

    while (!this.isAtEnd()) {                       
      if (this.previous().tokenType === TokenType.SEMICOLON)
        return

      switch (this.peek().tokenType) {   
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

      this.advance();                               
    }
  } 

  match(...tokenTypes) {
    for (let i = 0; i < tokenTypes.length; i++) {
      if (this.check(tokenTypes[i])) {
        this.advance()
        return true
      }
    }
    return false
  }

  check(tokenType) {
    if (this.isAtEnd())
      return false
    return this.peek().tokenType === tokenType
  }

  advance() {
    if (!this.isAtEnd())
      this.current++
    return this.previous()
  }

  isAtEnd() {
    return this.peek().tokenType === TokenType.EOF
  }

  peek() {
    return this.tokens[this.current]
  }

  previous() {
    return this.tokens[this.current - 1]
  }
}

module.exports = Parser