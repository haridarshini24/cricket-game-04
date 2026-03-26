# \ud83c\udfaf QUICK REFERENCE - Cricket Game

## \u26a1 Quick Commands

### Start/Stop Services

```bash
# Restart all services
sudo supervisorctl restart all

# Check status
sudo supervisorctl status

# Restart individual services
sudo supervisorctl restart backend
sudo supervisorctl restart frontend

# View logs
tail -f /var/log/supervisor/backend.*.log
tail -f /var/log/supervisor/frontend.*.log
```

### Development

```bash
# Backend
cd /app/backend
source venv/bin/activate  # If using venv
uvicorn server:app --reload --port 8001

# Frontend
cd /app/frontend
yarn start

# Install new backend dependency
cd /app/backend
pip install package_name
pip freeze > requirements.txt

# Install new frontend dependency
cd /app/frontend
yarn add package_name
```

### Testing

```bash
# Test backend API
curl http://localhost:8001/api/

# Test save score
curl -X POST http://localhost:8001/api/save-score \\
  -H "Content-Type: application/json" \\
  -d '{"player_name": "Test", "score": 42, "wickets": 2}'

# Test get scores
curl http://localhost:8001/api/scores?limit=10

# Test MongoDB
mongosh
use cricket_game
db.game_scores.find().limit(10)
db.feedback.find()
```

---

## \ud83d\udcdd File Locations

### Key Files

```
Backend Server:     /app/backend/server.py
Backend Env:        /app/backend/.env
Frontend App:       /app/frontend/src/App.js
Cricket Game:       /app/frontend/src/components/CricketGame.jsx
Cricket CSS:        /app/frontend/src/styles/cricket.css
Frontend Env:       /app/frontend/.env
```

### Documentation

```
Main README:        /app/README.md
Deployment:         /app/DEPLOYMENT.md
Code Templates:     /app/CODE_TEMPLATES.md
Project Summary:    /app/PROJECT_SUMMARY.md
This File:          /app/QUICK_REFERENCE.md
```

### Configuration

```
GitHub Actions:     /app/.github/workflows/ci-cd.yml
Package.json:       /app/frontend/package.json
Requirements:       /app/backend/requirements.txt
Tailwind Config:    /app/frontend/tailwind.config.js
```

---

## \ud83c\udfae Game URLs

### Local Development

```
Frontend:           http://localhost:3000
Backend API:        http://localhost:8001
API Docs:           http://localhost:8001/docs
MongoDB:            mongodb://localhost:27017
```

### Production (Your Deployment)

```
Frontend:           https://creative-builder-34.preview.emergentagent.com/
Backend API:        https://creative-builder-34.preview.emergentagent.com/api
```

---

## \ud83d\udd27 Common Tasks

### Add New API Endpoint

1. Edit `/app/backend/server.py`
2. Add route with `@api_router.get()` or `@api_router.post()`
3. Backend auto-reloads (hot reload enabled)

### Add New Component

1. Create file in `/app/frontend/src/components/`
2. Import in `/app/frontend/src/App.js`
3. Frontend auto-reloads (hot reload enabled)

### Update Styling

1. Edit `/app/frontend/src/styles/cricket.css` for game styles
2. Edit `/app/frontend/src/App.css` for global styles
3. Use Tailwind classes in components

### Change Environment Variables

```bash
# Backend
nano /app/backend/.env
sudo supervisorctl restart backend

# Frontend  
nano /app/frontend/.env
sudo supervisorctl restart frontend
```

---

## \ud83d\udc1b Debugging

### Backend Not Working

```bash
# Check logs
tail -n 100 /var/log/supervisor/backend.err.log

# Check if running
sudo supervisorctl status backend

# Restart
sudo supervisorctl restart backend

# Test API
curl http://localhost:8001/api/
```

### Frontend Not Loading

```bash
# Check logs
tail -n 50 /var/log/supervisor/frontend.out.log
tail -n 50 /var/log/supervisor/frontend.err.log

# Check if running
sudo supervisorctl status frontend

# Restart
sudo supervisorctl restart frontend
```

### Database Issues

```bash
# Check MongoDB status
sudo supervisorctl status mongodb

# Access MongoDB shell
mongosh

# In mongosh:
use cricket_game
db.game_scores.find().pretty()
db.feedback.find().pretty()

# Count documents
db.game_scores.countDocuments()
```

### Clear All Game Scores

```bash
mongosh
use cricket_game
db.game_scores.deleteMany({})
db.feedback.deleteMany({})
```

---

## \ud83d\ude80 Deployment Quick Reference

### Build for Production

```bash
# Frontend
cd /app/frontend
yarn build
# Output: /app/frontend/build/

# Backend (no build needed, just copy files)
cd /app/backend
# Ensure requirements.txt is up to date
pip freeze > requirements.txt
```

### Push to GitHub

```bash
cd /app
git init
git add .
git commit -m "Initial commit: Cricket Game"
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main
```

### Quick Deploy to Vercel (Frontend Only)

```bash
cd /app/frontend
npm install -g vercel
vercel
# Follow prompts
```

---

## \ud83d\udcca API Endpoints Quick Reference

| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| GET | `/api/` | - | Health check message |
| POST | `/api/save-score` | `{player_name, score, wickets}` | Saved score object |
| GET | `/api/scores?limit=10` | - | Array of top scores |
| POST | `/api/send-feedback` | `{name, email, message}` | Success message |

### Example API Calls

```javascript
// Save score
await axios.post(`${API}/save-score`, {
  player_name: "John",
  score: 42,
  wickets: 2
});

// Get leaderboard
const scores = await axios.get(`${API}/scores?limit=10`);

// Send feedback
await axios.post(`${API}/send-feedback`, {
  name: "John",
  email: "john@example.com",
  message: "Great game!"
});
```

---

## \ud83d\udd11 Environment Variables

### Backend (.env)

```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=cricket_game
CORS_ORIGINS=*
RESEND_API_KEY=re_xxxxx                    # Optional
SENDER_EMAIL=onboarding@resend.dev         # Optional
```

### Frontend (.env)

```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

---

## \ud83d\udcda Project Statistics

```
Frontend Components:     5 main components
Backend Endpoints:       4 API endpoints
Lines of Code:          ~2000+ lines
Dependencies:           30+ packages
Database Collections:   2 (game_scores, feedback)
Animation Effects:      10+ CSS animations
Responsive Breakpoints: Mobile, Tablet, Desktop
```

---

## \ud83c\udfaf Game Features Checklist

- [x] Cricket game with animations
- [x] Batsman, bowler, umpire characters
- [x] Stadium background
- [x] Ball physics and movement
- [x] Score tracking
- [x] Wickets system (3 wickets = game over)
- [x] Leaderboard (top 10 scores)
- [x] Workflow visualization
- [x] Feedback form with email
- [x] Dark theme
- [x] Mobile responsive
- [x] GitHub CI/CD ready

---

## \u2728 Quick Tips

### Performance

- Frontend has hot reload - no restart needed for code changes
- Backend has hot reload - auto-restarts on file changes
- Only restart services when installing new packages or changing .env

### Best Practices

- Always test locally before deploying
- Use .env.example for sharing config templates
- Never commit .env files to Git
- Keep dependencies updated
- Run tests before merging code

### Customization

- Colors: Edit `/app/frontend/src/styles/cricket.css`
- Game Rules: Edit `/app/frontend/src/components/CricketGame.jsx`
- UI Components: Edit components in `/app/frontend/src/components/`
- API Logic: Edit `/app/backend/server.py`

---

**Quick access to all docs:**
- Main: `/app/README.md`
- Deploy: `/app/DEPLOYMENT.md`
- Code: `/app/CODE_TEMPLATES.md`
- Summary: `/app/PROJECT_SUMMARY.md`
- This: `/app/QUICK_REFERENCE.md`

**Have fun! \ud83c\udfcf**
