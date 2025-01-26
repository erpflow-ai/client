# Stage 1: Build
FROM node:20-alpine AS base

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package.json
RUN npm install --force

# Copy the rest of the application files and build
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:1.23.3-alpine AS prod

# Copy built files from the first stage to Nginx's default public directory
COPY --from=base /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
