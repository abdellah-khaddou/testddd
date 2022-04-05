FROM node:12-alpine
RUN apk update && apk add bash
WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .
EXPOSE 3001
CMD ["npm","run","build"]
CMD ["npm","run","prod"]

