import { auth } from "@/auth";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { getApiLimit } from "@/lib/handleNote";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authen = await auth();
  const apiLimitCount = await getApiLimit(authen?.id);
  return (
    <div className="h-full relative">
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 bg-gray-900">
        <Sidebar apiLimitCount={apiLimitCount}/>
      </div>
      <main className="md:pl-72">
        {children}
      </main>
      <Toaster />
    </div>
  );
}