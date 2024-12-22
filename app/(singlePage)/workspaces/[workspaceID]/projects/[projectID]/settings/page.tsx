import { getCurrent } from '@/features/auth/queries'
import { redirect } from 'next/navigation'
import React from 'react'
import { ProjectIDSettingsClient } from './client'



const page = async () => {
    const user = await getCurrent()


    if (!user) {
      redirect("/sign-in")
    }
  return <ProjectIDSettingsClient/>
}

export default page