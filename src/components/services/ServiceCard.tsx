'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Calendar, Clock, ShieldCheck, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export interface FarmServiceItem {
  id: string;
  name: string;
  category: string;
  ratePerAcre: number;
  minAcres: number;
  timeEstimate: string;
  equipmentUsed: string;
  description: string;
}

export interface ServiceCardProps {
  service: FarmServiceItem;
  onBookNow?: (service: FarmServiceItem) => void;
}

export default function ServiceCard({ service, onBookNow }: ServiceCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-agri-border overflow-hidden shadow-subtle hover:shadow-hover hover:border-agri-green/40 transition-all duration-200 flex flex-col justify-between p-5 space-y-4 group">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <Badge variant="pale" size="sm">
            {service.category}
          </Badge>
          <span className="flex items-center gap-1 text-[11px] font-semibold text-agri-green">
            <MapPin className="w-3 h-3" /> GPS Dispatched
          </span>
        </div>

        <div>
          <h4 className="font-extrabold text-base text-agri-dark group-hover:text-agri-green transition leading-snug">
            {service.name}
          </h4>
          <p className="text-xs text-agri-secondary mt-1 leading-relaxed line-clamp-2">
            {service.description}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-agri-border/60 text-xs">
          <div className="bg-agri-cream/60 p-2 rounded-xl">
            <span className="text-[10px] text-agri-secondary block font-medium">Machine Fleet:</span>
            <span className="font-bold text-agri-dark text-xs truncate block">
              {service.equipmentUsed}
            </span>
          </div>
          <div className="bg-agri-cream/60 p-2 rounded-xl">
            <span className="text-[10px] text-agri-secondary block font-medium">Est. Completion:</span>
            <span className="font-bold text-agri-dark text-xs flex items-center gap-1">
              <Clock className="w-3 h-3 text-agri-secondary" /> {service.timeEstimate}
            </span>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-agri-border/60 flex items-center justify-between gap-3">
        <div>
          <div className="text-[10px] text-agri-secondary font-medium">Standard Rate:</div>
          <div className="text-base font-extrabold text-agri-dark tracking-tight">
            ₹{service.ratePerAcre.toLocaleString('en-IN')}{' '}
            <span className="text-xs font-normal text-agri-secondary">/ acre</span>
          </div>
        </div>

        <Link href={`/services/book?service=${service.id}`}>
          <Button
            size="sm"
            variant="primary"
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            onClick={() => {
              if (onBookNow) onBookNow(service);
            }}
          >
            Book Now
          </Button>
        </Link>
      </div>
    </div>
  );
}
