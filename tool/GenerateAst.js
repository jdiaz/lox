const fs = require('fs')
const {log, level, logError} = require('../src/log')

class GenerateAst {
	static run() {
		
		const args = process.argv
		if (args.length != 3) {
			log('Usage: node GenerateAsk.js <output directory>')
			process.exit(1)
		}
		
		const outputDir = args[2]

		GenerateAst._defineAst(outputDir,  'Expr', [
			{type: 'Binary', fields: ['left', 'operator', 'right']},
			{type: 'Grouping', fields: ['expression']},
			{type: 'Literal', fields: ['value']},
			{type: 'Unary', fields: ['operator', 'right']},
		])
	}

	static _defineAst(outputDir, basename, typesArr) {
		const path = outputDir + '/' + basename + '.js'
		
		const data = [
			'class ' + basename + ' {\n}\n\n',
		];
		for (let row of typesArr) {
			if (row == null) 
				continue
			data.push('class ' + row.type + ' extends ' + basename + ' {\n' + '  constructor(')
			for (let i = 0; i < row.fields.length; i++) {
				data.push(row.fields[i])
				if (i !== row.fields.length - 1)
					data.push(',')
			}
			data.push(') {\n')
			for (let field of row.fields) {
				data.push('    this.' + field + '\n')
			}
			data.push('  }\n}\n\n')
		}

		fs.writeFile(path, data.join(''), (err) => {
			if (err) {
				logError(err)
				throw err
			}
		})
	}
}

GenerateAst.run()