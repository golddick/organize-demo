'use client'

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { MenuIcon } from "lucide-react"
import Sidebar from "./Sidebar"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

export const MobileSideBar = () => {

    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        setIsOpen(false)
    },[pathname])

    return(
        <Sheet modal={false} open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button variant='secondary' className=" lg:hidden" >
                    <MenuIcon className=" size-5"/>
                </Button>
            </SheetTrigger>
            <SheetContent side='left' className="p-0 lg:hidden">
                <Sidebar/>
            </SheetContent>
        </Sheet>
    )
}