FROM node:18-alpine AS builder
WORKDIR /app

# Install deps and build
COPY package*.json ./
COPY public ./public
COPY .next ./.next
COPY pages ./pages
COPY components ./components
COPY styles ./styles
RUN npm ci --production || true
RUN npm run build --if-present || true

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app .
EXPOSE 3000
CMD ["npm", "start"]
