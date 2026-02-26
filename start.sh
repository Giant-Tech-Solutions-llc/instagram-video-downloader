#!/bin/bash
trap '' SIGTERM SIGHUP
exec node_modules/.bin/tsx server/index.ts
