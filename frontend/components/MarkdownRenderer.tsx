'use client';

import React from 'react';
import Markdown from 'react-markdown';

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="prose prose-invert max-w-none 
      prose-headings:font-display prose-headings:font-bold prose-headings:tracking-tight
      prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
      prose-p:text-secondary prose-p:leading-relaxed
      prose-a:text-primary prose-a:no-underline hover:prose-a:underline
      prose-strong:text-white
      prose-code:text-primary prose-code:bg-accent/30 prose-code:px-1 prose-code:rounded
      prose-pre:bg-accent/50 prose-pre:border prose-pre:border-white/10
    ">
      <Markdown>{content}</Markdown>
    </div>
  );
}
