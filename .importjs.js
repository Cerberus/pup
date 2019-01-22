// every file name must be unique for auto import feature
module.exports = {
	excludes: [
		'./__tests__/**/*',
		'./lib.d.ts',
		'./wallaby.js',
		'./jest.config.js',
	],
	useRelativePaths: false,
	tab: '\t',
	importStatementFormatter({ importStatement }) {
		return importStatement.replace(/;$/, '').replace(/src\//, '')
	},
}
