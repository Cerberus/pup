// every file name must be unique for auto import feature
module.exports = {
	excludes: [
		'./__tests__/**/*',
		'./dist/**/*',
		'./allure-results/**/*',
		'./lib.d.ts',
		'./wallaby.js',
		'./jest.config.js',
	],
	useRelativePaths: true,
	tab: '\t',
	importStatementFormatter({ importStatement }) {
		return importStatement.replace(/;$/, '').replace(/src\//, '')
	},
}
