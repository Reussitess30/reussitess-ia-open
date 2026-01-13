/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  
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

  // ✅ REDIRECTS CORRIGÉS (permanent: true/false obligatoire)
  async redirects() {
    return [
      {
        source: '/ia',
        destination: '/ia-passport',
        permanent: true  // ✅ 308 Permanent
      },
      {
        source: '/monitoring',
        destination: '/monitoring-ia', 
        permanent: true  // ✅ 308 Permanent
      },
      {
        source: '/404',
        destination: '/',
        permanent: false  // ✅ 307 Temporary
      }
      // ✅ SUPPRIMÉ : redirection multilangue buggée
    ]
  }
}

module.exports = nextConfig
