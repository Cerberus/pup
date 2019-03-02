import { step, action as preAction } from 'prescript'
import { ActionFunction } from 'prescript/lib/types'
import * as puppeteer from 'puppeteer'
import { getStepName } from './naming'

require('source-map-support').install()

const handler = {
	get(obj: any, key: string) {
		return (...options: unknown[]) => {
			const stepName = getStepName(key, options)
			step(stepName, () => obj[key](...options))
			return new Proxy(obj, handler)
		}
	},
}

export function proxify<T>(o: T): Proxify<T> {
	return new Proxy(o, handler)
}

export let browser: puppeteer.Browser
export let page: puppeteer.Page

export const action = (f: ActionFunction) =>
	preAction(async (state, context) => {
		browser = state.browser
		page = state.page
		return f(state, context)
	})
