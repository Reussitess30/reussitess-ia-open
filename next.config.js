/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  
  // Optimisations pour les 200 IA
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react']
  },

  // Headers de sécurité + Amazon Boost
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Amazon-IA-Boost',
            value: 'reussitess.fr Guadeloupe 26 Boutiques - 200 IA Active'
          },
          {
            key: 'X-REUSSITESS-Version',
            value: '1.0.0-200IA'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://*.vercel-scripts.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; font-src 'self' data:; connect-src 'self' https://vercel.live https://*.vercel-scripts.com https://vitals.vercel-insights.com wss://ws-*.pusher.com https://api.anthropic.com https://polygon-rpc.com https://api.polygonscan.com; frame-src 'self' https://vercel.live; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'; upgrade-insecure-requests"
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self), payment=(), usb=(), autoplay=(self), encrypted-media=(self), fullscreen=(self), picture-in-picture=(self)'
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          }
        ]
      }
    ]
  },

  // Redirections
  async redirects() {
    return [
      {
        source: '/ia',
        destination: '/ia-passport',
        permanent: true
      },
      {
        source: '/monitoring',
        destination: '/monitoring-ia',
        permanent: true
      }
    ]
  }
}

module.exports = nextConfig
// 🔒 PROTECTION MILITAIRE - Ajouté
const securityHeaders = [
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-inline' https://vercel.live; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; connect-src 'self' https://polygonscan.com https://api.reussitess.fr wss://ws-*.vercel.com"
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()'
  }
]

module.exports = {
  ...nextConfig,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders
      }
    ]
  },
  // AUTO-FIX 404 + robots.txt SEO international
  async redirects() {
    return [
      { source: '/404', destination: '/', permanent: false },
      { source: '/:lang(en|fr|es|de|it)/:path*', destination: '/:path*' }
    ]
  }
}
