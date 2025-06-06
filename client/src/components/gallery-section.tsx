import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Expand } from 'lucide-react';
import { Link } from 'wouter';
import type { GalleryItem } from '@shared/schema';

interface GallerySectionProps {
  limit?: number;
  showViewAll?: boolean;
}

export default function GallerySection({ limit = 6, showViewAll = true }: GallerySectionProps) {
  const { data: galleryItems = [], isLoading } = useQuery<GalleryItem[]>({
    queryKey: ['/api/gallery', { limit }],
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-blue-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Gallery</h2>
            <p className="text-xl text-blue-300 max-w-3xl mx-auto">
              Capturing memorable moments from our championship journey
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-blue-700/50 rounded-2xl overflow-hidden animate-pulse">
                <div className="w-full h-48 bg-blue-600"></div>
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-blue-600 rounded w-1/3"></div>
                  <div className="h-4 bg-blue-600 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (galleryItems.length === 0) {
    return (
      <section className="py-16 bg-blue-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Gallery</h2>
            <p className="text-xl text-blue-300 max-w-3xl mx-auto">
              Capturing memorable moments from our championship journey
            </p>
          </div>
          <div className="text-center text-blue-300">
            <p>No gallery items available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-blue-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Gallery</h2>
          <p className="text-xl text-blue-300 max-w-3xl mx-auto">
            Capturing memorable moments from our championship journey
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item) => (
            <div
              key={item.id}
              className="relative group cursor-pointer overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 card-hover bg-blue-700/50"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-bold text-sm">{item.title}</h3>
                  <p className="text-xs opacity-80">{item.date}</p>
                </div>
                <div className="absolute top-4 right-4">
                  <Expand className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="p-4">
                <div className="text-xs text-yellow-500 font-medium mb-2">
                  {item.date}
                </div>
                <h3 className="text-sm font-bold text-white">{item.title}</h3>
                <p className="text-xs text-blue-300 mt-1">{item.category}</p>
              </div>
            </div>
          ))}
        </div>

        {showViewAll && (
          <div className="text-center mt-12">
            <Link href="/gallery">
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-3 rounded-lg">
                View Full Gallery
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
