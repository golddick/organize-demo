import { getCurrent } from '@/features/auth/queries'
import { redirect } from 'next/navigation'
import React from 'react'
import { TaskIDClient } from './client'

const page =async () => {

    const user = await getCurrent()

    if (!user) {
      redirect("/sign-in")
    }

  return  <TaskIDClient/>
}

export default page