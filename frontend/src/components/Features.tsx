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

export default function Features() {
    const features = [
        {
            title: 'Food Security',
            description:
                'Community kitchens, food pantries, and nutrition education programs ensuring no one goes hungry.',
            icon: '🍽️'
        },
        {
            title: 'Housing Support',
            description:
                'Tenant organizing, eviction prevention, and emergency housing assistance for community members.',
            icon: '🏠'
        },
        {
            title: 'Emergency Aid',
            description:
                'Rapid response network for crisis situations, connecting people with immediate resources.',
            icon: '🚨'
        },
        {
            title: 'Community Building',
            description:
                'Regular events, workshops, and gatherings that strengthen neighborhood connections.',
            icon: '🤝'
        },
        {
            title: 'Resource Sharing',
            description:
                'Tool libraries, skill shares, and resource exchanges that build community resilience.',
            icon: '📚'
        },
        {
            title: 'Advocacy & Organizing',
            description:
                'Policy advocacy and grassroots organizing for systemic change in our community.',
            icon: '📢'
        }
    ];

    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 font-heading mb-4">
                        How We Support Our Community
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Through direct action and mutual aid, we address
                        immediate needs while building long-term community
                        power.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
                        >
                            <div className="text-4xl mb-4">{feature.icon}</div>
                            <h3 className="text-xl font-semibold text-gray-900 font-heading mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-gray-700">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-16 bg-white rounded-lg p-8 shadow-sm">
                    <div className="text-center">
                        <h3 className="text-2xl font-semibold text-gray-900 font-heading mb-4">
                            Our Impact
                        </h3>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div>
                                <div className="text-3xl font-bold text-primary-600 mb-2">
                                    500+
                                </div>
                                <div className="text-gray-700">
                                    Families Supported
                                </div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-primary-600 mb-2">
                                    50+
                                </div>
                                <div className="text-gray-700">Volunteers</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-primary-600 mb-2">
                                    12
                                </div>
                                <div className="text-gray-700">
                                    Programs Running
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
