import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import type { PlayerWithStats } from '@shared/schema';

interface TeamSectionProps {
  limit?: number;
  showViewAll?: boolean;
}

export default function TeamSection({ limit = 5, showViewAll = true }: TeamSectionProps) {
  const { data: players = [], isLoading } = useQuery<PlayerWithStats[]>({
    queryKey: ['/api/players/with-stats'],
  });
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const slidesToShow = 3;
  const maxSlides = Math.max(0, players.length - slidesToShow);

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

  const nextSlide = () => {
    setCurrentSlide(prev => Math.min(prev + 1, maxSlides));
  };

  const prevSlide = () => {
    setCurrentSlide(prev => Math.max(prev - 1, 0));
  };

  return (
    <section className="py-16 bg-gradient-to-b from-blue-900 to-blue-800">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl font-bold text-white mb-4">Our Champions</h2>
            <p className="text-xl text-blue-300 max-w-3xl">
              Meet the talented squad that brought home the championship
            </p>
          </div>
          {showViewAll && (
            <Link href="/team">
              <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-blue-900">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Full
              </Button>
            </Link>
          )}
        </div>
        
        <div className="relative">
          {/* Carousel Container */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * (100 / slidesToShow)}%)` }}
            >
              {players.map((player) => (
                <div key={player.id} className="w-1/3 flex-shrink-0 px-3">
                  <div className="bg-blue-800/50 backdrop-blur-sm rounded-2xl overflow-hidden hover:bg-blue-800/70 transition-colors">
                    <div className="relative">
                      <img
                        src={player.image}
                        alt={player.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-3 right-3 bg-yellow-500 text-blue-900 px-2 py-1 rounded-full text-sm font-bold">
                        #{player.jerseyNumber}
                      </div>
                      {player.isCaptain && (
                        <Badge className="absolute top-3 left-3 bg-red-600 text-white">
                          Captain
                        </Badge>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-white mb-1">{player.name}</h3>
                      <p className="text-blue-300 text-sm mb-3">{player.role}</p>
                      
                      {player.stats && (
                        <div className="space-y-1 text-xs text-blue-200">
                          <div className="flex justify-between">
                            <span>Matches:</span>
                            <span className="text-white">{player.stats.matches}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Runs:</span>
                            <span className="text-white">{player.stats.runsScored}</span>
                          </div>
                          {player.stats.wicketsTaken > 0 && (
                            <div className="flex justify-between">
                              <span>Wickets:</span>
                              <span className="text-white">{player.stats.wicketsTaken}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          {players.length > slidesToShow && (
            <>
              <button
                onClick={prevSlide}
                disabled={currentSlide === 0}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextSlide}
                disabled={currentSlide === maxSlides}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Dots Indicator */}
          {players.length > slidesToShow && (
            <div className="flex justify-center mt-6 space-x-2">
              {Array.from({ length: maxSlides + 1 }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    currentSlide === index ? 'bg-yellow-500' : 'bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
