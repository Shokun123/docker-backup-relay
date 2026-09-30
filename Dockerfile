FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache postgresql-client sqlite gzip curl bash

COPY package.json ./
RUN npm install --production

COPY src/ ./src/
COPY lib/ ./lib/ 2>/dev/null || true

ENV PORT=8080
ENV NODE_ENV=production
ENV BACKUP_DIR=/data/backups

EXPOSE 8080

VOLUME ["/data/backups"]

CMD ["node", "src/index.js"]
