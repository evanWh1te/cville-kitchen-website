/*
 * Das Kitchen - Mutual Aid Organization Website
 * Copyright (C) 2025 Evan White
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';

export default function Hero() {
    const t = useTranslations('HomePage');
    const locale = useLocale();
    const prefix = locale === 'en' ? '' : `/${locale}`;
    return (
        <section className="bg-white py-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                    {t('title')}
                </h1>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                    {t('tagline')}
                </p>
                <p className="text-lg text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
                    {t('p1')}
                </p>
                <p className="text-lg text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
                    {t('p2')}
                </p>
                <p className="text-lg text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
                    {t('p3')}
                </p>
                <div className="space-y-4 sm:space-y-0 sm:flex sm:gap-4 sm:justify-center">
                    <Link
                        href={`${prefix}/resources`}
                        className="block sm:inline-block bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded transition-colors shadow-lg"
                    >
                        {t('ctaResources')}
                    </Link>
                    <Link
                        href={`${prefix}/education`}
                        className="block sm:inline-block bg-secondary-500 hover:bg-secondary-600 text-accent-900 font-medium py-3 px-6 rounded transition-colors shadow-lg"
                    >
                        {t('ctaEducation')}
                    </Link>
                </div>
            </div>
        </section>
    );
}
