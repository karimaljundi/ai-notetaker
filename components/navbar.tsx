"use client"
import { ModeToggle } from './ModeToggle';

export default function Navbar() {
  return (
    <div className="hidden md:flex fixed top-0 w-full z-[90] justify-end items-center py-2 px-4 h-16">
      <div className="flex items-center gap-x-3">
        {/* <ModeToggle /> */}
      </div>
    </div>
  );
}