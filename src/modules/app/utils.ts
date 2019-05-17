import * as puppeteer from 'puppeteer'
import { page } from 'proxy'

export type Screen = 'mobile' | 'desktop'

export interface LaunchOptions extends puppeteer.LaunchOptions {}

export const TIMEOUT = {
	timeout: process.env.NODE_ENV === 'development' ? 5000 : 15000,
}

export const COOKIES = [
	['ws', process.env.COOKIE_WS],
	['wtoken', process.env.COOKIE_WTOKEN],
].map(([name = '', value = '']) => ({
	name,
	value,
	domain: process.env.COOKIE_DOMAIN,
}))

export const getInfo = (str: string) => {
	return {
		device: (str.match(/([^/]+).js/i) || [])[1],
		name: (str.match(/([^/]+)\/([^/]+).js/i) || [])[1],
		squad: (str.match(/([^/]+)\/([^/]+)\/([^/]+).js/i) || [])[1],
	}
}

export const getDefaultViewport = () => {
	const { device } = getInfo(process.env.npm_lifecycle_script as string)
	switch (device) {
		case 'mobile':
			return { width: 375, height: 667, isMobile: true }
		case 'desktop':
			return { width: 1024, height: 768, isMobile: false }
	}
}

export const waitForNetworkIdle = (
	timeout: number,
	maxInflightRequests = 0,
) => {
	const getInflight = () => reqCount - resCount

	const onTimeoutDone = () => {
		page.removeListener('request', onRequestStarted)
		page.removeListener('requestfinished', onRequestFinished)
		page.removeListener('requestfailed', onRequestFinished)
		fulfill()
	}

	const onRequestStarted = () => {
		reqCount += 1
		if (getInflight() > maxInflightRequests) clearTimeout(timeoutId)
	}

	const onRequestFinished = () => {
		if (getInflight() === 0) return
		resCount += 1
		if (getInflight() === maxInflightRequests) {
			timeoutId = setTimeout(onTimeoutDone, timeout)
		}
	}

	page.on('request', onRequestStarted)
	page.on('requestfinished', onRequestFinished)
	page.on('requestfailed', onRequestFinished)

	let reqCount = 0
	let resCount = 0
	let fulfill: Function
	const promise = new Promise(x => (fulfill = x))
	let timeoutId = setTimeout(onTimeoutDone, timeout)
	return promise
}

export const waitFor = async (selector: string) =>
	selector.startsWith('//')
		? page.waitForXPath(selector, TIMEOUT)
		: page.waitForSelector(selector, TIMEOUT)
