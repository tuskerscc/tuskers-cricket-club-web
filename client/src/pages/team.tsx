import TeamSection from '@/components/team-section';

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-800">
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Complete Squad</h1>
            <p className="text-xl text-blue-300 max-w-3xl mx-auto">
              Meet all members of our championship-winning team and their performance statistics
            </p>
          </div>
        </div>
      </section>
      
      <TeamSection limit={undefined} showViewAll={false} />
    </div>
  );
}
