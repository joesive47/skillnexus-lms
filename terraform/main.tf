terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

# ECS Cluster
resource "aws_ecs_cluster" "skillnexus" {
  name = "skillnexus-cluster"
  
  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

# RDS PostgreSQL Multi-AZ
resource "aws_db_instance" "skillnexus_db" {
  identifier     = "skillnexus-postgres"
  engine         = "postgres"
  engine_version = "16.1"
  instance_class = "db.r5.large"
  
  allocated_storage = 100
  storage_encrypted = true
  
  db_name  = "skillnexus_lms"
  username = "skillnexus"
  password = var.db_password
  
  multi_az               = true
  backup_retention_period = 7
  skip_final_snapshot    = true

  tags = {
    Name = "skillnexus-postgres"
  }
}

# S3 Buckets
resource "aws_s3_bucket" "videos" {
  bucket = "skillnexus-videos-${random_id.suffix.hex}"
}

resource "aws_s3_bucket" "assets" {
  bucket = "skillnexus-assets-${random_id.suffix.hex}"
}

# CloudFront CDN
resource "aws_cloudfront_distribution" "cdn" {
  origin {
    domain_name = aws_s3_bucket.videos.bucket_regional_domain_name
    origin_id   = "S3-videos"
  }

  enabled = true
  comment = "SkillNexus CDN"

  default_cache_behavior {
    target_origin_id       = "S3-videos"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    
    forwarded_values {
      query_string = false
      cookies { forward = "none" }
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}

resource "random_id" "suffix" {
  byte_length = 4
}

variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
}