import * as puppeteer from 'puppeteer'

import { action, page } from 'proxy'
import { equal } from 'assert'
import { step } from 'prescript'

type Selector = string | number

const getName = (...args: Selector[]) => args.join(' → ')

function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
	return value !== null && value !== undefined
}

const getSelectors = (...args: Selector[]) => {
	return args
		.map((arg, index) => {
			const nextArg = args[index + 1]
			return typeof arg === 'string'
				? {
						selector: arg,
						index: typeof nextArg === 'number' ? nextArg : null,
				  }
				: undefined
		})
		.filter(notEmpty)
}

export const expect = (...args: Selector[]) => {
	return {
		expectedStr: '',
		receivedStr: '',
		setExpectedStr(expectedStr: string) {
			this.expectedStr = expectedStr
		},
		setReceiveStr(property: string, comparison: Function) {
			const queries = getSelectors(...args)
			step(
				`Expect '${getName(...args)}' ${property} equals ${this.expectedStr}`,
				() => {
					action(async () => {
						await page.waitForSelector(queries[0].selector, {
							timeout: 5000,
						})
						const pagePromise = <Promise<puppeteer.ElementHandle>>(
							(<any>Promise.resolve(page))
						)
						const element = await queries.reduce(
							async (elementPromise, { index, selector }) => {
								const element = await elementPromise
								if (index) {
									return (<puppeteer.ElementHandle[]>(
										(<any>await element.$$(selector))
									))[index]
								}
								return (element.$(selector) as any) as puppeteer.ElementHandle
							},
							pagePromise,
						)
						this.receivedStr = await element
							.getProperty(property)
							.then(obj => obj.jsonValue())
						comparison(this.receivedStr, this.expectedStr)
					})
				},
			)
		},
		equal(expectedStr: string) {
			this.setExpectedStr(expectedStr)
			this.setReceiveStr('innerHTML', equal)
		},
		valueEqual(expectedStr: string) {
			this.setExpectedStr(expectedStr)
			this.setReceiveStr('value', equal)
		},
	}
}
