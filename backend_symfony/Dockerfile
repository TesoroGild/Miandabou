FROM php:8.4-apache

# Installation extensions systeme
RUN apt-get update && apt-get install -y \
    libpq-dev libicu-dev zip unzip git \
    && docker-php-ext-install pdo pdo_pgsql intl

# Apache
RUN a2enmod rewrite
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/000-default.conf

WORKDIR /var/www/html

# Installation dependances en ignorant les fichiers env
COPY --from=composer:2.8 /usr/bin/composer /usr/bin/composer
ENV COMPOSER_ALLOW_SUPERUSER=1
ENV APP_ENV=prod
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --optimize-autoloader

COPY . .

RUN chown -R www-data:www-data /var/www/html/var