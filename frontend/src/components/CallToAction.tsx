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

export default function CallToAction() {
    const t = useTranslations('CallToAction');
    const locale = useLocale();
    const prefix = locale === 'en' ? '' : `/${locale}`;
    return (
        <section className="py-16 bg-primary-600">
            <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl sm:text-4xl font-bold text-white font-heading mb-4">
                    {t('title')}
                </h2>
                <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
                    {t('desc')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                    <Link
                        href={`${prefix}/contact`}
                        className="bg-secondary-500 hover:bg-secondary-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 text-center"
                    >
                        {t('join')}
                    </Link>
                    <Link
                        href={`${prefix}/about`}
                        className="border-2 border-white text-white hover:bg-white hover:text-primary-700 font-semibold py-3 px-8 rounded-lg transition-colors duration-200 text-center"
                    >
                        {t('learnMore')}
                    </Link>
                </div>
            </div>
        </section>
    );
}
