import { getCurrent } from '@/features/auth/queries'
import { getWorkspaces } from '@/features/workspaces/queries'
import { redirect } from 'next/navigation'
import React from 'react'

const page = async () => {
const user = await getCurrent()

if (user) {
  redirect("/space")
}


  return (
    <div> landing page</div>
  )
}

export default page