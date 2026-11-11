import Link from "next/link";
import { ChevronRight } from "lucide-react";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbSchema } from "@/lib/seo-schema";

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export default function Breadcrumbs({
  items,
  variant = "dark",
  includeSchema = true,
  className = "",
}: {
  items: BreadcrumbItem[];
  variant?: "dark" | "light";
  includeSchema?: boolean;
  className?: string;
}) {
  if (!items || items.length === 0) return null;

  const normalizedItems =
    items[0].path === "/" ? items : [{ name: "Home", path: "/" }, ...items];

  const isDark = variant === "dark";

  return (
    <>
      {includeSchema && (
        <JsonLd data={buildBreadcrumbSchema(normalizedItems)} />
      )}
      <nav
        aria-label="Breadcrumb"
        className={`flex flex-wrap items-center gap-1.5 text-xs font-medium ${
          isDark ? "text-slate-300" : "text-slate-muted"
        } ${className}`}
      >
        {normalizedItems.map((item, idx) => {
          const isLast = idx === normalizedItems.length - 1;
          return (
            <span key={`${item.path}-${idx}`} className="inline-flex items-center gap-1.5">
              {idx > 0 && (
                <ChevronRight
                  className={`w-3.5 h-3.5 shrink-0 ${
                    isDark ? "text-slate-400" : "text-slate-400"
                  }`}
                />
              )}
              {isLast ? (
                <span
                  aria-current="page"
                  className={
                    isDark
                      ? "text-white font-semibold"
                      : "text-navy-800 font-semibold"
                  }
                >
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.path}
                  className={`transition-colors ${
                    isDark ? "hover:text-white" : "hover:text-solar-green"
                  }`}
                >
                  {item.name}
                </Link>
              )}
            </span>
          );
        })}
      </nav>
    </>
  );
}
