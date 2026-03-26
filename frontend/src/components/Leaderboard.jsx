import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Leaderboard = () => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScores();
  }, []);

  const fetchScores = async () => {
    try {
      const response = await axios.get(`${API}/scores?limit=10`);
      setScores(response.data);
    } catch (error) {
      console.error("Error fetching scores:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (index) => {
    if (index === 0) return <Trophy className="w-6 h-6 text-yellow-400" />;
    if (index === 1) return <Medal className="w-6 h-6 text-gray-300" />;
    if (index === 2) return <Award className="w-6 h-6 text-orange-400" />;
    return <span className="text-gray-400 font-bold">{index + 1}</span>;
  };

  const getRankColor = (index) => {
    if (index === 0) return "bg-yellow-600";
    if (index === 1) return "bg-gray-600";
    if (index === 2) return "bg-orange-600";
    return "bg-gray-700";
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl" data-testid="leaderboard">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl md:text-4xl text-green-400 mb-2 flex items-center justify-center gap-2">
            <Trophy className="w-10 h-10" />
            HARI DARSHINI - Leaderboard
          </CardTitle>
          <CardDescription className="text-gray-300 text-lg">
            Top Cricket Players
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto"></div>
              <p className="text-gray-400 mt-4">Loading scores...</p>
            </div>
          ) : scores.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No scores yet. Be the first to play!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {scores.map((score, index) => (
                <div
                  key={score.id}
                  data-testid={`leaderboard-entry-${index}`}
                  className={`${getRankColor(index)} p-4 rounded-lg hover:scale-105 transition-transform duration-200`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      {/* Rank */}
                      <div className="flex items-center justify-center w-10 h-10">
                        {getRankIcon(index)}
                      </div>

                      {/* Player Info */}
                      <div className="flex-1">
                        <h3 className="text-white font-bold text-lg">
                          {score.player_name}
                        </h3>
                        <p className="text-gray-300 text-sm">
                          Wickets: {score.wickets}/3
                        </p>
                      </div>

                      {/* Score */}
                      <div className="text-right">
                        <Badge className="bg-green-600 text-white text-xl px-4 py-2">
                          {score.score}
                        </Badge>
                        <p className="text-gray-300 text-xs mt-1">runs</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Leaderboard;
