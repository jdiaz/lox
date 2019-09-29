const fs = require('fs')
const stdin = process.openStdin()
const {log, level, logError} = require('./log')
const Scanner = require('./Scanner')

class Lox {
	
	constructor() {
		this.hadError = false
	}

	main() {
		const args = process.argv
		if (args.length > 3) {
			log('Usage: jlox [script]', level.INFO, true);
			process.exit(64)
		} else if (args.length == 3) {
			this._runFile(args[2])
		} else {
			this._runPrompt()
		}
	}

	_runFile(path) {
		fs.readFile(path, (err, source) => {
			if (err) 
				log(err, level.ERROR, true)

			this._run(source)

			if (this.hadError)
				System.exit(65)
		});
	}

	_runPrompt() {
		log('>> ')
		stdin.addListener('data', data => {
			this._run(String(data))
			log('>> ')
		})
	}

	_run(source) {
		const sc = new Scanner(source)
		const tokens = sc.scanTokens()

		for (const token of tokens) {
			log(token.toString(), level.INFO, true)
		}
	}
}

module.exports = Lox;