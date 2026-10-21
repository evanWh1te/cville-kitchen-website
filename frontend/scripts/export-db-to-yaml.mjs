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

// One-time export of the SQLite resources and volunteer opportunities into the
// hand-edited YAML files under frontend/content/.
//
// Usage: node frontend/scripts/export-db-to-yaml.mjs <database.db> [outDir]
//
// Uses Node's built-in node:sqlite (Node 22.13+), so it has no dependency on
// the backend. `yaml` resolves from frontend/node_modules.

import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { stringify } from 'yaml';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const [dbPath, outDirArg] = process.argv.slice(2);

if (!dbPath) {
    console.error(
        'Usage: node frontend/scripts/export-db-to-yaml.mjs <database.db> [outDir]'
    );
    process.exit(1);
}

const outDir = path.resolve(outDirArg ?? path.join(scriptDir, '..', 'content'));

// Display order, matching categoryOrder in the pages.
const resourceOrder = [
    'PUBLIC_MEALS',
    'FREE_FRIDGES_PANTRIES',
    'EMERGENCY_FOOD',
    'STUDENT_MEALS',
    'CHURCH_PANTRIES',
    'FOOD_DELIVERY',
    'LOCAL_EFFORTS',
    'ADDITIONAL_RESOURCES'
];

const volunteerOrder = [
    'ADMINISTRATIVE',
    'COMMUNITY_GARDENS',
    'EDUCATION',
    'EVENT_COORDINATION',
    'FOOD_DISTRIBUTION',
    'FOOD_PREPARATION',
    'FUNDRAISING',
    'OUTREACH',
    'TRANSPORTATION',
    'OTHER'
];

// Field order in the output. Required fields first.
const commonFields = [
    'slug',
    'title',
    'category',
    'type',
    'description',
    'location',
    'address',
    'phone',
    'email',
    'website',
    'hours',
    'requirements',
    'notes',
    'contactInfo'
];
const resourceFields = [...commonFields, 'lastUpdated'];
const volunteerFields = [
    ...commonFields,
    'timeCommitment',
    'skills',
    'lastUpdated'
];

// Hardcoded external directories formerly built in resources/page.tsx.
const staticResources = [
    {
        slug: 'street-sheet',
        title: 'Charlottesville Access Project - Street Sheet Resources',
        description:
            'Contains information on public meals, emergency food, church based pantries, kids/student meals, and food delivery services.',
        category: 'ADDITIONAL_RESOURCES',
        type: 'OTHER',
        website:
            'https://jmrl.org/sites/default/files/2025-02/StreetSheet-Edition31.pdf',
        email: 'cvillestreetsheet@gmail.com'
    },
    {
        slug: 'helpful-resource-by-city',
        title: '@helpfulresourcesbycity',
        description:
            'Available resources to reduce violence, poverty, drug overdoses, etc. by city.',
        category: 'ADDITIONAL_RESOURCES',
        type: 'OTHER',
        website: 'https://linktr.ee/helpfulresourcesbycity'
    },
    {
        slug: 'municipality',
        title: 'City of Charlottesville & Albemarle County Food Resources',
        description:
            'Links to emergency food, delivered food, and public meal resources',
        category: 'ADDITIONAL_RESOURCES',
        type: 'OTHER',
        website:
            'https://www.charlottesville.gov/377/Available-Food-Resources-in-the-Communit'
    }
];

function slugify(title) {
    return title
        .normalize('NFKD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/['‘’]/g, '')
        .replace(/&/g, ' and ')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function uniqueSlug(title, used) {
    const base = slugify(title) || 'entry';
    let candidate = base;
    for (let n = 2; used.has(candidate); n++) candidate = `${base}-${n}`;
    used.add(candidate);
    return candidate;
}

// Dates are stored by Prisma/SQLite as epoch milliseconds (integer); also
// accept ISO text in case a database was written some other way.
function toDateString(value) {
    if (value === null || value === undefined || value === '') return undefined;
    const date =
        typeof value === 'number' || /^\d+$/.test(String(value))
            ? new Date(Number(value))
            : new Date(value);
    if (Number.isNaN(date.getTime())) return undefined;
    return date.toISOString().slice(0, 10);
}

function readRows(db, table, categoryOrder, fields, used) {
    const rows = db
        .prepare(`SELECT * FROM ${table} WHERE isActive = 1`)
        .all();

    const rank = (category) => {
        const i = categoryOrder.indexOf(category);
        return i === -1 ? categoryOrder.length : i;
    };
    rows.sort(
        (a, b) =>
            rank(a.category) - rank(b.category) ||
            a.title.localeCompare(b.title)
    );

    return rows.map((row) => {
        const entry = {};
        for (const field of fields) {
            let value;
            if (field === 'slug') value = uniqueSlug(row.title, used);
            else if (field === 'lastUpdated')
                value = toDateString(row.lastUpdated);
            else value = row[field];

            if (value === null || value === undefined) continue;
            if (typeof value === 'string' && value.trim() === '') continue;
            entry[field] = value;
        }
        return entry;
    });
}

const enumList = (values) => values.map((v) => `#     ${v}`).join('\n');

function header({ what, extraFields, categories, types }) {
    return `# ${what}
#
# This file is read and validated at build time (frontend/src/lib/content.ts).
# A mistake here fails \`next build\` with a message naming the entry and field.
# The file is a list; each entry is a block starting with \`- slug: ...\`.
# To remove an entry, delete it or comment it out. Unknown fields are errors.
#
# Fields (R = required, O = optional; omit optional fields rather than leaving
# them empty):
#   slug            R  Unique kebab-case id: lowercase letters, digits, hyphens.
#   title           R  Display name.
#   category        R  One of:
${enumList(categories)}
#   type            R  One of:
${enumList(types)}
#   description     O  Short summary.
#   location        O  Place name.
#   address         O  Street address.
#   phone           O  Phone number (rendered as a tel: link).
#   email           O  Email address (rendered as a mailto: link).
#   website         O  Full URL including https:// (rendered as a link).
#   hours           O  When it is open or available.
#   requirements    O  Eligibility or what to bring.
#   notes           O  Anything else worth knowing.
#   contactInfo     O  Free-text contact details.
${extraFields}#   lastUpdated     O  Date the entry was last verified, written YYYY-MM-DD
#                      (for example 2025-11-13). Leave out for external links.
#
# Long text: use a block scalar (\`description: >-\` or \`|-\`) and indent the
# following lines. Quote values containing ": " or starting with special
# characters such as @, &, *, # or %.
#
# Display order on the site follows the page code, not this file; entries are
# listed here by category, then title, for easy scanning.

`;
}

const resourceHeader = header({
    what: 'Free food resources.',
    extraFields: '',
    categories: resourceOrder,
    types: [
        'BREAKFAST',
        'LUNCH',
        'DINNER',
        'PANTRY',
        'FRIDGE',
        'DELIVERY',
        'MARKET',
        'PROGRAM',
        'OTHER'
    ]
});

const volunteerHeader = header({
    what: 'Volunteer opportunities.',
    extraFields:
        '#   timeCommitment  O  Expected time commitment.\n#   skills          O  Skills needed or helpful.\n',
    categories: volunteerOrder,
    types: [
        'ONE_TIME',
        'RECURRING',
        'SEASONAL',
        'FLEXIBLE',
        'REMOTE',
        'ON_SITE',
        'LEADERSHIP',
        'TRAINING_PROVIDED'
    ]
});

function toYaml(entries) {
    return stringify(entries, { lineWidth: 100, indent: 2 });
}

const db = new DatabaseSync(path.resolve(dbPath), { readOnly: true });

const resourceSlugs = new Set();
const resources = readRows(
    db,
    'resources',
    resourceOrder,
    resourceFields,
    resourceSlugs
);
// Skip a static entry if the database already produced the same slug.
for (const entry of staticResources) {
    if (!resourceSlugs.has(entry.slug)) resources.push(entry);
}

const volunteers = readRows(
    db,
    'volunteer_opportunities',
    volunteerOrder,
    volunteerFields,
    new Set()
);

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(
    path.join(outDir, 'resources.yaml'),
    resourceHeader + toYaml(resources)
);
fs.writeFileSync(
    path.join(outDir, 'volunteers.yaml'),
    volunteerHeader + toYaml(volunteers)
);

console.log(
    `Wrote ${resources.length} resources and ${volunteers.length} volunteer opportunities to ${outDir}`
);
