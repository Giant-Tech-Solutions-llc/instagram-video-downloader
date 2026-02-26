#!/bin/bash
# Kill any existing process on port 5000
lsof -ti :5000 2>/dev/null | xargs -r kill -9 2>/dev/null
sleep 1

# Build frontend
npx vite build --outDir dist/public 2>&1 | tail -3

# Run production server
NODE_ENV=production exec node_modules/.bin/tsx server/index.ts
