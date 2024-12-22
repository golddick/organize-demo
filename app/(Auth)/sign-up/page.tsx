
import { getCurrent } from '@/features/auth/queries'
import SignUpCard from '@/features/auth/components/sign-up-card'
import { redirect } from 'next/navigation'
import React from 'react'

const page = async () => {
  const user = await getCurrent()

  console.log('user', user)

  if (user) redirect('/')
  return (
   <SignUpCard/>
  )
}

export default page