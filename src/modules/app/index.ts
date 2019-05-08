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
			return { width: 375, height: 667, isMobile: true }
		case 'desktop':
			return { width: 1024, height: 768, isMobile: false }
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
		const headless = process.env.NODE_ENV !== 'development'
		app.createPage({ defaultViewport, headless, ...rest })
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
	clickText: (xPath: string) => {
		action(async () => {
			const [element] = await page.$x(xPath)
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
			await page.evaluate(selector => {
				document.querySelector(selector).value = ''
			}, selector)
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
	uploadFile: (selector: string) => {
		action(async () => {
			const element = await page.waitForSelector(selector, {
				timeout: 5000,
			})
			await element.uploadFile('./resources/images/square.png')
		})
	},
})
