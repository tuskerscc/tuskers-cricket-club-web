import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import type { PlayerWithStats } from '@shared/schema';

interface TeamSectionProps {
  limit?: number;
  showViewAll?: boolean;
}

export default function TeamSection({ limit = 5, showViewAll = true }: TeamSectionProps) {
  const { data: players = [], isLoading } = useQuery<PlayerWithStats[]>({
    queryKey: ['/api/players/with-stats'],
  });

  const displayPlayers = limit ? players.slice(0, limit) : players;

  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-to-b from-blue-900 to-blue-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Our Champions</h2>
            <p className="text-xl text-blue-300 max-w-3xl mx-auto">
              Meet the talented squad that brought home the championship
            </p>
          </div>
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-blue-800/50 rounded-2xl overflow-hidden animate-pulse">
                <div className="w-full h-48 bg-blue-700"></div>
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-blue-700 rounded w-3/4"></div>
                  <div className="h-3 bg-blue-700 rounded w-1/2"></div>
                  <div className="h-3 bg-blue-700 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (players.length === 0) {
    return (
      <section className="py-16 bg-gradient-to-b from-blue-900 to-blue-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Our Champions</h2>
            <p className="text-xl text-blue-300 max-w-3xl mx-auto">
              Meet the talented squad that brought home the championship
            </p>
          </div>
          <div className="text-center text-blue-300">
            <p>No players have been added yet.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-blue-900 to-blue-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Our Champions</h2>
          <p className="text-xl text-blue-300 max-w-3xl mx-auto">
            Meet the talented squad that brought home the championship
          </p>
        </div>

        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
          {displayPlayers.map((player) => (
            <div
              key={player.id}
              className="bg-blue-800/50 rounded-2xl overflow-hidden hover:bg-blue-700/50 transition-all duration-300 card-hover text-center"
            >
              <img
                src={player.image}
                alt={player.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <div className="flex items-center justify-center mb-2">
                  <h3 className="text-sm font-bold text-white">{player.name}</h3>
                  {player.isCaptain && (
                    <Badge className="ml-2 bg-yellow-500 text-black text-xs px-2 py-1 font-bold">
                      C
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-blue-300 mb-2 font-medium">
                  {player.role}
                </p>
                <div className="text-xs text-gray-400 mb-3">
                  #{player.jerseyNumber}
                </div>
                
                {player.stats && (
                  <div className="pt-3 border-t border-blue-700">
                    <div className="flex justify-center space-x-4 text-xs">
                      <div className="text-center">
                        <div className="font-bold text-white">
                          {player.stats.runsScored || 0}
                        </div>
                        <div className="text-gray-400">RUNS</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-white">
                          {player.stats.wicketsTaken || 0}
                        </div>
                        <div className="text-gray-400">WICKETS</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {showViewAll && (
          <div className="text-center mt-12">
            <Link href="/team">
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-3 rounded-lg">
                View Full Squad
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
