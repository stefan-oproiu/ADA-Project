FROM node:latest as node
WORKDIR /app
EXPOSE 80

COPY . .
RUN npm install
RUN npm run build

FROM nginx:alpine
COPY --from=node /app/dist/user-client /usr/share/nginx/html