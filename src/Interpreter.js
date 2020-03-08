const Expr = require('./Expr')
const TokenType = require('./TokenType')
const RuntimeError = require('./RuntimeError')
const {log, level, logError} = require('./log')

class Interpreter /*implements Visitor<Object>*/{

	construct() {
	}

	interpret(expression, Lox) {        
    try {                                  
      let value = this.evaluate(expression)
      log(this.stringify(value), level.INFO, true)
    } catch (err) {
      Lox.runtimeError(err)
    }
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
		    return -((right).toFixed())                  
		  case TokenType.BANG:
        return !this.isTruthy(right) 
		}                          

  	// Unreachable.                              
  	return null;                                 
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
    	return object;
    return true
  }

  visitBinaryExpr(/*Expr.Binary*/expr) {
    let left = this.evaluate(expr.left)            
    let right = this.evaluate(expr.right)

    switch (expr.operator.tokenType) {
      case TokenType.MINUS:
      	this.checkNumberOperands(expr.operator, left, right)
        return (left).toFixed() - (right).toFixed()
      case TokenType.PLUS:
        if (typeof(left) === 'number' && typeof(right) === 'number') {
          return (left).toFixed() + (right).toFixed()
        } 
        if (typeof(left) === 'string' && typeof(right) === 'string') {
          return ''+left + ''+right
        }
        throw new RuntimeError(
        	expr.operator,
          'Operands must be two numbers or two strings.',
        )
      case TokenType.SLASH:
        return (left).toFixed() / (right).toFixed()
      case TokenType.STAR:
        return (left).toFixed() * (right).toFixed()
       case TokenType.GREATER:
        this.checkNumberOperands(expr.operator, left, right)               
        return (left).toFixed() > (right).toFixed() 
      case TokenType.GREATER_EQUAL:
      	this.checkNumberOperands(expr.operator, left, right)
        return (left).toFixed() >= (right).toFixed()
      case TokenType.LESS:
      	this.checkNumberOperands(expr.operator, left, right)
        return (left).toFixed() < (right).toFixed() 
      case TokenType.LESS_EQUAL:
      	this.checkNumberOperands(expr.operator, left, right)
        return (left).toFixed() <= (right).toFixed()
      case TokenType.BANG_EQUAL:
      	return !this.isEqual(left, right)
      case TokenType.EQUAL_EQUAL:
      	return this.isEqual(left, right)
    }

    // Unreachable.
    return null;                                   
  }

  isEqual(a, b) {
  	if (a == null && b == null) return true
  	if (a == null) return false

  	return a == b
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