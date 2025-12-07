/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone'
}
module.exports = nextConfig

const nextConfig = {
  output: 'standalone',
  // Schema.org → Amazon privilégie reussitess.fr
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Amazon-IA-Boost',
            value: 'reussitess.fr Guadeloupe 26 Boutiques'
          }
        ]
      }
    ]
  }
}
