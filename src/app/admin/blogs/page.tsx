"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FileText, Plus, CheckCircle2, Eye } from "lucide-react";
import { formatDateIST } from "@/lib/utils/formatters";

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/blogs?adminMode=true")
      .then((r) => r.json())
      .then((d) => setBlogs(d.blogs || []));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-border shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-solar-green">Knowledge Hub CMS</span>
          <h1 className="text-2xl font-bold font-display text-navy-800">
            Educational Solar Articles
          </h1>
          <p className="text-xs text-slate-muted mt-0.5">
            Manage educational articles, SEO metadata, and published guides.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-bg text-slate-muted uppercase font-bold text-[10px] tracking-wider border-b border-slate-border">
              <tr>
                <th className="p-4">Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Author</th>
                <th className="p-4">Status</th>
                <th className="p-4">Published</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {blogs.map((b) => (
                <tr key={b._id} className="hover:bg-slate-bg/50 transition-colors">
                  <td className="p-4 font-bold text-navy-800 max-w-sm truncate">{b.title}</td>
                  <td className="p-4 text-slate-muted">{b.category}</td>
                  <td className="p-4 text-slate-muted">{b.authorName}</td>
                  <td className="p-4">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700 uppercase">
                      {b.isPublished ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="p-4 text-slate-muted">{b.publishedAt ? formatDateIST(b.publishedAt) : "-"}</td>
                  <td className="p-4">
                    <Link
                      href={`/blog/${b.slug}`}
                      target="_blank"
                      className="px-2.5 py-1 rounded-lg bg-navy-50 text-navy-800 hover:bg-navy-800 hover:text-white font-bold transition-colors inline-block"
                    >
                      Preview
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
