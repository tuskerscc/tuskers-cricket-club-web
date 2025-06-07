import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  FileText, 
  Image, 
  BarChart3, 
  Settings,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useAuth, authenticatedRequest } from '@/lib/auth';
import type { 
  HeroSlide, 
  NewsArticle, 
  Player, 
  PlayerStats, 
  GalleryItem, 
  PlayerRegistration 
} from '@shared/schema';

// Login form schema
const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

// Hero slide form schema
const heroSlideSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  date: z.string().min(1, 'Date is required'),
  image: z.string().url('Please enter a valid image URL'),
  order: z.number().min(0).default(0),
  isActive: z.boolean().default(true),
});

// News article form schema
const newsArticleSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  content: z.string().min(1, 'Content is required'),
  date: z.string().min(1, 'Date is required'),
  image: z.string().url('Please enter a valid image URL'),
  isPublished: z.boolean().default(true),
});

// Player form schema
const playerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  role: z.string().min(1, 'Role is required'),
  jerseyNumber: z.number().min(1, 'Jersey number is required'),
  image: z.string().url('Please enter a valid image URL'),
  isCaptain: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

// Gallery item form schema
const galleryItemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  image: z.string().url('Please enter a valid image URL'),
  category: z.string().default('Photos'),
  date: z.string().min(1, 'Date is required'),
  isVisible: z.boolean().default(true),
});

// Season statistics form schema
const seasonStatsSchema = z.object({
  matchDate: z.string().min(1, 'Match date is required'),
  venue: z.string().min(1, 'Venue is required'),
  opponent: z.string().min(1, 'Opponent is required'),
  ourScore: z.number().min(0, 'Score must be positive'),
  theirScore: z.number().min(0, 'Score must be positive'),
  ourWickets: z.number().min(0).max(10, 'Wickets must be between 0-10'),
  theirWickets: z.number().min(0).max(10, 'Wickets must be between 0-10'),
  ourOvers: z.number().min(0, 'Overs must be positive'),
  theirOvers: z.number().min(0, 'Overs must be positive'),
  ourExtras: z.number().min(0).default(0),
  theirExtras: z.number().min(0).default(0),
  result: z.enum(['Won', 'Lost', 'Draw', 'Tied']),
});

// Player statistics form schema
const playerStatsSchema = z.object({
  playerId: z.number().min(1, 'Player is required'),
  matches: z.number().min(0).default(0),
  runsScored: z.number().min(0).default(0),
  ballsFaced: z.number().min(0).default(0),
  wicketsTaken: z.number().min(0).default(0),
  ballsBowled: z.number().min(0).default(0),
  catches: z.number().min(0).default(0),
  stumpings: z.number().min(0).default(0),
  runOuts: z.number().min(0).default(0),
});

export default function AdminPage() {
  const [location, navigate] = useLocation();
  const { isAuthenticated, isAdmin, login, user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [dialogType, setDialogType] = useState<'hero' | 'news' | 'player' | 'gallery' | 'season-stats' | 'player-stats' | null>(null);

  // Login form
  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
  });

  // Forms for different content types
  const heroForm = useForm({
    resolver: zodResolver(heroSlideSchema),
    defaultValues: {
      title: '',
      description: '',
      date: '',
      image: '',
      order: 0,
      isActive: true,
    },
  });

  const newsForm = useForm({
    resolver: zodResolver(newsArticleSchema),
    defaultValues: {
      title: '',
      description: '',
      content: '',
      date: '',
      image: '',
      isPublished: true,
    },
  });

  const playerForm = useForm({
    resolver: zodResolver(playerSchema),
    defaultValues: {
      name: '',
      role: '',
      jerseyNumber: 1,
      image: '',
      isCaptain: false,
      isActive: true,
    },
  });

  const galleryForm = useForm({
    resolver: zodResolver(galleryItemSchema),
    defaultValues: {
      title: '',
      image: '',
      category: 'Photos',
      date: '',
      isVisible: true,
    },
  });

  const seasonStatsForm = useForm({
    resolver: zodResolver(seasonStatsSchema),
    defaultValues: {
      matchDate: '',
      venue: '',
      opponent: '',
      ourScore: 0,
      theirScore: 0,
      ourWickets: 0,
      theirWickets: 0,
      ourOvers: 0,
      theirOvers: 0,
      ourExtras: 0,
      theirExtras: 0,
      result: 'Won' as const,
    },
  });

  const playerStatsForm = useForm({
    resolver: zodResolver(playerStatsSchema),
    defaultValues: {
      playerId: 0,
      matches: 0,
      runsScored: 0,
      ballsFaced: 0,
      wicketsTaken: 0,
      ballsBowled: 0,
      catches: 0,
      stumpings: 0,
      runOuts: 0,
    },
  });

  // Check authentication on mount
  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      setShowLoginDialog(true);
    }
  }, [isAuthenticated, isAdmin]);

  // Data queries
  const { data: heroSlides = [] } = useQuery<HeroSlide[]>({
    queryKey: ['/api/hero-slides'],
    enabled: isAuthenticated && isAdmin,
  });

  const { data: newsArticles = [] } = useQuery<NewsArticle[]>({
    queryKey: ['/api/news'],
    enabled: isAuthenticated && isAdmin,
  });

  const { data: players = [] } = useQuery<Player[]>({
    queryKey: ['/api/players'],
    enabled: isAuthenticated && isAdmin,
  });

  const { data: galleryItems = [] } = useQuery<GalleryItem[]>({
    queryKey: ['/api/gallery'],
    enabled: isAuthenticated && isAdmin,
  });

  const { data: registrations = [] } = useQuery<PlayerRegistration[]>({
    queryKey: ['/api/registrations'],
    enabled: isAuthenticated && isAdmin,
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (data: { username: string; password: string }) => {
      await login(data.username, data.password);
    },
    onSuccess: () => {
      setShowLoginDialog(false);
      toast({ title: 'Login successful!', description: 'Welcome to the admin panel.' });
    },
    onError: (error: any) => {
      toast({
        title: 'Login failed',
        description: error.message || 'Invalid credentials',
        variant: 'destructive',
      });
    },
  });

  // Hero slide mutations
  const createHeroMutation = useMutation({
    mutationFn: async (data: any) => {
      return await authenticatedRequest('POST', '/api/hero-slides', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/hero-slides'] });
      toast({ title: 'Hero slide created successfully!' });
      heroForm.reset();
      setDialogType(null);
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const updateHeroMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      return await authenticatedRequest('PUT', `/api/hero-slides/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/hero-slides'] });
      toast({ title: 'Hero slide updated successfully!' });
      setEditingItem(null);
      setDialogType(null);
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const deleteHeroMutation = useMutation({
    mutationFn: async (id: number) => {
      return await authenticatedRequest('DELETE', `/api/hero-slides/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/hero-slides'] });
      toast({ title: 'Hero slide deleted successfully!' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  // News mutations
  const createNewsMutation = useMutation({
    mutationFn: async (data: any) => {
      return await authenticatedRequest('POST', '/api/news', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/news'] });
      toast({ title: 'News article created successfully!' });
      newsForm.reset();
      setDialogType(null);
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const updateNewsMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      return await authenticatedRequest('PUT', `/api/news/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/news'] });
      toast({ title: 'News article updated successfully!' });
      setEditingItem(null);
      setDialogType(null);
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const deleteNewsMutation = useMutation({
    mutationFn: async (id: number) => {
      return await authenticatedRequest('DELETE', `/api/news/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/news'] });
      toast({ title: 'News article deleted successfully!' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  // Player mutations
  const createPlayerMutation = useMutation({
    mutationFn: async (data: any) => {
      return await authenticatedRequest('POST', '/api/players', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/players'] });
      toast({ title: 'Player added successfully!' });
      playerForm.reset();
      setDialogType(null);
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const updatePlayerMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      return await authenticatedRequest('PUT', `/api/players/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/players'] });
      toast({ title: 'Player updated successfully!' });
      setEditingItem(null);
      setDialogType(null);
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const deletePlayerMutation = useMutation({
    mutationFn: async (id: number) => {
      return await authenticatedRequest('DELETE', `/api/players/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/players'] });
      toast({ title: 'Player deleted successfully!' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  // Gallery mutations
  const createGalleryMutation = useMutation({
    mutationFn: async (data: any) => {
      return await authenticatedRequest('POST', '/api/gallery', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/gallery'] });
      toast({ title: 'Gallery item added successfully!' });
      galleryForm.reset();
      setDialogType(null);
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const deleteGalleryMutation = useMutation({
    mutationFn: async (id: number) => {
      return await authenticatedRequest('DELETE', `/api/gallery/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/gallery'] });
      toast({ title: 'Gallery item deleted successfully!' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  // Registration status mutation
  const updateRegistrationMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return await authenticatedRequest('PUT', `/api/registrations/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/registrations'] });
      toast({ title: 'Registration status updated!' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  // Helper functions
  const openDialog = (type: 'hero' | 'news' | 'player' | 'gallery', item?: any) => {
    setDialogType(type);
    if (item) {
      setEditingItem(item);
      if (type === 'hero') heroForm.reset(item);
      if (type === 'news') newsForm.reset(item);
      if (type === 'player') playerForm.reset(item);
      if (type === 'gallery') galleryForm.reset(item);
    } else {
      setEditingItem(null);
      if (type === 'hero') heroForm.reset();
      if (type === 'news') newsForm.reset();
      if (type === 'player') playerForm.reset();
      if (type === 'gallery') galleryForm.reset();
    }
  };

  const handleSubmit = (type: 'hero' | 'news' | 'player' | 'gallery') => {
    if (type === 'hero') {
      heroForm.handleSubmit((data) => {
        if (editingItem) {
          updateHeroMutation.mutate({ id: editingItem.id, data });
        } else {
          createHeroMutation.mutate(data);
        }
      })();
    } else if (type === 'news') {
      newsForm.handleSubmit((data) => {
        if (editingItem) {
          updateNewsMutation.mutate({ id: editingItem.id, data });
        } else {
          createNewsMutation.mutate(data);
        }
      })();
    } else if (type === 'player') {
      playerForm.handleSubmit((data) => {
        if (editingItem) {
          updatePlayerMutation.mutate({ id: editingItem.id, data });
        } else {
          createPlayerMutation.mutate(data);
        }
      })();
    } else if (type === 'gallery') {
      galleryForm.handleSubmit((data) => {
        createGalleryMutation.mutate(data);
      })();
    }
  };

  // Login Dialog
  if (showLoginDialog && (!isAuthenticated || !isAdmin)) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-800 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4 bg-blue-800 border-blue-700">
          <CardHeader>
            <CardTitle className="text-white text-center">Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={loginForm.handleSubmit((data) => loginMutation.mutate(data))} className="space-y-4">
              <div>
                <Label htmlFor="username" className="text-white">Username</Label>
                <Input
                  id="username"
                  {...loginForm.register('username')}
                  className="mt-1 bg-blue-700 border-blue-600 text-white"
                  placeholder="Enter admin username"
                />
                {loginForm.formState.errors.username && (
                  <p className="text-red-400 text-sm mt-1">{loginForm.formState.errors.username.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="password" className="text-white">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...loginForm.register('password')}
                  className="mt-1 bg-blue-700 border-blue-600 text-white"
                  placeholder="Enter admin password"
                />
                {loginForm.formState.errors.password && (
                  <p className="text-red-400 text-sm mt-1">{loginForm.formState.errors.password.message}</p>
                )}
              </div>
              <Button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
              >
                {loginMutation.isPending ? 'Logging in...' : 'Login'}
              </Button>
            </form>
            <div className="mt-4 text-center text-blue-300 text-sm">
              <p>Demo credentials:</p>
              <p>Username: <strong>admin</strong></p>
              <p>Password: <strong>tuskers2024</strong></p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.username}! Manage your cricket club content below.</p>
        </div>

        <Tabs defaultValue="hero" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="hero" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Hero
            </TabsTrigger>
            <TabsTrigger value="news" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              News
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Team
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center gap-2">
              <Image className="w-4 h-4" />
              Gallery
            </TabsTrigger>
            <TabsTrigger value="registrations" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Registrations
            </TabsTrigger>
          </TabsList>

          {/* Hero Management */}
          <TabsContent value="hero">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Hero Slides Management</CardTitle>
                <Button onClick={() => openDialog('hero')} className="bg-blue-900 hover:bg-blue-800">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Hero Slide
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {heroSlides.map((slide) => (
                    <div key={slide.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-semibold">{slide.title}</h4>
                        <p className="text-sm text-gray-600">{slide.date}</p>
                        <p className="text-xs text-gray-500 mt-1">{slide.description.substring(0, 100)}...</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={slide.isActive ? "default" : "secondary"}>
                          {slide.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openDialog('hero', slide)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Hero Slide</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this hero slide? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteHeroMutation.mutate(slide.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* News Management */}
          <TabsContent value="news">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>News Articles Management</CardTitle>
                <Button onClick={() => openDialog('news')} className="bg-blue-900 hover:bg-blue-800">
                  <Plus className="w-4 h-4 mr-2" />
                  Add News Article
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {newsArticles.map((article) => (
                    <div key={article.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-semibold">{article.title}</h4>
                        <p className="text-sm text-gray-600">{article.date}</p>
                        <p className="text-xs text-gray-500 mt-1">{article.description.substring(0, 100)}...</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={article.isPublished ? "default" : "secondary"}>
                          {article.isPublished ? "Published" : "Draft"}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openDialog('news', article)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete News Article</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this news article? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteNewsMutation.mutate(article.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team Management */}
          <TabsContent value="team">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Team Players Management</CardTitle>
                <Button onClick={() => openDialog('player')} className="bg-blue-900 hover:bg-blue-800">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Player
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {players.map((player) => (
                    <div key={player.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <img src={player.image} alt={player.name} className="w-12 h-12 rounded-full object-cover" />
                        <div>
                          <h4 className="font-semibold">{player.name}</h4>
                          <p className="text-sm text-gray-600">{player.role} • #{player.jerseyNumber}</p>
                          {player.isCaptain && <Badge className="bg-yellow-500 text-black">Captain</Badge>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={player.isActive ? "default" : "secondary"}>
                          {player.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openDialog('player', player)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Player</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this player? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deletePlayerMutation.mutate(player.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gallery Management */}
          <TabsContent value="gallery">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Gallery Management</CardTitle>
                <Button onClick={() => openDialog('gallery')} className="bg-blue-900 hover:bg-blue-800">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Gallery Item
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {galleryItems.map((item) => (
                    <div key={item.id} className="border rounded-lg overflow-hidden">
                      <img src={item.image} alt={item.title} className="w-full h-32 object-cover" />
                      <div className="p-3">
                        <h4 className="font-semibold text-sm">{item.title}</h4>
                        <p className="text-xs text-gray-600">{item.date}</p>
                        <div className="flex justify-between items-center mt-2">
                          <Badge variant={item.isVisible ? "default" : "secondary"} className="text-xs">
                            {item.isVisible ? "Visible" : "Hidden"}
                          </Badge>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="outline">
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Gallery Item</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this gallery item? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteGalleryMutation.mutate(item.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Registrations Management */}
          <TabsContent value="registrations">
            <Card>
              <CardHeader>
                <CardTitle>Player Registrations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {registrations.map((registration) => (
                    <div key={registration.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">
                          {registration.firstName} {registration.lastName}
                        </h4>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={
                              registration.status === 'approved' ? 'default' :
                              registration.status === 'rejected' ? 'destructive' : 'secondary'
                            }
                          >
                            {registration.status === 'approved' && <CheckCircle className="w-3 h-3 mr-1" />}
                            {registration.status === 'rejected' && <XCircle className="w-3 h-3 mr-1" />}
                            {registration.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                            {registration.status}
                          </Badge>
                          {registration.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => updateRegistrationMutation.mutate({ 
                                  id: registration.id, 
                                  status: 'approved' 
                                })}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => updateRegistrationMutation.mutate({ 
                                  id: registration.id, 
                                  status: 'rejected' 
                                })}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p><strong>Email:</strong> {registration.email}</p>
                          <p><strong>Phone:</strong> {registration.phone}</p>
                          <p><strong>Position:</strong> {registration.position}</p>
                        </div>
                        <div>
                          <p><strong>Experience:</strong> {registration.experience || 'Not specified'}</p>
                          <p><strong>Date of Birth:</strong> {registration.dateOfBirth}</p>
                          <p><strong>Submitted:</strong> {new Date(registration.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      {registration.motivation && (
                        <div className="mt-3 p-3 bg-gray-50 rounded">
                          <p className="text-sm"><strong>Motivation:</strong> {registration.motivation}</p>
                        </div>
                      )}
                    </div>
                  ))}
                  {registrations.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No player registrations yet.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Dialogs for adding/editing content */}
        <Dialog open={dialogType !== null} onOpenChange={() => setDialogType(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Edit' : 'Add'} {dialogType === 'hero' && 'Hero Slide'}
                {dialogType === 'news' && 'News Article'}
                {dialogType === 'player' && 'Player'}
                {dialogType === 'gallery' && 'Gallery Item'}
              </DialogTitle>
            </DialogHeader>

            {/* Hero Slide Form */}
            {dialogType === 'hero' && (
              <form onSubmit={(e) => { e.preventDefault(); handleSubmit('hero'); }} className="space-y-4">
                <div>
                  <Label htmlFor="heroTitle">Title</Label>
                  <Input
                    id="heroTitle"
                    {...heroForm.register('title')}
                    className="mt-1"
                  />
                  {heroForm.formState.errors.title && (
                    <p className="text-red-500 text-sm mt-1">{heroForm.formState.errors.title.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="heroDescription">Description</Label>
                  <Textarea
                    id="heroDescription"
                    {...heroForm.register('description')}
                    className="mt-1"
                    rows={3}
                  />
                  {heroForm.formState.errors.description && (
                    <p className="text-red-500 text-sm mt-1">{heroForm.formState.errors.description.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="heroDate">Date</Label>
                  <Input
                    id="heroDate"
                    {...heroForm.register('date')}
                    className="mt-1"
                    placeholder="e.g., 15 MAR, 2024"
                  />
                  {heroForm.formState.errors.date && (
                    <p className="text-red-500 text-sm mt-1">{heroForm.formState.errors.date.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="heroImage">Image URL</Label>
                  <Input
                    id="heroImage"
                    {...heroForm.register('image')}
                    className="mt-1"
                    placeholder="https://..."
                  />
                  {heroForm.formState.errors.image && (
                    <p className="text-red-500 text-sm mt-1">{heroForm.formState.errors.image.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="heroOrder">Order</Label>
                  <Input
                    id="heroOrder"
                    type="number"
                    {...heroForm.register('order', { valueAsNumber: true })}
                    className="mt-1"
                    placeholder="0"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="heroActive"
                    checked={heroForm.watch('isActive')}
                    onCheckedChange={(checked) => heroForm.setValue('isActive', !!checked)}
                  />
                  <Label htmlFor="heroActive">Active</Label>
                </div>
                <div className="flex gap-4">
                  <Button type="submit" className="bg-blue-900 hover:bg-blue-800">
                    {editingItem ? 'Update' : 'Create'} Hero Slide
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setDialogType(null)}>
                    Cancel
                  </Button>
                </div>
              </form>
            )}

            {/* News Article Form */}
            {dialogType === 'news' && (
              <form onSubmit={(e) => { e.preventDefault(); handleSubmit('news'); }} className="space-y-4">
                <div>
                  <Label htmlFor="newsTitle">Title</Label>
                  <Input
                    id="newsTitle"
                    {...newsForm.register('title')}
                    className="mt-1"
                  />
                  {newsForm.formState.errors.title && (
                    <p className="text-red-500 text-sm mt-1">{newsForm.formState.errors.title.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="newsDescription">Description</Label>
                  <Textarea
                    id="newsDescription"
                    {...newsForm.register('description')}
                    className="mt-1"
                    rows={2}
                  />
                  {newsForm.formState.errors.description && (
                    <p className="text-red-500 text-sm mt-1">{newsForm.formState.errors.description.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="newsContent">Full Content</Label>
                  <Textarea
                    id="newsContent"
                    {...newsForm.register('content')}
                    className="mt-1"
                    rows={5}
                  />
                  {newsForm.formState.errors.content && (
                    <p className="text-red-500 text-sm mt-1">{newsForm.formState.errors.content.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="newsDate">Date</Label>
                  <Input
                    id="newsDate"
                    {...newsForm.register('date')}
                    className="mt-1"
                    placeholder="e.g., 04 JUN, 2025"
                  />
                  {newsForm.formState.errors.date && (
                    <p className="text-red-500 text-sm mt-1">{newsForm.formState.errors.date.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="newsImage">Image URL</Label>
                  <Input
                    id="newsImage"
                    {...newsForm.register('image')}
                    className="mt-1"
                    placeholder="https://..."
                  />
                  {newsForm.formState.errors.image && (
                    <p className="text-red-500 text-sm mt-1">{newsForm.formState.errors.image.message}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="newsPublished"
                    checked={newsForm.watch('isPublished')}
                    onCheckedChange={(checked) => newsForm.setValue('isPublished', !!checked)}
                  />
                  <Label htmlFor="newsPublished">Published</Label>
                </div>
                <div className="flex gap-4">
                  <Button type="submit" className="bg-blue-900 hover:bg-blue-800">
                    {editingItem ? 'Update' : 'Create'} News Article
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setDialogType(null)}>
                    Cancel
                  </Button>
                </div>
              </form>
            )}

            {/* Player Form */}
            {dialogType === 'player' && (
              <form onSubmit={(e) => { e.preventDefault(); handleSubmit('player'); }} className="space-y-4">
                <div>
                  <Label htmlFor="playerName">Player Name</Label>
                  <Input
                    id="playerName"
                    {...playerForm.register('name')}
                    className="mt-1"
                  />
                  {playerForm.formState.errors.name && (
                    <p className="text-red-500 text-sm mt-1">{playerForm.formState.errors.name.message}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="playerRole">Role</Label>
                    <Select onValueChange={(value) => playerForm.setValue('role', value)} value={playerForm.watch('role')}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BATSMAN">Batsman</SelectItem>
                        <SelectItem value="BOWLER">Bowler</SelectItem>
                        <SelectItem value="ALL-ROUNDER">All-Rounder</SelectItem>
                        <SelectItem value="WICKET-KEEPER">Wicket-Keeper</SelectItem>
                      </SelectContent>
                    </Select>
                    {playerForm.formState.errors.role && (
                      <p className="text-red-500 text-sm mt-1">{playerForm.formState.errors.role.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="playerJersey">Jersey Number</Label>
                    <Input
                      id="playerJersey"
                      type="number"
                      {...playerForm.register('jerseyNumber', { valueAsNumber: true })}
                      className="mt-1"
                    />
                    {playerForm.formState.errors.jerseyNumber && (
                      <p className="text-red-500 text-sm mt-1">{playerForm.formState.errors.jerseyNumber.message}</p>
                    )}
                  </div>
                </div>
                <div>
                  <Label htmlFor="playerImage">Image URL</Label>
                  <Input
                    id="playerImage"
                    {...playerForm.register('image')}
                    className="mt-1"
                    placeholder="https://..."
                  />
                  {playerForm.formState.errors.image && (
                    <p className="text-red-500 text-sm mt-1">{playerForm.formState.errors.image.message}</p>
                  )}
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="playerCaptain"
                      checked={playerForm.watch('isCaptain')}
                      onCheckedChange={(checked) => playerForm.setValue('isCaptain', !!checked)}
                    />
                    <Label htmlFor="playerCaptain">Captain</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="playerActive"
                      checked={playerForm.watch('isActive')}
                      onCheckedChange={(checked) => playerForm.setValue('isActive', !!checked)}
                    />
                    <Label htmlFor="playerActive">Active</Label>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button type="submit" className="bg-blue-900 hover:bg-blue-800">
                    {editingItem ? 'Update' : 'Add'} Player
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setDialogType(null)}>
                    Cancel
                  </Button>
                </div>
              </form>
            )}

            {/* Gallery Form */}
            {dialogType === 'gallery' && (
              <form onSubmit={(e) => { e.preventDefault(); handleSubmit('gallery'); }} className="space-y-4">
                <div>
                  <Label htmlFor="galleryTitle">Title</Label>
                  <Input
                    id="galleryTitle"
                    {...galleryForm.register('title')}
                    className="mt-1"
                  />
                  {galleryForm.formState.errors.title && (
                    <p className="text-red-500 text-sm mt-1">{galleryForm.formState.errors.title.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="galleryImage">Image URL</Label>
                  <Input
                    id="galleryImage"
                    {...galleryForm.register('image')}
                    className="mt-1"
                    placeholder="https://..."
                  />
                  {galleryForm.formState.errors.image && (
                    <p className="text-red-500 text-sm mt-1">{galleryForm.formState.errors.image.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="galleryDate">Date</Label>
                  <Input
                    id="galleryDate"
                    {...galleryForm.register('date')}
                    className="mt-1"
                    placeholder="e.g., 07 May, 2025"
                  />
                  {galleryForm.formState.errors.date && (
                    <p className="text-red-500 text-sm mt-1">{galleryForm.formState.errors.date.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="galleryCategory">Category</Label>
                  <Input
                    id="galleryCategory"
                    {...galleryForm.register('category')}
                    className="mt-1"
                    placeholder="Photos"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="galleryVisible"
                    checked={galleryForm.watch('isVisible')}
                    onCheckedChange={(checked) => galleryForm.setValue('isVisible', !!checked)}
                  />
                  <Label htmlFor="galleryVisible">Visible</Label>
                </div>
                <div className="flex gap-4">
                  <Button type="submit" className="bg-blue-900 hover:bg-blue-800">
                    Add Gallery Item
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setDialogType(null)}>
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
