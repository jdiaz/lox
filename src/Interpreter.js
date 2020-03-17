const Expr = require('./Expr')
const TokenType = require('./TokenType')
const RuntimeError = require('./RuntimeError')
const {log, level, logError} = require('./log')
const Environment = require('./Environment')
const LoxCallable = require('./LoxCallable')
const LoxFunction = require('./LoxFunction')
const NativeFunction = require('./NativeFunction')

class Interpreter/*implements Visitor<Object>, Stmt.Visitor<Void>*/{

  constructor() {
    this.globals = new Environment()
    this.environment = this.globals;

    this.globals.define(
      'clock',
      new NativeFunction(0, () => new Date.now() / 1000),
    )
  }

  interpret(statements, Lox) {
    try {
      for (let i = 0; i < statements.length; i++) {
        this.execute(statements[i])
      }
    } catch (err) {
      console.log(err)
      Lox.runtimeError(err)
    }
  }

  execute(stmt) {
    stmt.accept(this)
  }

  visitWhileStmt(stmt) {
    while (this.isTruthy(this.evaluate(stmt.condition))) {
      this.execute(stmt.body)
    }
  }

  visitBlockStmt(stmt) {
    this.executeBlock(stmt.statements, new Environment(this.environment))
  }

  executeBlock(statements, enclosingEnvironment) {
    const previous = this.environment
    try {
      this.environment = enclosingEnvironment

      for (let i = 0; i < statements.length; i++) {
        this.execute(statements[i])
      }
    } finally {
      this.environment = previous
    }
  }

  visitIfStmt(stmt) {
    if (this.isTruthy(this.evaluate(stmt.condition))) {
      this.execute(stmt.thenBranch)
    } else if (stmt.elseBranch != null) {
      this.execute(stmt.elseBranch)
    }
    return null
  }

  visitExpressionStmt(stmt) {
    this.evaluate(stmt.expression)
  }

  visitPrintStmt(stmt) {
    const value = this.evaluate(stmt.expression)
    log(this.stringify(value), level.INFO, true)
  }

  visitVarStmt(/*Stmt.Var*/stmt) {
    let value = null             
    if (stmt.initializer != null) {        
      value = this.evaluate(stmt.initializer) 
    }

    this.environment.define(stmt.name.lexeme, value)
  }

  visitLogicalExpr(expr) {
    const left = this.evaluate(expr.left)

    if (expr.operator.tokenType === TokenType.OR) {
      if (this.isTruthy(left))
        return left
    } else {
      if (!this.isTruthy(left))
        return left
    }

    return this.evaluate(expr.right)
  }

  visitAssignExpr(expr) {
    const value = this.evaluate(expr.value)

    this.environment.assign(expr.name, value)
    return value
  }

  visitLiteralExpr(expr) {
    return expr.value
  }

  visitGroupingExpr(expr/*Expr.Grouping*/) {
    return this.evaluate(expr.expression)
  }

  visitUnaryExpr(expr) {
    let right = this.evaluate(expr.right)

    switch (expr.operator.tokenType) {
      case TokenType.MINUS:
        this.checkNumberOperand(expr.operator, right)
        return -(right)             
      case TokenType.BANG:
        return !this.isTruthy(right) 
    }                          

    // Unreachable.
    return null           
  }

  visitVariableExpr(/*Expr.Variable*/expr) {
    return this.environment.get(expr.name)
  }             

  /*private*/
  evaluate(expr/*Expr.Subclass*/) {
    return expr.accept(this);         
  }

  /*private*/
  isTruthy(object) {               
    if (object == null/* or undefined*/)
      return false
    if (typeof(object) === 'boolean')
      return object
    return true
  }

  visitCallExpr(/*Expr.Call*/expr) {
    const callee = this.evaluate(expr.callee)
    const args = []
    for (let i = 0; i < expr.args.length; i++) {
      args.push(this.evaluate(expr.args[i]))
    }
    if (!(callee instanceof LoxCallable)) {
      throw new RuntimeError(
        expr.paren,
        'Can only call functions and classes.',
      )
    }

    if (args.length !== callee.arity()) {
      throw new RuntimeError(
        expr.paren,
        `Expected ${callee.arity()} arguments but got ${args.length}.`,
      )
    }
    return callee.call(this, args)
  }

  visitFunctionStmt(/*Stmt.Function*/stmt) {
    const func = new LoxFunction(stmt)
    this.environment.define(stmt.name.lexeme, func)
  }

  visitBinaryExpr(/*Expr.Binary*/expr) {
    let left = this.evaluate(expr.left)            
    let right = this.evaluate(expr.right)

    switch (expr.operator.tokenType) {
      case TokenType.MINUS:
        this.checkNumberOperands(expr.operator, left, right)
        return left - right
      case TokenType.PLUS:
        if (typeof(left) === 'number' && typeof(right) === 'number') {
          return left + right
        }
        console.log('left: ' +left);
        console.log("right: " +right);
        if (typeof(left) === 'string' || typeof(right) === 'string') {
          let lNum = left
          let rNum = right
          if (left !== ' ' && !isNaN(Number(left))) {
            lNum = parseFloat(left)
          }
          if (right !== ' ' &&  !isNaN(Number(right))) {
            rNum = parseFloat(right)
          }
          return lNum + rNum
        }
        throw new RuntimeError(
          expr.operator,
          'Operands must be two numbers or two strings.',
        )
      case TokenType.SLASH:
        return left / right
      case TokenType.STAR:
        return left * right
       case TokenType.GREATER:
        this.checkNumberOperands(expr.operator, left, right)               
        return left > right 
      case TokenType.GREATER_EQUAL:
        this.checkNumberOperands(expr.operator, left, right)
        return left >= right
      case TokenType.LESS:
        this.checkNumberOperands(expr.operator, left, right)
        return left < right
      case TokenType.LESS_EQUAL:
        this.checkNumberOperands(expr.operator, left, right)
        return left <= right
      case TokenType.BANG_EQUAL:
        return !this.isEqual(left, right)
      case TokenType.EQUAL_EQUAL:
        return this.isEqual(left, right)
    }

    // Unreachable.
    return null;                                   
  }

  isEqual(a, b) {
    if (a == null && b == null)
      return true
    if (a == null)
      return false

    return a === b
  }

  checkNumberOperand(operator, operand) {
    if (typeof(operand) === 'number')
      return
    throw new RuntimeError(operator, 'Operand must be a number.')
  }

  checkNumberOperands(operator, leftOperand, rightOperand) {
    if (typeof(leftOperand) === 'number' && typeof(rightOperand) === 'number')
      return
    throw new RuntimeError(operator, 'Operands must be numbers.')
  }

  stringify(object) {
    if (object == null) 
      return 'nil'

    // Hack. Work around JS adding ".0" to integer-valued floats.
    if (typeof(object) === 'number') {                                 
      let text = String(object) 
      if (text.endsWith('.0')) {
        text = text.substring(0, text.length() - 2);                
      }                                                             
      return text
    }                                                               

    return String(object)
  }                                                                 


}

module.exports = Interpreter