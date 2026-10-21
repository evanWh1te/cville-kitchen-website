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

import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';
import { z } from 'zod';

// Build-time content loader. Resources and volunteer opportunities live in
// hand-edited YAML under frontend/content/ and are validated when the site is
// built, so a bad edit fails the build rather than shipping.

const resourceCategory = z.enum([
    'PUBLIC_MEALS',
    'FREE_FRIDGES_PANTRIES',
    'EMERGENCY_FOOD',
    'STUDENT_MEALS',
    'CHURCH_PANTRIES',
    'FOOD_DELIVERY',
    'LOCAL_EFFORTS',
    'ADDITIONAL_RESOURCES'
]);

const resourceType = z.enum([
    'BREAKFAST',
    'LUNCH',
    'DINNER',
    'PANTRY',
    'FRIDGE',
    'DELIVERY',
    'MARKET',
    'PROGRAM',
    'OTHER'
]);

const volunteerCategory = z.enum([
    'FOOD_PREPARATION',
    'FOOD_DISTRIBUTION',
    'COMMUNITY_GARDENS',
    'ADMINISTRATIVE',
    'FUNDRAISING',
    'OUTREACH',
    'EDUCATION',
    'TRANSPORTATION',
    'EVENT_COORDINATION',
    'OTHER'
]);

const volunteerType = z.enum([
    'ONE_TIME',
    'RECURRING',
    'SEASONAL',
    'FLEXIBLE',
    'REMOTE',
    'ON_SITE',
    'LEADERSHIP',
    'TRAINING_PROVIDED'
]);

const slug = z
    .string()
    .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        'must be kebab-case (lowercase letters, digits, single hyphens)'
    );

// Calendar date as YYYY-MM-DD. The yaml v2 default schema leaves it a string.
const lastUpdated = z.iso.date();

const text = z.string();

// Strict objects: an unknown key (e.g. a typo like `adress`) is an error.
const resourceSchema = z.strictObject({
    slug,
    title: text.min(1),
    category: resourceCategory,
    type: resourceType,
    description: text.optional(),
    location: text.optional(),
    address: text.optional(),
    phone: text.optional(),
    email: text.optional(),
    website: text.optional(),
    hours: text.optional(),
    notes: text.optional(),
    requirements: text.optional(),
    contactInfo: text.optional(),
    lastUpdated: lastUpdated.optional()
});

const volunteerSchema = z.strictObject({
    slug,
    title: text.min(1),
    category: volunteerCategory,
    type: volunteerType,
    description: text.optional(),
    location: text.optional(),
    address: text.optional(),
    phone: text.optional(),
    email: text.optional(),
    website: text.optional(),
    hours: text.optional(),
    notes: text.optional(),
    requirements: text.optional(),
    contactInfo: text.optional(),
    timeCommitment: text.optional(),
    skills: text.optional(),
    lastUpdated: lastUpdated.optional()
});

export type Resource = z.infer<typeof resourceSchema>;
export type ResourceCategory = z.infer<typeof resourceCategory>;
export type ResourceType = z.infer<typeof resourceType>;
export type VolunteerOpportunity = z.infer<typeof volunteerSchema>;
export type VolunteerCategory = z.infer<typeof volunteerCategory>;
export type VolunteerType = z.infer<typeof volunteerType>;

function describeEntry(raw: unknown, index: number): string {
    const parts = [`entry #${index + 1}`];
    if (raw && typeof raw === 'object') {
        const { slug: s, title: t } = raw as Record<string, unknown>;
        if (typeof s === 'string') parts.push(`slug "${s}"`);
        else if (typeof t === 'string') parts.push(`title "${t}"`);
    }
    return parts.join(', ');
}

function loadList<T extends { slug: string }>(
    fileName: string,
    schema: z.ZodType<T>
): T[] {
    const filePath = path.join(process.cwd(), 'content', fileName);
    const label = `content/${fileName}`;

    let source: string;
    try {
        source = fs.readFileSync(filePath, 'utf8');
    } catch (error) {
        throw new Error(
            `${label}: cannot read ${filePath}: ${(error as Error).message}`
        );
    }

    let data: unknown;
    try {
        data = parse(source);
    } catch (error) {
        throw new Error(`${label}: invalid YAML: ${(error as Error).message}`);
    }

    // A file of only comments parses to null; treat it as an empty list.
    if (data === null || data === undefined) return [];
    if (!Array.isArray(data)) {
        throw new Error(`${label}: top level must be a list of entries`);
    }

    const entries: T[] = [];
    const seen = new Map<string, number>();

    data.forEach((raw, index) => {
        const result = schema.safeParse(raw);
        if (!result.success) {
            const issues = result.error.issues
                .map((issue) => {
                    const where = issue.path.length
                        ? `field "${issue.path.join('.')}"`
                        : 'entry';
                    return `  - ${where}: ${issue.message}`;
                })
                .join('\n');
            throw new Error(
                `${label}: ${describeEntry(raw, index)} is invalid:\n${issues}`
            );
        }

        const entry = result.data;
        const first = seen.get(entry.slug);
        if (first !== undefined) {
            throw new Error(
                `${label}: entry #${index + 1}, slug "${entry.slug}" duplicates entry #${first + 1}; slugs must be unique`
            );
        }
        seen.set(entry.slug, index);
        entries.push(entry);
    });

    return entries;
}

let resources: Resource[] | undefined;
let volunteers: VolunteerOpportunity[] | undefined;

export function getResources(): Resource[] {
    resources ??= loadList('resources.yaml', resourceSchema);
    return resources;
}

export function getVolunteerOpportunities(): VolunteerOpportunity[] {
    volunteers ??= loadList('volunteers.yaml', volunteerSchema);
    return volunteers;
}
