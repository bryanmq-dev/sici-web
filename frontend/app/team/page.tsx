import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getSocietyUnits, getSocietyMemberships } from '@/lib/actions/organization';
import TeamClient from './TeamClient';

export const dynamic = 'force-dynamic';

export default async function TeamPage() {
  const units = await getSocietyUnits();
  const memberships = await getSocietyMemberships();

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <TeamClient units={units} memberships={memberships} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
