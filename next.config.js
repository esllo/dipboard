/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  output: 'export',
  distDir: 'dist',
  trailingSlash: true,
  productionBrowserSourceMaps: true,
}

module.exports = nextConfig
