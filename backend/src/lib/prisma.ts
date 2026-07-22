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

import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

// Prisma 7 connects through a driver adapter rather than a URL in the schema.
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set');
}
const adapter = new PrismaBetterSqlite3({ url: databaseUrl });

// A single PrismaClient is shared across the whole app. Creating a client per
// route or per request opens a new connection each time, which under nodemon
// hot-reload (dev) or high traffic will exhaust connections and lock the
// SQLite database. Caching on globalThis keeps a single instance alive across
// module reloads in development.
const globalForPrisma = globalThis as unknown as {
    prisma?: PrismaClient;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}
