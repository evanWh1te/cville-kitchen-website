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

import type { Metadata } from 'next';
import {
    formatLastUpdated,
    getResources,
    type Resource,
    type ResourceCategory
} from '@/lib/content';
import { resourceListSchema } from '@/lib/structured-data';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
    title: 'Free Food Resources',
    alternates: { canonical: '/resources' },
    description:
        'A directory of free food resources in Charlottesville and Albemarle County: public meals, community fridges and pantries, emergency food, student meals, church pantries, and food delivery services.',
    keywords: [
        'charlottesville food resources',
        'free food charlottesville',
        'food pantry charlottesville',
        'community fridge',
        'emergency food',
        'mutual aid'
    ],
    openGraph: {
        title: 'Community Food Resources in Charlottesville',
        description:
            'Free meals, pantries, community fridges, and food delivery services in Charlottesville and Albemarle County.',
        type: 'website'
    }
};

const categoryLabels: Record<ResourceCategory, string> = {
    PUBLIC_MEALS: 'Public Meals',
    FREE_FRIDGES_PANTRIES: 'Free Fridges & Pantries',
    EMERGENCY_FOOD: 'Emergency Food',
    STUDENT_MEALS: 'Student Meal Services',
    CHURCH_PANTRIES: 'Church-Based Food Pantries',
    FOOD_DELIVERY: 'Food Delivery Services',
    LOCAL_EFFORTS: 'Additional Local Efforts & Ways to Help',
    ADDITIONAL_RESOURCES: 'Additional Resources'
};

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

const mealTypeOrder: Record<string, number> = {
    BREAKFAST: 1,
    LUNCH: 2,
    DINNER: 3,
    OTHER: 4
};

const mealTypeLabels: Record<string, string> = {
    BREAKFAST: 'Breakfast',
    LUNCH: 'Lunch',
    DINNER: 'Dinner',
    OTHER: 'Other Public Meals'
};

function sectionIdFor(category: ResourceCategory) {
    return category.toLowerCase().replace(/_/g, '-');
}

function ResourceCard({ resource }: { resource: Resource }) {
    return (
        <div>
            <h3 className="text-xl font-semibold text-revolutionary-600 mb-2">
                {resource.title}

                {resource.lastUpdated && (
                    <div className="mt-0 mb-4 text-xs text-gray-500">
                        Last updated:{' '}
                        {formatLastUpdated(resource.lastUpdated)}
                    </div>
                )}
            </h3>

            {resource.description && (
                <p className="text-accent-800 mb-3">{resource.description}</p>
            )}

            <div className="space-y-2 text-sm text-accent-700">
                {resource.location && (
                    <div>
                        <strong className="text-accent-900">Location:</strong>{' '}
                        {resource.location}
                    </div>
                )}

                {resource.address && (
                    <div>
                        <strong className="text-accent-900">Address:</strong>{' '}
                        {resource.address}
                    </div>
                )}

                {resource.hours && (
                    <div>
                        <strong className="text-accent-900">Hours:</strong>{' '}
                        {resource.hours}
                    </div>
                )}

                {resource.phone && (
                    <div>
                        <strong className="text-accent-900">Phone:</strong>{' '}
                        <a
                            href={`tel:${resource.phone}`}
                            className="text-primary-600 hover:text-primary-700"
                        >
                            {resource.phone}
                        </a>
                    </div>
                )}

                {resource.email && (
                    <div>
                        <strong className="text-accent-900">Email:</strong>{' '}
                        <a
                            href={`mailto:${resource.email}`}
                            className="text-primary-600 hover:text-primary-700"
                        >
                            {resource.email}
                        </a>
                    </div>
                )}

                {resource.website && (
                    <div>
                        <strong className="text-accent-900">Website:</strong>{' '}
                        <a
                            href={resource.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 hover:text-primary-700"
                        >
                            {resource.website}
                        </a>
                    </div>
                )}

                {resource.requirements && (
                    <div>
                        <strong className="text-accent-900">
                            Requirements:
                        </strong>{' '}
                        {resource.requirements}
                    </div>
                )}

                {resource.notes && (
                    <div>
                        <strong className="text-accent-900">Notes:</strong>{' '}
                        {resource.notes}
                    </div>
                )}

                {resource.contactInfo && (
                    <div>
                        <strong className="text-accent-900">
                            Contact Info:
                        </strong>{' '}
                        {resource.contactInfo}
                    </div>
                )}
            </div>
        </div>
    );
}

function groupByCategory(resources: Resource[]) {
    const grouped = resources.reduce(
        (acc, resource) => {
            if (!acc[resource.category]) {
                acc[resource.category] = [];
            }
            acc[resource.category].push(resource);
            return acc;
        },
        {} as Record<ResourceCategory, Resource[]>
    );

    Object.keys(grouped).forEach((category) => {
        grouped[category as ResourceCategory].sort((a, b) => {
            // Special sorting for PUBLIC_MEALS: group by meal type first
            if (category === 'PUBLIC_MEALS') {
                const aOrder = mealTypeOrder[a.type] || 5;
                const bOrder = mealTypeOrder[b.type] || 5;

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

    return grouped;
}

export default function ResourcesPage() {
    const allResources = getResources();

    // ADDITIONAL_RESOURCES are other people's directories, rendered in their
    // own "External Resources" block (in YAML order) rather than as a
    // category section, and left out of the table of contents.
    const externalResources = allResources.filter(
        (resource) => resource.category === 'ADDITIONAL_RESOURCES'
    );
    const resources = allResources.filter(
        (resource) => resource.category !== 'ADDITIONAL_RESOURCES'
    );

    const resourcesByCategory = groupByCategory(resources);

    return (
        <div className="bg-accent-50">
            {/* Only the resources we list; the external directories below are
                other people's listings. */}
            <JsonLd data={resourceListSchema(resources)} />
            <Header />
            <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="prose prose-lg max-w-none">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold tracking-tight text-primary-700 mb-8">
                            Community Food Resources
                        </h1>
                    </div>

                    {/* Table of Contents */}
                    <div className="mb-10">
                        <h2 className="text-2xl font-bold text-center text-white bg-gray-700 px-4 py-2 rounded-lg border-l-4 border-primary-500 mb-6">
                            Quick Navigation
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

                                return (
                                    <div
                                        key={category}
                                        className="flex items-center justify-between py-3 border-b border-dotted border-gray-300 last:border-b-0 hover:bg-primary-50/50 rounded px-2 transition-colors"
                                    >
                                        <a
                                            href={`#${sectionIdFor(category)}`}
                                            className="text-gray-700 hover:text-primary-700 transition-colors font-medium"
                                        >
                                            {categoryLabels[category]}
                                            {category === 'PUBLIC_MEALS' && (
                                                <span className="text-sm text-accent-600 ml-2">
                                                    (Breakfast, Lunch & Dinner)
                                                </span>
                                            )}
                                        </a>
                                        <span className="text-sm text-accent-700 bg-accent-100/60 px-2 py-1 rounded-full">
                                            {categoryResources.length}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-red-800 mb-4">
                            How to Help
                        </h2>
                        <p className="text-accent-800 mb-4">
                            <strong>
                                Please check the websites of food banks and
                                churches that provide food for ways to
                                contribute.
                            </strong>{' '}
                            Keep in mind that monetary donations are typically
                            preferred by food banks and many organizations
                            because they can make the money go further with
                            wholesale/discount pricing and can ensure they meet
                            specific community needs and wants. Donating your
                            time is also a very valuable contribution!
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
                            External Resources
                        </h2>
                        <p className="text-accent-700 mb-4">
                            These projects are put together by other
                            organizations and community members. These projects
                            provide comprehensive information to find resources
                            spanning food scarecity, substance use support,
                            mental health, housing, and more.
                        </p>
                        <div className="space-y-4">
                            {externalResources.map((resource) => (
                                <ResourceCard
                                    key={resource.slug}
                                    resource={resource}
                                />
                            ))}
                        </div>
                    </div>

                    {categoryOrder.map((category) => {
                        const categoryResources = resourcesByCategory[category];
                        if (
                            !categoryResources ||
                            categoryResources.length === 0
                        ) {
                            return null;
                        }

                        return (
                            <section
                                key={category}
                                id={sectionIdFor(category)}
                                className="mb-12 scroll-mt-24"
                            >
                                <h2 className="text-2xl font-bold text-white bg-gray-700 px-4 py-2 rounded-lg border-l-4 border-primary-500 mb-6">
                                    {categoryLabels[category]}
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

                                            if (mealResources.length === 0)
                                                return null;

                                            return (
                                                <div
                                                    key={mealType}
                                                    className="mb-6"
                                                >
                                                    <h3 className="text-xl font-semibold text-revolutionary-600 mb-4 pb-2 border-b-2 border-revolutionary-200">
                                                        {
                                                            mealTypeLabels[
                                                                mealType
                                                            ]
                                                        }
                                                    </h3>
                                                    <div className="space-y-4">
                                                        {mealResources.map(
                                                            (resource) => (
                                                                <ResourceCard
                                                                    key={
                                                                        resource.slug
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
                                        {categoryResources.map((resource) => (
                                            <ResourceCard
                                                key={resource.slug}
                                                resource={resource}
                                            />
                                        ))}
                                    </div>
                                )}
                            </section>
                        );
                    })}

                    {resources.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-accent-600">
                                No resources available at this time.
                            </p>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}
