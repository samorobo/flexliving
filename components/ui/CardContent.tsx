import React from 'react';
import { cn } from '@/lib/utils';

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardContent: React.FC<CardContentProps> = ({ 
  className, 
  children, 
  ...props 
}) => {
  return (
    <div 
      className={cn('px-6 py-4', className)}
      {...props}
    >
      {children}
    </div>
  );
};
