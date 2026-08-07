import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'accent';
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', header, footer, children, ...props }, ref) => {
    return (
      <div 
        ref={ref} 
        className={cn(
          'p-[3px] rounded-[1.25rem] transition-all duration-300',
          variant === 'default' && 'bg-gray-100/50',
          variant === 'elevated' && 'bg-gray-100/50 shadow-sm hover:shadow-md hover:-translate-y-0.5',
          variant === 'accent' && 'bg-gray-100/50 border-l-4 border-l-[#DC2626]',
          className
        )}
        {...props}
      >
        <div className="bg-white rounded-[1.15rem] p-6 h-full w-full flex flex-col">
          {header && <div className="mb-4">{header}</div>}
          <div className="flex-1">{children}</div>
          {footer && <div className="mt-4 pt-4 border-t border-gray-100">{footer}</div>}
        </div>
      </div>
    );
  }
);

Card.displayName = 'Card';
