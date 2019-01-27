declare function bind<T, U extends any[], V>(
	f: (x: T, ...args: U) => V,
	x: T,
): (...args: U) => V

import * as puppeteer from 'puppeteer'

declare global {
	namespace Prescript {
		interface GlobalState {
			browser: puppeteer.Browser
			page: puppeteer.Page
		}
	}
}
