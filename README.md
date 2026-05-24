# Times Watch Store

Times is a React ecommerce experience for premium watches. It includes a modern storefront, catalog filtering, product quick view, cart quantity controls, checkout, saved watches, comparison, and Laravel API integration.

## Features

- React and Vite project setup
- Tailwind CSS integrated through PostCSS
- Laravel API backend source in `backend-laravel/`
- Professional responsive ecommerce UI
- Search, brand filters, category filters, and sorting
- Product cards with pricing, ratings, and watch details
- Shopping bag drawer with quantity controls
- Product detail modal with gallery, specs, warranty, delivery, and reviews
- Separate Saved Watches and Compare pages
- Sign in, registration, and account summary UI
- Multi-step checkout with shipping and payment screens
- Customer review form

## Backend

The Laravel backend source is in `backend-laravel/`. It includes:

- Sanctum token auth for register, login, and logout
- Product API
- Review API
- Order API
- SQLite-ready migrations
- Product seed data

PHP and Composer are required to install and run the backend:

```bash
cd backend-laravel
composer install
copy .env.example .env
type nul > database\database.sqlite
php artisan key:generate
php artisan migrate --seed
php artisan serve --host=127.0.0.1 --port=8000
```

On Windows, see [backend-laravel/SETUP-WINDOWS.md](backend-laravel/SETUP-WINDOWS.md). After PHP and Composer are installed, you can also run:

```powershell
cd backend-laravel
.\setup-backend.ps1
php artisan serve --host=127.0.0.1 --port=8000
```

The React app calls `http://127.0.0.1:8000/api` by default. If Laravel is not running, the app falls back to local demo data and shows a backend status message.

## Getting Started

Install dependencies:

```bash
npm install
```

Run the local development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

```text
Times/
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── src/
│   ├── main.jsx
│   └── styles.css
├── backend-laravel/
├── images/
├── pages/product/images/
└── fonts/
```

Old static HTML/CSS/JS pages were removed. The main site now runs from `src/main.jsx`.
