import { by, device, element, web, waitFor } from 'detox';
import { setTimeout } from 'timers/promises';
import { pollEmailsAndInjectInWebview } from './otp-utils';
import { injectUtilsIntoWebview } from './utils';
import { PROVIDERS } from './providers';

jest.setTimeout(600_000)

describe('Providers', () => {

    let poll

    beforeAll(async () => {
        await device.launchApp({
            newInstance: true,
            launchArgs: {
                detoxEnableSynchronization: 0
            }
        });
        poll = pollEmailsAndInjectInWebview()
    }); 

    beforeEach(async () => {
        poll.cancel()
        await setTimeout(1000)
        await device.reloadReactNative();
        // or any text you know exists
        await waitFor(element(by.id('input-text')))
            .toBeVisible()
            .withTimeout(10000);
    });

    it.each(PROVIDERS)('should successfully login to $name', async (
        { id: providerId, credentials, login }
    ) => {
        await connectToProvider(providerId);

        // hack to find the webview with the actual website. The other webview
        // is likely the attestor JS script.
        const webMatcher = by.type('android.webkit.WebView').withAncestor(
            by.type(
                'io.flutter.embedding.engine.mutatorsstack.FlutterMutatorView'
            )
        )

        await waitFor(element(webMatcher))
            .toBeVisible()
            .withTimeout(60_000);

        const webview = web(webMatcher)

        console.log('got webview')
        await injectUtilsIntoWebview(webview)

        console.log('utils injected into webview')
        await login(webview, credentials);

        await waitFor(element(by.id('success-text')))
            .toBeVisible()
            .withTimeout(300_000);
    })
});

async function connectToProvider(providerId) {
    await element(by.id('input-text')).replaceText(providerId);
    await element(by.id('submit-button')).tap();
    console.log(`Selected provider with ID: ${providerId}`);
}