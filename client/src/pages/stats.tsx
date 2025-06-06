import PlayerAnalytics from '@/components/player-analytics';
import StatsSection from '@/components/stats-section';

export default function StatsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-800 to-blue-900">
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Detailed Statistics</h1>
            <p className="text-xl text-blue-300 max-w-3xl mx-auto">
              Comprehensive performance analysis, team statistics, and player analytics
            </p>
          </div>
        </div>
      </section>
      
      <StatsSection />
      <PlayerAnalytics />
    </div>
  );
}
