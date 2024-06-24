FROM --platform=linux/arm64/v8 node:18-alpine AS base

FROM base AS start
RUN apk add --no-cache libc6-compat
RUN apk update
# Set working directory
WORKDIR /app
RUN yarn global add turbo@^1.4.2
COPY . .
RUN turbo prune next-app --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS install
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app

# First install the dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=start /app/out/json/ .
COPY --from=start /app/out/yarn.lock ./yarn.lock
RUN yarn install

# Must be after yarn install to do not retrigger yarn installs on code changes
COPY --from=start /app/out/full/ .

FROM install AS builder
# Build nextjs and migration executable
RUN yarn turbo run build

FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=builder /app/apps/next/next.config.js .
COPY --from=builder /app/apps/next/package.json .

# include db package in final image for running migrations on remote system
COPY --from=builder /app/packages/db ./packages/db

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/apps/next/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/next/.next/static ./apps/next/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/next/public ./apps/next/public

CMD cd packages/db;node dist/migrate.js;cd ../..;node apps/next/server.js