FROM php:8.2-apache

# Enable Apache rewrite for Slim clean URLs
RUN a2enmod rewrite

# Install system dependencies and PostgreSQL
RUN apt-get update && apt-get install -y \
    libpq-dev \
    git \
    unzip \
    zip \
    libzip-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_pgsql

# Install zip extension via PECL (alternative method)
RUN pecl install zip && docker-php-ext-enable zip

WORKDIR /var/www/html

# Copy project files
COPY . .

# Install Composer
RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" \
    && php composer-setup.php --install-dir=/usr/local/bin --filename=composer \
    && rm composer-setup.php

# Install Composer dependencies
RUN composer install --no-dev --optimize-autoloader --prefer-dist

# Allow .htaccess overrides
RUN sed -i 's/AllowOverride None/AllowOverride All/g' /etc/apache2/apache2.conf

# Set proper permissions for Apache
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

EXPOSE 80
CMD ["apache2-foreground"]