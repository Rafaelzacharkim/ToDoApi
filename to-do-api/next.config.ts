/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://localhost:5001/:path*',
      },
    ];
  },
};
module.exports = nextConfig;
