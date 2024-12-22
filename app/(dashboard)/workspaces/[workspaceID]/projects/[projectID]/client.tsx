'use client'

import Analytics from '@/components/_component/analytics/Analytics'
import { PageError } from '@/components/_component/PageError'
import { PageLoader } from '@/components/_component/PageLoader'
import { Button } from '@/components/ui/button'
import { useGetAProject } from '@/features/projects/api/use-get-project'
import { UseGetProjectAnalytics } from '@/features/projects/api/use-get-project-analytics'
import { ProjectAvatar } from '@/features/projects/component/project-avatar'
import { useProjectID } from '@/features/projects/hooks/use-projectID'
import { TaskViewSwitcher } from '@/features/tasks/component/task-view-switcher'
import { PencilIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export const ProjectIDClient = () => {
    const projectID = useProjectID()
    const { data, isLoading: isLoadingProject} = useGetAProject({projectID})
    const { data: analytics, isLoading: isLoadingAnalytics} = UseGetProjectAnalytics({projectID})

    const isLoading = isLoadingAnalytics || isLoadingProject

    if (isLoading) {
        return <PageLoader/>
    }

    if (!data ) {
        return <PageError message='Project not found'/>
    }

    const  initialValues = data
  return (
    <div className='flex flex-col gap-y-4'>
      <div className='flex items-center justify-between'>
          <div className=' flex items-center gap-x-2'>
            <ProjectAvatar image={initialValues.imageUrl} name={initialValues.name} className=' size-8'/>
            <p className=' text-lg font-semibold'>{initialValues.name}</p>
          </div>
          <div>
            <Button variant='secondary' size='sm' asChild>
              <Link href={`/workspaces/${initialValues.workspaceID}/projects/${initialValues.$id}/settings`}>
              <PencilIcon className=' size-4 mr-2'/>
              Edit Project
              </Link>
            </Button>
          </div>
      </div>
      {
        analytics && (
          <Analytics data={analytics} />
        )
      }
      <TaskViewSwitcher hideProjectFilter/>
    </div>
  )
}
