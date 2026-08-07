import React from 'react';
import { cn } from '@/lib/utils';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, icon, title, description, action, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col items-center justify-center text-center p-12 w-full h-full min-h-[300px]',
          className
        )}
        {...props}
      >
        <div className="mb-6 text-gray-300">
          {React.cloneElement(icon as React.ReactElement<any>, { size: 64, weight: 'light' })}
        </div>
        <h3 className="text-xl font-semibold text-[#1E1E2D] mb-2">{title}</h3>
        <p className="text-gray-500 max-w-sm mb-8">{description}</p>
        {action && <div>{action}</div>}
      </div>
    );
  }
);

EmptyState.displayName = 'EmptyState';
