import { app } from 'app/app'
import { expect } from 'app/assert'

const GOOGLE_SEARCH_BOX = 'input[name=q]'
const SEARCH_RESULT = '#search h3'
const SUB_LINK = 'a'

app
	.init()
	.goto('https://www.google.com')
	.search(GOOGLE_SEARCH_BOX, 'google')

expect(SEARCH_RESULT).equal('Google')
expect(SEARCH_RESULT, 1, SUB_LINK).equal('Google')
expect(GOOGLE_SEARCH_BOX).valueEqual('google')
