/*
  generated by GenerateAst.js

  interface Visitor<R> {
     R visitIfStmt(Visitor<If> visitor)
     R visitBlockStmt(Visitor<Block> visitor)
     R visitExpressionStmt(Visitor<Expression> visitor)
     R visitPrintStmt(Visitor<Print> visitor)
     R visitVarStmt(Visitor<Var> visitor)
  }
*/

/* abstract class */
class Stmt {
  accept (visitor) {}
}

class If extends Stmt {
  constructor(condition,thenBranch,elseBranch) {
    super()
    this.condition = condition
    this.thenBranch = thenBranch
    this.elseBranch = elseBranch
  }

  /* If accept(Visitor<If> visitor) */
  accept(visitor) {
    return visitor.visitIfStmt(this)
  }
}

class Block extends Stmt {
  constructor(statements) {
    super()
    this.statements = statements
  }

  /* Block accept(Visitor<Block> visitor) */
  accept(visitor) {
    return visitor.visitBlockStmt(this)
  }
}

class Expression extends Stmt {
  constructor(expression) {
    super()
    this.expression = expression
  }

  /* Expression accept(Visitor<Expression> visitor) */
  accept(visitor) {
    return visitor.visitExpressionStmt(this)
  }
}

class Print extends Stmt {
  constructor(expression) {
    super()
    this.expression = expression
  }

  /* Print accept(Visitor<Print> visitor) */
  accept(visitor) {
    return visitor.visitPrintStmt(this)
  }
}

class Var extends Stmt {
  constructor(name,initializer) {
    super()
    this.name = name
    this.initializer = initializer
  }

  /* Var accept(Visitor<Var> visitor) */
  accept(visitor) {
    return visitor.visitVarStmt(this)
  }
}

module.exports = {
  If,
  Block,
  Expression,
  Print,
  Var
}