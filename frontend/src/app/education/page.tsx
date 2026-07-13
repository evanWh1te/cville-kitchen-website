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
    title: 'Political Education - Das Kitchen',
    description:
        'Learn about socialist principles, mutual aid theory, and building community power through collective action.'
};

export default function EducationPage() {
    return (
        <>
            <Header />
            <main className="flex-1">
                <section className="py-16 bg-accent-50">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6">
                        <div className="text-center mb-12">
                            <h1 className="text-4xl font-bold text-primary-700 mb-4">
                                Political Education
                            </h1>
                            <p className="text-xl text-accent-700 max-w-3xl mx-auto">
                                Understanding socialist principles and building
                                revolutionary community power through collective
                                action
                            </p>
                        </div>

                        <div className="prose prose-lg max-w-none space-y-12 prose-headings:text-primary-600 prose-h2:text-primary-700 prose-p:text-accent-800 prose-strong:text-revolutionary-700 prose-a:text-primary-600 hover:prose-a:text-primary-800">
                            {/* Mutual Aid as Revolutionary Practice */}
                            <section>
                                <h2 className="text-3xl font-semibold text-primary-700 mb-6">
                                    Mutual Aid as Revolutionary Practice
                                </h2>
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div>
                                        <p className="text-gray-700 mb-4">
                                            Mutual aid is not charity—it&apos;s
                                            a radical form of political
                                            resistance. While charity maintains
                                            existing power structures, mutual
                                            aid challenges them by creating
                                            alternative systems of care and
                                            support based on solidarity rather
                                            than hierarchy.
                                        </p>
                                        <p className="text-gray-700">
                                            Every act of mutual aid is a
                                            rejection of the capitalist
                                            principle that human worth is
                                            determined by market value. When we
                                            feed the hungry, house the homeless,
                                            or support the unemployed, we assert
                                            that all people deserve dignity and
                                            care regardless of their economic
                                            productivity.
                                        </p>
                                    </div>
                                    <div className="bg-red-50 p-6 rounded-lg">
                                        <h3 className="text-lg font-semibold text-red-900 mb-3">
                                            Key Principle: Solidarity, Not
                                            Charity
                                        </h3>
                                        <ul className="text-red-800 space-y-2">
                                            <li>
                                                • Mutual aid builds collective
                                                power
                                            </li>
                                            <li>
                                                • Charity reinforces existing
                                                hierarchies
                                            </li>
                                            <li>
                                                • We work with communities, not
                                                for them
                                            </li>
                                            <li>
                                                • Everyone has something to
                                                offer
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </section>

                            {/* Capitalism and Crisis */}
                            <section>
                                <h2 className="text-3xl font-semibold text-gray-900 mb-6">
                                    Understanding Capitalism&apos;s Failures
                                </h2>
                                <div className="space-y-6">
                                    <div className="bg-gray-50 p-6 rounded-lg">
                                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                            Why People Struggle Under Capitalism
                                        </h3>
                                        <div className="grid md:grid-cols-3 gap-6">
                                            <div>
                                                <h4 className="font-medium text-gray-900 mb-2">
                                                    Wage Exploitation
                                                </h4>
                                                <p className="text-gray-700 text-sm">
                                                    Workers are paid less than
                                                    the value they create, while
                                                    profits go to owners who may
                                                    not work at all.
                                                </p>
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-900 mb-2">
                                                    Artificial Scarcity
                                                </h4>
                                                <p className="text-gray-700 text-sm">
                                                    We have enough resources for
                                                    everyone, but capitalism
                                                    restricts access to maintain
                                                    profit margins.
                                                </p>
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-900 mb-2">
                                                    Commodified Needs
                                                </h4>
                                                <p className="text-gray-700 text-sm">
                                                    Basic human needs like
                                                    housing, healthcare, and
                                                    food are treated as
                                                    commodities to be bought and
                                                    sold.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Socialist Alternatives */}
                            <section>
                                <h2 className="text-3xl font-semibold text-gray-900 mb-6">
                                    Building Socialist Alternatives
                                </h2>
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                            What Is Socialism?
                                        </h3>
                                        <p className="text-gray-700 mb-4">
                                            Socialism is an economic system
                                            where workers collectively own and
                                            control the means of production.
                                            Instead of profits going to wealthy
                                            shareholders, the value created by
                                            work benefits everyone in the
                                            community.
                                        </p>
                                        <p className="text-gray-700 mb-4">
                                            Key socialist principles include:
                                        </p>
                                        <ul className="list-disc pl-6 text-gray-700 space-y-2">
                                            <li>
                                                Democratic control of workplaces
                                            </li>
                                            <li>
                                                Public ownership of essential
                                                services
                                            </li>
                                            <li>
                                                Production for need, not profit
                                            </li>
                                            <li>
                                                From each according to ability,
                                                to each according to need
                                            </li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                            Prefigurative Politics
                                        </h3>
                                        <p className="text-gray-700 mb-4">
                                            We don&apos;t have to wait for
                                            revolution to start building the
                                            world we want. Through mutual aid,
                                            we can practice socialist values
                                            today:
                                        </p>
                                        <div className="bg-blue-50 p-4 rounded-lg">
                                            <ul className="text-blue-800 space-y-2">
                                                <li>
                                                    •{' '}
                                                    <strong>
                                                        Collective
                                                        decision-making
                                                    </strong>{' '}
                                                    in our organizations
                                                </li>
                                                <li>
                                                    •{' '}
                                                    <strong>
                                                        Resource sharing
                                                    </strong>{' '}
                                                    based on need, not ability
                                                    to pay
                                                </li>
                                                <li>
                                                    •{' '}
                                                    <strong>
                                                        Horizontal relationships
                                                    </strong>{' '}
                                                    instead of top-down
                                                    hierarchies
                                                </li>
                                                <li>
                                                    • <strong>Care work</strong>{' '}
                                                    valued equally with other
                                                    labor
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Class Consciousness */}
                            <section>
                                <h2 className="text-3xl font-semibold text-gray-900 mb-6">
                                    Developing Class Consciousness
                                </h2>
                                <div className="space-y-6">
                                    <p className="text-gray-700 text-lg">
                                        Class consciousness means understanding
                                        that our individual struggles are
                                        connected to larger systems of
                                        oppression, and that we have more power
                                        when we organize together.
                                    </p>

                                    <div className="grid md:grid-cols-3 gap-6">
                                        <div className="border-l-4 border-red-500 pl-4">
                                            <h3 className="font-semibold text-gray-900 mb-2">
                                                Working Class
                                            </h3>
                                            <p className="text-gray-700 text-sm">
                                                People who must work for wages
                                                to survive, including
                                                unemployed, disabled, and
                                                retired workers.
                                            </p>
                                        </div>
                                        <div className="border-l-4 border-yellow-500 pl-4">
                                            <h3 className="font-semibold text-gray-900 mb-2">
                                                Petit Bourgeoisie
                                            </h3>
                                            <p className="text-gray-700 text-sm">
                                                Small business owners, some
                                                professionals—caught between
                                                workers and capitalists.
                                            </p>
                                        </div>
                                        <div className="border-l-4 border-purple-500 pl-4">
                                            <h3 className="font-semibold text-gray-900 mb-2">
                                                Capitalist Class
                                            </h3>
                                            <p className="text-gray-700 text-sm">
                                                Those who own significant means
                                                of production and profit from
                                                others&apos; labor.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Intersectionality and Liberation */}
                            <section>
                                <h2 className="text-3xl font-semibold text-gray-900 mb-6">
                                    Intersectionality and Liberation
                                </h2>
                                <div className="bg-green-50 p-6 rounded-lg mb-6">
                                    <p className="text-green-800 mb-4">
                                        <strong>
                                            Our socialism must be
                                            intersectional.
                                        </strong>{' '}
                                        We cannot achieve economic justice while
                                        ignoring racism, sexism, transphobia,
                                        ableism, and other forms of oppression.
                                    </p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                            Multiple Systems of Oppression
                                        </h3>
                                        <p className="text-gray-700 mb-4">
                                            Capitalism intersects with and
                                            reinforces other systems of
                                            oppression:
                                        </p>
                                        <ul className="list-disc pl-6 text-gray-700 space-y-2">
                                            <li>
                                                Racism divides workers and
                                                creates super-exploited
                                                populations
                                            </li>
                                            <li>
                                                Patriarchy devalues care work
                                                typically done by women
                                            </li>
                                            <li>
                                                Ableism excludes disabled people
                                                from economic participation
                                            </li>
                                            <li>
                                                Imperialism extracts wealth from
                                                the Global South
                                            </li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                            Liberation for All
                                        </h3>
                                        <p className="text-gray-700 mb-4">
                                            True socialism means liberation for
                                            everyone. Our mutual aid work must
                                            center the most marginalized and
                                            work to dismantle all forms of
                                            oppression simultaneously.
                                        </p>
                                        <div className="bg-purple-50 p-4 rounded-lg">
                                            <p className="text-purple-800 text-sm italic">
                                                &ldquo;None of us are free until
                                                all of us are free.&rdquo;
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Strategy and Action */}
                            <section>
                                <h2 className="text-3xl font-semibold text-gray-900 mb-6">
                                    From Theory to Action
                                </h2>
                                <div className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                                Dual Power Strategy
                                            </h3>
                                            <p className="text-gray-700 mb-4">
                                                We build alternative
                                                institutions while also
                                                challenging existing power
                                                structures:
                                            </p>
                                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                                                <li>
                                                    Mutual aid networks that
                                                    meet immediate needs
                                                </li>
                                                <li>
                                                    Worker cooperatives that
                                                    practice economic democracy
                                                </li>
                                                <li>
                                                    Community land trusts that
                                                    decommodify housing
                                                </li>
                                                <li>
                                                    Political organizing for
                                                    systemic change
                                                </li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                                Building Movement
                                            </h3>
                                            <p className="text-gray-700 mb-4">
                                                Individual acts of mutual aid
                                                become powerful when connected
                                                to broader movements for social
                                                change:
                                            </p>
                                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                                                <li>
                                                    Labor organizing and union
                                                    building
                                                </li>
                                                <li>
                                                    Tenant organizing for
                                                    housing justice
                                                </li>
                                                <li>
                                                    Anti-racist and
                                                    decolonization work
                                                </li>
                                                <li>
                                                    Environmental and climate
                                                    justice
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
