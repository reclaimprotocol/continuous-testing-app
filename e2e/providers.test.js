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
        await waitFor(element(by.text('Welcome'))) // or any text you know exists
        .toBeVisible()
        .withTimeout(10000);
        await element(by.id('submit-button')).tap();
    });
});
  