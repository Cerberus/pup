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

const getStepName = (key: string, options: unknown[]) =>
	[toSentenceCase(key), ...options.filter(opt => typeof opt === 'string')].join(
		' ',
	)

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
