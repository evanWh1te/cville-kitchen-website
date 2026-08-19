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

// Absolute base URL for canonical links, Open Graph tags, the sitemap, and
// structured data. Only ever read on the server, so it needs no NEXT_PUBLIC_
// prefix. Note that statically prerendered pages bake their canonical URL at
// build time, so overriding this for a staging deploy means setting it for
// the build, not just the container.
export const SITE_URL = (
    process.env.SITE_URL || 'https://cville.kitchen'
).replace(/\/$/, '');

export const SITE_NAME = 'Charlottesville Kitchen';

export function absoluteUrl(path: string) {
    return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}
