/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['chromosomal-kirstin-staidly.ngrok-free.dev'],
  experimental: {
    serverActions: {
      allowedOrigins: ['chromosomal-kirstin-staidly.ngrok-free.dev']
    }
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'https://chromosomal-kirstin-staidly.ngrok-free.dev' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
          { key: 'Access-Control-Allow-Credentials', value: 'true' }
        ]
      }
    ]
  }
};

export default nextConfig;
