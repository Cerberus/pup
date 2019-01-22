import * as puppeteer from 'puppeteer'

export const getBrowser = async (params: puppeteer.ChromeArgOptions = {}) =>
	puppeteer.launch(params)
