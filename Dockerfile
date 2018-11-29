FROM node:latest

RUN apt-get update && apt-get install nano tree -y

RUN mkdir app
WORKDIR /app

COPY ./package*.json ./
RUN npm install -g

COPY . .

ENV PATH /app/node_modules/.bin:$PATH
ENV NODE_ENV development

EXPOSE 3030

CMD ["npm", "start"]