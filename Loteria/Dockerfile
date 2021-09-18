FROM node:lts-alpine

WORKDIR /usr/app/Labluby.bet-server

COPY package*.json yarn.* ./
RUN npm install

COPY . . 

EXPOSE 3333

CMD ["npm", "run", "dev"]