import assert from 'assert'

import { app } from './app'

app
	.init({ headless: false })
	.goto('https://www.google.com')
	.type('input[name=q]', 'google')
