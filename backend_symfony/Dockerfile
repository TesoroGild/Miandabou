FROM php:8.4-apache

ARG APP_ENV
ARG DATABASE_URL
ARG SYMFONY_DOTENV_PATH

# Installation extensions systeme
COPY --from=mlocati/php-extension-installer /usr/bin/install-php-extensions /usr/local/bin/
RUN install-php-extensions pdo_pgsql intl zip opcache

# Apache
RUN a2enmod rewrite
WORKDIR /var/www/html

ENV COMPOSER_ALLOW_SUPERUSER=1

# Installation dependances en ignorant les fichiers env
COPY composer.json composer.lock ./
COPY --from=composer:2.8 /usr/bin/composer /usr/bin/composer
RUN composer install --no-dev --no-scripts --optimize-autoloader

COPY . .
RUN echo "APP_ENV=prod" > .env
RUN mkdir -p var/cache var/log && chown -R www-data:www-data var
RUN php bin/console cache:clear --no-warmup
RUN mkdir -p var && chown -R www-data:www-data var

ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/000-default.conf