import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getForumQuestionById, getForumAnswers, incrementQuestionViews } from '@/lib/actions/forum';
import { auth } from '@/lib/auth';
import ForumDetailClient from './ForumDetailClient';
import { notFound } from 'next/navigation';

export default async function ForumDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  await incrementQuestionViews(id);

  const question = await getForumQuestionById(id);
  if (!question) notFound();

  const answers = await getForumAnswers(id);
  const session = await auth();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-grow pt-32 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <ForumDetailClient question={question} answers={answers} currentUserId={session?.user?.id ?? null} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
