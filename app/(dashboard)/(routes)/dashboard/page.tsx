"use client";
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { ArrowRight, BookCheck, Brain, MicrochipIcon, Settings, StickyNote } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function page() {
  const router = useRouter();
  const tools = [
    
    {
      label: "Lecture to Notes",
      icon: MicrochipIcon,
      href: "/lecture-to-notes",
      color: "text-rose-500",
      bgColor: "bg-rose-500/10"
    }
    ,
    {
      label: "Notes to quiz",
      icon: BookCheck,
      href: "/notes-to-quiz",
      color: "text-green-500",
      bgColor: "bg-green-500/10"
    },
    {
      label: "Notes to Flashcards",
      icon: StickyNote,
      href: "/notes-to-flashcards",
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10"
    },
    {
      label: "Ask a Question",
      icon: Brain,
      href: "/ask-a-question",
      color: "text-indigo-500",
      bgColor: "bg-indigo-500/10"
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/settings"
    }
  ]
  return (
    <div>
      <div className='mb-8 space-y-4'>
        <h2 className='text 2xl: md:text-4xl font-bold text-center'>
          Welcome to Focusify
        </h2>
        <p className='text-muted-foreground font-light text-sm md:text-lg text-center'>
          Chat with the smartest AI
        </p>
      </div>
      <div className='px-4 md:px-20 lg:px-32 space-y-4'>
        {tools.map((tool) => (
          <Card 
          onClick={() => router.push(tool.href)}
          key={tool.href}
          className='p-4 border-black/5 flex items-center justify-between hover:shadow-md transition cursor-pointer'>
            <div className='flex items-center gap-x-4'>
              <div className={cn("p-2 w-fit rounded-md", tool.bgColor)}>
                <tool.icon className={cn('w-8 h-8', tool.color)}/>
            </div>
            <div className='font-semibold'>
              {tool.label}
            </div>
            </div>
            <ArrowRight className='w-5 h-5'/>
          </Card>
        ))}
      </div>
    </div>
  )
}
