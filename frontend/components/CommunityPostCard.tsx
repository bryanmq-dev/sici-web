import Markdown from 'react-markdown';
import CommunityImageSlider from './CommunityImageSlider';
import type { CommunityPost } from '@/lib/cms';

export default function CommunityPostCard({ post }: { post: CommunityPost }) {
  return (
    <div className="card p-6 space-y-4">
      <h2 className="text-xl font-semibold text-text-primary">{post.titulo}</h2>

      {post.images.length > 0 && <CommunityImageSlider images={post.images} />}

      <div className="prose prose-invert max-w-none text-sm text-text-secondary space-y-3">
        {post.contenido.map((block, i) => (
          <Markdown key={i}>{block.body}</Markdown>
        ))}
      </div>
    </div>
  );
}
