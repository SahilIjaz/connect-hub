'use client';

import Image from 'next/image';
import { getAvatarUrl } from '@/lib/utils';

interface AvatarProps {
  src?: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  online?: boolean;
}

export default function Avatar({
  src,
  alt,
  size = 'md',
  className = '',
  online,
}: AvatarProps) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-24 h-24',
  };

  const imageSizes = {
    sm: 32,
    md: 40,
    lg: 56,
    xl: 96,
  };

  const avatarUrl = getAvatarUrl(src || '');

  return (
    <div className={`relative ${sizes[size]} ${className}`}>
      <div
        className={`${sizes[size]} rounded-full overflow-hidden bg-dark-surface border-2 border-dark-border`}
      >
        <Image
          src={avatarUrl}
          alt={alt}
          width={imageSizes[size]}
          height={imageSizes[size]}
          className="w-full h-full object-cover"
          unoptimized
        />
      </div>
      {online !== undefined && (
        <span
          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-dark-bg ${
            online ? 'bg-accent-green' : 'bg-zinc-500'
          }`}
        />
      )}
    </div>
  );
}
