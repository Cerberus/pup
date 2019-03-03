import * as puppeteer from 'puppeteer'

import { action, page } from 'proxy'
import { equal } from 'assert'
import { step } from 'prescript'

type Selector = string | number
type Query = { selector: string; index: number | null }

const getName = (queries: Query[]) =>
	queries
		.map(({ selector, index }) => `${selector}${index ? `:${index}` : ''}`)
		.join(' → ')

const notEmpty = <T>(value: T | null | undefined): value is T =>
	value !== null && value !== undefined

const getQueries = (...args: Selector[]): Query[] => {
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

const castToElement = (element: any) => <puppeteer.ElementHandle>(<any>element)

const genDebuggingQuery = (queries: Query[]) => {
	process.env.DEBUG &&
		console.log(
			`document${queries.reduce(
				(acc, { index, selector }) =>
					acc.concat(
						`.querySelector${
							index ? `All('${selector}')[${index}]` : `('${selector}')`
						}`,
					),
				'',
			)}`,
		)
}

export const expect = (...args: Selector[]) => ({
	expectedStr: '',
	setExpectedStr(expectedStr: string) {
		this.expectedStr = expectedStr
	},
	setReceiveStr(property: string, comparison: Function) {
		const queries = getQueries(...args)
		step(
			`Expect '${getName(queries)}' ${property} = ${this.expectedStr}`,
			() => {
				genDebuggingQuery(queries)
				action(async () => {
					await page.waitForSelector(queries[0].selector, {
						timeout: 5000,
					})
					const pagePromise = Promise.resolve(castToElement(page))
					const element = await queries.reduce(
						async (elementPromise, { index, selector }) => {
							const element = await elementPromise
							return index
								? (await element.$$(selector))[index]
								: castToElement(element.$(selector))
						},
						pagePromise,
					)
					const receivedStr = await element
						.getProperty(property)
						.then(obj => obj.jsonValue())
					comparison(receivedStr, this.expectedStr)
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
})
