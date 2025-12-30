interface DirectiveMap {
  [key: string]: string[]
}

interface CSPPolicyConfig {
  directives: DirectiveMap
  generateHeaderString: (directives?: DirectiveMap) => string
  generateMetaContent: (directives?: DirectiveMap) => string
}

export const CSP_POLICY: CSPPolicyConfig = {
  directives: {
    'default-src': ["'self'"],

    'script-src': ["'self'", "'wasm-unsafe-eval'"],

    'style-src': ["'self'", "'unsafe-inline'"],

    'img-src': ["'self'", 'data:', 'blob:'],

    'media-src': ["'self'"],

    'font-src': ["'self'"],

    'connect-src': [
      "'self'",
      'https://cognito-idp.us-east-1.amazonaws.com',
      'https://amplifyauth.us-east-1.amplifyapp.com',
      'https://api.us-east-1.amplifyapp.com',
      'https://*.cloudfront.net', // Keep wildcard for CloudFront distributions
      'https://*.s3.amazonaws.com', // Keep wildcard for S3 buckets
      'wss://websocket.amplifyauth.us-east-1.amplifyapp.com',
    ],

    'frame-ancestors': ["'self'"],

    'object-src': ["'none'"],

    'base-uri': ["'self'"],

    'form-action': ["'self'"],

    'upgrade-insecure-requests': [],

    'frame-src': ["'none'"],

    'camera': ["'none'"],

    'microphone': ["'none'"],
  },

  generateHeaderString: (directives): string => {
    const directivesToUse = directives || CSP_POLICY.directives
    return Object.entries(directivesToUse)
      .filter(([, values]) => Array.isArray(values) && values.length > 0)
      .map(([key, values]) => {
        const valueString = Array.isArray(values) ? values.join(' ') : values
        return `${key} ${valueString}`.trim()
      })
      .join('; ')
  },

  generateMetaContent: (directives): string => {
    // Meta tags have limitations: some directives are not supported
    // frame-ancestors, upgrade-insecure-requests, etc. must be in headers only
    const directivesToUse = directives || CSP_POLICY.directives
    const metaDirectives: DirectiveMap = {
      'default-src': directivesToUse['default-src'],
      'script-src': directivesToUse['script-src'],
      'style-src': directivesToUse['style-src'],
      'img-src': directivesToUse['img-src'],
      'connect-src': directivesToUse['connect-src'],
      'object-src': directivesToUse['object-src'],
      'base-uri': directivesToUse['base-uri'],
      'form-action': directivesToUse['form-action'],
      'font-src': directivesToUse['font-src'],
      'media-src': directivesToUse['media-src'],
    }

    return CSP_POLICY.generateHeaderString(metaDirectives)
  },
}

export const SECURITY_HEADERS = {
  'X-Frame-Options': 'SAMEORIGIN',

  'X-Content-Type-Options': 'nosniff',

  'X-XSS-Protection': '1; mode=block',

  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',

  'Referrer-Policy': 'strict-origin-when-cross-origin',

  'Permissions-Policy':
    'camera=(self), microphone=(self), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()',
}

export const getCSPPolicy = (isDevelopment: boolean): DirectiveMap => {
  if (isDevelopment) {
    // Development: Permite localhost, HMR, e ferramentas dev
    return {
      'default-src': ["'self'", 'http://localhost:*', 'http://127.0.0.1:*'],

      'script-src': [
        "'self'",
        "'unsafe-inline'", // Necessário para Vite script inline
        "'unsafe-eval'", // Necessário para Vite HMR
        "'wasm-unsafe-eval'", // AWS SDK
        'http://localhost:*',
        'http://127.0.0.1:*',
      ],

      'style-src': ["'self'", "'unsafe-inline'", 'http://localhost:*', 'http://127.0.0.1:*'],

      'img-src': ["'self'", 'data:', 'blob:', 'http://localhost:*', 'http://127.0.0.1:*'],

      'media-src': ["'self'", 'http://localhost:*', 'http://127.0.0.1:*'],

      'font-src': ["'self'", 'http://localhost:*', 'http://127.0.0.1:*'],

      'connect-src': [
        "'self'",
        'ws://localhost:*', // Vite WebSocket HMR
        'ws://127.0.0.1:*',
        'wss://localhost:*',
        'wss://127.0.0.1:*',
        'http://localhost:*', // Dev API calls
        'http://127.0.0.1:*',
        'https://cognito-idp.*.amazonaws.com',
        'https://amplifyauth.*.amazonaws.com',
        'https://api.*.amplifyapp.com',
        'https://*.cloudfront.net',
        'https://*.amazonaws.com',
        'https://*.s3.amazonaws.com',
        'wss://*.amazonaws.com',
      ],

      'frame-ancestors': ["'self'"],

      'object-src': ["'none'"],

      'base-uri': ["'self'"],

      'form-action': ["'self'"],

      'frame-src': ["'none'"],

      'camera': ["'none'"],

      'microphone': ["'none'"],
    }
  }

  // Production: Máxima segurança, sem localhost
  return CSP_POLICY.directives
}
