#!/bin/bash
set -e

echo "Stopping application..."
pm2 stop skillnexus || true
pm2 delete skillnexus || true
