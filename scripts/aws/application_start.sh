#!/bin/bash
set -e

cd /var/app/current

echo "Starting application with PM2..."
pm2 start npm --name "skillnexus" -- start
pm2 save
