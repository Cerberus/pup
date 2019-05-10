import * as puppeteer from 'puppeteer'

import { defer } from 'prescript'

import {
	LaunchOptions,
	COOKIES,
	getDefaultViewport,
	TIMEOUT,
	waitForNetworkIdle,
} from './utils'
import { proxify, action, page } from 'proxy'

export let reqTotal = 0
export let resTotal = 0

const onRequestStarted = (req: any) => {
	reqTotal += 1
	console.log('reqTotal', reqTotal)
	req.continue()
}

const onRequestFinished = (res: any) => {
	resTotal += 1
	console.log('resTotal', resTotal, reqTotal - resTotal)
	res.continue()
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
	init: (options: LaunchOptions = {}) => {
		const defaultViewport = getDefaultViewport()
		const headless = process.env.NODE_ENV !== 'development'
		app.createPage({ defaultViewport, headless, ...options })
		defer('Close browser', async ({ browser }) => {
			await browser.close()
		})
	},
	login: () => {
		action(async () => {
			await page.setCookie(...COOKIES)
		})
	},
	goto: (url: string) => {
		action(async () => {
			await page.goto(url, { timeout: 10000 })
		})
	},
	click: (selector: string) => {
		action(async () => {
			await page.click(selector)
		})
	},
	clickText: (xPath: string) => {
		action(async () => {
			const element = await page.waitForXPath(xPath, TIMEOUT)
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
			const element = await page.waitForSelector(selector, TIMEOUT)
			await element.uploadFile('./resources/images/square.png')
		})
	},
	waitFor: (selector: string) => {
		action(async () => {
			await page.waitFor(selector, TIMEOUT)
		})
	},
	waitForText: (xPath: string) => {
		action(async () => {
			await page.waitForXPath(xPath, TIMEOUT)
		})
	},
	waitForNetworkIdle: () => {
		action(async () => {
			await waitForNetworkIdle(800, 500)
		})
	},
})
