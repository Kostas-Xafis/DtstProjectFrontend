FROM node:20-alpine3.19 as build-stage

WORKDIR ./frontend

COPY . .

RUN npm install && npm run build


FROM nginx:stable-alpine as production-stage

COPY --from=build-stage /frontend/dist /usr/share/nginx/html

COPY --from=build-stage /frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
