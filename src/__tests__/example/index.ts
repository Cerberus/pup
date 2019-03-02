import { app } from 'app/app'
import { expect } from 'app/assert'

const GOOGLE_SEARCH_BOX = 'input[name=q]'
const FIRST_SEARCH_RESULT = '#search h3'

app
	.init()
	.goto('https://www.google.com')
	.search(GOOGLE_SEARCH_BOX, 'google')

expect(FIRST_SEARCH_RESULT).equal('Google')
expect(GOOGLE_SEARCH_BOX).valueEqual('google')
