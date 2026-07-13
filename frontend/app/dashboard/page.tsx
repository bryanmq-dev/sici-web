import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { auth } from '@/lib/auth';
import { getUserById, getUserAchievements, getUserBadges, getUserQuests, getAllQuests } from '@/lib/actions/gamification';
import { getUserEventParticipations } from '@/lib/actions/events';
import { redirect } from 'next/navigation';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const [user, achievements, userBadges, userQuests, allQuests, eventParticipations] = await Promise.all([
    getUserById(session.user.id),
    getUserAchievements(session.user.id),
    getUserBadges(session.user.id),
    getUserQuests(session.user.id),
    getAllQuests(),
    getUserEventParticipations(session.user.id),
  ]);

  if (!user) redirect('/login');

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col">
      <Navbar />

      <main className="flex-grow pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <DashboardClient
            user={user}
            achievements={achievements}
            userBadges={userBadges}
            userQuests={userQuests}
            allQuests={allQuests}
            eventParticipations={eventParticipations}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
