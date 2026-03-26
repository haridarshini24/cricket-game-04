#!/bin/bash

# HARI DARSHINI - Complete Error Check Script
# This checks for ALL possible errors in backend and frontend

echo "🔍 HARI DARSHINI - Complete Error Check"
echo "========================================"
echo ""

ERRORS=0
WARNINGS=0

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "📋 BACKEND CHECKS"
echo "=================="
echo ""

# 1. Check Python syntax
echo -n "1. Python syntax check... "
cd /app/backend
python3 -m py_compile server.py 2>/dev/null
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ PASS${NC}"
else
    echo -e "${RED}❌ FAIL - Syntax errors in server.py${NC}"
    ERRORS=$((ERRORS + 1))
fi

# 2. Check required imports
echo -n "2. Checking imports... "
python3 -c "
import sys
try:
    from fastapi import FastAPI
    from motor.motor_asyncio import AsyncIOMotorClient
    from pydantic import BaseModel
    import resend
    print('OK')
    sys.exit(0)
except ImportError as e:
    print(f'ERROR: {e}')
    sys.exit(1)
" 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ PASS${NC}"
else
    echo -e "${RED}❌ FAIL - Missing Python packages${NC}"
    ERRORS=$((ERRORS + 1))
fi

# 3. Check backend env file
echo -n "3. Backend .env file... "
if [ -f "/app/backend/.env" ]; then
    if grep -q "MONGO_URL" /app/backend/.env && grep -q "DB_NAME" /app/backend/.env; then
        echo -e "${GREEN}✅ PASS${NC}"
    else
        echo -e "${YELLOW}⚠️  WARNING - Missing required env variables${NC}"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    echo -e "${YELLOW}⚠️  WARNING - .env file not found${NC}"
    WARNINGS=$((WARNINGS + 1))
fi

# 4. Check backend API
echo -n "4. Backend API health... "
RESPONSE=$(curl -s http://localhost:8001/api/ 2>/dev/null)
if echo "$RESPONSE" | grep -q "HARI DARSHINI"; then
    echo -e "${GREEN}✅ PASS${NC}"
else
    echo -e "${RED}❌ FAIL - Backend not responding correctly${NC}"
    ERRORS=$((ERRORS + 1))
fi

# 5. Check MongoDB connection
echo -n "5. MongoDB connection... "
if curl -s http://localhost:8001/api/scores >/dev/null 2>&1; then
    echo -e "${GREEN}✅ PASS${NC}"
else
    echo -e "${YELLOW}⚠️  WARNING - Database connection may have issues${NC}"
    WARNINGS=$((WARNINGS + 1))
fi

echo ""
echo "📋 FRONTEND CHECKS"
echo "=================="
echo ""

cd /app/frontend

# 6. Check package.json
echo -n "6. package.json exists... "
if [ -f "package.json" ]; then
    echo -e "${GREEN}✅ PASS${NC}"
else
    echo -e "${RED}❌ FAIL - package.json not found${NC}"
    ERRORS=$((ERRORS + 1))
fi

# 7. Check node_modules
echo -n "7. Dependencies installed... "
if [ -d "node_modules" ] && [ -d "node_modules/react" ]; then
    echo -e "${GREEN}✅ PASS${NC}"
else
    echo -e "${YELLOW}⚠️  WARNING - node_modules may need reinstall${NC}"
    WARNINGS=$((WARNINGS + 1))
fi

# 8. Check main files exist
echo -n "8. Required files exist... "
MISSING=""
[ ! -f "src/App.js" ] && MISSING="$MISSING App.js"
[ ! -f "src/index.js" ] && MISSING="$MISSING index.js"
[ ! -f "src/components/CricketGame.jsx" ] && MISSING="$MISSING CricketGame.jsx"
[ ! -f "src/components/Leaderboard.jsx" ] && MISSING="$MISSING Leaderboard.jsx"
[ ! -f "src/components/WorkflowDiagram.jsx" ] && MISSING="$MISSING WorkflowDiagram.jsx"
[ ! -f "src/components/FeedbackForm.jsx" ] && MISSING="$MISSING FeedbackForm.jsx"

if [ -z "$MISSING" ]; then
    echo -e "${GREEN}✅ PASS${NC}"
else
    echo -e "${RED}❌ FAIL - Missing: $MISSING${NC}"
    ERRORS=$((ERRORS + 1))
fi

# 9. Check UI components
echo -n "9. UI components exist... "
if [ -f "src/components/ui/button.jsx" ] && [ -f "src/components/ui/card.jsx" ]; then
    echo -e "${GREEN}✅ PASS${NC}"
else
    echo -e "${RED}❌ FAIL - UI components missing${NC}"
    ERRORS=$((ERRORS + 1))
fi

# 10. Check CSS files
echo -n "10. CSS files exist... "
if [ -f "src/App.css" ] && [ -f "src/index.css" ] && [ -f "src/styles/cricket.css" ]; then
    echo -e "${GREEN}✅ PASS${NC}"
else
    echo -e "${YELLOW}⚠️  WARNING - Some CSS files missing${NC}"
    WARNINGS=$((WARNINGS + 1))
fi

# 11. Check frontend .env
echo -n "11. Frontend .env file... "
if [ -f ".env" ]; then
    if grep -q "REACT_APP_BACKEND_URL" .env; then
        echo -e "${GREEN}✅ PASS${NC}"
    else
        echo -e "${YELLOW}⚠️  WARNING - REACT_APP_BACKEND_URL not set${NC}"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    echo -e "${YELLOW}⚠️  WARNING - .env file not found${NC}"
    WARNINGS=$((WARNINGS + 1))
fi

# 12. Check if frontend is running
echo -n "12. Frontend server... "
if curl -s http://localhost:3000 >/dev/null 2>&1; then
    echo -e "${GREEN}✅ PASS${NC}"
else
    echo -e "${RED}❌ FAIL - Frontend not running${NC}"
    ERRORS=$((ERRORS + 1))
fi

echo ""
echo "📋 SERVICE CHECKS"
echo "================="
echo ""

# 13. Check supervisor services
echo "13. Service status:"
sudo supervisorctl status | while read line; do
    SERVICE=$(echo "$line" | awk '{print $1}')
    STATUS=$(echo "$line" | awk '{print $2}')
    if [ "$STATUS" = "RUNNING" ]; then
        echo -e "    ${GREEN}✅${NC} $SERVICE"
    else
        echo -e "    ${RED}❌${NC} $SERVICE ($STATUS)"
        ERRORS=$((ERRORS + 1))
    fi
done

echo ""
echo "📋 BUILD TEST"
echo "============="
echo ""

# 14. Test build (quick check)
echo "14. Testing production build..."
cd /app/frontend
echo "    Creating test .env.production..."
echo "REACT_APP_BACKEND_URL=http://localhost:8001" > .env.production

echo "    Running build (this may take a minute)..."
CI=false yarn build >/tmp/build-test.log 2>&1
if [ $? -eq 0 ]; then
    echo -e "    ${GREEN}✅ Build successful${NC}"
    
    # Check if index.html exists
    if [ -f "build/index.html" ]; then
        SIZE=$(wc -c < "build/index.html")
        echo -e "    ${GREEN}✅ index.html created ($SIZE bytes)${NC}"
    else
        echo -e "    ${RED}❌ index.html NOT created${NC}"
        ERRORS=$((ERRORS + 1))
    fi
    
    # Check build folder
    FILES=$(ls -1 build/ 2>/dev/null | wc -l)
    echo -e "    ${GREEN}✅ Build folder contains $FILES files${NC}"
else
    echo -e "    ${RED}❌ Build failed - check /tmp/build-test.log${NC}"
    ERRORS=$((ERRORS + 1))
fi

echo ""
echo "========================================"
echo "📊 SUMMARY"
echo "========================================"
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✅ ALL CHECKS PASSED!${NC}"
    echo ""
    echo "Your application is running perfectly with no errors!"
    echo ""
    echo "✅ Backend: Running and healthy"
    echo "✅ Frontend: Running and building successfully"
    echo "✅ Database: Connected"
    echo "✅ All services: Running"
    echo "✅ Build: Creates index.html successfully"
    echo ""
    echo "🚀 Ready to push to GitHub!"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠️  $WARNINGS WARNING(S) FOUND${NC}"
    echo ""
    echo "Application is working but has some warnings."
    echo "Review warnings above - they may not affect functionality."
    echo ""
    echo "✅ No critical errors"
    echo "⚠️  Some non-critical warnings"
    echo ""
    echo "You can still push to GitHub, but consider fixing warnings."
    exit 0
else
    echo -e "${RED}❌ $ERRORS ERROR(S) FOUND${NC}"
    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}⚠️  $WARNINGS WARNING(S) FOUND${NC}"
    fi
    echo ""
    echo "Please fix the errors above before pushing to GitHub."
    echo ""
    echo "Common fixes:"
    echo "  - Restart services: sudo supervisorctl restart all"
    echo "  - Reinstall dependencies: cd /app/frontend && yarn install"
    echo "  - Check backend logs: tail -f /var/log/supervisor/backend.*.log"
    echo "  - Check frontend logs: tail -f /var/log/supervisor/frontend.*.log"
    exit 1
fi
