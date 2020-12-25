FROM php:7.4-fpm-alpine

# Copy composer.lock and composer.json
COPY composer.lock composer.json /var/www/

# Set working directory
WORKDIR /var/www

# Install dependencies
RUN apk update && \
    apk add --no-cache \
    git \
    curl \
    nano \
    icu-dev \
    libxml2-dev \
    libgcrypt-dev \
    libjpeg-turbo-dev \
    libmcrypt-dev \
    libpng-dev \
    libpq \
    libressl-dev \
    libxslt-dev \
    libzip-dev \
    && rm -rf /var/cache/apk/*

# Install extensions
RUN docker-php-ext-install dom exif gd iconv intl json mysqli opcache pdo_mysql soap xsl zip

# Install composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Add user for laravel application
RUN addgroup -S -g 1000 www && adduser -u 1000 -S www -G www

# Copy existing application directory contents
COPY . /var/www

# Copy existing application directory permissions
COPY --chown=www:www . /var/www

# Change current user to www
USER www

# Expose port 9000 and start php-fpm server
EXPOSE 9000
CMD ["php-fpm"]
