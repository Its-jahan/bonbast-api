#!/bin/bash

# Deployment script for Bonbast API Platform
# This script rebuilds and deploys the updated frontend

set -e  # Exit on error

echo "🚀 Starting deployment..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Stop containers
echo -e "${BLUE}📦 Stopping containers...${NC}"
sudo docker-compose down

# Step 2: Remove old frontend image to force rebuild
echo -e "${BLUE}🗑️  Removing old frontend image...${NC}"
sudo docker rmi bonbast-api-frontend 2>/dev/null || echo "No old image to remove"

# Step 3: Build new images
echo -e "${BLUE}🔨 Building new images...${NC}"
sudo docker-compose build --no-cache frontend

# Step 4: Start containers
echo -e "${BLUE}🚀 Starting containers...${NC}"
sudo docker-compose up -d

# Step 5: Wait for containers to be healthy
echo -e "${BLUE}⏳ Waiting for containers to start...${NC}"
sleep 5

# Step 6: Check status
echo -e "${BLUE}📊 Checking container status...${NC}"
sudo docker-compose ps

# Step 7: Show logs
echo -e "${BLUE}📝 Recent logs:${NC}"
sudo docker-compose logs --tail=20

echo ""
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo -e "${YELLOW}📍 Your app is now running at:${NC}"
echo -e "   ${GREEN}http://31.59.105.156${NC}"
echo ""
echo -e "${YELLOW}🔍 To view logs:${NC}"
echo -e "   ${BLUE}sudo docker-compose logs -f frontend${NC}"
echo -e "   ${BLUE}sudo docker-compose logs -f api${NC}"
echo ""
echo -e "${YELLOW}🛑 To stop:${NC}"
echo -e "   ${BLUE}sudo docker-compose down${NC}"
echo ""
