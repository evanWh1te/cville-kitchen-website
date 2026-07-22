const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: false
    },
    eslint: {
        ignoreDuringBuilds: true
    },
    images: {
        remotePatterns: [{ protocol: 'http', hostname: 'localhost' }]
    },
    // Enable standalone build for Docker
    output: 'standalone',
    // Include the monorepo root when tracing files for the standalone build
    outputFileTracingRoot: path.join(__dirname, '../')
};

module.exports = nextConfig;
