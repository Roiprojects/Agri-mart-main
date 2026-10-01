import React from 'react';
import { Sprout } from 'lucide-react';
import Button from './Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`p-8 sm:p-12 text-center rounded-3xl border border-dashed border-agri-border bg-white/70 max-w-lg mx-auto space-y-4 ${className}`}
    >
      <div className="w-16 h-16 mx-auto rounded-2xl bg-agri-pale flex items-center justify-center text-agri-green">
        {icon || <Sprout className="w-8 h-8" />}
      </div>

      <div className="space-y-1.5">
        <h3 className="text-lg font-extrabold text-agri-dark tracking-tight">
          {title}
        </h3>
        <p className="text-xs text-agri-secondary leading-relaxed max-w-sm mx-auto">
          {description}
        </p>
      </div>

      {actionLabel && onAction && (
        <div className="pt-2">
          <Button variant="primary" size="md" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}

export default EmptyState;
