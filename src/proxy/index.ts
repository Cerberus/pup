import { step, action as preAction } from 'prescript'
import { ActionFunction } from 'prescript/lib/types'
import * as puppeteer from 'puppeteer'

const toSentenceCase = (camel: string) => {
	const spaceCase = camel.replace(/([A-Z])/g, ' $1')
	const lowerCase = spaceCase
		.split(' ')
		.map(word => word.toLowerCase())
		.join(' ')
	return lowerCase[0].toUpperCase() + lowerCase.slice(1)
}

const handler = {
	get(obj: any, key: any) {
		return (...options: unknown[]) => {
			let stepName = toSentenceCase(key)
			const optNames = options.filter(opt => typeof opt === 'string')
			if (optNames.length > 0) {
				stepName += ` ${optNames.join(' ')}`
			}
			step(stepName, () => obj[key](...options))
			return new Proxy(obj, handler)
		}
	},
}

type Proxify<T> = { [P in keyof T]: T[P] }

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
