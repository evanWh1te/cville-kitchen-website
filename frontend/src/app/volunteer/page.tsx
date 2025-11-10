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
    'FOOD_PREPARATION',
    'FOOD_DISTRIBUTION',
    'COMMUNITY_GARDENS',
    'ADMINISTRATIVE',
    'FUNDRAISING',
    'OUTREACH',
    'EDUCATION',
    'TRANSPORTATION',
    'EVENT_COORDINATION',
    'OTHER'
];

function VolunteerCard({ volunteer }: { volunteer: VolunteerOpportunity }) {
    return (
        <div>
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-revolutionary-600">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {volunteer.title}
                </h3>

                {volunteer.description && (
                    <p className="text-gray-700 mb-4">
                        {volunteer.description}
                    </p>
                )}

                <div className="space-y-2 text-sm text-gray-600">
                    {volunteer.location && (
                        <div className="flex items-center">
                            <span className="font-medium">Location:</span>
                            <span className="ml-2">{volunteer.location}</span>
                        </div>
                    )}

                    {volunteer.address && (
                        <div className="flex items-center">
                            <span className="font-medium">Address:</span>
                            <span className="ml-2">{volunteer.address}</span>
                        </div>
                    )}

                    {volunteer.hours && (
                        <div className="flex items-center">
                            <span className="font-medium">Hours:</span>
                            <span className="ml-2">{volunteer.hours}</span>
                        </div>
                    )}

                    {volunteer.timeCommitment && (
                        <div className="flex items-center">
                            <span className="font-medium">
                                Time Commitment:
                            </span>
                            <span className="ml-2">
                                {volunteer.timeCommitment}
                            </span>
                        </div>
                    )}

                    {volunteer.skills && (
                        <div className="flex items-start">
                            <span className="font-medium">Skills Needed:</span>
                            <span className="ml-2">{volunteer.skills}</span>
                        </div>
                    )}

                    {volunteer.requirements && (
                        <div className="flex items-start">
                            <span className="font-medium">Requirements:</span>
                            <span className="ml-2">
                                {volunteer.requirements}
                            </span>
                        </div>
                    )}

                    {volunteer.phone && (
                        <div className="flex items-center">
                            <span className="font-medium">Phone:</span>
                            <a
                                href={`tel:${volunteer.phone}`}
                                className="ml-2 text-blue-600 hover:underline"
                            >
                                {volunteer.phone}
                            </a>
                        </div>
                    )}

                    {volunteer.email && (
                        <div className="flex items-center">
                            <span className="font-medium">Email:</span>
                            <a
                                href={`mailto:${volunteer.email}`}
                                className="ml-2 text-blue-600 hover:underline"
                            >
                                {volunteer.email}
                            </a>
                        </div>
                    )}

                    {volunteer.website && (
                        <div className="flex items-center">
                            <span className="font-medium">Website:</span>
                            <a
                                href={volunteer.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-2 text-blue-600 hover:underline"
                            >
                                Visit Website
                            </a>
                        </div>
                    )}

                    {volunteer.contactInfo && (
                        <div className="flex items-start">
                            <span className="font-medium">Contact Info:</span>
                            <span className="ml-2">
                                {volunteer.contactInfo}
                            </span>
                        </div>
                    )}

                    {volunteer.notes && (
                        <div className="flex items-start">
                            <span className="font-medium">
                                Additional Notes:
                            </span>
                            <span className="ml-2">{volunteer.notes}</span>
                        </div>
                    )}
                </div>

                {/* Type badge */}
                <div className="mt-4">
                    <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                        {volunteer.type
                            .replace(/_/g, ' ')
                            .toLowerCase()
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </span>
                </div>
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
            <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-accent-500 pb-2">
                {categoryLabels[category]}
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
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
        <>
            <Header />
            <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-primary-700 mb-4">
                        Volunteer Opportunities
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Join our mission to fight food insecurity in
                        Charlottesville. Find ways to get involved and make a
                        difference in your community.
                    </p>
                </div>

                {volunteers.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-400 text-6xl mb-4">🤝</div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            No Volunteer Opportunities Available
                        </h2>
                        <p className="text-gray-600">
                            Check back soon for new volunteer opportunities, or
                            contact us if you're interested in helping out!
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
            <Footer />
        </>
    );
}
