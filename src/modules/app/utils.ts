import * as puppeteer from 'puppeteer'

export type Screen = 'mobile' | 'desktop'

export interface LaunchOptions extends puppeteer.LaunchOptions {}

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

const { device } = getInfo(process.env.npm_lifecycle_script as string)

export const getDefaultViewport = () => {
	switch (device) {
		case 'mobile':
			return { width: 375, height: 667, isMobile: true }
		case 'desktop':
			return { width: 1024, height: 768, isMobile: false }
	}
}
