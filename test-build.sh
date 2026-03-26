#!/bin/bash

# HARI DARSHINI - Build Test Script
# This script tests if your build will succeed in CI/CD

echo "🏏 HARI DARSHINI - Build Test Script"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0

echo "📋 Checking Prerequisites..."
echo ""

# Check Node.js
echo -n "Checking Node.js version... "
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✅ $NODE_VERSION${NC}"
else
    echo -e "${RED}❌ Node.js not found${NC}"
    ERRORS=$((ERRORS + 1))
fi

# Check Yarn
echo -n "Checking Yarn version... "
if command -v yarn &> /dev/null; then
    YARN_VERSION=$(yarn --version)
    echo -e "${GREEN}✅ $YARN_VERSION${NC}"
else
    echo -e "${RED}❌ Yarn not found${NC}"
    ERRORS=$((ERRORS + 1))
fi

# Check Python
echo -n "Checking Python version... "
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    echo -e "${GREEN}✅ $PYTHON_VERSION${NC}"
else
    echo -e "${RED}❌ Python not found${NC}"
    ERRORS=$((ERRORS + 1))
fi

echo ""
echo "🔨 Testing Frontend Build..."
echo ""

cd /app/frontend

# Create env file
echo -n "Creating .env.production... "
echo "REACT_APP_BACKEND_URL=http://localhost:8001" > .env.production
echo -e "${GREEN}✅${NC}"

# Install dependencies
echo "Installing frontend dependencies..."
yarn install > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Dependencies installed${NC}"
else
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    ERRORS=$((ERRORS + 1))
fi

# Build frontend
echo "Building frontend (this may take a minute)..."
CI=false yarn build > /tmp/build.log 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend build successful${NC}"
else
    echo -e "${RED}❌ Frontend build failed${NC}"
    echo "Check /tmp/build.log for details"
    ERRORS=$((ERRORS + 1))
fi

# Check if index.html exists
echo -n "Checking if index.html was created... "
if [ -f "build/index.html" ]; then
    FILE_SIZE=$(wc -c < "build/index.html")
    echo -e "${GREEN}✅ Found (${FILE_SIZE} bytes)${NC}"
else
    echo -e "${RED}❌ index.html not found${NC}"
    ERRORS=$((ERRORS + 1))
fi

# Check build folder contents
echo ""
echo "📁 Build folder contents:"
if [ -d "build" ]; then
    ls -lh build/ | head -10
else
    echo -e "${RED}❌ Build folder not found${NC}"
    ERRORS=$((ERRORS + 1))
fi

echo ""
echo "🐍 Testing Backend..."
echo ""

cd /app/backend

# Check Python syntax
echo -n "Checking Python syntax... "
python3 -m py_compile server.py 2>/dev/null
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Valid Python syntax${NC}"
else
    echo -e "${RED}❌ Python syntax errors${NC}"
    ERRORS=$((ERRORS + 1))
fi

# Check requirements
echo -n "Checking requirements.txt... "
if [ -f "requirements.txt" ]; then
    PACKAGES=$(wc -l < requirements.txt)
    echo -e "${GREEN}✅ Found (${PACKAGES} packages)${NC}"
else
    echo -e "${RED}❌ requirements.txt not found${NC}"
    ERRORS=$((ERRORS + 1))
fi

echo ""
echo "======================================"
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ All tests passed! Ready to push to GitHub${NC}"
    echo ""
    echo "Next steps:"
    echo "1. git add ."
    echo "2. git commit -m 'HARI DARSHINI - Cricket Game'"
    echo "3. git push origin main"
    exit 0
else
    echo -e "${RED}❌ $ERRORS error(s) found. Fix them before pushing${NC}"
    echo ""
    echo "Check the errors above and fix them."
    exit 1
fi
