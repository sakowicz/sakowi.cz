FROM node:14-alpine

COPY package.json package-lock.json /app/
WORKDIR /app
RUN npm i
COPY . /app/

CMD ["npm", "run", "prod"]
