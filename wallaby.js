module.exports = function(wallaby) {
	var path = require('path')

	process.env.NODE_PATH +=
		path.delimiter + path.join(wallaby.projectCacheDir, 'src') // must sync with tsconfig.json
	// best-practic: https://wallabyjs.com/docs/integration/typescript.html#node-environment-with-mochajasmineavatape

	return {
		files: ['src/*.ts'],
		compilers: {
			'**/*.ts?(x)': wallaby.compilers.typeScript({
				useStandardDefaults: true,
			}),
		},
		tests: ['__tests__/*.ts'],
		env: {
			type: 'node',
			kind: 'chrome',
			runner: 'node',
			params: {
				runner: '--headless --disable-gpu',
			},
		},
	}
}
