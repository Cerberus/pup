import * as puppeteer from 'puppeteer'
import { step, action, defer, pending } from 'prescript'

const app = {
	init(options?: puppeteer.ChromeArgOptions) {
		action('initial', async state => {
			const browser = await puppeteer.launch(options)
			state.browser = browser
			const page = await browser.newPage()
			state.page = page
		})
		defer('Close browser', async ({ browser }) => {
			await browser.close()
		})
		return this
	},
	gotoExample() {
		action('gotoExample', async ({ page }) => {
			await page.goto('http://example.com')
		})
		return this
	},
}

export default app
