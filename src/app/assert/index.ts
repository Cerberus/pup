import * as puppeteer from 'puppeteer'

import { action, page } from 'proxy'
import { equal } from 'assert'
import { step } from 'prescript'

type Comparison = {
	cb: (received: any, expected: any) => void
	operation: string
}

class Expect {
	private selector: string
	private expectedStr: string = ''

	constructor(selector: string) {
		this.selector = selector
	}

	private setStep(property: string, { cb, operation }: Comparison) {
		step(
			`Expect '${this.selector}' ${property} ${operation} ${this.expectedStr}`,
			() => {
				action(async () => {
					const element = await page.waitForSelector(this.selector, {
						timeout: 5000,
					})
					const receivedStr = await element
						.getProperty(property)
						.then(obj => obj.jsonValue())
					cb(receivedStr, this.expectedStr)
				})
			},
		)
	}

	private setExpectedStr(expectedStr: string) {
		this.expectedStr = expectedStr
	}

	private equalIn(property: string) {
		this.setStep(property, { cb: equal, operation: '=' })
	}

	private containIn(property: string) {
		this.setStep(property, {
			cb: (receivedStr: string, expectedStr: string) =>
				receivedStr.indexOf(expectedStr) !== -1,
			operation: 'contains',
		})
	}

	equal(expectedStr: string) {
		this.setExpectedStr(expectedStr)
		this.equalIn('innerHTML')
	}

	valueEqual(expectedStr: string) {
		this.setExpectedStr(expectedStr)
		this.equalIn('value')
	}

	contain(expectedStr: string) {
		this.setExpectedStr(expectedStr)
		this.containIn('innerHTML')
	}
}

export const expect = (selector: string) => new Expect(selector)
