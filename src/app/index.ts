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
		defer('Close browser', async state => {
			await app.getBrowser(state).close()
		})
		return this
	},

	gotoExample() {
		action('gotoExample', async state => {
			const page = app.getPage(state)
			await page.goto('http://example.com')
		})
		return this
	},

	getBrowser: (state: Prescript.GlobalState) =>
		state.browser as puppeteer.Browser,

	getPage: (state: Prescript.GlobalState) => state.page as puppeteer.Page,
}

export default app
