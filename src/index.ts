import { getBrowser } from './browser'

const browserParams = {
	headless: true,
}
;(async () => {
	const browser = await getBrowser(browserParams)
	const page = await browser.newPage()
	await page.setViewport({ width: 1280, height: 1024 })
	await page.goto('http://example.com')
	await page.screenshot({ path: './example.png' })
	await page.close()
})()
