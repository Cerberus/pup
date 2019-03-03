import { app } from 'app/app'
import { expect } from 'app/assert'

const GOOGLE_SEARCH_BOX = 'input[name=q]'
const FIRST_SEARCH_RESULT = '#rso > *:nth-child(1) h3'
const SECOND_SEARCH_RESULT = '#rso > *:nth-child(2) h3'

app
	.init()
	.goto('https://www.google.com')
	.search(GOOGLE_SEARCH_BOX, 'google')

expect(FIRST_SEARCH_RESULT).equal('Google')
expect(SECOND_SEARCH_RESULT).contain('Google')
expect(GOOGLE_SEARCH_BOX).valueEqual('google')
