import * as puppeteer from 'puppeteer'

import { defer } from 'prescript'

import {
	LaunchOptions,
	COOKIES,
	getDefaultViewport,
	waitForNetworkIdle,
	waitFor,
} from './utils'
import { proxify, action, page, browser } from 'proxy'

const dev = process.env.NODE_ENV === 'development'

export const app = proxify({
	createPage: (options: puppeteer.LaunchOptions) => {
		action(async state => {
			let browser = state.browser
			if (!browser) {
				browser = await puppeteer.launch({
					...options,
					args: [
						'--incognito',
						'--disable-notifications',
						...(process.env.CI
							? ['--no-sandbox', '--disable-setuid-sandbox']
							: []),
					],
				})
				const [emptyPage] = await browser.pages()
				emptyPage && emptyPage.close()
				state.browser = browser
			}
			const context = await browser.createIncognitoBrowserContext()
			state.context = context
			const page = await context.newPage()
			options.defaultViewport!.isMobile &&
				// @ts-ignore
				(await page.emulate(puppeteer.devices['iPhone 6']))
			state.page = page
		})
	},
	init: (options: LaunchOptions = {}) => {
		const defaultViewport = getDefaultViewport()
		const headless = !dev
		app.createPage({ defaultViewport, headless, ...options })
		defer('Close browser', async ({ context }) => {
			dev ? await context.close() : await browser.close()
		})
	},
	login: () => {
		action(async () => {
			await page.setCookie(...COOKIES)
		})
	},
	goto: (url: string) => {
		action(async () => {
			await page.goto(url, { timeout: 20000 })
		})
	},
	click: (selector: string) => {
		action(async () => {
			const element = await waitFor(selector)
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
	search: (selector: string, text: string) => {
		app.type(selector, text).press('Enter')
	},
	uploadFile: (selector: string) => {
		action(async () => {
			const element = await waitFor(selector)
			await element.uploadFile('./resources/images/square.png')
		})
	},
	waitFor: (selector: string) => {
		action(async () => {
			await waitFor(selector)
		})
	},
	waitForNetworkIdle: () => {
		action(async () => {
			const FIRST_TIME = dev ? 800 : 2000
			const INTERVAL_TIME = dev ? 500 : 1000
			await waitForNetworkIdle(FIRST_TIME, INTERVAL_TIME)
		})
	},
	press: (key: string) => {
		action(async () => {
			await page.keyboard.press(key)
		})
	},
})
