FROM php:7.4-fpm-alpine

COPY ../../composer.lock composer.json /var/www/

WORKDIR /var/www

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

RUN docker-php-ext-install dom exif gd iconv intl json mysqli opcache pdo_mysql soap xsl zip
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

RUN addgroup -S -g 1000 www && adduser -u 1000 -S www -G www

COPY ../.. /var/www
COPY --chown=www:www ../.. /var/www

USER www

RUN composer install

EXPOSE 9000
CMD ["php-fpm"]
