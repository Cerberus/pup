import * as puppeteer from 'puppeteer'

export type Screen = 'mobile' | 'desktop'

export interface LaunchOptions extends puppeteer.LaunchOptions {
	screen: Screen
}
