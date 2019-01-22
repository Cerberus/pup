import * as puppeteer from 'puppeteer'
import { step, action } from 'prescript'

step('Open Browser', () => {
	action(async state => {
		state.browser = await puppeteer.launch()
	})
})

step('goto example.com', () => {
	action(async state => {
		const browser = state.browser as puppeteer.Browser
		const page = await browser.newPage()
		page.goto('http://exammple.com')
		page.screenshot({ path: './assets/example.png' })
		page.close()
	})
})
