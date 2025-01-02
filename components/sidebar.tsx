"use client";
import { cn } from '@/lib/utils';
import { 
  BookText, 
  GraduationCap, 
  Brain, 
  Layout, 
  Settings2, 
  WalletCards as Cards,
  LogOut
} from 'lucide-react';
import { Montserrat } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import { redirect, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { doLogout } from '@/app/actions';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ModeToggle } from './ModeToggle';
import { FreeCounter } from './free-counter';

const montserrat = Montserrat({ weight: "600", subsets: ["latin"] });

const routes = [
  {
    label: "Dashboard",
    icon: Layout,
    href: "/dashboard",
    color: "text-violet-500",
    bgColor: "bg-violet-500/10"
  },
  {
    label: "Lecture to Notes",
    icon: GraduationCap,
    href: "/lecture-to-notes",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10"
  },
  {
    label: "Notes to Quiz",
    icon: BookText,
    href: "/notes-to-quiz",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10"
  },
  {
    label: "Flashcards",
    icon: Cards,
    href: "/notes-to-flashcards",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10"
  },
  {
    label: "AI Assistant",
    icon: Brain,
    href: "/ask-a-question",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10"
  },
  {
    label: "Settings",
    icon: Settings2,
    href: "/settings",
    color: "text-gray-500",
    bgColor: "bg-gray-500/10"
  }
];
interface SidebarProps {
  apiLimitCount: number;
}
const Sidebar = ({apiLimitCount=0}: SidebarProps) => {
  const pathname = usePathname();
  const { data: session } = useSession();
  
  console.log("Session:", session);
  console.log("Pathname:", pathname);
  if (!session && pathname !== "/sign-in") {
    redirect("/sign-in");
  }
  return (
    <div className="relative flex flex-col h-full bg-background border-r space-y-4">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center px-3 py-4 mb-8">
          <div className="relative w-8 h-8 mr-4">
            <Image 
              fill
              src="/logo.png" 
              alt="Logo" 
              className="rounded-lg"
            />
          </div>
          <h1 className={cn("text-xl font-bold", montserrat.className)}>
            Notetaker
          </h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-x-2 text-sm font-medium px-3 py-2.5 rounded-lg transition-all duration-200 group",
                pathname === route.href ? route.bgColor : "hover:bg-accent"
              )}
            >
              <route.icon className={cn("h-5 w-5 transition-colors", route.color)} />
              <span>{route.label}</span>
              {pathname === route.href && (
                <div className="absolute left-0 w-1 h-6 rounded-r-full bg-gradient-to-b from-primary/50 to-primary" />
              )}
            </Link>
          ))}
        </div>
      </div>
      
      <div className="mt-auto border-t">
        <div className="p-4 flex items-center gap-4">
          {session?.user ? (
            <>
              {/* <Avatar>
                <AvatarImage src={session.user || ''} />
                <AvatarFallback>
                  {session.user.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar> */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{session.user.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {session.user.email}
                </p>
              </div>
              <form action={doLogout}>
                <Button variant="ghost" size="icon">
                  <LogOut className="h-5 w-5" />
                </Button>
              </form>
              <ModeToggle />
            </>
          ) : (
            <Button asChild variant="ghost" className="w-full">
              <Link href="/sign-in">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
      <FreeCounter apiLimitCount={apiLimitCount} />
    </div>
  );
};

export default Sidebar;