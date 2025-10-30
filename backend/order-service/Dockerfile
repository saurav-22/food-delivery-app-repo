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
    curl \
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

# Ensure Apache serves from the Slim `public/` directory
RUN sed -i 's|DocumentRoot /var/www/html|DocumentRoot /var/www/html/public|g' /etc/apache2/sites-enabled/000-default.conf || true

# Set proper permissions for Apache
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

# Default CART service url (can be overridden by CI/K8s)
ENV CART_SERVICE_URL=http://cart-service:8084

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/healthz || exit 1

EXPOSE 80
CMD ["apache2-foreground"]