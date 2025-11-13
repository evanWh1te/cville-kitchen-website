'use client';

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

import { useEffect, useState } from 'react';
import {
    volunteersAPI,
    VolunteerOpportunity,
    VolunteerCategory
} from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const categoryLabels: Record<VolunteerCategory, string> = {
    FOOD_PREPARATION: 'Food Preparation',
    FOOD_DISTRIBUTION: 'Food Distribution',
    COMMUNITY_GARDENS: 'Community Gardens',
    ADMINISTRATIVE: 'Administrative Support',
    FUNDRAISING: 'Fundraising',
    OUTREACH: 'Outreach & Advocacy',
    EDUCATION: 'Education & Workshops',
    TRANSPORTATION: 'Transportation',
    EVENT_COORDINATION: 'Event Coordination',
    OTHER: 'Other Opportunities'
};

const categoryOrder: VolunteerCategory[] = [
    'ADMINISTRATIVE',
    'COMMUNITY_GARDENS',
    'EDUCATION',
    'EVENT_COORDINATION',
    'FOOD_DISTRIBUTION',
    'FOOD_PREPARATION',
    'FUNDRAISING',
    'OUTREACH',
    'TRANSPORTATION',
    'OTHER'
];

function VolunteerCard({ volunteer }: { volunteer: VolunteerOpportunity }) {
    return (
        <div>
            <h3 className="text-xl font-semibold text-revolutionary-600 mb-2">
                {volunteer.title}
            </h3>

            {volunteer.description && (
                <p className="text-accent-800 mb-3">{volunteer.description}</p>
            )}

            <div className="space-y-2 text-sm text-accent-700">
                {volunteer.location && (
                    <div>
                        <strong className="text-accent-900">Location:</strong>{' '}
                        {volunteer.location}
                    </div>
                )}

                {volunteer.address && (
                    <div>
                        <strong className="text-accent-900">Address:</strong>{' '}
                        {volunteer.address}
                    </div>
                )}

                {volunteer.hours && (
                    <div>
                        <strong className="text-accent-900">Hours:</strong>{' '}
                        {volunteer.hours}
                    </div>
                )}

                {volunteer.timeCommitment && (
                    <div>
                        <strong className="text-accent-900">
                            Time Commitment:
                        </strong>{' '}
                        {volunteer.timeCommitment}
                    </div>
                )}

                {volunteer.skills && (
                    <div>
                        <strong className="text-accent-900">
                            Skills Needed:
                        </strong>{' '}
                        {volunteer.skills}
                    </div>
                )}

                {volunteer.requirements && (
                    <div>
                        <strong className="text-accent-900">
                            Requirements:
                        </strong>{' '}
                        {volunteer.requirements}
                    </div>
                )}

                {volunteer.phone && (
                    <div>
                        <strong className="text-accent-900">Phone:</strong>{' '}
                        <a
                            href={`tel:${volunteer.phone}`}
                            className="text-primary-600 hover:text-primary-700"
                        >
                            {volunteer.phone}
                        </a>
                    </div>
                )}

                {volunteer.email && (
                    <div>
                        <strong className="text-accent-900">Email:</strong>{' '}
                        <a
                            href={`mailto:${volunteer.email}`}
                            className="text-primary-600 hover:text-primary-700"
                        >
                            {volunteer.email}
                        </a>
                    </div>
                )}

                {volunteer.website && (
                    <div>
                        <strong className="text-accent-900">Website:</strong>{' '}
                        <a
                            href={volunteer.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 hover:text-primary-700"
                        >
                            {volunteer.website}
                        </a>
                    </div>
                )}

                {volunteer.contactInfo && (
                    <div>
                        <strong className="text-accent-900">
                            Additional Contact Info:
                        </strong>{' '}
                        {volunteer.contactInfo}
                    </div>
                )}

                {volunteer.notes && (
                    <div>
                        <strong className="text-accent-900">
                            Additional Notes:
                        </strong>{' '}
                        {volunteer.notes}
                    </div>
                )}
            </div>
        </div>
    );
}

function VolunteerSection({
    category,
    volunteers
}: {
    category: VolunteerCategory;
    volunteers: VolunteerOpportunity[];
}) {
    if (volunteers.length === 0) return null;

    return (
        <section className="mb-12">
            <h2 className="text-2xl font-bold text-white bg-gray-700 px-4 py-2 rounded-lg border-l-4 border-primary-500 mb-6">
                {categoryLabels[category]}
            </h2>
            <div className="space-y-4">
                {volunteers.map((volunteer) => (
                    <VolunteerCard key={volunteer.id} volunteer={volunteer} />
                ))}
            </div>
        </section>
    );
}

export default function Volunteer() {
    const [volunteers, setVolunteers] = useState<VolunteerOpportunity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchVolunteers = async () => {
            try {
                setLoading(true);
                const response = await volunteersAPI.getAll();
                setVolunteers(response.volunteers);
            } catch (err) {
                console.error('Failed to fetch volunteer opportunities:', err);
                setError(
                    'Failed to load volunteer opportunities. Please try again later.'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchVolunteers();
    }, []);

    // Group volunteers by category
    const volunteersByCategory = volunteers.reduce((acc, volunteer) => {
        if (!acc[volunteer.category]) {
            acc[volunteer.category] = [];
        }
        acc[volunteer.category].push(volunteer);
        return acc;
    }, {} as Record<VolunteerCategory, VolunteerOpportunity[]>);

    if (loading) {
        return (
            <>
                <Header />
                <main className="min-h-screen bg-gray-50">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">
                                Loading volunteer opportunities...
                            </p>
                        </div>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    if (error) {
        return (
            <>
                <div className="min-h-screen bg-accent-50">
                    <Header />
                    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                            <h2 className="text-lg font-semibold text-red-800 mb-2">
                                Error Loading Volunteer Opportunities
                            </h2>
                            <p className="text-red-700">{error}</p>
                        </div>
                    </div>
                    <Footer />
                </div>
            </>
        );
    }

    return (
        <div className="bg-accent-50">
            <Header />
            <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="prose prose-lg max-w-none">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold tracking-tight text-primary-700 mb-8">
                            Volunteer Opportunities
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Join our mission to fight food insecurity in
                            Charlottesville. Find ways to get involved and make
                            a difference in your community.
                        </p>
                    </div>

                    {volunteers.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-gray-400 text-6xl mb-4">
                                🤝
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                No Volunteer Opportunities Available
                            </h2>
                            <p className="text-gray-600">
                                Check back soon for new volunteer opportunities,
                                or contact us if you&apos;re interested in
                                helping out!
                            </p>
                        </div>
                    ) : (
                        <div>
                            {categoryOrder.map((category) => (
                                <VolunteerSection
                                    key={category}
                                    category={category}
                                    volunteers={
                                        volunteersByCategory[category] || []
                                    }
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}
