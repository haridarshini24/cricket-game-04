// HARI DARSHINI - Cricket Game JavaScript

// Game State
let gameState = {
    currentView: 'game',
    currentScreen: 'menu',
    playerName: '',
    score: 0,
    wickets: 0,
    ballsPlayed: 0,
    isAnimating: false
};

const shots = [0, 1, 2, 3, 4, 6, 'OUT'];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    showView('game');
    loadLeaderboard();
    loadWorkflow();
});

// View Management
function showView(viewName) {
    // Hide all views
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    
    // Show selected view
    document.getElementById(`${viewName}-view`).classList.add('active');
    gameState.currentView = viewName;
    
    // Update button styles
    document.querySelectorAll('.nav-buttons .btn').forEach(btn => {
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-outline');
    });
    
    // Load data if needed
    if (viewName === 'leaderboard') {
        loadLeaderboard();
    }
}

// Game Functions
function startGame() {
    const playerNameInput = document.getElementById('player-name');
    const name = playerNameInput.value.trim();
    
    if (!name) {
        showToast('Please enter your name', 'Please provide your name to start the game');
        return;
    }
    
    gameState.playerName = name;
    gameState.score = 0;
    gameState.wickets = 0;
    gameState.ballsPlayed = 0;
    
    showScreen('playing');
    updateScoreDisplay();
}

function showScreen(screenName) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(`${screenName}-screen`).classList.add('active');
    gameState.currentScreen = screenName;
}

function playShot() {
    if (gameState.isAnimating || gameState.wickets >= 3) return;
    
    gameState.isAnimating = true;
    const hitBallBtn = document.getElementById('hit-ball-btn');
    hitBallBtn.disabled = true;
    
    // Bowler animation
    const bowler = document.getElementById('bowler');
    bowler.classList.add('bowling');
    
    setTimeout(() => {
        // Show ball
        const ball = document.getElementById('ball');
        ball.style.display = 'block';
        bowler.classList.remove('bowling');
    }, 500);
    
    setTimeout(() => {
        // Batsman hits
        const batsman = document.getElementById('batsman');
        batsman.classList.add('batting');
        
        // Get random result
        const result = shots[Math.floor(Math.random() * shots.length)];
        
        // Update score
        if (result === 'OUT') {
            gameState.wickets++;
        } else {
            gameState.score += result;
        }
        gameState.ballsPlayed++;
        
        // Hide ball
        document.getElementById('ball').style.display = 'none';
        
        // Show result
        showLastShot(result);
        updateScoreDisplay();
        
        // Check game over
        if (gameState.wickets >= 3) {
            setTimeout(() => endGame(), 1500);
        }
    }, 1000);
    
    setTimeout(() => {
        // Reset animations
        document.getElementById('batsman').classList.remove('batting');
        document.getElementById('last-shot').style.display = 'none';
        gameState.isAnimating = false;
        hitBallBtn.disabled = false;
    }, 1500);
}

function showLastShot(result) {
    const lastShot = document.getElementById('last-shot');
    lastShot.style.display = 'block';
    lastShot.className = 'last-shot-display';
    
    if (result === 'OUT') {
        lastShot.classList.add('out');
        lastShot.textContent = 'OUT! 🚫';
    } else if (result === 6) {
        lastShot.classList.add('six');
        lastShot.textContent = 'SIX! 🚀';
    } else if (result === 4) {
        lastShot.classList.add('four');
        lastShot.textContent = 'FOUR! 🎉';
    } else {
        lastShot.classList.add('runs');
        lastShot.textContent = `${result} ${result === 1 ? 'Run' : 'Runs'}`;
    }
}

function updateScoreDisplay() {
    document.getElementById('score-display').textContent = gameState.score;
    document.getElementById('wickets-display').textContent = `${gameState.wickets}/3`;
    document.getElementById('balls-display').textContent = gameState.ballsPlayed;
}

function endGame() {
    // Save score
    saveScore();
    
    // Show game over screen
    document.getElementById('player-name-display').textContent = `Well played, ${gameState.playerName}!`;
    document.getElementById('final-score').textContent = gameState.score;
    document.getElementById('final-balls').textContent = gameState.ballsPlayed;
    document.getElementById('final-wickets').textContent = gameState.wickets;
    
    showScreen('gameover');
}

function resetGame() {
    document.getElementById('player-name').value = '';
    gameState.playerName = '';
    gameState.score = 0;
    gameState.wickets = 0;
    gameState.ballsPlayed = 0;
    showScreen('menu');
}

// LocalStorage Functions
function saveScore() {
    try {
        const scores = JSON.parse(localStorage.getItem('cricket_scores') || '[]');
        const newScore = {
            id: Date.now().toString(),
            player_name: gameState.playerName,
            score: gameState.score,
            wickets: gameState.wickets,
            timestamp: new Date().toISOString()
        };
        
        scores.push(newScore);
        scores.sort((a, b) => b.score - a.score);
        localStorage.setItem('cricket_scores', JSON.stringify(scores.slice(0, 100)));
        
        showToast('Score Saved! 🎉', 'Your score has been saved to the leaderboard');
    } catch (error) {
        console.error('Error saving score:', error);
    }
}

function loadLeaderboard() {
    const content = document.getElementById('leaderboard-content');
    
    try {
        const scores = JSON.parse(localStorage.getItem('cricket_scores') || '[]');
        const topScores = scores.slice(0, 10);
        
        if (topScores.length === 0) {
            content.innerHTML = '<div class="empty-state">No scores yet. Be the first to play!</div>';
            return;
        }
        
        let html = '';
        topScores.forEach((score, index) => {
            const rankClass = index < 3 ? `rank-${index + 1}` : '';
            const rankIcon = getRankIcon(index);
            
            html += `
                <div class="leaderboard-entry ${rankClass}">
                    <div class="leaderboard-left">
                        <div class="rank-icon">${rankIcon}</div>
                        <div class="player-info">
                            <h3>${escapeHtml(score.player_name)}</h3>
                            <p>Wickets: ${score.wickets}/3</p>
                        </div>
                    </div>
                    <div>
                        <div class="score-badge">${score.score}</div>
                        <div class="score-badge-label">runs</div>
                    </div>
                </div>
            `;
        });
        
        content.innerHTML = html;
    } catch (error) {
        content.innerHTML = '<div class="empty-state">Error loading scores</div>';
    }
}

function getRankIcon(index) {
    if (index === 0) return '🏆';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return index + 1;
}

// Workflow
function loadWorkflow() {
    const steps = [
        {
            number: 1,
            icon: '💻',
            title: 'Frontend Development',
            subtitle: 'HTML, CSS, JavaScript',
            description: 'Build user interface with HTML, style with CSS, add interactivity with JavaScript'
        },
        {
            number: 2,
            icon: '⚙️',
            title: 'Backend Development',
            subtitle: 'Node.js, Python, PHP',
            description: 'Create APIs with your backend framework, manage database operations'
        },
        {
            number: 3,
            icon: '📁',
            title: 'Local Git Repository',
            subtitle: 'Version Control',
            description: 'Track changes, commit code, manage branches locally'
        },
        {
            number: 4,
            icon: '🔀',
            title: 'Push to GitHub',
            subtitle: 'Remote Repository',
            description: 'Push code to GitHub, collaborate with team, manage versions'
        },
        {
            number: 5,
            icon: '🔄',
            title: 'CI/CD Pipeline',
            subtitle: 'GitHub Actions',
            description: 'Automated testing, linting, building on every push'
        },
        {
            number: 6,
            icon: '🚀',
            title: 'Deployment',
            subtitle: 'Hosting & DNS',
            description: 'Deploy to cloud hosting, configure domain and DNS'
        },
        {
            number: 7,
            icon: '👥',
            title: 'User Access',
            subtitle: 'Web Browser',
            description: 'Users access your app via web browser from anywhere'
        }
    ];
    
    let html = '';
    steps.forEach((step, index) => {
        html += `
            <div class="workflow-step">
                <div class="workflow-step-header">
                    <div class="step-number">${step.number}</div>
                    <div class="step-icon">${step.icon}</div>
                </div>
                <h3>${step.title}</h3>
                <div class="subtitle">${step.subtitle}</div>
                <div class="description">${step.description}</div>
            </div>
        `;
        
        if (index < steps.length - 1) {
            html += '<div class="workflow-arrow">↓</div>';
        }
    });
    
    document.getElementById('workflow-steps').innerHTML = html;
}

// Feedback
function submitFeedback(event) {
    event.preventDefault();
    
    const name = document.getElementById('feedback-name').value;
    const email = document.getElementById('feedback-email').value;
    const message = document.getElementById('feedback-message').value;
    
    try {
        const feedback = JSON.parse(localStorage.getItem('cricket_feedback') || '[]');
        const newFeedback = {
            id: Date.now().toString(),
            name: name,
            email: email,
            message: message,
            timestamp: new Date().toISOString()
        };
        
        feedback.push(newFeedback);
        localStorage.setItem('cricket_feedback', JSON.stringify(feedback));
        
        // Show success
        document.getElementById('feedback-form-container').style.display = 'none';
        document.getElementById('feedback-success').style.display = 'block';
        
        showToast('Feedback Saved! 🎉', 'Your feedback has been saved successfully');
        
        // Reset after 3 seconds
        setTimeout(() => {
            document.getElementById('feedback-form').reset();
            document.getElementById('feedback-form-container').style.display = 'block';
            document.getElementById('feedback-success').style.display = 'none';
        }, 3000);
    } catch (error) {
        showToast('Error', 'Failed to save feedback. Please try again.');
    }
}

// Toast Notification
function showToast(title, description) {
    const toast = document.getElementById('toast');
    toast.innerHTML = `
        <div class="toast-title">${title}</div>
        <div class="toast-description">${description}</div>
    `;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Utility Functions
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (gameState.currentScreen === 'playing' && e.code === 'Space' && !gameState.isAnimating) {
        e.preventDefault();
        playShot();
    }
});
