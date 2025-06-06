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
      className="relative h-[600px] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container mx-auto relative px-4 h-full">
        <div className="grid lg:grid-cols-5 gap-0 h-full">
          {/* Content Panel - Left Side */}
          <div className="lg:col-span-2 bg-blue-900/95 backdrop-blur-sm border-r border-blue-700 flex flex-col h-full">
            <div className="flex-1 p-4 lg:p-6">
              {/* Date */}
              <div className="text-sm text-yellow-500 font-medium mb-4">
                {currentSlideData.date}
              </div>

              {/* Title */}
              <h1 className="text-xl lg:text-2xl xl:text-3xl font-bold text-white mb-4 leading-tight">
                {currentSlideData.title}
              </h1>

              {/* Description */}
              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                {currentSlideData.description}
              </p>

              {/* Social Engagement */}
              <div className="border-t border-blue-700 pt-4 mb-4">
                <div className="flex items-center space-x-4 lg:space-x-6 mb-4">
                  <button
                    onClick={() => likeMutation.mutate()}
                    disabled={likeMutation.isPending}
                    className="flex items-center space-x-2 text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Heart className="w-4 h-4 lg:w-5 lg:h-5" />
                    <span className="text-sm">{socialData?.likes || 0}</span>
                  </button>
                  <button
                    onClick={() => dislikeMutation.mutate()}
                    disabled={dislikeMutation.isPending}
                    className="flex items-center space-x-2 text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    <ThumbsDown className="w-4 h-4 lg:w-5 lg:h-5" />
                    <span className="text-sm">{socialData?.dislikes || 0}</span>
                  </button>
                  <div className="flex items-center space-x-2 text-blue-400">
                    <MessageCircle className="w-4 h-4 lg:w-5 lg:h-5" />
                    <span className="text-sm">{comments.length} comments</span>
                  </div>
                  <button
                    onClick={() => shareMutation.mutate()}
                    disabled={shareMutation.isPending}
                    className="flex items-center space-x-2 text-green-400 hover:text-green-300 transition-colors"
                  >
                    <Share2 className="w-4 h-4 lg:w-5 lg:h-5" />
                    <span className="text-sm">{socialData?.shares || 0}</span>
                  </button>
                </div>
              </div>

              {/* Comment Input */}
              <div className="mb-4">
                <div className="flex space-x-2">
                  <Input
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add a comment..."
                    className="flex-1 bg-blue-800/30 rounded-lg text-white placeholder-gray-400 text-sm border-blue-600 focus:border-yellow-500"
                  />
                  <Button
                    onClick={handleAddComment}
                    disabled={commentMutation.isPending || !newComment.trim()}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg px-3 py-2"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Recent Comments */}
              <div className="space-y-3 max-h-32 overflow-y-auto custom-scrollbar">
                {comments.slice(0, 3).map((comment) => (
                  <div key={comment.id} className="bg-blue-800/20 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-semibold text-yellow-400 text-sm">
                        {comment.userName}
                      </span>
                      <span className="text-gray-400 text-xs">
                        {new Date(comment.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm">{comment.text}</p>
                    <div className="flex items-center space-x-3 mt-2">
                      <button className="flex items-center space-x-1 text-red-400 hover:text-red-300">
                        <Heart className="w-3 h-3" />
                        <span className="text-xs">{comment.likes}</span>
                      </button>
                      <button className="text-gray-400 hover:text-gray-300 text-xs">
                        Reply
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Image Panel - Right Side */}
          <div className="lg:col-span-3 relative h-full">
            <div className="relative h-full overflow-hidden">
              <img
                src={currentSlideData.image}
                alt={currentSlideData.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20"></div>

              {/* Slide Navigation */}
              {slides.length > 1 && (
                <div className="absolute bottom-6 left-6 flex space-x-2">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-3 h-3 rounded-full transition-opacity ${
                        currentSlide === index
                          ? 'bg-yellow-500 opacity-100'
                          : 'bg-white opacity-50 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
