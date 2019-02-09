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
	goto(url: string) {
		action(async ({ page }) => {
			await page.goto(url)
		})
		return this
	}
	screenshot(options?: puppeteer.ScreenshotOptions) {
		action(async ({ page }) => {
			const fileName = new Date(Date.now()).toString().slice(16, 24)
			await page.screenshot({
				path: `./screenshots/${fileName}.png`,
				...options,
			})
		})
		return this
	}
	type(selector: string, text: string, options?: { delay: number }) {
		action(async ({ page }) => {
			await page.type(selector, text, options)
		})
		return this
	}
}

export const app = proxify(new App())
