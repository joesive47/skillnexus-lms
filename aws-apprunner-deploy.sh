#!/bin/bash

# AWS App Runner Deployment Script for SkillNexus LMS

SERVICE_NAME="skillnexus-lms"
REGION="ap-southeast-1"
ECR_REPO="skillnexus-lms"

echo "🚀 Deploying SkillNexus LMS to AWS App Runner..."

# Build and push Docker image
aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $(aws sts get-caller-identity --query Account --output text).dkr.ecr.$REGION.amazonaws.com
docker build -t $ECR_REPO .
docker tag $ECR_REPO:latest $(aws sts get-caller-identity --query Account --output text).dkr.ecr.$REGION.amazonaws.com/$ECR_REPO:latest
docker push $(aws sts get-caller-identity --query Account --output text).dkr.ecr.$REGION.amazonaws.com/$ECR_REPO:latest

# Create or update App Runner service
aws apprunner create-service \
  --service-name $SERVICE_NAME \
  --source-configuration file://apprunner-config.json \
  --instance-configuration Cpu=2048,Memory=4096 \
  --health-check-configuration Protocol=HTTP,Path=/api/health,Interval=10,Timeout=5,HealthyThreshold=1,UnhealthyThreshold=5 \
  --auto-scaling-configuration-arn arn:aws:apprunner:$REGION:$(aws sts get-caller-identity --query Account --output text):autoscalingconfiguration/DefaultConfiguration \
  --region $REGION

echo "✅ Deployment completed!"
