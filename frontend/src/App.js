import { useState } from "react";
import "@/App.css";
import CricketGame from "@/components/CricketGame";
import WorkflowDiagram from "@/components/WorkflowDiagram";
import FeedbackForm from "@/components/FeedbackForm";
import Leaderboard from "@/components/Leaderboard";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { Trophy, Code, MessageSquare } from "lucide-react";

function App() {
  const [currentView, setCurrentView] = useState("game");

  return (
    <div className="App min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold text-green-400 flex items-center gap-2">
              🏏 Cricket Game
            </h1>
            <div className="flex gap-2">
              <Button
                data-testid="game-tab-btn"
                variant={currentView === "game" ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentView("game")}
                className="text-xs md:text-sm"
              >
                Play
              </Button>
              <Button
                data-testid="leaderboard-tab-btn"
                variant={currentView === "leaderboard" ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentView("leaderboard")}
                className="text-xs md:text-sm"
              >
                <Trophy className="w-4 h-4 mr-1" />
                Scores
              </Button>
              <Button
                data-testid="workflow-tab-btn"
                variant={currentView === "workflow" ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentView("workflow")}
                className="text-xs md:text-sm"
              >
                <Code className="w-4 h-4 mr-1" />
                Workflow
              </Button>
              <Button
                data-testid="feedback-tab-btn"
                variant={currentView === "feedback" ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentView("feedback")}
                className="text-xs md:text-sm"
              >
                <MessageSquare className="w-4 h-4 mr-1" />
                Feedback
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-20 pb-8">
        {currentView === "game" && <CricketGame />}
        {currentView === "leaderboard" && <Leaderboard />}
        {currentView === "workflow" && <WorkflowDiagram />}
        {currentView === "feedback" && <FeedbackForm />}
      </div>

      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}

export default App;
