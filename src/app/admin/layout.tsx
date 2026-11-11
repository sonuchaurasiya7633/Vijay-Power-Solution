import type { Metadata } from "next";
import { getSession } from "@/lib/auth/session";
import AdminShell from "@/components/admin/AdminShell";

export const metadata: Metadata = {
  title: "Admin Command Center | VIJOY POWER SOLUTION",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // If not authenticated or viewing unauthenticated routes, render cleanly without dashboard chrome
  if (!session) {
    return (
      <div className="min-h-screen bg-slate-bg font-sans">
        {children}
      </div>
    );
  }

  return (
    <AdminShell
      userRole={session.role}
      userName={session.name}
      userEmail={session.email}
    >
      {children}
    </AdminShell>
  );
}
