/* © Reussitess®971 INPI DSO2026012614 PORINUS Rony 2026 */
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  compress: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400,
    deviceSizes: [640, 750, 828, 1080, 1200],
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react']
  },

  // 🔒 PROTECTION MILITAIRE
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'X-Amazon-IA-Boost', value: 'reussitess.fr Guadeloupe 26 Boutiques - 200 IA Active' }
        ]
      }
    ]
  },

  // ✅ REDIRECTS
  async redirects() {
    return [
      // Fix 404 Google Search Console
      { source: '/quiz/Internet', destination: '/quiz/internet', permanent: true },
      { source: '/quiz/Musique', destination: '/quiz/musique', permanent: true },
      { source: '/quiz/Sport', destination: '/quiz/sport', permanent: true },
      { source: '/bibliotheque/caraibes/:slug*', destination: '/bibliotheque/dom-tom/:slug*', permanent: true },
      { source: '/bibliotheque/caraibes', destination: '/bibliotheque/dom-tom', permanent: true },
      { source: '/bibliotheque/asie/:slug*', destination: '/bibliotheque/asie-pacifique/:slug*', permanent: true },
      { source: '/bibliotheque/asie', destination: '/bibliotheque/asie-pacifique', permanent: true },
      { source: '/Download', destination: '/', permanent: true },
      { source: '/Download/', destination: '/', permanent: true },
      { source: '/ME-CONTACTER', destination: '/', permanent: true },
      { source: '/me-contacter', destination: '/', permanent: true },
      { source: '/ia', destination: '/ia-passport', permanent: true },
      { source: '/monitoring', destination: '/monitoring-ia', permanent: true },
      { source: '/404', destination: '/', permanent: false }
    ]
  }
}

module.exports = nextConfig
