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
const bodyFields = [
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
// Resources have no category field: it is the key each entry is listed under.
const resourceFields = ['slug', 'title', ...bodyFields, 'lastUpdated'];
const volunteerFields = [
    'slug',
    'title',
    'category',
    ...bodyFields,
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

// Active rows as { category, entry } pairs, sorted by category order then
// title. Inactive rows are skipped and counted.
function readRows(db, table, categoryOrder, fields, used) {
    const all = db.prepare(`SELECT * FROM ${table}`).all();
    const rows = all.filter((row) => row.isActive === 1);
    const skipped = all.length - rows.length;

    const rank = (category) => {
        const i = categoryOrder.indexOf(category);
        return i === -1 ? categoryOrder.length : i;
    };
    rows.sort(
        (a, b) =>
            rank(a.category) - rank(b.category) ||
            a.title.localeCompare(b.title)
    );

    const items = rows.map((row) => {
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
        return { category: row.category, entry };
    });
    return { items, skipped };
}

const enumList = (values) => values.map((v) => `#     ${v}`).join('\n');

// structure: the paragraph describing how the file is laid out.
// categoryField: the per-entry "category" field doc, or '' when the category
// is a top-level key instead.
function header({ what, structure, categoryField, extraFields, types }) {
    return `# ${what}
#
# This file is read and validated at build time (frontend/src/lib/content.ts).
# A mistake here fails \`next build\` with a message naming the entry and field.
${structure}
#
# Fields (R = required, O = optional; omit optional fields rather than leaving
# them empty):
#   slug            R  Unique kebab-case id: lowercase letters, digits, hyphens.
#   title           R  Display name.
${categoryField}#   type            R  One of:
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
    structure: `# The file is a mapping: each top-level key is a category, and under it is the
# list of entries in that category. Each entry is a block starting with
# \`- slug: ...\`. The category of an entry is the key it is listed under, so
# entries have no \`category\` field (writing one is an error).
# To remove an entry, delete it or comment it out. A category with no entries
# can be left out, or kept with nothing under it. Unknown categories and
# unknown fields are errors.
#
# Valid category keys:
${enumList(resourceOrder)}`,
    categoryField: '',
    extraFields: '',
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
    structure: `# The file is a list; each entry is a block starting with \`- slug: ...\`.
# To remove an entry, delete it or comment it out. Unknown fields are errors.`,
    categoryField: `#   category        R  One of:
${enumList(volunteerOrder)}
`,
    extraFields:
        '#   timeCommitment  O  Expected time commitment.\n#   skills          O  Skills needed or helpful.\n',
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

// Approximates the repo's Prettier settings (.prettierrc: 4-space indent,
// single quotes, 80 columns) so format-on-save changes little.
const toYaml = (data) =>
    stringify(data, { lineWidth: 80, indent: 4, singleQuote: true });

// Put a blank line before every entry and every category key (except the
// first line, and an entry directly under its category key), matching how the
// files are hand-formatted. entryStart matches the first line of an entry.
function withBlankLines(yamlText, entryStart) {
    const categoryKey = /^[A-Z][A-Z_]*:$/;
    const lines = yamlText.split('\n');
    const out = [];
    lines.forEach((line, i) => {
        const startsBlock = entryStart.test(line) || categoryKey.test(line);
        const afterKey = i > 0 && categoryKey.test(lines[i - 1]);
        if (i > 0 && startsBlock && !afterKey) out.push('');
        out.push(line);
    });
    return out.join('\n');
}

const db = new DatabaseSync(path.resolve(dbPath), { readOnly: true });

const resourceSlugs = new Set();
const resourceRows = readRows(
    db,
    'resources',
    resourceOrder,
    resourceFields,
    resourceSlugs
);
const resourceItems = resourceRows.items;
// Skip a static entry if the database already produced the same slug.
for (const { category, ...entry } of staticResources) {
    if (!resourceSlugs.has(entry.slug)) resourceItems.push({ category, entry });
}

// Group by category in display order; categories with no entries are omitted.
const resourcesByCategory = {};
for (const category of resourceOrder) {
    const entries = resourceItems
        .filter((item) => item.category === category)
        .map((item) => item.entry);
    if (entries.length > 0) resourcesByCategory[category] = entries;
}
const unknownCategories = new Set(
    resourceItems
        .map((item) => item.category)
        .filter((category) => !resourceOrder.includes(category))
);
if (unknownCategories.size > 0) {
    console.error(
        `Unknown resource categories in database: ${[...unknownCategories].join(', ')}`
    );
    process.exit(1);
}

const volunteerRows = readRows(
    db,
    'volunteer_opportunities',
    volunteerOrder,
    volunteerFields,
    new Set()
);
const volunteers = volunteerRows.items.map((item) => item.entry);

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(
    path.join(outDir, 'resources.yaml'),
    resourceHeader + withBlankLines(toYaml(resourcesByCategory), /^ {4}- /)
);
fs.writeFileSync(
    path.join(outDir, 'volunteers.yaml'),
    volunteerHeader + withBlankLines(toYaml(volunteers), /^- /)
);

console.log(
    `Wrote ${resourceItems.length} resources and ${volunteers.length} volunteer opportunities to ${outDir}`
);
console.log(
    `Skipped inactive rows: ${resourceRows.skipped} resources, ${volunteerRows.skipped} volunteer opportunities`
);
