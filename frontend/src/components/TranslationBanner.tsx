'use client';

import { useLocale, useTranslations } from 'next-intl';

export default function TranslationBanner() {
    const locale = useLocale();
    const t = useTranslations('Common');

    if (locale === 'en') return null;

    return (
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="my-4 rounded-md border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">
                {t('notranslateBanner')}
            </div>
        </div>
    );
}
