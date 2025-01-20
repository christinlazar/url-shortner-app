FROM node:22

WORKDIR /app

COPY . /app

RUN npm install

EXPOSE 5001

CMD [ "npm","start" ]