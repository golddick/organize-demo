'use client'

import { PageError } from '@/components/_component/PageError'
import { PageLoader } from '@/components/_component/PageLoader'
import { DottedSeparator } from '@/components/_component/dotted-separator'
import { useGetTask } from '@/features/tasks/api/use-get-task'
import { useTaskID } from '@/features/tasks/api/use-taskID'
import { TaskBreadcrumbs } from '@/features/tasks/component/Task-breadcrumbs'
import { TaskOverview } from '@/features/tasks/component/Task-overview'
import React from 'react'

export const TaskIDClient = () => {
    const taskID = useTaskID()
    const { data, isLoading} = useGetTask({taskID})

    if (isLoading) {
        return <PageLoader/>
    }

    if (!data) {
        return <PageError message='Task not found'/>
    }

  return (
    <div className='flex flex-col'>
        <TaskBreadcrumbs
        project={data.project}
        task={data}
        />
        <DottedSeparator color='gold' className='my-6'/>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
            <TaskOverview
            task={data}
            />
        </div>
    </div>
  )
}
