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

import type { Resource, VolunteerOpportunity } from '@/lib/api';

// Server components talk to the backend directly rather than going through the
// /api proxy routes, which only exist to give the browser a same-origin path.
const INTERNAL_BASE = (
    process.env.BACKEND_INTERNAL_URL || 'http://127.0.0.1:3001/api'
).replace(/\/$/, '');

// Cache tags for the public listings. Admin writes flow through the /api proxy
// routes, which drop the matching tag so edits show up immediately. The time
// window below is only a backstop for changes the proxy never sees (a direct
// database edit, or a write that landed while the app was restarting).
export const PUBLIC_DATA_TAGS = {
    resources: 'public:resources',
    volunteers: 'public:volunteers'
} as const;

export const PUBLIC_DATA_REVALIDATE_SECONDS = 3600;

export interface FetchResult<T> {
    data: T[];
    error: string | null;
}

async function fetchPublicList<T>(
    path: string,
    key: string,
    tag: string,
    errorMessage: string
): Promise<FetchResult<T>> {
    try {
        const res = await fetch(`${INTERNAL_BASE}${path}`, {
            headers: { accept: 'application/json' },
            next: {
                revalidate: PUBLIC_DATA_REVALIDATE_SECONDS,
                tags: [tag]
            }
        });

        if (!res.ok) {
            throw new Error(`Backend responded ${res.status}`);
        }

        const body = await res.json();
        return { data: (body?.[key] as T[]) ?? [], error: null };
    } catch (err) {
        console.error(`Failed to fetch ${path}:`, err);
        return { data: [], error: errorMessage };
    }
}

export function getResources(): Promise<FetchResult<Resource>> {
    return fetchPublicList<Resource>(
        '/resources',
        'resources',
        PUBLIC_DATA_TAGS.resources,
        'Unable to load resources at this time. Please try again later.'
    );
}

export function getVolunteerOpportunities(): Promise<
    FetchResult<VolunteerOpportunity>
> {
    return fetchPublicList<VolunteerOpportunity>(
        '/volunteers',
        'volunteers',
        PUBLIC_DATA_TAGS.volunteers,
        'Failed to load volunteer opportunities. Please try again later.'
    );
}
