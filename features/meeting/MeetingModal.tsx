import React, { ReactNode } from 'react'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
  

interface MeetingModalProps{
    isOpen: boolean
    children?: ReactNode
    onClose:  () => void
    title: string
    className?:string
    buttonText?:string
    handleClick?:  () => void
    buttonIcon?: any
    image?: string
}

export const MeetingModal = ({isOpen,onClose,title,className,buttonText,handleClick, buttonIcon, image, children}:MeetingModalProps) => {

  
  return (
<Dialog open={isOpen} onOpenChange={onClose}  >
  <DialogContent className='flex w-full max-w-[500px] flex-col gap-6 border-none bg-muted-foreground px-6 py-9 text-white'>
        <div className='flex flex-col gap-6   justify-center'>
            {
                image && (
                  <div className='flex flex-col gap-6 justify-center m-auto'>
                      <Image
                    src={image}
                    alt='IMG'
                    width={70}
                    height={70}
                    />
                  </div>
                )
            }
            <DialogHeader>
            <DialogTitle className={cn('text-2xl font-bold text-white leading-[40px]', className)}>{title}</DialogTitle>
            </DialogHeader>
            {children}
            <Button className='bg-black text-white focus-visible:ring-0 flex items-center' onClick={handleClick}>
                {buttonIcon && (
                    <div>
                        {buttonIcon}
                    </div>
                )}
                {buttonText || 'Schedule Meeting'}
            </Button>
        </div>
  </DialogContent>
</Dialog>

  )
}
 