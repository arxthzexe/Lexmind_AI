import React from 'react';
import { cn } from '@/lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'title' | 'avatar' | 'card' | 'chart';
}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = 'text', ...props }, ref) => {
    const variants = {
      text: 'h-4 w-full rounded',
      title: 'h-8 w-3/4 rounded-md',
      avatar: 'h-12 w-12 rounded-full',
      card: 'h-48 w-full rounded-2xl',
      chart: 'h-64 w-full rounded-xl',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:400%_100%]',
          variants[variant],
          className
        )}
        style={{
          animation: 'shimmer 2s infinite linear',
        }}
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';
