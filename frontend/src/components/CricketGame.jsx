import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlayCircle, RotateCcw } from "lucide-react";
import "@/styles/cricket.css";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CricketGame = () => {
  const [gameState, setGameState] = useState("menu"); // menu, playing, gameover
  const [playerName, setPlayerName] = useState("");
  const [score, setScore] = useState(0);
  const [wickets, setWickets] = useState(0);
  const [ballsPlayed, setBallsPlayed] = useState(0);
  const [lastShot, setLastShot] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [bowlerAnimation, setBowlerAnimation] = useState(false);
  const [ballAnimation, setBallAnimation] = useState(false);
  const [batsmanAnimation, setBatsmanAnimation] = useState(false);

  const shots = [0, 1, 2, 3, 4, 6, "OUT"];

  const startGame = () => {
    if (playerName.trim()) {
      setGameState("playing");
      setScore(0);
      setWickets(0);
      setBallsPlayed(0);
      setLastShot(null);
    }
  };

  const playShot = () => {
    if (isAnimating || wickets >= 3) return;

    setIsAnimating(true);
    setBowlerAnimation(true);

    // Bowler animation
    setTimeout(() => {
      setBallAnimation(true);
      setBowlerAnimation(false);
    }, 500);

    // Ball reaches batsman
    setTimeout(() => {
      setBatsmanAnimation(true);
      const result = shots[Math.floor(Math.random() * shots.length)];
      setLastShot(result);

      if (result === "OUT") {
        setWickets(prev => prev + 1);
        if (wickets + 1 >= 3) {
          setTimeout(() => endGame(), 1500);
        }
      } else {
        setScore(prev => prev + result);
      }

      setBallsPlayed(prev => prev + 1);
      setBallAnimation(false);
    }, 1000);

    // Reset animations
    setTimeout(() => {
      setBatsmanAnimation(false);
      setIsAnimating(false);
    }, 1500);
  };

  const endGame = async () => {
    setGameState("gameover");
    
    // Save score to backend
    try {
      await axios.post(`${API}/save-score`, {
        player_name: playerName,
        score: score,
        wickets: wickets
      });
    } catch (error) {
      console.error("Error saving score:", error);
    }
  };

  const resetGame = () => {
    setGameState("menu");
    setPlayerName("");
    setScore(0);
    setWickets(0);
    setBallsPlayed(0);
    setLastShot(null);
  };

  // Menu Screen
  if (gameState === "menu") {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="bg-gray-800 border-gray-700" data-testid="game-menu">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl md:text-5xl text-green-400 mb-4">
              🏏 HARI DARSHINI
            </CardTitle>
            <CardDescription className="text-gray-300 text-lg">
              Hit as many runs as you can before losing 3 wickets!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-gray-300 font-medium">Enter Your Name</label>
              <Input
                data-testid="player-name-input"
                type="text"
                placeholder="Your name..."
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white text-lg"
                onKeyPress={(e) => e.key === "Enter" && startGame()}
              />
            </div>
            <Button
              data-testid="start-game-btn"
              onClick={startGame}
              disabled={!playerName.trim()}
              className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-6"
              size="lg"
            >
              <PlayCircle className="w-6 h-6 mr-2" />
              Start Game
            </Button>
            <div className="text-center text-gray-400 text-sm space-y-1">
              <p>🎯 Click "Hit Ball" to play your shot</p>
              <p>🏆 Score runs: 0, 1, 2, 3, 4, or 6</p>
              <p>⚠️ Avoid getting OUT 3 times!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Game Over Screen
  if (gameState === "gameover") {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="bg-gray-800 border-gray-700" data-testid="game-over-screen">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl md:text-5xl text-red-400 mb-4">
              Game Over!
            </CardTitle>
            <CardDescription className="text-gray-300 text-xl">
              Well played, {playerName}!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gray-900 p-8 rounded-lg text-center space-y-4">
              <div>
                <p className="text-gray-400 text-sm">Final Score</p>
                <p className="text-6xl font-bold text-green-400" data-testid="final-score">{score}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div>
                  <p className="text-gray-400 text-sm">Balls Played</p>
                  <p className="text-2xl font-bold text-blue-400">{ballsPlayed}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Wickets Lost</p>
                  <p className="text-2xl font-bold text-red-400">{wickets}</p>
                </div>
              </div>
            </div>
            <Button
              data-testid="play-again-btn"
              onClick={resetGame}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-6"
              size="lg"
            >
              <RotateCcw className="w-6 h-6 mr-2" />
              Play Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Playing Screen
  return (
    <div className="container mx-auto px-4 py-4 max-w-6xl">
      {/* Score Display */}
      <div className="mb-6 grid grid-cols-3 gap-2 md:gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-3 md:p-4 text-center">
            <p className="text-xs md:text-sm text-gray-400">Score</p>
            <p className="text-2xl md:text-4xl font-bold text-green-400" data-testid="current-score">{score}</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-3 md:p-4 text-center">
            <p className="text-xs md:text-sm text-gray-400">Wickets</p>
            <p className="text-2xl md:text-4xl font-bold text-red-400" data-testid="current-wickets">{wickets}/3</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-3 md:p-4 text-center">
            <p className="text-xs md:text-sm text-gray-400">Balls</p>
            <p className="text-2xl md:text-4xl font-bold text-blue-400">{ballsPlayed}</p>
          </CardContent>
        </Card>
      </div>

      {/* Cricket Field */}
      <Card className="bg-gradient-to-b from-green-900 to-green-800 border-gray-700 mb-6">
        <CardContent className="p-4 md:p-8">
          <div className="cricket-field relative h-[400px] md:h-[500px]" data-testid="cricket-field">
            {/* Stadium Background */}
            <div className="stadium-bg">
              <div className="stands"></div>
            </div>

            {/* Bowler */}
            <div className={`bowler ${bowlerAnimation ? 'bowling' : ''}`} data-testid="bowler">
              <div className="bowler-body">
                <div className="head"></div>
                <div className="body"></div>
                <div className="arm-left"></div>
                <div className="arm-right"></div>
                <div className="leg-left"></div>
                <div className="leg-right"></div>
              </div>
            </div>

            {/* Ball */}
            {ballAnimation && (
              <div className="ball" data-testid="cricket-ball"></div>
            )}

            {/* Batsman */}
            <div className={`batsman ${batsmanAnimation ? 'batting' : ''}`} data-testid="batsman">
              <div className="batsman-body">
                <div className="head"></div>
                <div className="body"></div>
                <div className="bat"></div>
                <div className="leg-left"></div>
                <div className="leg-right"></div>
              </div>
            </div>

            {/* Umpire */}
            <div className="umpire" data-testid="umpire">
              <div className="umpire-body">
                <div className="head"></div>
                <div className="body"></div>
                <div className="arm-left"></div>
                <div className="arm-right"></div>
              </div>
            </div>

            {/* Pitch */}
            <div className="pitch"></div>

            {/* Last Shot Display */}
            {lastShot !== null && (
              <div className="last-shot-display" data-testid="last-shot-result">
                {lastShot === "OUT" ? (
                  <Badge className="bg-red-600 text-white text-3xl md:text-5xl px-6 py-3 animate-bounce">
                    OUT! 🚫
                  </Badge>
                ) : lastShot === 6 ? (
                  <Badge className="bg-yellow-500 text-black text-3xl md:text-5xl px-6 py-3 animate-bounce">
                    SIX! 🚀
                  </Badge>
                ) : lastShot === 4 ? (
                  <Badge className="bg-blue-500 text-white text-3xl md:text-5xl px-6 py-3 animate-bounce">
                    FOUR! 🎉
                  </Badge>
                ) : (
                  <Badge className="bg-green-600 text-white text-3xl md:text-5xl px-6 py-3 animate-bounce">
                    {lastShot} {lastShot === 1 ? 'Run' : 'Runs'}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Game Controls */}
      <div className="text-center space-y-4">
        <Button
          data-testid="hit-ball-btn"
          onClick={playShot}
          disabled={isAnimating || wickets >= 3}
          className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white text-xl px-12 py-8 disabled:opacity-50"
          size="lg"
        >
          🏏 Hit Ball!
        </Button>
        <p className="text-gray-400 text-sm">Click to play your shot</p>
      </div>
    </div>
  );
};

export default CricketGame;
