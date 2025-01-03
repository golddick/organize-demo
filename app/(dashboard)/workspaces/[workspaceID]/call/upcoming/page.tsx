

import { getCurrent } from '@/features/auth/queries'
import CallList from '@/features/meeting/callList/CallList'
import { redirect } from 'next/navigation'
import React from 'react'

const page = async() => {
  const user = await getCurrent()


  if (!user) {
    redirect("/sign-up")
  }

  const id = user.$id
  return (
    <section className='flex flex-col size-full gap-10'>
      <h1 className='text-3xl font-bold'>
      Upcoming Call
      </h1> 
       <CallList type='upcoming' id={id}/>
    </section>
  )
}

export default page