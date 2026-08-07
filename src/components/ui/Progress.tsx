'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, max = 100, size = 'md', showLabel, label, ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    
    const sizes = {
      sm: 'h-1',
      md: 'h-2',
      lg: 'h-3',
    };

    let colorClass = 'bg-red-500';
    if (percentage > 80) colorClass = 'bg-green-500';
    else if (percentage >= 40) colorClass = 'bg-yellow-500';

    return (
      <div className={cn('w-full flex flex-col gap-2', className)} ref={ref} {...props}>
        {(showLabel || label) && (
          <div className="flex justify-between text-sm font-medium">
            {label && <span className="text-[#1E1E2D]">{label}</span>}
            {showLabel && <span className="text-gray-500">{Math.round(percentage)}%</span>}
          </div>
        )}
        <div className={cn('w-full bg-[#FAFAFA] rounded-full overflow-hidden', sizes[size])}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={cn('h-full rounded-full', colorClass)}
          />
        </div>
      </div>
    );
  }
);

Progress.displayName = 'Progress';
