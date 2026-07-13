import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getArticles } from '@/lib/actions/articles';
import ArticlesClient from './ArticlesClient';

export const dynamic = 'force-dynamic';

export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <ArticlesClient articles={articles} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
