#!/bin/sh
mc alias set local http://localhost:9000 "$MINIO_ROOT_USER" "$MINIO_ROOT_PASSWORD"
mc ls local/voral >/dev/null 2>&1 || mc mb local/voral
exec "$@"
