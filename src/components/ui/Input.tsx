import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, prefixIcon, suffixIcon, ...props }, ref) => {
    return (
      <div className="flex flex-col w-full space-y-1.5">
        {label && (
          <label className="text-sm font-medium text-[#1E1E2D]">
            {label}
          </label>
        )}
        <div className="relative">
          {prefixIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              {prefixIcon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'flex h-11 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-[#1E1E2D]',
              'transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626]',
              'disabled:cursor-not-allowed disabled:opacity-50',
              prefixIcon ? 'pl-10' : undefined,
              suffixIcon ? 'pr-10' : undefined,
              error ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : undefined,
              className
            )}
            {...props}
          />
          {suffixIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
              {suffixIcon}
            </div>
          )}
        </div>
        {error ? (
          <p className="text-sm text-red-500">{error}</p>
        ) : helperText ? (
          <p className="text-sm text-gray-500">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
