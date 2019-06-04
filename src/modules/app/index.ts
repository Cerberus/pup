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
	setGeolocation: (geo: puppeteer.GeoOptions) => {
		action(async () => {
			await page.setGeolocation(geo)
		})
	},
	goto: (url: string) => {
		action(async () => {
			await page.goto(url)
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
			const element = await waitFor(selector)
			await element.click({ clickCount: 3 })
			await element.type(text)
		})
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
		action(async state => {
			await state.netPromise
		})
	},
	press: (key: string) => {
		action(async () => {
			await page.keyboard.press(key)
		})
	},
})
