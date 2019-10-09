class Expr {
}

class Binary extends Expr {
  constructor(left,operator,right) {
    this.left
    this.operator
    this.right
  }
}

class Grouping extends Expr {
  constructor(expression) {
    this.expression
  }
}

class Literal extends Expr {
  constructor(value) {
    this.value
  }
}

class Unary extends Expr {
  constructor(operator,right) {
    this.operator
    this.right
  }
}

