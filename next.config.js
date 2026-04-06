/** @type {import('next').NextConfig} */
const repoName = 'linux-ubuntu-26.04-portfolio'
const isProduction = process.env.NODE_ENV === 'production'

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: isProduction ? `/${repoName}` : '',
  assetPrefix: isProduction ? `/${repoName}/` : '/',
}

module.exports = nextConfig
