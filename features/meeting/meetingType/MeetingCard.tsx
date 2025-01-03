'use client'

import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'
import React from 'react'

interface MeetingCardProps{
    Icon?:  any;
    header:string
    info: string 
    className: string
    onClick: () => void
}


const MeetingCard = ({className,info,Icon,header, onClick}:MeetingCardProps) => {

  return (
    <div className={cn('px-4 py-6 flex flex-col justify-between w-full xl:max-w-[250px] min-h-[160px] gap-5 rounded-lg cursor-pointer', className)} onClick={onClick}>
      <div className='flex items-center justify-center glassmorphism size-12 rounded-xl  text-white'>
        {Icon}
      </div>
      <div>
        <h1 className='text-white text-2xl font-bold'>{header}</h1>
        <p className='text-l font-normal text-muted-foreground text-white'>{info}</p>
      </div>
    </div>
  )
}

export default MeetingCard