import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   devIndicators: false
//   /* config options here */
// };
/**** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  reactStrictMode: true,
  images: {
    domains: ['static.vecteezy.com'],
  },
  
  // ...other config
}

// module.exports = nextConfig
export default nextConfig;
