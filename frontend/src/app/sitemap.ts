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

import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/site';
import { getResources, getVolunteerOpportunities } from '@/lib/content';

export const dynamic = 'force-static';

// Most recent lastUpdated across a set of records. A lastmod is only worth
// publishing if it is true, so this reports what the data actually says
// rather than stamping "now" on every generation.
function latestUpdate(items: { lastUpdated?: string }[]): Date | undefined {
    const times = items
        .map((item) => (item.lastUpdated ? Date.parse(item.lastUpdated) : NaN))
        .filter((time) => !Number.isNaN(time));

    return times.length ? new Date(Math.max(...times)) : undefined;
}

export default function sitemap(): MetadataRoute.Sitemap {
    const resources = getResources();
    const volunteers = getVolunteerOpportunities();

    return [
        {
            url: absoluteUrl('/'),
            changeFrequency: 'monthly',
            priority: 1
        },
        {
            url: absoluteUrl('/resources'),
            lastModified: latestUpdate(resources),
            changeFrequency: 'weekly',
            priority: 0.9
        },
        {
            url: absoluteUrl('/volunteer'),
            lastModified: latestUpdate(volunteers),
            changeFrequency: 'weekly',
            priority: 0.8
        },
        {
            url: absoluteUrl('/education'),
            changeFrequency: 'monthly',
            priority: 0.6
        },
        {
            url: absoluteUrl('/about'),
            changeFrequency: 'yearly',
            priority: 0.5
        },
        {
            url: absoluteUrl('/contact'),
            changeFrequency: 'yearly',
            priority: 0.5
        },
        {
            url: absoluteUrl('/privacy'),
            changeFrequency: 'yearly',
            priority: 0.1
        },
        {
            url: absoluteUrl('/terms'),
            changeFrequency: 'yearly',
            priority: 0.1
        }
    ];
}
