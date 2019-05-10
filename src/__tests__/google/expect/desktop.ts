import { app } from 'modules/app'
import { expectAll, expect, expectText } from 'modules/assert'

const FOOTER_FIRST_LINK = '#fsl a:nth-child(1)'
const FOOTER_LINKS = '#fsl a'
const FOOTER_AD_LINK = '//body//*[text()="โฆษณา"]'
const FOOTER_TEXT = '//body//*[contains(text(),"แสดง")]'

app.init().goto('https://www.google.com')

expect(FOOTER_FIRST_LINK).exist()
expectAll(FOOTER_LINKS).moreThan(2)

// expect it exist
expectText(FOOTER_AD_LINK).exist()

// หาคำว่า แสดง แล้วเทสว่ามีคำว่า google
expectText(FOOTER_TEXT).contain('Google')
