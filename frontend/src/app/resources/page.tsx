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

import { getMarkdownContent } from '@/lib/markdown';

export default async function ResourcesPage() {
    const markdownContent = await getMarkdownContent(
        'src/resources/foodResources.md'
    );

    return (
        <div className="bg-white">
            <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
                <div
                    className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-h1:text-4xl prose-h1:font-bold prose-h1:tracking-tight prose-h2:text-2xl prose-h2:font-bold prose-h3:text-xl prose-h3:font-semibold prose-a:text-blue-600 hover:prose-a:text-blue-800 prose-strong:text-gray-900"
                    dangerouslySetInnerHTML={{ __html: markdownContent }}
                />
            </div>
        </div>
    );
}
