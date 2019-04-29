import { app } from 'modules/app'
import { expect } from 'modules/assert'

const GOOGLE_SEARCH_BOX = 'input[name=q]'
const FIRST_SEARCH_RESULT = '#rso > *:nth-child(1) h3'
const GOOGLE_LINK = "//*[@id='rso']//*[text()='Google']"

app
	.init({ screen: 'mobile' })
	.goto('https://www.google.com')
	.search(GOOGLE_SEARCH_BOX, 'google')

expect(FIRST_SEARCH_RESULT).equal('Google')

app.clickText(GOOGLE_LINK)

expect(GOOGLE_SEARCH_BOX, 'value').equal('')
