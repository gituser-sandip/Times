# Backend Setup on Windows

PHP and Composer must be installed before the Laravel API can run.

## 1. Install PHP and Composer

Recommended with Windows Package Manager:

```powershell
winget install PHP.PHP.8.3
winget install Composer.Composer
```

Close and reopen PowerShell after installing, then verify:

```powershell
php -v
composer --version
```

## 2. Install Laravel Dependencies

From the project root:

```powershell
cd backend-laravel
composer install
```

## 3. Create Environment and SQLite Database

```powershell
Copy-Item .env.example .env
New-Item -ItemType File -Force database/database.sqlite
php artisan key:generate
php artisan migrate --seed
```

## 4. Start the API

```powershell
php artisan serve --host=127.0.0.1 --port=8000
```

The React app already points to:

```text
http://127.0.0.1:8000/api
```

## 5. Start the Frontend

In another PowerShell window from the project root:

```powershell
npm run dev
```

## Demo Account

The seeder creates:

```text
Email: demo@times.test
Password: password
```
