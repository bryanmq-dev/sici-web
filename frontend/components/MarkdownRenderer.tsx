'use client';

import React from 'react';
import Markdown from 'react-markdown';

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="prose max-w-none
      prose-headings:font-display prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-text-primary
      prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
      prose-p:text-text-secondary prose-p:leading-relaxed
      prose-a:text-primary prose-a:no-underline hover:prose-a:underline
      prose-strong:text-text-primary
      prose-code:text-primary prose-code:bg-surface-muted prose-code:px-1 prose-code:rounded
      prose-pre:bg-surface-muted prose-pre:border prose-pre:border-border
    ">
      <Markdown>{content}</Markdown>
    </div>
  );
}
