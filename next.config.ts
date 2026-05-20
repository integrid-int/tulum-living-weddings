import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/home",
        destination: "/",
        permanent: true
      },
      {
        source: "/home/index",
        destination: "/",
        permanent: true
      },
      {
        source: "/home/:path*",
        destination: "/:path*",
        permanent: true
      }
    ];
  }
};

export default nextConfig;
