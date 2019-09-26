const fs = require('fs')
const readline = require('readline')
const scanner = require('./Scanner')

class Lox {
	
	hadError = false

	main() {
		const args = process.argv
		if (args.length > 1) {
			console.log('Usage: jlox [script]');
			process.exit(64)
		} else if (args.length == 1) {
			this._runFile(args[0])
		} else {
			this_.runPrompt()
		}
	}

	_runFile(path) {
		fs.readFile(path, (err, source) => {
			if (err) 
				console.error(err);
			this._run(source)
			if (hadError) System.exit(65);
		});
	}

	_runPrompt() {
		const rl = readline.createInterface({
 		  input: process.stdin,
  	  output: process.stdout
		})

		while (1) {
			rl.question('>> ', (value) => {
				this._run(value)
				rl.close()
				hadError = false
			})
		}
	}

	_run(source) {
		// TODO
		const scanner = new Scanner()
		tokens = scanner.scanTokens()

		for (token in tokens) {
			console.log(token)
		}

	}

	_error(line, msg) {
		this_.report(line, '', msg)
	}

	_report(line, where, msg) {
		console.error(`[line ${line}] Error ${where}: ${msg}`)
		hadError = true
	}

}

module.exports = Lox;