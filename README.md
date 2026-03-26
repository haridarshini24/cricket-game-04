# 🏏 Cricket Game - Full Stack Web Application

A fun and interactive cricket game built with React (frontend) and FastAPI (backend). Features animated gameplay, leaderboard, workflow visualization, and feedback system.

![Cricket Game](https://img.shields.io/badge/Game-Cricket-green)
![React](https://img.shields.io/badge/React-19.0-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.110-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green)

## ✨ Features

- 🏏 **Interactive Cricket Game** - Batsman, bowler, and umpire with smooth animations
- 🏆 **Leaderboard** - Track top scores from all players
- 🚀 **Workflow Visualization** - Complete development pipeline diagram
- 📧 **Feedback System** - Send feedback via email
- 🌑 **Dark Theme** - Easy on the eyes
- 📱 **Responsive Design** - Works on mobile, tablet, and desktop

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **Tailwind CSS** - Styling
- **Radix UI** - Component library
- **Axios** - HTTP client
- **React Router** - Navigation

### Backend
- **FastAPI** - Python web framework
- **MongoDB** - Database
- **Motor** - Async MongoDB driver
- **Resend** - Email service
- **Pydantic** - Data validation

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and Yarn
- Python 3.11+
- MongoDB (local or cloud)
- Git

### Installation

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd cricket-game
```

2. **Backend Setup**

```bash
cd backend

# Create virtual environment (optional)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Edit .env and add your configuration:
# MONGO_URL=mongodb://localhost:27017
# DB_NAME=cricket_game
# RESEND_API_KEY=your_resend_api_key  # Optional
# SENDER_EMAIL=onboarding@resend.dev
```

3. **Frontend Setup**

```bash
cd ../frontend

# Install dependencies
yarn install

# Create .env file
echo "REACT_APP_BACKEND_URL=http://localhost:8001" > .env
```

4. **Start MongoDB**

```bash
# If using local MongoDB
mongod --dbpath /path/to/data/directory

# Or use MongoDB Atlas (cloud)
```

5. **Run the Application**

```bash
# Terminal 1 - Backend
cd backend
uvicorn server:app --host 0.0.0.0 --port 8001 --reload

# Terminal 2 - Frontend
cd frontend
yarn start
```

6. **Access the Application**

Open your browser and navigate to:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8001/api`
- API Docs: `http://localhost:8001/docs`

## 🎮 How to Play

1. **Start Game** - Enter your name and click "Start Game"
2. **Hit the Ball** - Click "Hit Ball" to play your shot
3. **Score Runs** - Try to score as many runs as possible (0, 1, 2, 3, 4, or 6)
4. **Avoid Getting Out** - You have 3 wickets. Game ends when you lose all wickets
5. **View Leaderboard** - Check top scores from all players
6. **Send Feedback** - Share your thoughts about the game

## 📁 Project Structure

```
cricket-game/
├── frontend/                  # React frontend
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── CricketGame.jsx  # Main game component
│   │   │   ├── Leaderboard.jsx  # Leaderboard component
│   │   │   ├── WorkflowDiagram.jsx
│   │   │   ├── FeedbackForm.jsx
│   │   │   └── ui/              # UI components (buttons, cards, etc.)
│   │   ├── styles/
│   │   │   └── cricket.css      # Cricket animations
│   │   ├── App.js              # Main app component
│   │   ├── App.css
│   │   └── index.js
│   ├── package.json
│   └── tailwind.config.js
├── backend/                   # FastAPI backend
│   ├── server.py               # Main FastAPI app
│   ├── requirements.txt        # Python dependencies
│   ├── .env                    # Environment variables
│   └── .env.example
├── .github/
│   └── workflows/
│       └── ci-cd.yml           # GitHub Actions CI/CD
├── DEPLOYMENT.md              # Deployment guide
└── README.md                  # This file
```

## 📧 Email Configuration (Optional)

To enable email notifications for feedback:

1. Sign up at [Resend](https://resend.com)
2. Create an API key
3. Add to `backend/.env`:
   ```
   RESEND_API_KEY=re_your_api_key_here
   SENDER_EMAIL=onboarding@resend.dev
   ```
4. Restart backend server

## 🚀 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions including:

- **GitHub Actions CI/CD** - Automated testing and deployment
- **VPS/Cloud Deployment** - Deploy to DigitalOcean, AWS, etc.
- **FTP Deployment** - Traditional hosting deployment
- **Docker Deployment** - Containerized deployment
- **Domain & DNS Setup** - Configure custom domain

## 🧪 Testing

### Frontend Testing
```bash
cd frontend
yarn test
```

### Backend Testing
```bash
cd backend
pytest tests/ -v
```

### Linting
```bash
# Frontend
cd frontend
yarn lint

# Backend
cd backend
flake8 .
```

## 📚 API Endpoints

### Game Scores
- `GET /api/` - Health check
- `POST /api/save-score` - Save game score
- `GET /api/scores?limit=10` - Get top scores

### Feedback
- `POST /api/send-feedback` - Send feedback email

### Example API Call

```javascript
// Save score
const response = await axios.post('/api/save-score', {
  player_name: 'John Doe',
  score: 42,
  wickets: 2
});

// Get leaderboard
const scores = await axios.get('/api/scores?limit=10');
```

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with ❤️ using React and FastAPI
- Animations created with CSS keyframes
- UI components from Radix UI and Tailwind CSS

## 💬 Contact

For feedback or questions, use the in-app feedback form or email: **hari.darshini.612@gmail.com**

---

**Enjoy the game! 🏏🏆**
