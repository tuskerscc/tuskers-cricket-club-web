import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Heart, MessageCircle, Share2, ThumbsDown, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import type { HeroSlide, Comment, SocialInteraction } from '@shared/schema';

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [newComment, setNewComment] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch hero slides
  const { data: slides = [] } = useQuery<HeroSlide[]>({
    queryKey: ['/api/hero-slides'],
  });

  // Fetch current slide's social interactions
  const currentSlideId = slides[currentSlide]?.id;
  const { data: socialData } = useQuery<SocialInteraction>({
    queryKey: ['/api/social/hero', currentSlideId],
    enabled: !!currentSlideId,
  });

  // Fetch current slide's comments
  const { data: comments = [] } = useQuery<Comment[]>({
    queryKey: ['/api/comments/hero', currentSlideId],
    enabled: !!currentSlideId,
  });

  // Social interaction mutations
  const likeMutation = useMutation({
    mutationFn: () => fetch(`/api/social/hero/${currentSlideId}/like`, { method: 'POST' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/social/hero', currentSlideId] });
      toast({ title: 'Liked!', description: 'Thanks for your support!' });
    },
  });

  const dislikeMutation = useMutation({
    mutationFn: () => fetch(`/api/social/hero/${currentSlideId}/dislike`, { method: 'POST' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/social/hero', currentSlideId] });
    },
  });

  const shareMutation = useMutation({
    mutationFn: () => fetch(`/api/social/hero/${currentSlideId}/share`, { method: 'POST' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/social/hero', currentSlideId] });
      toast({ title: 'Shared!', description: 'Thanks for spreading the word!' });
    },
  });

  // Comment mutation
  const commentMutation = useMutation({
    mutationFn: (data: { contentType: string; contentId: number; userName: string; text: string }) =>
      fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/comments/hero', currentSlideId] });
      setNewComment('');
      toast({ title: 'Comment added!', description: 'Your comment has been posted.' });
    },
  });

  // Auto-slide timer
  useEffect(() => {
    if (!isPaused && slides.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isPaused, slides.length]);

  const handleAddComment = () => {
    if (newComment.trim() && currentSlideId) {
      commentMutation.mutate({
        contentType: 'hero',
        contentId: currentSlideId,
        userName: 'Anonymous User', // In a real app, get from auth context
        text: newComment.trim(),
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddComment();
    }
  };

  if (slides.length === 0) {
    return (
      <section className="relative h-[600px] bg-blue-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Welcome to Tuskers Cricket Club</h2>
          <p className="text-blue-300">Championship Winners 2024</p>
        </div>
      </section>
    );
  }

  const currentSlideData = slides[currentSlide];

  return (
    <section
      className="relative h-[600px] overflow-hidden bg-gradient-to-r from-blue-900 to-blue-800"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={currentSlideData.image}
          alt={currentSlideData.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-transparent"></div>
      </div>

      <div className="container mx-auto relative px-4 h-full flex">
        <div className="grid lg:grid-cols-12 gap-0 w-full h-full">
          {/* Left Content Panel */}
          <div className="lg:col-span-7 text-white z-10 flex flex-col justify-center">
            {/* Date */}
            <div className="text-sm text-yellow-400 font-medium mb-3 uppercase tracking-wide">
              {currentSlideData.date}
            </div>

            {/* Title */}
            <h1 className="text-2xl lg:text-4xl xl:text-5xl font-bold mb-4 leading-tight">
              {currentSlideData.title}
            </h1>

            {/* Description */}
            <p className="text-gray-200 text-lg mb-6 leading-relaxed">
              {currentSlideData.description}
            </p>

            {/* Slide Navigation */}
            {slides.length > 1 && (
              <div className="flex space-x-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      currentSlide === index
                        ? 'bg-yellow-500 scale-125'
                        : 'bg-white/50 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right Comments Panel - Full Height */}
          <div className="lg:col-span-5 z-10 h-full">
            <div className="bg-white/95 backdrop-blur-sm h-full flex flex-col">
              {/* Social Actions Bar */}
              <div className="flex items-center justify-around p-4 border-b border-gray-200 bg-gray-50">
                <button
                  onClick={() => likeMutation.mutate()}
                  disabled={likeMutation.isPending}
                  className="flex items-center space-x-2 text-red-400 hover:text-red-300 transition-colors"
                >
                  <Heart className="w-5 h-5" />
                  <span className="font-medium">{socialData?.likes || 0}</span>
                </button>
                
                <button
                  onClick={() => dislikeMutation.mutate()}
                  disabled={dislikeMutation.isPending}
                  className="flex items-center space-x-2 text-gray-400 hover:text-gray-300 transition-colors"
                >
                  <ThumbsDown className="w-5 h-5" />
                  <span className="font-medium">{socialData?.dislikes || 0}</span>
                </button>
                
                <div className="flex items-center space-x-2 text-blue-400">
                  <MessageCircle className="w-5 h-5" />
                  <span className="font-medium">{comments.length} comments</span>
                </div>
                
                <button
                  onClick={() => shareMutation.mutate()}
                  disabled={shareMutation.isPending}
                  className="flex items-center space-x-2 text-green-400 hover:text-green-300 transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                  <span className="font-medium">Share</span>
                </button>
              </div>

              {/* Comment Input */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex space-x-2">
                  <Input
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Write a comment, and hit enter..."
                    className="flex-1 bg-white rounded-lg text-gray-800 placeholder-gray-500 border-gray-300 focus:border-blue-500"
                  />
                  <Button
                    onClick={handleAddComment}
                    disabled={commentMutation.isPending || !newComment.trim()}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Comments List - Full Remaining Height */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {comments.map((comment) => (
                  <div key={comment.id} className="border-b border-gray-200 pb-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {comment.userName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-800 text-sm">
                          {comment.userName}
                        </span>
                        <div className="text-gray-500 text-xs">
                          {new Date(comment.createdAt).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm ml-10">{comment.text}</p>
                    <div className="flex items-center space-x-4 mt-2 ml-10">
                      <button className="flex items-center space-x-1 text-gray-500 hover:text-red-500">
                        <Heart className="w-3 h-3" />
                        <span className="text-xs">{comment.likes || 0}</span>
                      </button>
                      <button className="text-gray-500 hover:text-blue-600 text-xs">
                        Reply
                      </button>
                    </div>
                  </div>
                ))}
                
                {/* Sample comments to show functionality */}
                <div className="border-b border-gray-200 pb-3">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">V</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-800 text-sm">Vyom Ketan Bhagat</span>
                      <div className="text-gray-500 text-xs">
                        rohit hardik ke field placement ke sath bilkul thush nahi tha aut fir
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 mt-2 ml-10">
                    <button className="flex items-center space-x-1 text-gray-500 hover:text-red-500">
                      <Heart className="w-3 h-3" />
                      <span className="text-xs">0</span>
                    </button>
                    <button className="text-gray-500 hover:text-blue-600 text-xs">
                      Reply
                    </button>
                  </div>
                </div>

                <div className="border-b border-gray-200 pb-3">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">R</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-800 text-sm">Rishu Maity</span>
                      <div className="text-gray-500 text-xs">
                        it was nice
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 mt-2 ml-10">
                    <button className="flex items-center space-x-1 text-gray-500 hover:text-red-500">
                      <Heart className="w-3 h-3" />
                      <span className="text-xs">0</span>
                    </button>
                    <button className="text-gray-500 hover:text-blue-600 text-xs">
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


    </section>
  );
}
