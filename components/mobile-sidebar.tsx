import React from 'react'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import Sidebar from '@/components/sidebar'

export default function MobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
         <Button className="md:hidden" variant="ghost" size="icon"> 
         <Menu />

        </Button> 
      </SheetTrigger>
      <SheetContent side={"left"} className='p-0'>
        <SheetTitle>Menu</SheetTitle>
        <Sidebar />
      </SheetContent>
    </Sheet>
  )
}
