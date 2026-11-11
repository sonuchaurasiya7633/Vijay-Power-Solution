import type { Metadata } from "next";
import { getRouteMetadata } from "@/lib/seo-server";

export async function generateMetadata(): Promise<Metadata> {
  return getRouteMetadata({
    routeKey: "get-quote",
    path: "/get-quote",
    fallbackTitle:
      "Get Free Solar Rooftop Quotation & Technical Consultation | VPS Solar",
    fallbackDescription:
      "Request a customized solar EPC proposal and bill-of-materials consultation for residential, commercial, or industrial rooftop projects anywhere in India.",
  });
}

export default function GetQuoteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
