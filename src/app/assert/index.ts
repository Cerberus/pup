import * as puppeteer from 'puppeteer'

import { action, page } from 'proxy'
import { equal } from 'assert'
import { step } from 'prescript'

const getValue = async (element: puppeteer.ElementHandle, property: string) =>
	element.getProperty(property).then(obj => obj.jsonValue())

export const expect = (selector: string) => ({
	expectedStr: '',
	receivedStr: '',
	setExpectedStr(expectedStr: string) {
		this.expectedStr = expectedStr
	},
	setReceiveStr(property: string, comparison: Function) {
		step(`Expect '${selector}' ${property} equals ${this.expectedStr}`, () => {
			action(async () => {
				const element = await page.waitForSelector(selector, {
					timeout: 5000,
				})
				this.receivedStr = await getValue(element, property)
				comparison(this.receivedStr, this.expectedStr)
			})
		})
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
