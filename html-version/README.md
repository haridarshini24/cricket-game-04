# 🏏 HARI DARSHINI - Pure HTML/CSS/JavaScript Version

A cricket game built with **pure HTML, CSS, and JavaScript** - no frameworks, no build tools!

## 📁 Files Included

```
html-version/
├── index.html      # Main HTML file
├── style.css       # All styles and animations
├── script.js       # Game logic and functionality
└── README.md       # This file
```

## 🚀 How to Use

### Option 1: Open Locally
1. Download all 3 files (index.html, style.css, script.js)
2. Put them in the same folder
3. Double-click `index.html`
4. Play the game in your browser!

### Option 2: Upload to Any Web Hosting

#### Via FTP (Traditional Hosting):
1. Connect to your hosting via FTP (FileZilla, Cyberduck, etc.)
2. Upload all 3 files to `public_html/` or `www/` directory
3. Access via your domain: `http://yourdomain.com`

#### Via GitHub Pages:
```bash
# 1. Create new repository on GitHub
# 2. Upload files
git init
git add .
git commit -m "HARI DARSHINI Cricket Game"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/hari-darshini.git
git push -u origin main

# 3. Enable GitHub Pages
# Go to Settings → Pages → Source: main branch → Save
# Your site will be at: https://YOUR_USERNAME.github.io/hari-darshini/
```

#### Via Netlify Drag & Drop:
1. Go to https://app.netlify.com/drop
2. Drag the folder with all 3 files
3. Get instant live URL!

#### Via Surge:
```bash
npm install -g surge
cd html-version
surge
```

## ✨ Features

- 🏏 **Cricket Game** - Batsman, bowler, umpire with animations
- 🏆 **Leaderboard** - Top 10 scores (localStorage)
- 🚀 **Workflow Diagram** - Development pipeline visualization
- 📝 **Feedback Form** - Save feedback locally
- 🌙 **Dark Theme** - Beautiful dark mode design
- 📱 **Fully Responsive** - Works on all devices
- ⚡ **No Dependencies** - Pure HTML/CSS/JS
- 💾 **LocalStorage** - All data saved in browser

## 🎮 How to Play

1. Enter your name
2. Click "Hit Ball" or press Spacebar
3. Score runs (0, 1, 2, 3, 4, or 6)
4. Avoid getting OUT 3 times
5. Your score is automatically saved!

## 🎨 Customization

### Change Colors

Edit `style.css`:

```css
/* Primary color (green) */
.btn-primary {
    background: #4ade80;  /* Change this */
}

/* Field color */
.cricket-field {
    background: linear-gradient(180deg, #166534 0%, #15803d 100%);
}
```

### Change Game Rules

Edit `script.js`:

```javascript
// Line 16 - Available shots
const shots = [0, 1, 2, 3, 4, 6, 'OUT'];

// Line 112 - Wickets limit
if (gameState.wickets >= 3)  // Change 3 to any number
```

### Add Your Branding

Edit `index.html`:

```html
<!-- Line 12 - Change title -->
<title>Your Game Name</title>

<!-- Line 21 - Change heading -->
<h1 class="title">🏏 Your Game Name</h1>
```

## 💾 Data Storage

All data is stored in browser's localStorage:

```javascript
// View scores in browser console
JSON.parse(localStorage.getItem('cricket_scores'))

// View feedback
JSON.parse(localStorage.getItem('cricket_feedback'))

// Clear all data
localStorage.clear()
```

## 🌐 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers
- ⚠️ IE11 not supported

## 📝 File Sizes

- **index.html**: ~15 KB
- **style.css**: ~14 KB
- **script.js**: ~8 KB
- **Total**: ~37 KB (extremely lightweight!)

## 🔧 Technical Details

### Technologies Used:
- Pure HTML5
- Pure CSS3 (with animations)
- Vanilla JavaScript (ES6+)
- LocalStorage API
- No external dependencies

### Features:
- CSS Grid & Flexbox layouts
- CSS Keyframe animations
- LocalStorage for data persistence
- Responsive design with media queries
- Clean, semantic HTML

## 🎯 Performance

- ⚡ Loads instantly (no external resources)
- 💾 Minimal file size (~37 KB total)
- 🚀 No build process needed
- 📱 Mobile optimized
- 🎨 Smooth 60fps animations

## 🔒 Privacy

- ✅ No external API calls
- ✅ No tracking or analytics
- ✅ All data stays in your browser
- ✅ No cookies
- ✅ 100% offline after first load

## 📦 Deployment Checklist

- [ ] Download all 3 files
- [ ] Test locally by opening index.html
- [ ] Upload to your hosting
- [ ] Verify all files are in same directory
- [ ] Check game works on live URL
- [ ] Test on mobile devices

## 🆘 Troubleshooting

### Game not loading?
- Ensure all 3 files are in the same folder
- Check browser console for errors (F12)
- Try different browser

### Scores not saving?
- Check if localStorage is enabled
- Try clearing cache and reload
- Check browser privacy settings

### Animations not working?
- Update to latest browser version
- Enable JavaScript
- Clear browser cache

## 🎉 Ready to Deploy!

This is a **complete, production-ready** cricket game that works anywhere!

**No installation, no dependencies, no build process - just pure web technologies!**

---

**Perfect for:**
- Learning HTML/CSS/JavaScript
- School/college projects
- Portfolio websites
- Quick deployments
- Static hosting (GitHub Pages, Netlify, etc.)
- Offline games
- Minimal hosting requirements

**Enjoy your cricket game! 🏏⚡**
