const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Enable package exports and require context for better module resolution and modern JS syntax handling
config.resolver.unstable_enablePackageExports = true;
config.transformer.unstable_allowRequireContext = true;

module.exports = config;