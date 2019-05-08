import * as puppeteer from 'puppeteer'

export type Screen = 'mobile' | 'desktop'

export interface LaunchOptions extends puppeteer.LaunchOptions {
	screen: Screen
}

export const COOKIES = [
	['ws', process.env.COOKIE_WS],
	['wtoken', process.env.COOKIE_WTOKEN],
].map(([name = '', value = '']) => ({
	name,
	value,
	domain: process.env.COOKIE_DOMAIN,
}))

export const getDefaultViewport = () => {
	const screen: Screen = (process.env.npm_lifecycle_script as string).includes(
		'mobile',
	)
		? 'mobile'
		: 'desktop'
	switch (screen) {
		case 'mobile':
			return { width: 375, height: 667, isMobile: true }
		case 'desktop':
			return { width: 1024, height: 768, isMobile: false }
	}
}
