import * as puppeteer from 'puppeteer'

import { defer } from 'prescript'

import { proxify, action, page } from 'proxy'

export const app = proxify({
	createPage: (options?: puppeteer.LaunchOptions) => {
		action(async state => {
			const browser = await puppeteer.launch(options)
			state.browser = browser
			const page = await browser.newPage()
			state.page = page
		})
	},
	init: (options?: puppeteer.LaunchOptions) => {
		app.createPage(options)
		defer('Close browser', async ({ browser }) => {
			await browser.close()
		})
	},
	login: () => {
		const genCookie = (name: string, value: string = '') => ({
			name,
			value,
			domain: process.env.COOKIE_DOMAIN,
		})
		action(async () => {
			await page.setCookie(
				genCookie('ws', process.env.COOKIE_WS),
				genCookie('wtoken', process.env.COOKIE_WTOKEN),
			)
		})
	},
	goto: (url: string) => {
		action(async () => {
			await page.goto(url)
		})
	},
	click: (selector: string) => {
		action(async () => {
			await page.click(selector)
		})
	},
	clickText: (selector: string) => {
		action(async () => {
			const [element] = await page.$x(selector)
			await element.click()
		})
	},
	screenshot: (options?: puppeteer.ScreenshotOptions) => {
		action(async () => {
			const fileName = new Date(Date.now()).toString().slice(16, 24)
			await page.screenshot({
				path: `./screenshots/${fileName}.png`,
				...options,
			})
		})
	},
	type: (selector: string, text: string) => {
		action(async () => {
			await page.type(selector, text)
		})
	},
	enter: () => {
		action(async () => {
			await page.keyboard.press('Enter')
		})
	},
	search: (selector: string, text: string) => {
		app.type(selector, text).enter()
	},
})
