/** @type {import('next').NextConfig} */
const origin = process.env.ORIGIN_URL;
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  allowedDevOrigins: [origin],

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8080/api/:path*",
      },
    ];
  },
};

export default nextConfig;
