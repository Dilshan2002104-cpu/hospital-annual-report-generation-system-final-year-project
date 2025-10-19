#!/bin/bash

# HMS Docker Build and Push Script
# This script builds Docker images and pushes them to DockerHub

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
DOCKERHUB_USERNAME="${1:-your-dockerhub-username}"
IMAGE_TAG="${2:-latest}"
BACKEND_IMAGE="$DOCKERHUB_USERNAME/hms-backend:$IMAGE_TAG"
FRONTEND_IMAGE="$DOCKERHUB_USERNAME/hms-frontend:$IMAGE_TAG"

# Functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_docker() {
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed or not in PATH"
        exit 1
    fi
    
    if ! docker info &> /dev/null; then
        log_error "Docker daemon is not running"
        exit 1
    fi
}

docker_login() {
    log_info "Logging in to DockerHub..."
    if ! docker login; then
        log_error "Failed to login to DockerHub"
        exit 1
    fi
}

build_backend() {
    log_info "Building backend Docker image..."
    cd HMS
    if docker build -t "$BACKEND_IMAGE" .; then
        log_info "Backend image built successfully: $BACKEND_IMAGE"
    else
        log_error "Failed to build backend image"
        exit 1
    fi
    cd ..
}

build_frontend() {
    log_info "Building frontend Docker image..."
    cd frontend
    if docker build -t "$FRONTEND_IMAGE" .; then
        log_info "Frontend image built successfully: $FRONTEND_IMAGE"
    else
        log_error "Failed to build frontend image"
        exit 1
    fi
    cd ..
}

push_images() {
    log_info "Pushing backend image to DockerHub..."
    if docker push "$BACKEND_IMAGE"; then
        log_info "Backend image pushed successfully"
    else
        log_error "Failed to push backend image"
        exit 1
    fi
    
    log_info "Pushing frontend image to DockerHub..."
    if docker push "$FRONTEND_IMAGE"; then
        log_info "Frontend image pushed successfully"
    else
        log_error "Failed to push frontend image"
        exit 1
    fi
}

cleanup() {
    log_info "Cleaning up unused Docker images..."
    docker image prune -f
}

show_summary() {
    log_info "Build and push completed successfully!"
    echo ""
    echo "Docker images pushed:"
    echo "  - Backend:  $BACKEND_IMAGE"
    echo "  - Frontend: $FRONTEND_IMAGE"
    echo ""
    echo "To deploy on your EC2 server, run:"
    echo "  ./scripts/deploy.sh $DOCKERHUB_USERNAME $IMAGE_TAG"
}

# Main execution
main() {
    if [ "$DOCKERHUB_USERNAME" = "your-dockerhub-username" ]; then
        log_error "Please provide your DockerHub username as the first argument"
        echo "Usage: $0 <dockerhub-username> [image-tag]"
        exit 1
    fi
    
    log_info "Starting HMS Docker build and push process..."
    log_info "DockerHub Username: $DOCKERHUB_USERNAME"
    log_info "Image Tag: $IMAGE_TAG"
    
    check_docker
    docker_login
    build_backend
    build_frontend
    push_images
    cleanup
    show_summary
}

main "$@"