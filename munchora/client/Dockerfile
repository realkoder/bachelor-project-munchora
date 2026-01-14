# Build the image
# docker build --platform linux/amd64 --build-arg VITE_ENV=production --build-arg VITE_BASE_URL=https://munchora.pro/api/v1 --build-arg VITE_BASE_URL_SSR=http://munchora-backend:9090/api/v1 -t ghcr.io/realkoder/munchora-client:latest .
# docker push ghcr.io/realkoder/munchora-client:latest

FROM node:20-alpine AS development-dependencies-env
COPY . /app
WORKDIR /app
RUN npm ci

FROM node:20-alpine AS production-dependencies-env
COPY ./package.json package-lock.json /app/
WORKDIR /app
RUN npm ci --omit=dev

FROM node:20-alpine AS build-env

# Accept build-time args
ARG VITE_ENV
ARG VITE_BASE_URL
ARG VITE_BASE_URL_SSR
ENV VITE_ENV=$VITE_ENV
ENV VITE_BASE_URL=$VITE_BASE_URL
ENV VITE_BASE_URL_SSR=$VITE_BASE_URL_SSR

COPY . /app/
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
WORKDIR /app
RUN npm run build

FROM node:20-alpine

ARG VITE_ENV
ARG VITE_BASE_URL
ARG VITE_BASE_URL_SSR
ENV VITE_ENV=$VITE_ENV
ENV VITE_BASE_URL=$VITE_BASE_URL
ENV VITE_BASE_URL_SSR=$VITE_BASE_URL_SSR

COPY ./package.json package-lock.json /app/
COPY --from=production-dependencies-env /app/node_modules /app/node_modules
COPY --from=build-env /app/build /app/build
WORKDIR /app
CMD ["npm", "run", "start"]