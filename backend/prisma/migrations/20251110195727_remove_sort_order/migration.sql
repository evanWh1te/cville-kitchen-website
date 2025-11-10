/*
  Warnings:

  - You are about to drop the column `sortOrder` on the `resources` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_resources" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "location" TEXT,
    "address" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "hours" TEXT,
    "notes" TEXT,
    "requirements" TEXT,
    "contactInfo" TEXT,
    "lastUpdated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_resources" ("address", "category", "contactInfo", "createdAt", "description", "email", "hours", "id", "isActive", "lastUpdated", "location", "notes", "phone", "requirements", "title", "type", "updatedAt", "website") SELECT "address", "category", "contactInfo", "createdAt", "description", "email", "hours", "id", "isActive", "lastUpdated", "location", "notes", "phone", "requirements", "title", "type", "updatedAt", "website" FROM "resources";
DROP TABLE "resources";
ALTER TABLE "new_resources" RENAME TO "resources";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
