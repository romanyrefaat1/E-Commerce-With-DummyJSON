/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "fakestoreapi.com",
      "i.pravatar.cc",
      "img.daisyui.com",
      "cdn.dummyjson.com",
    ], // Allow images from fakestoreapi.com
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARNING !! This allows production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
