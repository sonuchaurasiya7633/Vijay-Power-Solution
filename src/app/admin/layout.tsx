import { getSession } from "@/lib/auth/session";
import AdminShell from "@/components/admin/AdminShell";

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
