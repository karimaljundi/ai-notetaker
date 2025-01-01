"use client"
import MobileSidebar from './mobile-sidebar';
import { ModeToggle } from './ModeToggle';

export default function Navbar() {
  return (
    <div className="fixed top-0 w-full z-50 flex justify-between items-center py-2 px-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <MobileSidebar />
      <div className="flex items-center gap-x-3">
        <ModeToggle />
      </div>
    </div>
  );
}