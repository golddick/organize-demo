import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { DottedSeparator } from '../dotted-separator'
import Navigation from './Navigation'
import { WorkspaceSwitcher } from './workspace-switcher'
import { Projects } from './Projects'
import { usePathname } from 'next/navigation'
import { IoCall, IoCallOutline } from 'react-icons/io5'
import { cn } from '@/lib/utils'
import CallNavigation from './CallNavigation'

const Sidebar = () => {
  const pathName = usePathname()
   
  const meetingHref =`/meetings`
  const isMeetingActive = pathName === meetingHref;
  const MeetingIcon = isMeetingActive ? IoCallOutline : IoCall;

    const isActive = pathName === meetingHref;
  return (
    <aside className=' h-full bg-neutral-100 p-4 w-full'>
        <Link href='/'>
            <Image src='/logo/gnt.png' alt='logo' width={165} height={50}/>
        </Link>
        <DottedSeparator className='my-4' color='gold'/>
        <WorkspaceSwitcher/>
        <DottedSeparator className='my-4' color='gold'/>
        <Navigation/>
        <DottedSeparator className='my-4' color='gold'/>
        <CallNavigation/>
        <DottedSeparator className='my-4' color='gold'/>
        <Projects/>
    </aside>
  )
}

export default Sidebar