import type { NextConfig } from 'next';
import { withSentryConfig } from '@sentry/nextjs/config';
import { env } from './src/config/env';

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    qualities: [75, 90],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  // Keep Pino (and pretty transport) out of the server bundle — required for worker transports.
  serverExternalPackages: ['pino', 'pino-pretty'],
  // Allows dev server assets and HMR through the tunnel
  allowedDevOrigins: [
    'localhost:3000',
    '127.0.0.1:3000',
    '4tkx41p8-3000.asse.devtunnels.ms',
    '*.devtunnels.ms',
    '*.asse.devtunnels.ms',
    '**.devtunnels.ms',
  ],
  // Allows Server Actions POST requests through the tunnel
  experimental: {
    serverActions: {
      allowedOrigins: [
        'localhost:3000',
        '127.0.0.1:3000',
        '4tkx41p8-3000.asse.devtunnels.ms',
        '*.devtunnels.ms',
        '*.asse.devtunnels.ms',
        '**.devtunnels.ms',
      ],
    },
  },
};

export default withSentryConfig(nextConfig, {
  org: env.SENTRY_ORG,
  project: env.SENTRY_PROJECT,
  authToken: env.SENTRY_AUTH_TOKEN,
  silent: !env.CI,
  widenClientFileUpload: true,
  tunnelRoute: '/monitoring',

  // Sentry options specific to Webpack (silences Turbopack deprecation warnings)
  webpack: {
    reactComponentAnnotation: {
      enabled: true,
    },
    automaticVercelMonitors: true,
  },
});
