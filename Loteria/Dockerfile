FROM node:alpine

WORKDIR /home/rey/app

COPY package*.json ./
RUN npm install

COPY . . 

EXPOSE 3333

CMD ['node', 'ace', 'serve', '--watch']