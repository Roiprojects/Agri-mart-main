'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface AccordionItemData {
  id: string;
  title: string;
  subtitle?: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItemData[];
  defaultOpenId?: string;
  allowMultiple?: boolean;
  className?: string;
}

export function Accordion({
  items,
  defaultOpenId,
  allowMultiple = false,
  className = '',
}: AccordionProps) {
  const [openIds, setOpenIds] = useState<string[]>(
    defaultOpenId ? [defaultOpenId] : []
  );

  const toggle = (id: string) => {
    if (allowMultiple) {
      setOpenIds((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      );
    } else {
      setOpenIds((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);

        return (
          <div
            key={item.id}
            className={`rounded-2xl border transition-colors duration-200 overflow-hidden ${
              isOpen
                ? 'bg-white border-agri-green/40 shadow-subtle'
                : 'bg-white border-agri-border hover:border-slate-300'
            }`}
          >
            <button
              type="button"
              onClick={() => toggle(item.id)}
              aria-expanded={isOpen}
              aria-controls={`accordion-panel-${item.id}`}
              id={`accordion-btn-${item.id}`}
              className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-agri-green transition-colors duration-150"
            >
              <div className="flex items-center gap-3 min-w-0">
                {item.icon && (
                  <div className="p-2 rounded-xl bg-agri-pale text-agri-green flex-shrink-0 transition-colors duration-200">
                    {item.icon}
                  </div>
                )}
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-agri-dark leading-snug">
                    {item.title}
                  </h4>
                  {item.subtitle && (
                    <p className="text-xs text-agri-secondary mt-0.5">
                      {item.subtitle}
                    </p>
                  )}
                </div>
              </div>

              <div
                className={`p-1 rounded-full text-agri-secondary transition-transform duration-250 ease-out flex-shrink-0 ${
                  isOpen ? 'rotate-180 text-agri-green bg-agri-pale' : ''
                }`}
              >
                <ChevronDown className="w-4 h-4" />
              </div>
            </button>

            {/* Smooth CSS Grid Accordion Collapse/Expand (250ms) */}
            <div
              id={`accordion-panel-${item.id}`}
              role="region"
              aria-labelledby={`accordion-btn-${item.id}`}
              className={`grid transition-[grid-template-rows] duration-250 ease-out ${
                isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
              }`}
            >
              <div className="overflow-hidden">
                <div className="px-4 sm:px-5 pb-5 pt-1 text-sm text-agri-secondary leading-relaxed border-t border-agri-border/50">
                  {item.content}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Accordion;
