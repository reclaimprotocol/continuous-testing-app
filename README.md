# Run
```
npm install
```

```
npm start
```

```
npm run android
```

# Build
## Android
```
$ cd android && ./gradlew clean && cd ..
$ npx detox build --configuration android.emu.debug
```
## iOS
`TODO`

# Test
Launch emulator/simulator/device
```
npm start
```
```
# on a different terminal
npx detox test --configuration android.emu.debug --loglevel verbose
```

# Add tests
edit `e2e/providers.test.js`