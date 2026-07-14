import { redirect } from 'next/navigation';
import ProfileSidebar from '@/components/ProfileSidebar';
import { auth } from '@/lib/auth';
import { getUserById, getUserAchievements, getUserBadges } from '@/lib/actions/gamification';
import { getUserContributions, getUserSkills } from '@/lib/actions/profile';
import ProfileClient from './ProfileClient';

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const [user, achievements, badges, contributions, skills] = await Promise.all([
    getUserById(session.user.id),
    getUserAchievements(session.user.id),
    getUserBadges(session.user.id),
    getUserContributions(session.user.id),
    getUserSkills(session.user.id),
  ]);

  if (!user) redirect('/login');

  // Nunca pasar la fila completa de `users` (trae passwordHash) a un client component.
  const safeUser = {
    id: user.id,
    name: user.name,
    avatar: user.avatar,
    role: user.role,
    bio: user.bio,
    socials: (user.socials as Record<string, string>) || {},
    isiPoints: user.isiPoints,
  };

  return (
      <main className="flex-grow pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <ProfileSidebar />
          </div>
          <div className="lg:col-span-3">
            <ProfileClient user={safeUser} achievements={achievements} badges={badges} contributions={contributions} skills={skills} isOwnProfile />
          </div>
        </div>
      </main>
  );
}
