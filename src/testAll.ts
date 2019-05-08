import * as glob from 'glob'
import * as chalk from 'chalk'
import * as childProcess from 'child_process'
import { getInfo } from './modules/app/utils'

const {
	bgGreen: { bold: green },
	bgRed: { bold: red },
} = chalk.default

const files = glob.sync(process.env.TEST_PATH as string)
const limit = require('p-limit')(3)
const PRESCRIPT = './node_modules/.bin/prescript'

Promise.all(
	files.map(file =>
		limit(
			() =>
				new Promise(resolve => {
					const { squad, device, name } = getInfo(file)
					process.env.ALLURE_SUITE_NAME = squad
					process.env.ALLURE_CASE_NAME = `${name}/${device}`
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
