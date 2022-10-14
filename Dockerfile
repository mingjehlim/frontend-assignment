# syntax=docker/dockerfile:1

# ==== CONFIGURE =====
# Use a Node 18 base image
FROM node:18-alpine

# Set the working directory to /app inside the container
WORKDIR /app

# Copy app files
COPY . .

# ==== BUILD =====
# RUN --mount=type=cache,target=/app/node_modules,rw npm install

# Install dependencies (npm ci makes sure the exact versions in the lockfile gets installed)
RUN --mount=type=cache,target=/app/node_modules,rw npm ci 

RUN --mount=type=cache,target=/app/node_modules,rw npm install selenium-webdriver
RUN --mount=type=cache,target=/app/node_modules,rw npm install selenium-standalone
RUN --mount=type=cache,target=/app/node_modules,rw npm install mocha --global

# Build the app
RUN --mount=type=cache,target=/app/node_modules,rw npm run build

# ==== RUN =======
# Set the env to "production"
ENV NODE_ENV production

# Expose the port on which the app will be running (3000 is the default that `serve` uses)
EXPOSE 1000

# Start the app
# CMD [ "npx", "serve", "build" ]
CMD [ "npm", "run", "test" ]
# ENTRYPOINT ["tail", "-f", "/dev/null"]
# RUN mocha app/test/scripts/task1-test.js