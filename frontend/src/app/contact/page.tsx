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

'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<
        'idle' | 'success' | 'error'
    >('idle');

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus('idle');

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setSubmitStatus('success');
                setFormData({ name: '', email: '', subject: '', message: '' });
            } else {
                setSubmitStatus('error');
            }
        } catch (error) {
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Header />
            <main className="flex-1">
                <section className="py-16 bg-white">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6">
                        <div className="text-center mb-12">
                            <h1 className="text-4xl font-bold text-gray-900 font-heading mb-4">
                                Contact Charlottesville Kitchen
                            </h1>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Ready to get involved or need support? We&apos;d
                                love to hear from you.
                            </p>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-12">
                            {/* Contact Form */}
                            <div>
                                <h2 className="text-2xl font-semibold text-gray-900 font-heading mb-6">
                                    Send Us a Message
                                </h2>

                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-6"
                                >
                                    <div>
                                        <label
                                            htmlFor="name"
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                        >
                                            Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                        >
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="subject"
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                        >
                                            Subject *
                                        </label>
                                        <select
                                            id="subject"
                                            name="subject"
                                            required
                                            value={formData.subject}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                        >
                                            <option value="">
                                                Select a subject
                                            </option>
                                            {/* <option value="volunteer">
                                                I want to volunteer
                                            </option> */}
                                            <option value="support">
                                                I need support/assistance
                                            </option>
                                            {/* <option value="partnership">
                                                Partnership opportunities
                                            </option> */}
                                            <option value="donation">
                                                Donation/resources
                                            </option>
                                            <option value="general">
                                                General inquiry
                                            </option>
                                        </select>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="message"
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                        >
                                            Message *
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            required
                                            rows={5}
                                            value={formData.message}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                        />
                                    </div>

                                    {submitStatus === 'success' && (
                                        <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                                            <p className="text-green-800">
                                                Thank you! Your message has been
                                                sent successfully.
                                            </p>
                                        </div>
                                    )}

                                    {submitStatus === 'error' && (
                                        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                                            <p className="text-red-800">
                                                Sorry, there was an error
                                                sending your message. Please try
                                                again.
                                            </p>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting
                                            ? 'Sending...'
                                            : 'Send Message'}
                                    </button>
                                </form>
                            </div>

                            {/* Contact Information */}
                            <div>
                                <h2 className="text-2xl font-semibold text-gray-900 font-heading mb-6">
                                    Get In Touch
                                </h2>

                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                                            Community Events
                                        </h3>
                                        <p className="text-gray-700">
                                            We host special community events
                                            from time to time. Stay tuned and
                                            check back here for announcements
                                            about our next gathering!
                                        </p>
                                    </div>

                                    {/* Keeping the emergency support section commented out for potential future use */}
                                    {/* <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        Emergency Support
                                    </h3>
                                    <p className="text-gray-700">
                                        If you're facing an urgent situation and
                                        need immediate assistance, please reach
                                        out through our emergency support line.
                                    </p>
                                </div> */}

                                    <div>
                                        {/* <h3 className="text-lg font-medium text-gray-900 mb-2">
                                            Volunteer Opportunities
                                        </h3>
                                        <p className="text-gray-700 mb-3">
                                            We have various ways to get
                                            involved:
                                        </p>
                                        <ul className="text-gray-700 space-y-1">
                                            <li>• Food distribution events</li>
                                            <li>• Community kitchen support</li>
                                            <li>• Outreach and education</li>
                                            <li>• Administrative assistance</li>
                                        </ul> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
