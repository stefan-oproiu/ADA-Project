FROM node:latest as node
WORKDIR /app
EXPOSE 80

COPY . .
RUN npm install
RUN npm run build

FROM nginx:alpine
COPY --from=node /app/dist/admin-client /usr/share/nginx/html
COPY --from=node /app/nginx.conf /etc/nginx/conf.d/default.conf