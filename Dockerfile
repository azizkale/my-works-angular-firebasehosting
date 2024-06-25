# STAGE 1: Build
FROM node:16.13.0-alpine AS build
WORKDIR /usr/src/app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application code and build the app
COPY . .
RUN npm run build --prod

# STAGE 2: Serve
FROM nginx:1.19.10-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/dist/easyread /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
