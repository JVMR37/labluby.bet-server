FROM node:lts-alpine

WORKDIR /usr/app/ms-emails
COPY package*.json yarn.* ./
RUN npm install

COPY . . 

EXPOSE 3000

CMD ["npm", "run", "dev"]