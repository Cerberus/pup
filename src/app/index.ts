import * as puppeteer from 'puppeteer'

import { action, defer } from 'prescript'

import { proxify } from '../proxy'

class App {
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
		return this
	}
	openUrl(url: string) {
		action(async ({ page }) => {
			await page.goto(url)
		})
		return this
	}
}

export const app = proxify(new App())
