#!/bin/bash
# Kill any existing process on port 5000
lsof -ti :5000 2>/dev/null | xargs -r kill -9 2>/dev/null
sleep 1

# Build frontend
npm run build 2>&1 | tail -3

# Run production server
NODE_ENV=production exec node_modules/.bin/tsx server/index.ts
