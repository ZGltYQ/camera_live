FROM nginx:stable-alpine

RUN apk update && apk add tzdata bash

RUN rm /etc/nginx/conf.d/default.conf

COPY etc/nginx.conf /etc/nginx/nginx.conf
COPY etc/robots.txt /etc/nginx/robots.txt

CMD [ "nginx", "-g", "daemon off;" ]
