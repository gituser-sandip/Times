# Times Laravel Backend

This folder contains the Laravel API source for the React ecommerce app.

PHP, Composer, and Docker are not currently installed on this machine, so the backend source is prepared but cannot be installed or served here yet.

## Install

From this folder:

```bash
composer install
copy .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve --host=127.0.0.1 --port=8000
```

Then run the React frontend with:

```bash
npm run dev
```

The frontend calls `http://127.0.0.1:8000/api` by default. You can override it with:

```bash
VITE_API_URL=http://127.0.0.1:8000/api npm run dev
```

## API

- `POST /api/register`
- `POST /api/login`
- `POST /api/logout`
- `GET /api/products`
- `POST /api/products/{product}/reviews`
- `POST /api/orders`

Protected endpoints use Laravel Sanctum bearer tokens.
