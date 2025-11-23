const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Force Jotai to resolve to a single instance
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'jotai' || moduleName.startsWith('jotai/')) {
    return {
      filePath: path.resolve(__dirname, 'node_modules', moduleName),
      type: 'sourceFile',
    };
  }
  
  // Default resolution for all other modules
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
