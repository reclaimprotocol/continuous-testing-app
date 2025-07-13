import { by } from 'detox';
import { setTimeout } from 'timers/promises'
import { INJECT_GET_OTP_FN_INTO_WINDOW } from './otp-utils.js'

export async function injectUtilsIntoWebview(webview) {
	const bodyElm = await assertWebElement(
		() => webview.element(by.web.tag('body')),
		45_000
	)
	await bodyElm.runScript(_injectUtilsIntoWindow.toString())
	await bodyElm.runScript(INJECT_GET_OTP_FN_INTO_WINDOW)
}

function _injectUtilsIntoWindow() {
	window.delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
	window.simulateTextEntry = (inputField, textToEnter) => {
		inputField.focus();
		inputField.value = ""; 

		for (let i = 0; i < textToEnter.length; i++) {
				var charCode = textToEnter.charCodeAt(i);

				let keydownEvent = new Event('keydown', { keyCode: charCode });
				inputField.dispatchEvent(keydownEvent);

				let keypressEvent = new Event('keypress', { keyCode: charCode });
				inputField.dispatchEvent(keypressEvent);

				inputField.value = inputField.value + textToEnter[i];

				let inputEvent = new Event('input', { bubbles: true });
				inputField.dispatchEvent(inputEvent);

				let keyupEvent = new Event('keyup', { keyCode: charCode });
				inputField.dispatchEvent(keyupEvent);
		}
	}

	window.__injectedUtils = true
}

export async function assertWebElementByCss(webview, cssSelector, timeout = 10_000) {
	return assertWebElement(
		() => webview.element(by.web.cssSelector(cssSelector)),
		timeout
	);
}

export async function assertWebElement(selector, timeout = 10_000) {
		const startTime = Date.now();
		for(;;) {
				try {
						const elem = selector();
						await elem.getText()
						return elem;
				} catch (e) {
						if (Date.now() - startTime > timeout) {
								throw e;
						}
						await setTimeout(500);
				}
		}
}