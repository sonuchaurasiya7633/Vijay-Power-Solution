import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Clock, User, ArrowLeft, ArrowRight } from "lucide-react";
import connectDB from "@/lib/db/connection";
import Blog from "@/models/Blog";
import { formatDateIST } from "@/lib/utils/formatters";
import LeadCaptureForm from "@/components/forms/LeadCaptureForm";
import { getCleanPublicImage } from "@/lib/image-fallback";
import SolarCardPlaceholder from "@/components/public/SolarCardPlaceholder";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  await connectDB();
  const blog = await Blog.findOne({ slug: params.slug }).lean();
  if (!blog) return { title: "Article Not Found" };

  return {
    title: `${blog.title} | VIJOY POWER SOLUTION Blog`,
    description: blog.excerpt,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  await connectDB();
  const blog = await Blog.findOne({ slug: params.slug }).lean();

  let article: any = blog;
  if (!article) {
    if (
      params.slug === "pm-surya-ghar-subsidy-guide-pan-india" ||
      params.slug === "pm-surya-ghar-subsidy-guide-bihar-jharkhand-up"
    ) {
      article = {
        title: "Complete PM Surya Ghar Subsidy Guide — Pan India Coverage",
        excerpt: "Everything residential consumers need to know about the ₹78,000 central rooftop subsidy, DISCOM portal registration, and net meter commissioning across India.",
        content: `The PM Surya Ghar: Muft Bijli Yojana launched by the Government of India provides a transformative opportunity for homeowners across India to install rooftop solar with direct financial assistance.

### Key Subsidy Slabs
1. **1 kW Solar System:** ₹30,000 central assistance.
2. **2 kW Solar System:** ₹60,000 central assistance.
3. **3 kW and Above:** ₹78,000 maximum financial cap.

### Eligible Power Boards (Pan-India Coverage)
- **North & Central India:** UPPCL (UP), BSES/TPDDL (Delhi), JVVNL/AVVNL/JdVVNL (Rajasthan), UHBVN/DHBVN (Haryana), MPMKVVCL (MP).
- **West & South India:** MSEDCL (Maharashtra), UGVCL/MGVCL/PGVCL/DGVCL (Gujarat), BESCOM/MESCOM (Karnataka), TSSPDCL (Telangana), TANGEDCO (Tamil Nadu).
- **East & North-East India:** SBPDCL & NBPDCL (Bihar), JBVNL (Jharkhand), WBSEDCL (West Bengal), TPCODL (Odisha), APDCL (Assam).

### How to Apply Successfully
1. Ensure your electricity connection bill name matches your Aadhaar and bank account passbook.
2. Register on the official national portal (pmsuryaghar.gov.in).
3. Coordinate with an authorized solar contractor like VIJOY POWER SOLUTION for technical inspection and ALMM-compliant equipment supply.
4. After commissioning and bidirectional meter seal fixing, the subsidy is directly disbursed into your verified bank account via DBT.`,
        category: "Government Schemes",
        authorName: "Er. Vijoy Kumar",
        authorRole: "Principal Solar Engineer",
        coverImage: "",
        publishedAt: new Date(),
        estimatedReadTimeMin: 5,
      };
    } else {
      notFound();
    }
  }

  if (!article) {
    notFound();
  }

  return (
    <div className="bg-white">
      {/* Breadcrumb Bar */}
      <div className="bg-slate-bg border-b border-slate-border py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs text-slate-muted flex items-center gap-2">
          <Link href="/" className="hover:text-navy-800">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-navy-800">Blog</Link>
          <span>/</span>
          <span className="text-navy-800 font-bold truncate">{article.title}</span>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-solar-green bg-solar-green-light px-3 py-1 rounded-full">
            {article.category}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-navy-800 leading-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-muted pt-2 border-y border-slate-100 py-3">
            <span className="flex items-center gap-1.5 text-navy-800 font-bold">
              <User className="w-3.5 h-3.5 text-solar-green" />
              <span>{article.authorName} ({article.authorRole || "Solar Advisory"})</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{article.publishedAt ? formatDateIST(article.publishedAt) : "Recently Published"}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{article.estimatedReadTimeMin || 5} min read</span>
            </span>
          </div>
        </div>

        <div className="relative h-96 sm:h-[420px] w-full rounded-3xl overflow-hidden shadow-sm border border-slate-border bg-navy-900">
          {getCleanPublicImage(article.coverImage) ? (
            <Image
              src={getCleanPublicImage(article.coverImage)}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <SolarCardPlaceholder title={article.title} subtitle={article.category} />
          )}
        </div>

        {/* Article Body */}
        <div className="prose prose-slate max-w-none text-navy-800 text-sm sm:text-base leading-relaxed space-y-4">
          <p className="text-base sm:text-lg font-medium text-slate-700 leading-relaxed italic border-l-4 border-solar-green pl-4">
            {article.excerpt}
          </p>
          <div className="whitespace-pre-line text-slate-muted">
            {article.content}
          </div>
        </div>

        {/* Lead Capture Banner inside Blog */}
        <div className="mt-12 bg-navy-50 rounded-3xl p-6 sm:p-8 border border-navy-100 space-y-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-solar-green">
              Take Action on This Article
            </span>
            <h3 className="text-xl font-bold font-display text-navy-800">
              Ready to Plan Your Rooftop Solar Installation?
            </h3>
            <p className="text-xs text-slate-muted">
              Connect with our certified solar engineers for your rooftop consultation across India.
            </p>
          </div>
          <LeadCaptureForm compact buttonText="Schedule Free Solar Consultation" />
        </div>
      </article>
    </div>
  );
}
