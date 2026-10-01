import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { SITE_CONFIG } from '@/lib/config';
import { SEED_BLOG_POSTS } from '@/lib/seed-data';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Badge } from '@/components/ui/Badge';
import { Calendar, Clock, ArrowRight, User, BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Agronomy Guides & Farm Mechanization Blog | AGRI MART MEGA',
  description:
    'Scientific crop guidance, power weeder maintenance tips, agricultural drone spraying guides, and soil organic carbon management for Karnataka farmers.',
  alternates: {
    canonical: `https://www.${SITE_CONFIG.domain}/blog`,
  },
  openGraph: {
    title: 'Agronomy Guides & Mechanization Insights | AGRI MART MEGA',
    description:
      'Explore research-backed farming techniques, machinery maintenance, and crop package of practices.',
    url: `https://www.${SITE_CONFIG.domain}/blog`,
    siteName: SITE_CONFIG.name,
    locale: 'en_IN',
    type: 'website',
  },
};

export default function BlogPage() {
  const breadcrumbItems = [{ label: 'Home', href: '/' }, { label: 'Blog & Insights' }];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs items={breadcrumbItems} />

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-brand-darkGreen via-slate-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-10 shadow-lg">
        <Badge variant="warning" size="sm">
          Kisan Knowledge Hub
        </Badge>
        <h1 className="text-2xl sm:text-4xl font-extrabold mt-2 tracking-tight">
          Agronomy & Machinery Insights
        </h1>
        <p className="text-xs sm:text-sm text-emerald-100 mt-2 max-w-2xl leading-relaxed">
          Scientific farming advice, crop stage schedules, equipment maintenance protocols, and
          soil diagnostics curated by UAS Dharwad agronomists and GreenShield engineers.
        </p>
      </div>

      {/* Blog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {SEED_BLOG_POSTS.map((blog) => (
          <article
            key={blog.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
          >
            <div className="relative aspect-video w-full bg-slate-100">
              <Image src={blog.image} alt={blog.title} fill className="object-cover" />
              <div className="absolute top-3 left-3">
                <Badge variant="success" size="sm">
                  {blog.category}
                </Badge>
              </div>
            </div>

            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="text-[11px] text-slate-500 flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> {blog.date}
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {blog.readingTime}
                  </span>
                </div>

                <h2 className="font-extrabold text-base text-slate-900 leading-snug">
                  <Link href={`/blog/${blog.slug}`} className="hover:text-brand-green">
                    {blog.title}
                  </Link>
                </h2>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {blog.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="text-[11px] text-slate-500 flex items-center gap-1.5 truncate max-w-[65%]">
                  <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{blog.author}</span>
                </div>

                <Link
                  href={`/blog/${blog.slug}`}
                  className="text-xs font-bold text-brand-green hover:text-brand-greenDark flex items-center gap-1 shrink-0"
                >
                  Read Guide <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
