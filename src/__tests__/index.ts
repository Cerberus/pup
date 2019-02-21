import { app } from '../app'
import { google } from '../google'

app
	.init({ headless: false })
	.goto('https://www.google.com')
	.search('input[name=q]', 'google')

google.isFirstTitle('Google')
