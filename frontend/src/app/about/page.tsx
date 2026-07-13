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

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'About - Das Kitchen',
    description:
        "Learn about Das Kitchen's mission, values, and commitment to mutual aid and community solidarity."
};

export default function AboutPage() {
    return (
        <>
            <Header />
            <main className="flex-1">
                <section className="py-16 bg-accent-50">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6">
                        <div className="text-center mb-12">
                            <h1 className="text-4xl font-bold text-primary-700 font-heading mb-4">
                                About Das Kitchen
                            </h1>
                            <p className="text-xl text-accent-700 max-w-3xl mx-auto">
                                Building revolutionary community through mutual
                                aid, solidarity, and collective liberation.
                            </p>
                        </div>

                        <div className="prose prose-lg max-w-none">
                            <div className="grid md:grid-cols-2 gap-12 mb-12">
                                <div>
                                    <h2 className="text-2xl font-semibold text-primary-600 font-heading mb-4">
                                        Our Mission
                                    </h2>
                                    <p className="text-accent-800 mb-6">
                                        Das Kitchen exists to strengthen our
                                        community through direct action, mutual
                                        aid, and revolutionary solidarity. We
                                        believe in the power of collective care
                                        and the importance of building networks
                                        of support that center the working class
                                        and most oppressed among us.
                                    </p>
                                    <p className="text-accent-800">
                                        Our work is rooted in the understanding
                                        that true security comes not from
                                        individual wealth or capitalist
                                        institutions, but from strong
                                        communities where everyone has what they
                                        need to thrive.
                                    </p>
                                </div>

                                <div>
                                    <h2 className="text-2xl font-semibold text-gray-900 font-heading mb-4">
                                        Our Values
                                    </h2>
                                    <ul className="space-y-3 text-gray-700">
                                        <li className="flex items-start">
                                            <span className="text-primary-600 mr-2">
                                                •
                                            </span>
                                            <span>
                                                <strong>Solidarity:</strong> We
                                                stand together in struggle and
                                                celebration
                                            </span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-primary-600 mr-2">
                                                •
                                            </span>
                                            <span>
                                                <strong>Equity:</strong>{' '}
                                                Everyone deserves dignity and
                                                access to resources
                                            </span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-primary-600 mr-2">
                                                •
                                            </span>
                                            <span>
                                                <strong>Community:</strong>{' '}
                                                Collective care strengthens us
                                                all
                                            </span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-primary-600 mr-2">
                                                •
                                            </span>
                                            <span>
                                                <strong>Justice:</strong> We
                                                work toward systemic change
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* <div className="bg-gray-50 rounded-lg p-8 mb-12">
                                <h2 className="text-2xl font-semibold text-gray-900 font-heading mb-4">
                                    What We Do
                                </h2>
                                <div className="grid md:grid-cols-3 gap-6">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                                            Food Security
                                        </h3>
                                        <p className="text-gray-700 text-sm">
                                            Community kitchens, food
                                            distribution, and nutrition
                                            education programs.
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                                            Housing Support
                                        </h3>
                                        <p className="text-gray-700 text-sm">
                                            Tenant organizing, eviction
                                            prevention, and emergency housing
                                            assistance.
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                                            Emergency Aid
                                        </h3>
                                        <p className="text-gray-700 text-sm">
                                            Rapid response for community members
                                            facing crisis situations.
                                        </p>
                                    </div>
                                </div>
                            </div> */}

                            <div className="text-center">
                                <h2 className="text-2xl font-semibold text-gray-900 font-heading mb-4">
                                    Join Our Movement
                                </h2>
                                <p className="text-gray-700 mb-6">
                                    Mutual aid is most powerful when we work
                                    together. Whether you can volunteer time,
                                    donate resources, or simply spread the word,
                                    every contribution matters.
                                </p>
                                <a
                                    href="/contact"
                                    className="btn-primary inline-block"
                                >
                                    Get Involved
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
