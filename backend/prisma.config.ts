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

// Prisma 7 configuration. Replaces the deprecated `package.json#prisma` key.
// Prisma 7 no longer reads the connection URL from the schema's datasource
// block, so the URL used by Migrate/CLI lives here; the runtime connection is
// provided to PrismaClient via a driver adapter in src/lib/prisma.ts.
import 'dotenv/config';
import path from 'node:path';
import { defineConfig } from 'prisma/config';

export default defineConfig({
    schema: path.join('prisma', 'schema.prisma'),
    migrations: {
        seed: 'ts-node prisma/seed.ts'
    },
    datasource: {
        url: process.env.DATABASE_URL
    }
});
