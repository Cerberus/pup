import * as glob from 'glob'
import * as chalk from 'chalk'
import * as childProcess from 'child_process'

const {
	bgGreen: { bold: green },
	bgRed: { bold: red },
} = chalk.default

const files = glob.sync('dist/__tests__/*.js')
const limit = require('p-limit')(3)

Promise.all(
	files.map(file =>
		limit(
			() =>
				new Promise(resolve => {
					childProcess.execFile(
						'./node_modules/.bin/prescript',
						[file],
						(e, stdout) => {
							e
								? console.log(red(' NG '), file, '\n', stdout)
								: console.log(green(' OK '), file)
							resolve(e)
						},
					)
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
