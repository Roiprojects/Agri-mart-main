'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, Plus, Edit2, Trash2, ExternalLink, RefreshCw } from 'lucide-react';
import { DataTable, Column } from '@/components/admin/DataTable';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  tags?: string[];
  isPublished: boolean;
  coverImageUrl?: string;
  publishedAt?: string;
  createdAt: string;
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/blog');
      const json = await res.json();
      if (json.success) {
        setPosts(json.data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/admin/blog?id=${deleteTarget.id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setDeleteTarget(null);
        fetchPosts();
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const columns: Column<BlogPost>[] = [
    {
      key: 'title',
      header: 'Article',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.coverImageUrl ? (
            <img
              src={row.coverImageUrl}
              alt={row.title}
              className="h-10 w-14 rounded-md object-cover bg-slate-50 border border-slate-200 shrink-0"
            />
          ) : (
            <div className="h-10 w-14 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
              <FileText className="h-5 w-5" />
            </div>
          )}
          <div className="min-w-0">
            <Link
              href={`/admin/content/blog/${row.id}/edit`}
              className="font-semibold text-slate-900 hover:text-emerald-700 truncate block max-w-sm transition"
            >
              {row.title}
            </Link>
            <div className="text-xs text-slate-500 font-mono mt-0.5">/{row.slug}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'author',
      header: 'Author',
      sortable: true,
      render: (row) => <span className="text-xs text-slate-700 font-medium">{row.author || 'AgriMart Agronomy'}</span>,
    },
    {
      key: 'isPublished',
      header: 'Status',
      sortable: true,
      render: (row) => <StatusBadge status={row.isPublished ? 'PUBLISHED' : 'DRAFT'} size="sm" />,
    },
    {
      key: 'tags',
      header: 'Tags',
      render: (row) => (
        <div className="flex flex-wrap gap-1 max-w-xs">
          {(row.tags || []).slice(0, 3).map((t) => (
            <span
              key={t}
              className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] text-slate-600 border border-slate-200 font-mono"
            >
              #{t}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: 'createdAt',
      header: 'Created',
      sortable: true,
      render: (row) => (
        <span className="text-xs text-slate-500">
          {row.createdAt ? new Date(row.createdAt).toLocaleDateString('en-IN') : '—'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <FileText className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Blog Articles</h1>
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              {posts.length}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Publish educational farmer advisory, Kharif/Rabi guides, and precision tech articles.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchPosts}
            className="p-2 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 shadow-xs transition"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link
            href="/admin/content/blog/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition"
          >
            <Plus className="h-4 w-4" /> New Article
          </Link>
        </div>
      </div>

      <div className="rounded-xl bg-white border border-slate-200 shadow-xs p-4">
        <DataTable
          data={posts}
          columns={columns}
          rowKey={(r) => r.id}
          searchPlaceholder="Search articles..."
          searchKeys={['title', 'slug', 'author']}
          actions={(row) => (
            <div className="flex items-center gap-1.5">
              <Link
                href={`http://localhost:3000/blog/${row.slug}`}
                target="_blank"
                className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                title="View on site"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
              <Link
                href={`/admin/content/blog/${row.id}/edit`}
                className="p-1.5 rounded-md text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition"
                title="Edit article"
              >
                <Edit2 className="h-3.5 w-3.5" />
              </Link>
              <button
                onClick={() => setDeleteTarget(row)}
                className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                title="Delete article"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        />
      </div>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Article"
        message={`Are you sure you want to delete "${deleteTarget?.title}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
