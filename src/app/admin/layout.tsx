import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { headers } from "next/headers";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  const headersList = headers();
  const pathname = headersList.get("x-pathname") || "";

  // If viewing login page, render children directly without dashboard chrome
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-bg font-sans">
      {session && (
        <AdminSidebar userRole={session.role} userName={session.name} />
      )}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {session && (
          <AdminHeader userRole={session.role} userName={session.name} />
        )}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
