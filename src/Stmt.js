/*
	generated by GenerateAst.js

	interface Visitor<R> {
		 R visitExpressionStmt(Visitor<Expression> visitor)
		 R visitPrintStmt(Visitor<Print> visitor)
	}
*/

/* abstract class */
class Stmt {
	accept (visitor) {}
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

module.exports = {
	Expression,
	Print
}