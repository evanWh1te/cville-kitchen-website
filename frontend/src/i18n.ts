import { getRequestConfig } from 'next-intl/server';

export const locales = ['en', 'es', 'fa', 'ps', 'zh'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export default getRequestConfig(async ({ locale }) => {
    // Validate locale; fallback to default
    const normalized = locales.includes(locale as Locale)
        ? (locale as Locale)
        : defaultLocale;

    return {
        locale: normalized,
        messages: (await import(`../messages/${normalized}.json`)).default
    };
});
