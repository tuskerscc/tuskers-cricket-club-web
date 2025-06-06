import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

interface TeamStats {
  matchesPlayed: number;
  matchesWon: number;
  totalRuns: number;
  totalWickets: number;
  winRate: number;
}

export default function StatsSection() {
  const { data: stats, isLoading } = useQuery<TeamStats>({
    queryKey: ['/api/stats/team'],
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-to-b from-blue-800 to-blue-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Season Statistics</h2>
            <p className="text-xl text-blue-300 max-w-3xl mx-auto">
              Performance metrics and achievements from our championship season
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-blue-700/50 rounded-2xl p-6 text-center animate-pulse">
                <div className="h-10 bg-blue-600 rounded mb-2"></div>
                <div className="h-4 bg-blue-600 rounded w-2/3 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const defaultStats = {
    matchesPlayed: 18,
    matchesWon: 15,
    totalRuns: 2450,
    totalWickets: 185,
    winRate: 83.3
  };

  const displayStats = stats || defaultStats;

  return (
    <section className="py-16 bg-gradient-to-b from-blue-800 to-blue-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Season Statistics</h2>
          <p className="text-xl text-blue-300 max-w-3xl mx-auto">
            Performance metrics and achievements from our championship season
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-blue-700/50 rounded-2xl p-6 text-center card-hover">
            <div className="text-3xl font-bold text-yellow-500 mb-2">
              {displayStats.matchesWon}
            </div>
            <div className="text-white">Matches Won</div>
            <div className="text-sm text-blue-300 mt-1">
              out of {displayStats.matchesPlayed}
            </div>
          </div>
          
          <div className="bg-blue-700/50 rounded-2xl p-6 text-center card-hover">
            <div className="text-3xl font-bold text-yellow-500 mb-2">
              {displayStats.totalRuns.toLocaleString()}
            </div>
            <div className="text-white">Total Runs</div>
            <div className="text-sm text-blue-300 mt-1">This Season</div>
          </div>
          
          <div className="bg-blue-700/50 rounded-2xl p-6 text-center card-hover">
            <div className="text-3xl font-bold text-yellow-500 mb-2">
              {displayStats.totalWickets}
            </div>
            <div className="text-white">Wickets Taken</div>
            <div className="text-sm text-blue-300 mt-1">Bowling Attack</div>
          </div>
          
          <div className="bg-blue-700/50 rounded-2xl p-6 text-center card-hover">
            <div className="text-3xl font-bold text-yellow-500 mb-2">
              {displayStats.winRate}%
            </div>
            <div className="text-white">Win Rate</div>
            <div className="text-sm text-blue-300 mt-1">Championship Form</div>
          </div>
        </div>

        <div className="bg-blue-700/50 rounded-2xl p-8 mb-12">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">
            Championship Journey
          </h3>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-4xl font-bold text-yellow-500 mb-2">🏆</div>
              <div className="text-white font-semibold">Champions</div>
              <div className="text-sm text-blue-300">2024 Season</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-yellow-500 mb-2">⭐</div>
              <div className="text-white font-semibold">Unbeaten Run</div>
              <div className="text-sm text-blue-300">12 Consecutive Wins</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-yellow-500 mb-2">🎯</div>
              <div className="text-white font-semibold">Best Performance</div>
              <div className="text-sm text-blue-300">Season Highlights</div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link href="/stats">
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-3 rounded-lg">
              View Detailed Stats
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
