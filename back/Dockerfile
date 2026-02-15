FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install only production dependencies
COPY package.json package-lock.json* ./
RUN npm install --production

# Copy app source
COPY . .

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "bin/www"]
