import * as puppeteer from 'puppeteer'

declare global {
	namespace Prescript {
		interface GlobalState {
			browser: puppeteer.Browser
			page: puppeteer.Page
			context: puppeteer.BrowserContext
		}
	}
	type ArgumentTypes<T> = T extends (...args: infer U) => infer R ? U : never
	type ReplaceReturnType<T, TNewReturn> = (...a: ArgumentTypes<T>) => TNewReturn
	type Proxify<T> = { [P in keyof T]: ReplaceReturnType<T[P], Proxify<T>> }
}
