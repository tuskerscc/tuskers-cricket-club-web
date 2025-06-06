import HeroSection from '@/components/hero-section';
import NewsSection from '@/components/news-section';
import TeamSection from '@/components/team-section';
import GallerySection from '@/components/gallery-section';
import StatsSection from '@/components/stats-section';

export default function HomePage() {
  return (
    <div className="text-white">
      <HeroSection />
      <NewsSection limit={3} />
      <TeamSection limit={5} />
      <GallerySection limit={6} />
      <StatsSection />
    </div>
  );
}
