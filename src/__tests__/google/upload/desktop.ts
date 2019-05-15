import { app } from 'modules/app'

const IMG_ICON = '#sbtc div[aria-label=ค้นด้วยภาพ]'
const UPLOAD_TAB = '//*[@id="qbp"]//*[text()="อัปโหลดภาพ"]'
const UPLOAD_INPUT = 'input#qbfile'

app
	.init()
	.goto('https://www.google.co.th/imghp')
	.click(IMG_ICON)
	.click(UPLOAD_TAB)
	.uploadFile(UPLOAD_INPUT)
