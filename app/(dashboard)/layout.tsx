import { auth } from "@/auth";
import MobileSidebar from "@/components/mobile-sidebar";
import Sidebar from "@/components/sidebar";
import { Toaster } from "@/components/ui/toaster";
import {getApiLimit} from '@/lib/handleNote';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <div className="h-full relative">
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 bg-background">
        <Sidebar apiLimitCount={getApiLimit(session?.id) as number}/>
      </div>
      
      <div className="absolute top-4 left-4 z-[100] md:hidden">
        <MobileSidebar />
      </div>

      <main className="md:pl-72">
        {children}
      </main>
      <Toaster />
    </div>
  );
}