import { app } from '../app'
import { google } from '../google'

app
	.init()
	.goto('https://www.google.com')
	.search('input[name=q]', 'google')

google.isFirstTitle('Google')
