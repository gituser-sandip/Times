#!/bin/sh

# ── Generate .env from .env.example if it doesn't already exist ──────────────
if [ ! -f /var/www/.env ]; then
    echo "No .env found – copying from .env.example"
    cp /var/www/.env.example /var/www/.env
fi

# ── Override key variables with Render environment variables if set ───────────
# APP_ENV
sed -i "s|^APP_ENV=.*|APP_ENV=${APP_ENV:-production}|" /var/www/.env
# APP_DEBUG (default false in production)
sed -i "s|^APP_DEBUG=.*|APP_DEBUG=${APP_DEBUG:-false}|" /var/www/.env
# APP_URL  (set this in Render dashboard as your backend service URL)
if [ -n "$APP_URL" ]; then
    sed -i "s|^APP_URL=.*|APP_URL=${APP_URL}|" /var/www/.env
fi
# FRONTEND_URL (set this in Render dashboard as your frontend service URL)
if [ -n "$FRONTEND_URL" ]; then
    sed -i "s|^FRONTEND_URL=.*|FRONTEND_URL=${FRONTEND_URL}|" /var/www/.env
fi
# SANCTUM_STATEFUL_DOMAINS
if [ -n "$SANCTUM_STATEFUL_DOMAINS" ]; then
    sed -i "s|^SANCTUM_STATEFUL_DOMAINS=.*|SANCTUM_STATEFUL_DOMAINS=${SANCTUM_STATEFUL_DOMAINS}|" /var/www/.env
fi
# DB_CONNECTION / DB_DATABASE (override if using Postgres on Render)
if [ -n "$DB_CONNECTION" ]; then
    sed -i "s|^DB_CONNECTION=.*|DB_CONNECTION=${DB_CONNECTION}|" /var/www/.env
fi
if [ -n "$DATABASE_URL" ]; then
    echo "DB_URL=${DATABASE_URL}" >> /var/www/.env
fi

# ── Set APP_KEY if not already set ───────────────────────────────────────────
if [ -n "$APP_KEY" ]; then
    sed -i "s|^APP_KEY=.*|APP_KEY=${APP_KEY}|" /var/www/.env
else
    # Generate key if blank
    CURRENT_KEY=$(grep "^APP_KEY=" /var/www/.env | cut -d'=' -f2)
    if [ -z "$CURRENT_KEY" ]; then
        echo "Generating APP_KEY..."
        php artisan key:generate --force
    fi
fi

# ── Fix storage permissions (needed after copy) ───────────────────────────────
chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache
chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# ── Cache configurations for production ──────────────────────────────────────
php artisan config:cache
php artisan route:cache
php artisan view:cache

# ── Ensure SQLite database file exists ───────────────────────────────────────
if [ ! -f /var/www/database/database.sqlite ]; then
    touch /var/www/database/database.sqlite
    chown www-data:www-data /var/www/database/database.sqlite
fi

# ── Run database migrations automatically ─────────────────────────────────────
php artisan migrate --force

# ── Seed database if it is empty ─────────────────────────────────────────────
php artisan db:seed --force 2>/dev/null || true

# ── Start PHP-FPM in the background ──────────────────────────────────────────
php-fpm -D

# ── Start Nginx in the foreground ────────────────────────────────────────────
nginx -g "daemon off;"