import '../globals.css';
import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { locales, defaultLocale } from '@/i18n';
import { AuthProvider } from '@/contexts/AuthContext';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter'
});

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    variable: '--font-poppins'
});

export const metadata: Metadata = {
    icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon-16x16.png',
        apple: '/apple-touch-icon.png'
    }
};

export default async function LocaleLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: { locale: string };
}) {
    const { locale } = params;
    if (!locales.includes(locale as any)) {
        notFound();
    }

    const messages = (await import(`../../../messages/${locale}.json`)).default;

    const dir = ['fa', 'ps'].includes(locale) ? 'rtl' : 'ltr';

    return (
        <html
            lang={locale}
            dir={dir}
            className={`${inter.variable} ${poppins.variable}`}
        >
            <head>
                <meta name="google" content="notranslate" />
                {locales.map((l) => {
                    const href = l === defaultLocale ? '/' : `/${l}`;
                    return (
                        <link
                            key={l}
                            rel="alternate"
                            hrefLang={l}
                            href={href}
                        />
                    );
                })}
                <link rel="alternate" hrefLang="x-default" href="/" />
            </head>
            <body className="min-h-screen bg-white text-gray-900 antialiased flex flex-col">
                <NextIntlClientProvider
                    locale={locale}
                    messages={messages}
                    timeZone="UTC"
                >
                    <AuthProvider>{children}</AuthProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
