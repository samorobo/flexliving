import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'pink';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ 
  variant = 'default',
  size = 'md',
  className, 
  children, 
  ...props 
}) => {
  const variants = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    success: 'bg-green-100 text-green-700 border-green-200',
    warning: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    danger: 'bg-red-100 text-red-700 border-red-200',
    info: 'bg-blue-100 text-blue-700 border-blue-200',
    purple: 'bg-purple-100 text-purple-700 border-purple-200',
    pink: 'bg-pink-100 text-pink-700 border-pink-200'
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm'
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium border',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

// Additional badge variants for specific use cases
export const StatusBadge: React.FC<{ status: 'approved' | 'pending' | 'rejected' }> = ({ status }) => {
  const statusConfig = {
    approved: { variant: 'success' as const, label: 'Approved' },
    pending: { variant: 'warning' as const, label: 'Pending' },
    rejected: { variant: 'danger' as const, label: 'Rejected' }
  };

  const config = statusConfig[status];

  return (
    <Badge variant={config.variant}>
      {config.label}
    </Badge>
  );
};

export const RatingBadge: React.FC<{ rating: number }> = ({ rating }) => {
  const getVariant = (rating: number) => {
    if (rating >= 9) return 'success';
    if (rating >= 7) return 'info';
    if (rating >= 5) return 'warning';
    return 'danger';
  };

  return (
    <Badge variant={getVariant(rating)}>
      ⭐ {rating.toFixed(1)}
    </Badge>
  );
};