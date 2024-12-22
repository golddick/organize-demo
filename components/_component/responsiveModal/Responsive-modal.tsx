import {useMedia} from 'react-use'

import {
    Dialog,
    DialogContent,
  } from "@/components/ui/dialog"
  
  import {
    Drawer,
    DrawerContent,
  } from "@/components/ui/drawer"
  

  interface ResponsiveModalProps{
    children: React.ReactNode,
    open:boolean,
    onOpenChange: (open: boolean) => void;
  }

  export const ResponsiveModal =({children,onOpenChange,open}:ResponsiveModalProps) => {
    const isDesktop = useMedia("(min-width:1024px)", true)

    if (isDesktop) {
        return(
            <Dialog  open={open} onOpenChange={onOpenChange}>
                <DialogContent className='w-full sm:max-w-lg p-0 border-none overflow-y-auto hidden-scrollbar  max-h-85'>
                    {children}
                </DialogContent>
            </Dialog>
        )
    }

    return(
        <Drawer   open={open} onOpenChange={onOpenChange}>
            <DrawerContent>
                <div className=' overflow-y-auto hidden-scrollbar max-h-85 '>
                    {children}
                </div>
            </DrawerContent>
        </Drawer>
    )
  }

  