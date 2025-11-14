'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { locales, defaultLocale } from '@/i18n';

const labels: Record<string, string> = {
    en: 'EN',
    es: 'ES',
    fa: 'دری',
    ps: 'پښتو',
    zh: '中文'
};

export default function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const setLocale = (next: string) => {
        if (next === locale) return;
        const segments = pathname.split('/').filter(Boolean);
        let rest = segments;
        if (segments.length > 0 && locales.includes(segments[0] as any)) {
            rest = segments.slice(1);
        }
        const nextPath =
            `/${next === defaultLocale ? '' : next}${
                rest.length ? '/' + rest.join('/') : ''
            }` || '/';
        router.push(nextPath);
    };

    return (
        <div className="flex items-center gap-2">
            {locales.map((l) => (
                <button
                    key={l}
                    type="button"
                    onClick={() => setLocale(l)}
                    className={`px-2 py-1 text-sm rounded ${
                        l === locale
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    {labels[l]}
                </button>
            ))}
        </div>
    );
}
