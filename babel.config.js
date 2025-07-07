module.exports = {
  presets: [
    // using this preset to disable async/await transformations
    // as async/await is supported natively in React Native
    // and async/await transformations cause issues Detox testing
    ["@babel/preset-env", {
      "exclude": [
        "transform-regenerator",
        "@babel/plugin-transform-async-to-generator",
        "@babel/plugin-transform-async-generator-functions"
      ]
   }]
  ],
  plugins: [
    ['module:react-native-dotenv', {
      moduleName: '@env',
      path: '.env',
      blacklist: null,
      whitelist: null,
      safe: false,
      allowUndefined: true,
    }],
  ],
};
