# Implementation Steps

1.  Scanning: The idea is that we read either console or file contents and begin producing useful representation that the computer can make better use of. This is somethimes called *Lexical Analysis* or *Lexing*.
	* Lexing: Take textual input and chop it into so called **Tokens** - or - a object the computer can understand more about. Each **Token** should have metadata such as: **TokenType** and the **Literal** string or numerical value it represents.
	* When lexing its useful to **peek** ahead when attempting to tokenize operators with more than one character or skipping comment blocks.
	* When implementing **identifiers** its useful to create a table<keywords, tokenType> in order to avoid considering a reserved word as a valid **identifier**
2. Context-free grammar i.e. Backus-Naur form
	* Producers - grammar rules that create strings
	* Terminal - letter in grammar rules do not produce a string
	* NonTerminal - grammar that references other grammar rules i.e. nested expressions
3. Expression Problem and Representation
	* Syntax Tree can be used to represent expression in code i.e. `[left: Expr, operator, right: Expr]`
	* Metaprogramming the Expresison Trees is a good tecnique to avoid hand writing code. It consists of writing a script that takes a description of each type and its fields creates the source code for each tree class.
	* How do we handle identifying each Expression separetely in order to avoid nested reflection `instanceof` checks?
		* One thougth is to add `interpret` method to each expression. This won't work in larger projects due to Expressions crossing multiple domains such as Parsing, Typecheking, and others.
	* The Visitor Pattern: Allows us to solve the problem of adding a new operation to OOP code withtout having to change the existing OOP Types by implementing an interface method which generalizing on the type (say AbstractSuperClassType), but calls appropriate method for the concreate class type https://www.craftinginterpreters.com/representing-code.html. Thus, allowing us to create new operations and new types!
4. Parsing Expressions
	* Recursive Descent Parsing - A recursive descent parser is a literal translation of the grammar’s rules straight into imperative code. Each rule becomes a function. The body of the rule translates to code. It’s called “recursive descent” because when a grammar rule refers to itself—directly or indirectly—that translates to recursive method calls.
5. Interpreter
	* Evaluate each expression by type using host programming language's type system, reflection ie. `instanceof` `typeof` etc. to perform calculations
	* Visitor pattern allows us to evaluate multiple gramar rules easily


