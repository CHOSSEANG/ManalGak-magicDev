# Runtime only - Next.js app already built by GitHub Actions
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3030
ENV HOSTNAME="0.0.0.0"
# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
# Copy pre-built application (from CI/CD pipeline)
COPY .next/standalone ./
COPY .next/static ./.next/static
COPY public ./public
# Change ownership
RUN chown -R nextjs:nodejs /app
USER nextjs
EXPOSE 3030
CMD ["node", "server.js"]