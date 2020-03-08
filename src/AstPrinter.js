const {log, Level, logError} = require('./log')
const Expr = require('./Expr')
const Token = require('./Token')
const TokenType = require('./TokenType')

// Creates an unambiguous, if ugly, string representation of AST nodes.

/*
Recall:
  interface Visitor<R> {
    abstract <R> R accept(Visitor<R> visitor)
  }
*/
class AstPrinter /*implements Visitor<String>*/ {
  
  constructor() {}

  print(expr) {
    return expr.accept(this)
  }

  visitBinaryExpr(expr) {                  
    return this.parenthesize(expr.operator.lexeme, [expr.left, expr.right])
  }

  visitGroupingExpr(expr) {
    return this.parenthesize('group', [expr.expression])
  }                  
  
  visitLiteralExpr(expr) {             
    if (expr.value == null)
      return 'nil'
    return expr.value
  }                                                 
  
  visitUnaryExpr(expr) {                    
    return this.parenthesize(expr.operator.lexeme, [expr.right])
  }

  parenthesize(name, exprs) {
    const strBuilder = []
    strBuilder.push(`(${name}`)
    exprs.forEach(expr => {                              
      strBuilder.push(' ')
      strBuilder.push(expr.accept(this))
    })                 
    strBuilder.push(')')
    return strBuilder.join('')
  }
}

function main() {
  expr = new Expr.Binary(
    new Expr.Unary(
      new Token(TokenType.MINUS, '-', null, 1),
      new Expr.Literal(123),
    ),
    new Token(TokenType.STAR, '*', null, 1),
    new Expr.Grouping(
      new Expr.Literal(47.67)
    )
  )

  log(new AstPrinter().print(expr), Level.INFO, true)
}

module.exports = AstPrinter
