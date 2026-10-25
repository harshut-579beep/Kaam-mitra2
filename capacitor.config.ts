import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.kaammitra.app',
  appName: 'Kaam Mitra',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
