import React from 'react'
import { getCurrent } from "@/features/auth/queries";
import { getWorkspaces } from "@/features/workspaces/queries";
import { redirect } from "next/navigation";


const page = async () => {
const user = await getCurrent()
const workspaces = await getWorkspaces()
const workspaceID = workspaces?.documents[0]?.$id


  if (!user) {
    redirect("/sign-in")
  }

if (workspaces?.total === 0) {
  redirect("/workspaces/create")
}else{
    redirect(`/workspaces/${workspaceID}`)

}


  return (
    <div>page</div>
  )
}

export default page