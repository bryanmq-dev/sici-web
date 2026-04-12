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
        'flex items-center space-x-2 px-3 py-1.5 rounded-full transition-all duration-300',
        liked ? 'bg-primary text-white glow-red' : 'bg-accent/50 text-secondary hover:text-white',
        className
      )}
    >
      <motion.div
        animate={liked ? { scale: [1, 1.4, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        <ThumbsUp className={cn('w-4 h-4', liked && 'fill-current')} />
      </motion.div>
      <span className="text-sm font-medium">{count}</span>
    </button>
  );
}
