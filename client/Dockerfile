FROM node:14-slim

WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json

# Install npm packages, copy rest of the repo and run build command
RUN npm install --production
COPY . .
RUN npm run build

# Install Serve to serve static build folder
RUN npm install -g serve

EXPOSE 3000

CMD [ "serve", "-s", "build" ]