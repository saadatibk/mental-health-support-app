export default {
    name: 'Mental Health Companion',
    slug: 'mental-health-companion',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/app-icon.png',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff'
    },
    updates: {
      fallbackToCacheTimeout: 0
    },
    assetBundlePatterns: [
      '**/*'
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.yourcompany.mentalhealthcompanion'
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#FFFFFF'
      },
      package: 'com.yourcompany.mentalhealthcompanion'
    },
    web: {
      favicon: './assets/favicon.png'
    },
    extra: {
      eas: {
        projectId: "your-project-id-here"
      }
    }
  };
