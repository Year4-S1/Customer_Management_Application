FROM node:16-alpine

RUN npm i -g express mongoose dotenv cors body-parser pino dayjs pino-pretty

WORKDIR /customer-management

COPY . . 

RUN npm install

EXPOSE 8089

ENTRYPOINT [ "npm", "run" ]

CMD ["start"]

