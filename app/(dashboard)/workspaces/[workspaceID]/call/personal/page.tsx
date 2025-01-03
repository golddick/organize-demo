import React from 'react'
import PersonalRoomClient from './_component/client'
import { getCurrent } from '@/features/auth/queries'
import { toast } from 'sonner'

const page =  async() => {
  const user = await getCurrent()
  if (!user) {
    toast.error('no user')
    return null
  }
  return (
    <div>
  <PersonalRoomClient user={user}/>

</div>
  )
}

export default page