import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import FloatingWhatsApp from "@/components/public/FloatingWhatsApp";
import { getPublicShellSettings } from "@/lib/cms-server";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const shell = await getPublicShellSettings();
  const general = shell.general || {};
  const hf = shell.headerFooter || {};

  const phone = general.phone || hf?.footer?.phone || hf?.topBar?.phone || "+91 94310 00000";
  const whatsapp = general.whatsapp || hf?.topBar?.whatsapp || "919431000000";

  return (
    <>
      <Navbar initialCms={Object.keys(hf).length > 0 ? hf : undefined} />
      <main className="flex-1 overflow-x-clip">{children}</main>
      <Footer initialShell={shell} />
      <FloatingWhatsApp phone={phone} whatsapp={whatsapp} skipClientFetch />
    </>
  );
}
