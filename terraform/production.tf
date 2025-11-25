# Production Infrastructure - SkillNexus LMS

# Application Load Balancer
resource "aws_lb" "skillnexus_alb" {
  name               = "skillnexus-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets           = [aws_subnet.public_1.id, aws_subnet.public_2.id]

  enable_deletion_protection = true
}

# ECS Service with Auto Scaling
resource "aws_ecs_service" "skillnexus_service" {
  name            = "skillnexus-service"
  cluster         = aws_ecs_cluster.skillnexus.id
  task_definition = aws_ecs_task_definition.skillnexus.arn
  desired_count   = 3

  deployment_configuration {
    maximum_percent         = 200
    minimum_healthy_percent = 100
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.skillnexus.arn
    container_name   = "skillnexus-app"
    container_port   = 3000
  }
}

# Auto Scaling
resource "aws_appautoscaling_target" "ecs_target" {
  max_capacity       = 10
  min_capacity       = 3
  resource_id        = "service/${aws_ecs_cluster.skillnexus.name}/${aws_ecs_service.skillnexus_service.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

# CloudWatch Alarms
resource "aws_cloudwatch_metric_alarm" "high_cpu" {
  alarm_name          = "skillnexus-high-cpu"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/ECS"
  period              = "120"
  statistic           = "Average"
  threshold           = "80"
  alarm_description   = "This metric monitors ecs cpu utilization"
}