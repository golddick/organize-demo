import React from 'react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface MemberAvatarProps {
  fallbackClassName: string;
  name: string;
  className?: string;
}

export const MemberAvatar = ({fallbackClassName, className, name}:MemberAvatarProps) => {
  return (
    <Avatar className={
      cn('size-5 transition border border-gold  rounded-full overflow-hidden', className,  )
    }>
      <AvatarFallback className={cn('text-white bg-gold font-semibold flex items-center justify-center uppercase rounded-md', fallbackClassName)}>
        {name.charAt(0)}
      </AvatarFallback>
    </Avatar>
  )
}
