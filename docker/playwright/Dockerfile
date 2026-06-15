FROM mcr.microsoft.com/playwright:v1.55.0-jammy

WORKDIR /app

COPY parser/package*.json ./

RUN npm install

COPY parser .