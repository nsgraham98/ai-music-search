/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Exclude server-only modules from client bundle
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        http2: false,
        child_process: false,
        os: false,
        crypto: false,
      };
    }
    return config;
  },
  serverExternalPackages: [
    'firebase-admin'
  ]
};

export default nextConfig;
