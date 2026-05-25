FROM php:8.2-fpm

# Install system dependencies and Nginx
RUN apt-get update && apt-get install -y \
    nginx \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libpq-dev \
    zip \
    unzip

# Clear cache to keep the image small
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions (pdo_pgsql is required for Render's database)
RUN docker-php-ext-install pdo_pgsql mbstring exif pcntl bcmath gd

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set the working directory inside the container
WORKDIR /var/www

# Copy all application files to the container
COPY . /var/www

# Install Composer dependencies (Optimized for production)
RUN composer install --no-dev --optimize-autoloader

# Set proper permissions for Laravel's cache and storage folders
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache\
    && chmod -R 775 /var/www/storage \
    && chmod -R 775 /var/www/bootstrap/cache

# Overwrite the default Nginx configuration
COPY nginx.conf /etc/nginx/sites-enabled/default

# Copy the startup script and make it executable
COPY start.sh /usr/local/bin/start.sh
RUN chmod +x /usr/local/bin/start.sh

# Expose port 80 to the web
EXPOSE 10000

# Run the startup script when the container launches
CMD ["/usr/local/bin/start.sh"]