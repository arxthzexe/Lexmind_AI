import React from 'react';
import { cn } from '@/lib/utils';

export interface StatusDotProps extends React.HTMLAttributes<HTMLSpanElement> {
  status?: 'active' | 'pending' | 'alert' | 'inactive' | 'processing';
  size?: 'sm' | 'md' | 'lg';
}

export const StatusDot = React.forwardRef<HTMLSpanElement, StatusDotProps>(
  ({ className, status = 'inactive', size = 'md', ...props }, ref) => {
    const statuses = {
      active: 'bg-green-500',
      pending: 'bg-yellow-500',
      alert: 'bg-red-500',
      inactive: 'bg-gray-400',
      processing: 'bg-[#DC2626]',
    };

    const sizes = {
      sm: 'h-1.5 w-1.5',
      md: 'h-2 w-2',
      lg: 'h-2.5 w-2.5',
    };

    return (
      <span className={cn('relative flex', sizes[size], className)} ref={ref} {...props}>
        {status === 'processing' && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#DC2626] opacity-75"></span>
        )}
        <span className={cn('relative inline-flex rounded-full w-full h-full', statuses[status])}></span>
      </span>
    );
  }
);

StatusDot.displayName = 'StatusDot';
