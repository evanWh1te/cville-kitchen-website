#!/usr/bin/env bash
#
# Charlottesville Kitchen - Mutual Aid Organization Website
# Copyright (C) 2025 Evan White
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program. If not, see <https://www.gnu.org/licenses/>.
#
# Takes a consistent snapshot of the SQLite database and prunes old copies.
#
# Runs on the host against the bind-mounted database file, so it needs no
# running container and keeps working while the app serves traffic.
#
#   ./scripts/backup-db.sh
#   DB_PATH=/srv/kitchen/data/database.db BACKUP_DIR=/var/backups/kitchen \
#       RETENTION_DAYS=30 ./scripts/backup-db.sh
#
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

DB_PATH="${DB_PATH:-$REPO_ROOT/testdata/database.db}"
BACKUP_DIR="${BACKUP_DIR:-$REPO_ROOT/backups}"
RETENTION_DAYS="${RETENTION_DAYS:-30}"

log() { printf '%s  %s\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$*"; }
die() { printf '%s  ERROR: %s\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$*" >&2; exit 1; }

command -v sqlite3 >/dev/null 2>&1 \
    || die "sqlite3 is not installed (apt-get install sqlite3)"
[ -f "$DB_PATH" ] || die "database not found at $DB_PATH"

mkdir -p "$BACKUP_DIR"

STAMP="$(date '+%Y%m%d-%H%M%S')"
TARGET="$BACKUP_DIR/database-$STAMP.db"

# Two runs inside the same second would otherwise land on the same name and the
# second would silently overwrite the first.
SUFFIX=1
while [ -e "$TARGET" ] || [ -e "$TARGET.gz" ]; do
    TARGET="$BACKUP_DIR/database-$STAMP-$SUFFIX.db"
    SUFFIX=$((SUFFIX + 1))
done

# .backup uses SQLite's online backup API, which takes a consistent snapshot of
# a database that is being written to. Copying the file with cp does not, and
# can capture a torn page or miss a pending WAL commit.
log "backing up $DB_PATH"
sqlite3 "$DB_PATH" ".backup '$TARGET'" \
    || die "backup failed"

# A backup that cannot be read is worse than no backup, because it looks like
# one. Verify before we consider this a success and before pruning anything.
INTEGRITY="$(sqlite3 "$TARGET" 'PRAGMA integrity_check;' 2>&1 || true)"
if [ "$INTEGRITY" != "ok" ]; then
    rm -f "$TARGET"
    die "integrity check failed, discarded snapshot: $INTEGRITY"
fi

RESOURCES="$(sqlite3 "$TARGET" 'SELECT COUNT(*) FROM resources;' 2>/dev/null || echo '?')"
VOLUNTEERS="$(sqlite3 "$TARGET" 'SELECT COUNT(*) FROM volunteer_opportunities;' 2>/dev/null || echo '?')"

gzip -f "$TARGET"
TARGET="$TARGET.gz"

log "wrote $TARGET ($(du -h "$TARGET" | cut -f1); $RESOURCES resources, $VOLUNTEERS volunteer opportunities)"

# Prune only after a verified success, so a run of failures can never leave you
# with nothing.
DELETED="$(find "$BACKUP_DIR" -maxdepth 1 -name 'database-*.db.gz' -type f \
    -mtime "+$RETENTION_DAYS" -print -delete | wc -l)"
if [ "$DELETED" -gt 0 ]; then
    log "pruned $DELETED backup(s) older than $RETENTION_DAYS days"
fi

REMAINING="$(find "$BACKUP_DIR" -maxdepth 1 -name 'database-*.db.gz' -type f | wc -l)"
log "done, $REMAINING backup(s) retained"
