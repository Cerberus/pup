import * as puppeteer from 'puppeteer'

import { action, defer } from 'prescript'

import { proxify } from '../proxy'

const app = {
	init(options?: puppeteer.ChromeArgOptions) {
		action('Create page', async state => {
			const browser = await puppeteer.launch(options)
			state.browser = browser
			const page = await browser.newPage()
			state.page = page
		})
		defer('Close browser', async ({ browser }) => {
			await browser.close()
		})
		return app
	},
	openUrl(url: string) {
		action(async ({ page }) => {
			await page.goto(url)
		})
		return app
	},
}

export default proxify(app)
