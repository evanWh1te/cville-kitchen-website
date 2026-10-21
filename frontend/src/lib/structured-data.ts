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

import type { Resource } from '@/lib/content';
import { SITE_NAME, SITE_URL, absoluteUrl } from '@/lib/site';

// Drop keys whose value is absent so optional database columns never turn into
// empty strings or nulls in the output, which validators flag.
function compact<T extends Record<string, unknown>>(obj: T) {
    return Object.fromEntries(
        Object.entries(obj).filter(
            ([, value]) => value !== undefined && value !== null && value !== ''
        )
    );
}

export function siteSchema() {
    return {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Organization',
                '@id': absoluteUrl('/#organization'),
                name: SITE_NAME,
                url: SITE_URL,
                description:
                    'A Charlottesville mutual aid project connecting neighbors to free food resources and volunteer opportunities.',
                areaServed: {
                    '@type': 'AdministrativeArea',
                    name: 'Charlottesville, Virginia'
                }
            },
            {
                '@type': 'WebSite',
                '@id': absoluteUrl('/#website'),
                name: SITE_NAME,
                url: SITE_URL,
                publisher: { '@id': absoluteUrl('/#organization') }
            }
        ]
    };
}

/*
 * Each resource is a real organization or place handing out food, so it maps to
 * Organization. Deliberately omitted:
 *
 * - hours, because the column is free text ("Tuesday-Friday, 10:30am-12pm",
 *   "call ahead") and openingHours expects a strict format. Publishing an
 *   invalid or guessed value is worse than publishing none.
 * - address as PostalAddress, because the column is a single unparsed line.
 *   schema.org accepts plain text for address, which is honest about what we
 *   actually know.
 */
export function resourceListSchema(resources: Resource[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Free food resources in Charlottesville',
        description:
            'Public meals, community fridges and pantries, emergency food, student meals, church pantries, and food delivery services in the Charlottesville area.',
        url: absoluteUrl('/resources'),
        numberOfItems: resources.length,
        itemListElement: resources.map((resource, index) =>
            compact({
                '@type': 'ListItem',
                position: index + 1,
                item: compact({
                    '@type': 'Organization',
                    name: resource.title,
                    description: resource.description,
                    address: resource.address || resource.location,
                    telephone: resource.phone,
                    email: resource.email,
                    url: resource.website
                })
            })
        )
    };
}
