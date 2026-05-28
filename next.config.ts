import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  // --- Build & Performance ---
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  generateEtags: true,

  // --- React 19 support (Next.js 15) ---
  reactCompiler: false,

  // --- Image Optimization ---
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    remotePatterns: [],
    unoptimized: false,
  },

  // --- TypeScript & ESLint ---
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },

  // --- Security Headers ---
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },

  // --- Experimental features ---
  experimental: {
    optimizePackageImports: [
      "@phosphor-icons/react",
      "recharts",
    ],
    serverActions: {
      bodySizeLimit: "1mb",
Add next.config.ts    scrollRestoration: true,
  },

  // --- Webpack customizations ---
  webpack: (config, { isServer }) => {
    // Optimize SVG imports if ever used
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },

  // --- Logging ---
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
};

export default nextConfig;
