import * as glob from 'glob'
import * as chalk from 'chalk'
import * as childProcess from 'child_process'

const {
	bgGreen: { bold: green },
	bgRed: { bold: red },
} = chalk.default

const files = glob.sync('dist/__tests__/*/index.js')
const limit = require('p-limit')(3)
const PRESCRIPT = './node_modules/.bin/prescript'

Promise.all(
	files.map(file =>
		limit(
			() =>
				new Promise(resolve => {
					childProcess.execFile(PRESCRIPT, [file], (e, stdout) => {
						e
							? console.log(red(' NG '), file, '\n', stdout)
							: console.log(green(' OK '), file)
						resolve(e || undefined)
					})
				}),
		),
	),
).then(results => {
	const errorLength = results.filter(result => !!result).length
	if (errorLength) {
		console.error('test fail', errorLength, 'case(s)')
		process.exit(1)
	}
})
