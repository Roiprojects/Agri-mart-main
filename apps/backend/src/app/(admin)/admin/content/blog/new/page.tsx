'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
import { FormSection } from '@/components/admin/FormSection';
import { ImageEditorField } from '@/components/admin/ImageEditorField';

export default function NewBlogPostPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    author: 'AgriMart Senior Agronomist',
    coverImageUrl: '',
    tags: 'Advisory, Kharif, Precision Farming',
    isPublished: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError('Title is required');
      return;
    }
    if (!form.slug.trim()) {
      setError('Slug is required');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      const res = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        }),
      });
      const json = await res.json();
      if (json.success) {
        router.push('/admin/content/blog');
      } else {
        setError(json.message || 'Error publishing post');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/content/blog"
            className="p-2 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition shadow-xs"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Write Blog Article</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Draft comprehensive farm guides and agronomic advisory for Karnataka growers.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/content/blog"
            className="px-4 py-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition disabled:opacity-50 shadow-xs"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Publishing...' : 'Publish Article'}
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      <FormSection title="Article Metadata" description="Title, author credit, and permalink slug">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Article Title *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => {
                const title = e.target.value;
                const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                setForm({ ...form, title, slug: form.slug ? form.slug : slug });
              }}
              placeholder="e.g. Maximizing Cotton Yields with Micro-Nutrient Fertigation"
              className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Permalink Slug *</label>
              <input
                type="text"
                required
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Author / Agronomist</label>
              <input
                type="text"
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
                className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Cover Image (Local Device or Google / Website URL)
            </label>
            <ImageEditorField
              value={form.coverImageUrl}
              onChange={(url) => setForm({ ...form, coverImageUrl: url })}
              previewHeight="h-36"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Topic Tags (Comma-separated)</label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
          </div>

          <label className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer w-fit hover:bg-slate-100 transition">
            <input
              type="checkbox"
              checked={form.isPublished}
              onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
              className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-xs font-semibold text-slate-800">Publish Immediately on Storefront</span>
          </label>
        </div>
      </FormSection>

      <FormSection title="Article Content" description="Short excerpt teaser and full markdown advisory body">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Short Excerpt (Cards & SEO)</label>
            <textarea
              rows={2}
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              placeholder="A brief 1-2 sentence teaser summary shown in blog card grids..."
              className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 resize-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Full Article Content</label>
            <textarea
              rows={12}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="Write the full advisory text, section headings, spraying schedules, and crop dosage guidelines..."
              className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 resize-y font-sans"
            />
          </div>
        </div>
      </FormSection>
    </form>
  );
}
