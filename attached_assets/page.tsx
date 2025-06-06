"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Menu, X, Heart, MessageCircle, Share2, ThumbsDown, ChevronRight, Calendar, Send } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function TuskersCricketClub() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [activeGalleryImage, setActiveGalleryImage] = useState(0)
  const [newComment, setNewComment] = useState("")
  const [heroComments, setHeroComments] = useState([
    {
      user: "Vyom Ketan Bhagat",
      text: "Amazing performance by the team!",
      likes: 5,
      dislikes: 0,
      timestamp: new Date(),
    },
    { user: "Cricket Fan", text: "What a season it has been! 🏏", likes: 12, dislikes: 1, timestamp: new Date() },
    { user: "Coach Sharma", text: "Proud of the team's dedication!", likes: 8, dislikes: 0, timestamp: new Date() },
    {
      user: "Sports Enthusiast",
      text: "This is how champions are made 💪",
      likes: 15,
      dislikes: 0,
      timestamp: new Date(),
    },
    { user: "Fan Club", text: "Best team ever!", likes: 3, dislikes: 0, timestamp: new Date() },
  ])

  const heroSlides = [
    {
      image: "/placeholder.svg?height=600&width=800",
      date: "15 MAR, 2024",
      title: "Championship Victory!",
      description:
        "From dominating the league matches to securing the championship trophy - witness our incredible journey to glory...",
      likes: 124,
      dislikes: 8,
      comments: 22,
      shares: 45,
    },
    {
      image: "/placeholder.svg?height=600&width=800",
      date: "22 MAR, 2024",
      title: "Training Excellence",
      description:
        "Behind every victory lies countless hours of dedication and training. See how our champions prepare for greatness...",
      likes: 98,
      dislikes: 3,
      comments: 18,
      shares: 32,
    },
  ]

  const newsUpdates = [
    {
      image: "/placeholder.svg?height=400&width=600",
      date: "04 JUN, 2025",
      title: "Thank you, #TeamOf2025!",
      description:
        "An incredible season comes to an end. Thank you to all our players, coaches, and fans for making this journey unforgettable.",
      likes: 93,
      dislikes: 2,
      comments: 22,
      shares: 45,
    },
    {
      image: "/placeholder.svg?height=400&width=600",
      date: "04 JUN, 2025",
      title: "Tuskers की Bowling Unit - Bowled us over!",
      description: "Our bowling attack has been phenomenal this season, taking crucial wickets at important moments.",
      likes: 61,
      dislikes: 1,
      comments: 3,
      shares: 28,
    },
    {
      image: "/placeholder.svg?height=400&width=600",
      date: "28 MAY, 2025",
      title: "Season Highlights Reel",
      description:
        "Relive the best moments from our championship-winning season with this exclusive highlights package.",
      likes: 87,
      dislikes: 0,
      comments: 15,
      shares: 52,
    },
  ]

  const players = [
    { name: "HARDIK PANDYA", role: "ALL-ROUNDER", image: "/placeholder.svg?height=300&width=200", isCaptain: true },
    { name: "AM GHAZANFAR", role: "BOWLER", image: "/placeholder.svg?height=300&width=200", isCaptain: false },
    { name: "ARJUN TENDULKAR", role: "BOWLER", image: "/placeholder.svg?height=300&width=200", isCaptain: false },
    { name: "ASHWANI KUMAR", role: "BOWLER", image: "/placeholder.svg?height=300&width=200", isCaptain: false },
    { name: "BEYON JACC", role: "ALL-ROUNDER", image: "/placeholder.svg?height=300&width=200", isCaptain: false },
  ]

  const galleryImages = [
    {
      id: 1,
      image: "/placeholder.svg?height=600&width=800",
      title: "Moments from Tuskers vs Eagles",
      category: "Photos",
      date: "07 May, 2025",
    },
    {
      id: 2,
      image: "/placeholder.svg?height=600&width=800",
      title: "Team Celebration",
      category: "Photos",
      date: "15 Mar, 2024",
    },
    {
      id: 3,
      image: "/placeholder.svg?height=600&width=800",
      title: "Training Session",
      category: "Photos",
      date: "22 Apr, 2024",
    },
    {
      id: 4,
      image: "/placeholder.svg?height=600&width=800",
      title: "Award Ceremony",
      category: "Photos",
      date: "30 May, 2024",
    },
    {
      id: 5,
      image: "/placeholder.svg?height=600&width=800",
      title: "Fan Engagement",
      category: "Photos",
      date: "12 Jun, 2024",
    },
  ]

  // Hero carousel timer
  useEffect(() => {
    let interval
    if (!isPaused) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
      }, 5000)
    }
    return () => clearInterval(interval)
  }, [isPaused, heroSlides.length])

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment = {
        user: "You",
        text: newComment,
        likes: 0,
        dislikes: 0,
        timestamp: new Date(),
      }
      setHeroComments([comment, ...heroComments])
      setNewComment("")
    }
  }

  const getLatestComments = () => {
    return heroComments.slice(0, 3)
  }

  const getOlderComments = () => {
    return heroComments.slice(3)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-800 to-blue-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-yellow-500 bg-blue-900/95 backdrop-blur supports-[backdrop-filter]:bg-blue-900/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <Image
              src="/tuskers-logo.png"
              alt="Tuskers Cricket Club Logo"
              width={40}
              height={40}
              className="w-10 h-10"
            />
            <div>
              <h1 className="text-xl font-bold text-yellow-500">Tuskers CC</h1>
              <p className="text-sm text-blue-300 font-medium">Est. 2022</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 mr-auto ml-10">
            <Link href="#news" className="text-sm font-medium uppercase hover:text-yellow-500 transition-colors">
              News
            </Link>
            <Link href="#team" className="text-sm font-medium uppercase hover:text-yellow-500 transition-colors">
              Team
            </Link>
            <Link href="#gallery" className="text-sm font-medium uppercase hover:text-yellow-500 transition-colors">
              Gallery
            </Link>
            <Link href="#stats" className="text-sm font-medium uppercase hover:text-yellow-500 transition-colors">
              Stats
            </Link>
          </nav>

          {/* Season Registration Button */}
          <div className="hidden md:block">
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6 py-2 rounded-lg">
              Season Registration
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-blue-900 border-t border-blue-800">
            <div className="container py-3 px-4">
              <nav className="flex flex-col space-y-3">
                <Link
                  href="#news"
                  className="text-sm font-medium uppercase hover:text-yellow-500 transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  News
                </Link>
                <Link
                  href="#team"
                  className="text-sm font-medium uppercase hover:text-yellow-500 transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Team
                </Link>
                <Link
                  href="#gallery"
                  className="text-sm font-medium uppercase hover:text-yellow-500 transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Gallery
                </Link>
                <Link
                  href="#stats"
                  className="text-sm font-medium uppercase hover:text-yellow-500 transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Stats
                </Link>
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6 py-2 rounded-lg mt-2">
                  Season Registration
                </Button>
              </nav>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* Hero Section - Social Media Style */}
        <section
          className="relative h-[600px] overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="container relative px-4 h-full">
            <div className="grid lg:grid-cols-5 gap-0 h-full">
              {/* Content Panel - Left Side */}
              <div className="lg:col-span-2 bg-blue-900/95 backdrop-blur-sm border-r border-blue-700 flex flex-col h-full">
                {heroSlides.map((slide, index) => (
                  <div
                    key={index}
                    className={`flex-1 p-4 lg:p-6 transition-opacity duration-500 ${
                      currentSlide === index ? "opacity-100" : "opacity-0 hidden"
                    }`}
                  >
                    {/* Date */}
                    <div className="text-sm text-yellow-500 font-medium mb-4">{slide.date}</div>

                    {/* Title */}
                    <h1 className="text-xl lg:text-2xl xl:text-3xl font-bold text-white mb-4 leading-tight">
                      {slide.title}
                    </h1>

                    {/* Description */}
                    <p className="text-gray-300 text-sm leading-relaxed mb-6">{slide.description}</p>

                    {/* Social Engagement */}
                    <div className="border-t border-blue-700 pt-4 mb-4">
                      <div className="flex items-center space-x-4 lg:space-x-6 mb-4">
                        <button className="flex items-center space-x-2 text-red-400 hover:text-red-300 transition-colors">
                          <Heart className="w-4 h-4 lg:w-5 lg:h-5" />
                          <span className="text-sm">{slide.likes}</span>
                        </button>
                        <button className="flex items-center space-x-2 text-gray-400 hover:text-gray-300 transition-colors">
                          <ThumbsDown className="w-4 h-4 lg:w-5 lg:h-5" />
                          <span className="text-sm">{slide.dislikes}</span>
                        </button>
                        <button className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors">
                          <MessageCircle className="w-4 h-4 lg:w-5 lg:h-5" />
                          <span className="text-sm">{heroComments.length} comments</span>
                        </button>
                      </div>
                    </div>

                    {/* Comment Input */}
                    <div className="mb-4">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Add a comment..."
                          className="flex-1 bg-blue-800/30 rounded-lg px-3 py-2 text-white placeholder-gray-400 text-sm border border-blue-600 focus:border-yellow-500 focus:outline-none"
                          onKeyPress={(e) => e.key === "Enter" && handleAddComment()}
                        />
                        <button
                          onClick={handleAddComment}
                          className="bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg px-3 py-2 transition-colors"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Comments Section */}
                    <div className="flex-1 overflow-hidden flex flex-col">
                      <h4 className="text-sm font-medium text-blue-300 mb-2">Comments</h4>

                      {/* Latest 3 Comments */}
                      <div className="space-y-3 mb-3">
                        {getLatestComments().map((comment, i) => (
                          <div key={i} className="bg-blue-800/30 rounded-lg p-3">
                            <div className="flex items-start space-x-3">
                              <div className="w-6 h-6 lg:w-8 lg:h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                <Users className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
                              </div>
                              <div className="flex-1">
                                <div className="text-sm font-medium text-white">{comment.user}</div>
                                <div className="text-xs text-gray-300 mt-1">{comment.text}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Scrollable Older Comments */}
                      {getOlderComments().length > 0 && (
                        <>
                          <div className="text-xs text-blue-300 mb-1 flex items-center">
                            <span className="flex-1 border-t border-blue-700"></span>
                            <span className="px-2">Older comments</span>
                            <span className="flex-1 border-t border-blue-700"></span>
                          </div>
                          <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar" style={{ maxHeight: "120px" }}>
                            <div className="space-y-2">
                              {getOlderComments().map((comment, i) => (
                                <div key={i + 3} className="bg-blue-800/20 rounded-lg p-2">
                                  <div className="flex items-start space-x-2">
                                    <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                                      <Users className="w-3 h-3 text-white" />
                                    </div>
                                    <div className="flex-1">
                                      <div className="text-xs font-medium text-white">{comment.user}</div>
                                      <div className="text-xs text-gray-300">{comment.text}</div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Image Panel - Right Side */}
              <div className="lg:col-span-3 relative h-full">
                {heroSlides.map((slide, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-500 ${
                      currentSlide === index ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <Image
                      src={slide.image || "/placeholder.svg"}
                      alt={slide.title}
                      width={800}
                      height={600}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Latest News Section */}
        <section id="news" className="py-12 lg:py-20 bg-blue-900/40 backdrop-blur-sm">
          <div className="container px-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-100 to-yellow-600 bg-clip-text text-transparent">
                LATEST NEWS
              </h2>
              <button className="flex items-center space-x-2 text-blue-300 hover:text-yellow-500 transition-colors">
                <span className="text-sm font-medium">View More</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* News Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newsUpdates.map((news, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                >
                  {/* News Image */}
                  <div className="relative h-48">
                    <Image
                      src={news.image || "/placeholder.svg"}
                      alt={news.title}
                      width={600}
                      height={400}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-yellow-500 text-black text-xs">{news.date}</Badge>
                    </div>
                  </div>

                  {/* News Content */}
                  <div className="p-6">
                    <h3 className="font-bold text-gray-900 text-lg mb-3 line-clamp-2">{news.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{news.description}</p>

                    {/* Social Engagement */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center space-x-4">
                        <button className="flex items-center space-x-1 text-red-500 hover:text-red-600 transition-colors">
                          <Heart className="w-4 h-4" />
                          <span className="text-sm">{news.likes}</span>
                        </button>
                        <button className="flex items-center space-x-1 text-blue-500 hover:text-blue-600 transition-colors">
                          <MessageCircle className="w-4 h-4" />
                          <span className="text-sm">{news.comments}</span>
                        </button>
                        <button className="flex items-center space-x-1 text-green-500 hover:text-green-600 transition-colors">
                          <Share2 className="w-4 h-4" />
                          <span className="text-sm">{news.shares}</span>
                        </button>
                      </div>
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
                        Read More
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Squad Section */}
        <section id="team" className="py-12 lg:py-20 bg-blue-900/40 backdrop-blur-sm">
          <div className="container px-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-100 to-yellow-600 bg-clip-text text-transparent">
                SQUAD
              </h2>
              <button className="flex items-center space-x-2 text-blue-300 hover:text-yellow-500 transition-colors">
                <span className="text-sm font-medium">View More</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Player Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
              {players.map((player, index) => (
                <div key={index} className="bg-white rounded-lg overflow-hidden shadow-lg relative">
                  {/* Captain Badge */}
                  {player.isCaptain && (
                    <div className="absolute top-3 left-3 w-6 h-6 bg-blue-900 rounded-full flex items-center justify-center text-white font-bold text-xs z-10">
                      C
                    </div>
                  )}

                  {/* Player Image */}
                  <div className="relative h-48 md:h-56 lg:h-64">
                    <Image
                      src={player.image || "/placeholder.svg"}
                      alt={player.name}
                      width={200}
                      height={300}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Player Info */}
                  <div className="p-3 lg:p-4 text-center border-t-2 border-gray-200">
                    <h3 className="font-bold text-gray-900 text-xs lg:text-sm mb-1">{player.name}</h3>
                    <p className="text-gray-600 text-xs uppercase tracking-wide">{player.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Section - Hover-based Single Row Layout */}
        <section id="gallery" className="py-12 lg:py-20 bg-blue-900/40 backdrop-blur-sm">
          <div className="container px-4 relative z-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-100 to-yellow-600 bg-clip-text text-transparent">
                GALLERY
              </h2>
              <button className="flex items-center space-x-2 text-blue-300 hover:text-yellow-500 transition-colors">
                <span className="text-sm font-medium">View More</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Single Row Gallery with Hover */}
            <div className="flex items-center justify-center space-x-2 lg:space-x-4 overflow-x-auto pb-4">
              {galleryImages.map((image, index) => (
                <div
                  key={index}
                  className={`flex-none cursor-pointer transition-all duration-500 rounded-lg overflow-hidden relative ${
                    activeGalleryImage === index
                      ? "w-64 h-40 md:w-80 md:h-48 lg:w-96 lg:h-60 ring-4 ring-yellow-500 shadow-2xl"
                      : "w-32 h-20 md:w-40 md:h-24 lg:w-48 lg:h-32 opacity-50 hover:opacity-75"
                  }`}
                  onMouseEnter={() => setActiveGalleryImage(index)}
                >
                  <Image
                    src={image.image || "/placeholder.svg"}
                    alt={image.title}
                    width={activeGalleryImage === index ? 400 : 200}
                    height={activeGalleryImage === index ? 300 : 150}
                    className="w-full h-full object-cover"
                  />

                  {/* Overlay for active image */}
                  {activeGalleryImage === index && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                      <div className="absolute bottom-2 lg:bottom-4 left-2 lg:left-4 right-2 lg:right-4">
                        <Badge className="bg-yellow-500 text-black mb-1 lg:mb-2 text-xs">{image.category}</Badge>
                        <h3 className="text-white text-sm lg:text-lg font-bold mb-1">{image.title}</h3>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-white text-xs lg:text-sm">
                            <Calendar className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                            {image.date}
                          </div>
                          <button className="text-white hover:text-yellow-400 transition-colors">
                            <Share2 className="w-3 h-3 lg:w-4 lg:h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section id="stats" className="py-12 lg:py-20 bg-blue-900/40 backdrop-blur-sm">
          <div className="container px-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-100 to-yellow-600 bg-clip-text text-transparent">
                STATS
              </h2>
              <button className="flex items-center space-x-2 text-blue-300 hover:text-yellow-500 transition-colors">
                <span className="text-sm font-medium">View More</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-8 mb-8 lg:mb-12">
              <div className="text-center p-4 lg:p-6 bg-blue-800/50 rounded-lg">
                <p className="text-blue-300 text-sm mb-2">TOTAL RUNS SCORED</p>
                <p className="text-2xl lg:text-4xl font-bold">26381</p>
              </div>
              <div className="text-center p-4 lg:p-6 bg-blue-800/50 rounded-lg">
                <p className="text-blue-300 text-sm mb-2">TOTAL WICKETS TAKEN</p>
                <p className="text-2xl lg:text-4xl font-bold">866</p>
              </div>
              <div className="text-center p-4 lg:p-6 bg-blue-800/50 rounded-lg">
                <p className="text-blue-300 text-sm mb-2">MAIDEN OVERS</p>
                <p className="text-2xl lg:text-4xl font-bold">7</p>
              </div>
            </div>

            {/* Bottom Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-8">
              <div className="text-center p-4 lg:p-6 bg-blue-800/50 rounded-lg">
                <p className="text-blue-300 text-sm mb-2">DOT BALLS</p>
                <p className="text-xl lg:text-3xl font-bold">5562</p>
              </div>
              <div className="text-center p-4 lg:p-6 bg-blue-800/50 rounded-lg">
                <p className="text-blue-300 text-sm mb-2">FREE HITS</p>
                <p className="text-xl lg:text-3xl font-bold">67</p>
              </div>
              <div className="text-center p-4 lg:p-6 bg-blue-800/50 rounded-lg">
                <p className="text-blue-300 text-sm mb-2">RUN OUTS</p>
                <p className="text-xl lg:text-3xl font-bold">37</p>
              </div>
              <div className="text-center p-4 lg:p-6 bg-blue-800/50 rounded-lg">
                <p className="text-blue-300 text-sm mb-2">DIRECT HITS</p>
                <p className="text-xl lg:text-3xl font-bold">17</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-blue-950 text-white py-8 lg:py-12">
        <div className="container px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Image
                  src="/tuskers-logo.png"
                  alt="Tuskers Cricket Club Logo"
                  width={40}
                  height={40}
                  className="w-10 h-10"
                />
                <div>
                  <h3 className="text-xl font-bold text-yellow-500">Tuskers CC</h3>
                  <p className="text-sm text-gray-400">Est. 2022</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                Building champions, creating memories, and fostering the spirit of cricket since 2022.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="#news" className="hover:text-yellow-400 transition-colors">
                    News
                  </Link>
                </li>
                <li>
                  <Link href="#team" className="hover:text-yellow-400 transition-colors">
                    Squad
                  </Link>
                </li>
                <li>
                  <Link href="#gallery" className="hover:text-yellow-400 transition-colors">
                    Gallery
                  </Link>
                </li>
                <li>
                  <Link href="#stats" className="hover:text-yellow-400 transition-colors">
                    Stats
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Programs</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="#" className="hover:text-yellow-400 transition-colors">
                    Junior Cricket
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-yellow-400 transition-colors">
                    Senior Teams
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Follow Us</h4>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-gray-600 text-gray-400 hover:text-yellow-400 hover:border-yellow-400"
                >
                  Facebook
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-gray-600 text-gray-400 hover:text-yellow-400 hover:border-yellow-400"
                >
                  Instagram
                </Button>
              </div>
            </div>
          </div>
          <div className="border-t border-blue-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} Tuskers Cricket Club. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
