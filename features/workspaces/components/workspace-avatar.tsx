import React from 'react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface WorkspaceAvatarProps {
  image?: string;
  name: string;
  className?: string;
}

export const WorkspaceAvatar = ({image, className, name}:WorkspaceAvatarProps) => {
  if (image) {
    return(
      <div className={
        cn('size-10 relative rounded-md overflow-hidden', className,  )
      }>
        <Image
        src={image} 
        alt={name}
        fill className='object-cover'
        />
      </div>
    )
  }
  return (
    <Avatar className={
      cn('size-10  rounded-md overflow-hidden', className,  )
    }>
      <AvatarFallback className='text-white bg-gold font-semibold text-lg uppercase rounded-md '>
        {name[0]}
      </AvatarFallback>
    </Avatar>
  )
}
