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

export default function Footer() {
    return (
        <footer className="bg-gray-900">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <Link
                            href="/"
                            className="text-2xl font-bold text-white font-heading"
                        >
                            CVille Kitchen
                        </Link>
                        <p className="mt-4 text-gray-300 text-sm">
                            Building community resilience through mutual aid,
                            solidarity, and collective care.
                        </p>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-700">
                    <div className="md:flex md:items-center md:justify-between">
                        <div className="flex space-x-6 md:order-2">
                            <Link
                                href="/privacy"
                                className="text-gray-400 hover:text-white text-sm"
                            >
                                Privacy Policy
                            </Link>
                            <Link
                                href="/terms"
                                className="text-gray-400 hover:text-white text-sm"
                            >
                                Terms of Service
                            </Link>
                        </div>
                        <p className="mt-4 md:mt-0 md:order-1 text-gray-400 text-sm">
                            &copy; 2025 CVille Kitchen. Built with ❤️ for
                            community.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
