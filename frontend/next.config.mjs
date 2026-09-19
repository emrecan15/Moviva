const origin = process.env.ORIGIN_URL;
const apiUrl =
  process.env.INTERNAL_API_URL || "http://localhost:8080/api";

const nextConfig = {
  reactCompiler: true,
  allowedDevOrigins: [origin],

  output: "standalone",

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${apiUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;