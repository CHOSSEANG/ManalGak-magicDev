FROM nginx:1.25-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

RUN mkdir -p /var/www/certbot

EXPOSE 80 443
