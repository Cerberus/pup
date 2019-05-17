import { step, action as preAction } from 'prescript'
import { ActionFunction } from 'prescript/lib/types'
import * as puppeteer from 'puppeteer'
import { getStepName } from './naming'
import { waitForNetworkIdle } from 'modules/app/utils'

require('source-map-support').install()

let keyIndex = -1
const idleWaits: boolean[] = []
export const pushIdle = (shouldWait: boolean) => {
	keyIndex += 1
	idleWaits.push(shouldWait)
}

const handler = {
	get(obj: any, key: string) {
		return (...options: unknown[]) => {
			pushIdle(key === 'waitForNetworkIdle')
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

export const action = (f: ActionFunction) => {
	const index = keyIndex
	preAction(async (state, context) => {
		browser = state.browser
		page = state.page
		state.netPromise = idleWaits[index]
			? waitForNetworkIdle(1000)
			: Promise.resolve()
		return f(state, context)
	})
}
