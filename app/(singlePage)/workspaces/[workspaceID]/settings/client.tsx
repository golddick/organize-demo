'use client'

import { PageError } from "@/components/_component/PageError"
import { PageLoader } from "@/components/_component/PageLoader"
import { useGetAWorkspace } from "@/features/workspaces/api/use-get-workspace"
import { UpdateWorkspaceForm } from "@/features/workspaces/components/update-workspace-form"
import { useWorkspaceID } from "@/features/workspaces/hooks/use-workspaceID"


export const WorkspaceIDClientSettings = () => {
    const workspaceID = useWorkspaceID()
    const {data, isLoading } = useGetAWorkspace({workspaceID})

    if (isLoading) {
        return <PageLoader/>
    }

    if (!data) {
        return <PageError message='Project not found'/>
    }

  return (
    <div className=' w-full lg:max-w-xl'>
    <UpdateWorkspaceForm initialValues={data}/>
    </div>
  )
}
