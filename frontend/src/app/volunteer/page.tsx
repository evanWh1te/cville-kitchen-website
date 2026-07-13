'use client';

import { useEffect, useState } from 'react';
import {
    volunteersAPI,
    VolunteerOpportunity,
    VolunteerCategory
} from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TranslationBanner from '@/components/TranslationBanner';
import { useTranslations } from 'next-intl';

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
    const t = useTranslations('VolunteerPage');
    return (
        <div>
            <h3 className="text-xl font-semibold text-revolutionary-600 mb-2">
                <span lang="en">{volunteer.title}</span>
            </h3>

            {volunteer.description && (
                <p className="text-accent-800 mb-3" lang="en">
                    {volunteer.description}
                </p>
            )}

            <div className="space-y-2 text-sm text-accent-700">
                {volunteer.location && (
                    <div>
                        <strong className="text-accent-900">
                            {t('labels.location')}
                        </strong>{' '}
                        <span lang="en">{volunteer.location}</span>
                    </div>
                )}

                {volunteer.address && (
                    <div>
                        <strong className="text-accent-900">
                            {t('labels.address')}
                        </strong>{' '}
                        <span lang="en">{volunteer.address}</span>
                    </div>
                )}

                {volunteer.hours && (
                    <div>
                        <strong className="text-accent-900">
                            {t('labels.hours')}
                        </strong>{' '}
                        <span lang="en">{volunteer.hours}</span>
                    </div>
                )}

                {volunteer.timeCommitment && (
                    <div>
                        <strong className="text-accent-900">
                            {t('labels.timeCommitment')}
                        </strong>{' '}
                        <span lang="en">{volunteer.timeCommitment}</span>
                    </div>
                )}

                {volunteer.skills && (
                    <div>
                        <strong className="text-accent-900">
                            {t('labels.skills')}
                        </strong>{' '}
                        <span lang="en">{volunteer.skills}</span>
                    </div>
                )}

                {volunteer.requirements && (
                    <div>
                        <strong className="text-accent-900">
                            {t('labels.requirements')}
                        </strong>{' '}
                        <span lang="en">{volunteer.requirements}</span>
                    </div>
                )}

                {volunteer.phone && (
                    <div>
                        <strong className="text-accent-900">
                            {t('labels.phone')}
                        </strong>{' '}
                        <a
                            href={`tel:${volunteer.phone}`}
                            className="text-primary-600 hover:text-primary-700"
                        >
                            <span lang="en">{volunteer.phone}</span>
                        </a>
                    </div>
                )}

                {volunteer.email && (
                    <div>
                        <strong className="text-accent-900">
                            {t('labels.email')}
                        </strong>{' '}
                        <a
                            href={`mailto:${volunteer.email}`}
                            className="text-primary-600 hover:text-primary-700"
                        >
                            <span lang="en">{volunteer.email}</span>
                        </a>
                    </div>
                )}

                {volunteer.website && (
                    <div>
                        <strong className="text-accent-900">
                            {t('labels.website')}
                        </strong>{' '}
                        <a
                            href={volunteer.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 hover:text-primary-700"
                        >
                            <span lang="en">{volunteer.website}</span>
                        </a>
                    </div>
                )}

                {volunteer.contactInfo && (
                    <div>
                        <strong className="text-accent-900">
                            {t('labels.contactInfo')}
                        </strong>{' '}
                        <span lang="en">{volunteer.contactInfo}</span>
                    </div>
                )}

                {volunteer.notes && (
                    <div>
                        <strong className="text-accent-900">
                            {t('labels.notes')}
                        </strong>{' '}
                        <span lang="en">{volunteer.notes}</span>
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
    const t = useTranslations('VolunteerPage');
    if (volunteers.length === 0) return null;

    return (
        <section className="mb-12">
            <h2 className="text-2xl font-bold text-white bg-gray-700 px-4 py-2 rounded-lg border-l-4 border-primary-500 mb-6">
                {t(`categories.${category}`)}
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
    const t = useTranslations('VolunteerPage');
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
                setError('error');
            } finally {
                setLoading(false);
            }
        };

        fetchVolunteers();
    }, []);

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
                            <p className="mt-4 text-gray-600">{t('loading')}</p>
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
                                {t('errorTitle')}
                            </h2>
                            <p className="text-red-700">{t('errorText')}</p>
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
            <TranslationBanner />
            <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="prose prose-lg max-w-none">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold tracking-tight text-primary-700 mb-8">
                            {t('title')}
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            {t('subtitle')}
                        </p>
                    </div>

                    {volunteers.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-gray-400 text-6xl mb-4">
                                🤝
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                {t('emptyTitle')}
                            </h2>
                            <p className="text-gray-600">{t('emptyText')}</p>
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
