/*
	generated by GenerateAst.js

	interface Visitor<R> {
		 R visitBinaryExpr(Visitor<Binary> visitor)
		 R visitGroupingExpr(Visitor<Grouping> visitor)
		 R visitLiteralExpr(Visitor<Literal> visitor)
		 R visitUnaryExpr(Visitor<Unary> visitor)
	}
*/

class Expr /*implements Visitor*/{
}

class Binary extends Expr {
	constructor(left,operator,right) {
		super()
		this.left = left
		this.operator = operator
		this.right = right
	}

	/* Binary accept(Visitor<Binary> visitor) */
	accept(visitor) {
		return visitor.visitBinaryExpr(this)
	}
}

class Grouping extends Expr {
	constructor(expression) {
		super()
		this.expression = expression
	}

	/* Grouping accept(Visitor<Grouping> visitor) */
	accept(visitor) {
		return visitor.visitGroupingExpr(this)
	}
}

class Literal extends Expr {
	constructor(value) {
		super()
		this.value = value
	}

	/* Literal accept(Visitor<Literal> visitor) */
	accept(visitor) {
		return visitor.visitLiteralExpr(this)
	}
}

class Unary extends Expr {
	constructor(operator,right) {
		super()
		this.operator = operator
		this.right = right
	}

	/* Unary accept(Visitor<Unary> visitor) */
	accept(visitor) {
		return visitor.visitUnaryExpr(this)
	}
}

module.exports = {
		Binary,
		Grouping,
		Literal,
		Unary
}