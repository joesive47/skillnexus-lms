#!/bin/bash

# SkillNexus Docker Setup Script
# This script helps you set up and manage the Docker environment

set -e

echo "🚀 SkillNexus Docker Setup"
echo "=========================="

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo "❌ Docker is not running. Please start Docker Desktop first."
        exit 1
    fi
    echo "✅ Docker is running"
}

# Function to setup environment
setup_env() {
    if [ ! -f .env ]; then
        echo "📝 Setting up environment variables..."
        cp .env.docker .env
        echo "✅ Environment variables configured"
    else
        echo "⚠️  .env file already exists. Backing up and updating..."
        cp .env .env.backup
        cp .env.docker .env
        echo "✅ Environment updated (backup saved as .env.backup)"
    fi
}

# Function to start services
start_services() {
    echo "🐳 Starting Docker services..."
    docker-compose up -d postgres redis
    
    echo "⏳ Waiting for services to be ready..."
    sleep 10
    
    # Check if PostgreSQL is ready
    echo "🔍 Checking PostgreSQL connection..."
    until docker-compose exec -T postgres pg_isready -U skillnexus -d skillnexus; do
        echo "⏳ Waiting for PostgreSQL..."
        sleep 2
    done
    echo "✅ PostgreSQL is ready"
    
    # Check if Redis is ready
    echo "🔍 Checking Redis connection..."
    until docker-compose exec -T redis redis-cli ping; do
        echo "⏳ Waiting for Redis..."
        sleep 2
    done
    echo "✅ Redis is ready"
}

# Function to setup database
setup_database() {
    echo "📊 Setting up database schema..."
    npm run db:generate
    npm run db:push
    
    echo "🌱 Seeding database..."
    npm run db:seed
    
    echo "✅ Database setup complete"
}

# Function to start application
start_app() {
    echo "🚀 Starting SkillNexus application..."
    npm run dev
}

# Main execution
main() {
    check_docker
    setup_env
    start_services
    setup_database
    
    echo ""
    echo "🎉 Setup complete!"
    echo "📊 Database: postgresql://skillnexus:skillnexus123@localhost:5432/skillnexus"
    echo "🔴 Redis: redis://localhost:6379"
    echo "🌐 Application: http://localhost:3000"
    echo ""
    echo "To start the application, run: npm run dev"
    echo "To stop services, run: docker-compose down"
    echo ""
    
    read -p "Start the application now? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        start_app
    fi
}

# Handle script arguments
case "${1:-}" in
    "start")
        check_docker
        start_services
        ;;
    "stop")
        echo "🛑 Stopping Docker services..."
        docker-compose down
        ;;
    "restart")
        echo "🔄 Restarting Docker services..."
        docker-compose restart
        ;;
    "logs")
        docker-compose logs -f
        ;;
    "clean")
        echo "🧹 Cleaning up Docker resources..."
        docker-compose down -v
        docker system prune -f
        ;;
    "status")
        docker-compose ps
        ;;
    *)
        main
        ;;
esac