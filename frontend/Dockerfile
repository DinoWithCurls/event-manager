FROM node:20-alpine

WORKDIR /app

# Copy package.json and lockfile
COPY package.json package-lock.json ./

# Install dependencies from lockfile
RUN npm ci

# Copy everything else (configs + source code)
COPY . .

# Build Next.js app
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]