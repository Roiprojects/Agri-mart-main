'use client';

import React, { useState } from 'react';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  count?: number;
  content: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  defaultTabId?: string;
  onChange?: (tabId: string) => void;
  className?: string;
  variant?: 'pills' | 'underline';
}

export function Tabs({
  tabs,
  defaultTabId,
  onChange,
  className = '',
  variant = 'pills',
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTabId || (tabs[0]?.id ?? ''));

  const handleTabClick = (id: string) => {
    setActiveTab(id);
    if (onChange) onChange(id);
  };

  const activeTabContent = tabs.find((t) => t.id === activeTab)?.content;

  return (
    <div className={`w-full space-y-4 ${className}`}>
      <div
        role="tablist"
        className={`flex items-center gap-2 overflow-x-auto pb-1 border-b border-agri-border/60 ${
          variant === 'pills' ? 'bg-agri-cream/60 p-1.5 rounded-2xl border' : ''
        }`}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;

          if (variant === 'pills') {
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => handleTabClick(tab.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-150 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-agri-green ${
                  isActive
                    ? 'bg-agri-green text-white shadow-sm'
                    : 'text-agri-secondary hover:text-agri-dark hover:bg-white/80'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {typeof tab.count === 'number' && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => handleTabClick(tab.id)}
              className={`inline-flex items-center gap-2 px-3.5 py-2.5 text-sm font-semibold border-b-2 transition-all whitespace-nowrap -mb-[2px] focus:outline-none focus-visible:ring-2 focus-visible:ring-agri-green ${
                isActive
                  ? 'border-agri-green text-agri-green font-bold'
                  : 'border-transparent text-agri-secondary hover:text-agri-dark hover:border-slate-300'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-agri-pale text-agri-green-dark">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div role="tabpanel" className="pt-2 animate-fadeIn">
        {activeTabContent}
      </div>
    </div>
  );
}

export default Tabs;
