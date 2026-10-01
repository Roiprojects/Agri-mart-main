FROM node:20-alpine AS base

# 1. Install dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
COPY packages/contracts/package.json ./packages/contracts/
COPY apps/backend/package.json ./apps/backend/

RUN npm install

# 2. Rebuild source code
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY packages/contracts ./packages/contracts
COPY apps/backend ./apps/backend
COPY tsconfig.json ./

WORKDIR /app/apps/backend
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3001
RUN npm run build

# 3. Production runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/backend/public ./apps/backend/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/backend/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/backend/.next/static ./apps/backend/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/backend/data ./apps/backend/data

USER nextjs
EXPOSE 3001

CMD ["node", "apps/backend/server.js"]
