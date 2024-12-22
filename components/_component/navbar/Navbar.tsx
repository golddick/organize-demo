'use client '

import { UserButton } from '@/features/auth/components/user-button'
import React from 'react'
import { MobileSideBar } from '../sidebar/mobile-sidebar'
import { usePathname } from 'next/navigation'

const pathNameMap = {
  'tasks': {
    title: 'My Tasks',
    description: 'View all of your task here '
  },
  'projects': {
    title: 'My Projects',
    description: 'View all of your projects here '
  },

}

const defaultMap={
  title: 'Home',
  description: 'Track all of your projects and tasks here'
}

const Navbar = () => {
  const pathname = usePathname()
  const pathNameParts = pathname.split('/') 
  const pathNameKey = pathNameParts[3] as keyof typeof pathNameMap;

  const {title, description } = pathNameMap[pathNameKey] || defaultMap
  return (
    <nav className=' pt-4 px-6 flex items-center justify-between '>
        <div className=' flex-col hidden lg:flex'>
            <h1 className=' text-2xl font-semibold'>{title}</h1>
            <p className=' text-muted-foreground text-[15px]'>{description} with <b className='text-gold'>ORGANIZE</b> </p>
        </div>
        <MobileSideBar/>
        <UserButton/>
    </nav>
  )
}

export default Navbar