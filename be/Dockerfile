FROM node:14-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install
RUN apk update
RUN apk add ffmpeg

COPY . /app


EXPOSE 3000
EXPOSE 2222/udp

CMD [ "npm", "start" ]