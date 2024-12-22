'use client'

import { cn } from '@/lib/utils'
import { SettingsIcon, User2Icon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { GoHome, GoHomeFill, GoCheckCircle, GoCheckCircleFill} from 'react-icons/go'
import { useWorkspaceID } from '@/features/workspaces/hooks/use-workspaceID'
import { usePathname } from 'next/navigation'

const routes = [
    {
        label:'Home',
        href:'',
        icon:GoHome,
        activeIcon: GoHomeFill,
    },
    {
        label:'My Tasks',
        href:'/tasks',
        icon:GoCheckCircle,
        activeIcon: GoCheckCircleFill,
    },
    {
        label:'My Setting',
        href:'/settings',
        icon:SettingsIcon,
        activeIcon: SettingsIcon,
    },
    {
        label:'Members',
        href:'/members',
        icon:User2Icon,
        activeIcon: User2Icon,
    },
]

const Navigation = () => {
    const workspaceID = useWorkspaceID()
    const pathName = usePathname()

  return (
    <ul className='flex flex-col'>
        {routes.map((item) => {
            const fullHref =`/workspaces/${workspaceID}${item.href}`
            const isActive = pathName === fullHref;
            const Icon = isActive ? item.activeIcon : item.icon;
            return(
                <Link href={fullHref} key={item.href}>
                    <div className={cn( 'flex items-center gap-2.5 p-2.5 rounded-md font-medium hover:text-gold transition text-neutral-500'
                    ,isActive && 'bg-white shadow-sm hover:opacity-100 text-gold' )}>
                        <Icon className=' size-5 text-neutral-500'/>
                        {item.label}
                    </div>
                </Link>
            )
        })}
    </ul>
  )
}

export default Navigation