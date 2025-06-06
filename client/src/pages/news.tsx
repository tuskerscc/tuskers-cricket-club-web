import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { ArrowLeft, Heart, MessageCircle, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import NewsSection from '@/components/news-section';
import type { NewsArticle } from '@shared/schema';

export default function NewsPage() {
  const [location, navigate] = useLocation();
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const articleId = urlParams.get('article');

  const { data: article, isLoading } = useQuery<NewsArticle>({
    queryKey: ['/api/news', articleId],
    enabled: !!articleId,
  });

  // If viewing a specific article
  if (articleId) {
    if (isLoading) {
      return (
        <div className="min-h-screen bg-blue-900 py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="animate-pulse">
              <div className="h-8 bg-blue-700 rounded w-32 mb-8"></div>
              <div className="bg-blue-800 rounded-2xl overflow-hidden">
                <div className="w-full h-64 bg-blue-700"></div>
                <div className="p-8 space-y-4">
                  <div className="h-4 bg-blue-700 rounded w-1/4"></div>
                  <div className="h-8 bg-blue-700 rounded w-3/4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-blue-700 rounded"></div>
                    <div className="h-4 bg-blue-700 rounded"></div>
                    <div className="h-4 bg-blue-700 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (!article) {
      return (
        <div className="min-h-screen bg-blue-900 py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <Button
              onClick={() => navigate('/news')}
              variant="ghost"
              className="text-white hover:text-yellow-500 mb-8"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to News
            </Button>
            <div className="text-center text-white">
              <h2 className="text-2xl font-bold mb-4">Article Not Found</h2>
              <p className="text-blue-300">The requested article could not be found.</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-blue-900 py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <Button
            onClick={() => navigate('/news')}
            variant="ghost"
            className="text-white hover:text-yellow-500 mb-8"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to News
          </Button>
          
          <Card className="bg-blue-800 border-blue-700 overflow-hidden">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-64 object-cover"
            />
            <CardContent className="p-8">
              <div className="text-sm text-yellow-500 font-medium mb-2">
                {article.date}
              </div>
              <h1 className="text-3xl font-bold text-white mb-6">
                {article.title}
              </h1>
              <div className="prose max-w-none">
                <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                  {article.description}
                </p>
                <div className="text-gray-300 leading-relaxed whitespace-pre-line">
                  {article.content}
                </div>
              </div>
              
              {/* Social engagement for article */}
              <div className="border-t border-blue-700 pt-6 mt-8">
                <div className="flex items-center space-x-6 mb-4">
                  <button className="flex items-center space-x-2 text-red-400 hover:text-red-300 transition-colors">
                    <Heart className="w-5 h-5" />
                    <span>Like</span>
                  </button>
                  <button className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors">
                    <MessageCircle className="w-5 h-5" />
                    <span>Comment</span>
                  </button>
                  <button className="flex items-center space-x-2 text-green-400 hover:text-green-300 transition-colors">
                    <Share2 className="w-5 h-5" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Main news page
  return (
    <div className="min-h-screen bg-blue-900">
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Latest News & Updates</h1>
            <p className="text-xl text-blue-300 max-w-3xl mx-auto">
              Complete coverage of Tuskers Cricket Club news, match reports, and team updates
            </p>
          </div>
        </div>
      </section>
      
      <NewsSection limit={undefined} showViewAll={false} />
    </div>
  );
}
