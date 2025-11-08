/*
 * Charlottesville Kitchen - Mutual Aid Organization Website
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

import './globals.css';
import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';

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
    title: 'Charlottesville Kitchen - Community Mutual Aid',
    description:
        'Building community resilience through mutual aid and solidarity. Join us in creating a more equitable world.',
    keywords: [
        'mutual aid',
        'community',
        'solidarity',
        'social justice',
        'das kitchen'
    ],
    authors: [{ name: 'Charlottesville Kitchen Organization' }],
    openGraph: {
        title: 'Charlottesville Kitchen - Community Mutual Aid',
        description:
            'Building community resilience through mutual aid and solidarity.',
        type: 'website',
        locale: 'en_US'
    }
};

export default function RootLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
            <body className="min-h-screen bg-white text-gray-900 antialiased flex flex-col">
                {children}
            </body>
        </html>
    );
}
