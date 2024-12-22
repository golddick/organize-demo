'use client'

import { PageError } from "@/components/_component/PageError"
import { PageLoader } from "@/components/_component/PageLoader"
import { useGetAProject } from "@/features/projects/api/use-get-project"
import { UpdateProjectForm } from "@/features/projects/component/update-project-form"
import { useProjectID } from "@/features/projects/hooks/use-projectID"

export const ProjectIDSettingsClient = () => {
    const projectID = useProjectID()
    const {data , isLoading} = useGetAProject({projectID})

    if (isLoading) {
        return <PageLoader/>
    }

    if (!data) {
        return <PageError message='Project not found'/>
    }

  return (
    <div className='w-full lg:max-w-xl'> 
    <UpdateProjectForm initialValues={data} />
    </div>
  )
}
