import React from 'react'
import PersonalRoomClient from './_component/client'
import { getCurrent } from '@/features/auth/queries'
import { toast } from 'sonner'
import { redirect } from 'next/navigation'

const page =  async() => {
  const user = await getCurrent()
  if (!user) {
    redirect("/sign-up")
  }
  return (
    <div>
  <PersonalRoomClient user={user}/>

</div>
  )
}

export default page