'use client';

import React, { useState } from 'react';
import { ThumbsUp } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface LikeButtonProps {
  initialLikes: number;
  onLike?: (liked: boolean) => void;
  className?: string;
}

export default function LikeButton({ initialLikes, onLike, className }: LikeButtonProps) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(initialLikes);

  const handleLike = () => {
    const newLiked = !liked;
    setLiked(newLiked);
    setCount(prev => newLiked ? prev + 1 : prev - 1);
    onLike?.(newLiked);
  };

  return (
    <button
      onClick={handleLike}
      className={cn(
        'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium transition-all',
        liked 
          ? 'bg-primary/10 text-primary' 
          : 'bg-surface-muted text-text-secondary hover:bg-surface-hover hover:text-text-primary',
        className
      )}
    >
      <motion.div
        animate={liked ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 0.2 }}
      >
        <ThumbsUp className={cn('w-3.5 h-3.5', liked && 'fill-current')} />
      </motion.div>
      <span>{count}</span>
    </button>
  );
}
