import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV || 'development',
  release: process.env.NEXT_PUBLIC_APP_VERSION || '0.1.0',
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: process.env.NODE_ENV === 'production' ? 0.5 : 1.0,
  enabled:
    process.env.NODE_ENV === 'production' ||
    (!!process.env.NEXT_PUBLIC_SENTRY_DSN && process.env.NODE_ENV === 'development'),
  ignoreErrors: [
    'ResizeObserver loop',
    'Non-Error promise rejection captured',
    'NetworkError',
    'AbortError',
  ],
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
