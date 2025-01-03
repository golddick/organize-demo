'use client'

import { cn } from '@/lib/utils'
import { SettingsIcon, User2Icon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { FaRegClock } from "react-icons/fa6";
import { FaClock } from "react-icons/fa";
import { IoCallOutline , IoCall} from "react-icons/io5";
import { IoVideocamOutline, IoVideocamSharp, IoPersonOutline, IoPersonSharp } from "react-icons/io5";
import { useWorkspaceID } from '@/features/workspaces/hooks/use-workspaceID'
import { usePathname } from 'next/navigation'

const routes = [


    {
        label:' Call',
        href:`/call`,
        icon:IoCallOutline,
        activeIcon: IoCall,
    },
    {
        label: 'Upcoming Call',
        href:'/call/upcoming',
        icon:FaRegClock,
        activeIcon: FaClock,
    },

    {
        label: 'Recorded Calls',
        href:'/call/recordings',
        icon:IoVideocamOutline,
        activeIcon: IoVideocamSharp,
    },
    {
        label: 'Personal Room',
        href:'/call/personal',
        icon:IoPersonOutline,
        activeIcon: IoPersonSharp,
    },
]

const CallNavigation = () => {
    const workspaceID = useWorkspaceID()
    const pathName = usePathname()

  return (
    <ul className='flex flex-col'>
        {routes.map((item) => {
            const fullHref =`/workspaces/${workspaceID}${item.href}`
            const isActive = pathName === fullHref;
            const Icon = isActive ? item.activeIcon : item.icon;

            return(
                <>
                <Link href={fullHref} key={item.href}>
                    <div className={cn( 'flex items-center gap-2.5 p-2.5 rounded-md font-medium hover:text-gold transition text-neutral-500'
                    ,isActive && 'bg-white shadow-sm hover:opacity-100 text-gold' )}>
                        <Icon className=' size-5 text-neutral-500'/>
                        {item.label}
                    </div>
                </Link>
                </>
            )
        })}
    </ul>
  )
}

export default CallNavigation