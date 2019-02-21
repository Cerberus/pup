import { app } from 'app/app'
import { google } from 'app/google'

app
	.init()
	.goto('https://www.google.com')
	.search('input[name=q]', 'google')

google.isFirstTitle('Google')
