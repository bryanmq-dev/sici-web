import { Sparkles } from 'lucide-react';

export default function ComingSoon({ title, description }: { title: string; description: string }) {
  return (
    <main className="flex-grow flex items-center justify-center px-4 pt-32 pb-20">
      <div className="text-center max-w-lg">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <Sparkles className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-text-primary mb-3">{title}</h1>
        <p className="text-text-secondary mb-2">{description}</p>
        <span className="badge badge-secondary">Sin publicaciones aún</span>
      </div>
    </main>
  );
}
