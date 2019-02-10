import { app } from '../app'

app
	.init()
	.goto('https://www.google.com')
	.search('input[name=q]', 'google')
	.screenshot()
