import * as puppeteer from 'puppeteer'

import { defer } from 'prescript'

import { Screen, LaunchOptions } from './types'
import { proxify, action, page } from 'proxy'

type Cookie = [string, string | undefined]
const genCookie = ([name, value = '']: Cookie) => ({
	name,
	value,
	domain: process.env.COOKIE_DOMAIN,
})
const COOKIES: Cookie[] = [
	['ws', process.env.COOKIE_WS],
	['wtoken', process.env.COOKIE_WTOKEN],
]

const getDefaultSettings = (screen: Screen) => {
	switch (screen) {
		case 'mobile':
			return { width: 375, height: 667 }
		case 'desktop':
			return { width: 1024, height: 768 }
	}
}

export const app = proxify({
	createPage: (options?: puppeteer.LaunchOptions) => {
		action(async state => {
			const browser = await puppeteer.launch(options)
			state.browser = browser
			const page = await browser.newPage()
			state.page = page
		})
	},
	init: (options: LaunchOptions) => {
		const { screen, ...rest } = options
		const defaultViewport = getDefaultSettings(screen)
		app.createPage({ defaultViewport, ...rest })
		defer('Close browser', async ({ browser }) => {
			await browser.close()
		})
	},
	login: () => {
		action(async () => {
			await page.setCookie(...COOKIES.map(genCookie))
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
