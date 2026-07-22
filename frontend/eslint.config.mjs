import coreWebVitals from 'eslint-config-next/core-web-vitals';
import typescript from 'eslint-config-next/typescript';

// Flat config (ESLint 9). `next lint` was removed in Next 16, so we invoke the
// ESLint CLI directly. This mirrors the previous
// extends: ["next/core-web-vitals", "next/typescript"] setup.
export default [
    {
        // Node/CommonJS config files legitimately use require(); the old
        // `next lint` never scanned them.
        ignores: ['.next/**', 'node_modules/**', 'next-env.d.ts', '*.config.js']
    },
    ...coreWebVitals,
    ...typescript,
    {
        rules: {
            '@typescript-eslint/no-unused-vars': 'warn',
            '@typescript-eslint/no-explicit-any': 'warn',
            // Advisory: fires on the standard fetch-on-mount pattern (an effect
            // that calls setState after an await). Kept as a warning rather
            // than an error. The stricter React Compiler rules
            // (static-components, immutability) remain at their default error
            // level.
            'react-hooks/set-state-in-effect': 'warn'
        }
    }
];
