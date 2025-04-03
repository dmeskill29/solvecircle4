declare module 'next-pwa' {
  import { NextConfig } from 'next';
  
  interface RuntimeCaching {
    urlPattern: RegExp | string;
    handler: string;
    options?: {
      cacheName?: string;
      expiration?: {
        maxEntries?: number;
        maxAgeSeconds?: number;
      };
      networkTimeoutSeconds?: number;
      cachableResponse?: {
        statuses: number[];
      };
    };
  }

  interface PWAConfig {
    dest?: string;
    disable?: boolean;
    register?: boolean;
    scope?: string;
    sw?: string;
    skipWaiting?: boolean;
    runtimeCaching?: RuntimeCaching[];
    buildExcludes?: (string | RegExp)[];
    fallbacks?: {
      document?: string;
      [key: string]: string | undefined;
    };
    cacheOnFrontEndNav?: boolean;
    reloadOnOnline?: boolean;
    publicExcludes?: string[];
  }

  function withPWA(config: PWAConfig): (nextConfig: NextConfig) => NextConfig;
  export default withPWA;
} 