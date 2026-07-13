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

import fs from 'fs';
import path from 'path';
import { remark } from 'remark';
import remarkHtml from 'remark-html';
import remarkGfm from 'remark-gfm';

export async function getMarkdownContent(filePath: string): Promise<string> {
    try {
        const fullPath = path.join(process.cwd(), filePath);
        const fileContents = fs.readFileSync(fullPath, 'utf8');

        const processedContent = await remark()
            .use(remarkGfm)
            .use(remarkHtml)
            .process(fileContents);

        return processedContent.toString();
    } catch (error) {
        console.error('Error reading markdown file:', error);
        return '<p>Error loading content</p>';
    }
}
