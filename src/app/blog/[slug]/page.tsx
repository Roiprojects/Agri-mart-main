import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { SITE_CONFIG } from '@/lib/config';
import { SEED_BLOG_POSTS } from '@/lib/seed-data';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Badge } from '@/components/ui/Badge';
import { Calendar, Clock, User, ArrowLeft, ArrowRight, Share2, Sparkles, BookOpen } from 'lucide-react';

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return SEED_BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const post = SEED_BLOG_POSTS.find((p) => p.slug === resolvedParams.slug);

  if (!post) {
    return { title: 'Article Not Found | AGRI MART MEGA' };
  }

  const title = `${post.title} | AGRI MART MEGA`;
  const description = post.excerpt;
  const canonical = `https://www.${SITE_CONFIG.domain}/blog/${post.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_CONFIG.name,
      images: [{ url: post.image, width: 800, height: 500, alt: post.title }],
      locale: 'en_IN',
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [post.image],
    },
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const resolvedParams = await params;
  const post = SEED_BLOG_POSTS.find((p) => p.slug === resolvedParams.slug);

  if (!post) {
    notFound();
  }

  const canonicalUrl = `https://www.${SITE_CONFIG.domain}/blog/${post.slug}`;

  // Structured Data (Schema.org Article)
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: [post.image],
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: post.author,
      jobTitle: post.authorRole,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      logo: {
        '@type': 'ImageObject',
        url: `https://www.${SITE_CONFIG.domain}/images/agrimart_logo_en_transparent.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
  };

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: post.title },
  ];

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `https://www.${SITE_CONFIG.domain}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `https://www.${SITE_CONFIG.domain}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: canonicalUrl,
      },
    ],
  };

  const otherArticles = SEED_BLOG_POSTS.filter((p) => p.id !== post.id);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <Breadcrumbs items={breadcrumbItems} />

        {/* Article Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="success" size="sm">
              {post.category}
            </Badge>
            <span className="text-xs text-slate-400">&bull;</span>
            <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {post.readingTime}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-xs text-slate-500 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-brand-lightGreen text-brand-green flex items-center justify-center font-bold">
                <User className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-slate-800">{post.author}</div>
                <div className="text-[11px] text-slate-500">{post.authorRole}</div>
              </div>
            </div>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{post.date}</span>
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm">
          <Image src={post.image} alt={post.title} fill className="object-cover" priority />
        </div>

        {/* Article Body */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6 text-slate-700 leading-relaxed text-sm sm:text-base">
          <div className="p-4 bg-brand-cream rounded-2xl border border-amber-200 text-xs sm:text-sm font-medium text-slate-800 italic">
            &ldquo;{post.excerpt}&rdquo;
          </div>

          <div className="whitespace-pre-line space-y-4">
            {post.content}
          </div>

          {/* Tags */}
          <div className="pt-6 border-t border-slate-100 space-y-2">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Related Topics:</div>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-slate-100 text-slate-700 text-xs px-3 py-1 rounded-lg font-medium border border-slate-200"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* AI Advisory Callout */}
        <div className="bg-brand-lightGreen rounded-3xl p-6 sm:p-8 border border-brand-green/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-green" /> Need Instant Field Diagnosis?
            </div>
            <p className="text-xs sm:text-sm text-slate-600">
              Ask our Gemini-powered AI Crop Advisor any question in Kannada or English.
            </p>
          </div>
          <Link
            href="/ai-advisory"
            className="bg-brand-green hover:bg-brand-greenDark text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl shadow transition shrink-0"
          >
            Open AI Advisor &rarr;
          </Link>
        </div>

        {/* Other Articles */}
        {otherArticles.length > 0 && (
          <div className="space-y-4 pt-6">
            <h3 className="text-xl font-extrabold text-slate-900">Recommended Agricultural Guides</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {otherArticles.map((art) => (
                <Link
                  key={art.id}
                  href={`/blog/${art.slug}`}
                  className="group bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-2"
                >
                  <div>
                    <span className="text-[10px] font-bold text-brand-green uppercase">
                      {art.category}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 group-hover:text-brand-green transition mt-1 line-clamp-2">
                      {art.title}
                    </h4>
                  </div>
                  <div className="text-xs text-brand-green font-semibold flex items-center gap-1">
                    Read Article <ArrowRight className="w-3 h-3" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
