#!/bin/sh

# ── Generate .env from .env.example if it doesn't already exist ──────────────
if [ ! -f /var/www/.env ]; then
    echo "No .env found – copying from .env.example"
    cp /var/www/.env.example /var/www/.env
fi

# ── Override key variables with Render environment variables if set ───────────
sed -i "s|^APP_ENV=.*|APP_ENV=${APP_ENV:-production}|" /var/www/.env
sed -i "s|^APP_DEBUG=.*|APP_DEBUG=${APP_DEBUG:-false}|" /var/www/.env

if [ -n "$APP_URL" ]; then
    sed -i "s|^APP_URL=.*|APP_URL=${APP_URL}|" /var/www/.env
fi
if [ -n "$FRONTEND_URL" ]; then
    sed -i "s|^FRONTEND_URL=.*|FRONTEND_URL=${FRONTEND_URL}|" /var/www/.env
fi
if [ -n "$SANCTUM_STATEFUL_DOMAINS" ]; then
    sed -i "s|^SANCTUM_STATEFUL_DOMAINS=.*|SANCTUM_STATEFUL_DOMAINS=${SANCTUM_STATEFUL_DOMAINS}|" /var/www/.env
fi

# ── Set APP_KEY ───────────────────────────────────────────────────────────────
if [ -n "$APP_KEY" ]; then
    sed -i "s|^APP_KEY=.*|APP_KEY=${APP_KEY}|" /var/www/.env
else
    CURRENT_KEY=$(grep "^APP_KEY=" /var/www/.env | cut -d'=' -f2)
    if [ -z "$CURRENT_KEY" ]; then
        echo "Generating APP_KEY..."
        php artisan key:generate --force
    fi
fi

# ── Configure Database ────────────────────────────────────────────────────────
if [ -n "$DB_CONNECTION" ]; then
    sed -i "s|^DB_CONNECTION=.*|DB_CONNECTION=${DB_CONNECTION}|" /var/www/.env
fi

if [ "$DB_CONNECTION" = "pgsql" ] && [ -n "$DATABASE_URL" ]; then
    # Parse postgresql://user:password@host:port/dbname
    # Strip the scheme
    DB_USERINFO=$(echo "$DATABASE_URL" | sed 's|postgresql://||' | sed 's|postgres://||')
    DB_USER=$(echo "$DB_USERINFO" | cut -d':' -f1)
    DB_PASS=$(echo "$DB_USERINFO" | cut -d':' -f2 | cut -d'@' -f1)
    DB_HOSTPORT=$(echo "$DB_USERINFO" | cut -d'@' -f2)
    DB_HOST=$(echo "$DB_HOSTPORT" | cut -d':' -f1 | cut -d'/' -f1)
    DB_PORT=$(echo "$DB_HOSTPORT" | cut -d':' -f2 | cut -d'/' -f1)
    DB_NAME=$(echo "$DB_HOSTPORT" | cut -d'/' -f2 | cut -d'?' -f1)

    # If port is not in URL default to 5432
    if [ -z "$DB_PORT" ] || [ "$DB_PORT" = "$DB_HOST" ]; then
        DB_PORT=5432
    fi

    # Write parsed vars to .env
    grep -q "^DB_HOST=" /var/www/.env && sed -i "s|^DB_HOST=.*|DB_HOST=${DB_HOST}|" /var/www/.env || echo "DB_HOST=${DB_HOST}" >> /var/www/.env
    grep -q "^DB_PORT=" /var/www/.env && sed -i "s|^DB_PORT=.*|DB_PORT=${DB_PORT}|" /var/www/.env || echo "DB_PORT=${DB_PORT}" >> /var/www/.env
    grep -q "^DB_DATABASE=" /var/www/.env && sed -i "s|^DB_DATABASE=.*|DB_DATABASE=${DB_NAME}|" /var/www/.env || echo "DB_DATABASE=${DB_NAME}" >> /var/www/.env
    grep -q "^DB_USERNAME=" /var/www/.env && sed -i "s|^DB_USERNAME=.*|DB_USERNAME=${DB_USER}|" /var/www/.env || echo "DB_USERNAME=${DB_USER}" >> /var/www/.env
    grep -q "^DB_PASSWORD=" /var/www/.env && sed -i "s|^DB_PASSWORD=.*|DB_PASSWORD=${DB_PASS}|" /var/www/.env || echo "DB_PASSWORD=${DB_PASS}" >> /var/www/.env

    echo "PostgreSQL configured: host=${DB_HOST} port=${DB_PORT} db=${DB_NAME} user=${DB_USER}"
fi

# ── Ensure SQLite database file exists (only for SQLite) ─────────────────────
if [ "${DB_CONNECTION:-sqlite}" = "sqlite" ]; then
    if [ ! -f /var/www/database/database.sqlite ]; then
        touch /var/www/database/database.sqlite
        chown www-data:www-data /var/www/database/database.sqlite
    fi
fi

# ── Fix storage permissions ───────────────────────────────────────────────────
chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache
chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# ── Clear any cached config (important before re-caching) ────────────────────
php artisan config:clear

# ── Cache configurations for production ──────────────────────────────────────
php artisan config:cache
php artisan route:cache
php artisan view:cache

# ── Run database migrations ───────────────────────────────────────────────────
php artisan migrate --force

# ── Seed database ─────────────────────────────────────────────────────────────
php artisan db:seed --force 2>/dev/null || true

# ── Start PHP-FPM in the background ──────────────────────────────────────────
php-fpm -D

# ── Start Nginx in the foreground ────────────────────────────────────────────
nginx -g "daemon off;"