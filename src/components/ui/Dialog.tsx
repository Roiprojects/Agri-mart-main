'use client';

import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Dialog({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = 'md',
}: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn"
    >
      <div
        ref={dialogRef}
        className={`w-full ${maxWidthStyles[maxWidth]} bg-white rounded-3xl border border-agri-border shadow-hover overflow-hidden transition-all`}
      >
        {/* Header */}
        <div className="p-6 pb-4 flex items-start justify-between gap-4 border-b border-agri-border/60">
          <div>
            <h3
              id="dialog-title"
              className="text-lg font-extrabold text-agri-dark tracking-tight"
            >
              {title}
            </h3>
            {description && (
              <p className="text-xs text-agri-secondary mt-1 leading-relaxed">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 rounded-full text-agri-secondary hover:text-agri-dark hover:bg-slate-100 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-agri-green"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto text-sm text-agri-dark">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="p-4 px-6 bg-agri-cream/60 border-t border-agri-border/60 flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dialog;
