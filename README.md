# 🏏 HARI DARSHINI - Frontend-Only Cricket Game

A fully client-side cricket game built with React. All data is stored in browser localStorage - **no backend required!**

![React](https://img.shields.io/badge/React-19.0-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-blue)
![LocalStorage](https://img.shields.io/badge/Storage-LocalStorage-green)

## ✨ Features

- 🏏 **Interactive Cricket Game** - Batsman, bowler, umpire with smooth animations
- 🏆 **Leaderboard** - Top 10 scores stored in localStorage
- 🚀 **Workflow Diagram** - Complete development pipeline visualization
- 📝 **Feedback System** - Save feedback locally
- 🌙 **Dark Theme** - Professional dark mode
- 📱 **Fully Responsive** - Works on mobile, tablet, desktop
- ⚡ **No Backend Needed** - Everything runs in the browser!

## 🎮 How to Play

1. Enter your name
2. Click "Hit Ball" to play your shot
3. Score runs (0, 1, 2, 3, 4, or 6)
4. Avoid getting OUT 3 times
5. Your score is automatically saved!

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and Yarn
- Modern web browser

### Installation

```bash
# Clone repository
git clone <your-repo-url>
cd hari-darshini

# Install dependencies
cd frontend
yarn install

# Start development server
yarn start
```

Open http://localhost:3000 in your browser!

## 📦 Build for Production

```bash
cd frontend
yarn build
```

The `build/` folder will contain all static files ready to deploy.

## 🌐 Deployment Options

### Option 1: Netlify (Easiest)
```bash
npm install -g netlify-cli
cd frontend
netlify deploy --prod --dir=build
```

### Option 2: Vercel
```bash
npm install -g vercel
cd frontend
vercel --prod
```

### Option 3: GitHub Pages
```bash
# Add to package.json:
"homepage": "https://yourusername.github.io/hari-darshini"

# Deploy
yarn build
gh-pages -d build
```

### Option 4: Traditional FTP
1. Build: `yarn build`
2. Upload `build/` folder contents to your hosting
3. Upload to `public_html/` or `www/` directory

## 💾 Data Storage

All data is stored in **browser localStorage**:
- **Game Scores**: Up to 100 scores saved locally
- **Feedback**: All feedback saved in browser
- **No Database Required**: Everything is client-side!

### Accessing Stored Data

Open browser console and run:
```javascript
// View all scores
JSON.parse(localStorage.getItem('cricket_scores'))

// View all feedback
JSON.parse(localStorage.getItem('cricket_feedback'))

// Clear all data
localStorage.clear()
```

## 📁 Project Structure

```
hari-darshini/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CricketGame.jsx      # Main game
│   │   │   ├── Leaderboard.jsx      # Scores
│   │   │   ├── WorkflowDiagram.jsx  # Dev workflow
│   │   │   ├── FeedbackForm.jsx     # Feedback
│   │   │   └── ui/                  # UI components
│   │   ├── styles/
│   │   │   └── cricket.css          # Animations
│   │   ├── App.js                   # Main app
│   │   └── index.js                 # Entry point
│   ├── package.json
│   └── tailwind.config.js
└── .github/
    └── workflows/
        └── ci-cd.yml                # GitHub Actions
```

## 🛠️ Tech Stack

- **React 19** - UI framework
- **Tailwind CSS** - Styling
- **Radix UI** - Component library
- **Lucide React** - Icons
- **LocalStorage API** - Data persistence
- **CSS Animations** - Smooth gameplay animations

## ⚙️ Available Scripts

```bash
# Development
yarn start          # Start dev server on port 3000

# Production
yarn build          # Create optimized build

# Testing (optional)
yarn test           # Run tests
```

## 🎨 Features Detail

### Cricket Game
- Animated batsman, bowler, umpire
- Ball physics and animations
- Random scoring system
- 3 wickets game over
- Auto-save to localStorage

### Leaderboard
- Top 10 scores displayed
- Sorted by highest score
- Shows player name, score, wickets
- Real-time updates

### Workflow Diagram
- Visual development pipeline
- Frontend → Git → GitHub → CI/CD → Deploy
- FTP deployment option
- User access flow

### Feedback Form
- Name, email, message fields
- Saves to localStorage
- Form validation

## 🌐 Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers
- ⚠️ Requires localStorage support

## 🔧 Customization

### Change Colors

Edit `frontend/src/styles/cricket.css`:
```css
/* Batsman */
.batsman .body { background: #10b981; }

/* Bowler */
.bowler .body { background: #3b82f6; }

/* Field */
.cricket-field { 
  background: linear-gradient(180deg, #166534 0%, #15803d 100%);
}
```

### Change Game Rules

Edit `frontend/src/components/CricketGame.jsx`:
```javascript
// Line 27 - Available shots
const shots = [0, 1, 2, 3, 4, 6, "OUT"];

// Line 64 - Wickets limit
if (wickets >= 3)  // Change to any number
```

## 📝 GitHub Actions CI/CD

Automated build pipeline included:
- ✅ Builds on every push
- ✅ Creates index.html
- ✅ Tests build success
- ✅ Ready for deployment

## 🎯 Performance

- ⚡ Fast loading (no API calls)
- 💾 Minimal storage usage
- 🚀 Instant responses
- 📱 Mobile optimized
- 🎨 Smooth 60fps animations

## 🔒 Privacy

- ✅ No data sent to servers
- ✅ Everything stored locally
- ✅ No cookies or tracking
- ✅ Works offline (after first load)
- ✅ Complete privacy

## 🆘 Troubleshooting

### Scores not saving
- Check if localStorage is enabled in browser
- Try clearing cache and reload

### Build fails
```bash
cd frontend
rm -rf node_modules
yarn install
yarn build
```

### Page not loading
- Clear browser cache
- Check console for errors
- Ensure JavaScript is enabled

## 📄 License

Open source - feel free to use and modify!

## 🙏 Credits

Built with:
- React 19
- Tailwind CSS
- Radix UI
- LocalStorage API

---

**No backend, no database, no complications - just pure cricket fun! 🏏⚡**

For questions, use the in-app feedback form!
