import type { ReactNode } from 'react';
import AnimatedPageHeader from '@/components/AnimatedPageHeader';
import ComingSoon from '@/components/ComingSoon';
import CommunityPostCard from '@/components/CommunityPostCard';
import { getCommunityPosts, type CommunityArea } from '@/lib/cms';

interface CommunityAreaPageProps {
  area: CommunityArea;
  title: ReactNode;
  description: string;
  comingSoonTitle: string;
  comingSoonDescription: string;
}

export default async function CommunityAreaPage({ area, title, description, comingSoonTitle, comingSoonDescription }: CommunityAreaPageProps) {
  const posts = await getCommunityPosts(area);

  if (posts.length === 0) {
    return <ComingSoon title={comingSoonTitle} description={comingSoonDescription} />;
  }

  return (
    <main className="flex-grow pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <AnimatedPageHeader title={title} description={description} />

        <div className="space-y-6">
          {posts.map((post) => (
            <CommunityPostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </main>
  );
}
