/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  eslint: {
    // ADVERTENCIA: Esto permitirá que tu proyecto se compile incluso si tiene errores de ESLint.
    ignoreDuringBuilds: true,
  },
  // Any other configurations you might have...

  // This is the crucial part for proxying requests:
  async rewrites() {
    return [
      {
        source: '/api/:path*', // Catches requests starting with /api/
        destination: 'https://nextstep-backend-1-0-0.onrender.com/api/:path*', // Forwards them to your Flask backend
      },
    ];
  },
};

module.exports = nextConfig;