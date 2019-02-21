import { proxify, action, page } from '../proxy'
import { equal } from 'assert'

export const google = proxify({
	isFirstTitle: (expectTitle: string) => {
		action(async () => {
			const titleEle = await page.waitForSelector('#search h3', {
				timeout: 5000,
			})
			const textHandle = await titleEle.getProperty('innerHTML')
			const title = await textHandle.jsonValue()
			equal(title, expectTitle)
		})
	},
})
