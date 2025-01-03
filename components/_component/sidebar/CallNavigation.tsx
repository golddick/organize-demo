'use client'

import { cn } from '@/lib/utils'
import { SettingsIcon, User2Icon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { GoHome, GoHomeFill, GoCheckCircle, GoCheckCircleFill} from 'react-icons/go'
import { IoCallOutline , IoCall} from "react-icons/io5";
import { useWorkspaceID } from '@/features/workspaces/hooks/use-workspaceID'
import { usePathname } from 'next/navigation'

const routes = [


    {
        label:'ORGANIZE Call',
        href:`/call`,
        icon:IoCallOutline,
        activeIcon: IoCall,
    },
    {
        label: 'Upcoming',
        href:'/call/upcoming',
        icon:IoCallOutline,
        activeIcon: IoCall,
    },

    {
        label: 'Recordings',
        href:'/call/recordings',
        icon:IoCallOutline,
        activeIcon: IoCall,
    },
    {
        label: 'Personal Room',
        href:'/call/personal',
        icon:IoCallOutline,
        activeIcon: IoCall,
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