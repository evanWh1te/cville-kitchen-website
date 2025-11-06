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
        <footer className="bg-accent-900 border-t-4 border-primary-600">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <Link
                            href="/"
                            className="group flex items-center space-x-1 hover:opacity-90 transition-opacity"
                        >
                            <span className="text-xl font-light text-white tracking-wide">
                                Charlottesville
                            </span>
                            <span className="text-2xl font-bold text-white tracking-tight">
                                Kitchen
                            </span>
                        </Link>
                        <p className="mt-4 text-accent-300 text-sm">
                            Building revolutionary community through mutual aid,
                            solidarity, and collective liberation.
                        </p>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-primary-700">
                    <div className="md:flex md:items-center md:justify-between">
                        <div className="flex space-x-6 md:order-2">
                            <Link
                                href="/privacy"
                                className="text-accent-400 hover:text-secondary-300 text-sm transition-colors"
                            >
                                Privacy Policy
                            </Link>
                            <Link
                                href="/terms"
                                className="text-accent-400 hover:text-secondary-300 text-sm transition-colors"
                            >
                                Terms of Service
                            </Link>
                        </div>
                        <p className="mt-4 md:mt-0 md:order-1 text-gray-400 text-sm">
                            &copy; 2025 Charlottesville Kitchen. Built with ❤️
                            for community.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
