import { action, page } from 'proxy'
import { equal, fail } from 'assert'
import { step } from 'prescript'
import { TIMEOUT, waitFor } from 'modules/app/utils'

type Comparison = {
	cb: (received: any, expected: any) => void
	operation: string
}

type Style = 'querySelector' | 'xPath'
type Properties = 'innerHTML' | 'value' | 'href' | 'src' | 'title'

class Expect {
	private selector: string
	private property: Properties
	private expectedStr: string = ''

	constructor(selector: string, property: Properties) {
		this.selector = selector
		this.property = property
	}

	private setStep({ cb, operation }: Comparison) {
		step(
			`Expect '${this.selector}' ${this.property} ${operation} ${
				this.expectedStr
			}`,
			() => {
				action(async () => {
					const element = await waitFor(this.selector)
					const receivedStr = await element
						.getProperty(this.property)
						.then(obj => obj.jsonValue())
					cb(receivedStr, this.expectedStr)
				})
			},
		)
	}

	private setExpectedStr(expectedStr: string) {
		this.expectedStr = expectedStr
	}

	equal(expectedStr: string) {
		this.setExpectedStr(expectedStr)
		this.setStep({
			cb: equal,
			operation: 'equals',
		})
	}

	contain(expectedStr: string) {
		this.setExpectedStr(expectedStr)
		this.setStep({
			cb: (receivedStr: string, expectedStr: string) => {
				if (receivedStr.indexOf(expectedStr) === -1) {
					fail(`${receivedStr} not contains ${expectedStr}`)
				}
			},
			operation: 'contains',
		})
	}

	exist() {
		this.setStep({
			cb: () => {},
			operation: 'exist',
		})
	}
}

export const expect = (selector: string, property: Properties = 'innerHTML') =>
	new Expect(selector, property)

class ExpectAll {
	private selector: string
	private expectedNumber: number = 0

	constructor(selector: string) {
		this.selector = selector
	}

	private setStep({ cb, operation }: Comparison) {
		step(
			`Expect '${this.selector}' ${operation} ${this.expectedNumber}`,
			() => {
				action(async () => {
					await page.waitForSelector(this.selector, TIMEOUT)
					const elements = await page.$$(this.selector)
					cb(elements.length, this.expectedNumber)
				})
			},
		)
	}

	private setexpectedNumber(expectedNumber: number) {
		this.expectedNumber = expectedNumber
	}

	equal(expectedNumber: number) {
		this.setexpectedNumber(expectedNumber)
		this.setStep({
			cb: (receivedNumber: number, expectedNumber: number) =>
				equal(receivedNumber, expectedNumber),
			operation: 'equals',
		})
	}

	moreThan(expectedNumber: number) {
		this.setexpectedNumber(expectedNumber)
		this.setStep({
			cb: (receivedNumber: number, expectedNumber: number) => {
				if (!(receivedNumber > expectedNumber)) {
					fail(`${receivedNumber} not more than ${expectedNumber}`)
				}
			},
			operation: 'more than',
		})
	}

	lessThan(expectedNumber: number) {
		this.setexpectedNumber(expectedNumber)
		this.setStep({
			cb: (receivedNumber: number, expectedNumber: number) => {
				if (!(receivedNumber < expectedNumber)) {
					fail(`${receivedNumber} not less than ${expectedNumber}`)
				}
			},
			operation: 'less than',
		})
	}
}

export const expectAll = (selector: string) => new ExpectAll(selector)
