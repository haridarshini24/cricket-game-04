# \ud83d\udccb Code Templates - Cricket Game

Complete code reference for all major components and files.

## Table of Contents

1. [Backend Templates](#backend-templates)
2. [Frontend Templates](#frontend-templates)
3. [Configuration Files](#configuration-files)
4. [CI/CD Templates](#cicd-templates)

---

## \ud83d\udc0d Backend Templates

### 1. FastAPI Server (`backend/server.py`)

```python
from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import asyncio
import resend

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Resend setup
RESEND_API_KEY = os.environ.get('RESEND_API_KEY', '')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY

app = FastAPI()
api_router = APIRouter(prefix="/api")

# Models
class GameScore(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    player_name: str
    score: int
    wickets: int
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class GameScoreCreate(BaseModel):
    player_name: str
    score: int
    wickets: int

class Feedback(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    message: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class FeedbackCreate(BaseModel):
    name: str
    email: EmailStr
    message: str

# Routes
@api_router.get("/")
async def root():
    return {"message": "Cricket Game API is running!"}

@api_router.post("/save-score", response_model=GameScore)
async def save_score(input: GameScoreCreate):
    score_dict = input.model_dump()
    score_obj = GameScore(**score_dict)
    doc = score_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.game_scores.insert_one(doc)
    return score_obj

@api_router.get("/scores", response_model=List[GameScore])
async def get_scores(limit: int = 10):
    scores = await db.game_scores.find(
        {}, {"_id": 0}
    ).sort("score", -1).limit(limit).to_list(limit)
    for score in scores:
        if isinstance(score['timestamp'], str):
            score['timestamp'] = datetime.fromisoformat(score['timestamp'])
    return scores

@api_router.post("/send-feedback")
async def send_feedback(input: FeedbackCreate):
    try:
        feedback_dict = input.model_dump()
        feedback_obj = Feedback(**feedback_dict)
        doc = feedback_obj.model_dump()
        doc['timestamp'] = doc['timestamp'].isoformat()
        await db.feedback.insert_one(doc)
        
        if RESEND_API_KEY:
            html_content = f"""
            <html>
                <body style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>New Cricket Game Feedback</h2>
                    <p><strong>Name:</strong> {input.name}</p>
                    <p><strong>Email:</strong> {input.email}</p>
                    <p><strong>Message:</strong></p>
                    <p>{input.message}</p>
                </body>
            </html>
            """
            params = {
                "from": SENDER_EMAIL,
                "to": ["hari.darshini.612@gmail.com"],
                "subject": f"Cricket Game Feedback from {input.name}",
                "html": html_content
            }
            email_result = await asyncio.to_thread(resend.Emails.send, params)
            return {"status": "success", "message": "Feedback sent!", "email_sent": True}
        else:
            return {"status": "success", "message": "Feedback saved!", "email_sent": False}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
```

### 2. Backend Requirements (`backend/requirements.txt`)

```
fastapi==0.110.1
uvicorn==0.25.0
motor==3.3.1
pymongo==4.5.0
pydantic>=2.6.4
python-dotenv>=1.0.1
resend>=2.0.0
```

### 3. Backend Environment (`backend/.env`)

```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=cricket_game
CORS_ORIGINS=*
RESEND_API_KEY=re_your_api_key_here
SENDER_EMAIL=onboarding@resend.dev
```

---

## \u269b\ufe0f Frontend Templates

### 1. Main App Component (`frontend/src/App.js`)

```javascript
import { useState } from "react";
import "@/App.css";
import CricketGame from "@/components/CricketGame";
import WorkflowDiagram from "@/components/WorkflowDiagram";
import FeedbackForm from "@/components/FeedbackForm";
import Leaderboard from "@/components/Leaderboard";
import { Button } from "@/components/ui/button";
import { Trophy, Code, MessageSquare } from "lucide-react";

function App() {
  const [currentView, setCurrentView] = useState("game");

  return (
    <div className="App min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold text-green-400">
              \ud83c\udfcf Cricket Game
            </h1>
            <div className="flex gap-2">
              <Button variant={currentView === "game" ? "default" : "outline"} 
                      onClick={() => setCurrentView("game")}>
                Play
              </Button>
              <Button variant={currentView === "leaderboard" ? "default" : "outline"} 
                      onClick={() => setCurrentView("leaderboard")}>
                <Trophy className="w-4 h-4 mr-1" /> Scores
              </Button>
              <Button variant={currentView === "workflow" ? "default" : "outline"} 
                      onClick={() => setCurrentView("workflow")}>
                <Code className="w-4 h-4 mr-1" /> Workflow
              </Button>
              <Button variant={currentView === "feedback" ? "default" : "outline"} 
                      onClick={() => setCurrentView("feedback")}>
                <MessageSquare className="w-4 h-4 mr-1" /> Feedback
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-20 pb-8">
        {currentView === "game" && <CricketGame />}
        {currentView === "leaderboard" && <Leaderboard />}
        {currentView === "workflow" && <WorkflowDiagram />}
        {currentView === "feedback" && <FeedbackForm />}
      </div>
    </div>
  );
}

export default App;
```

### 2. Cricket Game Component (`frontend/src/components/CricketGame.jsx`)

Key features:
- Game state management (menu, playing, gameover)
- Animated batsman, bowler, umpire
- Ball physics and animations
- Score tracking
- Integration with backend API

Full code: See `/app/frontend/src/components/CricketGame.jsx`

### 3. Cricket Animations (`frontend/src/styles/cricket.css`)

```css
/* Cricket Field */
.cricket-field {
  position: relative;
  background: linear-gradient(180deg, #166534 0%, #15803d 100%);
  border-radius: 10px;
}

/* Batsman Animation */
.batsman.batting .bat {
  animation: bat-swing 0.3s ease-in-out;
}

@keyframes bat-swing {
  0% { transform: rotate(0deg); }
  50% { transform: rotate(-90deg); }
  100% { transform: rotate(0deg); }
}

/* Ball Travel Animation */
.ball {
  animation: ball-travel 0.5s ease-in;
}

@keyframes ball-travel {
  0% { top: 28%; left: 50%; transform: scale(1); }
  50% { top: 50%; left: 50%; transform: scale(1.3); }
  100% { top: 65%; left: 50%; transform: scale(1); }
}

/* Bowler Animation */
.bowler.bowling .arm-right {
  animation: bowling-arm 0.5s ease-in-out;
}

@keyframes bowling-arm {
  0% { transform: rotate(45deg); }
  50% { transform: rotate(-120deg); }
  100% { transform: rotate(45deg); }
}
```

### 4. Workflow Diagram Component (`frontend/src/components/WorkflowDiagram.jsx`)

Shows complete development pipeline:
1. Frontend Development (HTML/CSS/JS)
2. Backend Development (Node/Python/PHP)
3. Local Git Repository
4. Push to GitHub
5. CI/CD Pipeline (GitHub Actions)
6. Deployment (Hosting & DNS)
7. User Access (Web Browser)

Full code: See `/app/frontend/src/components/WorkflowDiagram.jsx`

### 5. Feedback Form Component (`frontend/src/components/FeedbackForm.jsx`)

Features:
- Name, email, message fields
- Email validation
- Sends to hari.darshini.612@gmail.com
- Success confirmation

Full code: See `/app/frontend/src/components/FeedbackForm.jsx`

### 6. Leaderboard Component (`frontend/src/components/Leaderboard.jsx`)

Features:
- Fetches top 10 scores
- Rank icons (Trophy, Medal, Award)
- Player names and scores
- Real-time updates

Full code: See `/app/frontend/src/components/Leaderboard.jsx`

### 7. Frontend Environment (`frontend/.env`)

```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

---

## \u2699\ufe0f Configuration Files

### 1. Tailwind Config (`frontend/tailwind.config.js`)

```javascript
module.exports = {
  darkMode: ["class"],
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      colors: {}
    }
  },
  plugins: [require("tailwindcss-animate")],
}
```

### 2. Package.json (`frontend/package.json`)

```json
{
  "name": "cricket-game-frontend",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router-dom": "^7.5.1",
    "axios": "^1.8.4",
    "lucide-react": "^0.507.0",
    "@radix-ui/react-*": "latest",
    "tailwindcss": "^3.4.17"
  },
  "scripts": {
    "start": "craco start",
    "build": "craco build",
    "test": "craco test"
  }
}
```

### 3. Docker Compose (`docker-compose.yml`)

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:7.0
    restart: always
    volumes:
      - mongodb_data:/data/db

  backend:
    build: ./backend
    restart: always
    ports:
      - "8001:8001"
    environment:
      - MONGO_URL=mongodb://mongodb:27017
      - DB_NAME=cricket_game
    depends_on:
      - mongodb

  frontend:
    build: ./frontend
    restart: always
    ports:
      - "3000:80"
    depends_on:
      - backend

volumes:
  mongodb_data:
```

---

## \ud83d\udd04 CI/CD Templates

### GitHub Actions Workflow (`.github/workflows/ci-cd.yml`)

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  frontend:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: '20'
    - run: cd frontend && yarn install
    - run: cd frontend && yarn build
    
  backend:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-python@v5
      with:
        python-version: '3.11'
    - run: cd backend && pip install -r requirements.txt
    - run: cd backend && pytest tests/ -v

  deploy:
    needs: [frontend, backend]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
    - uses: actions/checkout@v4
    - name: Deploy to server
      # Add your deployment steps here
```

---

## \ud83d\udcdd Usage Examples

### Backend API Calls

```javascript
// Save game score
const saveScore = async (playerName, score, wickets) => {
  const response = await axios.post(`${API}/save-score`, {
    player_name: playerName,
    score: score,
    wickets: wickets
  });
  return response.data;
};

// Get leaderboard
const getLeaderboard = async () => {
  const response = await axios.get(`${API}/scores?limit=10`);
  return response.data;
};

// Send feedback
const sendFeedback = async (name, email, message) => {
  const response = await axios.post(`${API}/send-feedback`, {
    name: name,
    email: email,
    message: message
  });
  return response.data;
};
```

### React Component Patterns

```javascript
// Game state management
const [gameState, setGameState] = useState("menu");
const [score, setScore] = useState(0);
const [wickets, setWickets] = useState(0);

// Animation handling
const [isAnimating, setIsAnimating] = useState(false);

// API integration
useEffect(() => {
  fetchData();
}, []);
```

---

## \ud83d\udee0\ufe0f Build Commands

### Development
```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn server:app --reload --port 8001

# Frontend
cd frontend
yarn install
yarn start
```

### Production
```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn server:app --host 0.0.0.0 --port 8001

# Frontend
cd frontend
yarn install
yarn build
# Serve build folder with Nginx or static server
```

---

## \ud83d\udcca Testing

### Backend Tests
```python
# tests/test_api.py
import pytest
from fastapi.testclient import TestClient
from server import app

client = TestClient(app)

def test_root():
    response = client.get("/api/")
    assert response.status_code == 200
    assert "message" in response.json()

def test_save_score():
    response = client.post("/api/save-score", json={
        "player_name": "Test Player",
        "score": 42,
        "wickets": 2
    })
    assert response.status_code == 200
    assert response.json()["score"] == 42
```

### Frontend Tests
```javascript
// App.test.js
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders cricket game', () => {
  render(<App />);
  const heading = screen.getByText(/Cricket Game/i);
  expect(heading).toBeInTheDocument();
});
```

---

**This template file contains all the code you need to rebuild the cricket game from scratch!** \ud83c\udfcf\u2728
