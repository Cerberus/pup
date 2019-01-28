declare function bind<T, U extends any[], V>(
	f: (x: T, ...args: U) => V,
	x: T,
): (...args: U) => V

type Proxy<T> = {
	get(): T
	set(value: T): void
}
type Proxify<T> = { [P in keyof T]: Proxy<T[P]> }

import * as puppeteer from 'puppeteer'

declare global {
	namespace Prescript {
		interface GlobalState {
			browser: puppeteer.Browser
			page: puppeteer.Page
		}
	}
}
