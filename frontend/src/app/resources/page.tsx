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
import { resourcesAPI, Resource, ResourceCategory } from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TranslationBanner from '@/components/TranslationBanner';
import { useTranslations } from 'next-intl';

// Labels will come from translations

const categoryOrder: ResourceCategory[] = [
    'PUBLIC_MEALS',
    'FREE_FRIDGES_PANTRIES',
    'EMERGENCY_FOOD',
    'STUDENT_MEALS',
    'CHURCH_PANTRIES',
    'FOOD_DELIVERY',
    'LOCAL_EFFORTS',
    'ADDITIONAL_RESOURCES'
];

function ResourceCard({ resource }: { resource: Resource }) {
    const t = useTranslations('ResourcesPage');
    return (
        <div>
            <h3 className="text-xl font-semibold text-revolutionary-600 mb-2">
                <span lang="en">{resource.title}</span>

                {resource.lastUpdated && (
                    <div className="mt-0 mb-4 text-xs text-gray-500">
                        {t('labels.lastUpdated')}{' '}
                        {new Date(resource.lastUpdated).toLocaleDateString()}
                    </div>
                )}
            </h3>

            {resource.description && (
                <p className="text-accent-800 mb-3" lang="en">
                    {resource.description}
                </p>
            )}

            <div className="space-y-2 text-sm text-accent-700">
                {resource.location && (
                    <div>
                        <strong className="text-accent-900">
                            {t('labels.location')}
                        </strong>{' '}
                        <span lang="en">{resource.location}</span>
                    </div>
                )}

                {resource.address && (
                    <div>
                        <strong className="text-accent-900">
                            {t('labels.address')}
                        </strong>{' '}
                        <span lang="en">{resource.address}</span>
                    </div>
                )}

                {resource.hours && (
                    <div>
                        <strong className="text-accent-900">
                            {t('labels.hours')}
                        </strong>{' '}
                        <span lang="en">{resource.hours}</span>
                    </div>
                )}

                {resource.phone && (
                    <div>
                        <strong className="text-accent-900">
                            {t('labels.phone')}
                        </strong>{' '}
                        <a
                            href={`tel:${resource.phone}`}
                            className="text-primary-600 hover:text-primary-700"
                        >
                            <span lang="en">{resource.phone}</span>
                        </a>
                    </div>
                )}

                {resource.email && (
                    <div>
                        <strong className="text-accent-900">
                            {t('labels.email')}
                        </strong>{' '}
                        <a
                            href={`mailto:${resource.email}`}
                            className="text-primary-600 hover:text-primary-700"
                        >
                            <span lang="en">{resource.email}</span>
                        </a>
                    </div>
                )}

                {resource.website && (
                    <div>
                        <strong className="text-accent-900">
                            {t('labels.website')}
                        </strong>{' '}
                        <a
                            href={resource.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 hover:text-primary-700"
                        >
                            <span lang="en">{resource.website}</span>
                        </a>
                    </div>
                )}

                {resource.requirements && (
                    <div>
                        <strong className="text-accent-900">
                            {t('labels.requirements')}
                        </strong>{' '}
                        <span lang="en">{resource.requirements}</span>
                    </div>
                )}

                {resource.notes && (
                    <div>
                        <strong className="text-accent-900">
                            {t('labels.notes')}
                        </strong>{' '}
                        <span lang="en">{resource.notes}</span>
                    </div>
                )}

                {resource.contactInfo && (
                    <div>
                        <strong className="text-accent-900">
                            {t('labels.contactInfo')}
                        </strong>{' '}
                        <span lang="en">{resource.contactInfo}</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function ResourcesPage() {
    const t = useTranslations('ResourcesPage');
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchResources = async () => {
            try {
                setLoading(true);
                const response = await resourcesAPI.getAll();
                setResources(response.resources);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch resources:', err);
                setError(
                    'Unable to load resources at this time. Please try again later.'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchResources();
    }, []);

    // Group resources by category
    const resourcesByCategory = resources.reduce((acc, resource) => {
        if (!acc[resource.category]) {
            acc[resource.category] = [];
        }
        acc[resource.category].push(resource);
        return acc;
    }, {} as Record<ResourceCategory, Resource[]>);

    // Sort resources within each category
    Object.keys(resourcesByCategory).forEach((category) => {
        resourcesByCategory[category as ResourceCategory].sort((a, b) => {
            // Special sorting for PUBLIC_MEALS: group by meal type first
            if (category === 'PUBLIC_MEALS') {
                const mealTypeOrder = {
                    BREAKFAST: 1,
                    LUNCH: 2,
                    DINNER: 3,
                    OTHER: 4
                };
                const aOrder =
                    mealTypeOrder[a.type as keyof typeof mealTypeOrder] || 5;
                const bOrder =
                    mealTypeOrder[b.type as keyof typeof mealTypeOrder] || 5;

                if (aOrder !== bOrder) {
                    return aOrder - bOrder;
                }
                // Within same meal type, sort alphabetically
                return a.title.localeCompare(b.title);
            }

            // For all other categories, sort alphabetically
            return a.title.localeCompare(b.title);
        });
    });

    // Hardcoded resources not stored in DB; displayed separately
    const staticResources: Resource[] = [
        {
            id: 'street-sheet',
            title: 'Charlottesville Access Project - Street Sheet Resources',
            description:
                'Contains information on public meals, emergency food, church based pantries, kids/student meals, and food delivery services.',
            category: 'ADDITIONAL_RESOURCES',
            type: 'OTHER',
            website:
                'https://docs.google.document/d/1VQbcXQhIjkVTlDjaqh3swStDV8Qb_pau5owZaOmjhaw/edit?tab=t.0',
            email: 'cvillestreetsheet@gmail.com',
            lastUpdated: new Date().toISOString(),
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: 'helpful-resource-by-city',
            title: '@helpfulresourcesbycity',
            description:
                'Available resources to reduce violence, poverty, drug overdoses, etc. by city.',
            category: 'ADDITIONAL_RESOURCES',
            type: 'OTHER',
            website: 'https://linktr.ee/helpfulresourcesbycity',
            lastUpdated: new Date().toISOString(),
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: 'municipality',
            title: 'City of Charlottesville & Albemarle County Food Resources',
            description:
                'Links to emergency food, delivered food, and public meal resources',
            category: 'ADDITIONAL_RESOURCES',
            type: 'OTHER',
            website:
                'https://www.charlottesville.gov/377/Available-Food-Resources-in-the-Communit',
            lastUpdated: new Date().toISOString(),
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    ];

    if (loading) {
        return (
            <div className="bg-accent-50">
                <Header />
                <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
                    <div className="flex justify-center items-center min-h-64">
                        <div className="text-lg text-gray-600">
                            {t('loading')}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
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
                    </div>

                    {/* <div className="mb-8 p-4 bg-blue-50 rounded-lg">
                        <p className="text-accent-800 mb-2">
                            <em>
                                Last updated:{' '}
                                {new Date().toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </em>
                        </p>
                        <p className="text-accent-800">
                            This information is compiled by the Charlottesville
                            Access Project (cvillestreetsheet@gmail.com,
                            412-415-6402).
                        </p>
                    </div> */}

                    {/* Table of Contents */}
                    <div className="mb-10">
                        <h2 className="text-2xl font-bold text-center text-white bg-gray-700 px-4 py-2 rounded-lg border-l-4 border-primary-500 mb-6">
                            {t('quickNav')}
                        </h2>

                        <div className="space-y-3 max-w-2xl mx-auto">
                            {categoryOrder.map((category) => {
                                const categoryResources =
                                    resourcesByCategory[category];
                                if (
                                    !categoryResources ||
                                    categoryResources.length === 0
                                ) {
                                    return null;
                                }

                                const sectionId = category
                                    .toLowerCase()
                                    .replace(/_/g, '-');

                                return (
                                    <div
                                        key={category}
                                        className="flex items-center justify-between py-3 border-b border-dotted border-gray-300 last:border-b-0 hover:bg-primary-50/50 rounded px-2 transition-colors"
                                    >
                                        <a
                                            href={`#${sectionId}`}
                                            className="text-gray-700 hover:text-primary-700 transition-colors font-medium"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                document
                                                    .getElementById(sectionId)
                                                    ?.scrollIntoView({
                                                        behavior: 'smooth',
                                                        block: 'start'
                                                    });
                                            }}
                                        >
                                            {t(`categories.${category}`)}
                                            {category === 'PUBLIC_MEALS' && (
                                                <span className="text-sm text-accent-600 ml-2">
                                                    (Breakfast, Lunch & Dinner)
                                                </span>
                                            )}
                                        </a>
                                        <span className="text-sm text-accent-700 bg-accent-100/60 px-2 py-1 rounded-full">
                                            {t('count', {
                                                count: categoryResources.length
                                            })}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-red-800 mb-4">
                            {t('howToHelp')}
                        </h2>
                        <p className="text-accent-800 mb-4">
                            {t('howToHelpDesc')}
                        </p>
                        <p className="text-accent-800">
                            <strong>Community free fridges and pantries</strong>{' '}
                            are resources that community members can access -
                            take what you need, give what you can. Generally,
                            they are stocked by community and maintained by
                            volunteers in the spirit of mutual aid and
                            solidarity. Best practices often include making sure
                            donated food is sealed, packaged, labeled, and dated
                            - not half-eaten leftovers or opened or expired
                            items. Below is a list of these resources around
                            Charlottesville, but please note the accessibility
                            restrictions based on operating hours or location
                            (e.g., student access cards needed).
                        </p>
                    </div>

                    <div className="my-8 border-t border-accent-300 pt-6">
                        <h2 className="text-2xl font-bold text-white bg-gray-700 px-4 py-2 rounded-lg border-l-4 border-primary-500 mb-6">
                            {t('externalResources')}
                        </h2>
                        <p className="text-accent-700 mb-4">
                            {t('externalDesc')}
                        </p>
                        <div className="space-y-4">
                            {staticResources.map((resource) => (
                                <ResourceCard
                                    key={resource.id}
                                    resource={resource}
                                />
                            ))}
                        </div>
                    </div>

                    {error ? (
                        <div className="rounded-md bg-red-50 p-4 mb-8">
                            <div className="text-red-700">{error}</div>
                        </div>
                    ) : (
                        <>
                            {categoryOrder.map((category) => {
                                const categoryResources =
                                    resourcesByCategory[category];
                                if (
                                    !categoryResources ||
                                    categoryResources.length === 0
                                ) {
                                    return null;
                                }

                                const sectionId = category
                                    .toLowerCase()
                                    .replace(/_/g, '-');

                                return (
                                    <section
                                        key={category}
                                        id={sectionId}
                                        className="mb-12 scroll-mt-24"
                                    >
                                        <h2 className="text-2xl font-bold text-white bg-gray-700 px-4 py-2 rounded-lg border-l-4 border-primary-500 mb-6">
                                            {t(`categories.${category}`)}
                                        </h2>

                                        {category === 'PUBLIC_MEALS' ? (
                                            // Special handling for PUBLIC_MEALS - group by meal type
                                            <div className="space-y-8">
                                                {[
                                                    'BREAKFAST',
                                                    'LUNCH',
                                                    'DINNER',
                                                    'OTHER'
                                                ].map((mealType) => {
                                                    const mealResources =
                                                        categoryResources.filter(
                                                            (resource) =>
                                                                resource.type ===
                                                                mealType
                                                        );

                                                    if (
                                                        mealResources.length ===
                                                        0
                                                    )
                                                        return null;

                                                    const mealTypeLabels = {
                                                        BREAKFAST: t(
                                                            'mealTypes.BREAKFAST'
                                                        ),
                                                        LUNCH: t(
                                                            'mealTypes.LUNCH'
                                                        ),
                                                        DINNER: t(
                                                            'mealTypes.DINNER'
                                                        ),
                                                        OTHER: t(
                                                            'mealTypes.OTHER'
                                                        )
                                                    } as const;

                                                    return (
                                                        <div
                                                            key={mealType}
                                                            className="mb-6"
                                                        >
                                                            <h3 className="text-xl font-semibold text-revolutionary-600 mb-4 pb-2 border-b-2 border-revolutionary-200">
                                                                {
                                                                    mealTypeLabels[
                                                                        mealType as keyof typeof mealTypeLabels
                                                                    ]
                                                                }
                                                            </h3>
                                                            <div className="space-y-4">
                                                                {mealResources.map(
                                                                    (
                                                                        resource
                                                                    ) => (
                                                                        <ResourceCard
                                                                            key={
                                                                                resource.id
                                                                            }
                                                                            resource={
                                                                                resource
                                                                            }
                                                                        />
                                                                    )
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            // Standard handling for other categories
                                            <div className="space-y-4">
                                                {categoryResources.map(
                                                    (resource) => (
                                                        <ResourceCard
                                                            key={resource.id}
                                                            resource={resource}
                                                        />
                                                    )
                                                )}
                                            </div>
                                        )}
                                    </section>
                                );
                            })}

                            {resources.length === 0 && !error && (
                                <div className="text-center py-12">
                                    <p className="text-accent-600">
                                        No resources available at this time.
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}
