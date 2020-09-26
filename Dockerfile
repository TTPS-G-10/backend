FROM node:12.18.4

WORKDIR /hospitalBackend

COPY package*.json ./

RUN npm install

COPY . .

CMD  ["npm","run","dev"]