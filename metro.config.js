const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

/** @type {import('@react-native/metro-config').MetroConfig} */
const customConfig = {
  transformer: {
    // keep everything Metro already sets up
    ...defaultConfig.transformer,
    // plus SVG transformer
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    // again, start from defaults
    ...defaultConfig.resolver,
    assetExts: defaultConfig.resolver.assetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...defaultConfig.resolver.sourceExts, 'svg'],
    // tamagui stub modules
    extraNodeModules: {
      ...(defaultConfig.resolver.extraNodeModules || {}),
      tamagui: path.resolve(__dirname, 'src/tamagui-stub.tsx'),
      '@tamagui/core': path.resolve(__dirname, 'src/tamagui-stub.tsx'),
    },
  },
};

module.exports = mergeConfig(defaultConfig, customConfig);
