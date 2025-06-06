import { useQuery } from '@tanstack/react-query';
import { Heart, MessageCircle, Share2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import type { NewsArticle } from '@shared/schema';

interface NewsSectionProps {
  limit?: number;
  showViewAll?: boolean;
}

export default function NewsSection({ limit = 3, showViewAll = true }: NewsSectionProps) {
  const { data: news = [], isLoading } = useQuery<NewsArticle[]>({
    queryKey: ['/api/news', { limit }],
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-blue-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Latest News</h2>
            <p className="text-xl text-blue-300 max-w-3xl mx-auto">
              Stay updated with the latest happenings from Tuskers Cricket Club
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-blue-800/50 rounded-2xl overflow-hidden animate-pulse">
                <div className="w-full h-48 bg-blue-700"></div>
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-blue-700 rounded w-1/4"></div>
                  <div className="h-6 bg-blue-700 rounded w-3/4"></div>
                  <div className="h-4 bg-blue-700 rounded w-full"></div>
                  <div className="h-4 bg-blue-700 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (news.length === 0) {
    return (
      <section className="py-16 bg-blue-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Latest News</h2>
            <p className="text-xl text-blue-300 max-w-3xl mx-auto">
              Stay updated with the latest happenings from Tuskers Cricket Club
            </p>
          </div>
          <div className="text-center text-blue-300">
            <p>No news articles available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-blue-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Latest News</h2>
          <p className="text-xl text-blue-300 max-w-3xl mx-auto">
            Stay updated with the latest happenings from Tuskers Cricket Club
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((article) => (
            <article
              key={article.id}
              className="bg-blue-800/50 rounded-2xl overflow-hidden hover:bg-blue-700/50 transition-all duration-300 card-hover"
            >
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="text-sm text-yellow-500 font-medium mb-2">
                  {article.date}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
                  {article.description}
                </p>
                
                <Link
                  href={`/news?article=${article.id}`}
                  className="inline-flex items-center text-yellow-500 hover:text-yellow-400 font-semibold text-sm transition-colors group"
                >
                  Read More
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>

                <div className="flex items-center space-x-4 mt-4 pt-4 border-t border-blue-700">
                  <button className="flex items-center space-x-1 text-red-400 hover:text-red-300 transition-colors text-sm social-hover">
                    <Heart className="w-4 h-4" />
                    <span>0</span>
                  </button>
                  <button className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 transition-colors text-sm social-hover">
                    <MessageCircle className="w-4 h-4" />
                    <span>0</span>
                  </button>
                  <button className="flex items-center space-x-1 text-green-400 hover:text-green-300 transition-colors text-sm social-hover">
                    <Share2 className="w-4 h-4" />
                    <span>0</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {showViewAll && (
          <div className="text-center mt-12">
            <Link href="/news">
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-3 rounded-lg">
                View All News
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
