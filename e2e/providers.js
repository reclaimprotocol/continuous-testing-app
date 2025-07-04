import { web } from "detox"
import { setTimeout } from "timers/promises"
import { assertWebElementByCss } from "./utils"

export const PROVIDERS = [
	{
		name: 'Ryanair',
		id: 'af8e5472-6f5a-43f8-b4f5-2a198228e98b',
		credentials: {
			email: 'delta3@otp-mails.reclaimprotocol.org',
			password: 'Prov!der@25RP'
		},
		async login({ email, password }) {
			const cookieAcceptBtn = await assertWebElementByCss(
				web(),
				'button[data-ref="cookie.accept-all"]',
				60_000
			)
			await cookieAcceptBtn.tap()

			console.log('cookie accept button tapped')

			// waiting a bit as the page may reload
			await setTimeout(5000)

			const iframeElem = await assertWebElementByCss(
				web(),
				'iframe[data-ref="kyc-iframe"]'
			)

			console.log('iframe element found')

			await simulateTextEntryOnIframeElem('input[name="email"]', email)

			await simulateTextEntryOnIframeElem('input[name="password"]', password)

			console.log('entered email and password')

			await iframeElem.runScript(
				`(iframeElem, cssSelector) => (
						iframeElem.contentDocument.querySelector(cssSelector).click()
				)`,
				['button[type="submit"]']
			)

			console.log('submit button clicked')

			async function simulateTextEntryOnIframeElem(
					cssSelector,
					textToEnter
			) {
					await iframeElem.runScript(
							`(iframeElem, cssSelector, textToEnter) => (
									simulateTextEntry(
											iframeElem.contentDocument.querySelector(cssSelector),
											textToEnter
									)
							)`,
							[cssSelector, textToEnter]
					)
			}
		}
	}
]