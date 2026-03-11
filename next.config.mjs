/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/casamento',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com'
      }
    ]
  }
};

export default nextConfig;
