FROM php:8.4-apache

RUN apt-get update && apt-get install -y \
    libpq-dev libicu-dev zip unzip git \
    && docker-php-ext-install pdo pdo_pgsql intl

RUN a2enmod rewrite

ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/000-default.conf

COPY . /var/www/html

COPY --from=composer:2.8 /usr/bin/composer /usr/bin/composer

ENV COMPOSER_ALLOW_SUPERUSER=1
RUN composer install --no-dev --optimize-autoloader

RUN chown -R www-data:www-data /var/www/html/var