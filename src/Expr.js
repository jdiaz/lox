/*
	generated by GenerateAst.js

	interface Visitor<R> {
		 R visitLogicalExpr(Visitor<Logical> visitor)
		 R visitAssignExpr(Visitor<Assign> visitor)
		 R visitBinaryExpr(Visitor<Binary> visitor)
		 R visitGroupingExpr(Visitor<Grouping> visitor)
		 R visitLiteralExpr(Visitor<Literal> visitor)
		 R visitUnaryExpr(Visitor<Unary> visitor)
		 R visitVariableExpr(Visitor<Variable> visitor)
		 R visitCallExpr(Visitor<Call> visitor)
	}
*/

/* abstract class */
class Expr {
	accept (visitor) {}
}

class Logical extends Expr {
	constructor(left,operator,right) {
		super()
		this.left = left
		this.operator = operator
		this.right = right
	}

	/* Logical accept(Visitor<Logical> visitor) */
	accept(visitor) {
		return visitor.visitLogicalExpr(this)
	}
}

class Assign extends Expr {
	constructor(name,value) {
		super()
		this.name = name
		this.value = value
	}

	/* Assign accept(Visitor<Assign> visitor) */
	accept(visitor) {
		return visitor.visitAssignExpr(this)
	}
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

class Variable extends Expr {
	constructor(name) {
		super()
		this.name = name
	}

	/* Variable accept(Visitor<Variable> visitor) */
	accept(visitor) {
		return visitor.visitVariableExpr(this)
	}
}

class Call extends Expr {
	constructor(callee,paren,args) {
		super()
		this.callee = callee
		this.paren = paren
		this.args = args
	}

	/* Call accept(Visitor<Call> visitor) */
	accept(visitor) {
		return visitor.visitCallExpr(this)
	}
}

module.exports = {
	Logical,
	Assign,
	Binary,
	Grouping,
	Literal,
	Unary,
	Variable,
	Call
}