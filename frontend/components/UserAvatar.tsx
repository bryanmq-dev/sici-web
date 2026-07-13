import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizes = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24',
};

export default function UserAvatar({ src, name, size = 'md', className }: UserAvatarProps) {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className={cn(
      'relative overflow-hidden bg-surface-hover flex items-center justify-center border border-primary/20',
      sizes[size],
      className
    )}
    style={{ clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)' }}
    >
      {src ? (
        <Image
          src={src}
          alt={name}
          fill
          className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
          referrerPolicy="no-referrer"
        />
      ) : (
        <span className={cn(
          'font-display font-bold text-primary tracking-tighter',
          size === 'sm' ? 'text-[10px]' : size === 'md' ? 'text-xs' : 'text-xl'
        )}>
          {initials}
        </span>
      )}
    </div>
  );
}
