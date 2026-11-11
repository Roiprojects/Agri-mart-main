'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Button,
  Input,
  Textarea,
  Select,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Badge,
  Breadcrumbs,
  Tabs,
  Accordion,
  Dialog,
  EmptyState,
  Spinner,
  Skeleton,
  CardSkeleton,
} from '@/components/ui';
import ProductCard from '@/components/shop/ProductCard';
import ServiceCard from '@/components/services/ServiceCard';
import { SEED_PRODUCTS, DEMO_SAMPLE_PRODUCTS } from '@/lib/seed-data';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Phone,
  Search,
  Tractor,
  Wrench,
  ShieldCheck,
  ChevronRight,
  Sprout,
  ArrowRight,
  Star,
  MapPin,
  Calendar,
} from 'lucide-react';

export default function DesignSystemPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [sampleForm, setSampleForm] = useState({
    farmerName: 'Ramesh Kumar Gowda',
    mobile: '98451 90812',
    district: 'Mandya',
    cropType: 'Sugarcane',
    landAcreage: '4.5',
  });

  const sampleProduct = SEED_PRODUCTS[0] || DEMO_SAMPLE_PRODUCTS[0];

  const sampleService = {
    id: 'srv-plough',
    name: 'Tractor Precision Ploughing & Laser Land Leveling',
    category: 'Machinery Service',
    ratePerAcre: 1200,
    minAcres: 2,
    timeEstimate: '1.5 hrs / acre',
    equipmentUsed: '55HP 4WD Tractor with 3-Bottom Reversible Plough',
    description: 'Deep tilling and laser-guided grading to optimize furrow irrigation and prevent water stagnation.',
  };

  const colorTokens = [
    {
      name: 'Brand Green',
      token: 'agri.green',
      hex: '#079447',
      role: 'Primary action buttons, brand focus accents, active states',
      contrast: '4.8:1 on White (WCAG AA)',
      textColor: 'text-white',
      bgClass: 'bg-[#079447]',
    },
    {
      name: 'Brand Green Dark',
      token: 'agri.green-dark',
      hex: '#066832',
      role: 'Button hover states, high-contrast badges & labels',
      contrast: '7.4:1 on White (WCAG AAA)',
      textColor: 'text-white',
      bgClass: 'bg-[#066832]',
    },
    {
      name: 'Dark Green Text',
      token: 'agri.dark',
      hex: '#183526',
      role: 'Primary readable text, headings, and high-legibility body',
      contrast: '12.8:1 on White (WCAG AAA)',
      textColor: 'text-white',
      bgClass: 'bg-[#183526]',
    },
    {
      name: 'Secondary Text',
      token: 'agri.secondary',
      hex: '#596B60',
      role: 'Supporting descriptions, form helper hints, metadata',
      contrast: '5.2:1 on White (WCAG AA)',
      textColor: 'text-white',
      bgClass: 'bg-[#596B60]',
    },
    {
      name: 'Golden Yellow',
      token: 'agri.yellow',
      hex: '#F7C629',
      role: 'Special highlights, ratings, discount badges, AI advisory tags',
      contrast: 'Accent Fill & Dark Text Overlay',
      textColor: 'text-[#183526]',
      bgClass: 'bg-[#F7C629]',
    },
    {
      name: 'Lime Accent',
      token: 'agri.lime',
      hex: '#B4D334',
      role: 'Micro-dots, subtle pill highlights (used sparingly, no full backgrounds)',
      contrast: 'Accent Trim & Subtle Tags',
      textColor: 'text-[#183526]',
      bgClass: 'bg-[#B4D334]',
    },
    {
      name: 'Soft Cream',
      token: 'agri.cream',
      hex: '#FAFAF3',
      role: '75–85% of interface canvas, glare-free agricultural warmth',
      contrast: 'Canvas Base',
      textColor: 'text-[#183526]',
      bgClass: 'bg-[#FAFAF3] border border-agri-border',
    },
    {
      name: 'Pale Green',
      token: 'agri.pale',
      hex: '#EFF7EA',
      role: 'Light badge fills, selected table rows, subtle alerts',
      contrast: 'Subtle Surface',
      textColor: 'text-[#066832]',
      bgClass: 'bg-[#EFF7EA] border border-emerald-200',
    },
    {
      name: 'Subtle Border',
      token: 'agri.border',
      hex: '#E2E8DF',
      role: 'Fine dividing lines, card outlines, input borders',
      contrast: 'Surface Divider',
      textColor: 'text-[#183526]',
      bgClass: 'bg-[#E2E8DF]',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Design System Header */}
      <div className="bg-white rounded-3xl border border-agri-border p-6 sm:p-10 shadow-card space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="brand" size="sm" dot>
                Design System v1.0
              </Badge>
              <Badge variant="golden" size="sm">
                Light-Theme Accessible
              </Badge>
              <Badge variant="pale" size="sm">
                75–85% White/Cream
              </Badge>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-agri-dark tracking-tight">
              AGRI MART MEGA Design System
            </h1>
            <p className="text-sm text-agri-secondary max-w-2xl leading-relaxed">
              A distinctive, elegant light-theme system designed specifically for Indian agriculture. Built with readable typography, authentic brand colors, comfortable contrast for farmers in sunlight, and natural tactile cards.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })}
            >
              Component Library
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => window.scrollTo({ top: 2200, behavior: 'smooth' })}
            >
              Live Previews
            </Button>
          </div>
        </div>

        {/* Authentic Brand Logo Showcase */}
        <div className="pt-6 border-t border-agri-border/60">
          <div className="text-xs font-bold text-agri-secondary uppercase tracking-wider mb-3">
            Brand Logo Artwork (Transparent, Proportional & Preserved)
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* English Logo */}
            <div className="p-6 rounded-2xl bg-agri-cream border border-agri-border flex flex-col justify-between items-center space-y-4 text-center">
              <span className="text-[11px] font-bold text-agri-secondary uppercase tracking-wider">
                English Horizontal Badge Artwork
              </span>
              <div className="relative w-72 sm:w-80 h-20">
                <Image
                  src="/images/agrimart_logo_en_transparent.png"
                  alt="AGRI MART MEGA English Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <p className="text-[11px] text-agri-secondary">
                Wheat ear emblem &bull; Dark green capsule &bull; Golden yellow connection &bull; Subtitle: <em>FARM EQUIPMENT | GREEN CARE | SERVICES</em>
              </p>
            </div>

            {/* English Logo on Dark Canvas */}
            <div className="p-6 rounded-2xl bg-emerald-950 border border-emerald-900 flex flex-col justify-between items-center space-y-4 text-center">
              <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">
                English Horizontal Badge on Dark Canvas
              </span>
              <div className="relative w-72 sm:w-80 h-20">
                <Image
                  src="/images/agrimart_logo_en_transparent.png"
                  alt="AGRI MART MEGA English Logo Dark"
                  fill
                  className="object-contain brightness-110"
                />
              </div>
              <p className="text-[11px] text-emerald-200/80">
                High-contrast presentation &bull; Subtitle: <em>FARM EQUIPMENT | GREEN CARE | SERVICES</em>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 1: Color Tokens & Accessibility */}
      <div className="space-y-6">
        <div className="border-b border-agri-border/60 pb-3">
          <h2 className="text-2xl font-extrabold text-agri-dark tracking-tight">
            1. Calibrated Color Palette & WCAG Contrast Matrix
          </h2>
          <p className="text-xs text-agri-secondary mt-1">
            Carefully tuned against the official logo. 75–85% of surfaces remain soft cream or white to ensure high readability in outdoor conditions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {colorTokens.map((col) => (
            <div
              key={col.token}
              className="bg-white rounded-2xl border border-agri-border p-4 shadow-subtle flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-xl shadow-xs flex-shrink-0 flex items-center justify-center font-mono text-[10px] font-bold ${col.bgClass} ${col.textColor}`}
                >
                  Aa
                </div>
                <div>
                  <h3 className="text-sm font-bold text-agri-dark">{col.name}</h3>
                  <code className="text-[11px] font-mono font-semibold text-agri-green">
                    {col.hex}
                  </code>
                </div>
              </div>

              <div className="text-xs text-agri-secondary leading-relaxed border-t border-agri-border/60 pt-2">
                <div>{col.role}</div>
                <div className="mt-1 font-semibold text-agri-dark text-[11px]">
                  {col.contrast}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Typography Scale */}
      <div className="bg-white rounded-3xl border border-agri-border p-6 sm:p-8 shadow-card space-y-6">
        <div className="border-b border-agri-border/60 pb-3">
          <Badge variant="pale" size="sm" className="mb-1">
            Typography System
          </Badge>
          <h2 className="text-2xl font-extrabold text-agri-dark tracking-tight">
            2. Plus Jakarta Sans & Hierarchy Scale
          </h2>
          <p className="text-xs text-agri-secondary mt-1">
            Optimized via <code className="text-agri-green font-mono">next/font/google</code> for zero layout shifts and clean readability.
          </p>
        </div>

        <div className="space-y-6 divide-y divide-agri-border/50 text-left">
          <div className="pt-2">
            <div className="text-[11px] font-mono text-agri-secondary">Hero Display &bull; 48px / 3rem &bull; font-extrabold</div>
            <div className="text-3xl sm:text-5xl font-extrabold text-agri-dark tracking-tight mt-1">
              Empowering India&apos;s Farmers with Precision Equipment
            </div>
          </div>

          <div className="pt-4">
            <div className="text-[11px] font-mono text-agri-secondary">Heading 1 &bull; 30px / 1.875rem &bull; font-bold</div>
            <div className="text-2xl sm:text-3xl font-bold text-agri-dark tracking-tight mt-1">
              Certified Agri Inputs, Machinery Rentals & Dark Warehouse Delivery
            </div>
          </div>

          <div className="pt-4">
            <div className="text-[11px] font-mono text-agri-secondary">Heading 2 &bull; 24px / 1.5rem &bull; font-bold</div>
            <div className="text-xl sm:text-2xl font-bold text-agri-dark mt-1">
              Smart GPS Drone Spraying & Automated Land Preparation
            </div>
          </div>

          <div className="pt-4">
            <div className="text-[11px] font-mono text-agri-secondary">Heading 3 &bull; 18px / 1.125rem &bull; font-bold</div>
            <div className="text-base sm:text-lg font-bold text-agri-dark mt-1">
              AgriPro 7HP Multi-Speed Heavy Duty Rotary Power Weeder
            </div>
          </div>

          <div className="pt-4">
            <div className="text-[11px] font-mono text-agri-secondary">Body Text &bull; 14px / 0.875rem &bull; leading-relaxed</div>
            <p className="text-sm text-agri-secondary leading-relaxed max-w-3xl mt-1">
              Farmers in Mandya and Dharwad can now book specialized high-clearance tillers and knapsack sprayers directly online. Orders placed before 12:00 PM are routed through our nearest dark fulfillment warehouse within 65 km, ensuring rapid on-farm delivery and technician assistance.
            </p>
          </div>
        </div>
      </div>

      {/* Section 3: Interactive Component Playground */}
      <div className="space-y-6">
        <div className="border-b border-agri-border/60 pb-3">
          <h2 className="text-2xl font-extrabold text-agri-dark tracking-tight">
            3. Reusable UI Components & State Machine
          </h2>
          <p className="text-xs text-agri-secondary mt-1">
            Fully typed primitives with visible keyboard focus rings, hover transitions, disabled states, and error handling.
          </p>
        </div>

        {/* Buttons Playground */}
        <Card variant="white" padding="lg" className="space-y-6">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <div>
              <CardTitle>Button Variants & States</CardTitle>
              <CardDescription>
                Designed with visible focus rings, subtle scale clicks, and clear feedback.
              </CardDescription>
            </div>
            <div className="flex items-center gap-3 text-xs bg-agri-cream p-2 rounded-xl border border-agri-border">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={buttonLoading}
                  onChange={(e) => setButtonLoading(e.target.checked)}
                  className="rounded text-agri-green"
                />
                <span className="font-semibold">Loading State</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={buttonDisabled}
                  onChange={(e) => setButtonDisabled(e.target.checked)}
                  className="rounded text-agri-green"
                />
                <span className="font-semibold">Disabled State</span>
              </label>
            </div>
          </div>

          {/* Variants row */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-agri-secondary uppercase tracking-wider">
              Variants (Primary, Secondary, Golden Accent, Outline, Ghost, Danger)
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="primary"
                isLoading={buttonLoading}
                disabled={buttonDisabled}
                leftIcon={<Tractor className="w-4 h-4" />}
              >
                Primary Green
              </Button>

              <Button
                variant="secondary"
                isLoading={buttonLoading}
                disabled={buttonDisabled}
              >
                Secondary Pale
              </Button>

              <Button
                variant="golden"
                isLoading={buttonLoading}
                disabled={buttonDisabled}
                leftIcon={<Sparkles className="w-4 h-4" />}
              >
                Golden Highlight
              </Button>

              <Button
                variant="outline"
                isLoading={buttonLoading}
                disabled={buttonDisabled}
              >
                Outline Border
              </Button>

              <Button
                variant="ghost"
                isLoading={buttonLoading}
                disabled={buttonDisabled}
              >
                Ghost Text
              </Button>

              <Button
                variant="danger"
                isLoading={buttonLoading}
                disabled={buttonDisabled}
              >
                Danger
              </Button>
            </div>
          </div>

          {/* Sizes row */}
          <div className="space-y-3 pt-4 border-t border-agri-border/60">
            <div className="text-xs font-bold text-agri-secondary uppercase tracking-wider">
              Button Sizes (Small, Medium, Large)
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm" variant="primary">
                Small (32px)
              </Button>
              <Button size="md" variant="primary">
                Medium (40px)
              </Button>
              <Button size="lg" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Large CTA (48px)
              </Button>
            </div>
          </div>
        </Card>

        {/* Inputs, Selectors & Textareas */}
        <Card variant="white" padding="lg" className="space-y-6">
          <div>
            <CardTitle>Form Fields & Inputs</CardTitle>
            <CardDescription>
              Accessible form elements with clear labels, helper text, icon slots, and error states.
            </CardDescription>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Input
              label="Standard Text Input"
              placeholder="e.g. Ramesh Kumar"
              helperText="Enter farmer full name"
            />

            <Input
              label="Input with Icon"
              placeholder="Search spare parts..."
              startIcon={<Search className="w-4 h-4" />}
            />

            <Input
              label="Error State Example"
              defaultValue="Invalid PIN 580"
              error="Please enter a valid 6-digit postal PIN code"
            />

            <Input
              label="Disabled Input"
              defaultValue="Auto-Assigned: WH-HUB-01"
              disabled
              helperText="Determined via Haversine distance"
            />

            <Select
              label="Styled Select Dropdown"
              options={[
                { value: 'all', label: 'Select Farm Machinery' },
                { value: 'weeder', label: '7HP Power Weeder' },
                { value: 'sprayer', label: '16L Battery Sprayer' },
                { value: 'reaper', label: 'Paddy Reaper Harvester' },
              ]}
              helperText="Choose equipment model"
            />

            <Select
              label="Select with Error"
              options={[
                { value: '', label: 'Select District' },
                { value: 'dharwad', label: 'Dharwad' },
                { value: 'belagavi', label: 'Belagavi' },
              ]}
              error="District selection is required"
            />
          </div>

          <div className="pt-2">
            <Textarea
              label="Farm Instructions / Soil Notes (Textarea)"
              placeholder="Provide field access landmarks, soil moisture condition, and preferred delivery time..."
              helperText="Max 250 characters"
              rows={3}
            />
          </div>
        </Card>

        {/* Badges & Indicators */}
        <Card variant="white" padding="lg" className="space-y-4">
          <div>
            <CardTitle>Badges & Status Tags</CardTitle>
            <CardDescription>
              Lightweight labels for product tags, order milestones, and verification status.
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="brand" dot>
              In Stock (Hubballi)
            </Badge>
            <Badge variant="golden" dot>
              Best Seller 2026
            </Badge>
            <Badge variant="lime" dot>
              100% Bio Certified
            </Badge>
            <Badge variant="pale" dot>
              Dispatched via VRL
            </Badge>
            <Badge variant="outline">
              1-Year Warranty Included
            </Badge>
            <Badge variant="neutral">
              Draft Job Card
            </Badge>
            <Badge variant="danger" dot>
              Maintenance Due
            </Badge>
          </div>
        </Card>

        {/* Interactive Tabs, Accordions, Dialogs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tabs Card */}
          <Card variant="white" padding="lg" className="space-y-4">
            <div>
              <CardTitle>Interactive Tabs</CardTitle>
              <CardDescription>Pill & underline tab navigation for multi-category views.</CardDescription>
            </div>

            <Tabs
              variant="pills"
              tabs={[
                {
                  id: 'features',
                  label: 'Key Specifications',
                  count: 4,
                  content: (
                    <div className="p-4 bg-agri-cream rounded-xl text-xs space-y-2 text-agri-secondary">
                      <div className="flex justify-between font-medium">
                        <span>Engine Displacement:</span>
                        <strong className="text-agri-dark">212 cc, 4-Stroke OHV</strong>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>Tilling Width:</span>
                        <strong className="text-agri-dark">36 to 42 inches</strong>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>Warranty & AMC:</span>
                        <strong className="text-agri-dark">1-Year Comprehensive</strong>
                      </div>
                    </div>
                  ),
                },
                {
                  id: 'warranty',
                  label: 'Warranty & AMC',
                  content: (
                    <div className="p-4 bg-agri-pale rounded-xl text-xs text-agri-green-dark space-y-1">
                      <div className="font-bold flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-agri-green" /> Free 2x Periodic Dealer Servicing
                      </div>
                      <p className="text-[11px] leading-relaxed">
                        Covers engine tuning, carburetor cleaning, and oil replacement across our 1,500+ dealer service centers.
                      </p>
                    </div>
                  ),
                },
                {
                  id: 'delivery',
                  label: 'Dark Warehouse Delivery',
                  content: (
                    <div className="p-4 bg-slate-50 rounded-xl text-xs text-agri-secondary">
                      <strong className="text-agri-dark">Dispatched within 24 Hours:</strong> Shipped from Tarihal KIADB Hubballi or Auto Nagar Belagavi with real-time GPS tracking.
                    </div>
                  ),
                },
              ]}
            />
          </Card>

          {/* Accordion Card */}
          <Card variant="white" padding="lg" className="space-y-4">
            <div>
              <CardTitle>Accessible Accordion</CardTitle>
              <CardDescription>Collapsible panels with smooth chevron rotation.</CardDescription>
            </div>

            <Accordion
              defaultOpenId="faq-1"
              items={[
                {
                  id: 'faq-1',
                  title: 'How does Dark Warehouse auto-assignment work?',
                  subtitle: 'Automated Haversine distance engine',
                  icon: <Tractor className="w-4 h-4" />,
                  content:
                    'When a farmer enters their PIN code or drops a GPS pin, our system calculates the great-circle distance to all 4 regional dark warehouses (Hubballi, Belagavi, Dharwad, Haveri). If within 65 km, the order is routed directly to the nearest hub for rapid packing.',
                },
                {
                  id: 'faq-2',
                  title: 'What does the 9-stage workshop repair process entail?',
                  subtitle: 'Automotive standard for farm machinery',
                  icon: <Wrench className="w-4 h-4" />,
                  content:
                    'Every machine brought to our dealer centers receives a digital job card covering Product Received, Inspection Checklist, Estimate, Customer Approval, Repair, Quality Check, Cleaning, Billing, and Handover.',
                },
                {
                  id: 'faq-3',
                  title: 'Can I rent farm equipment with a driver / operator?',
                  subtitle: 'Flexible self-drive or full service',
                  icon: <Sprout className="w-4 h-4" />,
                  content:
                    'Yes. You can either hire machinery on daily/weekly dry rent (you provide the fuel) or book "Rent a Service" where verified local operators bring the tractor/drone to your land.',
                },
              ]}
            />
          </Card>
        </div>

        {/* Dialog, Breadcrumbs, Empty States & Skeletons */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Dialog Trigger Card */}
          <Card variant="white" padding="md" className="space-y-4">
            <CardTitle>Accessible Modal Dialog</CardTitle>
            <CardDescription>Overlay, ESC key detection, and accessible actions.</CardDescription>
            <Button
              variant="primary"
              size="md"
              className="w-full"
              onClick={() => setIsDialogOpen(true)}
            >
              Open Example Dialog
            </Button>

            <Dialog
              isOpen={isDialogOpen}
              onClose={() => setIsDialogOpen(false)}
              title="Confirm Machinery Rental Booking"
              description="Review your 3-day reservation before proceeding to security deposit payment."
              footer={
                <>
                  <Button variant="outline" size="sm" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      alert('Rental Booking Confirmed!');
                      setIsDialogOpen(false);
                    }}
                  >
                    Confirm Booking
                  </Button>
                </>
              }
            >
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-agri-cream rounded-xl border border-agri-border space-y-1">
                  <div className="font-bold text-agri-dark">AgriPro 7HP Power Weeder</div>
                  <div className="text-agri-secondary">Rental Period: 17 Sep 2026 to 20 Sep 2026 (3 Days)</div>
                </div>
                <div className="flex justify-between border-b border-agri-border/60 pb-2">
                  <span>Daily Rate (₹650 &times; 3):</span>
                  <strong className="text-agri-dark">₹1,950</strong>
                </div>
                <div className="flex justify-between border-b border-agri-border/60 pb-2">
                  <span>Refundable Security Deposit:</span>
                  <strong className="text-agri-green">₹3,000</strong>
                </div>
                <div className="flex justify-between font-bold text-sm text-agri-dark pt-1">
                  <span>Total Due Today:</span>
                  <span>₹4,950</span>
                </div>
              </div>
            </Dialog>
          </Card>

          {/* Empty State Card */}
          <Card variant="white" padding="md" className="space-y-2">
            <CardTitle>Empty State Component</CardTitle>
            <EmptyState
              title="No Pending Service Requests"
              description="Your farm schedule is clear. Book drone spraying or tractor ploughing anytime."
              actionLabel="Book a Service"
              onAction={() => alert('Redirecting to /services/book...')}
            />
          </Card>

          {/* Loading Skeletons Card */}
          <Card variant="white" padding="md" className="space-y-3">
            <CardTitle>Loading States & Skeletons</CardTitle>
            <div className="flex items-center gap-3">
              <Spinner size="sm" />
              <Spinner size="md" />
              <Spinner size="lg" />
              <span className="text-xs text-agri-secondary font-medium ml-2">Active Spinners</span>
            </div>
            <div className="pt-2">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-full mb-1.5" />
              <Skeleton className="h-3 w-5/6 mb-4" />
              <Skeleton className="h-8 w-28 rounded-xl" />
            </div>
          </Card>
        </div>
      </div>

      {/* Section 4: Live Working Previews (Header, Hero, Product Card, Service Card, Form) */}
      <div className="space-y-6 pt-6 border-t border-agri-border/60">
        <div className="border-b border-agri-border/60 pb-3">
          <Badge variant="brand" size="sm" className="mb-1">
            Live Preview Blocks
          </Badge>
          <h2 className="text-2xl font-extrabold text-agri-dark tracking-tight">
            4. Real-World Component Assemblies
          </h2>
          <p className="text-xs text-agri-secondary mt-1">
            Complete Header, Hero, Product Card, Service Card, and Section 26 Form assemblies implementing the light-theme design system.
          </p>
        </div>

        {/* Live Hero Preview Block */}
        <div className="bg-gradient-to-b from-white via-agri-cream to-agri-pale/30 rounded-3xl border border-agri-border p-6 sm:p-12 shadow-card overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-agri-border text-xs text-agri-green font-bold shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-agri-yellow-dark" />
                <span>Next-Generation Digital Agriculture Platform</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold text-agri-dark tracking-tight leading-tight">
                Modern Farm Machinery, Bio-Care & Smart GPS Services
              </h1>

              <p className="text-sm sm:text-base text-agri-secondary leading-relaxed max-w-xl">
                Order genuine certified seeds and power weeders, book precision tractor ploughing and drone spraying to your exact field GPS, and receive AI agronomy advice — all in one platform.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link href="/shop">
                  <Button size="lg" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Explore Storefront
                  </Button>
                </Link>
                <Link href="/services/book">
                  <Button size="lg" variant="golden">
                    Book GPS Farm Service
                  </Button>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-3 pt-6 border-t border-agri-border/60 text-xs">
                <div>
                  <div className="font-extrabold text-agri-dark text-base">1,500+</div>
                  <div className="text-[11px] text-agri-secondary font-medium">Dealer Service Hubs</div>
                </div>
                <div>
                  <div className="font-extrabold text-agri-dark text-base">65 km</div>
                  <div className="text-[11px] text-agri-secondary font-medium">Dark Hub Radius</div>
                </div>
                <div>
                  <div className="font-extrabold text-agri-dark text-base">100%</div>
                  <div className="text-[11px] text-agri-secondary font-medium">Genuine Equipment</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden border border-agri-border shadow-hover">
                <Image
                  src="https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80"
                  alt="Modern Agricultural Machinery"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-xs p-3 rounded-xl border border-agri-border flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-agri-dark">AgriPro 7HP Power Weeder</div>
                    <div className="text-[10px] text-agri-secondary">In Stock at Hubballi Hub</div>
                  </div>
                  <Badge variant="brand" size="sm">₹36,500</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Product Card & Service Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-agri-dark">Product Card Assembly</h3>
              <Badge variant="pale" size="sm">E-Commerce Ready</Badge>
            </div>
            <ProductCard product={sampleProduct} />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-agri-dark">Smart Farm Service Card Assembly</h3>
              <Badge variant="golden" size="sm">GPS Fleet Dispatch</Badge>
            </div>
            <ServiceCard service={sampleService} />
          </div>
        </div>

        {/* Live Working Form Preview (Section 26 Adaptation) */}
        <Card variant="white" padding="lg" className="space-y-6">
          <div className="border-b border-agri-border/60 pb-3">
            <Badge variant="brand" size="sm" className="mb-1">
              Farmer Onboarding
            </Badge>
            <CardTitle>Sample Farmer Data Form (Section 26)</CardTitle>
            <CardDescription>
              Clear labels, spacious layouts, and accessible touch targets for farmers using mobile or desktop.
            </CardDescription>
          </div>

          {formSubmitted ? (
            <div className="p-6 bg-agri-pale rounded-2xl border border-emerald-200 text-center space-y-3 animate-fadeIn">
              <div className="w-12 h-12 mx-auto rounded-full bg-agri-green text-white flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-agri-dark">
                Farmer Profile Data Successfully Saved!
              </h4>
              <p className="text-xs text-agri-secondary max-w-md mx-auto">
                Farmer {sampleForm.farmerName} from {sampleForm.district} registered with {sampleForm.landAcreage} acres of {sampleForm.cropType}.
              </p>
              <Button size="sm" variant="outline" onClick={() => setFormSubmitted(false)}>
                Reset Form
              </Button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setFormSubmitted(true);
              }}
              className="space-y-6 text-left"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <Input
                  label="Farmer Full Name"
                  value={sampleForm.farmerName}
                  onChange={(e) => setSampleForm({ ...sampleForm, farmerName: e.target.value })}
                  required
                />

                <Input
                  label="Mobile Number"
                  value={sampleForm.mobile}
                  onChange={(e) => setSampleForm({ ...sampleForm, mobile: e.target.value })}
                  startIcon={<Phone className="w-4 h-4" />}
                  required
                />

                <Select
                  label="District"
                  value={sampleForm.district}
                  onChange={(e) => setSampleForm({ ...sampleForm, district: e.target.value })}
                  options={[
                    { value: 'Mandya', label: 'Mandya' },
                    { value: 'Dharwad', label: 'Dharwad' },
                    { value: 'Belagavi', label: 'Belagavi' },
                    { value: 'Haveri', label: 'Haveri' },
                  ]}
                  required
                />

                <Input
                  label="Primary Crop Name"
                  value={sampleForm.cropType}
                  onChange={(e) => setSampleForm({ ...sampleForm, cropType: e.target.value })}
                  required
                />

                <Input
                  label="Total Cultivated Land (Acres)"
                  value={sampleForm.landAcreage}
                  onChange={(e) => setSampleForm({ ...sampleForm, landAcreage: e.target.value })}
                  required
                />

                <Select
                  label="Irrigation Method"
                  defaultValue="drip"
                  options={[
                    { value: 'drip', label: 'Drip Irrigation' },
                    { value: 'sprinkler', label: 'Micro Sprinkler' },
                    { value: 'canal', label: 'Canal Furrow' },
                    { value: 'rainfed', label: 'Rainfed (Dryland)' },
                  ]}
                />
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t border-agri-border/60">
                <Button variant="outline" size="md" type="reset" onClick={() => setFormSubmitted(false)}>
                  Clear
                </Button>
                <Button variant="primary" size="md" type="submit">
                  Save Farmer Profile
                </Button>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}

