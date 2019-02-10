import * as puppeteer from 'puppeteer'

import { defer } from 'prescript'

import { proxify, action, page } from '../proxy'

class App {
	createPage(options: puppeteer.ChromeArgOptions) {
		action(async state => {
			const browser = await puppeteer.launch(options)
			state.browser = browser
			const page = await browser.newPage()
			state.page = page
		})
	}
	init(options?: puppeteer.ChromeArgOptions) {
		app.createPage(options)
		defer('Close browser', async ({ browser }) => {
			await browser.close()
		})
		return this
	}
	goto(url: string) {
		action(async () => {
			await page.goto(url)
		})
		return this
	}
	screenshot(options?: puppeteer.ScreenshotOptions) {
		action(async () => {
			const fileName = new Date(Date.now()).toString().slice(16, 24)
			await page.screenshot({
				path: `./screenshots/${fileName}.png`,
				...options,
			})
		})
		return this
	}
	type(selector: string, text: string, options?: { delay: number }) {
		action(async () => {
			await page.type(selector, text, options)
		})
		return this
	}
	enter() {
		action(async () => {
			await page.keyboard.press('Enter')
		})
		return this
	}
	search(selector: string, text: string, options?: { delay: number }) {
		app.type(selector, text, options).enter()
		return this
	}
}

export const app = proxify(new App())
