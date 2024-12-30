"use client";
import { cn } from '@/lib/utils';
import { BookAIcon, BookCheck, Brain, LayoutDashboard, MicrochipIcon, Settings, StickyNote } from 'lucide-react';
import { Montserrat } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import { redirect, usePathname } from 'next/navigation';
import React from 'react';
import { useSession } from 'next-auth/react';
import { doLogout } from '@/app/actions';

const montserrat = Montserrat({
  weight: "600",
  subsets: ["latin"]
});

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-sky-500"
  },
  {
    label: "Lecture to Notes",
    icon: MicrochipIcon,
    href: "/lecture-to-notes",
    color: "text-rose-500"
  },
  {
    label: "Notes to quiz",
    icon: BookCheck,
    href: "/notes-to-quiz",
    color: "text-green-500"
  },
  {
    label: "Notes to Flashcards",
    icon: StickyNote,
    href: "/notes-to-flashcards",
    color: "text-yellow-500"
  },
  {
    label: "Ask a Question",
    icon: Brain,
    href: "/ask-a-question",
    color: "text-indigo-500"
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings"
  }
];

const Sidebar = () => {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white">
      <div className='px-3 py-2 flex-1'>
        <Link href={'/dashboard'} className='flex items-center pl-3 mb-14'>
          <Image src="/logo.png" alt="Logo" width={40} height={40} />
          <span className={cn("ml-3 text-2xl font-bold", montserrat.className)}>Notetaker</span>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link key={route.href} href={route.href} className={cn("flex items-center px-3 py-2 text-sm font-medium rounded-md", {
              "bg-gray-900 text-white": pathname === route.href,
              "text-gray-400 hover:bg-gray-700 hover:text-white": pathname !== route.href,
            })}>
              <route.icon className={cn("mr-3 h-6 w-6", route.color)} />
              <span>{route.label}</span>
            </Link>
          ))}
        </div>
      </div>
      <div className="px-3 py-2">
        {session ? (
          <div className="flex items-center space-x-4">
        {session.user?.image && (
          <Image src={session.user.image} alt="User Avatar" width={32} height={32} className="rounded-full" />
        )}
        <span>Welcome, {session.user?.name}</span>
        <form action={doLogout}>
          <button className="text-sm text-gray-400 hover:text-white">Sign Out</button>
        </form>
          </div>
        ) : (
          <form action={redirect('/sign-in')}>
        <button type="submit" name="action" value="google" className="text-sm text-gray-400 hover:text-white">Sign In</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Sidebar;