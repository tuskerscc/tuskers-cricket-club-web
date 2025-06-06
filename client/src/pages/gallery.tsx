import GallerySection from '@/components/gallery-section';

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-blue-800">
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Photo Gallery</h1>
            <p className="text-xl text-blue-300 max-w-3xl mx-auto">
              Complete collection of memorable moments from our championship journey
            </p>
          </div>
        </div>
      </section>
      
      <GallerySection limit={undefined} showViewAll={false} />
    </div>
  );
}
