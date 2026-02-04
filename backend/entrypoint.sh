#!/bin/sh
set -e

# Run migrations, collectstatic, then exec the CMD
python manage.py migrate --noinput
python manage.py collectstatic --noinput

exec "$@"
