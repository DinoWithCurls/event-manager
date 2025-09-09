#!/bin/sh
set -e

# Wait for DB before running app
/wait-for-db.sh db uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload