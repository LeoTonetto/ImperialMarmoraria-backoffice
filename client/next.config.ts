import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/backoffice",

  async rewrites() {
    return [
      {
        source: "/backoffice/api/:path*", // importante incluir o basePath
        destination: "http://localhost:7237/:path*", // sua API .NET
      },
    ];
  },
};

export default nextConfig;