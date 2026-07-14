import { getForumQuestions } from '@/lib/actions/forum';
import ForumClient from './ForumClient';

export const dynamic = 'force-dynamic';

export default async function ForumPage() {
  const questions = await getForumQuestions();

  return (
      <main className="flex-grow pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <ForumClient questions={questions} />
        </div>
      </main>
  );
}
