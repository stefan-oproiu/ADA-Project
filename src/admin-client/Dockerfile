FROM node:latest as node
WORKDIR /app
EXPOSE 80

COPY . .
RUN npm install
RUN npm run build --prod

FROM nginx:alpine
COPY --from=node /app/dist/admin-client /usr/share/nginx/html