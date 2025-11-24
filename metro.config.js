const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Force Jotai to resolve to a single instance
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'jotai' || moduleName.startsWith('jotai/')) {
    try {
      return {
        filePath: require.resolve(moduleName, { paths: [__dirname] }),
        type: 'sourceFile',
      };
    } catch (e) {
      // Fallback if resolution fails
      return context.resolveRequest(context, moduleName, platform);
    }
  }
  
  // Default resolution for all other modules
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
