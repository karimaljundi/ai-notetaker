import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import Sidebar from './sidebar';

export default function MobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger asChild>  
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      
      <SheetTitle> </SheetTitle>
      <SheetContent side="left" className="p-0 w-72">
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
}