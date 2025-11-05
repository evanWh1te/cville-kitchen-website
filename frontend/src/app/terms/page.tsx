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
    title: 'Terms of Service - Das Kitchen',
    description: 'Das Kitchen terms of service and usage guidelines.'
};

export default function TermsPage() {
    return (
        <>
            <Header />
            <main className="flex-1">
                <section className="py-16 bg-white">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6">
                        <div className="prose prose-lg max-w-none">
                            <h1 className="text-4xl font-bold text-gray-900 mb-8">
                                Terms of Service
                            </h1>
                            <p className="text-gray-600 mb-8">
                                Last updated: January 3, 2025
                            </p>

                            <div className="space-y-8">
                                <section>
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                        Welcome to Das Kitchen
                                    </h2>
                                    <p className="text-gray-700 mb-4">
                                        These terms of service outline the
                                        guidelines for using the Das Kitchen
                                        website and participating in our mutual
                                        aid community. By using our website or
                                        services, you agree to these terms.
                                    </p>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                        Our Mission and Values
                                    </h2>
                                    <p className="text-gray-700 mb-4">
                                        Das Kitchen is a mutual aid organization
                                        committed to:
                                    </p>
                                    <ul className="list-disc pl-6 text-gray-700 space-y-2">
                                        <li>
                                            Building community resilience
                                            through solidarity
                                        </li>
                                        <li>
                                            Supporting the most vulnerable
                                            community members
                                        </li>
                                        <li>
                                            Creating networks of care and mutual
                                            support
                                        </li>
                                        <li>
                                            Working toward social and economic
                                            justice
                                        </li>
                                    </ul>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                        Acceptable Use
                                    </h2>
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                Community Guidelines
                                            </h3>
                                            <p className="text-gray-700 mb-3">
                                                When using our services or
                                                participating in our community,
                                                you agree to:
                                            </p>
                                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                                                <li>
                                                    Treat all community members
                                                    with respect and dignity
                                                </li>
                                                <li>
                                                    Act in solidarity with those
                                                    seeking mutual aid
                                                </li>
                                                <li>
                                                    Provide accurate information
                                                    when requesting or offering
                                                    support
                                                </li>
                                                <li>
                                                    Respect the privacy and
                                                    confidentiality of community
                                                    members
                                                </li>
                                                <li>
                                                    Use our services only for
                                                    legitimate mutual aid
                                                    purposes
                                                </li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                Prohibited Activities
                                            </h3>
                                            <p className="text-gray-700 mb-3">
                                                The following activities are not
                                                permitted:
                                            </p>
                                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                                                <li>
                                                    Harassment, discrimination,
                                                    or hateful speech
                                                </li>
                                                <li>
                                                    Fraudulent requests for aid
                                                    or misrepresentation
                                                </li>
                                                <li>
                                                    Commercial solicitation or
                                                    spam
                                                </li>
                                                <li>
                                                    Sharing personal information
                                                    without consent
                                                </li>
                                                <li>
                                                    Attempting to hack or
                                                    disrupt our services
                                                </li>
                                                <li>
                                                    Using our platform for
                                                    illegal activities
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                        Services and Support
                                    </h2>
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                What We Provide
                                            </h3>
                                            <p className="text-gray-700 mb-3">
                                                Das Kitchen provides:
                                            </p>
                                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                                                <li>
                                                    Information about mutual aid
                                                    resources
                                                </li>
                                                <li>
                                                    Coordination of community
                                                    support efforts
                                                </li>
                                                <li>Volunteer opportunities</li>
                                                <li>
                                                    Emergency aid coordination
                                                    (when possible)
                                                </li>
                                                <li>
                                                    Educational resources about
                                                    mutual aid
                                                </li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                Limitations
                                            </h3>
                                            <p className="text-gray-700">
                                                Please understand that Das
                                                Kitchen is a grassroots
                                                organization with limited
                                                resources. While we strive to
                                                help everyone who reaches out,
                                                we cannot guarantee that we can
                                                meet all requests for
                                                assistance.
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                        Intellectual Property
                                    </h2>
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                Open Source License
                                            </h3>
                                            <p className="text-gray-700">
                                                This website and its code are
                                                licensed under the GNU Affero
                                                General Public License v3.0
                                                (AGPL-3.0). This means the code
                                                is free and open source, and you
                                                can use, modify, and distribute
                                                it under the terms of the
                                                AGPL-3.0 license.
                                            </p>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                Content Usage
                                            </h3>
                                            <p className="text-gray-700">
                                                The educational content,
                                                resources, and materials on this
                                                site are provided for the
                                                benefit of the community. You
                                                may share and adapt this content
                                                for non-commercial, mutual aid
                                                purposes with appropriate
                                                attribution.
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                        Privacy and Confidentiality
                                    </h2>
                                    <p className="text-gray-700 mb-4">
                                        Your privacy is important to us. Please
                                        review our Privacy Policy for detailed
                                        information about how we collect, use,
                                        and protect your personal information.
                                        Key principles include:
                                    </p>
                                    <ul className="list-disc pl-6 text-gray-700 space-y-2">
                                        <li>
                                            We never sell or share personal
                                            information for profit
                                        </li>
                                        <li>
                                            Information is only used for mutual
                                            aid purposes
                                        </li>
                                        <li>
                                            You can request deletion of your
                                            information at any time
                                        </li>
                                        <li>
                                            We maintain confidentiality for
                                            sensitive requests
                                        </li>
                                    </ul>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                        Disclaimers and Limitations
                                    </h2>
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                Service Availability
                                            </h3>
                                            <p className="text-gray-700">
                                                We provide our services on a
                                                volunteer basis and cannot
                                                guarantee continuous
                                                availability. We may need to
                                                suspend or modify services
                                                without notice due to resource
                                                constraints or technical issues.
                                            </p>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                No Warranties
                                            </h3>
                                            <p className="text-gray-700">
                                                Our services are provided
                                                &ldquo;as is&rdquo; without
                                                warranties of any kind. While we
                                                strive to provide accurate
                                                information and reliable
                                                support, we cannot guarantee
                                                specific outcomes.
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                        Community Accountability
                                    </h2>
                                    <p className="text-gray-700 mb-4">
                                        If someone violates these terms or
                                        community guidelines, we may:
                                    </p>
                                    <ul className="list-disc pl-6 text-gray-700 space-y-2">
                                        <li>
                                            Provide education and support to
                                            address the behavior
                                        </li>
                                        <li>
                                            Temporarily suspend access to
                                            services
                                        </li>
                                        <li>
                                            Permanently ban individuals who
                                            cause harm to the community
                                        </li>
                                        <li>
                                            Report illegal activities to
                                            appropriate authorities
                                        </li>
                                    </ul>
                                    <p className="text-gray-700 mt-4">
                                        We believe in restorative justice and
                                        will always try to address issues
                                        through community dialogue before taking
                                        punitive action.
                                    </p>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                        Changes to Terms
                                    </h2>
                                    <p className="text-gray-700">
                                        We may update these terms from time to
                                        time to reflect changes in our services
                                        or legal requirements. We will post any
                                        changes on this page and update the
                                        &ldquo;last updated&rdquo; date.
                                        Continued use of our services after
                                        changes constitutes acceptance of the
                                        new terms.
                                    </p>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                        Contact Information
                                    </h2>
                                    <p className="text-gray-700 mb-4">
                                        If you have questions about these terms
                                        or need to report a violation, please
                                        contact us:
                                    </p>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-gray-700">
                                            <strong>Das Kitchen</strong>
                                            <br />
                                            Email: contact@daskitchen.org
                                            <br />
                                            Subject: Terms of Service Inquiry
                                        </p>
                                    </div>
                                </section>

                                <section className="border-t pt-8">
                                    <p className="text-gray-600 text-sm">
                                        By using Das Kitchen&apos;s services,
                                        you acknowledge that you have read,
                                        understood, and agree to be bound by
                                        these Terms of Service and our Privacy
                                        Policy.
                                    </p>
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
