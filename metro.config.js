const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Add resolver configuration for better compatibility
config.resolver.platforms = ['ios', 'android', 'native', 'web'];
config.resolver.sourceExts = ['js', 'jsx', 'json', 'ts', 'tsx', 'cjs'];

module.exports = withNativeWind(config, {
    input: './app/globals.css',
    // Disable CSS interop for build compatibility
    experimentalNativeWind: true
});