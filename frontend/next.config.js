/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: false
    },
    // Fully static site: `next build` writes plain HTML/CSS/JS to out/
    output: 'export'
};

module.exports = nextConfig;
