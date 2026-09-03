module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: 'react-native-dotenv',
        path: '.env',
        blocklist: null,
        allowlist: ['PRODUCTION', 'STAGING', 'BASE_URL'],
        safe: false,
        allowUndefined: true,
      },
    ],
    // Reanimated plugin MUST be last
    'react-native-reanimated/plugin',
  ],
};
