import React from 'react'
import { Task } from '../types'
import { Button } from '@/components/ui/button'
import { PencilIcon } from 'lucide-react'
import { DottedSeparator } from '@/components/_component/dotted-separator'
import { OverviewProperty } from './overview-property'
import { MemberAvatar } from '@/features/members/components/member-avatar'
import { TaskDate } from './TaskDate'
import { Badge } from '@/components/ui/badge'
import { snakeCaseToTitleCase } from '@/lib/utils'
import { useUpdateTaskModal } from '../hooks/use-update-task-modal'

interface TaskOverviewProps {
    task: Task
}

export const TaskOverview = ({task}:TaskOverviewProps) => {
    const { open} = useUpdateTaskModal()
  return (
    <div className='flex flex-col gap-y-4 col-span-1'>
        <div className='bg-muted rounded-lg p-4'>
          <div className='flex items-center justify-between'>
            <p className='text-lg font-semibold'>Overview</p>
            <Button size={'sm'} variant={'secondary'} onClick={() => open(task.$id)}>
                <PencilIcon className='size-4 mr-2'/>
                <span>Edit</span>
            </Button>
          </div>
          <DottedSeparator className='my-4' color='gold'/>
          <div className=' flex flex-col gap-2'>
            <OverviewProperty label='Assignee' >
                <MemberAvatar
                name={task.assignee.name}
                className='size-6'
                />
                <p className='text-sm font-medium capitalize'>{task.assignee.name}</p>
            </OverviewProperty>
            <OverviewProperty label='Due Date' >
                <TaskDate
                className='text-sm font-medium'
                value={task.dueDate}
                />
            </OverviewProperty>
            <OverviewProperty label='Status' >
                <Badge variant={task.status}>
                    {snakeCaseToTitleCase(task.status)}
                </Badge>
            </OverviewProperty>
            <OverviewProperty label='Description' >
                <p className='text-sm font-medium'>{task.description}</p>
            </OverviewProperty>
          </div>
        </div>
    </div>
  )
}
