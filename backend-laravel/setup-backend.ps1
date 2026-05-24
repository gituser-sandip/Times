$ErrorActionPreference = "Stop"

if (-not (Get-Command php -ErrorAction SilentlyContinue)) {
  Write-Host "PHP is not installed or not on PATH. Install it first:" -ForegroundColor Yellow
  Write-Host "winget install PHP.PHP.8.3"
  exit 1
}

if (-not (Get-Command composer -ErrorAction SilentlyContinue)) {
  Write-Host "Composer is not installed or not on PATH. Install it first:" -ForegroundColor Yellow
  Write-Host "winget install Composer.Composer"
  exit 1
}

composer install

if (-not (Test-Path ".env")) {
  Copy-Item ".env.example" ".env"
}

if (-not (Test-Path "database")) {
  New-Item -ItemType Directory -Path "database" | Out-Null
}

if (-not (Test-Path "database/database.sqlite")) {
  New-Item -ItemType File -Path "database/database.sqlite" | Out-Null
}

php artisan key:generate
php artisan migrate --seed

Write-Host "Backend is ready. Start it with:" -ForegroundColor Green
Write-Host "php artisan serve --host=127.0.0.1 --port=8000"
