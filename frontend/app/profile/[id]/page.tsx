import { notFound } from 'next/navigation';
import { auth } from '@/lib/auth';
import { getUserById, getUserAchievements, getUserBadges } from '@/lib/actions/gamification';
import { getUserContributions, getUserSkills } from '@/lib/actions/profile';
import ProfileClient from '../ProfileClient';

export default async function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();

  const [user, achievements, badges, contributions, skills] = await Promise.all([
    getUserById(id),
    getUserAchievements(id),
    getUserBadges(id),
    getUserContributions(id),
    getUserSkills(id),
  ]);

  if (!user) notFound();

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
        <div className="max-w-3xl mx-auto">
          <ProfileClient
            user={safeUser}
            achievements={achievements}
            badges={badges}
            contributions={contributions}
            skills={skills}
            isOwnProfile={session?.user?.id === user.id}
          />
        </div>
      </main>
  );
}
