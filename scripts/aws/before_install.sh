#!/bin/bash
set -e

echo "Stopping existing application..."
pm2 stop all || true
