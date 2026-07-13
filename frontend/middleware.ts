import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './src/i18n';

export default createMiddleware({
    locales,
    defaultLocale,
    localePrefix: 'as-needed'
});

export const config = {
    matcher: [
        '/',
        '/(en|es|fa|ps|zh)/:path*',
        '/((?!_next|api|.*.|favicon.ico).*)'
    ]
};
