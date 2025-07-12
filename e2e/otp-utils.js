import { by, web } from 'detox'

const WEBHOOK_SITE_URL = 'https://webhook.site/token/9fea86b9-e710-41cc-ae21-d781bfa82fd4'

export function pollEmailsAndInjectInWebview() {
	return startPollForEmails(async email => {
		const bodyElm = web.element(by.web.tag('body'))
		await bodyElm.runScript(
			`(data) => {
				window.emailsRecv ||= [];
				window.emailsRecv.push(data);	
			}`,
			[email]
		);
		console.log('Email received and injected into webview')
	})
}

/**
 * Poll for emails from the webhook site. To be used from NodeJS context.
 */
function startPollForEmails(onEmail) {
	let lastEmailDate = new Date(Date.now() - 1200 * 1000) // start with the last minute
	const pollInterval = setInterval(async () => {
		runPoll()
			.catch(err => {
				console.error('Error while polling for emails:', err)
			})
	}, 5000)

	return {
		cancel() {
			clearInterval(pollInterval)
		}
	}

	async function runPoll() {
		const res = await fetch(
			`${WEBHOOK_SITE_URL}/requests?date_from=${formatDate(lastEmailDate)}`,
			{
				headers: {
					'Content-Type': 'application/json'
				}
			}
		)
		const json = await res.json()
		const data = json?.data
		if (!data) {
			console.error('No data found in the response:', json)
			return
		}

		if (data?.length) {
			console.log(`Found ${data.length} new emails since ${lastEmailDate.toJSON()}`)
		}

		for (const { created_at, content } of data) {
			if (!content) {
				continue
			}

			lastEmailDate = new Date(created_at)
			onEmail(JSON.parse(content))
		}
	}
}

/**
 * Injects "getOtp" function into the window.
 * To be used inside the browser context to extract the OTP from the email content.
 */
// this is stringified as RN converts async fns to generators, which errors
// out in the browser context
export const INJECT_GET_OTP_FN_INTO_WINDOW = `function injectGetOtpFnIntoWindow() {
	window.getOtp = async(email, extract) => {
		const emailsRecv = window.emailsRecv || []
		const now = Date.now()

		let lastEmailIdx = 0
		while (Date.now() - now < 60_000) {
			for (const { text_content: textContent } of emailsRecv.slice(lastEmailIdx)) {
				if (!textContent.includes(email)) {
					continue
				}

				const otp = extract(textContent)
				if (otp) {
					return otp
				}
			}

			lastEmailIdx = emailsRecv.length
			// wait for 5 seconds before checking again
			await new Promise(resolve => setTimeout(resolve, 5000))
		}

		throw new Error('OTP not found within 60 seconds')
	}
}`

// format the date as yyyy-MM-dd HH:mm:ss
function formatDate(date) {
	return date.toISOString().replace('T', ' ').slice(0, 19)
}