import { by, device, element, expect, waitFor } from 'detox';

describe('Providers', () => {
    beforeAll(async () => {
        await device.launchApp({
            newInstance: true,
            launchArgs: {
                detoxEnableSynchronization: 0
            }
        });
        
        // Give the app time to connect to Metro and load the bundle
        await new Promise(resolve => setTimeout(resolve, 5000));
        
    }); 

    beforeEach(async () => {
        await device.reloadReactNative();
    });

    it('should tap open button', async () => {
        // or any text you know exists
        await waitFor(element(by.id('input-text')))
            .toBeVisible()
            .withTimeout(10000);
        await element(by.id('input-text')).replaceText('Hello World');
        await element(by.id('submit-button')).tap();
        await new Promise(resolve => setTimeout(resolve, 10000));
    });
});
  