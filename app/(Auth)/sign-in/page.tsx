// 'use client'

import { getCurrent } from '@/features/auth/queries'
import SignInCard from '@/features/auth/components/sign-in-card'
import { redirect } from 'next/navigation'
import React from 'react'

const page = async () => {

  const user = await getCurrent()

  console.log('user', user)

  if (user) redirect('/')

  return (
    <SignInCard/>
  )
}

export default page