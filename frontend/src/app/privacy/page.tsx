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

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy - Das Kitchen',
    description: 'Das Kitchen privacy policy and data protection information.'
};

export default function PrivacyPage() {
    return (
        <>
            <Header />
            <main className="flex-1">
                <section className="py-16 bg-white">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6">
                        <div className="prose prose-lg max-w-none">
                            <h1 className="text-4xl font-bold text-gray-900 mb-8">
                                Privacy Policy
                            </h1>
                            <p className="text-gray-600 mb-8">
                                Last updated: January 3, 2025
                            </p>

                            <div className="space-y-8">
                                <section>
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                        Our Commitment to Privacy
                                    </h2>
                                    <p className="text-gray-700 mb-4">
                                        Das Kitchen is committed to protecting
                                        your privacy and personal information.
                                        As a mutual aid organization, we
                                        understand the importance of trust and
                                        confidentiality in our community
                                        relationships. This policy explains how
                                        we collect, use, and protect your
                                        information.
                                    </p>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                        Information We Collect
                                    </h2>
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                Contact Form Information
                                            </h3>
                                            <p className="text-gray-700">
                                                When you contact us through our
                                                website, we collect:
                                            </p>
                                            <ul className="list-disc pl-6 mt-2 text-gray-700">
                                                <li>Your name</li>
                                                <li>Email address</li>
                                                <li>Subject of inquiry</li>
                                                <li>Message content</li>
                                                <li>
                                                    IP address (for security
                                                    purposes)
                                                </li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                Website Usage Data
                                            </h3>
                                            <p className="text-gray-700">
                                                We may collect basic usage
                                                information such as pages
                                                visited and time spent on the
                                                site to improve our services.
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                        How We Use Your Information
                                    </h2>
                                    <p className="text-gray-700 mb-4">
                                        We use your information solely for
                                        mutual aid purposes:
                                    </p>
                                    <ul className="list-disc pl-6 text-gray-700 space-y-2">
                                        <li>
                                            Responding to your inquiries and
                                            requests for support
                                        </li>
                                        <li>
                                            Coordinating volunteer opportunities
                                        </li>
                                        <li>
                                            Organizing community events and
                                            programs
                                        </li>
                                        <li>
                                            Sending important updates about our
                                            services (with your consent)
                                        </li>
                                        <li>
                                            Improving our website and services
                                        </li>
                                    </ul>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                        Information Sharing and Protection
                                    </h2>
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                We Do Not Sell Your Data
                                            </h3>
                                            <p className="text-gray-700">
                                                Das Kitchen will never sell,
                                                trade, or rent your personal
                                                information to third parties.
                                                Your trust is fundamental to our
                                                mission.
                                            </p>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                Limited Sharing
                                            </h3>
                                            <p className="text-gray-700">
                                                We may share information only in
                                                these circumstances:
                                            </p>
                                            <ul className="list-disc pl-6 mt-2 text-gray-700">
                                                <li>
                                                    With your explicit consent
                                                </li>
                                                <li>
                                                    To coordinate emergency aid
                                                    (only with your permission)
                                                </li>
                                                <li>
                                                    If required by law or legal
                                                    process
                                                </li>
                                                <li>
                                                    To protect the safety of our
                                                    community members
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                        Data Security
                                    </h2>
                                    <p className="text-gray-700 mb-4">
                                        We implement appropriate security
                                        measures to protect your personal
                                        information:
                                    </p>
                                    <ul className="list-disc pl-6 text-gray-700 space-y-2">
                                        <li>
                                            Encrypted data transmission (HTTPS)
                                        </li>
                                        <li>Secure data storage practices</li>
                                        <li>
                                            Limited access to personal
                                            information
                                        </li>
                                        <li>Regular security reviews</li>
                                    </ul>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                        Your Rights
                                    </h2>
                                    <p className="text-gray-700 mb-4">
                                        You have the right to:
                                    </p>
                                    <ul className="list-disc pl-6 text-gray-700 space-y-2">
                                        <li>
                                            Access the personal information we
                                            have about you
                                        </li>
                                        <li>
                                            Request correction of inaccurate
                                            information
                                        </li>
                                        <li>
                                            Request deletion of your information
                                        </li>
                                        <li>
                                            Opt out of communications at any
                                            time
                                        </li>
                                        <li>
                                            Ask questions about our privacy
                                            practices
                                        </li>
                                    </ul>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                        Cookies and Tracking
                                    </h2>
                                    <p className="text-gray-700">
                                        Our website may use basic cookies for
                                        functionality and to improve user
                                        experience. We do not use third-party
                                        tracking or advertising cookies. You can
                                        disable cookies in your browser
                                        settings.
                                    </p>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                        Changes to This Policy
                                    </h2>
                                    <p className="text-gray-700">
                                        We may update this privacy policy from
                                        time to time. Any changes will be posted
                                        on this page with an updated date. We
                                        encourage you to review this policy
                                        periodically.
                                    </p>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                        Contact Us
                                    </h2>
                                    <p className="text-gray-700 mb-4">
                                        If you have questions about this privacy
                                        policy or how we handle your
                                        information, please contact us:
                                    </p>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-gray-700">
                                            <strong>Das Kitchen</strong>
                                            <br />
                                            Email: contact@daskitchen.org
                                            <br />
                                            Subject: Privacy Policy Inquiry
                                        </p>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
