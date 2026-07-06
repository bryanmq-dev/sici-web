import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getRankingUsers } from '@/lib/actions/gamification';
import RankingClient from './RankingClient';

export const dynamic = 'force-dynamic';

export default async function RankingPage() {
  const ranking = await getRankingUsers();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <RankingClient ranking={ranking} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
