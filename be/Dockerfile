FROM node:14-alpine
WORKDIR /app

COPY package*.json /app
RUN npm install
RUN apk update
RUN apk add ffmpeg

COPY . /app


ENV PORT=3000
EXPOSE 3000
EXPOSE 2222/udp

CMD [ "npm", "start" ]