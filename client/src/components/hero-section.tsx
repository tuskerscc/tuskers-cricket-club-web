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

      <div className="container mx-auto relative px-4 h-full flex items-center">
        <div className="grid lg:grid-cols-12 gap-8 w-full items-center">
          {/* Left Content Panel */}
          <div className="lg:col-span-5 text-white z-10">
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

            {/* Social Actions Bar */}
            <div className="flex items-center space-x-6 mb-6 bg-black/20 backdrop-blur-sm rounded-lg p-4">
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

          {/* Right Comments Panel */}
          <div className="lg:col-span-4 lg:col-start-9 z-10">
            <div className="bg-white/95 backdrop-blur-sm rounded-lg p-6 max-w-md ml-auto">
              {/* Comment Input */}
              <div className="mb-4">
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

              {/* Comments List */}
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {comments.slice(0, 5).map((comment) => (
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
                          rohit hardik ke field placement ke sath bilkul thush nahi tha aur fir
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
                
                {/* Example static comment to match design */}
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

      {/* Social sidebar (right edge) */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col space-y-4 z-20">
        <a href="#" className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors">
          <span className="text-sm font-bold">f</span>
        </a>
        <a href="#" className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white hover:bg-gray-800 transition-colors">
          <span className="text-sm font-bold">X</span>
        </a>
        <a href="#" className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center text-white hover:bg-pink-700 transition-colors">
          <span className="text-sm font-bold">@</span>
        </a>
        <a href="#" className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white hover:bg-red-700 transition-colors">
          <span className="text-sm font-bold">▶</span>
        </a>
        <a href="#" className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center text-white hover:bg-blue-800 transition-colors">
          <span className="text-sm font-bold">in</span>
        </a>
        <a href="#" className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white hover:bg-green-700 transition-colors">
          <span className="text-sm font-bold">📱</span>
        </a>
      </div>
    </section>
  );
}
