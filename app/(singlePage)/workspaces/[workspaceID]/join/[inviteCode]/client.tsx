'use client'

import { PageError } from "@/components/_component/PageError"
import { PageLoader } from "@/components/_component/PageLoader"
import { useGetWorkspaceInfo } from "@/features/workspaces/api/use-get-workspaceInfo"
import { JoinWorkspaceForm } from "@/features/workspaces/components/join-workspace-form"
import { useWorkspaceID } from "@/features/workspaces/hooks/use-workspaceID"


export const JoinWorkspaceClient = () => {
    const workspaceID = useWorkspaceID()
    const {data, isLoading } = useGetWorkspaceInfo({workspaceID})

    if (isLoading) {
        return <PageLoader/>
    }

    if (!data) {
        return <PageError message='Workspace not found'/>
    }

  return (
    <div className='w-full lg:max-w-xl'> 
    <JoinWorkspaceForm  initialValues={data}/>
  </div>
  )
}
