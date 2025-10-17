FROM node:18 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Set environment variables for the build
ARG REACT_APP_API_URL=https://api.american-football-manager.xyz
ARG REACT_APP_NODE_ENV=test
ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_NODE_ENV=$REACT_APP_NODE_ENV

RUN npm run build

# Serve with Nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
