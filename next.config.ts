import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  devIndicators: false, reactStrictMode: true,
  images: {
    domains: ["static.vecteezy.com"],
    unoptimized: true, 
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
