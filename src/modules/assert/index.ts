import { action, page } from 'proxy'
import { equal } from 'assert'
import { step } from 'prescript'

type Comparison = {
	cb: (received: any, expected: any) => void
	operation: string
}

type Properties = 'innerHTML' | 'value'

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
					const element = await page.waitForSelector(this.selector, {
						timeout: 5000,
					})
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
		this.setStep({ cb: equal, operation: 'equals' })
	}

	contain(expectedStr: string) {
		this.setExpectedStr(expectedStr)
		this.setStep({
			cb: (receivedStr: string, expectedStr: string) =>
				receivedStr.indexOf(expectedStr) !== -1,
			operation: 'contains',
		})
	}
}

export const expect = (selector: string, property: Properties = 'innerHTML') =>
	new Expect(selector, property)
